import React, { Component } from 'react';
import { FaMicrophoneSlash, FaVideoSlash, FaPhone, FaMicrophone, FaVideo } from 'react-icons/fa';
import Peer from 'simple-peer';
import './Video.css';

export default class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mic: true,
      camera: true
    };

    this.socket = this.props.socket;

    // Call we started was answered
    this.socket.on('answeredCall', this.onAnsweredCall);

    // WebRTC
    this.socket.on('offer', this.onOffer);
    this.socket.on('answer', this.onAnswer);
  }

  render() {
    return (
      <div className='Video'>
        {/* Video tag to render the video stream */}
        <video ref={el => { this.video = el }} autoPlay />
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

  // Toggle muting mic
  toggleMic = () => {
    this.setState({
      mic: !this.state.mic
    });
  }

  // Toggle muting camera
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

  // Send offer to the peer to peer using sockets
  onAnsweredCall = (call) => {
    console.log('Other user answered call.');
    this.peer = new Peer({
      initiator: true
    });

    this.peer.on('signal', offer => {
      this.socket.emit('offer', { offer: offer, ...call });
    });
  }

  onOffer = (data) => {

    this.peer = new Peer();
    this.peer.signal(data.offer);

    this.peer.on('signal', answer => {
      this.socket.emit('answer', { answer: answer, to: data.to, from: data.from });
    });

    this.peer.on('connect', () => {
      console.log('connect');
    });
  }

  onAnswer = (data) => {
    this.peer.signal(data.answer);
  }
}