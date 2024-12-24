const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
const UsuarioActivo = require('./models/UsuarioActivo');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: "https://maps.duck-hack.cloud",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', async (socket) => {
    console.log('Nueva conexión');

    // Autenticar usuario
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario || usuario.tipo !== 'Chofer') {
          socket.emit('unauthorized', 'Solo los choferes pueden conectarse.');
          return socket.disconnect();
        }

        console.log(`Usuario conectado: ${usuario.nombreCompleto}`);

        // Registrar inicio de sesión
        const nuevaSesion = new UsuarioActivo({
          fechaInicio: new Date(),
          chofer: usuario._id,
        });
        await nuevaSesion.save();

        // Guardar sesión en el socket
        socket.sesion = nuevaSesion;

        socket.emit('authenticated', 'Conexión exitosa.');

        // Desconexión
        socket.on('disconnect', async () => {
          console.log(`Usuario desconectado: ${usuario.nombreCompleto}`);

          if (socket.sesion) {
            socket.sesion.fechaFin = new Date();
            const tiempoConectado = (socket.sesion.fechaFin - socket.sesion.fechaInicio) / 1000;
            console.log(`Duración de la sesión: ${tiempoConectado} segundos`);

            await socket.sesion.save();
          }
        });
      } catch (err) {
        console.error('Error en autenticación:', err.message);
        socket.emit('unauthorized', 'Token inválido.');
        socket.disconnect();
      }
    });
  });
};