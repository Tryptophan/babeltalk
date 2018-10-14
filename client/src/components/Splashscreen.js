import React, { Component } from 'react';


export class Splashscreen extends Component {

<<<<<<< HEAD
    constructor() {
      super();
    }
  
    render() {
      return (
        <div className='Splash'>
           <label>What is your name?</label>
           <input type='text' onKeyPress={this.onKeyPress} ref={el => {this.input = el}} placeholder="Type here!" id='userNameBox'/>
        </div>
        
        );
    }
  }
=======
  constructor() {

    super();
    this.state = {
      userName: ''
    };
  }

  render() {
    return (
      <div className='Splash'>
        <label>BabelTalk - Real-time p2p translation communication platform</label>
        <label>What is your name?</label>
        <input type='text' onKeyPress={this.onKeyPress} ref={el => { this.input = el }} placeholder="Type here!" id='userNameBox' />
        <button onClick={this.sendClicked}>Send</button>

      </div>

    );
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log("username inputted");
      let text = event.target.value;
      this.setState({
        userName: text
      });
    }

  }
  sendClicked = () => {
    console.log("username inputted");
    let text = this.input.value;
    this.setState({
      userName: text
    });

  }

}

>>>>>>> master
