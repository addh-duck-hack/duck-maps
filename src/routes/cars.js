const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { authenticate, isAdmin } = require('../middleware/auth');

//Todos estos servicios solo podran ser utilizaxdos por administradores
// Administrador crea un nuevo vehiculo
router.post('/new', authenticate, isAdmin, carController.newCar);
// Lista de vehiculos
router.get('/', authenticate, isAdmin, carController.listCars);
// Actualizar un vehiculo
router.put('/:id', authenticate, isAdmin, carController.updateCar);
// Eliminar un vehiculo
router.delete('/:id', authenticate, isAdmin, carController.deleteCar);

module.exports = router;