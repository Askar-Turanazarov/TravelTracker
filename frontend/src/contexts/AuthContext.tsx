import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import api, { setRefreshTokenFn } from '@/services/api'
import type { User, AuthTokens, LoginPayload, RegisterPayload, ApiError } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<ApiError | null>
  register: (payload: RegisterPayload) => Promise<ApiError | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function saveTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      setIsLoading(false)
      return
    }
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      if (payload.exp * 1000 > Date.now()) {
        setUser({
          id: payload.sub,
          email: '',
          display_name: '',
          role: payload.role,
        })
      }
    } catch {
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return null
    try {
      const { data } = await api.post<AuthTokens>('/auth/refresh', {
        refresh_token: refreshToken,
      })
      saveTokens(data.access_token, data.refresh_token)
      return data.access_token
    } catch {
      clearTokens()
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    setRefreshTokenFn(refreshAccessToken)
  }, [refreshAccessToken])

  const login = useCallback(async (payload: LoginPayload): Promise<ApiError | null> => {
    try {
      const { data } = await api.post<{ user: User; tokens: AuthTokens }>('/auth/login', payload)
      saveTokens(data.tokens.access_token, data.tokens.refresh_token)
      setUser(data.user)
      return null
    } catch (err: any) {
      return err.response?.data as ApiError
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload): Promise<ApiError | null> => {
    try {
      const { data } = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register', payload)
      saveTokens(data.tokens.access_token, data.tokens.refresh_token)
      setUser(data.user)
      return null
    } catch (err: any) {
      return err.response?.data as ApiError
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken })
      }
    } catch {
      // ignore
    } finally {
      clearTokens()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}