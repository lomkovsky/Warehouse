const request = require('supertest');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const { 
  setupDatabase,
  userOneId,
  testUserName,
  testUserEmail,
  testUserPassword,
  newTestUserName,
  newTestUserPassword,
  newTestUserEmail,
  shortPassword
} = require('./fixtures/db.js');

beforeEach(setupDatabase);
describe('Tests for user routers', () => {

  it('Should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: newTestUserName,
        email: newTestUserEmail,
        password: newTestUserPassword
      })
      .expect(201);
    const user = await User.findById(response.body.user._id);
    expect(user).not.to.be.null;
    expect(response.body.user.name).to.equal(newTestUserName);
    expect(response.body.token).to.exist;
  });

  it('Should do not permission to signup a new user because there is no pass', async () => {
    await request(app)
      .post('/users')
      .send({
        name: newTestUserName,
        email: testUserEmail
      })
      .expect(400);
  });

  it('Should do not permission to signup a new user because pass less then 6 character', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: newTestUserName,
        email: testUserEmail,
        password: shortPassword
      })
      .expect(400);
    expect(response.text).to.equal("password less than 6 character");
  });

  it('Should do not login my user profile because of a bad pass', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: newTestUserPassword
      })
      .expect(302);
    await request(app)
      .get(response.header.location)
      .send()
      .expect(401);
  });

  it('Should login my user profile', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
  });

  it('Should fetched my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .expect(200);
    expect(response.body.name).to.equal(testUserName);
  });

  it('Should delete my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .delete('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .expect(204);
    expect(response.body.name).not.to.exist
  });

  it('Should update email of my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        email: newTestUserEmail
      })
      .expect(200);
    const userOneFromDB = await User.findById(userOneId)
    expect(userOneFromDB.email).to.equal(newTestUserEmail);
    expect(userOneFromDB.email).to.equal(response.body.email);
  });

  it('Should do not update my user profile because of Invalid fields for updates!', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        age: 18
      })
      .expect(400);
    expect(response.body.error).to.equal('Invalid filds for updates!');
  });

  it('Should do not update my user profile because pass less then 6 character', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        password: shortPassword
      })
      .expect(400);
    expect(response.text).to.equal("password less than 6 character");
  });

  it('Should update all fields of my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .expect(200);
    await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        email: newTestUserEmail,
        name: newTestUserName,
        password: newTestUserPassword
      })
      .expect(200);
    const userOneFromDB = await User.findById(userOneId);
    expect(userOneFromDB.email).to.equal(newTestUserEmail);
    expect(userOneFromDB.name).to.equal(newTestUserName);
    const match = await bcrypt.compare(newTestUserPassword, userOneFromDB.password)
    expect(match).to.equal(true);
  });

});
