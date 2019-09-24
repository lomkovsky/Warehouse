// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user.js');

const userOneId = new mongoose.Types.ObjectId();
const setupDatabase = async () => {
  await User.deleteMany();
};
module.exports = {
  setupDatabase,
  userOneId
};