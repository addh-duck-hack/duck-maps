const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded); // Debugging: Ver el contenido del token
        // Asegurarse de que el ID sea válido para MongoDB
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(400).json({ error: 'ID del usuario no válido.' });
        }

        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        req.usuario = usuario; // Agregar el usuario autenticado al request
        next();
    } catch (err) {
        console.error('Error en la verificación del token:', err.message); // Debugging
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
