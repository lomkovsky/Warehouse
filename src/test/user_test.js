const request = require('supertest');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const { setupDatabase, userOneId } = require('./fixtures/db.js');

beforeEach(setupDatabase);
describe('Tests for user routers', () => {

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

  it('Should do not login my user profile because bad pass', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "badPass"
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
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
  });

  it('Should fetched my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const userOneFromDB = await User.findById(userOneId)
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .expect(200);
    expect(response.body.name).to.equal(userOneFromDB.name);
  });

  it('Should delete my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
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
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        email: "updateUserOne@gmail.com"
      })
      .expect(200);
    const userOneFromDB = await User.findById(userOneId)
    expect(userOneFromDB.email).to.equal("updateUserOne@gmail.com");
    expect(userOneFromDB.email).to.equal(response.body.email);
  });

  it('Should do not update my user profile because Invalid filds for updates!', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
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
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        password: "jone"
      })
      .expect(400);
    expect(response.text).to.equal("password less than 6 character");
  });

  it('Should update all fields of my user profile', async () => {
    // logging user for taking a token
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        email: "userOne@gmail.com",
        password: "userOne123"
      })
      .expect(200);
    await request(app)
      .patch('/users/me')
      .set('Authorization', 'bearer ' + responseLogin.body.token)
      .send({
        email: "updateUserOne@gmail.com",
        name: "tom",
        password: "newPassword"
      })
      .expect(200);
    const userOneFromDB = await User.findById(userOneId)
    const hashedPassword = await bcrypt.hash("newPassword", 8);
    expect(userOneFromDB.email).to.equal("updateUserOne@gmail.com");
    expect(userOneFromDB.name).to.equal("tom");
    const match = await bcrypt.compare("newPassword", hashedPassword)
    expect(match).to.equal(true);
  });

});
