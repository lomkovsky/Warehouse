const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/category');
const Product = require('../models/product');

// create a new product
router.post('/products', async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(404).send('Category not found!');
  } else {
    try {
      let product = new Product({
        name: req.body.name,
        category: category._id
      });
      await product.save();
      product = await product.populate('category').execPopulate();
      res.send(product);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
});

// read all products from all categories
router.get('/products', async (req, res) => {
  try {
    const product = await Product.find().populate('category');
    res.send(product);
  } catch (e) {
    res.status(400).send(e.message);
  };
});

// delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.send(product);
  } catch (e) {
    res.status(404).send(e.message);
  };
});

// update product
router.patch('/products/:id', async (req, res) => {
  try {
    let product = await Product
      .findOneAndUpdate({ _id: req.params.id }, { name: req.body.name }, { new: true })
    await product.save();
    product = await product.populate('category').execPopulate();
    console.log(product);
    res.send(product);
  } catch (e) {
    res.status(404).send(e.message);
  };
});

// read product
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.send(product);
});
module.exports = router;
