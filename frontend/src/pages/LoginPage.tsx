import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { loginSchema, type LoginFormData } from '@/utils/validation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import FormField from '@/components/FormField'
import ErrorMessage from '@/components/ErrorMessage'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginFormData>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const errors: Partial<LoginFormData> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData
        errors[field] = err.message
      })
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    const error = await login(formData)
    setLoading(false)

    if (error) {
      setApiError(error.error?.message || 'Ошибка входа')
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Вход</h1>
          <p className="mt-1 text-sm text-gray-400">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && <ErrorMessage message={apiError} />}

          <FormField label="Email" error={fieldErrors.email} required>
            <Input
              type="email"
              name="email"
              placeholder="traveler@example.com"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />
          </FormField>

          <FormField label="Пароль" error={fieldErrors.password} required>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
          </FormField>

          <Button type="submit" loading={loading} className="w-full">
            Войти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary-400 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}