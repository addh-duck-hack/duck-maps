const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  foto: { type: String },
  numeroTelefono: { type: String },
  contraseña: { type: String, required: true },
  activo: { type: Boolean, default: true },
  tipo: { type: String, enum: ['Administrador', 'Chofer', 'Alumno'], required: true },
  licencia: { type: String }, // Solo para Chofer
  tarjeton: { type: String } // Solo para Chofer
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
