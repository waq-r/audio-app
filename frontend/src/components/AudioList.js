import React, {useState} from "react"
import {useAuthContext} from '../hooks/useAuthContext'
import SelectUsers from "./SelectUsers"
import parse from 'html-react-parser'


const AudioList = ({ audioList, onDelete, onSelect, deleteSelectedAudios }) => {
  
  const {user} = useAuthContext()

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [buttonClass, setButtonClass] = useState(null)

  const [users, setUsers] = useState([])


  const userToSend = users.filter((usr) => usr.selected)

  const notifyAudio = async (audio) => {

    //let notificationId;
    setButtonClass('loading disabled')

        //add notification in database
        // const notificationRes = await fetch("/api/notification/add", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "authorization": "Bearer "+user.token
        //   },
        //   body: JSON.stringify({
        //     "title": `${user.name} sent you a new audio: "${audio.title}"`,
        //     "link": `${audio._id}.${audio.blobType.split('/')[1]}`,
        //     "forWhom": "user"
        //   }),
        // })

        // const notificationJson = await notificationRes.json()
        
        // if(!notificationRes.ok) {
        //   console.log("add notification not ok ", notificationJson.error);
        // }
        // if(notificationRes.ok) {
        //   notificationId = notificationJson._id
        // }

        // add notification to selected users

        const selectedUsersIds = userToSend.map(usr => usr._id)

          const userRes = await fetch("/api/usernotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+user.token
          },
          body: JSON.stringify({
            "title": `${user.name} sent you a new audio: "${audio.title}"`,
            "link": `${audio._id}.${audio.blobType.split('/')[1]}`,
            "users": selectedUsersIds,
            "userType": "user",
            "audioId": audio._id,
            "videoId": null,
            "read": false
          }),
        })

        const userJson = await userRes.json()

        if(!userRes.ok) {
          console.log("add notification to users not ok ", userJson.error);
        }    
}

const emailUser = async(notifications) => {

          // send an email notification of all new audios
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
                      "TextPart": `${user.name} has sent you audio: "${notifications.join('\n')}. \n 
                      https://hivo.online `,
                      "HTMLPart": `${user.name} has sent you audios:<br> <b> ${notifications.join("<br>")}</b>. <br> <br> <a href='https://hivo.online/'>Click here to log in and listen to the audio</a>`
                  }),
              })
  
              const emailJson = await emailRes.json()
  
              if (!emailRes.ok) {
                  console.log("error", emailJson.msg);
              }
  
}

  const onSave = async () => {
    const selectedAudios = audioList.filter((audio) => audio.selected)
    if(selectedAudios.length === 0) {
          return setError("Please select at least one audio")
      }
      setError(null)
    const notifications = selectedAudios.map(audio => audio.title)

    selectedAudios.forEach(audio => {
      notifyAudio(audio)
    })
    
    emailUser(notifications)

    setButtonClass(null)
    setMessage(selectedAudios.length + ' audios sent to ' + userToSend.length + ' users')
    
    deleteSelectedAudios()

    }
  
  return (
    <div className="ui inverted segment">

        <div className="ui inverted segment center aligned">
            <SelectUsers setUsers={setUsers} users={users} />
        </div>

      {message && <div className="ui inverted positive message">
        <div className="header">
                  Audios status:
        </div>
              <p>{message}</p>
      </div>
      }
    <div className="ui middle aligned divided list">
      {audioList.map(audio => (
        <div key={audio.id} className="item inverted">
            <div
              className={`${audio.selected?"ui inverted olive segment":"ui inverted segment"}`}
              onClick={() => onSelect(audio)}
               >
                {audio.title}
            </div>
            <div className="ui message" onClick={() => onSelect(audio)} >
                {parse(audio.description)}
              </div>
            <div>
                <audio
                    src={audio.blobURL}
                    controls="controls"
                />
      </div>
            <div className="right floated content">
              <span className="ui inverted">
                <i className={`${audio._id?"icon cloud upload":"ui active mini inline loader"}`}>
                </i>
                {audio._id?"Draft saved ":"Saving draft .. "}
              </span>
              <button
                className="ui button"
                onClick={() => onDelete(audio, true)}
              >
                Delete
              </button>
              <button
                className={`${audio.selected?"ui olive button":"ui button"}`}
                onClick={() => onSelect(audio)}
                >
                  {audio.selected?"Selected":" Select "}
              </button>
            </div>
        </div>
      ))}
    </div>

    <div className="ui center aligned inverted segment">
      <div className="ui inverted message">{error}</div>
    <button
                className={`ui ${(userToSend.length > 0 ) ? 'olive' : 'disabled'} button ${buttonClass}`}
                onClick={() => onSave()}
              >
                Send to {userToSend.length} {userToSend.length > 1 ? 'users' : 'user'}
              </button>
    </div>
    </div>
  );
}

export default AudioList;