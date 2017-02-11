const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const socket = require('socket.io')(server);

app.use('/vr', express.static(path.join(__dirname, 'vr')));

socket.on('connection', function (socket) {

  socket.emit('welcome', { playerId: 1 });

  socket.on('player-pos-update', function (data) {
    const { playerId, position } = data;
    console.log(playerId, position);
  });

});

server.listen(3000, function(){
  console.log('Listening on port 3000');
});

setTimeout(() => {
  socket.emit('all-players', 'Game over');
  console.log('sent message to all players: Game over');
}, 60000);
