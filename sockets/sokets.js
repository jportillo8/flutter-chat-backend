const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket')

// Mensajes de Sockets
io.on('connection', (client) => {
    
    console.log('Cliente conectado');
    // console.log(client.handshake.headers['x-token']);

    const [ valido, uid ] = comprobarJWT(client.handshake.headers['x-token'])
    // console.log( valido, uid );

    if (!valido) {
        console.log('Cliente no Autenticado');
        return client.disconnect()} 
    // Cliente autenticado En este punto... Entonces
    usuarioConectado(uid);
    console.log('Cliente Autenticado');

    // Ingresar al usario a una sala especifica
    // sala global, client.id , uid
    client.join(uid);
    // Escuchar el mensaje de un cliente
    client.on('mensaje-personal',  async (payload) => {
        // console.log(payload);
        // Enviar el mensaje a todos los clientes
        // io.emit('mensaje-nuevo', payload);
        // Enviar el mensaje a un cliente especifico

        // TODO guardar el mensaje en la base de datos
        await grabarMensaje (payload)

        io.to( payload.para ).emit('mensaje-personal', payload);
    })
    // si le quiero mandar un mensaje a un usuario especifico
    // client.to(uid).emit('mensaje', {})

    
    client.on('disconnect', () => { 
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');

   });

});