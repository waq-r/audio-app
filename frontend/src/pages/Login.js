import React,{ useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <div className="ui inverted middle aligned center aligned segment">
  <div className="ui inverted segment">
    <h2 className="ui inverted header">
      <div className="content">
        Log-in to your account
      </div>
    </h2>
    <form className="ui form" onSubmit={handleSubmit}>
    <div className="ui inverted stacked segment">
        <div className="inline field">
          <div className="ui left icon input">
            <i className="mail icon"></i>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
        placeholder="E-mail address"
      />
      </div>
        </div>
        <div className="inline field">
          <div className="ui left icon input">
            <i className="lock icon"></i>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
        placeholder="Password"
      />
          </div>
        </div>
      </div>
      <button className="ui large submit button" disabled={isLoading}>Log in</button>
      {error && <div className="ui inverted message error">{error}</div>}
    </form>
  </div>
</div>
  )
}

export default Login