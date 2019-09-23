const express = require('express');
const app = express();
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const userRouter = require('./routers/user');
const passport = require('passport');

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return done(new Error('user not found'));
        }
        done(null, user);
    } catch (e) {
        done(e);
    }
});

// returns JSON
app.use(express.json());
// passport config
require('./config/passport')(passport);


// passport middleware
app.use(passport.initialize());
// app.use(passport.session());

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
// connection routers of /user
app.use(userRouter);



module.exports = app;