import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import { Button, Icon } from 'semantic-ui-react'


export default class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
  }

  controlAudio(status) {
    this.setState({
      status
    });
  }

  changeScheme(e) {
    this.setState({
      audioType: e.target.value
    });
  }

  componentDidMount() {
    this.setState({
      audioType: "audio/wav"
    });
  }

  render() {
    const { status, audioSrc, audioType } = this.state;
    
    const audioProps = {
      audioType,
      audioBitsPerSecond: 320000,
      // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
      status,
      audioSrc,
      timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: e => {
        console.log("succ start", e);
      },
      pauseCallback: e => {
        console.log("succ pause", e);
      },
      stopCallback: e => {
        const bUrl = window.URL.createObjectURL(e)

        this.setState({
          audioSrc: bUrl
        });

        console.log("sending callback", this.state.audioSrc);
        if(this.state.audioSrc !== null && this.state.audioSrc !== undefined) {
          this.props.addAudio(
            {
              audioSrc: this.state.audioSrc,
              audioType: this.state.audioType
            });
          }

        //console.log("succ stop", e);
      },
      onRecordCallback: e => {
        //console.log("recording", e);
      },
      errorCallback: err => {
        console.log("error", err);
      }
    };
    return (
      <div>
        <AudioAnalyser {...audioProps}>
          <div className="ui inverted segment">
            <Button
              className="btn"
              onClick={() => this.controlAudio("recording")}>
              <Icon name='play' />
              Start
            </Button>
            <Button className="btn" onClick={() => this.controlAudio("paused")}>
            <Icon name='pause' />
              Pause
            </Button>
            <Button
              className="btn"
              onClick={() => this.controlAudio("inactive")}
            >
                <Icon name='stop' />
              Stop
            </Button>
          </div>
        </AudioAnalyser>
        <p>Audio format</p>
        <select
          name=""
          id=""
          onChange={e => this.changeScheme(e)}
          value={audioType}
        >
          <option value="audio/wav">WAV</option>
          <option value="audio/mp3">MP3</option>
        </select>
      </div>
    );
  }
}
