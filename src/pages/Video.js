import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TimeAgo from 'react-timeago'

const Video = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const getVideo = async () => {

        //get audio from api
        const response = await fetch(`/api/video/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const json = await response.json()
        console.log(json.video)
        setVideo(json)


}
getVideo()

    }, [])

    return (
        <div className="ui segment">
            {video && (
            <div className="ui fluid card">
            <div className="content">
                <div className="meta">
                    <span className="date">Shared </span>
                    <TimeAgo date={video.date} />
                </div>
                <video controls width="70%">
                <source src={`../../video/${id}.mp4`} type="video/mp4" />
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