import React, {useState, useEffect} from "react";
import {useAuthContext} from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'



const NotificationCount = () => {
    const {user} = useAuthContext()
    const [count, setCount] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const { logout } = useLogout()


    useEffect(() => {
        const interval = setInterval(
            () => {
                //get user notification count from db
                const getNotification = async () => {
                    try {
                    const res = await fetch(`/api/usernotification/count/${user._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    })

                        if (!res.ok) throw res
                    const data = await res.json()

                    setCount(data)
                    setFirstLoad(false)
                }
                    catch (err) {
                        console.log(err.status)
                        if ([401, 403].includes(err.status)){
                            logout()

                        }
                    }
                    
                    // if(res.ok) {
                    //     setCount(data)
                    //     setFirstLoad(false)
                    // }
                    // if(!res.ok) {
                    //     console.log("notification count not ok ", data.error);
                    // }
                }

                getNotification()
            }
            , firstLoad?1000:45000)

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