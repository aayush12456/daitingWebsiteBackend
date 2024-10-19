
const express = require('express');
const http = require('http');
const db = require('./src/db/db');
const userRoutes = require('./src/routes/authRoutes');
const chatRoutes=require('./src/routes/chatRoutes')
const path = require('path');
const cors = require("cors");
const socketCon = require('./socket');

const app = express();
const server = http.createServer(app);

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://apnapandating.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/images', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/chat',chatRoutes)

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`server is connected at port of ${port}`);
});
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000', // or your frontend URL
        // origin: 'https://apnapandating.netlify.app',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
        pingTimeout:600000,
        pingInerval:25000
        // pingTimeout: 120000, // Reduced to 2 minutes
        // pingInterval: 10000, // Reduced to 10 seconds
    }
});
app.locals.io = io;
socketCon.init(io);
// Basic socket connection
io.on('connection', (socket) => {
    console.log('A new user connected with socket ID:', socket.id );
     
    // // Emit a connected message to the client
    // socket.emit('connected', `Socket connected: ${socket.id}`);
socket.on('sendMessage',(message)=>{
    io.emit('recieveMessage',message)
})
;
socket.on('typingMessage',(typeMssg)=>{
    io.emit('getTypingMessage',typeMssg)
})
socket.on('messageNotify',(message)=>{
    io.emit('recieveMessageNotify',message)
})

socket.on('recordChat',(message)=>{
    io.emit('recieveChatRecord',message)
})
socket.on('loginUser',(message)=>{
    io.emit('recieveLoginUser',message)
})
    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected with socket ID:', socket.id,'reason is',reason);
    });
});

module.exports = { io };
