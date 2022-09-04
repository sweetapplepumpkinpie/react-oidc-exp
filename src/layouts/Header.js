import { useContext } from 'react'

import { Link } from 'react-router-dom'

import { AuthContext } from '../contexts/auth'
import { getAuthToken } from '../utils'

const Links = ['Todo']

export const Header = () => {
  const authContext = useContext(AuthContext)
  const token = getAuthToken()

  return (
    <div
      style={{
        height: '100px',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/">Home</Link>
    </div>
  )
}
