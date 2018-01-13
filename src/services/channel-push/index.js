const SocketServerIO = require( "socket.io" );
const randomstring = require("randomstring");

const socketStorage = require('./socket-storage');

function init(httpServer) {
  const io = new SocketServerIO(httpServer);

  io.on('connection', socket => {
    let token;
    do {
      token = randomstring.generate({
        length: 7,
        readable: true,
      });
    } while(socketStorage.includes(token));

    socketStorage.add(token, socket);

    console.log(`New client connection with the token '${token}'`);

    const dataToSend = {
      token,
    };
    socket.emit('token-assignment', dataToSend);

    socket.on('disconnect', () => {
      console.log(`Client leave : delete token '${token}'`);
      socketStorage.remove(token);
    });
  });
}

module.exports = {
  init,
};