import React from 'react'
import { AuthProvider } from './services/auth/AuthContext'
import logo from './logo.svg'
import './App.css'
import LoggedIn from './LoggedIn'

const oidcConfig = {
  onSignIn: async (user) => {
    alert('You just signed in, congratz! Check out the console!')
    console.log(user)
    window.location.hash = ''
  },
  authority: 'https://accounts.google.com',
  clientId: process.env.REACT_CLIENT_ID,
  clientSecret: process.env.REACT_CLIENT_SECRET,
  responseType: 'code',
  redirectUri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://cobraz.github.io/example-oidc-react',
}

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>OIDC React</p>
          <LoggedIn />
        </header>
      </div>
    </AuthProvider>
  )
}

export default App
