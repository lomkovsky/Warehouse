const express = require('express');
const router = new express.Router();
const database = require('../database.json');

router.get('/products', (req, res) => {
  res.render('./products/products', {
      title: 'products',
      database        
  });
});
router.get('/products/:id', (req, res) => {
  res.render('./products/productsID', {
      title: 'productsID',
      id: req.params.id,
      database 
  });
});
module.exports = router;
