import React, { Component } from 'react';
import './Chat.css';
import langs from '../languages';
import { Scrollbars } from 'react-custom-scrollbars';

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
    let localLang = navigator.language;
    langs.forEach(lang => {
      if (lang.code === localLang) {
        this.setState({
          lang: localLang
        });
      }
    });
  }

  render() {

    // TODO: Render scrolling chat log of previous messages
    // TODO: Enter chats into input tag and send by hitting enter or clicking send

    let chats = this.state.chats.map(chat => (
      <p key={chat.key}><span className='ChatDate'>{chat.date}</span> {chat.message}</p>
    ));

    let langList = langs.map(lang => (
      <option value={lang.code} key={lang.code}>{lang.name}</option>
    ));

    return (
      <div className='Chat'>
        <Scrollbars className='Messages' ref={el => { this.scroll = el }}><div>{chats}</div></Scrollbars>
        <div className='ChatControls'>
          <input ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' type='text' />
          <button onClick={this.sendClicked}>Send</button>

          <select value={this.state.lang} onChange={this.handleChange}>
            {langList}
          </select>
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
