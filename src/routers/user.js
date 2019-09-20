const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// register page
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  // check required fields
  if (!name || !email || !password) {
    return res.sendStatus(400);
  };
  // check password length
  if (password.length < 6) {
    return res.status(400).send("password less than 6 character");
  };
  try {
    // create a new user
    const user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 8);
    res.send(user);
  } catch (e) {
    res.sendStatus(500)
  };
});
// login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashbord',
    failureRedirect: '/users/login'
  })(req, res, next);
});
// logout handle
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("./");
})
module.exports = router;