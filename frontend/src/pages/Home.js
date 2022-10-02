import React from 'react'
import LoadDrafts from '../components/LoadDrafts'

const Home = () => {

  return (
    <div className="ui inverted segment">
      <div className="ui inverted header">
        <h1>Welcome to HiVO online</h1>
      </div>
      <div className='ui inverted segment'>
              <LoadDrafts />
      </div>
    </div>
  )
}

export default Home