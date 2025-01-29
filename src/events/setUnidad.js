// filepath: /Users/jacobo/Documents/Duck-Hack/duck-maps/src/events/setUnidad.js
const UsuarioActivo = require('../models/UsuarioActivo');

async function setUnidad(socket, message) {
    const { unidad, token } = message;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioActivo = await UsuarioActivo.findOne({ chofer: decoded.id, fechaFin: null });
        if (usuarioActivo) {
            usuarioActivo.unidad = unidad;
            await usuarioActivo.save();
            socket.send(JSON.stringify({ event: 'unidadSet', message: 'Unidad asignada exitosamente' }));
        } else {
            socket.send(JSON.stringify({ event: 'error', message: 'Usuario no autenticado o sesión no encontrada' }));
        }
    } catch (err) {
        console.error('Error al asignar unidad:', err);
        socket.send(JSON.stringify({ event: 'error', message: 'Error al asignar unidad' }));
    }
}

module.exports = setUnidad;