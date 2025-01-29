const mongoose = require('mongoose');

const TravelSchema = new mongoose.Schema({
  price: { type: mongoose.Schema.Types.ObjectId, ref: 'Price', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Travel', TravelSchema);
