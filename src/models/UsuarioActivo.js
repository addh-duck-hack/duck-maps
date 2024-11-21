const mongoose = require('mongoose');

const UsuarioActivoSchema = new mongoose.Schema({
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date },
  chofer: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  unidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad', required: true }
});

module.exports = mongoose.model('UsuarioActivo', UsuarioActivoSchema);
