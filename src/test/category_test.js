const request = require('supertest');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const Category = require('../models/category');
const { setupDatabase, drinkCategoryId } = require('./fixtures/db.js');


beforeEach(setupDatabase);
describe('Tests for categories routers', () => {

  it('Should fetched all categories from db', async () => {
    const categoryOneFromDB = await Category.findById(drinkCategoryId)
    const response = await request(app)
      .get('/categories')
      .expect(200);
    expect(response.body[0].name).to.equal(categoryOneFromDB.name);
  });

  it('Should fetched one category from db by ID', async () => {
    const categoryOneFromDB = await Category.findById(drinkCategoryId)
    const response = await request(app)
      .get(`/categories/${drinkCategoryId}`)
      .expect(200);
    expect(response.body.name).to.equal(categoryOneFromDB.name);
  });

  it('Should delete drink category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const response = await request(app)
      .delete(`/categories/${drinkCategoryId}`)
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .expect(204);
    expect(response.body.name).not.to.exist;
    const categoryOneFromDB = await Category.findById(drinkCategoryId);
    expect(categoryOneFromDB).not.to.exist;
  });

  it('Should create eat category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const response = await request(app)
      .post('/categories')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({        
          name: "eat",
          description: "meal and other"        
      })
      .expect(201);
    expect(response.body.name).to.equal("eat");
    const allCategoriesFromDB = await Category.find();
    expect(allCategoriesFromDB.length).to.equal(2);
  });

  it('Should update drink category to eat category', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const response = await request(app)
      .patch(`/categories/${drinkCategoryId}`)
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({        
          name: "eat",
          description: "meal and other"        
      })
      .expect(200);
    expect(response.body.name).to.equal("eat");
    const allCategoriesFromDB = await Category.find();
    expect(allCategoriesFromDB.length).to.equal(1);
  });

});
