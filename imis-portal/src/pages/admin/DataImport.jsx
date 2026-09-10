import { useMemo, useRef, useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useData } from '../../context/DataContext'
import { Field, Alert, Badge } from '../../components/ui'
import { MODULES } from '../../data/modules'

/** Minimal RFC-4180 CSV parser (handles quotes, embedded commas and newlines). */
export function parseCSV(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n')

  for (let i = 0; i < src.length; i += 1) {
    const c = src[i]
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { cell += '"'; i += 1 } else quoted = false
      } else cell += c
      continue
    }
    if (c === '"') { quoted = true; continue }
    if (c === ',') { row.push(cell); cell = ''; continue }
    if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; continue }
    cell += c
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((v) => String(v).trim() !== ''))
}

export default function DataImport() {
  const { t, p, n, lang } = useLang()
  const { importRows, rowsOf } = useData()
  const fileRef = useRef(null)

  const [moduleKey, setModuleKey] = useState('building-structures')
  const [fileName, setFileName] = useState('')
  const [raw, setRaw] = useState(null)      // [[header],[row]...]
  const [mapping, setMapping] = useState({}) // column key -> csv header index
  const [imported, setImported] = useState(null)
  const [error, setError] = useState(null)

  const mod = MODULES.find((m) => m.key === moduleKey)

  const reset = () => { setRaw(null); setMapping({}); setFileName(''); setImported(null); setError(null) }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null); setImported(null)
    const reader = new FileReader()
    reader.onload = () => {
      const rows = parseCSV(String(reader.result))
      if (rows.length < 2) {
        setError({ en: 'The file needs a header row and at least one data row.', bn: 'ফাইলে একটি হেডার সারি ও অন্তত একটি ডেটা সারি থাকতে হবে।' })
        setRaw(null)
        return
      }
      setRaw(rows)
      setFileName(file.name)
      // Auto-map by matching the header text to the column label or key.
      const header = rows[0].map((h) => h.trim().toLowerCase())
      const auto = {}
      mod.columns.forEach((c) => {
        const idx = header.findIndex((h) => h === c.label.en.toLowerCase() || h === c.key.toLowerCase())
        if (idx >= 0) auto[c.key] = idx
      })
      setMapping(auto)
    }
    reader.readAsText(file)
  }

  // Validate every data row against the mapped columns.
  const validation = useMemo(() => {
    if (!raw) return null
    const body = raw.slice(1)
    const out = body.map((cells, i) => {
      const rec = {}
      const problems = []
      mod.columns.forEach((c) => {
        const idx = mapping[c.key]
        const value = idx === undefined ? '' : String(cells[idx] ?? '').trim()
        if (c.key === 'id') { rec.id = value; return }
        if (!value) {
          if (c.type !== 'textarea') problems.push(`${c.label.en}: empty`)
          rec[c.key] = c.type === 'number' || c.type === 'money' ? 0 : ''
          return
        }
        if (c.type === 'number' || c.type === 'money') {
          const num = Number(value.replace(/[,৳\s]/g, ''))
          if (Number.isNaN(num)) problems.push(`${c.label.en}: not a number`)
          rec[c.key] = Number.isNaN(num) ? 0 : num
        } else if (c.type === 'select') {
          const match = c.options.find((o) => o.value === value || o.label.en.toLowerCase() === value.toLowerCase())
          if (!match) problems.push(`${c.label.en}: “${value}” is not a valid option`)
          rec[c.key] = match ? match.value : c.options[0].value
        } else if (c.type === 'bilingual') {
          rec[c.key] = { en: value, bn: value }
        } else if (c.type === 'date') {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) problems.push(`${c.label.en}: use YYYY-MM-DD`)
          rec[c.key] = value
        } else rec[c.key] = value
      })
      return { line: i + 2, rec, problems }
    })
    return {
      rows: out,
      valid: out.filter((x) => x.problems.length === 0),
      invalid: out.filter((x) => x.problems.length > 0),
      unmapped: mod.columns.filter((c) => c.key !== 'id' && mapping[c.key] === undefined),
    }
  }, [raw, mapping, mod])

  const runImport = () => {
    const existing = new Set(rowsOf(moduleKey).map((r) => r.id))
    let seq = rowsOf(moduleKey).length + 1
    const rows = validation.valid.map((x) => {
      let id = x.rec.id
      if (!id || existing.has(id)) {
        do { id = `${mod.idPrefix}-${String(seq).padStart(4, '0')}`; seq += 1 } while (existing.has(id))
      }
      existing.add(id)
      return { ...x.rec, id }
    })
    importRows(moduleKey, rows)
    setImported(rows.length)
  }

  const downloadTemplate = () => {
    const header = mod.columns.map((c) => c.label.en).join(',')
    const sample = mod.columns.map((c) => {
      if (c.key === 'id') return ''
      if (c.type === 'select') return c.options[0].value
      if (c.type === 'number' || c.type === 'money') return '0'
      if (c.type === 'date') return new Date().toISOString().slice(0, 10)
      return 'sample'
    }).join(',')
    const blob = new Blob([`﻿${header}\n${sample}\n`], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${moduleKey}-template.csv`
    document.body.appendChild(a); a.click(); a.remove()
  }

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>⬆ {lang === 'bn' ? 'ডেটা আমদানি' : 'Data Import'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? 'CSV ফাইল থেকে রেকর্ড আমদানি করুন — কলাম মিলিয়ে নিন, যাচাই করুন, তারপর সংরক্ষণ।'
              : 'Bring records in from a CSV file — map the columns, validate, then commit.'}
          </p>
        </div>
        {raw && <button className="btn btn-outline" onClick={reset}>{t('reset')}</button>}
      </div>

      {error && <Alert tone="warn">{p(error)}</Alert>}
      {imported !== null && (
        <Alert tone="ok">
          ✅ {lang === 'bn' ? `${n(imported)} টি রেকর্ড আমদানি হয়েছে।` : `${imported} record(s) imported into ${mod.title.en}.`}
        </Alert>
      )}

      <section className="panel panel-pad">
        <h3>{lang === 'bn' ? '১. লক্ষ্য মডিউল ও ফাইল' : '1. Target module and file'}</h3>
        <div className="form-row">
          <Field label={lang === 'bn' ? 'মডিউল' : 'Module'} htmlFor="im">
            <select id="im" value={moduleKey} onChange={(e) => { setModuleKey(e.target.value); reset() }}>
              {MODULES.map((m) => <option key={m.key} value={m.key}>{p(m.title)}</option>)}
            </select>
          </Field>
          <Field label={lang === 'bn' ? 'CSV ফাইল' : 'CSV file'} htmlFor="if">
            <input id="if" ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} />
          </Field>
        </div>
        <div className="flex">
          <button className="btn btn-outline btn-sm" onClick={downloadTemplate}>
            ⬇ {lang === 'bn' ? 'টেমপ্লেট ডাউনলোড' : 'Download CSV template'}
          </button>
          {fileName && <span className="small muted">📄 {fileName}</span>}
        </div>
      </section>

      {raw && validation && (
        <>
          <section className="panel panel-pad">
            <h3>{lang === 'bn' ? '২. কলাম মিলান' : '2. Map the columns'}</h3>
            {validation.unmapped.length > 0 && (
              <Alert tone="warn">
                {lang === 'bn'
                  ? `${n(validation.unmapped.length)} টি কলাম মেলানো হয়নি: `
                  : `${validation.unmapped.length} column(s) not mapped: `}
                {validation.unmapped.map((c) => c.label.en).join(', ')}
              </Alert>
            )}
            <div className="form-row">
              {mod.columns.filter((c) => c.key !== 'id').map((c) => (
                <Field key={c.key} label={p(c.label)} htmlFor={`map-${c.key}`}>
                  <select id={`map-${c.key}`} value={mapping[c.key] ?? ''}
                    onChange={(e) => setMapping((m) => ({ ...m, [c.key]: e.target.value === '' ? undefined : Number(e.target.value) }))}>
                    <option value="">{lang === 'bn' ? '— মেলানো হয়নি —' : '— not mapped —'}</option>
                    {raw[0].map((h, i) => <option key={i} value={i}>{h || `column ${i + 1}`}</option>)}
                  </select>
                </Field>
              ))}
            </div>
          </section>

          <section className="panel panel-pad">
            <h3>{lang === 'bn' ? '৩. যাচাই ও পূর্বরূপ' : '3. Validate and preview'}</h3>
            <div className="flex mb-2">
              <Badge tone="green">
                {lang === 'bn' ? `${n(validation.valid.length)} টি বৈধ` : `${validation.valid.length} valid`}
              </Badge>
              <Badge tone={validation.invalid.length ? 'red' : 'grey'}>
                {lang === 'bn' ? `${n(validation.invalid.length)} টি ত্রুটিপূর্ণ` : `${validation.invalid.length} with problems`}
              </Badge>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{lang === 'bn' ? 'লাইন' : 'Line'}</th>
                    {mod.columns.slice(0, 6).map((c) => <th key={c.key}>{p(c.label)}</th>)}
                    <th>{lang === 'bn' ? 'ফলাফল' : 'Result'}</th>
                  </tr>
                </thead>
                <tbody>
                  {validation.rows.slice(0, 25).map((x) => (
                    <tr key={x.line}>
                      <td>{n(x.line)}</td>
                      {mod.columns.slice(0, 6).map((c) => {
                        const v = x.rec[c.key]
                        return <td key={c.key} className="small">{v && typeof v === 'object' ? v.en : String(v ?? '—')}</td>
                      })}
                      <td className="small">
                        {x.problems.length === 0
                          ? <Badge tone="green">{lang === 'bn' ? 'ঠিক আছে' : 'OK'}</Badge>
                          : <span style={{ color: 'var(--red-600)' }}>{x.problems.join('; ')}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {validation.rows.length > 25 && (
              <p className="small muted mt-1">
                {lang === 'bn' ? `প্রথম ২৫ টি সারি দেখানো হচ্ছে (মোট ${n(validation.rows.length)})।` : `Showing the first 25 of ${validation.rows.length} rows.`}
              </p>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" onClick={runImport} disabled={validation.valid.length === 0}>
                ⬆ {lang === 'bn'
                  ? `${n(validation.valid.length)} টি বৈধ সারি আমদানি`
                  : `Import ${validation.valid.length} valid row(s)`}
              </button>
              <button className="btn btn-outline" onClick={reset}>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
            </div>
            {validation.invalid.length > 0 && (
              <p className="small muted mb-0">
                {lang === 'bn'
                  ? 'ত্রুটিপূর্ণ সারিগুলো বাদ দেওয়া হবে — ফাইল সংশোধন করে আবার আপলোড করুন।'
                  : 'Rows with problems are skipped — correct the file and upload it again.'}
              </p>
            )}
          </section>
        </>
      )}
    </>
  )
}
