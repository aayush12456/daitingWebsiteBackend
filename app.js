// const express=require('express')
// const db=require('../backend1/src/db/db')
// const userRoutes=require('./src/routes/authRoutes')
// const path=require('path')
// const cors = require("cors")
// const app=express();
// const corsOptions = {
//     origin: 'http://localhost:3000', // or '*' to allow requests from all origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // enable passing credentials (e.g., cookies)
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   };
//   app.use(cors(corsOptions));
//   app.use(express.json({ limit: '50mb' }))
//   app.use('/images', express.static(path.join(__dirname, 'public', 'uploads')));
//   app.use('/user',userRoutes)
//   const port=process.env.PORT|| 4000
// app.listen(port,()=>{
//     console.log(`server is connected at port of ${port}`)
// })

const express = require('express');
const http = require('http');
const db = require('../backend1/src/db/db');
const userRoutes = require('./src/routes/authRoutes');
const chatRoutes=require('./src/routes/chatRoutes')
const messageRoutes=require('./src/routes/messageRoutes')
const path = require('path');
const cors = require("cors");
const socketCon = require('./socket');

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/images', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/user', userRoutes);
app.use('/chat',chatRoutes)
app.use('/message',messageRoutes)
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`server is connected at port of ${port}`);
});

// Initialize socket.io
const io = socketCon.init(server);
io.on('connection' , socket => {
    socket.on('setup' , user => {
        socket.emit('connected' , `user connected : ${user}`)
    })
    socket.on('join chat' , user => {
        console.log('user is',user)
        socket.join(user)
    })
    socket.on('new message', newMessage => {
        // socket.to(newMessage.chat._id).emit('message received' , newMessage)
        console.log('new message data ',newMessage)
        console.log('chat id ',newMessage.chat._id)
        socket.to(newMessage.chat._id).emit('message received',newMessage)
    })
    socket.on('leave chat', (chatId) => {
        console.log(`User left chat: ${chatId}`);
        socket.leave(chatId);
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Additional cleanup logic if needed
    });
})


