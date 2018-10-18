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
        <Scrollbars ref={el => { this.scroll = el }}><div className='Messages'>{chats}</div></Scrollbars>
        <div className='ChatControls'>
          <div className='field has-addons'>
            <div className='control Input'>
              <input className='input' ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' />
            </div>
            <div className='control'>
              <button onClick={this.onSendClicked} className='button'><i className='fa fa-send' /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.scroll.scrollToBottom();
  }

  componentDidMount() {
    let message = 'Send this code to others: ' + this.props.room + ' to join your room.';
    this.setState({
      chats: this.state.chats.concat({ key: Date.now(), message: message })
    });
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log("enter");
      let text = this.input.value;
      this.sendChat(text);
    }
  }

  onSendClicked = () => {
    let text = this.input.value;
    this.sendChat(text);
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
    this.socket.emit('chat', { message: text });
    this.input.value = null;
  }
}
