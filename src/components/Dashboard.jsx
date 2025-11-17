import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { CalendarDays, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await api.getProjects()
        setProjects(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6 text-blue-100">Lade Projekte…</div>
  if (error) return <div className="p-6 text-red-300">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Zeitstrahl Überblick</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gradient-to-r from-blue-500/40 via-cyan-400/40 to-blue-500/40" />
          <div className="grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-6 relative z-10">
            {projects.map((p) => (
              <div key={p._id} className="bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'completed' ? 'bg-emerald-400' : p.status === 'active' ? 'bg-blue-400' : p.status === 'on-hold' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                  <div className="text-white/90 font-medium truncate" title={p.name}>{p.name}</div>
                </div>
                <div className="flex items-center gap-3 text-blue-100 text-xs">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={14} />{p.start_date || '—'}</span>
                  <span className="opacity-50">→</span>
                  <span className="inline-flex items-center gap-1"><CalendarDays size={14} />{p.end_date || '—'}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-blue-100 text-xs">
                  <span className="inline-flex items-center gap-1"><Clock size={14} />{p.progress}%</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 size={14} />{p.task_counts?.done || 0}</span>
                  <span className="inline-flex items-center gap-1"><AlertCircle size={14} />{(p.task_counts?.open || 0) + (p.task_counts?.in_progress || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
