import React, {useState} from "react";
import { Navigate } from "react-router-dom";
import {useAuthContext} from '../hooks/useAuthContext'
import TimeAgo from 'react-timeago'

const UserCard = ({ usr }) => {

    const {user} = useAuthContext()

    const [active, setActive] = useState(usr.active)

    if(user.role !== 'admin') {
        return <Navigate to="/" />
    }

    const setStatus = async (id, status) => {
        const res = await fetch('/api/user/status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({active: status, id: id}),
        })

        const data = await res.json()

        if(res.ok) {
            setActive(status)
        }

        if(!res.ok) {
            console.log("status not updated ", data.error);
        }
    }

    return (
        <div className=" item">
                <div className="content">
                    <div className="ui large horizontal divided list">
                        <div className="item">
                            <div className="ui toggle checkbox">
                            
                            {active ? <input type="checkbox" defaultChecked="checked" onChange={()=>setStatus(usr._id, !active)}/> 
                                        : <input type="checkbox" onChange={()=>setStatus(usr._id, !active)}/>
                                        }
                            <label className="ui black inverted label">Status</label>
                            </div>
                        </div>
                        <div className="item">
                        <i className="user icon"></i>
                            {usr.name}
                            </div>
                        <div className="item">
                        <i className="mail icon"></i>
                            {usr.email}
                            </div>
                        <div className="item">
                        <i className="clock icon"></i>
                            <TimeAgo date={usr.date} />
                            </div>
                    </div>     
                </div>
            </div>
    )
}

export default UserCard;