import React, { Component } from 'react';
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    };
    this.socket = this.props.socket;
    this.socket.on('chat', this.receivedChat);
  }
  render() {

    // TODO: Render scrolling chat log of previous messages
    // TODO: Enter chat into input tag and send by hitting enter or clicking send
    console.log(this.state.chats);

    let messages = this.state.chats.map(chat => (
      <li key={chat.key}>{chat.text}</li>
    ));

    return (
      <div className='Chat'>
        <input onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' id='insertBox' />
        <button id='sendBtn' onclick={this.sendClicked}>Send</button>
        <input ref={el => { this.input = el }} />
      </div>
    );
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      let text = event.target.value;
      this.sendChat(text);
    }

  }

  sendClicked = () => {
    this.sendChat(this.input.value);
  }

  receivedChat = (chat) => {
    console.log(chat);
    this.setState({
      chats: this.state.chats.concat(chat)
    });
  }

  sendChat = (text) => {
    this.socket.emit('chat', { message: text });
    this.input.value = null;
  }
}