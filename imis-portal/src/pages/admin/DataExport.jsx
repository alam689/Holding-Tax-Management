import { useMemo, useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useData } from '../../context/DataContext'
import { Field, Alert } from '../../components/ui'
import { toCSV, downloadFile } from '../../components/DataModule'
import { MODULES, MODULE_GROUPS } from '../../data/modules'

export default function DataExport() {
  const { p, n, lang } = useLang()
  const { rowsOf } = useData()

  const [selected, setSelected] = useState(['building-structures'])
  const [format, setFormat] = useState('csv')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [done, setDone] = useState(null)

  const toggle = (key) => setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]))

  /** Applies the date window against whichever column holds the record date. */
  const filterByDate = (mod, rows) => {
    const dateCol = mod.columns.find((c) => c.type === 'date')
    if (!dateCol || (!from && !to)) return rows
    return rows.filter((r) => {
      const v = String(r[dateCol.key] || '')
      if (from && v < from) return false
      if (to && v > to) return false
      return true
    })
  }

  const preview = useMemo(() => selected.map((key) => {
    const mod = MODULES.find((m) => m.key === key)
    const rows = filterByDate(mod, rowsOf(key))
    return { mod, count: rows.length, total: rowsOf(key).length }
  }), [selected, from, to, rowsOf])

  const totalRows = preview.reduce((s, x) => s + x.count, 0)

  const run = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    if (format === 'json') {
      const payload = {}
      selected.forEach((key) => {
        const mod = MODULES.find((m) => m.key === key)
        payload[key] = filterByDate(mod, rowsOf(key))
      })
      downloadFile(`imis-export-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json')
    } else {
      selected.forEach((key) => {
        const mod = MODULES.find((m) => m.key === key)
        const rows = filterByDate(mod, rowsOf(key))
        downloadFile(`${key}-${stamp}.csv`, toCSV(rows, mod.columns))
      })
    }
    setDone({ files: format === 'json' ? 1 : selected.length, rows: totalRows })
  }

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>⬇ {lang === 'bn' ? 'ডেটা রপ্তানি' : 'Data Export'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? 'যেকোনো মডিউলের রেকর্ড CSV বা JSON ফরম্যাটে নামিয়ে নিন।'
              : 'Download the records of any module as CSV or JSON.'}
          </p>
        </div>
      </div>

      {done && (
        <Alert tone="ok">
          ✅ {lang === 'bn'
            ? `${n(done.files)} টি ফাইলে ${n(done.rows)} টি সারি রপ্তানি হয়েছে।`
            : `Exported ${done.rows} rows into ${done.files} file(s).`}
        </Alert>
      )}

      <div className="panel-row">
        <section className="panel panel-pad">
          <h3>{lang === 'bn' ? '১. মডিউল নির্বাচন' : '1. Choose modules'}</h3>
          <div className="flex mb-2">
            <button className="btn btn-outline btn-sm" onClick={() => setSelected(MODULES.map((m) => m.key))}>
              {lang === 'bn' ? 'সব নির্বাচন' : 'Select all'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setSelected([])}>
              {lang === 'bn' ? 'সব বাদ' : 'Clear'}
            </button>
          </div>
          {Object.entries(MODULE_GROUPS).map(([g, meta]) => (
            <fieldset key={g}>
              <legend>{meta.icon} {p(meta)}</legend>
              <div className="colpick colpick-grid">
                {MODULES.filter((m) => m.group === g).map((m) => (
                  <label key={m.key}>
                    <input type="checkbox" checked={selected.includes(m.key)} onChange={() => toggle(m.key)} />
                    {p(m.title)}
                    <span className="muted small"> ({n(rowsOf(m.key).length)})</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </section>

        <div>
          <section className="panel panel-pad">
            <h3>{lang === 'bn' ? '২. বিকল্প' : '2. Options'}</h3>
            <Field label={lang === 'bn' ? 'ফরম্যাট' : 'Format'} htmlFor="fmt">
              <select id="fmt" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV {lang === 'bn' ? '(প্রতি মডিউলে একটি ফাইল)' : '(one file per module)'}</option>
                <option value="json">JSON {lang === 'bn' ? '(একটি ফাইল)' : '(single file)'}</option>
              </select>
            </Field>
            <div className="form-row">
              <Field label={lang === 'bn' ? 'তারিখ থেকে' : 'Date from'} htmlFor="ef">
                <input id="ef" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </Field>
              <Field label={lang === 'bn' ? 'তারিখ পর্যন্ত' : 'Date to'} htmlFor="et">
                <input id="et" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </Field>
            </div>
            <p className="small muted">
              {lang === 'bn'
                ? 'তারিখ ফিল্টার প্রতিটি মডিউলের প্রধান তারিখ কলামে প্রযোজ্য।'
                : 'The date window applies to each module’s primary date column.'}
            </p>
          </section>

          <section className="panel panel-pad">
            <h3>{lang === 'bn' ? '৩. সারসংক্ষেপ' : '3. Summary'}</h3>
            {preview.length === 0 && <p className="muted small">{lang === 'bn' ? 'কোনো মডিউল নির্বাচিত হয়নি।' : 'No module selected.'}</p>}
            {preview.length > 0 && (
              <div className="table-wrap" style={{ border: 0 }}>
                <table style={{ minWidth: 0 }}>
                  <tbody>
                    {preview.map((x) => (
                      <tr key={x.mod.key}>
                        <td>{x.mod.icon} {p(x.mod.title)}</td>
                        <td className="num">{n(x.count)} / {n(x.total)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>{lang === 'bn' ? 'মোট' : 'Total'}</strong></td>
                      <td className="num"><strong>{n(totalRows)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-primary mt-2" onClick={run} disabled={selected.length === 0}>
              ⬇ {lang === 'bn' ? 'রপ্তানি করুন' : 'Export now'}
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
