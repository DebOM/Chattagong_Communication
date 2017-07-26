const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);
console.log('server running....ON PORT 8080');

app.use(express.static(path.join(__dirname, '../client')));


let usernames = {};
let clientsRooms = [];
let helpDeskRooms = [];

//CONNECTION ESTABLISHED ON DEFAULT NAMESPACE;
io.on('connect', socket => {

//THIS EVENT ADD THE SOCKET TO CLIENTROOMS, IF NAME IS VALID
  socket.on('add client to rooms', (client, callback) => {
    if(client.length > 0){
      let thisSocket = socket;
      thisSocket.username = client;
      ///JUST ADDED THIS LINE, JUST INCASE CANT JOIN ROOM THROUGH ID;
      thisSocket.room = client+socket.id.slice(-4);
      clientsRooms.push(thisSocket);
      clientRoomsData = clientsRooms.map(room => ({id: room.id, clientName: room.username, room: null}));
      console.log('total number clients rooms ,' + clientsRooms.length);
      io.emit('clients', { clients: clientRoomsData });
      callback(true);
    }else{
      callback(false);
    }
  });

//LATER WHEN AUTHENTICATION IS READY AND USER DATA TO THIS SOCKET
  socket.on('add helpDesk to rooms', helpDesk => {
    helpDeskRooms.push(socket);
    socket.emit('helpDesk Added')
    console.log('total number helpdesk rooms ,' + helpDeskRooms.length);
  });

  socket.on('join client to room', data => {
    console.log("inside join client room, id is ," + data.id)
    socket.join(data.id);
    // this.socket.emit('join client room', value);)
    // socket.to(<socketid>).emit('hey', 'I just met you');
  });

//THIS EVENT HANDLE MESSAGE COMING IN AND OUT
  socket.on('private message', (client, message) => {
    socket.to(client).emit('private message', {
      body: message.body,
      from: message.from,
      time: message.time,
      img: null,
    })
  });

//THIS EVENT HANDLE MESSAGE COMING IN AND OUT
  socket.on('message', message => {
    io.emit('message', {
      body: message.body,
      from: message.from,
      time: message.time,
      img: null,
    })
  });

//THIS EVENT MADE SPECIFICALY FOR HELPDESK TO DISPLAY ALL ACTIVE CLIENT ROOMS
  socket.on('get clients', data => {
    clientRoomsData = clientsRooms.map(room => ({id: room.id, clientName: room.username}));
    console.log('inside get clients! total clients ,', JSON.stringify(clientRoomsData), clientRoomsData.length)
    //clientRoomsData IS FOR helpDesk TO USE, ADD PROPERTY TO THIS OBJECT AS NEEDED FOR THE CLIENT SIDE
    io.emit('clients', { clients: clientRoomsData });   //????clientsRooms[clientsRooms.length-1]
  });

//THIS EVENT REMOVES THE SOCKET FROM CLIENTS ROOM AS THEY LEAVE OR CLOSES CHAT WINDOW
  socket.on('disconnect', () => {
    if(socket.username){
      console.log(socket.id + ", this socket is disconnected from clientsRooms")
      clientsRooms = clientsRooms.filter(room => {
        return room.id !== socket.id;
      })
      console.log("total clientsRoomsroom after removed , " + clientsRooms.length)
    }else{
      console.log(socket.id + ", this socket is disconnected form helpDeskRooms")
      helpDeskRooms = helpDeskRooms.filter(room => {
        return room.id !== socket.id;
      })
      console.log("total helpDeskRooms after removed , " + helpDeskRooms.length)
    }
  });

});
