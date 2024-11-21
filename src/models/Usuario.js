const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  foto: { type: String },
  numeroTelefono: { type: String },
  tipo: { type: String, enum: ['Administrador', 'Chofer', 'Alumno'], default: 'Alumno' },
  licencia: { type: String }, // Solo para Chofer
  tarjeton: { type: String }, // Solo para Chofer
  activo: { type: Boolean, default: false },
  codigoValidacion: { type: String, required: true },
  fechaAlta: { type: Date, default: Date.now } // Fecha de alta automática
});

// Middleware para encriptar la contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
