import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/Logo'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const navLinks = [
    { to: '/dashboard', label: 'Дашборд' },
    { to: '/map', label: 'Карта' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Админ' }] : []),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* Верхняя панель */}
      <header className="bg-dark-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-400">{user?.display_name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Выйти
            </button>
          </div>

          {/* Мобильная кнопка */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-dark-900 px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-800" />
            <div className="text-sm text-gray-400">{user?.display_name || user?.email}</div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Выйти
            </button>
          </div>
        )}
      </header>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}