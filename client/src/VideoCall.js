import React, { Component } from 'react';
import { FaMicrophoneSlash, FaVideoSlash, FaPhone } from 'react-icons/fa';
import './VideoCall.css';

export default class VideoCall extends Component {

  render() {
    return (
      <div className='VideoCall'>
        {/* Video tag to render the video stream */}
        {/* <div> */}
        <video ref={el => { this.video = el }} autoPlay />
        {/* </div> */}
        {/* Absolute positioned controls (mute mic, mute video, end call) */}
        <div className='Controls'>
          <div><FaMicrophoneSlash /></div>
          <div><FaVideoSlash /></div>
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

  }

  toggleCamera = () => {

  }

  endCall = () => {

  }

  receivedTranslation = () => {

  }

  sendTranscript = () => {
    
  }
}