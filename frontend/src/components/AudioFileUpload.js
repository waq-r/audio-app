import React, { useState } from "react"

const AudioFileUploader = ({addAudio}) => {

    const [selectedFile, setselectedFile] = useState('')

    
    const handleAudioUpload = (e) => {
        const file = e.target.files[0]
        setselectedFile(file.name || '')
        // get file src from upload file for audio tag
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            //console.log('file reader result: ', reader.result)
            const audio =
                {
                  audioSrc: reader.result,
                  audioType: file.type,
                  file: reader.result
                }
    //console.log('audio obj: ', audio)  
            addAudio(audio)        
        }
        reader.onerror = (error) => {
            console.log('reader error: ', error)
        }
    }
    return (
        <div className="file-uploader">
            <label className="ui button">
                        <i className="upload icon"></i>Upload Audio
                    <input style={{display: 'none'}}
                        onChange={(e) => handleAudioUpload(e)}
                        type="file"
                        accept="audio/wav,audio/mp3,audio/ogg,audio/webm"
                    />
            </label>
            <div className="ui inverted black label"> {` ${selectedFile}`}</div>

        </div>
    );
}
export default AudioFileUploader;