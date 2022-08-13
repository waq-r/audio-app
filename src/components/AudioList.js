import React, {useState} from "react";

const AudioList = ({ audioList, onDelete }) => {

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
    console.log("audio", audio);
    let audioId;

    //save audio to database
    const response = await fetch("/api/audio/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "audio": audio.blobType,
        "title": audio.title,
        "description": audio.description
      }),
    })

    const json = await response.json()

      if(!response.ok) {
        console.log("not ok res ", json.error);
      }
      if(response.ok) {
        audioId = json.newAudio._id;
        console.log("ok res ", audioId);
        resultMsg.idGenerated = true
        resultMsg.title = json.newAudio.title
      }
// save file to dir, _id as name
    const blob = await fetch(audio.blobURL)
    const b = await blob.blob()
    const fileName = audioId +'.'+ audio.blobType.split("/")[1]

    console.log("fileNmae ", fileName, "blob type", b);

    const newFile = new File([b], fileName, {lastModified: Date.now(), type: audio.blobType})

    const formData = new FormData()

    formData.append('sampleFile', newFile)

    const res = await fetch('/api/file/save/audio', {
              method: 'POST',
              body: formData,
    })

    const data = await res.json()

        if(res.ok) {
            console.log("file saved", data.msg);
            resultMsg.upload = true
        }

        //add notification in database
        const notificationRes = await fetch("/api/notification/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          console.log("add notofication ok ", notificationJson.title);
          resultMsg.notification = true
        }

        //increment +1 notification to all users
        const userRes = await fetch("/api/user/notifications/add/user", {
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
          resultMsg.userNotified = true
          resultMsg.modifiedCount = userJson.modifiedCount

        }

        setMessage(resultMsg)

        //on susccess, delete audio from list
        const sucess = Object.values(resultMsg).filter(msg => msg === true)
        console.log("sucess ", sucess.length);
        if(sucess.length === 4) {
          onDelete(audio)
          console.log("audio deleted from list ", audio.id);
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