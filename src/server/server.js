var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users  = [];
var connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running....');

app.use(express.static(path.join(__dirname, '../client')));
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/client/index.html');
// });

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  socket.on('disconnect', function(data){
    if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updatausers();

    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s socket connected', connections.length);
  });
  //send Message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  //new users\
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updatausers();
  });

  function updatausers(){
    io.sockets.emit('get users', users);
  }
});
