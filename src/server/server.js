const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const routes = require('./routes');


server.listen(process.env.PORT || 8080);
console.log('server running....ON PORT 8080');

app.use(express.static(path.join(__dirname, '../client')));
app.use(routes);

let clientsInQueue = [];
let clientsInCoversation = [];
let helpDeskUsernames= {};
let Rooms = [];
let allActiveHelpDesk = [];


//CONNECTION ESTABLISHED ON DEFAULT NAMESPACE;
io.on('connect', socket => {

//THIS EVENT ADD THE SOCKET TO CLIENTROOMS, IF NAME IS VALID
  socket.on('add client to rooms', (client, callback) => {
    console.log('step one', client)
    if (client.length > 0) {
      let newRoom = client+'-'+socket.id.slice(-6);
      socket.room = newRoom;
      socket.clientName = client;      
      let newClient= {clientName: client, roomId: newRoom, socketId: socket.id };
      console.log("step two new client obj", newClient)
      clientsInQueue.push(newClient);
      socket.join(newRoom);
      console.log('total number clientsInQueue ,', clientsInQueue, clientsInQueue.length);
      callback(true);
      io.emit('clientsInQueue', { clients: clientsInQueue });
    } else {
      callback(false);
    }
  });

  //THIS EVENT MADE SPECIFICALY FOR HELPDESK TO DISPLAY ALL CLIENT ROOMS IN QUEUE AND IN CONVERSATION
  socket.on('get clients', data => {
    //NEXT TWO LINE IS FOR helpDesk TO USE, ADD PROPERTY TO THIS OBJECT AS NEEDED FOR THE CLIENT SIDE
      io.emit('clientsInQueue', { clients: clientsInQueue });
      io.emit('clientsInCoversation', { clients: clientsInCoversation });
  });

//LATER WHEN AUTHENTICATION IS READY AND USER DATA TO THIS SOCKET
  socket.on('add helpDesk to rooms', helpDesk => {
    // console.log('helooooooooooooo', socket)
    allActiveHelpDesk.push(socket);
    socket.emit('helpDesk Added')
    console.log('total number helpdesk rooms ,' + allActiveHelpDesk.length);
  });

  //THIS EVENT JOINS A HELPDESK TO A CLIENT ROOM, ALSO IT UPDATES THE STATE OF CLIENTS ON THE CLIENT SIDE
  socket.on('join helpDesk to room', (data, callback) => {  
    let roomToJoin = data.roomId;
    socket.room = roomToJoin;
    socket.join(roomToJoin);
    let message = {
      body: 'Please Ask your Question, Someone is here to Help!', //HERE WE CAN ALSO SEND ALONG THE HELPDESK CLIENT INFO
      from: "Admin",
      time: null,
      img: null,
    }
    //NEXT TWO LINES CHANGES THE CURRENT STATE OF CLIENT, REMOVES FROM INQUEUE ARRAY TO IN CONVO ARRAY
    clientsInQueue = clientsInQueue.filter( inQueue => inQueue.socketId !== data.socketId);
    clientsInCoversation.push(data)
    io.emit('clientsInQueue', { clients: clientsInQueue });    
    io.emit('clientsInCoversation', { clients: clientsInCoversation });
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

//THIS EVENT REMOVES THE SOCKET FROM CLIENTS ROOMs AS THEY LEAVE OR CLOSES CHAT WINDOW
  socket.on('disconnect', () => {
    if (socket.clientName) {
      console.log(socket.id + ", this socket is disconnected from clientsInQueue")
      clientsInQueue = clientsInQueue.filter(client => {
        return client.clientName !== socket.clientName;
      });
      clientsInCoversation = clientsInCoversation.filter(client => {
        return client.clientName !== socket.clientName;
      });

      console.log("total clients in clientsInQueue after removed , " + clientsInQueue.length)
      console.log("total clients in clientsInCoversation after removed , " + clientsInQueue.length)
    } else {
      console.log(socket.id + ", this socket is disconnected form allActiveHelpDesk")
      allActiveHelpDesk = allActiveHelpDesk.filter(room => {
        return room.id !== socket.id;
      })
      console.log("total allActiveHelpDesk after removed , " + allActiveHelpDesk.length)
    }
  });

});
