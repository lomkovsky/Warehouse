const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/category');
const Product = require('../models/product');

// read all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (e) {
    res.status(500).send('Something went wrong');
  };
});

// create a new categories
router.post('/categories', async (req, res) => {
  const category = new Category(req.body)
  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e.message);
  };
});

// delete category by id
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete ({_id: req.params.id});
    const product = await Product.find({ category: category._id });// many
    if(!product.length === 0){
      product.delete();
    };
    category.delete();
    res.send()
  } catch (e) {
    res.status(404).send(e.message); 
  };
});

//update category
router.patch('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    await category.save();
    res.send(category);
  } catch (e) {
    res.status(404).send(e.message);
  };
});

router.get('/categories/:id', async (req, res) => {
  try {
  const category = await Category.findById(req.params.id);
  res.send(category);
} catch (e) {
  res.status(404).send(e.message);
};
});
module.exports = router;
