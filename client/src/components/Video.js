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

    // Call was ended
    this.socket.on('hangup', this.onHangup);

    // WebRTC
    this.socket.on('offer', this.onOffer);
    this.socket.on('answer', this.onAnswer);
  }

  render() {
    return (
      <div className='Video'>
        {/* Video tag to render the video stream */}
        <video ref={el => { this.video = el }} autoPlay muted={this.state.toggleMic} />
        <video className='Local' ref={el => { this.localVideo = el }} autoPlay muted={true} />
        {/* Absolute positioned controls (mute mic, mute video, end call) */}
        <div className='Controls'>
          <div onClick={this.toggleMic}>{this.state.mic ? <FaMicrophoneSlash /> : <FaMicrophone />}</div>
          <div onClick={this.toggleCamera}>{this.state.camera ? <FaVideoSlash /> : <FaVideo />}</div>
          <div onClick={this.hangup} className='Hangup'><FaPhone /></div>
        </div>
      </div >
    );
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

  hangup = () => {
    this.socket.emit('hangup');
  }

  onHangup = () => {
    this.peer.destroy();
    this.peer = null;
    this.video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    this.localVideo.srcObject.getTracks().forEach(track => {
      track.stop();
    });
  }

  receivedTranslation = () => {

  }

  sendTranscript = () => {

  }

  // Send offer to the peer to peer using sockets
  onAnsweredCall = (call) => {

    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(localStream => {
      this.localVideo.srcObject = localStream;

      this.peer = new Peer({
        initiator: true,
        stream: localStream
      });

      this.peer.on('signal', offer => {
        this.socket.emit('offer', { offer: offer, ...call });
      });

      this.peer.on('stream', remoteStream => {
        this.video.srcObject = remoteStream;
      });
    });
  }

  onOffer = (data) => {

    if (!this.peer) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(localStream => {

        this.localVideo.srcObject = localStream;
        this.peer = new Peer({
          initiator: false,
          stream: localStream
        });
        this.peer.signal(data.offer);

        this.peer.on('signal', answer => {
          this.socket.emit('answer', { answer: answer, to: data.to, from: data.from });
        });

        this.peer.on('stream', remoteStream => {
          this.video.srcObject = remoteStream;
        });
      });
    }
  }

  onAnswer = (data) => {
    this.peer.signal(data.answer);
  }
}