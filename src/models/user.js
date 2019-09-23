const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true

  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  tokens: [{
    token: {
      type: String
    }
  }],
  deletedtokens: [{
    tokenFromHeder: {
      type: String
    }
  }],
});

// create token write to database and return it
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, "thisisit");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// public fields of user
userSchema.methods.publicFields = async function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.deletedtokens;
  return userObject;
}

const User = mongoose.model('User', userSchema);

module.exports = User;