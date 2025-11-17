import { Sparkles, LayoutDashboard, MessageSquare, Folder, Rocket } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const tab = location.pathname
  
  const tabs = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: Folder },
    { to: '/chat', label: 'Chatbot', icon: MessageSquare },
  ]

  return (
    <header className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(12,74,110,0.25),transparent_40%)]" />
      <div className="relative z-10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 grid place-items-center shadow-lg">
              <Rocket className="text-white" size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-white font-semibold -mb-0.5">ProjektCockpit</div>
              <div className="text-xs text-blue-200/90">IHK Region Stuttgart • spacy</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            {tabs.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${tab === to ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="text-blue-200 hidden sm:block text-sm">
            <span className="opacity-70 mr-2">Backend:</span>
            <span className="font-mono">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
