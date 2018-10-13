import React, { Component } from 'react';
import io from 'socket.io-client';

// Component Imports
import Users from './Users';
import Video from './Video';
import Chat from './Chat';

// CSS Import
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.socket = io('http://localhost:3001');
  }

  render() {
    return (
      <div className='App'>
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
