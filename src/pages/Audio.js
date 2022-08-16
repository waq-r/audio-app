import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import parse from 'html-react-parser';
import {useAuthContext} from '../hooks/useAuthContext'

const Audio = ()=>{

    const {id} = useParams()

    const [audio, setAudio] = useState(null)

    const [formClass, setFormClass] = useState('hidden')

    const [message, setMessage] = useState({className: 'hidden', content: ''})

    const {user} = useAuthContext()

    const submitHandler = async (e) => {
        e.preventDefault()

        if(!user) return "You must be logged in to download this audio"

        setFormClass('loading')

        //add video to db
        const respose = await fetch('/api/video/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                "video": "video threeUser video",
                "audioId": id,
                "userId": 9876543
            }),
        })

        const json = await respose.json()

        if(!respose.ok) {
            setMessage({className: 'negative', content: json.msg})
            setFormClass('')
        }

        //upload video to dir
        const formData = new FormData()

        const fileName = json._id+'.'+e.target.videoFile.files[0].type.split('/')[1] || 'mp4'
        
        formData.append('sampleFile', e.target.videoFile.files[0], fileName)

        const res = await fetch('/api/file/save/video', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            body: formData,
        })
        const data = await res.json()

        if(res.ok) {
            setFormClass('disabled')
            setMessage({className: 'positive', content: 'File uploaded successfully'})
        }
        if(!res.ok) {
            setFormClass('')
            setMessage({className: 'negative', content: data.error})
        }

        //add notification in database
        const notificationRes = await fetch("/api/notification/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
          },
          body: JSON.stringify({
            "title": "Video response for: " + audio.title,
            "link": fileName,
            "forWhom": "admin"
          }),
        })

        const notificationJson = await notificationRes.json()
        
        if(!notificationRes.ok) {
          console.log("add notification not ok ", notificationJson.error);
        }

        //increment +1 notification to admin
        const userRes = await fetch("/api/user/notifications/add/admin", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
            },
        })

        const userJson = await userRes.json()

        if(!userRes.ok) {
            console.log("add notification to user not ok ", userJson.error);
        }

    }

    useEffect(() => {
        const getAudio = async () => {

        //get audio from api
        const response = await fetch(`/api/audio/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const json = await response.json()
        setAudio(json.audio)

}
getAudio()

    }, [user])


    return (
    <div className="ui inverted segment">
        <div className="header">
            {audio && audio.title}
        </div>
        <div className="ui segments">
        <div className="ui segment">
            <div>{audio && parse(audio.description)}</div>
        </div>
        <div className="ui secondary inverted segment">
            <audio controls src={audio && `/api/file/audio/${id}.${audio.audio.split('/')[1]}`} type={audio && audio.audio}></audio>
            <div className="ui inverted segment">
                <div className="header"><h3>Upload your video response</h3></div>
        <form onSubmit={submitHandler} className ={`ui inverted form ${formClass}`}>
            <input className={`ui inverted input ${formClass}`}
                type="file"
              name='videoFile'
            />
            <button className={`ui button ${formClass}`} >Submit video</button>
        </form>
        {message && <div className={`ui ${message.className} message`} >
        <div className="header">
            </div>
            <p>{message.content}</p>
            </div>
            }
      </div>
        </div>
        </div>
    </div>
    )
}

export default Audio