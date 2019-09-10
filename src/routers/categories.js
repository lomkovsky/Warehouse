const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/category');
const Product = require('../models/product');

// read all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.render('./categories/categories', {
      title: 'categories',
      categories
      });
  } catch (e) {
    res.status(400).send(e);
  };
  
});
// create a new categories
router.post('/categories/', async (req, res) => {
  const category = new Category(req.body)
  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
  };
});
// delete category by id
router.delete('/categories/:id', async (req, res) => {
  try {
  const category = await Category.findOne({ name : req.params.id });
  const product = await Product.findOne({ category : category._id });
  product.delete();
  category.delete();
  res.send(req.params.id + ' is deleted!')
  } catch (e) {
    res.status(404).send(e);
  };
});
//update category
router.patch('/categories/:id', async (req, res) => {
  console.log(req.params.id)
    try {
      const category = await Category.findOne({ name: req.params.id });
      console.log(category)
      category.category = req.body.category;
      console.log(category)
      await category.save();
      res.send(category);
    } catch (e) {
      res.status(404).send(e);
    }
  
})

router.get('/categories/:id', async (req, res) => {
  const category = req.params.id;
  res.render('./categories/categoryById', {
    title: category,
    category
  });
});
module.exports = router;
