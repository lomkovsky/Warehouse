const request = require('supertest');
const User = require('../models/user');
// const = require('supertest');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const { setupDatabase } = require('./fixtures/db.js');

beforeEach(setupDatabase);
describe('Tests for user routers', async () => {
  it('Should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: "jone",
        email: "jone@gmail.com",
        password: "jone123"
      })
      .expect(201);
    const user = await User.findById(response.body.user._id);
    expect(user).not.to.be.null;
    expect(response.body.user.name).to.equal('jone');
    expect(response.body.token).to.exist;
    
  });
  it('Should do not permission to signup a new user because there is no pass', async () => {
    await request(app)
      .post('/users')
      .send({
        name: "jone",
        email: "jone@gmail.com"
      })
      .expect(400);
  });
  it('Should do not permission to signup a new user because pass less then 6 character', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: "jone",
        email: "jone@gmail.com",
        password: "jone"
      })
      .expect(400);
    expect(response.text).to.equal("password less than 6 character");
  });
  xit('Should read my user profile', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
      
      console.log(response.body.token);
      console.log(response.statusCode);
  });
});
