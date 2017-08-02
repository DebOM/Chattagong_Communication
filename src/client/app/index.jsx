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
      clientsInQueue: [],
      clientsInCoversation: [],
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
      //IF DATABASE IS READY HERE WE WANT TO QUERY THE DB FOR MESSAGES OF THIS CLIENT
      let message = {body: `You are Now connected WITH ${client.clientName+':'+client.roomId.slice(-4)} !`, from: "Admin", time: null}
      this.setState({ messages: [...this.state.messages, message] }) //this message only statically renders in the state. 

      // this.state.clientsInQueue = this.state.clientsInQueue.filter( inQueue => inQueue.socketId !== client.socketId);
      // this.state.clientsInCoversation.push(client);
      console.log('Deque+++++++++', this.state.clientsInCoversation); 
      // shouldComponentUpdate => true;
      
           
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

  this.socket.on('clientsInQueue', data => {
    console.log('receive clients', data.clients);
    this.setState({ clientsInQueue: data.clients}, () => {
      console.log("here are all the room sockets ", this.state.clientsInQueue.length);
    })
  });
  this.socket.on('clientsInCoversation', data => {
    console.log('recieved dequeued clients are ,', data.clients);
    this.setState({clientsInCoversation: data.clients}, () => {
      console.log("here are all the room sockets ", this.state.clientsInCoversation.length);
      
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
  //the following clientsInQueue are clients awaiting for help from support team
  const clientsInQueue = this.state.clientsInQueue.map((client, index) => {
    return <div key={index}>
              <button className="roomButton1" onClick={() =>
                this.joinRoom(client)}>
                 <span><b>{client.clientName}:</b></span> {client.roomId ? client.roomId.slice(-4) : '????'}
              </button>
            </div>
  })

   //the following clientsInCoversation are clients currently having active conversations
  const clientsInCoversation = this.state.clientsInCoversation.map((client, index) => {
    return <div key={index}>
              <button className="roomButton2">
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
              <div className="_clientsInQueue">
                <h3>Clients In Queue : click a Client To Help</h3>
                {clientsInQueue}
              </div>
              <div className="_clientsInCoversation">
                <h3>Clients currently in conversation</h3>
                {clientsInCoversation}
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
