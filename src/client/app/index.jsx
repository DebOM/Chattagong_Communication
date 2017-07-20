
import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';

class Main extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      messeges: [],
      messageArea: false,
    }
  }

handleMessageArea() {
  this.setState({
    messageArea : !this.state.messageArea,
  })
};


  render(){
    return (
      <div>
        <h1>ASK FOR HELP!</h1>

        {/* <input className= 'userName' placeholder='Enter name'></input>
        <button class="chatButton" ><span className="ButtonContent"><strong>Start Conversation</strong></span></button> */}
    </div>
    )
  }
}

render(<Main />,document.getElementById('app'));
