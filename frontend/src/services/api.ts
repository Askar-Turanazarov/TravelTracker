import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Базовый URL backend-а — позже заменим на переменную окружения
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Функция, которая будет установлена из AuthContext для обновления токена
let refreshAccessTokenFn: (() => Promise<string | null>) | null = null

export function setRefreshTokenFn(fn: () => Promise<string | null>) {
  refreshAccessTokenFn = fn
}

// Добавление access-токена в заголовки
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Перехват ошибок 401, попытка рефреша
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry && refreshAccessTokenFn) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessTokenFn()
      if (newAccessToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      }
      // Если рефреш не удался — выбросить ошибку, в AuthContext будет редирект на логин
    }
    return Promise.reject(error)
  }
)

export default api