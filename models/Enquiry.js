const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name:    { type: String },
  email:   { type: String },
  phone:   { type: String },
  service: { type: String },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
