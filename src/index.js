const express = require('express');
const app = express();
// set port to listen
const PORT = 3000;
// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        category: [
            'food',
            'electronic',
            'stuff'
        ]
    });
});
app.get('/food', (req, res) => {
    res.render('food', {
        title: 'food',
        food: [
            'apple',
            'beer',
            'cake'
        ]
    });
});
app.get('/electronic', (req, res) => {
    res.render('electronic', {
        title: 'electronic',
        electronic: [
            'cell phone',
            'notebook'
        ]
    });
});
app.get('/stuff', (req, res) => {
    res.render('stuff', {
        title: 'stuff',
        stuff: [
            'rope',
            'sweet'
        ]
    });
});
// start server
app.listen(PORT, () => {
    console.log(`serser start on port ${PORT}`);
});
