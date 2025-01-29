const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  urlPhoto: { type: String },
  phone: { type: String },
  type: { type: String, enum: ['Administrador', 'Chofer', 'Alumno'], default: 'Alumno' },
  license: { type: String }, // Solo para Chofer
  numberCard: { type: String }, // Solo para Chofer
  active: { type: Boolean, default: false },
  validationCode: { type: String},
  creationDate: { type: Date, default: Date.now } // Fecha de alta automática
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next();
  this.pass = await bcrypt.hash(this.pass, 256);
  next();
});

module.exports = mongoose.model('User', UserSchema);
