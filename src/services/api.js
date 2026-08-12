// services/api.js
import axios from 'axios'
// http://13.140.157.161:5000/api
// https://vatesbet.com//api/api
// http://localhost:5000/api
// https://boombet365.com/api
// https://boombet365.com/api
// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',   
    'Accept': 'application/json',
  },
})

// Request interceptor - add auth token

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api