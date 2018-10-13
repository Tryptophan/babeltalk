import React, { Component } from 'react';
import './Users.css';

export default class Users extends Component {

  constructor(props) {
    super(props);

    this.socket = this.props.socket;
    this.socket.on('addUser', this.addUser);
    this.socket.on('removeUser', this.removeUser);
    this.socket.on('users', this.addInitialUsers);

    this.state = {
      users: []
    };
  }

  addInitialUsers = (users) => {
    this.setState({
      users: this.state.users.concat(users)
    });
  }

  addUser = (user) => {
    this.setState({
      users: this.state.users.concat(user)
    });
  }

  removeUser = (user) => {
    let users = this.state.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === user.id) {
        users.splice(i, 1);
      }
    }
    this.setState({
      users: users
    });
  }

  render() {

    // TODO: Render users by mapping each user to a list item <li> in an unordered list <ul> of users
    // TODO: Scroll through users if they overflow height (not too important)
    // TOOD: If user is currently in a call and calls another user, end the current call
    // TODO: Render an end call button instead of call if

    let socket = this.props.socket;
    let users = this.state.users.map(user => (
      <User username={user.username} key={user.id} id={user.id} parentUser={this.socket.id} socket={socket}></User>
    ));

    return (
      <div className='Users'>
        {users}
      </div>
    );
  }
}

// Single user component (rendered many times in Users)
class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      callState: false
    };

    this.socket = this.props.socket;
  }

  render() {

    // TODO: Render a call button and the user's name (this.props.username)
    let username = this.props.username;
    return (
      <div>
        <button onClick={this.call}>{this.state.callState ? 'Hangup' : 'Call'}</button>
        <p>{username}</p>
      </div>
    );
  }

  // Handle a click event on the call button and send a socket event with thier username
  call = () => {
    if (this.state.callState) { // if some sort of connection is already open
      this.socket.emit('hangup', { to: this.props.id, from: this.props.parentUser }); // handled on server
    }
    else { // if no connection is open
      this.socket.emit('call', { to: this.props.id, from: this.props.parentUser }); // handled on server
    }

    this.setState(state => ({
      callState: !state.callState
    }));
  }
}
