import React, { Component } from 'react';
import './Chat.css';
import { Scrollbars } from 'react-custom-scrollbars';

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
    // TODO: Enter chats into input tag and send by hitting enter or clicking send

    let chats = this.state.chats.map(chat => (
      <p key={chat.key}><span className='ChatDate'>{chat.date}</span> {chat.message}</p>
    ));

    return (
      <div className='Chat'>
        <Scrollbars className='Messages' ref={el => { this.scroll = el }}><div>{chats}</div></Scrollbars>
        <div className='ChatControls'>
          <input ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' />
          <button onClick={this.sendClicked}>Send</button>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.scroll.scrollToBottom();
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
    let date = new Date(chat.key);
    console.log(date);
    chat.date = date.getHours() + ":" + date.getMinutes();
    this.setState({
      chats: this.state.chats.concat(chat)
    });
  }

  sendChat = (text) => {
    this.socket.emit('chat', { message: text, lang: this.props.lang });
    this.input.value = null;
  }
}
