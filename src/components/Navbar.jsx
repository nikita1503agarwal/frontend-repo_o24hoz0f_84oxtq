import { useState } from 'react'
import { Rocket, CalendarRange, PanelsTopLeft, MessageSquare } from 'lucide-react'

export default function Navbar({ current, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: CalendarRange },
    { id: 'projects', label: 'Projects', icon: PanelsTopLeft },
    { id: 'chat', label: 'Chatbot', icon: MessageSquare },
  ]

  return (
    <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 bg-slate-900/70 border-b border-blue-400/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full" />
            <Rocket className="relative w-7 h-7 text-blue-300" />
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">Projektzentrale</p>
            <p className="text-xs text-blue-200/70 leading-tight">Inspired by IHK Region Stuttgart • Spacy edition</p>
          </div>
        </div>
        <nav className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-blue-400/20">
          {tabs.map(t => {
            const Icon = t.icon
            const active = current === t.id
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${active ? 'bg-blue-500/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.8)]' : 'text-blue-200/80 hover:text-white hover:bg-blue-400/10'}`}
              >
                <Icon className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
