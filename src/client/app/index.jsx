import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import Client from './index2.jsx';
import moment from 'moment';

class SupportDesk extends React.Component {
  constructor(props){
    super(props)
    // console.log("inside SupportDesk Constructor, passedin props is , ", props)
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages') || '[]'),
      user: 'Steaven(Dummy)',
      client: '',
      onlineClients:JSON.parse(localStorage.getItem('onlineClients') || '[]'),
      offlineClients:JSON.parse(localStorage.getItem('offlineClients') || '[]'),
    }
    this.messageSubmit = this.messageSubmit.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

joinRoom = client => {
  console.log('inside joinRoom function!!!!', client)
  this.setState({client: client.clientName}) //IF DATA PERSISTENCE IS UNNECCESARY, UNCOMMENT THIS, COMMENTOUT NEXT LINE
  // localStorage.setItem('client', JSON.stringify(this.state));
  // localStorage[client] = client; 
  this.socket.emit('join helpDesk to room', client, data => {
    if(data){
      let message = {body: 'You are Now connected!', from: "Admin", time: null, img: null}
    this.setState({ messages: [...this.state.messages, message] })      
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

// componentWillMount(){
//   console.log("componentWillMount")
// }
// componentDidUpdate(){
//   console.log("componentDidUpdate")
//   // this.socket.emit('get clients');
// }

// componentWillUpdate(){
//  console.log("componentWillUpdate")
// }

// componentWillUnmount() {
//   console.log('componentWillUnmount')
// }
//
// getClients() {
//   this.socket.emit('get clients');
// }

componentDidMount(){
  this.socket = io('/')
  this.socket.emit('add helpDesk to rooms')
  this.socket.emit('get clients');

  this.socket.on('clients', data => {
    console.log('receive clients', data.clients);
    this.setState({ onlineClients: data.clients}, () => {
      console.log("here are all the room sockets ", this.state.onlineClients.length);
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
    //MUST ADD ON HOVER TIME TO EACH TEXT MESSAGE
    console.log('inside helpDesk render')
    const messages = this.state.messages.map((message, index) => {
    // const temp =  'http://dummyimage.com/250x250/000/fff&text=' + message.from.charAt(0).toUpperCase()
    // const img = message.img ? <img src={message.img} width='200px' /> : <img src={temp} width='200px' />
    return message.from === this.state.user ? <div className='SupportDeskmsgFormat' key={index}>
               <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div> : message.from === 'Admin' ? <div className='AdminMsgFormat' key={index}>
               <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div> : <div className='msgFormat' key={index}>
                <b>{message.from}: </b>{message.body} {/*message.time*/}  
            </div>
  })

  const activeClients = this.state.onlineClients.map((client, index) => {
    return <div key={index}>
              <button className="roomButton" onClick={() =>
                this.joinRoom(client)}>
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
              <div className="_onlineClients">
                <h3>Clients currently need help : click a Client To Help</h3>
                {activeClients}
              </div>
              <div className="_offlineClients">
                <h3>Clients currently in conversation</h3>
               <Client /> 
              </div>
            </div>
            <div className="_windowRight">
              <div className="_chatWindow">
                <h3>This is the Chat window</h3>
                <div className='chatArea'>
                  {messages}
                </div>
                <textarea className='_textArea' placeholder="Send a message…" onKeyUp={this.messageSubmit}></textarea>
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
