import React, { Component } from 'react';
import { FaPhone, FaMicrophone } from 'react-icons/fa';
import Peer from 'simple-peer';
import './Video.css';

export default class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {
      recording: false,
      leftSubtitles: [],
      rightSubtitles: [],
      interimTranscript: ''
    };

    this.socket = this.props.socket;

    // Call we started was answered
    this.socket.on('answeredCall', this.onAnsweredCall);

    // Call was ended
    this.socket.on('hangup', this.onHangup);

    // WebRTC
    this.socket.on('offer', this.onOffer);
    this.socket.on('answer', this.onAnswer);

    // Speech
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.onresult = this.onTranscript;
    
    // Synthesis
    this.synth = window.speechSynthesis;

    this.socket.on('transcript', this.receivedTranslation);
  }

  render() {

    let leftSubtitles = this.state.leftSubtitles.map(transcript => (
      <div key={Date.now() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)} className='Subtitle'>{transcript}</div>
    ));

    let rightSubtitles = this.state.rightSubtitles.map(transcript => (
      <div key={Date.now() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)} className='Subtitle'>{transcript}</div>
    ));

    return (
      <div className='Video'>
        {/* Video tag to render the video stream */}
        <video ref={el => { this.video = el }} autoPlay muted={this.state.toggleMic} />
        <video className='Local' ref={el => { this.localVideo = el }} autoPlay muted={true} />

        {/* Subtitles for voice */}
        <div className='Subtitles'>
          <div className='LeftSubtitles'>
            {leftSubtitles}
          </div>
          <div className='RightSubtitles'>
            {rightSubtitles}
            {this.state.interimTranscript.length > 0 ? <div className='Subtitle InterimTranscript'>{this.state.interimTranscript}</div> : null}
          </div>
        </div>
        {/* Absolute positioned controls (mute mic, mute video, end call) */}
        <div className='Controls'>
          <div onMouseDown={this.record} className={['Mic', this.state.recording ? 'Recording' : null].join(' ')} onMouseUp={this.stopRecording}><FaMicrophone /></div>
          <div onClick={this.hangup} className='Hangup'><FaPhone /></div>
        </div>
      </div >
    );
  }

  // Toggle muting mic
  record = () => {
    this.recognition.start();
    this.setState({
      recording: true
    });
  }

  stopRecording = () => {
    this.recognition.stop();
    this.setState({
      recording: false
    });
  }

  hangup = () => {
    this.socket.emit('hangup');
  }

  onHangup = () => {
    if (!this.peer) {
      return;
    }
    this.peer.destroy();
    this.peer = null;
    this.video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    this.localVideo.srcObject.getTracks().forEach(track => {
      track.stop();
    });
  }

  receivedTranslation = (transcript) => {
    console.log('RECEIVED TRANSCRIPT:', transcript);
    this.setState({
      leftSubtitles: this.state.leftSubtitles.concat(transcript)
    });

    setTimeout(() => {
      console.log('timeout');
      let transcripts = this.state.leftSubtitles;
      for (let i = 0; i < transcripts.length; i++) {
        if (transcripts[i] === transcript) {
          transcripts.splice(i, 1);
        }
      }

      this.setState({
        leftSubtitles: transcripts
      });
    }, 5000);

    let utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = this.props.lang;
    this.synth.speak(utterance);
  }

  onTranscript = (event) => {
    let results = event.results;
    this.setState({
      interimTranscript: ''
    })
    for (let i = event.resultIndex; i < results.length; ++i) {
      let transcript = results[i][0].transcript;
      if (results[i].isFinal) {
        this.socket.emit('transcript', transcript);
        this.setState({
          interimTranscript: '',
          rightSubtitles: this.state.rightSubtitles.concat(transcript)
        });

        setTimeout(() => {
          console.log('timeout');
          let transcripts = this.state.rightSubtitles;
          for (let i = 0; i < transcripts.length; i++) {
            if (transcripts[i] === transcript) {
              transcripts.splice(i, 1);
            }
          }
    
          this.setState({
            rightSubtitles: transcripts
          });
        }, 5000);
      } else {
        this.setState({
          interimTranscript: this.state.interimTranscript + transcript + ' '
        });
      }
    }
  }

  // Send offer to the peer to peer using sockets
  onAnsweredCall = (call) => {

    if (this.socket.id !== call.to) {

      navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(localStream => {
        this.localVideo.srcObject = localStream;

        this.peer = new Peer({
          initiator: true,
          stream: localStream
        });

        this.peer.on('signal', offer => {
          this.socket.emit('offer', { offer: offer, ...call });
        });

        this.peer.on('stream', remoteStream => {
          console.log(remoteStream);
          this.video.srcObject = remoteStream;
        });
      });
    }
  }

  onOffer = (data) => {

    if (!this.peer) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(localStream => {

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