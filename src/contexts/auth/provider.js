import { ReactNode, useState, useEffect } from 'react'

import { AuthContext } from '.'
import {
  getProfile,
  removeAuthorizationHeader,
  setAuthorizationHeader,
} from '../../services/api'
import { getAuthToken, removeAuthToken, setAuthToken } from '../../utils'

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const handleTokenVerify = () => {
    const localStorageToken = getAuthToken()

    if (localStorageToken) {
      setAuthorizationHeader(localStorageToken)
      getProfile()
        .then(({ data: user }) => {
          setUser(user)
        })
        .catch((error) => {
          removeAuthToken()
          removeAuthorizationHeader()
          console.log(error)
        })
    }
  }
  const setLocalStorageToken = (authToken) => {
    setAuthToken(authToken)
    handleTokenVerify()
  }
  const removeLocalStorageToken = () => {
    removeAuthToken()
    setUser(undefined)
  }

  useEffect(() => {
    handleTokenVerify()
  }, [])

  return (
    <div>
      <AuthContext.Provider
        value={{ user, setUser, setLocalStorageToken, removeLocalStorageToken }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  )
}
