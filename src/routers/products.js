const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/category');
const Product = require('../models/product');

// create a new product
router.post('/products', async (req, res) => {

  const category = await Category.findOne({ name: req.body.category })
  if (!category) {
    res.status(404).send('Category not found!');
  } else {
    try {
      const product = new Product({
        name: req.body.name,
        category: category._id
      });
      console.log(product);
      await product.save();
      const newProduct = await Product
        .findOne({ name: req.body.product })
        .populate('category');
      console.log(newProduct);
      res.send(product);
    } catch (e) {
      res.status(400).send(e);
    }
  };
});

// read all products from all categories
router.get('/products', async (req, res) => {
  try {
    const product = await Product.find();
    console.log(product);
    const newProduct = await Product
        .find()
        .populate('category');
      console.log(newProduct);
    res.render('./products/products', {
      title: 'products',
      product,
      newProduct
    });
  } catch (e) {
    res.status(400).send(e);
  };
});
// delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.id });
    product.delete();
    res.send(req.params.id + ' is deleted!')
  } catch (e) {
    res.status(404).send(e);
  };
});
// update product
router.patch('/products/:id', async (req, res) => {
  const category = await Category.findOne({ name: req.body.category })
  if (!category) {
    res.status(404).send('Category not found!');
  } else {
    try {
      const product = await Product.findOne({ ame: req.params.id });
      const updates = Object.keys(req.body);
      updates.forEach((update) => product[update] = req.body[update]);
      await product.save();
      res.send(product);
    } catch (e) {
      res.status(404).send(e);
    }
  };
})
// router.get('/products/:id', (req, res) => {
//   res.render('./products/productsID', {
//     title: 'productsID',
//     id: req.params.id,
//     database
//   });
// });
module.exports = router;
