import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import NotificationCount from "./NotificationCount";

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
  
    const handleClick = () => {
      logout()
    }

    return (
        <div className="ui large inverted menu">
            <Link className="header item" to="/">HiVO</Link>
            {user && user.role === 'admin' && (
            <Link className="item" to="/pages/users">Users</Link>
            )}
            {user && user.role === 'user' &&
            <Link className="item" to={`/pages/recordings/${user._id}`}>
                Audios
            </Link>
            }
            {user &&
            <Link className="item" to="/pages/notification/user">
                Notifications 
                <NotificationCount />
            </Link>
            }
            {user && user.role === 'admin' && (
            <Link className="item" to="/pages/newaudio">Record Audio</Link>
            )}
                {user && (
                    <div className="ui inverted menu">
                    <span className="item">{user.name}</span>
                    <button className="ui primary item basic button" onClick={handleClick}>Log out</button>
                    </div>
                )}
                {!user && (
                    <div className="ui inverted menu">
                    <Link className="item" to="/login">Login</Link>
                    <Link className="item" to="/signup">Signup</Link>
                    </div>
                )}
        </div>
    )
    }

export default Navbar;