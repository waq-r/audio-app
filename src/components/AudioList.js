import React, {useState} from "react";
import {useAuthContext} from '../hooks/useAuthContext'


const AudioList = ({ audioList, onDelete }) => {
    const {user} = useAuthContext()

  const [message, setMessage] = useState(null);

  const resultMsg = {
    'idGenerated':null, // boolean
    'upload': null, // boolean
    'notification': null, // boolean
    'userNotified': null, // boolean
    modifiedCount : null, // number
    title: null, // string
  
  };

  const onSave = async (audio) => {
    let audioId;

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
            "title": "New audio: " + audio.title,
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
        }

        //increment +1 notification to all users
        const userRes = await fetch("/api/user/notifications/add/user", {
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
        if(userRes.ok) {
          resultMsg.userNotified = true
          resultMsg.modifiedCount = userJson.modifiedCount

        }

        setMessage(resultMsg)

        //on susccess, delete audio from list
        const sucess = Object.values(resultMsg).filter(msg => msg === true)
        if(sucess.length === 4) {
          onDelete(audio)
          //setMessage("Audio saved successfully")
        }


        
}
  
  return (
    <div className="ui inverted segment">
      {message && <div className="ui inverted positive message">
        <div className="header">
          Audio status: {message.title}
        </div>
        <p>Notes {message.idGenerated?'saved':'not saved'}, 
          audio file {message.upload?'uploaded':'not uploaded'}, 
          notification {message.notification?'added':'not added '}, 
        <b>{message.userNotified }</b> users notified.</p>
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
                className="ui button"
                onClick={() => onSave(audio)}
              >
                Save
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