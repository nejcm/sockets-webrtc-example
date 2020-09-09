/* eslint-disable babel/new-cap */
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const port = process.env.PORT || 3001;
const users = {};

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
    socket.broadcast.emit('user-connected', {
      message: `User ${user.name || ''} connected.`,
      count: users.length,
    });
  });

  socket.on('send-message', (message) => {
    socket.broadcast.emit('new-message', {
      user: users[socket.id],
      message,
    });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id] || {};
    socket.broadcast.emit('user-disconnected', {
      message: `User ${user.name || ''} disconnected.`,
      count: users.length,
    });
    delete users[socket.id];
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
