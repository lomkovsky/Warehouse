const mongoose = require('mongoose');
// const connectionURL = 'mongodb://127.0.0.1:27017/warehouse';
const connectionURL = process.env.MONGODB_URL;


mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});