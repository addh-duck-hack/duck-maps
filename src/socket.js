const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
const UsuarioActivo = require('./models/UsuarioActivo');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: "https://maps.duck-hack.cloud",
      methods: ["GET", "POST"],
      credentials: true
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

        // Usuario autenticado
        socket.emit('authenticated', 'Usuario autenticado');
        console.log(`Usuario ${usuario.nombre} autenticado`);

        // Agregar usuario a la lista de usuarios activos
        const usuarioActivo = new UsuarioActivo({ usuario: usuario._id, socketId: socket.id });
        await usuarioActivo.save();

        // Manejar desconexión
        socket.on('disconnect', async () => {
          await UsuarioActivo.findOneAndDelete({ socketId: socket.id });
          console.log(`Usuario ${usuario.nombre} desconectado`);
        });

      } catch (err) {
        socket.emit('unauthorized', 'Token inválido');
        return socket.disconnect();
      }
    });
  });
};