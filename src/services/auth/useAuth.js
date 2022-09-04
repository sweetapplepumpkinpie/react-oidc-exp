import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'AuthProvider context is undefined, please verify you are calling useAuth() as child of a <AuthProvider> component.'
    )
  }

  return context
}
