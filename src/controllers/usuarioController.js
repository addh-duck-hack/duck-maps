const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Crear un usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { correo, nombreCompleto, contraseña } = req.body;

    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const codigoValidacion = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const usuario = new Usuario({ correo, nombreCompleto, contraseña, codigoValidacion });

    await usuario.save();

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
      to: correo,
      subject: 'Validación de correo electrónico',
      text: `Tu código de validación es: ${codigoValidacion}`
    });

    res.status(201).json({ message: 'Usuario creado. Verifica tu correo para validar la cuenta.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validar correo
exports.validarCorreo = async (req, res) => {
  try {
    const { correo, codigo } = req.body;
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (usuario.codigoValidacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });

    usuario.activo = true;
    usuario.codigoValidacion = null; // Eliminar el código tras validación
    await usuario.save();

    res.json({ message: 'Correo validado exitosamente. Tu cuenta está activa.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await Usuario.findOne({ correo });

    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Usuario no activado. Valida tu correo electrónico.' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, message: 'Inicio de sesión exitoso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Obtener un usuario por ID
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
