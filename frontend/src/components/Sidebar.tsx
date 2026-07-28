import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/Logo'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const navLinks = [
    { to: '/dashboard', label: 'Дашборд' },
    { to: '/map', label: 'Карта' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Админ' }] : []),
  ]

  const desktopNavItem = (link: { to: string; label: string }) => {
    const isActive = location.pathname === link.to
    return (
      <Link
        key={link.to}
        to={link.to}
        className={`flex items-center gap-3 px-3 py-2 rounded-radius-md text-sm font-medium transition-all duration-200
          ${isActive
            ? 'bg-surface-elevated text-white shadow-glow-accent'
            : 'text-gray-400 hover:text-white hover:bg-surface-hover'
          }`}
      >
        {link.label}
      </Link>
    )
  }

  const mobileNavItem = (link: { to: string; label: string }) => {
    const isActive = location.pathname === link.to
    return (
      <Link
        key={link.to}
        to={link.to}
        className={`shrink-0 px-3 py-1.5 rounded-radius-md text-sm font-medium whitespace-nowrap transition-all duration-200
          ${isActive
            ? 'bg-surface-elevated text-white shadow-glow-accent'
            : 'text-gray-400 hover:text-white hover:bg-surface-hover'
          }`}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile top nav (< md) — sticky bar with horizontal pills */}
      <div className="md:hidden sticky top-0 z-50 bg-surface border-b border-subtle">
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
          <div className="shrink-0 mr-2">
            <Logo size="sm" />
          </div>
          {navLinks.map(mobileNavItem)}
          <div className="ml-auto flex items-center gap-2 shrink-0 pl-3 border-l border-subtle">
            <span className="text-secondary text-white/60 text-sm truncate max-w-[100px]">
              {user?.display_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors shrink-0"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar (md+) — sticky left panel */}
      <aside className="hidden md:flex md:flex-col w-60 bg-surface border-r border-subtle sticky top-0 h-screen shrink-0">
        <div className="p-4">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navLinks.map(desktopNavItem)}
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
    </>
  )
}
