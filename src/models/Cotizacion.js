const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  puntoA: { type: String, required: true },
  puntoB: { type: String, required: true },
  costo: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  contratado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cotizacion', CotizacionSchema);
