import { Fragment, useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useData } from '../../context/DataContext'
import { Alert, Badge } from '../../components/ui'
import { ACTIONS, RESOURCES } from '../../data/roles'
import { MODULE_GROUPS } from '../../data/modules'

const GROUP_LABEL = {
  ...MODULE_GROUPS,
  system: { en: 'System & Administration', bn: 'সিস্টেম ও প্রশাসন', icon: '⚙' },
}

export default function Permissions() {
  const { p, n, lang } = useLang()
  const { roles, permissions, savePermissions } = useData()
  const [roleKey, setRoleKey] = useState(roles[0]?.key || 'admin')
  const [flash, setFlash] = useState(null)

  const role = roles.find((r) => r.key === roleKey)
  const matrix = permissions[roleKey] || {}

  const has = (res, act) => (matrix[res] || []).includes(act)

  const toggle = (res, act) => {
    const current = matrix[res] || []
    const next = current.includes(act) ? current.filter((a) => a !== act) : [...current, act]
    savePermissions({ ...permissions, [roleKey]: { ...matrix, [res]: next } })
    setFlash(true)
  }

  const setRow = (res, on) => {
    savePermissions({ ...permissions, [roleKey]: { ...matrix, [res]: on ? ACTIONS.map((a) => a.key) : [] } })
    setFlash(true)
  }

  const setColumn = (act, on) => {
    const next = { ...matrix }
    RESOURCES.forEach((r) => {
      const cur = next[r.key] || []
      next[r.key] = on ? [...new Set([...cur, act.key])] : cur.filter((a) => a !== act.key)
    })
    savePermissions({ ...permissions, [roleKey]: next })
    setFlash(true)
  }

  const setAll = (on) => {
    const next = {}
    RESOURCES.forEach((r) => { next[r.key] = on ? ACTIONS.map((a) => a.key) : [] })
    savePermissions({ ...permissions, [roleKey]: next })
    setFlash(true)
  }

  const total = Object.values(matrix).reduce((s, a) => s + a.length, 0)
  const groups = ['building', 'utility', 'fsm', 'system']

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>🔑 {lang === 'bn' ? 'অনুমতি' : 'Permissions'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? 'প্রতিটি ভূমিকা কোন রিসোর্সে কী করতে পারবে তা নির্ধারণ করুন। পরিবর্তন সাথে সাথেই সংরক্ষিত হয়।'
              : 'Set what each role may do with each resource. Changes are saved as you make them.'}
          </p>
        </div>
        <div className="flex">
          <button className="btn btn-outline btn-sm" onClick={() => setAll(true)}>
            {lang === 'bn' ? 'সব দিন' : 'Grant all'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setAll(false)}>
            {lang === 'bn' ? 'সব বাতিল' : 'Revoke all'}
          </button>
        </div>
      </div>

      {flash && <Alert tone="ok">✅ {lang === 'bn' ? 'অনুমতি সংরক্ষিত হয়েছে।' : 'Permissions saved.'}</Alert>}

      <section className="panel panel-pad">
        <div className="tabs" style={{ marginBottom: '.6rem' }}>
          {roles.map((r) => (
            <button key={r.key} className={roleKey === r.key ? 'active' : ''} onClick={() => { setRoleKey(r.key); setFlash(null) }}>
              {p(r.name)}
            </button>
          ))}
        </div>
        {role && (
          <div className="spread">
            <p className="small muted mb-0">{p(role.description)}</p>
            <Badge tone={role.tone}>
              {lang === 'bn' ? `${n(total)} টি অনুমতি` : `${total} permissions`}
            </Badge>
          </div>
        )}
      </section>

      <div className="table-wrap">
        <table className="permtable">
          <thead>
            <tr>
              <th>{lang === 'bn' ? 'রিসোর্স' : 'Resource'}</th>
              {ACTIONS.map((a) => (
                <th key={a.key} className="center">
                  <button className="th-sort" onClick={() => setColumn(a, !RESOURCES.every((r) => has(r.key, a.key)))}>
                    {p(a.label)}
                  </button>
                </th>
              ))}
              <th className="center">{lang === 'bn' ? 'সব' : 'All'}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g}>
                <tr className="grouprow">
                  <td colSpan={ACTIONS.length + 2}>
                    {GROUP_LABEL[g].icon} <strong>{p(GROUP_LABEL[g])}</strong>
                  </td>
                </tr>
                {RESOURCES.filter((r) => r.group === g).map((r) => {
                  const all = ACTIONS.every((a) => has(r.key, a.key))
                  return (
                    <tr key={r.key}>
                      <td>{p(r.label)}<div className="small muted">{r.key}</div></td>
                      {ACTIONS.map((a) => (
                        <td key={a.key} className="center">
                          <input type="checkbox" checked={has(r.key, a.key)}
                            onChange={() => toggle(r.key, a.key)}
                            aria-label={`${r.label.en} ${a.key}`} />
                        </td>
                      ))}
                      <td className="center">
                        <input type="checkbox" checked={all} onChange={() => setRow(r.key, !all)}
                          aria-label={`${r.label.en} all`} />
                      </td>
                    </tr>
                  )
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Alert tone="info">
        {lang === 'bn'
          ? 'এই ডেমোতে সাইডবারের দৃশ্যমানতা ইউজারের ভূমিকা অনুযায়ী নিয়ন্ত্রিত; ম্যাট্রিক্সটি প্রকৃত বাস্তবায়নে সার্ভারে প্রয়োগ হবে।'
          : 'In this demo the sidebar is gated by the signed-in user’s role; in a real deployment this matrix is enforced server-side as well.'}
      </Alert>
    </>
  )
}
