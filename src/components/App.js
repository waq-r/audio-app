import MicRecorder from "mic-recorder-to-mp3";
import { useEffect, useState, useRef } from "react";
import AudioList from "./AudioList";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const App = () => {
  const recorder = useRef(null); //Recorder
  const audioPlayer = useRef(null); //Ref for HTML Audio tag
  const [audioList, setAudioList] = useState([]); //Array of audios
  const [value, setValue] = useState(''); //Textarea value
  const description = useRef(null); //Ref for textarea

  const [blobURL, setBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(null);

  useEffect(() => {
    //Declares the recorder object and stores it in ref
    recorder.current = new MicRecorder({ bitRate: 320 });
  }, []);

  const startRecording = () => {
    //start() returns a promise incase if audio is not blocked by browser
    recorder.current.start().then(() => {
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    recorder.current
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const newBlobUrl = URL.createObjectURL(blob); //generates url from blob
        setAudioList([...audioList, { id: Date.now(), blobURL: newBlobUrl, description: description.current.value }]);
        setBlobUrl(newBlobUrl); //refreshes the page
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const deleteAudio = (audio) => {
    URL.revokeObjectURL(audio.blobURL); //revokes url
    setAudioList(audioList.filter((audioFile) => audioFile.id !== audio.id));
    }



  return (
    <div class="ui main container">
    <div className="ui container center aligned segment">
        <h1>Audio Recorder</h1>
        <ReactQuill ref={description} theme="snow" value={value} onChange={setValue} />
        </div>
        <div className="ui center aligned segment">
        <audio
        ref={audioPlayer}
        src={blobURL}
        controls="controls"
      />
      <br />
      <button className="ui button blue" onClick={startRecording} disabled={isRecording}>
        Record
      </button>
      <button className="ui button red" onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      </div>
      <br />
        <AudioList audioList={audioList} onDelete={deleteAudio}/>
    </div>
  );
};

export default App;