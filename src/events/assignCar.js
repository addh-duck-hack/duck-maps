// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/events/setUnidad.js
const Session = require('../models/Session');

async function assignCar(socket, message) {
    const { car, token } = message;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const session = await Session.findOne({ user: decoded.id, connection: null });
        if (session) {
            session.car = car;
            await session.save();
            socket.send(JSON.stringify({ event: 'unidadSet', message: 'Unidad asignada exitosamente' }));
        } else {
            socket.send(JSON.stringify({ event: 'error', message: 'Usuario no autenticado o sesión no encontrada' }));
        }
    } catch (err) {
        console.error('Error al asignar unidad:', err);
        socket.send(JSON.stringify({ event: 'error', message: 'Error al asignar unidad' }));
    }
}

module.exports = assignCar;