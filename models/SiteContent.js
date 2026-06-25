const mongoose = require('mongoose');

// One document per key (e.g. key: 'content', key: 'contact', etc.)
const siteContentSchema = new mongoose.Schema({
  key:  { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
