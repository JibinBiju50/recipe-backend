const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

//connect to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//configure multer to use cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipe-images',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{width: 800, height: 600, crop: 'limit'}]
    }
});

const upload = multer({ storage: storage });
module.exports = { cloudinary, upload };