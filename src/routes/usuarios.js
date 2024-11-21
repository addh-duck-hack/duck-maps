const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', usuarioController.crearUsuario);
router.post('/validar', usuarioController.validarCorreo);
router.post('/login', usuarioController.login);
router.get('/', authenticate, isAdmin, usuarioController.listarUsuarios);
router.get('/:id', authenticate, usuarioController.obtenerUsuario);
// Administrador actualiza un usuario
router.put('/:id', authenticate, isAdmin, usuarioController.actualizarUsuarioAdmin);
// Usuario actualiza sus propios datos
router.put('/me', authenticate, usuarioController.actualizarUsuarioPropio);
// Usuario cambia su contraseña
router.put('/me/contraseña', authenticate, usuarioController.cambiarContraseña);
router.delete('/:id', authenticate, isAdmin, usuarioController.eliminarUsuario);

module.exports = router;
