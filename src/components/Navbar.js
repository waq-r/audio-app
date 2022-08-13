import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="ui inverted menu">
        <div className="header item">HIVO ONLINE</div>
            <Link className="item" to="/">Home</Link>
            <Link className="item" to="/pages/notification/admin">Admin Notifications</Link>
            <Link className="item" to="/pages/notification/user">User Notifications</Link>
            <Link className="item" to="/pages/newaudio">Record Audio</Link>
        </div>
    )
    }

export default Navbar;