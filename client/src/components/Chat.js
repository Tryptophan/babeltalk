import React, { Component } from 'react';
import './Chat.css';
import langs from '../languages';

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

  componentDidMount() {
    let localLang = navigator.languages;
    langs.forEach(lang => {
      for (let i = 0; i < localLang.length; i++) {
        if (lang.code === localLang[i]) {
          this.setState({
            lang: localLang[i]
          });
        }
      }

    });
  }
  render() {

    // TODO: Render scrolling chat log of previous messages
    // TODO: Enter chats into input tag and send by hitting enter or clicking send
   
    let chats = this.state.chats.map(chat => (
      <li key={chat.key}>{chat.message}</li>
    ));

    let langList = langs.map(lang => (
      <option value={lang.code} key={lang.code}>{lang.name}</option>
    ));

    return (
      <div className='Chat'>
        <ul>{chats}</ul>
        <input ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' id='insertBox' />
        <button id='sendBtn' onClick={this.sendClicked}>Send</button>

        <select value={this.state.lang} onChange={this.handleChange}>
          {langList}
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
    let date = new Date(chat.key);
    console.log(date);
    chat.message = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " - " + chat.message;
    this.setState({
      chats: this.state.chats.concat(chat)
    });
  }

  sendChat = (text) => {
    this.socket.emit('chat', { message: text, lang: this.state.lang });
    this.input.value = null;
  }

  handleChange = (event) => {
    console.log("lang change event");
    console.log(event.target.value);
    this.setState({
      lang: event.target.value
    });
    // this.socket.emit(tell the server that language has changed)
    this.socket.emit('lang', { lang: event.target.value });

  }
}


