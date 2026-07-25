import { Link } from 'react-router-dom'
import { MapIcon, FlagIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'
import AnimatedMapBackground from '@/components/AnimatedMapBackground'
import DemoStats from '@/components/DemoStats'

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Анимированный контурный фон карты */}
      <AnimatedMapBackground />

      {/* Контент */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        {/* Герой-секция */}
        <div className="text-center space-y-6 opacity-0 animate-fade-in-up">
          {/* Иконка */}
          <div className="flex justify-center">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <SparklesIcon className="h-8 w-8 text-primary-400" />
            </div>
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Отмечай мир,
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              который покорил
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="max-w-xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            TravelTracker — ваш личный дневник путешествий. Отмечайте страны и города,
            в которых побывали, следите за прогрессом и вдохновляйтесь новыми маршрутами.
          </p>

          {/* CTA кнопка */}
          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl
                         shadow-lg shadow-primary-700/30 hover:shadow-primary-700/50 hover:scale-105
                         transition-all duration-300"
            >
              Начать путешествие
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Преимущества (3 карточки) */}
        <div className="mt-24 sm:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Карточка 1 */}
          <div className="opacity-0 animate-fade-in-up animate-delay-200
                          p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                          hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="p-2.5 bg-primary-500/10 rounded-xl inline-flex mb-4">
              <MapIcon className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Интерактивная карта</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Визуализируйте свои путешествия на тёмной карте мира. Каждый город — маркер, каждая страна — закрашенный регион.
            </p>
          </div>

          {/* Карточка 2 */}
          <div className="opacity-0 animate-fade-in-up animate-delay-300
                          p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                          hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="p-2.5 bg-primary-500/10 rounded-xl inline-flex mb-4">
              <FlagIcon className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Статистика и прогресс</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Отслеживайте процент охваченного мира, количество стран и городов. Смотрите разбивку по регионам.
            </p>
          </div>

          {/* Карточка 3 */}
          <div className="opacity-0 animate-fade-in-up animate-delay-400
                          p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                          hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="p-2.5 bg-primary-500/10 rounded-xl inline-flex mb-4">
              <ChartBarIcon className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Заметки и даты</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Добавляйте даты визитов и личные заметки к каждому городу. Создавайте историю своих приключений.
            </p>
          </div>
        </div>

        {/* Демо-статистика (анимированные счётчики) */}
        <DemoStats />

        {/* Второй CTA внизу */}
        <div className="mt-24 text-center opacity-0 animate-fade-in-up animate-delay-500">
          <p className="text-gray-400 mb-4">Готовы начать своё путешествие?</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Создать аккаунт бесплатно
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}