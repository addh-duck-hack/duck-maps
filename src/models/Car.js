const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  typeCar: { type: String, enum: ['Sedan', 'HackBack', 'Camioneta', 'Sub'], default: 'Sedan' },
  register: { type: String, required: true },
  smallNumber: { type: String, required: true },
  color: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null},
  active: { type: Boolean, default: true },
  creationDate: { type: Date, default: Date.now } // Fecha de alta automática
});

module.exports = mongoose.model('Car', CarSchema);
