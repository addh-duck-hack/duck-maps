const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const users = require('./routes/users');
const cars = require('./routes/cars');
const setupWebSocket = require('./websocket');

// Middleware
app.use(express.json());

// Importar modelos
require('./models/User');
require('./models/Car');

// Database connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', users);
app.use('/cars', cars);

// Setup WebSocket
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on https://maps.duck-hack.cloud:${PORT}`);
});