const mongoose = require('mongoose');

const ViajeSchema = new mongoose.Schema({
  cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion', required: true },
  unidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad', required: true },
  chofer: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Viaje', ViajeSchema);
