const express = require('express');
const router = new express.Router();
const Category = require('../models/category');
const Product = require('../models/product');

// create a new product
router.post('/products', async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(404).send('Category not found!');
  } else {
    try {
      let product = new Product(req.body);
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
    const products = await Product.find().populate('category');
    res.send(products);
  } catch (err) {
    res.status(400).send(err.message);
  };
});

// delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send('product not found')
    };
    res.satatus(204).send();
  } catch (e) {
    res.status(404).send(e.message);
  };
});

// update product
router.patch('/products/:id', async (req, res) => {
  try {
    let product = await Product
      .findOneAndUpdate({ _id: req.params.id },
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          amount: req.body.amount,
          $inc: { '__v': 1 }
        },
        { new: true })
    if (!product) {
      return res.status(404).send('product not found')
    };
    product = await product.populate('category').execPopulate();
    res.send(product);
  } catch (e) {
    res.status(404).send(e.message);
  };
});

// read product
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    return res.status(404).send('product not found')
  };
  res.send(product);
});
module.exports = router;
