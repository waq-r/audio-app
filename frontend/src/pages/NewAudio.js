import React, {useRef, useState } from "react";
import RecordAudio from "../components/RecordAudio";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AudioList from "../components/AudioList";
import {useAuthContext} from '../hooks/useAuthContext'
import { Navigate } from "react-router-dom";
import AudioFileUpload from "../components/AudioFileUpload";
import UploadMultiple from "../components/UploadMultiple";


const NewAudio = () => {

    const {user} = useAuthContext()
    const [audioList, setAudioList] = useState([]); //Array of audios
    const description = useRef(null); //Ref for textarea
    const title = useRef(null); //Ref for textarea
    const [audioTitle, setAudioTitle] = useState('')
    const [descriptionData, setDescriptionData] = useState("<br />")

    if(!user || (user && user.role !== 'admin')) {
        return <Navigate to="/login" />
    }
    
    const setTitleAndNotes= (audioInfo) => {
        //convert audioInfo.name slug to title
        if(audioInfo.name){
        const name = audioInfo.name.replace(/\.[\w ]{2,4}$/g, '')
        setAudioTitle(name.replace(/-/g, ' '))
        }

        setDescriptionData(audioInfo.text)

    }
   
    const addAudio = async(audio) => {
        const newAudio = { 
            id: Date.now(),
            blobType: audio.audioType,
            blobURL: audio.audioSrc,
            title: title.current.value || "Untitled",
            description: description.current.editor.getData() || "No notes",
            file: audio.file || null,
            selected: false
        }
        setAudioList([newAudio,  ...audioList ]);

            const blob = await fetch(newAudio.blobURL)
            const b = await blob.blob()
            const fileName = newAudio.id +'.'+ newAudio.blobType.split("/")[1]

            const newFile = new File([b], fileName, {lastModified: Date.now(), type: newAudio.blobType})

            const formData = new FormData()

            formData.append('audioFile', newFile)
            formData.append('audio', newAudio.blobType)
            formData.append('title', newAudio.title)
            formData.append('description', newAudio.description)
            formData.append('draft', true)

            const res = await fetch('/api/audio/draft', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: formData,
            })

            const fileData = await res.json()
            if (!res.ok) {
                console.log(fileData.message)
            }
            if (res.ok) {
                URL.revokeObjectURL(newAudio.blobURL); //revokes url
                Object.assign(newAudio, { _id: fileData._id, selected: false, blobURL: `/api/file/audio/${fileData._id}.${fileData.audio.split("/")[1]}` })
                setAudioList([newAudio, ...audioList])
            }
        
        
    }

    const deleteAudio = async (audio, draft) => {
        console.log('deleteAudio before: ', audioList)
        setAudioList(audioList.filter((audioFile) => audioFile.id !== audio.id))
        console.log('deleteAudio after: ', audioList)


        if (audio._id && draft){
            fetch(`/api/audio/${audio._id}/${audio.blobType.split('/')[1]}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log('deleted:', data)
                    setAudioList(audioList.filter((audioObj) => audioObj._id !== data._id));
                }
            )
                .catch(err => console.log(err))
        }
    }

    const deleteSelectedAudios = () => {
        //delete all audios where selected is true from audioList
        setAudioList(audioList.filter((audio) => !audio.selected))

    }

    // toggle status of audio as selected or unselected
    const toggleSelect = (audio) => {
        audio.selected = !audio.selected
        setAudioList(audioList.map((audioObj) => {
            if (audioObj._id === audio._id) {
                return audio
            } else {
                return audioObj
            }
        }))
    }

    return (
        <div className="ui inverted verticle fluid segment">
            <UploadMultiple setTitleAndNotes={setTitleAndNotes} />
        <div className="ui inverted segment">
        <div className="ui labeled input">
            <div className="ui label">
                Title:
            </div>
            <input ref={title} type="text" placeholder="Untitled" value={`${audioTitle}`} onChange = {(e) => setAudioTitle(e.target.value)} />
            </div>
            <div className="ui text segment">
            <CKEditor
                    ref={description}
                    editor={ ClassicEditor }
                    data= {descriptionData}
                />
            </div>
            
            <div className="ui two column stackable center aligned grid">
                <div className="middle aligned row">
                    <div className="column">
                        <div className="ui inverted basic button" onClick={() => setDescriptionData("<br />")} >
                            Reset
                        </div>
                    </div>
                    <div className="column">
                        <AudioFileUpload addAudio={addAudio} />
                    </div>
                </div>
            </div>

            <div className="ui inverted segment center aligned">
            <RecordAudio addAudio={addAudio} />
            </div>

            <div className="ui inverted verticle segment">
            <AudioList audioList={audioList} onDelete={deleteAudio} onSelect={toggleSelect} deleteSelectedAudios={deleteSelectedAudios} />
            </div>

        </div>
        </div>
    )
}

export default NewAudio