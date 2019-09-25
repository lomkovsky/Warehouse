const mongoose = require('mongoose');
const User = require('../../models/user');
const Category = require('../../models/category');
const Product = require('../../models/product');

const testUserName = 'userOne';
const testUserEmail = 'userOne@gmail.com';
const testUserPassword = 'userOne123';
const testCategoryName = 'drink';
const testCategoryDescription = 'water and other to drink';
const testProductName = 'beer';
const testProductDescription = 'alcohol drink';
const testProductAmount = 10;
const testProductPrice = 35;
const newTestUserName = 'userTwo';
const newTestUserPassword = 'userTwo123';
const newTestUserEmail = 'userTwo@gmail.com';
const shortPassword = 'short';
const newCategoryName = 'eat';
const newCategoryDescription = 'meal and other';
const newProductName = 'water';
const newProductDescription = 'non alcohol drink';
const newProductAmount = 1000;
const newProductPrice = 1;


const userOneId = new mongoose.Types.ObjectId();
const drinkCategoryId = new mongoose.Types.ObjectId();
const beerProductId = new mongoose.Types.ObjectId();
const setupDatabase = async () => {
  const userOne = new User({
    _id: userOneId,
    name: testUserName,
    email: testUserEmail,
    password: testUserPassword
  });
  const drinkCategory = new Category({
    _id: drinkCategoryId,
    name: testCategoryName,
    description: testCategoryDescription
  });
  const beerProduct = new Product({
    _id: beerProductId,
    name: testProductName,
    description: testProductDescription,
    category : drinkCategoryId,
    amount: testProductAmount,
    price: testProductPrice
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
  beerProductId,
  testUserName,
  testUserEmail,
  testUserPassword,
  testCategoryName,
  testCategoryDescription,
  testProductName,
  testProductDescription,
  testProductAmount,
  testProductPrice,
  newTestUserName,
  newTestUserPassword,
  newTestUserEmail,
  shortPassword,
  newCategoryName,
  newCategoryDescription,
  newProductName,
  newProductDescription,
  newProductAmount,
  newProductPrice
};