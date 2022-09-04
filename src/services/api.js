import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
})

export const setAuthorizationHeader = (token) => {
  api.defaults.headers.common['Authorization'] = token
}
export const removeAuthorizationHeader = () => {
  api.defaults.headers.common['Authorization'] = ''
}

export const login = (payload) => {
  const formData = new FormData()

  formData.append('username', payload.email)
  formData.append('password', payload.password)
  return api.post('/login', formData)
}

export const register = (payload) => api.post('/register', payload)

export const getProfile = () => api.get('/me')

export const getTodos = () => api.get('/todos')
