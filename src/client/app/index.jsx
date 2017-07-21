
import React from 'react';
import { render } from 'react-dom';
import ChatterBox from './ChatterBox.jsx';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// import RaisedButton from 'material-ui/RaisedButton';
// import ActionAndroid from 'material-ui/svg-icons/action/android';


class Main extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      messeges: [],
      messageArea: false,
    }
    this.handleMessageArea = this.handleMessageArea.bind(this);
  }

handleMessageArea() {
  this.setState({
    messageArea : !this.state.messageArea,
  })
  console.log(this.state.messageArea)
};


  render(){
    return (
      <div className='container'>
          {this.state.messageArea && <ChatterBox />}
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
render(<Main />,document.getElementById('app'));
