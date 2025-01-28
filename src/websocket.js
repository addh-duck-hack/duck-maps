const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
const UsuarioActivo = require('./models/UsuarioActivo');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (socket) => {
    console.log('New client connected');
    
    // Autenticar usuario
    socket.on('message', async (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) {
            console.error('Error parsing message:', err);
            socket.send(JSON.stringify({ event: 'error', message: 'Invalid JSON format' }));
            return socket.close();
        }

        const { event, token } = parsedMessage;
        if (event === 'authenticate') {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const usuario = await Usuario.findById(decoded.id);

                if (!usuario || usuario.tipo !== 'Chofer') {
                    socket.send(JSON.stringify({ event: 'unauthorized', message: 'Solo los choferes pueden conectarse.' }));
                    return socket.close();
                }

                console.log(`Usuario conectado: ${usuario.nombreCompleto}`);

                // Registrar inicio de sesión
                const usuarioActivo = new UsuarioActivo({ usuario: usuario._id });
                await usuarioActivo.save();

                socket.send(JSON.stringify({ event: 'authenticated', message: 'Autenticación exitosa' }));
            } catch (err) {
                console.error('Error en la autenticación:', err);
                socket.send(JSON.stringify({ event: 'unauthorized', message: 'Token inválido' }));
                socket.close();
            }
        }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server running');
}

module.exports = setupWebSocket;