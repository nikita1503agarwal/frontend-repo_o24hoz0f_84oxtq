const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Request failed: ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    throw err
  }
}

export const api = {
  baseUrl: BASE_URL,
  getHealth: () => request('/'),
  getProjects: () => request('/api/projects'),
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (data) => request('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  getTasks: (projectId) => request(`/api/tasks${projectId ? `?project_id=${projectId}` : ''}`),
  createTask: (data) => request('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  getNotes: (projectId) => request(`/api/notes${projectId ? `?project_id=${projectId}` : ''}`),
  createNote: (data) => request('/api/notes', { method: 'POST', body: JSON.stringify(data) }),
  chat: (message) => request('/api/chat', { method: 'POST', body: JSON.stringify({ message }) }),
}
