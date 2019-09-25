const request = require('supertest');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const Product = require('../models/product');
const {
  setupDatabase,
  drinkCategoryId,
  beerProductId,
  testUserEmail,
  testUserPassword,
  testProductName,
  newProductName,
  newProductDescription
} = require('./fixtures/db.js');


beforeEach(setupDatabase);
describe('Tests for product routers', () => {

  it('Should fetched all product from db', async () => {
    const response = await request(app)
      .get('/products')
      .expect(200);
    expect(response.body[0].name).to.equal(testProductName);
  });

  it('Should fetched one product from db by ID', async () => {
    const response = await request(app)
      .get(`/products/${beerProductId}`)
      .expect(200);
    expect(response.body.name).to.equal(testProductName);
  });

  it('Should delete beer product', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .delete(`/products/${beerProductId}`)
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .expect(204);
    expect(response.body.name).not.to.exist;
    const productOneFromDB = await Product.findById(beerProductId)
    expect(productOneFromDB).not.to.exist;
  });

  it('Should create water product', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .post('/products')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        name: newProductName,
        description: newProductDescription,
        category: drinkCategoryId,
        amount: 1000,
        price: 1
      })
      .expect(200);
    expect(response.body.name).to.equal(newProductName);
    const allProductOneFromDB = await Product.find();
    expect(allProductOneFromDB.length).to.equal(2);
  });


  it('Should update beer product to water product', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .patch(`/products/${beerProductId}`)
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        name: newProductName,
        description: newProductDescription,
        amount: 1000,
        price: 1
      })
      .expect(200);
    expect(response.body.name).to.equal(newProductName);
    const productromDB = await Product.findById(beerProductId);
    expect(productromDB.name).to.equal(newProductName);
  });

});
