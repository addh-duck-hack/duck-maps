const Car = require('../models/Car');

// Crear un vehiculo
exports.newCar = async (req, res) => {
    try {
        const { typeCar, register, smallNumber, color, driver } = req.body;

        // Se valida si la placa ya esta registrada
        const existingCar = await Car.findOne({ register });
        if (existingCar) {
            return res.status(400).json({ error: 'Estas placas ya estan registradas' });
        }

        const car = new Car({ typeCar, register, smallNumber, color, driver });

        await car.save();

        res.status(201).json({ message: 'Se dio de alta el nuevo vehiculo' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar todos los vehiculos
exports.listCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un vehiculo
exports.updateCar = async (req, res) => {
  try {
    const allowedFields = ['typeCar', 'register', 'smallNumber', 'color', 'driver', 'active'];
    const updatedData = {};

    //Validamos si la placa ya esta registrada y si pertenece al mismo veahiculo
    const existingCar = await Car.findOne({ register });
    const idExistingCar = existingCar._id.toString();
    if (idExistingCar !== req.params.id) {
      return res.status(400).json({ error: 'Estas placas ya estan registradas en otro vehiculo' });
    }

    // Filtrar los campos permitidos para la actualización
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        updatedData[field] = req.body[field];
      }
    });

    const car = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!car) return res.status(404).json({ error: 'Vehiculo no encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un vehiculo
exports.deleteCar= async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }
    res.json({ message: 'Vehiculo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};