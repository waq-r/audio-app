import React, {useState, useEffect} from "react";
import {useAuthContext} from '../hooks/useAuthContext'


const NotificationCount = () => {
    const {user} = useAuthContext()
    const [count, setCount] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        const interval = setInterval(
            () => {
                //get user notification count from db
                const getNotification = async () => {
                    const res = await fetch(`/api/usernotification/count/${user._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const data = await res.json()
                    if(res.ok) {
                        setCount(data)
                        setFirstLoad(false)
                    }
                    if(!res.ok) {
                        console.log("notification count not ok ", data.error);
                    }
                }

                getNotification()
            }
            , firstLoad?1000:60000)

        return () => {
          clearInterval(interval);
        };
      }, [user, firstLoad]);

    return (
        <span> 
            {count>0 &&
            <label className="ui red circular label">{count}</label>
            }
            {(count===0 || count===null) &&
            <label className="ui black circular label"></label>
            }
        </span>
    )
}

export default NotificationCount;