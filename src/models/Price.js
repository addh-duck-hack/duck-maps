const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  locationA: { type: String, required: true },
  locationB: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Price', PriceSchema);
