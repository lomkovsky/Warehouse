const express = require('express');
const app = express();
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'        
    });
});
// connection routers of /products
app.use(productsRouter);
// connection routers of /categories
app.use(categoriesRouter);

// returns JSON
app.use(express.json());

module.exports = app;