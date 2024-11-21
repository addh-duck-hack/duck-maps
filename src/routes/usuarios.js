const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', usuarioController.crearUsuario);
router.post('/validar', usuarioController.validarCorreo);
router.post('/login', usuarioController.login);
router.get('/', authenticate, isAdmin, usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
