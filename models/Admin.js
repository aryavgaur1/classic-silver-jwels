const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

adminSchema.methods.checkPassword = function(plain) {
  return bcrypt.compareSync(plain, this.passwordHash);
};

adminSchema.statics.hashPassword = function(plain) {
  return bcrypt.hashSync(plain, 10);
};

module.exports = mongoose.model('Admin', adminSchema);
