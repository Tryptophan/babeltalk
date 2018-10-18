import React, { Component } from 'react';
import io from 'socket.io-client';

import langs from '../languages';

// Component Imports
import Video from './Video';
import Chat from './Chat';

// CSS Import
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.min.css';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: 'en',
      room: null
    };

    this.socket = io(process.env.REACT_APP_SOCKET_SERVER);
    this.socket.on('room', this.onRoom);
  }

  render() {
    let langList = langs.map(lang => (
      <option value={lang.code} key={lang.code}>{lang.name}</option>
    ));

    if (!this.state.room) {
      return (
        <div className='App'>
          <select value={this.state.lang} onChange={this.handleChange}>
            {langList}
          </select>
          <div className='Splash'>
            <div className='Title'>BABEL TALK</div>
            <div className='Subtitle'>The real-time video calling voice-to-voice translation app!</div>
            <div className='Actions'>
              <button className='button' onClick={this.startRoom}>Start a room</button>
              <input onKeyPress={this.joinRoom} className='input' type='text' placeholder='Join a room' />
            </div>
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
          <div className='VideoChat'>
            <Video lang={this.state.lang} socket={this.socket} />
            <Chat room={this.state.room} lang={this.state.lang} socket={this.socket} />
          </div>
        </div>
      );
    }
  }

  startRoom = () => {
    this.socket.emit('room');
  }

  joinRoom = (event) => {
    if (event.key === 'Enter') {
      let room = event.target.value;
      event.target.value = null;
      this.socket.emit('room', room);
    }
  }

  onRoom = (room) => {
    this.setState({
      room: room
    });
  }


  componentDidMount() {
    let localLang = navigator.language;
    console.log(localLang);
    langs.forEach(lang => {
      if (localLang.includes(lang.code)) {
        this.setState({
          lang: localLang
        });
        this.socket.emit('lang', localLang);
      } else {

      }
    });
  }

  handleChange = (event) => {
    let lang = event.target.value;
    this.setState({
      lang: lang
    });
    this.socket.emit('lang', lang);
  }
}

export default App;
