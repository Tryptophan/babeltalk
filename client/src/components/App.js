import React, { Component } from 'react';
import io from 'socket.io-client';

// Component Imports
import Users from './Users';
import Video from './Video';
import Chat from './Chat';
import Call from './Call';

// CSS Import
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.socket = io(process.env.REACT_APP_SOCKET_SERVER);
    this.socket.on('connect', () => {                                           // change later to support different defaults
      this.socket.emit('join', { id: this.socket.id, username: this.socket.id, lang: 'en' });
    });
  }

  render() {
    return (
      <div className='App'>
        <Call socket={this.socket} />
        <Users socket={this.socket} />
        <div className='VideoChat'>
          <Video socket={this.socket} />
          <Chat socket={this.socket} />
        </div>
      </div>
    );
  }
}

export default App;
