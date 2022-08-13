import React, {useState} from "react";

const NotificationCount = (newNotification)=>{

    const [notificationCount, setNotificationCount] = useState(0);

    const es = new EventSource('/stream');

        es.onmessage = (event) => {
        console.log('Event data ', event.data);
        setNotificationCount(notificationCount +1);
    }

    es.onerror = (error) =>{
        console.log('Error: ',error)
    }
    es.onopen = (event) => {
        console.log('Open: ', event)
    }

    return (
        <button className="ui button red">{notificationCount}</button>
    )
}

export default NotificationCount;