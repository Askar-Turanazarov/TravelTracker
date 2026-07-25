import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* Хедер */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Войти
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Регистрация
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Контент страницы с отступом под хедер */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Подвал (простой) */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TravelTracker. All rights reserved. © Askar Turanazarov
      </footer>
    </div>
  )
}