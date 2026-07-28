import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/Logo'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const navLinks = [
    { to: '/dashboard', label: 'Дашборд' },
    { to: '/map', label: 'Карта' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Админ' }] : []),
  ]

  const navItems = navLinks.map((link) => {
    const isActive = location.pathname === link.to
    return (
      <Link
        key={link.to}
        to={link.to}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-radius-md text-sm font-medium transition-all duration-200
          ${isActive
            ? 'bg-surface-elevated text-white shadow-glow-accent'
            : 'text-gray-400 hover:text-white hover:bg-surface-hover'
          }`}
      >
        {link.label}
      </Link>
    )
  })

  return (
    <>
      {/* Desktop sidebar (md+) */}
      <aside className="hidden md:flex md:flex-col w-60 bg-surface border-r border-subtle sticky top-0 h-screen shrink-0">
        <div className="p-4">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems}
        </nav>

        <div className="p-4 border-t border-subtle">
          <div className="text-secondary text-white/60 truncate">
            {user?.display_name || user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header (<md) */}
      <div className="md:hidden w-full bg-surface border-b border-subtle">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo size="sm" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-300"
          >
            {mobileOpen
              ? <XMarkIcon className="h-6 w-6" />
              : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-subtle px-4 py-3 space-y-3">
            {navItems}
            <hr className="border-subtle" />
            <div className="text-secondary text-white/60">
              {user?.display_name || user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </>
  )
}
