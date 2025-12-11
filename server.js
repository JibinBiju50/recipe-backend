//import the necessary modules
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe')
const cors = require('cors');

const app = express() //create an instance for express
const port = process.env.PORT; //create a port number

app.use(express.json()); //middleware to parse JSON bodies
app.use(cors());

//connect to the database MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("mongoose connected successfully..")})
.catch((err)=>{console.log("error occured during connection..", err)})

app.get('/', (req, res) => {
  res.send('Backend is running..')
})

//Route to create a recipe POST
app.post('/api/recipes', async (req, res) =>{
  try{
    //create a new recipe used by the data send in req.body
    const newRecipe = new Recipe(req.body);

    //save it to the database 
    const savedRecipe = await newRecipe.save();

    //send back the saved data
    res.status(201).json(savedRecipe)
  } catch (err){
    res.status(500).json({error:err.message})
  }
})

//Route to get all recipes
app.get('/api/recipes', async (req, res) =>{
  try{
    //check if user sent a title query parameter
    const { title } = req.query;
    
    //create a filter object
    let filter = {}
    
    //if title exists, update the filter to search it
    if(title){
      filter.title = {$regex: title, $options: 'i'}
    }
    //Pass the filter to mongoose
    const recipes = await Recipe.find(filter);

    //send the list back to client
    res.json(recipes)

  } catch (err){
    res.status(500).json({error:err.message})
  }
})

app.get('/api/recipes/:id', async (req, res) =>{
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
app.delete('/api/recipes/:id', async (req, res) =>{
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
app.put('/api/recipes/:id', async (req, res)=>{
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})