const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  product: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }, 
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }
});
const Product = mongoose.model('Product', taskSchema);

module.exports = Product;