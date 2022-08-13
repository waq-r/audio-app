import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeAgo from 'react-timeago'

const UserNotification = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const getNotification = async () => {
            const res = await fetch('/api/notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({forWhom: "user"}),

            })

            const data = await res.json()

            if(res.ok) {
                const {notifications} = data;
                setNotification(notifications)
            }
        }

        getNotification()
    }, []);

    return (
        <div className="ui inverted segment">
            <h1>Notifications</h1>
            <div className="ui relaxed divided inverted selection list">
            {notification && notification.map((notification) => (
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