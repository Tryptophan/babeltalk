import React, { Component } from 'react';
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      lang: 'en'
    };
    this.socket = this.props.socket;
    this.socket.on('chat', this.receivedChat);
  }
  render() {

    // TODO: Render scrolling chat log of previous messages
    // TODO: Enter chats into input tag and send by hitting enter or clicking send
    console.log(this.state.chats);

    let chats = this.state.chats.map(chat => (
      <li key={chat.key}>{chat.message}</li>
    ));

    return (
      <div className='Chat'>
        <ul>{chats}</ul>
        <input ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' id='insertBox' />
        <button id='sendBtn' onClick={this.sendClicked}>Send</button>
        <select onChange={this.handleChange}>
          <option value="en">en</option> 
          <option value="es">es</option>
        </select>
      </div>
    );
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log("enter");
      let text = event.target.value;
      this.sendChat(text);
    }

  }

  sendClicked = () => {
    this.sendChat(this.input.value);
  }


  receivedChat = (chat) => {
    console.log(chat);
    console.log("recieved a chat");
    this.setState({
      chats: this.state.chats.concat(chat)
    });
  }

  sendChat = (text) => {
    this.socket.emit('chat', { message: text, lang: this.state.lang });
    this.input.value = null;
  }

  handleChange = (event) =>{
    console.log("lang change event");
    console.log(event.target.value);
    this.setState({
      lang: event.target.value
    });
    // this.socket.emit(tell the server that language has changed)
    this.socket.emit('lang', {lang: event.target.value});

  }
}


