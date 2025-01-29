// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/websocket.js
const WebSocket = require('ws');
const authenticate = require('./events/authenticate');
const setUnidad = require('./events/setUnidad');

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
        } else if (event === 'setUnidad') {
            await setUnidad(socket, parsedMessage);
        }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server running');
}

module.exports = setupWebSocket;