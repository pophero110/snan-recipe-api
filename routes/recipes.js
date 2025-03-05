const express = require('express');
const router = express.Router();
const {connectDB} = require('../db/mongo')
const {ObjectId} = require("mongodb");

async function getRecipeCollection() {
    const db = await connectDB();
    // await collection.createIndex({name: 1}, {unique: true})
    return db.collection("recipes");
}

let getAllRecipes = async function (req, res, next) {
    try {
        const collection = await getRecipeCollection();
        const recipes = await collection.find({}).toArray();
        res.json(recipes).status(200);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

router.get('/', getAllRecipes);

let getRecipe = async function (req, res, next) {
    try {
        const recipeId = req.params.id
        const collection = await getRecipeCollection();
        const recipe = await collection.findOne({_id: new ObjectId(recipeId)});
        res.json(recipe).status(200);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

router.get('/:id', getRecipe);


async function createRecipe(req, res, next) {
    try {
        const newRecipe = req.body
        const collection = await getRecipeCollection();
        await collection.insertOne(newRecipe);
        res.status(201).json(newRecipe)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

router.post('/', createRecipe);

async function updateRecipe(req, res, next) {
    try {
        const updatedRecipe = req.body
        const recipeId = req.params.id
        const collection = await getRecipeCollection();
        const result = await collection.updateOne({_id: new ObjectId(recipeId)}, {$set: updatedRecipe});
        if (result.matchedCount === 0) {
            res.status(404).send();
        } else {
            res.status(200).send();
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

router.put('/:id', updateRecipe);

async function deleteRecipe(req, res, next) {
    try {
        const recipeId = req.params.id
        const collection = await getRecipeCollection();
        const result = await collection.deleteOne({_id: new ObjectId(recipeId)})
        if (result.deletedCount === 0) {
            res.status(404).send();
        } else {
            res.status(204).send()
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

router.delete('/:id', deleteRecipe);

module.exports = router;
