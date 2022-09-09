import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import parse from 'html-react-parser';
import {useAuthContext} from '../hooks/useAuthContext'



const Audio = ()=>{

    const {id} = useParams() //userNotification Id

    const [userNotification, setuserNotification] = useState(null)


    const [audio, setAudio] = useState(null)

    const [formClass, setFormClass] = useState('hidden')

    const [message, setMessage] = useState({className: 'hidden', content: ''})

    const {user} = useAuthContext()

    const submitHandler = async (e) => {
        e.preventDefault()

        if(!user) return "You must be logged in to download this audio"

        setFormClass('loading')

        if(!e.target.videoFile.files[0]){
            setMessage({className: 'negative', content: 'Please select a file.'})
            setFormClass('')
            return
            
        }



        //add video to db
        const respose = await fetch('/api/video/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                "video": e.target.videoFile.files[0].name,
                "audioId": audio._id,
                "userId": user._id,
                "downloaded": false
            }),
        })

        const json = await respose.json()

        if(!respose.ok) {
            console.log("error", json.msg);
            setMessage({className: 'negative', content: json.msg})
            setFormClass('')
        }

        // add videoId entry to the UserNotifications
        const UserNotificationRes = await fetch('/api/usernotification/'+userNotification._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({videoId: json._id})
        })

        const UserNotificationData = await UserNotificationRes.json()

        if(!UserNotificationRes.ok) {
            console.log("add videoId in userNotification not ok ", UserNotificationData.error);
        }

        //upload video to dir
        const formData = new FormData()

        const fileName = json._id+'.'+e.target.videoFile.files[0].type.split('/')[1] || 'mp3'
        
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
            "title": `${user.name} uploaded response to the audio: "${audio.title}"`,
            "link": fileName,
            "forWhom": "admin"
          }),
        })

        const notificationJson = await notificationRes.json()
        
        if(!notificationRes.ok) {
          console.log("add notification not ok ", notificationJson.error);
        }
        if(notificationRes.ok) {
          //console.log("add notification ok ", notificationJson._id);
        }

        //get all admins
        const adminRes = await fetch("/api/user", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
            },
            body: JSON.stringify({
                "role": "admin"
              }),
        })

        const admins = await adminRes.json()

        if(!adminRes.ok) {
            console.log("get admin id not ok ", admins.error);
        }
        if(adminRes.ok) {
            //console.log("get admin id ok ", admins);
        }

        //add notification to all admins in database

        admins.forEach(async (admin) => {

        const adminNotificationRes = await fetch("/api/usernotification", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
            },
            body: JSON.stringify({
                "user": admin._id,
                "notification": notificationJson._id,
                "audioId":audio._id,
                "videoId": json._id,
                "read": false
            }),
        })

        const adminNotificationJson = await adminNotificationRes.json()

        if(!adminNotificationRes.ok) {
            console.log("add notification to admin not ok ", adminNotificationJson.error);
        }
        if(adminNotificationRes.ok) {
            //console.log("add notification to admin ok ", adminNotificationJson);
        }

    })

    // send email notification to admin
            //get name and email from admins array
        const sendTo = admins.map(admin => {
            return {
                Name: admin.name,
                Email: admin.email
            }
        })
            const emailRes = await fetch('/api/user/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    "To": sendTo,
                    "Subject": `[hiVO] ${user.name} sent you an audio`,
                    "TextPart": `${user.name} has uploaded audio in response to the audio: "${audio.title}.`,
                    "HTMLPart": `${user.name} has uploaded audio in response to the audio: <b> ${audio.title} </b>. <br> <br>${audio.description} <br><br> <a href='https://hivo.online/'>Click here to login and download the file</a>`
                }),
            })

            const emailJson = await emailRes.json()

            if (!emailRes.ok) {
                console.log("error", emailJson.msg);
            }
        
        }




    

    useEffect(() => {
        const getAudio = async () => {
        
                //get UserNotification details
                const UserNotificationDetails = await fetch('/api/usernotification/details/'+id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })
    
                const UserNotificationDetailsData = await UserNotificationDetails.json()
    
                if(!UserNotificationDetails.ok) {
                    console.log('get user notification details not ok', UserNotificationDetailsData.error)
                    
                }
                const audioId = UserNotificationDetailsData.notification.link.split('.')[0]

        //get audio from api
        const response = await fetch(`/api/audio/${audioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const json = await response.json()
        setAudio(json.audio)
        setuserNotification(UserNotificationDetailsData)

}
getAudio()
// eslint-disable-next-line
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
            <audio controls src={audio && `/api/file/audio/${userNotification.notification.link}`} type={audio && audio.audio}></audio>
            {userNotification && userNotification.videoId
            ?
            <div className="ui inverted segment">
                <div className="header"><h3>Your response</h3></div>
                <audio controls 
                src={audio && `/api/file/video/${userNotification.videoId._id}.${userNotification.videoId.video.split('.').pop()}`} 
                type={`audio/${userNotification.videoId.video.split('.').pop()}`}>
                </audio>
            </div>
            :
            <div className="ui inverted container segment">
                <div className="header"><h3>Upload your response</h3></div>

            <form onSubmit={submitHandler} className ={`ui inverted form ${formClass}`}>
                <input className={`fluid inverted secondary ui button ${formClass}`}
                    type="file"
                    name='videoFile'
                    accept="audio/wav,audio/mp3,audio/mp4,audio/ogg,audio/webm"
                />
                <button className={`ui segment big button ${formClass}`} >Submit video</button>
            </form>

        {message && <div className={`ui ${message.className} message`} >
        <div className="header">
            </div>
            <p>{message.content}</p>
            </div>
            }

      </div>
        }
        </div>
        </div>
    </div>
    )
}

export default Audio