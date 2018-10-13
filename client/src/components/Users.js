import React, { Component } from 'react';
import './Users.css';

export default class Users extends Component {
  render() {

    // TODO: Render users by mapping each user to a list item <li> in an unordered list <ul> of users
    // TODO: Scroll through users if they overflow height (not too important)
    // TOOD: If user is currently in a call and calls another user, end the current call
    // TODO: Render an end call button instead of call if

    return (null);
  }
}

// Single user component (rendered many times in Users)
class User extends Component {
  render() {

    // TODO: Render a call button and the user's name (this.props.username)

    return (null);
  }

  // TODO: Handle a click event on the call button and send a socket event with thier username
  call = () => {

  }
}