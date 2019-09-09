const express = require('express');
const router = new express.Router();
// const database = require('../database.json');
const Category = require('../models/categories')

// create a new product
router.post('/products/', async (req, res) => {
  try {
    const category = await Category.findOne({ category: req.query.category });
    category.products = await category.products.concat({ product: req.query.product });
    await category.save();
    res.send(category);
  } catch(e) {
    res.status(400).send(e);
  }
});

// read all products from all categories
router.get('/products', async (req, res) => {
  try {
    const category = await Category.find();
    res.render('./products/products', {
      title: 'products',
      category
      });
  } catch (e) {
    res.status(400).send(e);
  };
});
// router.get('/products/:id', (req, res) => {
//   res.render('./products/productsID', {
//     title: 'productsID',
//     id: req.params.id,
//     database
//   });
// });
module.exports = router;
