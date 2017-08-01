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
  };


  render(){
    return (
      <div className='container'>
        {this.state.chatWindow && <ChatterBox />}
          <div className= 'chat-img' >
            <button style={{outline: 'none', padding: 0, width: 60, height: 60, backgroundColor: '#1568c0', border: 'none', borderRadius: 50}} onClick={() => this.handleMessageArea()}>
              {this.state.chatWindow ? <h2 style={{margin: 0, fontSize: 27, color: '#f8f8f8'}}>X</h2> :
              <img style={{width: 60, height: 60}} src='../images/msg_ON.png'/> }
            </button>
          </div>
        </div>
    )
  }
}

render(<Client />, document.getElementById('client'));
// export default Client;
