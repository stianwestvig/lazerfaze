const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);

app.use('/', express.static(path.join(__dirname, 'web')));

server.listen(3000, function(){
  console.log('VR website ready on port 3000!');
});