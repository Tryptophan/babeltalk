import React, { Component } from 'react';


export class Splashscreen extends Component {

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
