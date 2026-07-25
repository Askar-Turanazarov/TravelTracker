import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { registerSchema, type RegisterFormData } from '@/utils/validation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import FormField from '@/components/FormField'
import ErrorMessage from '@/components/ErrorMessage'

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    display_name: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterFormData>>({})
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

    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const errs: Partial<RegisterFormData> = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterFormData
        errs[field] = err.message
      })
      setFieldErrors(errs)
      return
    }

    setLoading(true)
    const error = await register(formData)
    setLoading(false)

    if (error) {
      setApiError(error.error?.message || 'Ошибка регистрации')
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Регистрация</h1>
          <p className="mt-1 text-sm text-gray-400">Создайте аккаунт</p>
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

          <FormField label="Имя" error={fieldErrors.display_name} required>
            <Input
              type="text"
              name="display_name"
              placeholder="Alex Wanderer"
              value={formData.display_name}
              onChange={handleChange}
              error={fieldErrors.display_name}
            />
          </FormField>

          <FormField label="Пароль" error={fieldErrors.password} required>
            <Input
              type="password"
              name="password"
              placeholder="Минимум 8 символов, буква + цифра"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
          </FormField>

          <Button type="submit" loading={loading} className="w-full">
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}