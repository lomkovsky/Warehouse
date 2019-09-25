const mongoose = require('mongoose');
const User = require('../../models/user.js');

const userOneId = new mongoose.Types.ObjectId();

const setupDatabase = async () => {
  const userOne = new User({
    _id: userOneId,
    name: "userOne",
    email: "userOne@gmail.com",
    password: "userOne123"
  });
  await User.deleteMany();
  await userOne.save();
};

module.exports = {
  setupDatabase,
  userOneId
};