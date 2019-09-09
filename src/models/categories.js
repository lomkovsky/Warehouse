const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  category: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }, 
  products: [{
    product: {
      type: String,
      required: true
    }
  }],
});
const Category = mongoose.model('Category', taskSchema);

module.exports = Category;
