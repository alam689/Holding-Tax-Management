import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../context/LangContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Field, Alert, Badge } from './ui'
import { optionOf } from '../data/modules'
import { WARDS } from '../data/mockData'

const PAGE_SIZES = [10, 25, 50]

// --- value helpers ----------------------------------------------------------
function rawValue(row, c) {
  const v = row[c.key]
  if (v && typeof v === 'object' && 'en' in v) return v.en
  return v
}

/**
 * How a column's filter behaves. The control rendered in the Filters panel and
 * the predicate below must agree — ward is numeric but is picked from a list of
 * exact wards, so it matches on equality rather than as a minimum.
 */
function filterKind(c) {
  if (c.key === 'ward' || c.key === 'sourceWard') return 'equals'
  if (c.type === 'select') return 'equals'
  if (c.type === 'date') return 'from'
  if (c.type === 'number' || c.type === 'money') return 'min'
  return 'contains'
}

function useFormat() {
  const { p, n, money, lang } = useLang()
  return (row, c) => {
    const v = row[c.key]
    if (v === null || v === undefined || v === '') return '—'
    if (c.type === 'bilingual') return p(v)
    if (c.type === 'money') return money(v)
    if (c.type === 'select') {
      const o = optionOf(c, v)
      return o ? p(o.label) : String(v)
    }
    if (c.type === 'number' || c.type === 'date') return n(v)
    return lang === 'bn' ? n(v) : String(v)
  }
}

// --- CSV --------------------------------------------------------------------
export function toCSV(rows, columns) {
  const esc = (s) => {
    const t = String(s ?? '')
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
  }
  const head = columns.map((c) => esc(c.label.en)).join(',')
  const body = rows.map((r) => columns.map((c) => esc(rawValue(r, c))).join(',')).join('\n')
  return `${head}\n${body}`
}

export function downloadFile(name, content, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([`﻿${content}`], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// --- record form ------------------------------------------------------------
function RecordForm({ mod, record, onCancel, onSave }) {
  const { t, p, lang } = useLang()
  const [form, setForm] = useState(() => {
    const init = {}
    mod.columns.forEach((c) => {
      if (!record) {
        // A new record: a select must start on its first option, otherwise the
        // control shows that option while the state is still empty.
        init[c.key] = c.type === 'select' ? c.options[0].value : ''
        return
      }
      const v = record[c.key]
      init[c.key] = c.type === 'bilingual' ? (v?.en ?? '') : (v ?? '')
    })
    return init
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    mod.columns.forEach((c) => {
      if (c.key === 'id') return
      const v = String(form[c.key] ?? '').trim()
      if (c.type === 'textarea') return
      if (!v) err[c.key] = t('required')
      else if (c.type === 'number' && Number.isNaN(Number(v))) {
        err[c.key] = lang === 'bn' ? 'সংখ্যা দিন।' : 'Enter a number.'
      }
    })
    setErrors(err)
    if (Object.keys(err).length) return

    const out = {}
    mod.columns.forEach((c) => {
      const v = form[c.key]
      if (c.type === 'number' || c.type === 'money') out[c.key] = Number(v)
      else if (c.type === 'bilingual') out[c.key] = { en: v, bn: record?.[c.key]?.bn || v }
      else out[c.key] = v
    })
    onSave(out)
  }

  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <form className="modal" onSubmit={submit} noValidate>
        <header className="modal-head">
          <h3 className="mb-0">
            {record
              ? `${lang === 'bn' ? 'সম্পাদনা' : 'Edit'} · ${record.id}`
              : `${lang === 'bn' ? 'নতুন রেকর্ড' : 'New record'} · ${p(mod.title)}`}
          </h3>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <div className="form-row">
            {mod.columns.map((c) => {
              if (c.key === 'id') {
                return (
                  <Field key={c.key} label={p(c.label)} htmlFor={`f-${c.key}`}>
                    <input id={`f-${c.key}`} type="text" value={form.id} disabled />
                  </Field>
                )
              }
              const id = `f-${c.key}`
              if (c.type === 'select') {
                return (
                  <Field key={c.key} label={p(c.label)} htmlFor={id} error={errors[c.key]}>
                    <select id={id} value={form[c.key]} onChange={set(c.key)}>
                      {c.options.map((o) => <option key={o.value} value={o.value}>{p(o.label)}</option>)}
                    </select>
                  </Field>
                )
              }
              if (c.type === 'textarea') {
                return (
                  <Field key={c.key} label={p(c.label)} htmlFor={id}>
                    <textarea id={id} value={form[c.key]} onChange={set(c.key)} style={{ minHeight: 80 }} />
                  </Field>
                )
              }
              return (
                <Field key={c.key} label={p(c.label)} htmlFor={id} error={errors[c.key]}>
                  <input id={id}
                    type={c.type === 'date' ? 'date' : (c.type === 'number' || c.type === 'money') ? 'number' : 'text'}
                    value={form[c.key]} onChange={set(c.key)} aria-invalid={Boolean(errors[c.key])} />
                </Field>
              )
            })}
          </div>
        </div>
        <footer className="modal-foot">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button type="submit" className="btn btn-primary">
            {record ? (lang === 'bn' ? 'হালনাগাদ' : 'Save changes') : (lang === 'bn' ? 'তৈরি করুন' : 'Create')}
          </button>
        </footer>
      </form>
    </div>
  )
}

// --- detail view ------------------------------------------------------------
function RecordView({ mod, record, onClose, onEdit }) {
  const { p, lang } = useLang()
  const fmt = useFormat()
  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <header className="modal-head">
          <h3 className="mb-0">{p(mod.title)} · {record.id}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <dl className="kv">
            {mod.columns.map((c) => (
              <div key={c.key} style={{ display: 'contents' }}>
                <dt>{p(c.label)}</dt>
                <dd>
                  {c.type === 'select'
                    ? <Badge tone={optionOf(c, record[c.key])?.tone || 'grey'}>{fmt(record, c)}</Badge>
                    : fmt(record, c)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <footer className="modal-foot">
          <button className="btn btn-outline" onClick={() => window.print()}>🖨 {lang === 'bn' ? 'প্রিন্ট' : 'Print'}</button>
          <button className="btn btn-primary" onClick={onEdit}>{lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
        </footer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export default function DataModule({ mod }) {
  const { t, p, n, lang } = useLang()
  const { rowsOf, nextId, createRow, updateRow, deleteRows, resetModule } = useData()
  const { can } = useAuth()
  const fmt = useFormat()

  const rows = rowsOf(mod.key)

  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(true)
  const [sort, setSort] = useState({ key: mod.columns[0].key, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState([])
  const [hidden, setHidden] = useState([])
  const [toolsOpen, setToolsOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(undefined) // undefined closed, null new
  const [confirming, setConfirming] = useState(null)
  const [flash, setFlash] = useState(null)
  const toolsRef = useRef(null)

  useEffect(() => { setPage(1) }, [q, filters, pageSize])
  useEffect(() => {
    // Reset per-module UI state when the route switches to another module.
    setQ(''); setFilters({}); setSelected([]); setHidden([]); setPage(1)
    setSort({ key: mod.columns[0].key, dir: 'asc' })
  }, [mod.key])
  useEffect(() => {
    const onDoc = (e) => { if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  useEffect(() => {
    if (!flash) return undefined
    const id = setTimeout(() => setFlash(null), 4000)
    return () => clearTimeout(id)
  }, [flash])

  const columns = mod.columns.filter((c) => !hidden.includes(c.key))
  const filterCols = mod.filters.map((k) => mod.columns.find((c) => c.key === k)).filter(Boolean)

  // ---- filtering + sorting ----
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((r) => {
      for (const [k, v] of Object.entries(filters)) {
        if (v === '' || v === undefined) continue
        const c = mod.columns.find((x) => x.key === k)
        if (!c) continue
        const cell = rawValue(r, c)
        const kind = filterKind(c)
        if (kind === 'min') {
          if (Number(cell) < Number(v)) return false
        } else if (kind === 'from') {
          if (String(cell) < String(v)) return false
        } else if (kind === 'contains') {
          if (!String(cell).toLowerCase().includes(String(v).toLowerCase())) return false
        } else if (String(cell) !== String(v)) return false
      }
      if (!term) return true
      return mod.columns.some((c) => String(rawValue(r, c)).toLowerCase().includes(term))
    })
  }, [rows, filters, q, mod])

  const sorted = useMemo(() => {
    const c = mod.columns.find((x) => x.key === sort.key) || mod.columns[0]
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = rawValue(a, c)
      const bv = rawValue(b, c)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv), 'en', { numeric: true }) * dir
    })
  }, [filtered, sort, mod])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const view = sorted.slice((page - 1) * pageSize, page * pageSize)
  const allOnPage = view.length > 0 && view.every((r) => selected.includes(r.id))

  // ---- permissions ----
  const mayCreate = can('dashboard') // demo: any signed-in officer may capture data
  const mayEdit = mayCreate
  const mayDelete = can('users') // deletion is reserved for administrators

  // ---- actions ----
  const doSave = (data) => {
    if (editing) {
      updateRow(mod.key, editing.id, data)
      setFlash({ tone: 'ok', en: 'Record updated.', bn: 'রেকর্ড হালনাগাদ হয়েছে।' })
    } else {
      createRow(mod.key, { ...data, id: nextId(mod.key, mod.idPrefix) })
      setFlash({ tone: 'ok', en: 'Record created.', bn: 'রেকর্ড তৈরি হয়েছে।' })
    }
    setEditing(undefined)
  }

  const doDelete = (ids) => {
    deleteRows(mod.key, ids)
    setSelected((s) => s.filter((x) => !ids.includes(x)))
    setConfirming(null)
    setFlash({ tone: 'ok', en: `${ids.length} record(s) deleted.`, bn: `${ids.length} টি রেকর্ড মুছে ফেলা হয়েছে।` })
  }

  const exportCSV = (which) => {
    const data = which === 'selected' ? sorted.filter((r) => selected.includes(r.id)) : sorted
    downloadFile(`${mod.key}-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(data, columns))
    setToolsOpen(false)
    setFlash({ tone: 'ok', en: `${data.length} row(s) exported to CSV.`, bn: `${data.length} টি সারি সিএসভিতে রপ্তানি হয়েছে।` })
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== '' && v !== undefined).length

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>{mod.icon} {p(mod.title)}</h1>
          <p className="small muted mb-0">{p(mod.subtitle)}</p>
        </div>
        <div className="flex">
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilters((s) => !s)}>
            ⛃ {lang === 'bn' ? 'ফিল্টার' : 'Filters'}
            {activeFilterCount > 0 && <span className="pill">{n(activeFilterCount)}</span>}
          </button>

          <div className="usermenu" ref={toolsRef}>
            <button className="btn btn-outline btn-sm" onClick={() => setToolsOpen((o) => !o)} aria-expanded={toolsOpen}>
              🛠 {lang === 'bn' ? 'টুলস' : 'Tools'} ⌄
            </button>
            {toolsOpen && (
              <div className="um-pop" role="menu" style={{ minWidth: 260 }}>
                <div className="um-head small">
                  {lang === 'bn' ? 'টেবিল টুলস' : 'Table tools'}
                </div>
                <button role="menuitem" onClick={() => exportCSV('all')}>
                  ⬇ {lang === 'bn' ? 'সব সারি CSV রপ্তানি' : 'Export all rows to CSV'}
                </button>
                <button role="menuitem" onClick={() => exportCSV('selected')} disabled={selected.length === 0}>
                  ⬇ {lang === 'bn' ? 'নির্বাচিত সারি রপ্তানি' : 'Export selected rows'} ({n(selected.length)})
                </button>
                <button role="menuitem" onClick={() => { window.print(); setToolsOpen(false) }}>
                  🖨 {lang === 'bn' ? 'প্রিন্ট' : 'Print table'}
                </button>
                <button role="menuitem" onClick={() => { resetModule(mod.key); setSelected([]); setToolsOpen(false); setFlash({ tone: 'ok', en: 'Sample data restored.', bn: 'নমুনা ডেটা পুনরুদ্ধার হয়েছে।' }) }}>
                  ↺ {lang === 'bn' ? 'নমুনা ডেটা রিসেট' : 'Reset sample data'}
                </button>
                <div className="um-head small" style={{ borderTop: '1px solid var(--line-soft)' }}>
                  {lang === 'bn' ? 'কলাম দেখান / লুকান' : 'Show / hide columns'}
                </div>
                <div className="colpick">
                  {mod.columns.map((c) => (
                    <label key={c.key}>
                      <input type="checkbox" checked={!hidden.includes(c.key)}
                        onChange={(e) => setHidden((h) => (e.target.checked ? h.filter((x) => x !== c.key) : [...h, c.key]))} />
                      {p(c.label)}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mayCreate && (
            <button className="btn btn-primary" onClick={() => setEditing(null)}>
              + {lang === 'bn' ? 'নতুন' : 'New record'}
            </button>
          )}
        </div>
      </div>

      {flash && <Alert tone={flash.tone}>✅ {p(flash)}</Alert>}

      {showFilters && (
        <section className="panel panel-pad no-print">
          <div className="spread mb-2">
            <strong className="small">{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</strong>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilters({}); setQ('') }}>
              {t('reset')}
            </button>
          </div>
          <div className="form-row">
            <Field label={t('search')} htmlFor="dm-q">
              <input id="dm-q" type="text" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder={lang === 'bn' ? 'যেকোনো ঘরে খুঁজুন…' : 'Search any column…'} />
            </Field>
            {filterCols.map((c) => {
              const id = `flt-${c.key}`
              if (c.type === 'select') {
                return (
                  <Field key={c.key} label={p(c.label)} htmlFor={id}>
                    <select id={id} value={filters[c.key] ?? ''} onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}>
                      <option value="">{lang === 'bn' ? 'সব' : 'All'}</option>
                      {c.options.map((o) => <option key={o.value} value={o.value}>{p(o.label)}</option>)}
                    </select>
                  </Field>
                )
              }
              if (filterKind(c) === 'equals' && (c.key === 'ward' || c.key === 'sourceWard')) {
                return (
                  <Field key={c.key} label={p(c.label)} htmlFor={id}>
                    <select id={id} value={filters[c.key] ?? ''} onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}>
                      <option value="">{lang === 'bn' ? 'সব ওয়ার্ড' : 'All wards'}</option>
                      {WARDS.map((w) => <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>)}
                    </select>
                  </Field>
                )
              }
              if (filterKind(c) === 'from') {
                return (
                  <Field key={c.key} label={`${p(c.label)} ${lang === 'bn' ? '(থেকে)' : '(from)'}`} htmlFor={id}>
                    <input id={id} type="date" value={filters[c.key] ?? ''}
                      onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))} />
                  </Field>
                )
              }
              if (filterKind(c) === 'min') {
                return (
                  <Field key={c.key} label={`${p(c.label)} ${lang === 'bn' ? '(ন্যূনতম)' : '(min)'}`} htmlFor={id}>
                    <input id={id} type="number" value={filters[c.key] ?? ''}
                      onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))} />
                  </Field>
                )
              }
              return (
                <Field key={c.key} label={p(c.label)} htmlFor={id}>
                  <input id={id} type="text" value={filters[c.key] ?? ''}
                    onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))} />
                </Field>
              )
            })}
          </div>
        </section>
      )}

      <div className="spread mb-2">
        <span className="small muted">
          {lang === 'bn'
            ? `${n(sorted.length)} টি রেকর্ড${selected.length ? ` · ${n(selected.length)} টি নির্বাচিত` : ''}`
            : `${sorted.length} records${selected.length ? ` · ${selected.length} selected` : ''}`}
        </span>
        <div className="flex">
          {selected.length > 0 && mayDelete && (
            <button className="btn btn-sm btn-danger" onClick={() => setConfirming(selected)}>
              🗑 {lang === 'bn' ? 'নির্বাচিত মুছুন' : 'Delete selected'}
            </button>
          )}
          <label className="small muted" htmlFor="ps">{lang === 'bn' ? 'প্রতি পৃষ্ঠা' : 'Per page'}</label>
          <select id="ps" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ width: 'auto' }}>
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{n(s)}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 34 }} className="no-print">
                <input type="checkbox" checked={allOnPage} aria-label="Select page"
                  onChange={(e) => setSelected((s) => (e.target.checked
                    ? [...new Set([...s, ...view.map((r) => r.id)])]
                    : s.filter((id) => !view.some((r) => r.id === id))))} />
              </th>
              {columns.map((c) => (
                <th key={c.key} className={c.type === 'number' || c.type === 'money' ? 'num' : undefined}>
                  <button className="th-sort"
                    onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key && s.dir === 'asc' ? 'desc' : 'asc' }))}>
                    {p(c.label)}
                    <span aria-hidden="true">{sort.key === c.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}</span>
                  </button>
                </th>
              ))}
              <th className="no-print">{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id}>
                <td className="no-print">
                  <input type="checkbox" checked={selected.includes(r.id)} aria-label={`Select ${r.id}`}
                    onChange={(e) => setSelected((s) => (e.target.checked ? [...s, r.id] : s.filter((x) => x !== r.id)))} />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className={c.type === 'number' || c.type === 'money' ? 'num' : undefined}>
                    {c.type === 'select'
                      ? <Badge tone={optionOf(c, r[c.key])?.tone || 'grey'}>{fmt(r, c)}</Badge>
                      : fmt(r, c)}
                  </td>
                ))}
                <td className="no-print">
                  <div className="rowactions">
                    <button className="btn btn-outline btn-sm" onClick={() => setViewing(r)}>
                      {lang === 'bn' ? 'দেখুন' : 'View'}
                    </button>
                    {mayEdit && (
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(r)}>
                        {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                      </button>
                    )}
                    {mayDelete && (
                      <button className="btn btn-outline btn-sm btn-danger-ghost" onClick={() => setConfirming([r.id])}>
                        {lang === 'bn' ? 'মুছুন' : 'Delete'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && <Alert tone="warn">{t('noResult')}</Alert>}

      {pages > 1 && (
        <div className="pager no-print">
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((x) => x - 1)}>←</button>
          <span className="small muted">
            {lang === 'bn' ? `পৃষ্ঠা ${n(page)} / ${n(pages)}` : `Page ${page} of ${pages}`}
          </span>
          <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage((x) => x + 1)}>→</button>
          <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(pages)}>»</button>
        </div>
      )}

      {viewing && (
        <RecordView mod={mod} record={viewing} onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null) }} />
      )}

      {editing !== undefined && (
        <RecordForm mod={mod} record={editing} onCancel={() => setEditing(undefined)} onSave={doSave} />
      )}

      {confirming && (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirming(null) }}>
          <div className="modal modal-sm">
            <header className="modal-head">
              <h3 className="mb-0">{lang === 'bn' ? 'রেকর্ড মুছে ফেলবেন?' : 'Delete record(s)?'}</h3>
            </header>
            <div className="modal-body">
              <p>
                {lang === 'bn'
                  ? `${n(confirming.length)} টি রেকর্ড স্থায়ীভাবে মুছে যাবে।`
                  : `${confirming.length} record(s) will be permanently removed.`}
              </p>
              <p className="small muted mb-0">{confirming.join(', ')}</p>
            </div>
            <footer className="modal-foot">
              <button className="btn btn-outline" onClick={() => setConfirming(null)}>
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button className="btn btn-danger" onClick={() => doDelete(confirming)}>
                {lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}
