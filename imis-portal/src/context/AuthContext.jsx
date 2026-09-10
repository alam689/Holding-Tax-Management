import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ROLES, seedUsers } from '../data/users'

const AuthContext = createContext(null)

const SESSION_KEY = 'imis.session'
const USERS_KEY = 'imis.users'

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* corrupt or unavailable storage — fall back to the seed */
  }
  return seedUsers
}

export function AuthProvider({ children }) {
  // The directory is the single source of truth for both sign-in and user management.
  const [users, setUsers] = useState(loadUsers)
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* ignore */ }
  }, [users])

  const persistSession = useCallback((next, remember) => {
    setSession(next)
    try {
      sessionStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(SESSION_KEY)
      if (next) {
        const store = remember ? localStorage : sessionStorage
        store.setItem(SESSION_KEY, JSON.stringify(next))
      }
    } catch { /* ignore */ }
  }, [])

  const login = useCallback(({ username, password, remember }) => {
    const u = users.find(
      (x) => x.username.toLowerCase() === String(username).trim().toLowerCase(),
    )
    if (!u) return { ok: false, reason: 'notfound' }
    if (u.password !== password) return { ok: false, reason: 'password' }
    if (u.status !== 'active') return { ok: false, reason: u.status }

    const at = new Date().toISOString()
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, lastLogin: at.slice(0, 16).replace('T', ' ') } : x)))
    persistSession({ userId: u.id, at }, remember)
    return { ok: true, user: u }
  }, [users, persistSession])

  const logout = useCallback(() => persistSession(null, false), [persistSession])

  const user = useMemo(
    () => (session ? users.find((x) => x.id === session.userId) || null : null),
    [session, users],
  )

  const can = useCallback(
    (perm) => Boolean(user && ROLES[user.role]?.can.includes(perm)),
    [user],
  )

  // ---- user management -----------------------------------------------------
  const createUser = useCallback((data) => {
    const id = `USR-${String(Date.now()).slice(-6)}`
    setUsers((list) => [
      { ...data, id, createdAt: new Date().toISOString().slice(0, 10), lastLogin: '—' },
      ...list,
    ])
    return id
  }, [])

  const updateUser = useCallback((id, patch) => {
    setUsers((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers((list) => list.filter((x) => x.id !== id))
  }, [])

  const usernameTaken = useCallback(
    (username, exceptId) => users.some(
      (x) => x.username.toLowerCase() === String(username).trim().toLowerCase() && x.id !== exceptId,
    ),
    [users],
  )

  const changePassword = useCallback((id, current, next) => {
    const u = users.find((x) => x.id === id)
    if (!u) return { ok: false, reason: 'notfound' }
    if (u.password !== current) return { ok: false, reason: 'password' }
    setUsers((list) => list.map((x) => (x.id === id ? { ...x, password: next } : x)))
    return { ok: true }
  }, [users])

  const resetDirectory = useCallback(() => setUsers(seedUsers), [])

  const value = useMemo(() => ({
    user, users, login, logout, can,
    createUser, updateUser, deleteUser, usernameTaken, changePassword, resetDirectory,
    isAuthenticated: Boolean(user),
  }), [user, users, login, logout, can, createUser, updateUser, deleteUser, usernameTaken, changePassword, resetDirectory])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
