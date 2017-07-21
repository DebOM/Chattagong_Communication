import React from 'react';
import io from 'socket.io-client';



class ChatterBox extends React.Component {
  constructor(props) {
    super(props);

    this.insideFooter = (
      <div className='startChat'>
        <input className='nameEntry' placeholder='Enter Your Name'></input>
      <button
        onClick={() => {
          this.insideFooter = (
            <div className='chatField'>
              <textarea className='textArea' placeholder="Send a message…">
              </textarea>
              <div className='gif'>
              </div>
              <div className='smiley'>
              </div>
              <div className='attachment'>
            </div>
          </div>
          )
          this.forceUpdate();
        }}
      >
        Start Conversation
      </button>
    </div>
    )
  }

  render(){
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
            <p>Nick</p>
            <span>This is the first line...</span>
          </div>

          <div className='window-body-right'>
            <span>3 weeks ago</span>
          </div>

        </div>

        <div className='window-footer'>
          {this.insideFooter}
        </div>
      </div>
    )
  }
}

export default ChatterBox;
