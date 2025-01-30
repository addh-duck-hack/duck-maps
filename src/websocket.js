// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/websocket.js
const WebSocket = require('ws');
const authenticate = require('./events/authenticate');
const assignCar = require('./events/assignCar');
const Session = require('./models/Session');

const connectedUsers = new Map(); // Mapa para almacenar los usuarios conectados

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (socket) => {
    console.log('New client connected');
    
    // Manejar mensajes
    socket.on('message', async (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) {
            console.error('El mensaje no tiene el formato esperado');
            socket.send(JSON.stringify({ event: 'error', message: 'El mensaje no tiene el formato esperado' }));
            return socket.close();
        }

        const { event } = parsedMessage;
        if (event === 'authenticate') {
            await authenticate(socket, parsedMessage);
            // Almacenar el usuario en el mapa de usuarios conectados
            connectedUsers.set(socket.usuarioId, socket);
        } else if (event === 'assignCar') {
            await assignCar(socket, parsedMessage);
        } else if (event === 'usersConnected') {
            // Enviar la lista de usuarios conectados
            const users = Array.from(connectedUsers.keys());
            socket.send(JSON.stringify({ event: 'usersConnected', users }));
        }
    });

    // Cerrar la conexión de cada usuario
    socket.on('close', async () => {
      console.log(`Usuario desconectado: ${socket.usuarioId}`);
      // Eliminar el usuario del mapa de usuarios conectados
      connectedUsers.delete(socket.usuarioId);
    });
  });

  console.log('WebSocket server running');
}

module.exports = { setupWebSocket };