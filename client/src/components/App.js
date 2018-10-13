import React, { Component } from 'react';

// Component Imports
import Users from './Users';
import Video from './Video';
import Chat from './Chat';

// CSS Import
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Users />
        <div className='VideoChat'>
          <Video />
          <Chat />
        </div>
      </div>
    );
  }
}

export default App;
