import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='videoBox'>
          video goes here
        </div>
        <div className='chatContainer'>
          <ul id='chatLog'>{'chat log'} </ul>
          <input onKeyPress={this.onKeyPress} type='text' placeholder='type here' id='textBox' />
          <button id='sendBtn'>send</button>
        </div>
        <div className='userBar'>
          <ul id='userList'>{'user list'}</ul>
        </div>


      </div>

      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}

export default App;
