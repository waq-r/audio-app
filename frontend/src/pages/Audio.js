import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import parse from 'html-react-parser';
import {useAuthContext} from '../hooks/useAuthContext'
import TimeAgo from 'react-timeago'




const AudioOld = ()=>{

    const {id} = useParams() //userNotification Id

    const [userNotification, setuserNotification] = useState(null)

    const [selectedFile, setselectedFile] = useState('')

    const [video, setVideo] = useState(null)

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
                "audioId": userNotification.audioId._id,
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
            setMessage({className: 'positive', content: 'Voiceover submitted'})
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
            "title": `${user.name} uploaded response to the audio: "${userNotification.audioId.title}"`,
            "link": fileName,
            "forWhom": "admin"
          }),
        })

        const notificationJson = await notificationRes.json()
        
        if(!notificationRes.ok) {
          console.log("add notification not ok ", notificationJson.error);
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

        //add notification to all admins in database

        const adminNotificationRes = await fetch("/api/usernotification", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
            },
            body: JSON.stringify({
                "users": [],
                "userType": "admin",
                "notification": notificationJson._id,
                "audioId":userNotification.audioId._id,
                "videoId": json._id,
                "read": false
            }),
        })

        const adminNotificationJson = await adminNotificationRes.json()

        if(!adminNotificationRes.ok) {
            console.log("add notification to admin not ok ", adminNotificationJson.error);
        }


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
                    "TextPart": `${user.name} has uploaded audio in response to the audio: "${userNotification.audioId.title}.`,
                    "HTMLPart": `${user.name} has uploaded audio in response to the audio: <b> ${userNotification.audioId.title} </b>. <br> <br>${userNotification.audioId.description} <br><br> <a href='https://hivo.online/'>Click here to login and download the file</a>`
                }),
            })

            const emailJson = await emailRes.json()

            if (!emailRes.ok) {
                console.log("error", emailJson.msg);
            }

            if(json && !userNotification.videoId){
                setVideo({_id:json._id, video:json.video})
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
                
    
        setuserNotification(UserNotificationDetailsData)

}
if(user){
getAudio()
}

// eslint-disable-next-line
    }, [])



    return (
    <div className="ui inverted segment">

        <div className="ui two column stackable center aligned grid">
            <div className="middle inverted aligned row">
                {userNotification &&
                    <div className="column">
                        <div className="ui left aligned inverted header">
                            {userNotification.audioId?.title}
                            <div className="sub header">
                                Sent <TimeAgo date={userNotification.audioId?.date} />
                            </div>
                        </div>

                        <div className="segment">
                            <audio controls 
                                    src={`/api/file/audio/${userNotification.notification?.link}`} 
                                    type={userNotification.audioId?.audio}>
                            </audio> 
                        </div>
                    </div>
                }
                <div className="ui vertical divider"></div>
                <div className="column">
                {userNotification && parse(userNotification.audioId.description)}
                </div>

      </div>
      <div className="ui horizontal divider"></div>
      <div className="middle aligned row">
        <div className="column">
            {userNotification && !userNotification.videoId && !video &&
                <div className="inverted segment">
                    <div className="header"><h3>Upload VoiceOver</h3></div>

                <form onSubmit={submitHandler} className ={`ui inverted form`}>
                    <label className={`fluid inverted ui button`}>
                        <i className="upload icon"></i>Upload 
                    <input style={{display: 'none'}}
                        onChange={(event) => { 
                            setselectedFile(event.target.files[0].name)
                        }}
                        type="file"
                        name='videoFile'
                        accept="audio/wav,audio/mp3,audio/ogg,audio/webm"
                    />
                    {` ${selectedFile}`}
                    </label>
                    <button className={`ui segment big button ${formClass}`} >Submit</button>
                </form>

                </div>
            }

            {userNotification && (userNotification.videoId || video) &&
                <div className="ui inverted segment">
                    <div className="header"><h3>Your VoiceOver</h3></div>
                    {userNotification.videoId &&
                        <audio controls 
                        src={`/api/file/video/${userNotification.videoId._id}.${userNotification.videoId.video.split('.').pop()}`} 
                        type={`audio/${userNotification.videoId.video.split('.').pop()}`}>
                        </audio>
                    }
                    {video &&
                        <audio controls 
                        src={`/api/file/video/${video._id}.${video.video.split('.').pop()}`} 
                        type={`audio/${video.video.split('.').pop()}`}>
                        </audio>
                    }
                </div>
            }

            {message && 
                <div className={`ui ${message.className} message`} >
                    <p>{message.content}</p>
                </div>
            }
        </div>
      </div>
      </div>

    </div>
    )
}

export default AudioOld