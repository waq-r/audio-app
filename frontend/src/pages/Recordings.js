import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {useAuthContext} from '../hooks/useAuthContext'
import DownloadButton from "../components/DownloadButton";
import DownloadZip from "../components/DownloadZip";


const Recordings = () => {

    const { id } = useParams();
    const [recordings, setRecordings] = useState(null);
    const [name, setName] = useState(null);

    const {user} = useAuthContext()

    //Mark video as downloaded
    const markAsDownloaded = (recordId) => {
        let update = null
        const newRecordings = recordings.map(recording => {

            if (recording._id === recordId ) {
                if (recording.videoId.downloaded === false) {
                        recording.videoId.downloaded = true;
                        update = recording.videoId._id
                }
            }
            return recording;
        })

        if (update) {
        setRecordings(newRecordings)
    
        //update database, mark video as downloaded
        fetch(`/api/video/${update}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                downloaded: true
            })
        })
            .then(res => res.json())

    }

    }
        
    

    useEffect(() => {
        //get user details from database using id
        fetch(`/api/user/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setName(data)
            }
        )
        
    
      //get all user video recordings
      const getRecordings = async () => {
        const response = await fetch(`/api/usernotification/stats/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const json = await response.json()
        setRecordings(json)

      }

      getRecordings()    

    }, [user])

    return (
        <div className="ui segment inverted">

            <h1 className="ui header inverted">
                {name && `${name.name}` }
            </h1>

            <table className="ui celled table inverted">
            <thead>
                <tr>
                <th>Audio</th>
                <th>Notification</th>
                <th>Reply</th>
                <th>Download</th>
                </tr>
            </thead>
            <tbody>
                {recordings && recordings.map(record=>(
                <tr key={record._id}>
                <td>{record.audioId.title}</td>
                <td>
                <i className={`icon ${record.read ? 'checkmark' : 'close'}`}></i>
                    {`${record.read ? 'Read' : 'Not read'}`}
                    </td>
                <td className={`${record.videoId?'positive':'negative'}`}>
                    {`${record.videoId?'File uploaded':'File not uploaded'}`}
                </td>
                {record.videoId?
                    <td className={`${record.videoId.downloaded?'positive':'negative'}`}>
                        <DownloadButton
                            recordId={record._id}
                            audio={record.audioId}
                            url={`/api/file/video/${record.videoId._id+'.'+record.videoId.video.split('.').pop()}`}
                            markAsDownloaded={markAsDownloaded}
                            />

                        <DownloadZip
                            recordId={record._id}
                            audio={record.audioId}
                            url={`/api/file/video/${record.videoId._id+'.'+record.videoId.video.split('.').pop()}`}
                            markAsDownloaded={markAsDownloaded}
                            />

                        {`${record.videoId.downloaded?' File downloaded':' File not downloaded'}`}
                    </td>
                    :<td></td>
                }
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
    
}

export default Recordings