import { apiClient } from './axiosClient'

export interface AuthResponse {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/login?useCookies=false', {
    email,
    password,
  })
  return data
}

export const registerUser = async (email: string, password: string): Promise<void> => {
  await apiClient.post('/register', {
    email,
    password,
  })
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete apiClient.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

// Initialize token from local storage on load
const savedToken = localStorage.getItem('token')
if (savedToken) {
  setAuthToken(savedToken)
}
