import React, {useState, useEffect} from "react";
import {useAuthContext} from '../hooks/useAuthContext'


const NotificationCount = () => {
    const {user} = useAuthContext()
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => {
                //get user notification count from db
                const getNotification = async () => {
                    const res = await fetch(`/api/user/notifications/${user._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const data = await res.json()
                    if(res.ok) {
                        const {notifications} = data;
                        setCount(notifications)
                    }
                }

                getNotification()
            }
            , 30000)

        return () => {
          clearInterval(interval);
        };
      }, [user]);

    return (
        <span> 
            {count>0 &&
            <label className="ui red circular label">{count}</label>
            }
            {count===0 &&
            <label className="ui black circular label"></label>
            }
        </span>
    )
}

export default NotificationCount;