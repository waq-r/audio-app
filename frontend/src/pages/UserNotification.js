import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeAgo from 'react-timeago'
import {useAuthContext} from '../hooks/useAuthContext'

const UserNotification = () => {
    const [notification, setNotification] = useState(null);

    const {user} = useAuthContext()

    //url path audio or video
    const media = user.role === 'admin' ? 'video' : 'audio'

    useEffect(() => {
        const getNotification = async () => {
            const res = await fetch('/api/usernotification/'+user._id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }

            })

            const data = await res.json()

            if(res.ok) {
                setNotification(data)
            }

        }
        if(user) {
            getNotification()
        }
    }, [user]);

    const markAsRead = async (notification) => {
        if(notification.read === false) {
        const res = await fetch('/api/usernotification/'+notification._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({read: true})
        })

        const data = await res.json()

        if(!res.ok) {
            console.log("mark as read in db not ok ", data.error);
        }

    }

    }

    

    return (
        <div className="ui inverted segment">
            <h1>Notifications</h1>
            <div className="ui large relaxed divided inverted selection list">
            {notification && notification.map((notification) => (
                <div className="item" key={notification._id} onClick={()=>markAsRead(notification)} >
                    <i className= {
                        notification.read?
                        'large bell red outline middle aligned icon'
                        :'large red bell middle aligned icon'} ></i>
                        <div className="content">
                    <Link className="header" to={`/pages/${media}/${notification._id}`}>
                    
                    <div className="header">{notification.notification.title}</div>
                    <div className="description"><TimeAgo date={notification.notification.createdAt} /></div>
                    
                    </Link>
                    </div>
                    </div>
            ))}
        </div>
        </div>
    )
}

export default UserNotification;