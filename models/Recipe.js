const mongoose = require('mongoose');

// 1. The Schema (The Blueprint)
// This tells Mongoose: "Every recipe MUST have a title and ingredients."
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // This field is mandatory
  },
  ingredients: {
    type: [String], // An array of text strings
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number, // In minutes
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date
  }
});

// 2. The Model
// This creates the tool we will use to interact with the "recipes" collection in MongoDB
const Recipe = mongoose.model('Recipe', recipeSchema);

// 3. Export it so we can use it in server.js
module.exports = Recipe;