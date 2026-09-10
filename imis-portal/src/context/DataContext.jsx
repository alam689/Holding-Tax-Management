import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { MODULES, seedRows } from '../data/modules'
import { seedRoles, seedPermissions } from '../data/roles'

const DataContext = createContext(null)

const STORE_KEY = 'imis.moduleData'
const ROLE_KEY = 'imis.roles'
const PERM_KEY = 'imis.permissions'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch { /* unreadable storage — fall back to the seed */ }
  return fallback
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

function seedAll() {
  const out = {}
  MODULES.forEach((m) => { out[m.key] = seedRows(m) })
  return out
}

export function DataProvider({ children }) {
  const [store, setStore] = useState(() => load(STORE_KEY, seedAll()))
  const [roles, setRoles] = useState(() => load(ROLE_KEY, seedRoles))
  const [permissions, setPermissions] = useState(() => load(PERM_KEY, seedPermissions))

  const commit = useCallback((next) => { setStore(next); save(STORE_KEY, next) }, [])

  const rowsOf = useCallback((key) => store[key] || [], [store])

  const nextId = useCallback((key, prefix) => {
    const rows = store[key] || []
    let max = 0
    rows.forEach((r) => {
      const m = String(r.id).match(/(\d+)\s*$/)
      if (m) max = Math.max(max, Number(m[1]))
    })
    return `${prefix}-${String(max + 1).padStart(4, '0')}`
  }, [store])

  const createRow = useCallback((key, row) => {
    setStore((s) => {
      const next = { ...s, [key]: [row, ...(s[key] || [])] }
      save(STORE_KEY, next)
      return next
    })
  }, [])

  const updateRow = useCallback((key, id, patch) => {
    setStore((s) => {
      const next = { ...s, [key]: (s[key] || []).map((r) => (r.id === id ? { ...r, ...patch } : r)) }
      save(STORE_KEY, next)
      return next
    })
  }, [])

  const deleteRows = useCallback((key, ids) => {
    const set = new Set(ids)
    setStore((s) => {
      const next = { ...s, [key]: (s[key] || []).filter((r) => !set.has(r.id)) }
      save(STORE_KEY, next)
      return next
    })
  }, [])

  /** Bulk append, used by Data Import. */
  const importRows = useCallback((key, rows) => {
    setStore((s) => {
      const next = { ...s, [key]: [...rows, ...(s[key] || [])] }
      save(STORE_KEY, next)
      return next
    })
  }, [])

  const resetModule = useCallback((key) => {
    const mod = MODULES.find((m) => m.key === key)
    if (!mod) return
    setStore((s) => {
      const next = { ...s, [key]: seedRows(mod) }
      save(STORE_KEY, next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => commit(seedAll()), [commit])

  // ---- roles & permissions -------------------------------------------------
  const saveRoles = useCallback((next) => { setRoles(next); save(ROLE_KEY, next) }, [])
  const savePermissions = useCallback((next) => { setPermissions(next); save(PERM_KEY, next) }, [])

  const value = useMemo(() => ({
    store, rowsOf, nextId, createRow, updateRow, deleteRows, importRows, resetModule, resetAll,
    roles, saveRoles, permissions, savePermissions,
  }), [store, rowsOf, nextId, createRow, updateRow, deleteRows, importRows, resetModule, resetAll,
    roles, saveRoles, permissions, savePermissions])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
