import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ProjectSwiper from './components/ProjectSwiper'
import Chatbot from './components/Chatbot'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.18),transparent_55%)]" />
      <Header />
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        {children}
      </main>
      <footer className="text-center text-blue-200/70 text-xs py-6">© IHK Region Stuttgart — spacy edition</footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/projects" element={<Layout><ProjectSwiper /></Layout>} />
      <Route path="/chat" element={<Layout><Chatbot /></Layout>} />
    </Routes>
  )
}

export default App
