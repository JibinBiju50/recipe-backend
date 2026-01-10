//import the necessary modules
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe')
const cors = require('cors');
const {upload} = require('./config/cloudinary');
const app = express() //create an instance for express
const port = process.env.PORT; //create a port number

app.use(express.json()); //middleware to parse JSON bodies
app.use(cors());

//connect to the database MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("mongoose connected successfully..")})
.catch((err)=>{console.log("error occured during connection..", err)})

app.get('/', (req, res) => {
  res.json('Backend is running..')
})

//Route to create a recipe POST
app.post('/api/v1/recipes', async (req, res) =>{
  try{
    //create and save a new recipe used by the data send in req.body
    const savedRecipe = await Recipe.create(req.body);

    //send back the saved data
    res.status(201).json(savedRecipe)
  } catch (err){
    res.status(500).json({error:err.message})
  }
})

//Route to get all recipes
app.get('/api/v1/recipes', async (req, res) =>{
  try{
    //check if user sent a title query parameter
    const { title, page = 1, limit = 8 } = req.query;
    
    //convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    //create a filter object
    let filter = {}
    
    //if title exists, update the filter to search it
    if(title){
      filter.title = {$regex: title, $options: 'i'}
    }
    
    //Get total count for pagination metadata
    const totalRecipes = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(totalRecipes / limitNum);
    
    //Pass the filter to mongoose with pagination
    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    //send the list back to client with pagination info
    res.json({
      recipes,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecipes,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    })

  } catch (err){
    res.status(500).json({error:err.message})
  }
})

app.get('/api/v1/recipes/:id', async (req, res) =>{
  try{
    
    //get the id of the recipe from url
    const {id} = req.params;

    //Use the model to find the requested recipe 
    const recipe = await Recipe.findById(id);

    if(!recipe){
      return res.status(404).json({error:"Recipe not found"})
    }

    //send the recipe details back to the frontend
    res.json(recipe)
    

  } catch (err){
    res.status(500).json({error:err.message})
  }
})


//Route to delete a recipe
app.delete('/api/v1/recipes/:id', async (req, res) =>{
  try{
    //get the id from the url
    const recipeId = req.params.id;

    //find and delete the recipe in the database
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);

    //handle the case if the recipe is not present in the database
    if(!deleteRecipe){
      return res.status(404).json({error:"Recipe not found"})
    }

    //send success message
    res.status(201).json({message:"Recipe deleted succesfully", deleteRecipe})
    console.log("Recipe deleted")

  } catch (err){
    res.status(500).json({error: err.message})
    console.log("failed to delete the recipe")
  }
})

//Route to update recipe
app.put('/api/v1/recipes/:id', async (req, res)=>{
  try{
    //get id by destructuring object req
    const { id } = req.params;

    //find the recipe and update it
    const updateRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true })

    if(!updateRecipe){
      return res.status(404).json({error: "Recipe not found"})
    }

    res.json(updateRecipe)
  } catch(err){
    res.status(500).json({error: err.message})
    console.log("failed to update the recipe")
  }
})

//Route to upload image
app.post('/api/v1/upload', upload.single('image'), (req, res) =>{
  try{
    //check if file is uploaded
    if(!req.file){
      return res.status(400).json({error: "No file uploaded"})
    }
    //get the image from the request
    const imageUrl = req.file.path;
    console.log("image uploaded successfully", imageUrl)
    //send the image url back to the frontend
    res.json({imageUrl})
    
  } catch(err){
    res.status(500).json({error: err.message})
  }
})

//Error handler for multer errors
app.use((err, req, res, next)=>{
  if(err){
    console.error("Multer/cloudinary error:", err);
    return res.status(500).json({error: err.message})
  }
  next();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})