const BASE_URL = import.meta.env.DEV ? '/api' : 'https://forum-api.dicoding.dev/v1'

let accessToken = null

export function getAccessToken () {
  return accessToken
}

export function putAccessToken (token) {
  accessToken = token
}

async function request (path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.status === 'fail') {
    const message = data.message || `Request gagal: ${response.status}`
    throw new Error(message)
  }
  return data.data
}

export const registerUser = (payload) =>
  request('/register', { method: 'POST', body: payload })

export const login = (payload) =>
  request('/login', { method: 'POST', body: payload })

export const logout = async () => undefined

export const getMyProfile = () => request('/users/me', { auth: true })

export const getThreads = () => request('/threads')
export const getThreadDetail = (id) => request(`/threads/${id}`)
export const createThread = (payload) =>
  request('/threads', { method: 'POST', body: payload, auth: true })
export const createComment = (threadId, payload) =>
  request(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: payload,
    auth: true
  })

export const voteThread = (threadId, type) =>
  request(`/threads/${threadId}/${type}-vote`, { method: 'POST', auth: true })

export const voteComment = (threadId, commentId, type) =>
  request(`/threads/${threadId}/comments/${commentId}/${type}-vote`, {
    method: 'POST',
    auth: true
  })

export const getUsers = () => request('/users')
export const getLeaderboards = () => request('/leaderboards')
