import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { ChevronLeft, ChevronRight, StickyNote, ListChecks } from 'lucide-react'

export default function ProjectSwiper() {
  const [projects, setProjects] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    (async () => {
      const data = await api.getProjects()
      setProjects(data)
    })()
  }, [])

  const current = projects[index]

  const next = () => setIndex((i) => (projects.length ? (i + 1) % projects.length : 0))
  const prev = () => setIndex((i) => (projects.length ? (i - 1 + projects.length) % projects.length : 0))

  if (!projects.length) return <div className="p-6 text-blue-100">Noch keine Projekte vorhanden.</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Projektkarten</h2>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/10"><ChevronLeft /></button>
          <button onClick={next} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/10"><ChevronRight /></button>
        </div>
      </div>

      {current && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-200/80">Status: {current.status}</div>
                <h3 className="text-2xl font-semibold text-white">{current.name}</h3>
              </div>
              <div className="text-4xl font-bold text-white/80">{current.progress}%</div>
            </div>
            <p className="mt-4 text-blue-100 whitespace-pre-line">{current.description || 'Keine Beschreibung.'}</p>
            <div className="mt-6 text-blue-100 text-sm">Tags: {current.tags?.join(', ') || '—'}</div>
          </div>

          <div className="space-y-6">
            <Section title="Offene Aufgaben" icon={ListChecks}>
              <AsyncList fetcher={() => api.getTasks(current._id)}
                renderItem={(t) => (
                  <div key={t._id} className="flex items-start justify-between py-2">
                    <div>
                      <div className="text-white">{t.title}</div>
                      <div className="text-xs text-blue-200/80">{t.status}</div>
                    </div>
                    {t.due_date && <div className="text-xs text-blue-200/70">Fällig: {t.due_date}</div>}
                  </div>
                )}
              />
            </Section>

            <Section title="Notizen" icon={StickyNote}>
              <AsyncList fetcher={() => api.getNotes(current._id)}
                renderItem={(n) => (
                  <div key={n._id} className="py-2">
                    <div className="text-white">{n.content}</div>
                    {n.author && <div className="text-xs text-blue-200/80">— {n.author}</div>}
                  </div>
                )}
              />
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3 text-white">
        <Icon size={18} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function AsyncList({ fetcher, renderItem }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    (async () => {
      try {
        const data = await fetcher()
        setItems(data)
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [fetcher])

  if (error) return <div className="text-red-300 text-sm">{error}</div>
  if (!items) return <div className="text-blue-100 text-sm">Laden…</div>
  if (!items.length) return <div className="text-blue-100 text-sm">Keine Einträge.</div>
  return <div className="divide-y divide-white/10">{items.map(renderItem)}</div>
}
