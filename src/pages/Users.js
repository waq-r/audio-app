import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserCard from "../components/UserCard";
import {useAuthContext} from '../hooks/useAuthContext'

const Users = () => {
    const {user} = useAuthContext()
    const [users, setUsers] = useState(null);

    //get all users from db
    useEffect(() => {

        if(user && user.role !== 'admin') {
            return <Navigate to="/login" />
        }
        
    const getUsers = async () => {
        const res = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const data = await res.json()

        if(res.ok) {
            setUsers(data)
            console.log("users ", data);
        }

        if(!res.ok) {
            console.log("users not ok ", data.error);
        }
    }

    getUsers()

    }, [user]);



    return (
        <div className="ui inverted segment">
            <h1>Users</h1>
            <div className="ui middle aligned divided inverted list">
                {users && users.map((usr) => (
                    <div  key={usr._id}>
                        <UserCard usr={usr}/>
                    </div>
                ))}
            </div>
            </div>
    )
}

export default Users;