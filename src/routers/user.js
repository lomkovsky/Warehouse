const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const isTokenHasDeleted = require('../middleware/isTokenHasDeleted');

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
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  };
});

// error logging handle
router.get('/error', (req, res) => res.send("error logging in"));

// login handle
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  async function (req, res) {
    const user = req.user;
    const token = await user.generateAuthToken();
    const welcomeMassage = "Welcome " + user.name + "!!";
    res.send({ welcomeMassage, token });
  });

// get my profile
router.get('/me', isTokenHasDeleted, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const publicUser = await req.user.publicFields();
  res.send(publicUser);
}
);

// logout handle
router.get('/logout', isTokenHasDeleted, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const tokenFromHeder = req.header('Authorization').replace('Bearer ', '');
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== tokenFromHeder;
    });
    req.user.deletedtokens = req.user.deletedtokens.concat({ tokenFromHeder });
    await req.user.save();
    req.logout();
    res.send('logout');
  } catch (e) {
    res.status(500).send();
  }
});

// update my profile
router.patch('/me', isTokenHasDeleted, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid filds for updates!' });
  };
  if (req.body.password.length < 6) {
    return res.status(400).send("password less than 6 character");
  };
  try {
    let user = await User.findByIdAndUpdate(req.user._id,
      req.body,
      { new: true });
    if (!user) {
      return res.status(404).send('user not found')
    };
    user.password = await bcrypt.hash(user.password, 8);
    await user.save();
    user = await user.publicFields();
    res.send(user);
  } catch (e) {
    res.status(404).send(e.message);
  };
});

// delete my profile
router.delete('/me', isTokenHasDeleted, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await req.user.remove();
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  };
});

module.exports = router;