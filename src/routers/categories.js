const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/categories')

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
  const category = new Category({ category : req.query.category})
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
  const category = await Category.findOne({ category : req.params.id });
  console.log (category);
  category.delete();
  res.send(req.params.id + ' is deleted!')
  } catch (e) {
    res.status(404).send(e);
  };
});

router.get('/categories/:id', async (req, res) => {
  const category = req.params.id;
  res.render('./categories/categoryById', {
    title: category,
    category
  });
});
module.exports = router;
