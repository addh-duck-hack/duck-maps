// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/events/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

async function authenticate(socket, message) {
    const { token } = message;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            socket.send(JSON.stringify({ event: 'error', message: 'No se pudo encontrar el usuario. Error critico' }));
            return socket.close();
        }

        // Almacenar el ID del usuario en el objeto socket
        socket.userId = user._id;

        // Cuando el usuario es un chofer creamos la sesion vacia
        if (user.type == 'Chofer'){
            console.log(`Chofer conectado: ${user.nombreCompleto}`);
            // Registrar inicio de sesión
            const session = new Session({
                user: usuario._id
            });
            await session.save();

            socket.send(JSON.stringify({ event: 'authenticated', message: `Se creo la sesion del Chofer: ${user.nombreCompleto}` }));
        }else{
            console.log(`Usuario conectado: ${user.nombreCompleto} \nTipo: ${user.type}`);
            // Registrar inicio de sesión
            const session = new Session({
                user: usuario._id,
                connection: new Date()
            });
            await session.save();

            socket.send(JSON.stringify({ event: 'authenticated', message: `Se creo la sesion del ${user.type}: ${user.nombreCompleto}` }));
        }
    } catch (err) {
        console.error('Error en la autenticación:', err);
        socket.send(JSON.stringify({ event: 'unauthorized', message: 'Error en la autenticación, el token no cuenta con el formato correcto o esta vencido.' }));
        socket.close();
    }
}

module.exports = authenticate;