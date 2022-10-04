import React from 'react'
import UploadMultiple from '../components/UploadMultiple'

const Home = () => {

  return (
    <div className="ui inverted segment">
      <div className="ui inverted header">
        <h1>Welcome to HiVO</h1>
      </div>
      <div className='ui inverted segment'>
              <UploadMultiple />
      </div>
    </div>
  )
}

export default Home