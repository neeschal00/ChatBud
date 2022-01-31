const io = require('socket.io')({cors: 
    {origin: '*'}});
const socketapi = {
    io: io,
};

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    });
});


module.exports = socketapi;