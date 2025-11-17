import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { Send, Bot, User } from 'lucide-react'

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Frag mich nach Projekten, Aufgaben oder Notizen. Beispiel: "Zeig mir aktive Projekte mit offenen Aufgaben"' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.chat(userMsg.content)
      const assistant = { role: 'assistant', content: res.reply, related: res.related_projects }
      setMessages((m) => [...m, assistant])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Fehler: ' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Projekt-Chat</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 h-[60vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 mb-4 ${m.role === 'assistant' ? '' : 'justify-end'}`}>
              {m.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-blue-500 text-white grid place-items-center"><Bot size={16} /></div>}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.role === 'assistant' ? 'bg-white/10 text-white' : 'bg-blue-600 text-white'}`}>
                {m.content}
              </div>
              {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-white/10 text-white grid place-items-center"><User size={16} /></div>}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Erkannte Projekte</h3>
          {messages.filter(m => m.related)?.slice(-1)[0]?.related?.length ? (
            <div className="space-y-3">
              {messages.filter(m => m.related).slice(-1)[0].related.map((p) => (
                <div key={p._id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-white font-medium">{p.name}</div>
                  <div className="text-xs text-blue-200/80 mb-2">{p.status} • {p.progress}%</div>
                  {!!p.open_tasks?.length && (
                    <div className="text-xs text-blue-100">
                      Offene Tasks:
                      <ul className="list-disc ml-4">
                        {p.open_tasks.map(t => (<li key={t._id}>{t.title}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-blue-100 text-sm">Noch keine Ergebnisse.</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Frag nach Projekten, Status, Aufgaben…"
          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-blue-200/60 outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <button onClick={send} disabled={loading} className="px-5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-semibold shadow border border-white/20 disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
