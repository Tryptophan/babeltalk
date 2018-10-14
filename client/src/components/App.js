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
      lang: 'en'
    };

    this.socket = io(process.env.REACT_APP_SOCKET_SERVER);
    this.socket.on('connect', () => {
      this.socket.emit('join', { id: this.socket.id, username: this.socket.id, lang: 'en' });
    });
  }

  render() {
    let langList = langs.map(lang => (
      <option value={lang.code} key={lang.code}>{lang.name}</option>
    ));
    return (
      <div className='App'>
        <select value={this.state.lang} onChange={this.handleChange}>
          {langList}
        </select>
        <Call socket={this.socket} />
        <Users socket={this.socket} />
        <div className='VideoChat'>
          <Video socket={this.socket} />
          <Chat lang={this.state.lang} socket={this.socket} />
        </div>
      </div>
    );
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
