import React, { Component } from 'react';
import io from 'socket.io-client';

import langs from '../languages';

// Component Imports
import Users from './Users';
import Video from './Video';
import Chat from './Chat';
import Call from './Call';

// CSS Import
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: 'en',
      username: null
    };

    this.socket = io(process.env.REACT_APP_SOCKET_SERVER);
  }

  render() {
    let langList = langs.map(lang => (
      <option value={lang.code} key={lang.code}>{lang.name}</option>
    ));

    if (!this.state.username) {
      console.log('rendering screen');
      return (
        <div className='App'>
          <select value={this.state.lang} onChange={this.handleChange}>
            {langList}
          </select>
          <div className='Splash'>
            <div className='Title'>BABEL TALK</div>
            <div className='Subtitle'>The real-time video calling voice-to-voice translation app!</div>
            <input type='text' onKeyPress={this.onKeyPress} ref={el => { this.input = el }} placeholder="What's your name?" />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className='App'>
          <select value={this.state.lang} onChange={this.handleChange}>
            {langList}
          </select>
          <Call socket={this.socket} />
          <Users username={this.state.username} socket={this.socket} />
          <div className='VideoChat'>
            <Video lang={this.state.lang} socket={this.socket} />
            <Chat lang={this.state.lang} socket={this.socket} />
          </div>
        </div>
      );
    }
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      let text = this.input.value;
      this.setState({
        username: text
      });
      this.input.value = null;
      this.socket.emit('join', { id: this.socket.id, username: text, lang: this.state.lang });
    }
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

export default App;
