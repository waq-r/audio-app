import React, { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(name, email, password)
  }

  return (
    <div className="ui inverted middle aligned center aligned segment">
      <div class="ui form">
</div>
    <form className="ui inverted segment" onSubmit={handleSubmit}>
    <h2 className="ui inverted header">
      <div className="content">
        Sign Up
      </div>
    </h2>
      <div className="ui inverted input inline">
      <label className="ui large label">
        <i className="user icon"></i>
          Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name} 
      />
        </div>
    <div className="ui inverted divider"></div>
    <div className="ui inverted icon input inline">
        <label className="ui large label">
        <i className="mail icon"></i>
          Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
        </div>
    <div className="ui inverted divider"></div>
    <div className="ui inverted icon input inline">
    <label className="ui large label">
        <i className="lock icon"></i>
          Password:</label><br />
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />
        </div>
    <div className="ui inverted divider"></div>
    <div className="ui inverted left icon input">
      <button className="ui large submit button" disabled={isLoading}>Sign up</button>
    </div>
      {error && <div className="ui error message">{error}</div>}
    </form>
    </div>
  )
}

export default Signup