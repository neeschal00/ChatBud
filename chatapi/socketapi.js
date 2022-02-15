const io = require('socket.io')({cors: 
    {origin: '*'}});
const socketapi = {
    io: io,
};

const auth = require("./auth/auth");
// require("./config/database").connect();

io.use(auth.userSocketAuth);

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    userId = socket.decoded
    // socket.sendStatus("connected");
    console.log("userid is sock: ",userId);
    socket.emit('message', { message: `Welcome to the chat app ${userId} ` });
    socket.emit("userid",userId);

    sendStatus = (status) => {
        socket.emit('status', status);
    }
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    });
});


module.exports = socketapi;