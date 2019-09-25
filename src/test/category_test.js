/* eslint-disable no-unused-expressions */
const request = require('supertest');
const { expect } = require('chai');
require('../db/mongodb');
const app = require('../app.js');
const Category = require('../models/category');
const { testData, setupDatabase } = require('./fixtures/db.js');


beforeEach(setupDatabase);
describe('Tests for categories routers', () => {
  it('Should fetched all categories from db', async () => {
    const response = await request(app)
      .get('/categories')
      .expect(200);
    expect(response.body[0].name).to.equal(testData.testCategory.name);
  });

  it('Should fetched one category from db by ID', async () => {
    const response = await request(app)
      .get(`/categories/${testData.testCategory.id}`)
      .expect(200);
    expect(response.body.name).to.equal(testData.testCategory.name);
  });

  it('Should delete drink category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testData.testUser.email,
        password: testData.testUser.password,
      })
      .expect(200);
    const response = await request(app)
      .delete(`/categories/${testData.testCategory.id}`)
      .set('Authorization', `bearer ${responseLogin.body.token}`)
      .expect(204);
    expect(response.body.name).not.to.exist;
    const categoryOneFromDB = await Category.findById(testData.testCategory.id);
    expect(categoryOneFromDB).not.to.exist;
  });

  it('Should create eat category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testData.testUser.email,
        password: testData.testUser.password,
      })
      .expect(200);
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `bearer ${responseLogin.body.token}`)
      .send({
        name: testData.newTestCategory.name,
        description: testData.newTestCategory.description,
      })
      .expect(201);
    expect(response.body.name).to.equal(testData.newTestCategory.name);
    const allCategoriesFromDB = await Category.find();
    expect(allCategoriesFromDB.length).to.equal(2);
  });

  it('Should update drink category to eat category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testData.testUser.email,
        password: testData.testUser.password,
      })
      .expect(200);
    const response = await request(app)
      .patch(`/categories/${testData.testCategory.id}`)
      .set('Authorization', `bearer ${responseLogin.body.token}`)
      .send({
        name: testData.newTestCategory.name,
        description: testData.newTestCategory.description,
      })
      .expect(200);
    expect(response.body.name).to.equal(testData.newTestCategory.name);
    const allCategoriesFromDB = await Category.find();
    expect(allCategoriesFromDB.length).to.equal(1);
    const categoryFromDB = await Category.findById(testData.testCategory.id);
    expect(categoryFromDB.name).to.equal(testData.newTestCategory.name);
    expect(categoryFromDB.description).to.equal(testData.newTestCategory.description);
  });
});
