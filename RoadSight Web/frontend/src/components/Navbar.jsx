import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/predictor', label: 'Risk Predictor' },
  { to: '/models', label: 'Model Performance' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 20 L10 4 L14 4 L17 20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="6" x2="12" y2="9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="11.5" x2="12" y2="14.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12" y2="19" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-lg tracking-tight text-ink">
            Road<span className="text-accent">Sight</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-gray-500 hover:text-ink hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
