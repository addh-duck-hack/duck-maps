const mongoose = require('mongoose');
require('./models/User');

const CarSchema = new mongoose.Schema({
  typeCar: { type: String, required: true },
  register: { type: String, required: true },
  smallNumber: { type: String, required: true },
  color: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  active: { type: Boolean, default: true },
  creationDate: { type: Date, default: Date.now } // Fecha de alta automática
});

module.exports = mongoose.model('Car', CarSchema);
