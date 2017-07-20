var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);
console.log('server running....ON PORT 8080');

app.use(express.static(path.join(__dirname, '../client')));

var ns1 = io.of('/ns1'); // this is a custom defined namespace;

//connection establised on ns1 namespace;

var usernames = {};
var rooms = [];

io.sockets.on('connection', function (socket) {

    socket.on('joinUser', function (data) {
        var username = data.username;
        var room = data.room;

        if (rooms.indexOf(room) != -1) {
            socket.username = username;
            socket.room = room;
            usernames[username] = username;
            socket.join(room);
            socket.emit('updatechat', 'Admin', 'You are connected. Start chatting');
            socket.broadcast.to(room).emit('updatechat', 'Admin', username + ' has connected to this room');
        } else {
            socket.emit('updatechat', 'Admin', 'Please enter valid code.');
        }
    });

    socket.on('createRoom', function (data) {
      console.log(data);
        var new_room = ("" + Math.random()).substring(2, 7);
        rooms.push(new_room);
        data.room = new_room;
        socket.emit('updatechat', 'Admin', 'Your Chat Window is ready, Someone will Join you sortly:' + new_room);
        socket.emit('roomcreated', data);
    });

    socket.on('sendmessage', function (data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        if (socket.username !== undefined) {
            socket.broadcast.emit('updatechat', 'Admin', socket.username + ' has disconnected');
            socket.leave(socket.room);
        }
    });
});
