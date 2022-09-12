import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TimeAgo from 'react-timeago'
import {useAuthContext} from '../hooks/useAuthContext'
import DownloadButton from "../components/DownloadButton";
import DownloadZip from "../components/DownloadZip";
import parse from 'html-react-parser';



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

<div className="ui placeholder inverted segment">
  <div className="ui two column stackable center aligned grid">
    <div className="ui vertical divider"></div>
    <div className="middle aligned row">
      <div className="column">
        {video &&
        <div className="ui left aligned inverted header">
            {video.notification.title.split(' ')[0]}
                <div className="sub header">
                        Shared <TimeAgo date={video.videoId.date} />
                </div>
            </div>
        }
            
            <div className="segment">
                {video &&
                    <audio controls 
                            src={`/api/file/video/${video.notification.link}`} 
                            type={`audio/${video.notification.link.split('.').pop()}}}`} >
                    </audio>
                }
            <div className="ui horizontol divider"></div>
            {video &&
                <div className="ui left floated two column grid">
                    <div className="column">
                        <DownloadButton
                                recordId={video.videoId._id}
                                audio={video.audioId}
                                url={`/api/file/video/${video.videoId._id+'.'+video.videoId.video.split('.').pop()}`}
                                markAsDownloaded={markAsDownloaded}
                                />
                        </div>
                        <div className="column">
                        <DownloadZip
                            recordId={video.videoId._id}
                            audio={video.audioId}
                            url={`/api/file/video/${video.videoId._id+'.'+video.videoId.video.split('.').pop()}`}
                            markAsDownloaded={markAsDownloaded}
                            />
                        </div>
                </div>
            }
            </div>
        
      </div>
      <div className="column">
        <div className="ui inverted header">
        {video && video.audioId.title}
        </div>
        <div className="ui content">
            <div className="ui large image">
            {video && parse(video.audioId.description)}
            </div>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
    )
}

export default Video;