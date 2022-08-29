import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TimeAgo from 'react-timeago'
import {useAuthContext} from '../hooks/useAuthContext'

const Video = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);

    const {user} = useAuthContext()

    useEffect(() => {
        const getVideo = async () => {

        //get audio from api
        const response = await fetch(`/api/video/${id}`, {
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
    }, [user])

    return (
        <div className="ui segment">
            {video && (
            <div className="ui fluid card">
            <div className="content">
                <div className="meta">
                    <span className="date">Shared </span>
                    <TimeAgo date={video.date} />
                </div>
                <video controls width="100%">
                <source src={`/api/file/video/${id}.${video.video.split('.')[1] || 'mp4'}`} type="video/mp4" />
                </video>
            </div>
            <div className="content">
                <div className="header">{video.video}</div>
            </div>
            </div>
            )}
        </div>
    )
}

export default Video;