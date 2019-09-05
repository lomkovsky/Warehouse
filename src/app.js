const express = require('express');
const app = express();

// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'        
    });
});
app.get('/categories/:category_id', (req, res) => {
    res.render(`./categories/${req.params.category_id}`, {
        title: 'food',
        food: [
            'apple',
            'beer',
            'cake'
        ],
        electronic: [
            'cell phone',
            'notebook'
        ],
        stuff: [
            'rope',
            'sweet'
        ]
    });
});
app.get('/categories', (req, res) => {
    res.render('./categories/categories', {
        title: 'categories',
        category: [
            'food',
            'electronic',
            'stuff'
        ]
    });
});
app.get('/products', (req, res) => {
    res.render('./products/products', {
        title: 'products',
        products: [
            'apple',
            'beer',
            'cake',
            'cell phone',
            'notebook',
            'rope',
            'sweet'            
        ]
    });
});
app.get('/products/:id', (req, res) => {
    res.render('./products/productsID', {
        title: 'productsID',
        id: req.params.id,
        products: [
            'apple',
            'beer',
            'cake',
            'cell phone',
            'notebook',
            'rope',
            'sweet'            
        ]
    });
});
// returns JSON
app.use(express.json());

module.exports = app;