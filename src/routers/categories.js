const express = require('express');
const router = new express.Router();
const database = require('../database.json');

router.get('/categories', (req, res) => {
  res.render('./categories/categories', {
      title: 'categories',
      database
  });
});
router.get('/categories/:id', (req, res) => {
  res.render(`./categories/${req.params.id}`, {
      title: `${req.params.id}`,
      database
  });
});
module.exports = router;
