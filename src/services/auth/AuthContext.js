import React, {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  useMemo,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserManager, User } from 'oidc-client-ts'

export const AuthContext = React.createContext(undefined)

/**
 * @private
 * @hidden
 * @param location
 */
export const hasCodeInUrl = (location) => {
  const searchParams = new URLSearchParams(location.search)
  const hashParams = new URLSearchParams(location.hash.replace('#', '?'))

  return Boolean(
    searchParams.get('code') ||
      searchParams.get('id_token') ||
      searchParams.get('session_state') ||
      hashParams.get('code') ||
      hashParams.get('id_token') ||
      hashParams.get('session_state')
  )
}

export const initUserManager = (props) => {
  if (props.userManager) return props.userManager
  const {
    authority,
    clientId,
    clientSecret,
    redirectUri,
    silentRedirectUri,
    postLogoutRedirectUri,
    responseType,
    scope,
    automaticSilentRenew,
    loadUserInfo,
    popupWindowFeatures,
    popupRedirectUri,
    popupWindowTarget,
  } = props
  return new UserManager({
    authority: authority || '',
    client_id: clientId || '',
    client_secret: clientSecret,
    redirect_uri: redirectUri || '',
    silent_redirect_uri: silentRedirectUri || redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri || redirectUri,
    response_type: responseType || 'code',
    scope: scope || 'openid',
    loadUserInfo: loadUserInfo !== undefined ? loadUserInfo : true,
    popupWindowFeatures: popupWindowFeatures,
    popup_redirect_uri: popupRedirectUri,
    popupWindowTarget: popupWindowTarget,
    automaticSilentRenew,
  })
}

/**
 *
 * @param props AuthProviderProps
 */
export const AuthProvider = ({
  children,
  autoSignIn = true,
  onBeforeSignIn,
  onSignIn,
  onSignOut,
  location = window.location,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSingIn, setSignIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [userManager] = useState(() => initUserManager(props))

  const signOutHooks = useCallback(async () => {
    setUserData(null)
    onSignOut && onSignOut()
  }, [onSignOut])

  const signInPopupHooks = useCallback(async () => {
    const userFromPopup = await userManager.signinPopup()
    setUserData(userFromPopup)
    onSignIn && onSignIn(userFromPopup)
    await userManager.signinPopupCallback()
  }, [userManager, onSignIn])

  const isMountedRef = useRef(true)
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      // Store current isMounted since this could change while awaiting async operations below
      const isMounted = isMountedRef.current

      /**
       * Check if the user is returning back from OIDC.
       */
      if (hasCodeInUrl(location)) {
        const user = await userManager.signinCallback()
        setUserData(user)
        console.log(user)
        setIsLoading(false)
        onSignIn && onSignIn(user)
        return
      }

      const user = await userManager.getUser()
      if ((!user || user.expired) && autoSignIn) {
        onBeforeSignIn && onBeforeSignIn()
        userManager.signinRedirect()
      } else if (isMounted) {
        setUserData(user)
        setIsLoading(false)
      }
      return
    }
    isSingIn && getUser()
  }, [location, userManager, autoSignIn, onBeforeSignIn, onSignIn, , isSingIn])

  useEffect(() => {
    // for refreshing react state when new state is available in e.g. session storage
    const updateUserData = async () => {
      const user = await userManager.getUser()
      isMountedRef.current && setUserData(user)
    }

    userManager.events.addUserLoaded(updateUserData)

    return () => userManager.events.removeUserLoaded(updateUserData)
  }, [userManager])

  const value = useMemo(() => {
    return {
      signIn: async (args) => {
        await userManager.signinRedirect(args)
      },
      signInPopup: async () => {
        await signInPopupHooks()
      },
      signOut: async () => {
        if (userManager) {
          await userManager.removeUser()
        }
        await signOutHooks()
      },
      signOutRedirect: async (args) => {
        if (userManager) {
          await userManager.signoutRedirect(args)
        }
        await signOutHooks()
      },
      userManager,
      userData,
      isLoading,
      isSingIn,
      setSignIn: (value) => {
        setSignIn(value)
      },
    }
  }, [userManager, isLoading, userData, signInPopupHooks, signOutHooks])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
