const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  id:    { type: String, required: true, unique: true },
  q:     { type: String, required: true },
  a:     { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);
