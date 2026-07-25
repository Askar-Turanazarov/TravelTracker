import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-400">
      <p className="text-4xl font-bold">404</p>
      <p>Страница не найдена</p>
      <Link to="/" className="text-primary-400 hover:underline">
        На главную
      </Link>
    </div>
  )
}