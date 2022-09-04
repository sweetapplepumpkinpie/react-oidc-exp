import React from 'react'
import { useAuth } from './services/auth/useAuth'

const LoggedIn = () => {
  const auth = useAuth()
  if (auth && auth.userData) {
    return (
      <div>
        <strong>Logged in! 🎉</strong>
        <br />
        <button onClick={() => auth.signOut()}>Log out!</button>
      </div>
    )
  }
  return (
    <div>
      <button onClick={() => auth.setSignIn(true)}>LogIn!</button>
    </div>
  )
}

export default LoggedIn
