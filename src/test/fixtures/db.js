// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user.js');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const hashPassword = async () => await bcrypt.hash("userOne123", 8);
const userOneId = new mongoose.Types.ObjectId();
let userOne = new User({
  _id: userOneId,
  name: "userOne",
	email: "userOne@gmail.com",
	password: hashPassword
});

const setupDatabase = async () => {
  await User.deleteMany();
  await userOne.save()  
};
// const token = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET);
let token;
passport.authenticate('local', {
    failureRedirect: '/users/login/error'
  }),
  async function () {
    const user = userOne;
    const token = await user.generateAuthToken();
    console.log(token);
  };
  
module.exports = {
  setupDatabase,
  userOne,
  token,
  userOneId
};