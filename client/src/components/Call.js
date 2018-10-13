import React, { Component } from 'react';
import './Call.css';

export default class Call extends Component {

  constructor(props) {
    super(props);

    this.socket = this.props.socket;
    this.socket.on('call', this.show);

    this.state = {
      user: null,
      call: null
    };
  }

  render() {
    if (this.state.user) {
      return (
        <div className='Call'>
          {this.state.call.from} is calling you...<br />
          <button onClick={this.answerCall}>Answer</button>
          <button onClick={this.declineCall}>Decline</button>
        </div>
      );
    } else {
      return (null);
    }
  }

  show = (call) => {
    console.log(call);
    this.setState({
      call: call
    });
  }

  hide = () => {
    this.setState({
      call: null
    });
  }

  answerCall = () => {
    this.socket.emit('answeredCall', this.state.call);
    this.hide();
  }

  declineCall = () => {
    this.socket.emit('declinedCall', this.state.call);
    this.hide();
  }
}