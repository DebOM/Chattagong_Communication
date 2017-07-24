var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);
console.log('server running....ON PORT 8080');

app.use(express.static(path.join(__dirname, '../client')));

// var ns1 = io.of('/ns1'); // this is a custom defined namespace;

//connection establised on ns1 namespace;

var usernames = {};
var rooms = [];

io.on('connection', socket => {
  rooms.push(socket);
  socket.on('message', message => {
    io.emit('message', {
      body: message.body,
      from: message.from,
      time: message.time,
      img: null,
      // from: socket.id.slice(8),
      // user: socket.username
    });
    console.log("server side ," + rooms.length)
  });

  socket.on('get clients', data => {
    var roomInfo = rooms.map(room => {
      return {id: socket.id, userName: socket.username};
    })
    socket.emit('get clients',{
      activeClients: "roomInfo",
    })
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ", this socket is disconnected")
  });
});
