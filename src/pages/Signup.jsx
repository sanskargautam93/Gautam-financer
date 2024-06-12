import React from 'react'
import Header from '../Components/Header'
import SignupSignInComponent from '../Components/SignupSignin'

const Signup = () => {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SignupSignInComponent/>
      </div>
    </div>
  )
}

export default Signup