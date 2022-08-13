import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import parse from 'html-react-parser';
import {Form} from 'semantic-ui-react'

const Audio = ()=>{

    const {id} = useParams()

    const [audio, setAudio] = useState(null)

    const [formClass, setFormClass] = useState('hidden')

    const [message, setMessage] = useState({className: 'hidden', content: ''})

    const submitHandler = async (e) => {
        e.preventDefault()

        setFormClass('loading')

        //add video to db
        const respose = await fetch('/api/video/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "video": "video threeUser video",
                "audioId": id,
                "userId": 9876543
            }),
        })

        const json = await respose.json()

        if(!respose.ok) {
            console.log("not ok res ", json.msg);
            setMessage({className: 'negative', content: json.msg})
            setFormClass('')
        }
        if(respose.ok) {
            console.log("ok res ", json)
        }

        //upload video to dir
        const formData = new FormData()

        const fileName = json._id+'.'+e.target.videoFile.files[0].type.split('/')[1] || 'mp4'
        
        formData.append('sampleFile', e.target.videoFile.files[0], fileName)

        const res = await fetch('/api/file/save/video', {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()
        console.log("data", data);

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
        if(notificationRes.ok) {
          console.log("add notofication ok ", notificationJson.title);
        }

        //increment +1 notification to admin
        const userRes = await fetch("/api/user/notifications/add/admin", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        })

        const userJson = await userRes.json()

        if(!userRes.ok) {
            console.log("add notification to user not ok ", userJson.error);
        }
        if(userRes.ok) {
            console.log("Number of notifications sent: ", userJson.modifiedCount);
        }


    }


    useEffect(() => {
        const getAudio = async (id) => {

        //get audio from api
        const response = await fetch(`/api/audio/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const json = await response.json()
        console.log(json.audio.description)
        setAudio(json.audio)


}
getAudio(id)

    }, [])


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
            <audio controls src={audio && `../../audio/${id}.${audio.audio.split('/')[1]}`} type={audio && audio.audio}></audio>
            <div>
        <Form onSubmit={submitHandler} className ={formClass}>
          <Form.Group>
            <Form.Input
                type="file"
              name='videoFile'
            />
            <Form.Button content='Submit Video' className={formClass} />
          </Form.Group>
        </Form>
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