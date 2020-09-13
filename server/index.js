/* eslint-disable babel/new-cap */
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const port = process.env.PORT || 3001;
const users = {};
const peers = {};

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(cors());

const router = express.Router();
router.get('/', (_req, res) => {
  res.send({ response: 'Hello!' }).status(200);
});
app.use(router);

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  socket.on('new-user', (user) => {
    users[socket.id] = user;
    // socket.join(roomId);
    // socket.to(roomId).broadcast.emit('user-connected', userId);
    const data = {
      user,
      message: `User ${user.name || ''} connected.`,
      count: users.length,
    };
    socket.broadcast.emit('user-connected', data);
  });

  socket.on('new-user-video', ({ id }) => {
    peers[socket.id] = id;
    const user = users[socket.id];
    const data = {
      peerId: id,
      message: `User ${user.name || ''} video connected.`,
      user,
    };
    socket.broadcast.emit('user-video-connected', data);
  });

  socket.on('send-message', (message) => {
    const user = users[socket.id];
    const data = {
      user,
      message,
    };
    socket.broadcast.emit('new-message', data);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id] || {};
    const peerId = peers[socket.id];
    const data = {
      user,
      peerId,
      message: `User ${user.name || ''} disconnected.`,
    };
    socket.broadcast.emit('user-disconnected', data);
    delete users[socket.id];
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
