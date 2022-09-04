import { useAuth } from './useAuth'
import React from 'react'

/**
 * A public higher-order component to access the imperative API
 */
export function withAuth(Component) {
  const displayName = `withAuth(${Component.displayName || Component.name})`
  const Container = (props) => {
    const auth = useAuth()

    return <Component {...props} {...auth} />
  }

  Container.displayName = displayName

  return CContainer
}
