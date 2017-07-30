import React from 'react';
// import { SocketProvider, socketConnect } from 'socket.io-react';
import io from 'socket.io-client';
import moment from 'moment';

class ChatterBox extends React.Component {
  constructor(props) {
    super(props);
    // console.log("inside ChatterBox Constructor, passedin props is , ", props)
    this.state = {
      messages: [],
      user: '',
    }

    this.insideFooter = (
      <div className='startChat'>
        <input type= 'text' className='nameEntry' placeholder='Enter Your Name...' onKeyUp={(e) => this.handleChange(e)}></input>
        <button
          onClick={() => {
            this.socket.emit('add client to rooms', this.state.user, data => {
              if(data){
                this.insideFooter = (
                  <div className='chatField'>
                    <textarea className='textArea' placeholder="Send a message…" onKeyUp={this.handleSubmit} >
                    </textarea>
                    <div className='gif'>
                    </div>
                    <div className='smiley'>
                    </div>
                    <div className='attachment'>
                    </div>
                  </div>
                )
              }else{
                //IF TYPE IN USERNAME IS INVALID WE CAN TRIGER SOMETHING HERE, NOW ONLY ALERTS
                alert('please type in valid name')
              }
                this.forceUpdate()
              })
            }
          }
        >
          Start Conversation
        </button>
      </div>
    )

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    const body = event.target.value
    if (event.keyCode === 13 && body) {
      const message = {
        body,
        from: this.state.user,
        time: moment().calendar(),
        img: null,
      }
      // this.setState({ messages: [...this.state.messages, message] })
      this.socket.emit('message', message);
      event.target.value = '';
    }
}

  handleChange(event) {
    // if(event.key === 'Enter'){
    this.setState({user: event.target.value});
    // }
  }

  // shouldComponentUpdate() {
  //   console.log('componentWillMount')
  //   return true;
  // }

  componentDidMount () {
    console.log('inside componentDidMount on client component')
    this.socket = io('/')
    this.socket.on('message', message => {
      this.setState({ messages: [...this.state.messages, message] })
    })
  }

// componentDidUpdate(){
//   console.log("componentDidUpdate")
// }

// componentWillUpdate(){
//  console.log("componentWillUpdate")
// }

// componentWillUnmount() {
//   console.log('componentWillUnmount')
// }

  render(){
    console.log('inside Client render')
    const messages = this.state.messages.map((message, index) => {
    // const temp =  'http://dummyimage.com/250x250/000/fff&text=' + message.from.charAt(0).toUpperCase()
    // const img = message.img ? <img src={message.img} width='200px' /> : <img src={temp} width='200px' />
      return message.from === 'Admin'  ? <div className='AdminMsgFormat' key={index}>
              <b>{message.from}: </b>{message.body} {message.time} {message.img}
            </div> : message.from === this.state.user ? <div className='SupportDeskmsgFormat' key={index}>
              <b>{message.from}: </b>{message.body} <span>{message.time}</span> {message.img}
            </div> : <div className='msgFormat' key={index}>
              <b>{message.from}: </b>{message.body} {message.time} {message.img}
            </div>
    });
    return (
      <div className='window'>
        <div className='window-header'>
          <p>Conversations</p>
          <span>with Chattagong</span>
        </div>
        <div className='window-body'>
          <div className='window-body-left'>
            {/* <img src='http://ofad.org/files/daily-photo/not-so-recent-and-random-portraits_0.jpg' /> */}
          </div>
          <div className='window-body-mid'>
            {/* <p>{}</p> */}
            <span>{messages}</span>
          </div>

          <div className='window-body-right'>
          </div>
        </div>
        <div className='chattagong-link'>
          <a href="https://github.com/DebOM/Chattagong-IntercomCommunication" target="_blank">We run on Chattagong</a>
        </div>
        <div className='window-footer'>
          {this.insideFooter}
        </div>
      </div>
    )
  }
}

export default ChatterBox;
