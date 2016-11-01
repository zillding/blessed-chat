/* eslint-disable no-console */

const app = require('http').createServer();
const io = require('socket.io')(app);

const config = require('../config');
const events = require('../events');

const { CHAT_MESSAGE } = events;

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on(CHAT_MESSAGE, msg => {
    socket.broadcast.emit(CHAT_MESSAGE, msg);
  });
});

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
