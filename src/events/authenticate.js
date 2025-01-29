// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/events/authenticate.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const UsuarioActivo = require('../models/UsuarioActivo');

async function authenticate(socket, message) {
    const { token } = message;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario || usuario.tipo !== 'Chofer') {
            socket.send(JSON.stringify({ event: 'unauthorized', message: 'Solo los choferes pueden conectarse.' }));
            return socket.close();
        }

        console.log(`Usuario conectado: ${usuario.nombreCompleto}`);

        // Registrar inicio de sesión
        const usuarioActivo = new UsuarioActivo({
            fechaInicio: new Date(),
            usuario: usuario._id
        });
        await usuarioActivo.save();

        socket.send(JSON.stringify({ event: 'authenticated', message: 'Autenticación exitosa' }));
    } catch (err) {
        console.error('Error en la autenticación:', err);
        socket.send(JSON.stringify({ event: 'unauthorized', message: 'Error en la autenticación, el token no cuenta con el formato correcto o esta vencido.' }));
        socket.close();
    }
}

module.exports = authenticate;