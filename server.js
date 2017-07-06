var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users  = [];
var connection = [];

server.listen(process.env.PORT || 3000);
console.log('server running....')
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  connnections.splice(connections.indexOf(socket), 1)
  console.log('Disconnected: %s socket connected', connections.length);
});
