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
            connectedUsers.set(socket.userId, socket);
        } else if (event === 'assignCar') {
            await assignCar(socket, parsedMessage);
        } else if (event === 'usersConnected') {
            // Enviar la lista de usuarios conectados
            const users = Array.from(connectedUsers.keys());
            socket.send(JSON.stringify({ event: 'usersConnected', users }));
        }else if (event === 'sendMessage') {
            // Enviar mensaje a un usuario específico
            const { userId, message } = parsedMessage;
            const userSocket = connectedUsers.get(userId);
            if (userSocket) {
              userSocket.send(JSON.stringify({ event: 'sendMessage', message }));
            } else {
              socket.send(JSON.stringify({ event: 'error', message: 'El usuario no esta disponible' }));
            }
          }
    });

    //Cerrar la conexion de cada usuario
    socket.on('close', async () => {
      console.log(`Usuario desconectado: ${socket.userId}`);
      // Eliminar el usuario del mapa de usuarios conectados
      connectedUsers.delete(socket.userId);
      if (socket.userId) {
        try {
          const session = await Session.findOne({ user: socket.userId, disconnection: null });
          if (session) {
            if (!session.connection) {
              const deleteSession = await Session.findByIdAndDelete(session._id);
              if (deleteSession){
                console.log('La sesion no tenia una fecha de inicio, se elimina');
              }else{
                console.log('No se pudo eliminar la sesion: ', session);
              }
            }else{
              session.disconnection = new Date();
              session.duration = (session.disconnection - session.connection) / 1000;
              await session.save();
              console.log('Desconexión registrada:', session);
            }
          }
        } catch (err) {
          console.error('Error al cerrar la desconexión:', err);
        }
      }
    });
  });

  console.log('WebSocket server running');
}

module.exports = setupWebSocket;