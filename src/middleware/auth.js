const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Asegurarse de que el ID sea válido para MongoDB
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(400).json({ error: 'ID del usuario no válido.' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        req.user = user; // Agregar el usuario autenticado al request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

// Verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.type !== 'Administrador') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden acceder a este recurso.' });
  }
  next();
};
