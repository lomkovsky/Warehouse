const express = require('express');
const app = express();
// set port to listen
const PORT = 3000;
// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'        
    });
});
app.get('/food', (req, res) => {
    res.render('./categories/food', {
        title: 'food',
        food: [
            'apple',
            'beer',
            'cake'
        ]
    });
});
app.get('/electronic', (req, res) => {
    res.render('./categories/electronic', {
        title: 'electronic',
        electronic: [
            'cell phone',
            'notebook'
        ]
    });
});
app.get('/stuff', (req, res) => {
    res.render('./categories/stuff', {
        title: 'stuff',
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

// start server
app.listen(PORT, () => {
    console.log(`serser start on port ${PORT}`);
});
