const express = require('express');

const app = express();
const passport = require('passport');
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const userRouter = require('./routers/user');

// returns JSON
app.use(express.json());
// passport config
require('./middleware/passport')(passport);

// passport middleware
app.use(passport.initialize());

// set static view engine as pug
app.set('view engine', 'pug');
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
  });
});
// connection routers of /products
app.use(productsRouter);
// connection routers of /categories
app.use(categoriesRouter);
// connection routers of /user
app.use(userRouter);
// TODO: add error handling

module.exports = app;
