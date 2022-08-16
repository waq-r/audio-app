import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeAgo from 'react-timeago'
import {useAuthContext} from '../hooks/useAuthContext'

const UserNotification = () => {
    const [notification, setNotification] = useState(null);

    const {user} = useAuthContext()

    useEffect(() => {
        const getNotification = async () => {
            const res = await fetch('/api/notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({forWhom: user.role}),

            })

            const data = await res.json()

            if(res.ok) {
                const {notifications} = data;
                setNotification(notifications)
            }

            //reset user notifications to 0 in db
            const resetRes = await fetch('/api/user/notifications/reset/'+user._id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })

            const resetData = await resetRes.json()

            if(resetRes.ok) {
                console.log("reset user notifications to 0", resetData.msg);
            }

            if(!resetRes.ok) {
                console.log("reset user notifications not ok ", resetData.error);
            }

        }
        if(user) {
            getNotification()
        }
    }, [user]);

    

    return (
        <div className="ui inverted segment">
            <h1>Notifications</h1>
            <div className="ui relaxed divided inverted selection list">
            {notification && notification.map((notification, index) => (
                <div className="item" key={notification._id}>
                    <Link className="ui small image" to={`/pages/audio/${notification.link.split('.')[0]}`}>
                    <i className="large bell outline middle aligned icon"></i>
                    <div className="content">
                    <div className="header">{notification.title}</div>
                    <div className="description"><TimeAgo date={notification.createdAt} /></div>
                    </div>
                    </Link>
                    </div>
            ))}
        </div>
        </div>
    )
}

export default UserNotification;