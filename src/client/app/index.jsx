import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import Client from './index2.jsx';
import moment from 'moment';

class SupportDesk extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages') || '[]'),
      user: 'Steaven(Dummy)',
      client: '',
      inQueuedClients: [],
      dequeuedClients: [],
    }
    this.messageSubmit = this.messageSubmit.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

joinRoom = client => {
  console.log('inside joinRoom function!!!!', client)
  this.setState({client: client.clientName})
  this.socket.emit('join helpDesk to room', client, data => {
    let clientToDequeue = client;
    if(data){
      console.log("++++++++this CLient object is ", client);
      this.setState({messages: []});
      let message = {body: 'You are Now connected!', from: "Admin", time: null, img: null}
      this.setState({ messages: [...this.state.messages, message] })
      this.state.inQueuedClients.filter( inQueue => inQueue.socketId !== client.socketId);
      this.state.dequeuedClients.push(client);
      console.log('inque+++++++++', this.state.inQueuedClients);
      console.log('Deque+++++++++', this.state.dequeuedClients);      
    }else{
      alert('Failed to connect to this client!!');
    }
  });
};

messageSubmit = event => {
  const body = event.target.value
  if (event.keyCode === 13 && body) {
    const message = {
      body,
      from: this.state.user,
      time: moment().calendar(),
      img: null,
    }
    this.socket.emit('message', message);
    event.target.value = ''
  }
};


componentDidMount(){
  this.socket = io('/')
  this.socket.emit('add helpDesk to rooms')
  this.socket.emit('get clients');

  this.socket.on('clients', data => {
    console.log('receive clients', data.clients);
    this.setState({ inQueuedClients: data.clients}, () => {
      console.log("here are all the room sockets ", this.state.inQueuedClients.length);
    })
  });
  
  this.socket.on('dequeuedClients', data => {
    console.log('recieved dequeued clients are ,', data.clients);
    this.setState({dequeuedClients: data.clients}, () => {
      console.log("here are all the room sockets ", this.state.dequeuedClients.length);
      
    })
  });
  
  this.socket.on('message', message => {
    this.setState({ messages: [...this.state.messages, message] })
  })

  this.socket.on('private message', (client, message) => {
    this.setState({ messages: [...this.state.messages, message] })
  });
}

  render(){
    //MUST ADD ON_HOVER TIME TO EACH TEXT MESSAGE
    console.log('inside helpDesk render')
    const messages = this.state.messages.map((message, index) => {
    // const temp =  'http://dummyimage.com/250x250/000/fff&text=' + message.from.charAt(0).toUpperCase()
    return message.from === this.state.user ? <div className='SupportDeskmsgFormat' key={index}>
               <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div> : message.from === 'Admin' ? <div className='AdminMsgFormat' key={index}>
               <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div> : <div className='msgFormat' key={index}>
                <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div>
  })
  //the following inQueuedClients are clients awaiting for help from support team
  const clientsInQueue = this.state.inQueuedClients.map((client, index) => {
    return <div key={index}>
              <button className="roomButton" onCl={() =>
                this.joinRoom(client)}>
                 <span><b>{client.clientName}:</b></span> {client.roomId ? client.roomId.slice(-4) : '????'}
              </button>
            </div>
  })

   //the following deQueuedClients are clients currently having active conversations
  const clientsDequeued = this.state.dequeuedClients.map((client, index) => {
    return <div key={index}>
              <button className="roomButton">
                 <span><b>{client.clientName}:</b></span> {client.roomId ? client.roomId.slice(-4) : '????'}
              </button>
            </div>
  })

    return (
      <div className="_window">
        <div className='_windowHeader'>
          <p>Conversations</p>
          <span>with Chattagong</span>
          <button className="_logButton">LogIn</button>
        </div>
          <div className='_windowBody'>
            <div className= "_windowLeft">
              <div className="_inQueuedClients">
                <h3>Clients In Queue : click a Client To Help</h3>
                {clientsInQueue}
              </div>
              <div className="_dequeuedClients">
                <h3>Clients currently in conversation</h3>
               {clientsDequeued}
              </div>
            </div>
            <div className="_windowRight">
              <div className="_chatWindow">
                <h3>Chat window</h3>
                <div className='chatArea'>
                  {messages}
                </div>
                <div className='chattagong-link'>
                 <a href="https://github.com/DebOM/Chattagong-IntercomCommunication" target="_blank">We run on Chattagong</a>
               </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 'medium', borderTopStyle: 'dotted'}}>
                <textarea className='_textArea' placeholder="Send a message…" onKeyUp={this.messageSubmit}></textarea>
                  <div className='gif'>
                  </div>
                  <div className='smiley'>
                  </div>
                  <div className='attachment'>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className="_windowFooter">
          Copyright © 2017-2020 by Debasish Mozumder. All rights reserved.
        </div>
      </div>
    )
  }
}

render(<SupportDesk />, document.getElementById('support'));
