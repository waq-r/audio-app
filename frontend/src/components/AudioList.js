import React, {useState} from "react";
import {useAuthContext} from '../hooks/useAuthContext'
import SelectUsers from "./SelectUsers";


const AudioList = ({ audioList, onDelete }) => {
  
  const {user} = useAuthContext()

  const [message, setMessage] = useState(null);

    const [buttonClass, setButtonClass] = useState(null);

  const [users, setUsers] = useState([])

  const resultObj = {
    'idGenerated':null, // boolean
    'upload': null, // boolean
    'notification': null, // boolean
    'userNotified': null, // boolean
    'emailSent': null, // boolean
    modifiedCount : 0, // number
    title: null, // string
  
  };

  let resultMsg = {...resultObj};

  const userToSend = users.filter((usr) => usr.selected)

  // let usersToNotify = [];


  // const onUserSelect = (selectedUsers) => {
  //   console.log("selected users ", selectedUsers);
  //   usersToNotify = selectedUsers;
  //   console.log("callback usersToNotify ", usersToNotify);
  // }


  const onSave = async (audio) => {
    let audioId;
    let notificationId;
    setButtonClass('loading disabled')

    //save audio to database
    const response = await fetch("/api/audio/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({
        "audio": audio.blobType,
        "title": audio.title,
        "description": audio.description
      }),
    })

    const json = await response.json()

      if(!response.ok) {
      }
      if(response.ok) {
        audioId = json.newAudio._id;
        resultMsg.idGenerated = true
        resultMsg.title = json.newAudio.title
      }
// save file to dir, _id as name
    const blob = await fetch(audio.blobURL)
    const b = await blob.blob()
    const fileName = audioId +'.'+ audio.blobType.split("/")[1]

    const newFile = new File([b], fileName, {lastModified: Date.now(), type: audio.blobType})

    const formData = new FormData()

    formData.append('sampleFile', newFile)

    const res = await fetch('/api/file/save/audio', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${user.token}`
              },
              body: formData,
    })

    const data = await res.json()

        if(res.ok) {
            resultMsg.upload = true
        }
        if(!res.ok) {
          console.log("error ", data.error);
        }

        //add notification in database
        const notificationRes = await fetch("/api/notification/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
          },
          body: JSON.stringify({
            "title": `${user.name} sent you a new audio: "${audio.title}"`,
            "link": fileName,
            "forWhom": "user"
          }),
        })

        const notificationJson = await notificationRes.json()
        
        if(!notificationRes.ok) {
          console.log("add notification not ok ", notificationJson.error);
        }
        if(notificationRes.ok) {
          resultMsg.notification = true
          notificationId = notificationJson._id
        }

        // add notification to selected users

        const selectedUsersIds = userToSend.map(usr => usr._id)

        //forEach needs to run async
        selectedUsersIds.forEach(async (id) => {

          const userRes = await fetch("/api/usernotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
          },
          body: JSON.stringify({
            "notification": notificationId,
            "user": id,
            "audioId": audioId,
            "videoId": null,
            "read": false
          }),
        })

        const userJson = await userRes.json()

        if(!userRes.ok) {
          console.log("add notification to users not ok ", userJson.error);
        }
        if(userRes.ok) {
          resultMsg.userNotified = true
          resultMsg.modifiedCount++
        }
    })

        // send email notification to admin
            //get name and email from userToSend array
            const sendTo = userToSend.map(useremail => {
              return {
                  Name: useremail.name,
                  Email: useremail.email
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
                      "TextPart": `${user.name} has sent you audio: "${audio.title}.`,
                      "HTMLPart": `${user.name} has sent you audio: <b> ${audio.title}</b>. <br> <br>${audio.description} <br><br> <a href='https://hivo.online/'>Click here to log in and listen to the audio</a>`
                  }),
              })
  
              const emailJson = await emailRes.json()
  
              if (!emailRes.ok) {
                  console.log("error", emailJson.msg);
              }
  
              if (emailRes.ok) {
                resultMsg.emailSent = true
              }
        
        setMessage(resultMsg)

        //on susccess, delete audio from list
        const sucess = Object.values(resultMsg).filter(msg => msg === true)

        //reset resultMsg
        resultMsg = {...resultObj};

        if(sucess.length >= 4) {
          onDelete(audio)
        }
        else{
          setButtonClass('primary')
        }


        
}
  
  return (
    <div className="ui inverted segment">

        <div className="ui inverted segment center aligned">
            <SelectUsers setUsers={setUsers} users={users} />
        </div>

      {message && <div className="ui inverted positive message">
        <div className="header">
          Audio status: {message.title}
        </div>
        <p>Notes {message.idGenerated?'saved ':'not saved '}, 
          audio file {message.upload?'uploaded ':'not uploaded '}, 
          notification {message.notification?'added ':'not added '},
          email {message.emailSent?'sent ':'not sent '}, 
        <b>{message.userNotified && message.modifiedCount }</b> users notified.</p>
      </div>
}
    <div className="ui middle aligned divided list">
      {audioList.map(audio => (
        <div key={audio.id} className="item inverted">
            <div className="">{audio.title}</div>
            <div className="ui message" dangerouslySetInnerHTML={{__html: audio.description}} />
            <div>
                <audio
                    src={audio.blobURL}
                    controls="controls"
                />
      </div>
            <div className="right floated content">
              <button
                className={`ui ${userToSend.length > 0 ? 'olive' : 'disabled'} button ${buttonClass}`}
                onClick={() => onSave(audio)}
              >
                Send to {userToSend.length} {userToSend.length > 1 ? 'users' : 'user'}
              </button>
              <button
                className="ui button"
                onClick={() => onDelete(audio)}
              >
                Delete
              </button>
            </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default AudioList;