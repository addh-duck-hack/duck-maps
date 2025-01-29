const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/new', userController.newUser);
router.post('/validateMail', userController.validateMail);
router.post('/login', userController.login);
router.get('/', authenticate, isAdmin, userController.listUsers);
router.get('/:id', authenticate, userController.getUser);
// Administrador actualiza un usuario
router.put('/:id', authenticate, isAdmin, userController.updateUserXAdmin);
// Usuario actualiza sus propios datos
router.put('/:id/edit', authenticate, userController.updateUser);
// Usuario cambia su contraseña
router.put('/:id/pass', authenticate, userController.changePassword);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;
