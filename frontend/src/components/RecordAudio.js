import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";

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
      width: 330,
      audioType,
      audioBitsPerSecond: 320000,
      // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
      status,
      audioSrc,
      timeslice: 300, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: e => {
        //console.log("succ start", e);
      },
      pauseCallback: e => {
        //console.log("succ pause", e);
      },
      stopCallback: e => {
        const bUrl = window.URL.createObjectURL(e)

        this.setState({
          audioSrc: bUrl
        });

            setTimeout(() => {
              this.props.addAudio(
                {
                  audioSrc: this.state.audioSrc,
                  audioType: this.state.audioType
                });
            }, 500);

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
            <button
              className="ui compact labeled icon button"
              onClick={() => this.controlAudio("recording")}>
              <i className="play icon" />
              Start
            </button>
            <button className="ui compact icon button" onClick={() => this.controlAudio("paused")}>
            <i className="pause icon" />
              Pause
            </button>
            <button
              className="ui compact labeled icon button"
              onClick={() => this.controlAudio("inactive")}
            >
                <i className="stop icon" />
              Stop
            </button>
          </div>
        </AudioAnalyser>
        <p>Audio format</p>
        <select
          className="ui dropdown"
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