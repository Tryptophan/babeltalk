import React, { Component } from 'react';
import { FaMicrophoneSlash, FaVideoSlash, FaPhone, FaMicrophone, FaVideo } from 'react-icons/fa';
import './Video.css';

export default class Video extends Component {

  constructor() {
    super();

    this.state = {
      mic: true,
      camera: true
    };
  }

  render() {
    return (
      <div className='Video'>
        {/* Video tag to render the video stream */}
        {/* <div> */}
        <video ref={el => { this.video = el }} autoPlay />
        {/* </div> */}
        {/* Absolute positioned controls (mute mic, mute video, end call) */}
        <div className='Controls'>
          <div onClick={this.toggleMic}>{this.state.mic ? <FaMicrophoneSlash /> : <FaMicrophone />}</div>
          <div onClick={this.toggleCamera}>{this.state.camera ? <FaVideoSlash /> : <FaVideo />}</div>
          <div className='Hangup'><FaPhone /></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
      this.video.srcObject = stream;
    });
  }

  toggleMic = () => {
    this.setState({
      mic: !this.state.mic
    });
  }

  toggleCamera = () => {
    this.setState({
      camera: !this.state.camera
    });
  }

  endCall = () => {

  }

  receivedTranslation = () => {

  }

  sendTranscript = () => {

  }
}