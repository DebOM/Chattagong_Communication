const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);
console.log('server running....ON PORT 8080');

app.use(express.static(path.join(__dirname, '../client')));

let allActiveCLients = [];
let helpDeskUsernames= {};
let Rooms = [];
let allActiveHelpDesk = [];

//CONNECTION ESTABLISHED ON DEFAULT NAMESPACE;
io.on('connect', socket => {

//THIS EVENT ADD THE SOCKET TO CLIENTROOMS, IF NAME IS VALID
  socket.on('add client to rooms', (client, callback) => {
    console.log('step one', client)
    if (client.length > 0) {
      // let thisSocket = socket;
      let newRoom = client+'-'+socket.id.slice(-6);
      socket.room = newRoom;
      // thisSocket.username = client;
      socket.clientName = client;      
      ///JUST ADDED THIS LINE, JUST INCASE CANT JOIN ROOM THROUGH ID;
      // thisSocket.room = client+socket.id.slice(-4);
      // clientsRooms.push(thisSocket);
      let newClient= {clientName: client, roomId: newRoom, socketId: socket.id };
      console.log("step two new client obj", newClient)
      // allActiveCLients[client] = newClient;
      allActiveCLients.push(newClient);
      socket.join(newRoom);
      // clientRoomsData = clientsRooms.map(room => ({id: room.id, clientName: room.username, room: null}));
      console.log('total number allActiveCLients ,', allActiveCLients, allActiveCLients.length);
      callback(true);
      io.emit('clients', { clients: allActiveCLients });
    } else {
      callback(false);
    }
  });

  //THIS EVENT MADE SPECIFICALY FOR HELPDESK TO DISPLAY ALL ACTIVE CLIENT ROOMS
  socket.on('get clients', data => {
    // clientRoomsData = allActiveCLients.map(room => ({id: room.id, clientName: room.username}));
      console.log('total number allActiveCLients ,', allActiveCLients, allActiveCLients.length);    
    //clientRoomsData IS FOR helpDesk TO USE, ADD PROPERTY TO THIS OBJECT AS NEEDED FOR THE CLIENT SIDE
    io.emit('clients', { clients: allActiveCLients });   //????clientsRooms[clientsRooms.length-1]
  });

//LATER WHEN AUTHENTICATION IS READY AND USER DATA TO THIS SOCKET
  socket.on('add helpDesk to rooms', helpDesk => {
    // console.log('helooooooooooooo', socket)
    allActiveHelpDesk.push(socket);
    socket.emit('helpDesk Added')
    console.log('total number helpdesk rooms ,' + allActiveHelpDesk.length);
  });

  socket.on('join helpDesk to room', (data, callback) => {  
    let roomToJoin = data.roomId;
    socket.join(roomToJoin);
    socket.room = roomToJoin;
    let message = {
      body: 'Please Ask your Question, Someone is here to Help!',
      from: "Admin",
      time: null,
      img: null,
    }
    socket.broadcast.in(socket.room).emit('message', message);
    callback(true);
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
    io.in(socket.room).emit('message', {
      body: message.body,
      from: message.from,
      time: message.time,
      img: null,
    })
  });

//THIS EVENT REMOVES THE SOCKET FROM CLIENTS ROOM AS THEY LEAVE OR CLOSES CHAT WINDOW
  socket.on('disconnect', () => {
    if (socket.clientName) {
      console.log(socket.id + ", this socket is disconnected from allActiveCLients")
      allActiveCLients = allActiveCLients.filter(client => {
        return client.clientName !== socket.clientName;
      })
      console.log("total clientsRoomsroom after removed , " + allActiveCLients.length)
    } else {
      console.log(socket.id + ", this socket is disconnected form allActiveHelpDesk")
      allActiveHelpDesk = allActiveHelpDesk.filter(room => {
        return room.id !== socket.id;
      })
      console.log("total allActiveHelpDesk after removed , " + allActiveHelpDesk.length)
    }
  });

});
