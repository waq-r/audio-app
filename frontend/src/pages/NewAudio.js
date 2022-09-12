import React, {useRef, useState } from "react";
import RecordAudio from "../components/RecordAudio";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AudioList from "../components/AudioList";
import {useAuthContext} from '../hooks/useAuthContext'
import { Navigate } from "react-router-dom";


const NewAudio = () => {

    const {user} = useAuthContext()
    const [audioList, setAudioList] = useState([]); //Array of audios
    const description = useRef(null); //Ref for textarea
    const title = useRef(null); //Ref for textarea

    if(!user || (user && user.role !== 'admin')) {
        return <Navigate to="/login" />
    }
   
    const addAudio = (audio) => {
        setAudioList([
            { 
                id: Date.now(),
                blobType: audio.audioType,
                blobURL: audio.audioSrc,
                title: title.current.value || "Untitled",
                description: description.current.editor.getData() || "No notes",
            },  ...audioList ]);

    }

    const deleteAudio = (blob) => {
        URL.revokeObjectURL(blob.blobURL); //revokes url
        setAudioList(audioList.filter((audioFile) => audioFile.id !== blob.id));
        }

    return (
        <div className="ui inverted verticle fluid segment">
        <div className="ui inverted segment">
        <div className="ui labeled input">
            <div className="ui label">
                Title:
            </div>
            <input ref={title} type="text" placeholder="Untitled" />
            </div>
            <div className="ui text segment">
            <CKEditor
                    ref={description}
                    editor={ ClassicEditor }
                    data="<br />"
                />
            </div>
            <div className="ui inverted segment center aligned">
            <RecordAudio addAudio={addAudio} />
            </div>

            <div className="ui inverted verticle segment">
            <AudioList audioList={audioList} onDelete={deleteAudio}/>
            </div>

        </div>
        </div>
    )
}

export default NewAudio