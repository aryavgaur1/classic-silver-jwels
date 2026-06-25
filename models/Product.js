const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id:       { type: String, required: true, unique: true },
  code:     { type: String, required: true },
  name:     { type: String, required: true },
  category: { type: String, default: 'Rings' },
  metal:    { type: String, default: 'Sterling Silver' },
  stone:    { type: String, default: 'Cubic Zirconia' },
  style:    { type: String, default: 'Classic' },
  occasion: { type: String, default: 'Everyday, Gift' },
  desc:     { type: String, default: '' },
  image:    { type: String, default: '' },
  order:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
