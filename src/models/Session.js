const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  connection: { type: Date, default: null},
  disconnection: { type: Date, default: null},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  duration: { type: Number, default: null}
});

module.exports = mongoose.model('Session', SessionSchema);
