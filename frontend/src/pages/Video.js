import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TimeAgo from 'react-timeago'
import {useAuthContext} from '../hooks/useAuthContext'
import DownloadButton from "../components/DownloadButton";
import DownloadZip from "../components/DownloadZip";


const Video = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);

    const {user} = useAuthContext()

    useEffect(() => {
        const getVideo = async () => {

        //get audio from api
        const response = await fetch(`/api/usernotification/details/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const json = await response.json()
        setVideo(json)

}

        if(user) {
            getVideo(id)
        }
        // eslint-disable-next-line
    }, [user])

        //Mark video as downloaded
        const markAsDownloaded = (recordId) => {
    
            if (video.videoId.downloaded === false) {    
            //update database, mark video as downloaded
            fetch(`/api/video/${recordId}`, {
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
    
    return (
        <div className="ui inverted segment container">
            {video && (
            <div className="ui fluid inverted card">
            <div className="content inverted">
            <div className="header">
                    {video.user.name}
                </div>
                <div className="meta">
                    <span className="date">Shared </span>
                    <TimeAgo date={video.videoId.date} />
                </div>
                <audio controls src={`/api/file/video/${video.notification.link}`} type={`audio/${video.notification.link.split('.').pop()}}}`} >
                </audio>
            </div>
            <div className="content grey">
                <div className="header">
                    <DownloadButton
                            recordId={video.videoId._id}
                            audio={video.audioId}
                            url={`/api/file/video/${video.videoId._id+'.'+video.videoId.video.split('.').pop()}`}
                            markAsDownloaded={markAsDownloaded}
                            />

                    <DownloadZip
                        recordId={video.videoId._id}
                        audio={video.audioId}
                        url={`/api/file/video/${video.videoId._id+'.'+video.videoId.video.split('.').pop()}`}
                        markAsDownloaded={markAsDownloaded}
                        />
                    </div>
            </div>
            </div>
            )}
        </div>
    )
}

export default Video;