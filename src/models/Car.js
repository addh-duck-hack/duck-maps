const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  typeCar: { type: String, required: true },
  register: { type: String, required: true },
  smallNumber: { type: String, required: true },
  color: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Car', CarSchema);
