const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const passport = require('passport');

// register page
router.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  // check required fields
  if (!name || !email || !password) {
    return res.sendStatus(400);
  }
  // check password length
  if (password.length < 6) {
    return res.status(400).send("password less than 6 character");
  }
  try {
    // create a new user
    let user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    user = await user.publicFields();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// error logging handle
router.get('/users/login/error', (req, res) => res.status(401).send("error logging"));

// login handle
router.post('/users/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login/error'
  }),
  async function (req, res) {
    const user = req.user;
    const token = await user.generateAuthToken();
    const welcomeMassage = "Welcome " + user.name + "!!";
    res.send({ welcomeMassage, token });
  });

// get my profile
router.get('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const publicUser = await req.user.publicFields();
  res.send(publicUser);
});

// update my profile
router.patch('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid filds for updates!' });
  }
  if (req.body.password && req.body.password.length < 6) {
    return res.status(400).send("password less than 6 character");
  }
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('user not found')
    }
    if(req.body.name) {user.name = req.body.name}
    if(req.body.email) {user.email = req.body.email}
    if(req.body.password) {user.password = req.body.password}
    await user.save();
    user = await user.publicFields();
    res.send(user);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// delete my profile
router.delete('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await req.user.remove();
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;