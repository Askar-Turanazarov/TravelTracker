import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let refreshAccessTokenFn: (() => Promise<string | null>) | null = null

export function setRefreshTokenFn(fn: () => Promise<string | null>) {
  refreshAccessTokenFn = fn
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry && refreshAccessTokenFn) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(interval)
              const token = localStorage.getItem('access_token')
              if (token) {
                originalRequest.headers!.Authorization = `Bearer ${token}`
                resolve(api(originalRequest))
              } else {
                reject(error)
              }
            }
          }, 100)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const newToken = await refreshAccessTokenFn()
        if (newToken) {
          originalRequest.headers!.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } finally {
        isRefreshing = false
      }
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api