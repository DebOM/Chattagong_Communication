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
            <button style={{width: 60, height: 60, backgroundColor: '#1568c0', border: 'none', borderRadius: 50}} onClick={() => this.handleMessageArea()}>
              {this.state.chatWindow ? <h2 style={{fontSize: 25, color: '#f8f8f8'}}>X</h2> :
              <img style={{width: 60, height: 60}} src='../images/msg_ON.png'/> }
            </button>
          </div>
        </div>
    )
  }
}

// injectTapEventPlugin();
// render(<Client />, document.getElementById('client'));
export default Client;
