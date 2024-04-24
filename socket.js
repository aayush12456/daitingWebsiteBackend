const socketCon = {
    init : server => {
        const io = require('socket.io')(server,{
            cors : 'http://localhost:4000'
        })
        io.on('connection' , socket => {
            console.log('client connected');
        })
        return io
    },
    getIO: function() {
        if (this.io) {
            return this.io;
        }
    }
};

module.exports = socketCon