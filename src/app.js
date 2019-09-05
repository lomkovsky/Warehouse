const express = require('express');
const app = express();
const database = require('./database.json');
// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'        
    });
});
app.get('/categories/:category_id', (req, res) => {
    res.render(`./categories/${req.params.category_id}`, {
        title: `${req.params.category_id}`,
        database
    });
});
app.get('/categories', (req, res) => {
    res.render('./categories/categories', {
        title: 'categories',
        database
    });
});
app.get('/products', (req, res) => {
    res.render('./products/products', {
        title: 'products',
        database        
    });
});
app.get('/products/:id', (req, res) => {
    res.render('./products/productsID', {
        title: 'productsID',
        id: req.params.id,
        database 
    });
});
// returns JSON
app.use(express.json());

module.exports = app;