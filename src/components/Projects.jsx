import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Tag, StickyNote, CheckSquare } from 'lucide-react'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [index, setIndex] = useState(0)
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/projects`).then(r => r.json()).then(d => { setProjects(d); if (d.length) loadDetails(d[0]._id) })
  }, [])

  const loadDetails = async (projectId) => {
    const [n, t] = await Promise.all([
      fetch(`${baseUrl}/api/projects/${projectId}/notes`).then(r => r.json()),
      fetch(`${baseUrl}/api/projects/${projectId}/tasks`).then(r => r.json()),
    ])
    setNotes(n)
    setTasks(t)
  }

  const next = () => {
    const ni = (index + 1) % projects.length
    setIndex(ni)
    loadDetails(projects[ni]._id)
  }
  const prev = () => {
    const pi = (index - 1 + projects.length) % projects.length
    setIndex(pi)
    loadDetails(projects[pi]._id)
  }

  if (!projects.length) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-blue-200/80">Noch keine Projekte – lege eines im Chat an: "Neues Projekt Solar Alpha mit 40% Fortschritt"</div>
    )
  }

  const p = projects[index]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-lg bg-slate-800/60 border border-blue-400/20 text-white hover:bg-slate-700/60"><ChevronLeft /></button>
        <p className="text-white font-semibold">{p.name}</p>
        <button onClick={next} className="p-2 rounded-lg bg-slate-800/60 border border-blue-400/20 text-white hover:bg-slate-700/60"><ChevronRight /></button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
          <p className="text-blue-200/90 text-sm mb-2">Status: {p.status} • Fortschritt: {p.progress || 0}%</p>
          <div className="h-2 bg-slate-700/80 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400" style={{ width: `${p.progress || 0}%` }} />
          </div>
          <p className="text-white/90 text-sm">{p.description || 'Keine Beschreibung'}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {(p.tags || []).map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs text-blue-100 bg-blue-500/20 border border-blue-400/30 rounded-full px-2 py-0.5"><Tag className="w-3 h-3" />{t}</span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
          <p className="text-white font-medium mb-2 flex items-center gap-2"><StickyNote className="w-4 h-4" /> Notizen</p>
          <div className="space-y-2 max-h-60 overflow-auto pr-2">
            {notes.map(n => (
              <div key={n._id} className="text-sm text-blue-100/90 bg-slate-900/50 border border-blue-400/10 rounded-lg p-2">{n.content}</div>
            ))}
            {!notes.length && <p className="text-blue-200/70 text-sm">Keine Notizen</p>}
          </div>
        </div>

        <div className="md:col-span-3 bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
          <p className="text-white font-medium mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Offene Aufgaben</p>
          <div className="grid md:grid-cols-2 gap-2">
            {tasks.map(t => (
              <div key={t._id} className="text-sm text-blue-100/90 bg-slate-900/50 border border-blue-400/10 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-blue-200/70 text-xs">{t.status}</p>
                </div>
                <span className="text-xs text-blue-200/70">{t.priority || '—'}</span>
              </div>
            ))}
            {!tasks.length && <p className="text-blue-200/70 text-sm">Keine offenen Aufgaben</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
