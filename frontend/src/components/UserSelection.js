import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Component } from "react";

export default class SelectUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
        users: [],
        isActive: false,
        };
    }
    
    componentDidMount() {
        this.getUsers();
    }

    getSelectedUsers = () => {
        return this.state.users.filter((usr) => usr.selected);
    };
    
    
    getUsers = async () => {
        const { user } = this.props;
        const res = await fetch("/api/user/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        },
        });
        const data = await res.json();
        if (res.ok) {
        const selectedUsers = data.map((usr) => {
            return { ...usr, ...{ selected: false } };
        });
    
        this.setState({ users: selectedUsers });
        }
        if (!res.ok) {
        console.log("error ", data.error);
        }
    };
    
    toggleSelect = (toggleUsr) => {
        const newUsers = this.state.users.map((usr) => {
        if (usr._id === toggleUsr._id) {
            return { ...usr, ...{ selected: !toggleUsr.selected } };
        }
        return usr;
        });
        this.setState({ users: newUsers });
        this.props.onUserSelect(newUsers);
    };
    
    selectAllUsers = (boolValue) => {
        const newUsers = this.state.users.map((usr) => {
        return { ...usr, ...{ selected: boolValue } };
        });
        this.setState({ users: newUsers });
        this.props.onUserSelect(newUsers);
    };
    
    toggleClass = () => {
        this.setState({ isActive: !this.state.isActive });
    };
    
    render() {
        return (
            <div className="ui inverted segment">

            <div className="ui inverted fluid accordion">
              <div className="active title" onClick={this.toggleClass}>
                <i className="dropdown icon"></i>
                Select Users
              </div>
              <div className={`content ${this.state.isActive ? "active" : ""}`}>
                <div className="ui inverted form">
                  <div className="inline fields">
                    <div className="field">
                      <div className="ui checkbox">
                        <input
                          type="checkbox"
                          name="example"
                          onChange={(e) => this.selectAllUsers(e.target.checked)}
                        />
                        <label>Select All</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ui inverted relaxed divided list">
                  {this.state.users.map((usr) => (
                    <div
                      className="item"
                      key={usr._id}
                      onClick={() => this.toggleSelect(usr)}
                    >
                      <i
                        className={`large middle aligned ${
                          usr.selected ? "check" : "empty"
                        } circular icon`}
                      ></i>
                      <div className="content">
                        <div className="header">{usr.name}</div>
                        <div className="description">{usr.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
}
