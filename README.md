# Spoonfull – Recipe Management Backend

A RESTful backend API built with Node.js and Express to manage recipes, providing full CRUD functionality and designed for future scalability.

---

## 🌐 API Base URL

Production:
🔗 https://recipe-backend-xdi5.onrender.com/api/v1/recipes

Local:
🔗 http://localhost:5000/api/v1

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary (Image hosting)
- Mutler (File uploads)
---

## ✨ Features

- Create, read, update, and delete recipes
- Title-based filtering for recipe list
- Image upload endpoint backed by Cloudinary
- CORS-enabled API for frontend integration
---

## 📌 API Endpoints

Base path: `/api/v1`

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | `/recipes`     | Get all recipes       |
| GET    | `/recipes/:id` | Get recipe by ID      |
| POST   | `/recipes`     | Create recipe         |
| PUT    | `/recipes/:id` | Update recipe         |
| DELETE | `/recipes/:id` | Delete recipe         |
| POST   | `/upload`      | Upload image          |

---


## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
A reference file .env.example is included in the repository.

---

## 🚀 Local Setup

### Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB (local or cloud)

### Steps

```bash
git clone https://github.com/JibinBiju50/recipe-backend.git
cd recipe-backend
npm install
npm run dev
```

## 🔮 Future Enhancements

- User authentication using JWT
- Role-based access control (Admin/User)
- Pagination and filtering
- API rate limiting
- Request logging and monitoring

## 👤 Author

Jibin Biju  
GitHub: https://github.com/JibinBiju50
