const request = require('supertest');
const User = require('../models/user');
// const = require('supertest');
const { expect } = require("chai");
require('../db/mongodb');
const app = require('../app.js');
const { setupDatabase } = require('./fixtures/db.js');
beforeEach(setupDatabase);
describe('Test for user routers', async () => {
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
});
