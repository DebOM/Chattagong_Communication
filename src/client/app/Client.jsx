import React from 'react';
// import { SocketProvider, socketConnect } from 'socket.io-react';
import io from 'socket.io-client';
import moment from 'moment';


class ChatterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: '',
    }

    this.insideFooter = (
      // const userN = ''
      <div className='startChat'>
        <input type= 'text' className='nameEntry' placeholder='Enter Your Name' onChange={(e) => this.handleChange(e)}></input>
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
                  //IF TYPE IN USER IS INVALID WE CAN TRIGER SOMETHING HERE, NOW NOTHINGS HAPPEN
                alert('please type in a valid name')
              }
              this.forceUpdate();
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
      time: moment().format('LT'),
      img: null,
    }
    // this.setState({ messages: [...this.state.messages, message] })
    this.socket.emit('message', message)
    event.target.value = ''
  }
}

  handleChange(event) {
     this.setState({user: event.target.value});
   }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount () {
    console.log('inside componentDidMount')
    this.socket = io('/')
    this.socket.on('message', message => {
      this.setState({ messages: [...this.state.messages, message] })
    })
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  render(){

    console.log('render')
      const messages = this.state.messages.map((message, index) => {
      // const temp =  'http://dummyimage.com/250x250/000/fff&text=' + message.from.charAt(0).toUpperCase()
      // const img = message.img ? <img src={message.img} width='200px' /> : <img src={temp} width='200px' />
      return <div className='msgFormat' key={index}>
                <b>{message.from}: </b>{message.body} {message.time} {message.img}
              </div>
    })
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
            <span>3 weeks ago</span>
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
