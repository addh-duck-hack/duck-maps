const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

//Nuevo usuario con correo
router.post('/new', userController.newUser);
//Valida codigo que se envio al correo
router.post('/validateMail', userController.validateMail);
//Realiza login y devuelve token
router.post('/login', userController.login);
//Renovar token de consumo
router.post('/refreshToken', authenticate, userController.getNewToken);
// Lista de usuarios
router.get('/', authenticate, isAdmin, userController.listUsers);
// Obtener un usuario por ID
router.get('/:id', authenticate, userController.getUser);
// Administrador actualiza un usuario
router.put('/:id', authenticate, isAdmin, userController.updateUserXAdmin);
// Usuario actualiza sus propios datos
router.put('/:id/edit', authenticate, userController.updateUser);
// Usuario cambia su contraseña
router.put('/:id/pass', authenticate, userController.changePassword);
// Administrador elimina un usuario
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;
