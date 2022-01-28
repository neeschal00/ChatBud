const io = require('socket.io')();
const socketapi = {
    io: io,
};

io.on('connection', (socket) => {
    console.log('a user connected');
});


module.exports = socketapi;