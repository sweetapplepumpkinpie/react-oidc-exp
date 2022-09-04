import { TOKEN_TYPES } from '../constants'

export const setAuthToken = (token) => {
  const { token_type, access_token } = token

  switch (token_type) {
    case TOKEN_TYPES.BEARER_TOKEN:
      localStorage.setItem('token', `Bearer ${access_token}`)
      break
    default:
      localStorage.setItem('token', access_token)
      break
  }
}

export const getAuthToken = () => localStorage.token

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}
