import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})