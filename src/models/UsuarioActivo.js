const mongoose = require('mongoose');

const UsuarioActivoSchema = new mongoose.Schema({
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  unidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad' } // Hacer opcional
});

module.exports = mongoose.model('UsuarioActivo', UsuarioActivoSchema);
