import React from 'react';
import { render } from 'react-dom';
import ChatterBox from './Client.jsx';

class Client extends React.Component {
  constructor (props){
    super(props);
    // console.log("inside client Constructor, passedin props is ,", props)
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
  };


  render(){
    return (
      <div className='container'>
        {this.state.chatWindow && <ChatterBox />}
          <div className= 'chat-img' >
            <button class="button" className='tempButton' onClick={() => this.handleMessageArea()}>
              {this.state.chatWindow ? <img style={{width: 30, height: 30}} src='../images/msg_OFF.png'></img> : 
              <img style={{width: 50, height: 50}} src='../images/msg_ON.png'></img>}
            </button>
          </div>
        </div>
    )
  }
}

// injectTapEventPlugin();
// render(<Client />, document.getElementById('client'));
export default Client;
