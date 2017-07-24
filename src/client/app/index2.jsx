
import React from 'react';
import { render } from 'react-dom';
import ChatterBox from './Client.jsx';


class Client extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      messeges: [],
      chatWindow: false,
    }
    this.handleMessageArea = this.handleMessageArea.bind(this);
  }

handleMessageArea() {
  this.setState({
    chatWindow : !this.state.chatWindow,
  })
  console.log(this.state.chatWindow)
};


  render(){
    return (
      <div className='container'>
          {this.state.chatWindow && <ChatterBox />}
          <div className= 'chat-img' >
              <img
                onClick={() => this.handleMessageArea()}
                style={{width: 50, height: 50}} src='../images/chat_icon.png'
              />
          </div>
        </div>
    )
  }
}

// injectTapEventPlugin();
// render(<Client />, document.getElementById('client'));
export default Client;
