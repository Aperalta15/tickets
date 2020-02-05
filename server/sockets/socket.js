const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl(); 

io.on('connection', (client) => {
    client.on('siguienteTicket', (data, callback) => {
        const ticket = ticketControl.siguiente();
        console.log('Siguiente Ticket: ', ticket);
        callback(ticket);
    });

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) =>{
        if(!data.escritorio){
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }
        
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        if(atenderTicket != 'No hay tickets'){
            client.broadcast.emit('ultimos4', {
                ultimos4: ticketControl.getUltimos4()
            });
        }
        
    });
});