const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Verificar token y obtener usuario autenticado
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    req.usuario = usuario; // Guardar usuario en la solicitud
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

// Verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  if (req.usuario.tipo !== 'Administrador') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden acceder a este recurso.' });
  }
  next();
};
