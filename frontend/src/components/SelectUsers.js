import React, {useEffect, useState} from "react";
import {useAuthContext} from '../hooks/useAuthContext'

const SelectUsers = ({users, setUsers}) => {
        const [isActive, setIsActive] = useState(false)
        const {user} = useAuthContext()

        useEffect(() => {
        //get all users from db
        const getUsers = async () => {
            const res = await fetch('/api/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    "role": "user"
                  }),
            })
            const data = await res.json()
            if(res.ok) {

                const selectedUsers = data.map(usr => {
                    return {...usr, ...{"selected": false}}
                })

                setUsers(selectedUsers)
            }
            if(!res.ok) {
                console.log("error ", data.error);
            }
        }

        getUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [user])

            const toggleSelect = (toggleUsr) => {
                const newUsers = users.map((usr) => {

                    if(usr._id === toggleUsr._id) {
                        return {...usr, ...{"selected": !toggleUsr.selected}}
                    }
                    return usr
                })
                setUsers(newUsers)
                //onUserSelect(newUsers)
            }

            const selectAllUsers = (boolValue) => {
                const newUsers = users.map((usr) => {
                    return {...usr, ...{"selected": boolValue}}
                })
                setUsers(newUsers)
                //onUserSelect(newUsers)
            }

            const toggleClass = () => {
                setIsActive(!isActive)
            }

        return (
            <div className="ui inverted segment">

<div className="ui inverted fluid accordion">
  <div className="active title" onClick={toggleClass}>
    <i className="dropdown icon"></i>
    Select users to share with
  </div>
  <div className={isActive?'active content':'content'}>

<div className="ui inverted segment">
  <div className="ui two column very relaxed grid">
    <div className="column">

            <h3>Users</h3>
            <div className="ui header">
                <button className="ui button" onClick={() => selectAllUsers(true)}>Select all</button>
            </div>
            <div className="ui inverted horizontal list">
                {users.filter(usr => !usr.selected).map(usr => {
                    return (
                        <div className="inverted item" key={usr._id}>
                            <div className="ui basic inverted buttons">
                                <button 
                                    className="ui inverted button"
                                    title={usr.email}
                                    onClick={()=>toggleSelect(usr)} >
                                        {usr.name}
                                </button>
                            </div>
                        </div>
                    )
                    })}
            </div>

    </div>
    <div className="column">

            <h3>Selected users</h3>
            <div className="ui header">
                <button className="ui button" onClick={() => selectAllUsers(false)}>Clear all</button>
            </div>
            <div className="ui inverted horizontal list">
                {users.filter(usr => usr.selected).map(usr => {
                    return (
                        <div className="ui item" key={usr._id}>
                            <div className="ui buttons">
                                <button 
                                    className="ui olive button"
                                    title={usr.email}
                                    onClick={()=>toggleSelect(usr)} >
                                        {usr.name}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            </div>
  </div>
  <div className="ui vertical divider">
  🔛
  </div>
</div>

        </div>
        </div>

            </div>
        )
    }

    export default SelectUsers