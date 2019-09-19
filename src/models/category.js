const mongoose = require('mongoose');
const Product = require('./product');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true,
});

categorySchema.set('toJSON', { virtuals: true });

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});


categorySchema.pre('remove', async function (next) {
  const category = this;
  await Product.deleteMany({ category: category._id });
  next();
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
