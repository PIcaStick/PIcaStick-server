const SocketServerIO = require( "socket.io" );
const randomstring = require("randomstring");

const usersStorage = require('../users-storage');

function init(httpServer) {
  const io = new SocketServerIO(httpServer);

  io.on('connection', socket => {
    let token;
    do {
      token = randomstring.generate({
        length: 7,
        readable: true,
      });
    } while(usersStorage.includes(token));

    console.log(`New client connection with the token '${token}'`);

    const userStorage = usersStorage.add(token);
    userStorage.socket = socket;

    const dataToSend = {
      token,
    };
    socket.emit('token-assignment', dataToSend);

    socket.on('disconnect', () => {
      console.log(`Client leave : delete token '${token}'`);
      usersStorage.remove(token);
    });
  });
}

module.exports = {
  init,
};