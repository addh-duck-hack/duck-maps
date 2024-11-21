const mongoose = require('mongoose');

const UnidadSchema = new mongoose.Schema({
  tipoVehiculo: { type: String, required: true },
  placas: { type: String, required: true },
  numeroEconomico: { type: String, required: true },
  color: { type: String },
  choferActivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Unidad', UnidadSchema);
