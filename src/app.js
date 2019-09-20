const express = require('express');
const app = express();
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const userRouter = require('./routers/user');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth')
// returns JSON
app.use(express.json());
// passport config
require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set static view engine as pug

app.set('view engine', 'pug');
app.get('/', ensureAuthenticated, (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});
// connection routers of /products
app.use(productsRouter);
// connection routers of /categories
app.use(categoriesRouter);
// connection routers of /user
app.use(userRouter);


module.exports = app;