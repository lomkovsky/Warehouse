const mongoose = require('mongoose');
const User = require('../../models/user');
const Category = require('../../models/category');
const Product = require('../../models/product');

const userOneId = new mongoose.Types.ObjectId();
const drinkCategoryId = new mongoose.Types.ObjectId();
const beerProductId = new mongoose.Types.ObjectId();
const setupDatabase = async () => {
  const userOne = new User({
    _id: userOneId,
    name: "userOne",
    email: "userOne@gmail.com",
    password: "userOne123"
  });
  const drinkCategory = new Category({
    _id: drinkCategoryId,
    name: "drink",
    description: "water and other to drink"
  });
  const beerProduct = new Product({
    _id: beerProductId,
    name: "beer",
    description: "alcohol drink",
    category : drinkCategoryId,
    amount: 10,
    price: 35    
  });

  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  await beerProduct.save();
  await userOne.save();
  await drinkCategory.save();
};

module.exports = {
  setupDatabase,
  userOneId,
  drinkCategoryId,
  beerProductId
};