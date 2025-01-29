const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Crear un usuario
exports.newUser = async (req, res) => {
  try {
    const { phone, mail, fullName, pass } = req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const validationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const user = new User({ phone, mail, fullName, pass, validationCode });

    await user.save();

    // Enviar correo con el código
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Validación de correo electrónico',
      text: `Tu código de validación es: ${validationCode}`
    });

    res.status(201).json({ message: 'Usuario creado. Verifica tu correo para validar la cuenta.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validar correo
exports.validateMail = async (req, res) => {
  try {
    const { mail, code } = req.body;
    const user = await User.findOne({ mail });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.validationCode !== code) return res.status(400).json({ error: 'Código incorrecto' });

    user.active = true;
    user.validationCode = null; // Eliminar el código tras validación
    await user.save();

    res.json({ message: 'Correo validado exitosamente. Tu cuenta está activa.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { mail, pass } = req.body;
    const user = await User.findOne({ mail });

    // Verificar si el usuario existe y las credenciales son válidas
    if (!user || !(await bcrypt.compare(pass, user.pass))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(403).json({
        error: 'Para poder iniciar sesión primero valida tu cuenta con el correo que fue enviado.'
      });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '99d' } //Se modifica a 99 días de duración
    );

    res.json({ token, id: user._id.toString(), message: 'Inicio de sesión exitoso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Obtener un usuario por ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos los usuarios
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un usuario (solo Administrador)
exports.updateUserXAdmin = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'urlPhoto', 'phone', 'type', 'license', 'paper', 'active'];
    const updatedData = {};

    // Filtrar los campos permitidos para la actualización
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        updatedData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar datos básicos del usuario autenticado
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'urlPhoto', 'phone'];
    const updatedData = {};

    // Filtrar los campos permitidos para la actualización
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        updatedData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Cambiar contraseña del usuario autenticado
exports.changePassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;

    if (!currentPass || !newPass) {
      return res.status(400).json({ error: 'Debes proporcionar la contraseña actual y la nueva contraseña.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar la contraseña actual
    const isValid = await bcrypt.compare(currentPass, user.pass);
    if (!isValid) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
    }

    // Encriptar y guardar la nueva contraseña
    user.pass = newPass;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un usuario (solo Administrador)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};