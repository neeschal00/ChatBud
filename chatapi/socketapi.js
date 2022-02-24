const io = require('socket.io')({cors: 
    {origin: '*'}});
const socketapi = {
    io: io,
};

const auth = require("./auth/auth");
// require("./config/database").connect();
const userModel = require("./models/userModel");
const chatModel = require("./models/chatModel");
const chatMessage = require("./models/chatMessages");
const addChat =(chatId,socketId) => {
    !chats.some(chat => chat.chatId === chatId) && chats.push({chatId,socketId});
}

io.use(auth.userSocketAuth);

let users = [];

const addUser =(userId,socketId) => {
    !users.some(user => user.userId === userId) && users.push({userId,socketId});
}

const removeUser =(userId,socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser =(userId) => {
    return users.find(user => user.userId === userId);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    userId = socket.decoded
    // socket.sendStatus("connected");
    console.log("userid is sock: ",userId);
    socket.emit('message', { message: `Welcome to the chat app ${userId} ` });
    socket.emit("userid",userId);
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        io.emit("getActive",users);
    })

    socket.on("sendMessage",({userId,chatId,text})=>{
        const user = getUser(userId);
        const chat = new chatMessage({
            chatId: chatId,
            senderId: userId,
            message: text,
            isSent: true,
        })
        chat.save();
        console.log("chat is ",chat);
        
        
        io.emit("getmessage",chat);
    });

    sendStatus = (status) => {
        socket.emit('status', status);
    }
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
        removeUser(socket.id);
        io.emit("getActive",users);
    });
});


module.exports = socketapi;