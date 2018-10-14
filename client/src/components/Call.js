import React, { Component } from 'react';
import { FaPhone } from 'react-icons/fa';
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
    // whenever a render is called
    // whenever state.call != null
    // html audio element.play
    // whenever state.call == null 
    // stop html audio element play
  }
  // referencing audio element
  // same way of getting references to input boxes in chat
  render() {
    if (this.state.call) {
      return (
        <div className='Call'>
          {this.state.call.from} is calling you...<br />
          <div>
            <FaPhone onClick={this.answerCall} className='CallUser' />
            <FaPhone onClick={this.declineCall} className='HangupUser' />
          </div>
        </div>
      );
    } else {
      return (null);
    }
  }


  playAudio = (audio) => {
    console.log("poo playing audio");
    let sound = new Audio("http://soundbible.com/mp3/Pling-KevanGC-1485374730.mp3")
    sound.play();
  }

  show = (call) => {
    this.ring = setInterval(() => {
      this.playAudio();
    }, 500);
    console.log(call);
    this.setState({
      call: call
    });
  }

  hide = () => {
    clearInterval(this.ring);
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