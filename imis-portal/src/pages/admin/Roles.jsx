import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { Field, Alert, Badge } from '../../components/ui'
import { ACTIONS, RESOURCES } from '../../data/roles'

const TONES = ['green', 'blue', 'amber', 'red', 'grey']

function RoleForm({ role, roles, onCancel, onSave }) {
  const { t, p, lang } = useLang()
  const [form, setForm] = useState(() => ({
    key: role?.key || '',
    nameEn: role?.name.en || '',
    nameBn: role?.name.bn || '',
    descEn: role?.description.en || '',
    descBn: role?.description.bn || '',
    tone: role?.tone || 'grey',
  }))
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })) }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!/^[a-z0-9-]{3,24}$/.test(form.key.trim())) {
      err.key = lang === 'bn' ? '৩–২৪ অক্ষরের কী দিন (ছোট হাতের অক্ষর, সংখ্যা, হাইফেন)।' : 'Use 3–24 lowercase letters, digits or hyphens.'
    } else if (!role && roles.some((r) => r.key === form.key.trim())) {
      err.key = lang === 'bn' ? 'এই কী ইতিমধ্যে ব্যবহৃত।' : 'That role key already exists.'
    }
    if (!form.nameEn.trim()) err.nameEn = t('required')
    setErrors(err)
    if (Object.keys(err).length) return
    onSave({
      key: form.key.trim(),
      name: { en: form.nameEn.trim(), bn: form.nameBn.trim() || form.nameEn.trim() },
      description: { en: form.descEn.trim(), bn: form.descBn.trim() || form.descEn.trim() },
      tone: form.tone,
      system: role?.system || false,
      users: role?.users ?? 0,
    })
  }

  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <form className="modal" onSubmit={submit} noValidate>
        <header className="modal-head">
          <h3 className="mb-0">{role ? (lang === 'bn' ? 'ভূমিকা সম্পাদনা' : 'Edit role') : (lang === 'bn' ? 'নতুন ভূমিকা' : 'New role')}</h3>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <div className="form-row">
            <Field label={lang === 'bn' ? 'ভূমিকার কী' : 'Role key'} htmlFor="rk" error={errors.key}
              hint={lang === 'bn' ? 'পরিবর্তন করা যাবে না।' : 'Cannot be changed later.'}>
              <input id="rk" type="text" value={form.key} onChange={set('key')} disabled={Boolean(role)}
                aria-invalid={Boolean(errors.key)} placeholder="ward-officer" />
            </Field>
            <Field label={lang === 'bn' ? 'ব্যাজের রং' : 'Badge tone'} htmlFor="rt">
              <select id="rt" value={form.tone} onChange={set('tone')}>
                {TONES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
          </div>
          <div className="form-row">
            <Field label={lang === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} htmlFor="rne" error={errors.nameEn}>
              <input id="rne" type="text" value={form.nameEn} onChange={set('nameEn')} aria-invalid={Boolean(errors.nameEn)} />
            </Field>
            <Field label={lang === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'} htmlFor="rnb">
              <input id="rnb" type="text" value={form.nameBn} onChange={set('nameBn')} />
            </Field>
          </div>
          <Field label={lang === 'bn' ? 'বিবরণ (ইংরেজি)' : 'Description (English)'} htmlFor="rde">
            <textarea id="rde" value={form.descEn} onChange={set('descEn')} style={{ minHeight: 70 }} />
          </Field>
          <Field label={lang === 'bn' ? 'বিবরণ (বাংলা)' : 'Description (Bangla)'} htmlFor="rdb">
            <textarea id="rdb" value={form.descBn} onChange={set('descBn')} style={{ minHeight: 70 }} />
          </Field>
        </div>
        <footer className="modal-foot">
          <button type="button" className="btn btn-outline" onClick={onCancel}>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
          <button type="submit" className="btn btn-primary">{lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</button>
        </footer>
      </form>
    </div>
  )
}

export default function Roles() {
  const { p, n, lang } = useLang()
  const { roles, saveRoles, permissions, savePermissions } = useData()
  const { users } = useAuth()
  const [editing, setEditing] = useState(undefined)
  const [confirming, setConfirming] = useState(null)
  const [flash, setFlash] = useState(null)

  const countUsers = (key) => users.filter((u) => u.role === key).length

  const onSave = (role) => {
    if (editing) {
      saveRoles(roles.map((r) => (r.key === role.key ? role : r)))
      setFlash({ en: 'Role updated.', bn: 'ভূমিকা হালনাগাদ হয়েছে।' })
    } else {
      saveRoles([...roles, role])
      savePermissions({ ...permissions, [role.key]: { dashboard: ['view'] } })
      setFlash({ en: 'Role created. Set its permissions next.', bn: 'ভূমিকা তৈরি হয়েছে। এবার অনুমতি নির্ধারণ করুন।' })
    }
    setEditing(undefined)
  }

  const onDelete = (role) => {
    saveRoles(roles.filter((r) => r.key !== role.key))
    const next = { ...permissions }
    delete next[role.key]
    savePermissions(next)
    setConfirming(null)
    setFlash({ en: 'Role deleted.', bn: 'ভূমিকা মুছে ফেলা হয়েছে।' })
  }

  const permCount = (key) =>
    Object.values(permissions[key] || {}).reduce((s, arr) => s + arr.length, 0)

  const maxPerms = RESOURCES.length * ACTIONS.length

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>🎭 {lang === 'bn' ? 'ভূমিকা' : 'Roles'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? 'ভূমিকা তৈরি ও সম্পাদনা করুন; প্রতিটি ভূমিকার অনুমতি নির্ধারিত হয় “অনুমতি” পাতায়।'
              : 'Create and edit roles; what each one may do is set on the Permissions page.'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing(null)}>
          + {lang === 'bn' ? 'নতুন ভূমিকা' : 'New role'}
        </button>
      </div>

      {flash && <Alert tone="ok">✅ {p(flash)}</Alert>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{lang === 'bn' ? 'ভূমিকা' : 'Role'}</th>
              <th>{lang === 'bn' ? 'বিবরণ' : 'Description'}</th>
              <th className="num">{lang === 'bn' ? 'ইউজার' : 'Users'}</th>
              <th className="num">{lang === 'bn' ? 'অনুমতি' : 'Permissions'}</th>
              <th className="no-print">{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.key}>
                <td>
                  <Badge tone={r.tone}>{p(r.name)}</Badge>
                  <div className="small muted">{r.key}{r.system ? ' · system' : ''}</div>
                </td>
                <td className="small">{p(r.description)}</td>
                <td className="num">{n(countUsers(r.key))}</td>
                <td className="num">{n(permCount(r.key))} / {n(maxPerms)}</td>
                <td className="no-print">
                  <div className="rowactions">
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(r)}>
                      {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                    </button>
                    <button className="btn btn-outline btn-sm btn-danger-ghost"
                      onClick={() => setConfirming(r)} disabled={r.system || countUsers(r.key) > 0}
                      title={r.system
                        ? (lang === 'bn' ? 'সিস্টেম ভূমিকা মোছা যাবে না' : 'System roles cannot be deleted')
                        : countUsers(r.key) > 0
                          ? (lang === 'bn' ? 'এই ভূমিকায় ইউজার রয়েছে' : 'Users are still assigned to this role')
                          : undefined}>
                      {lang === 'bn' ? 'মুছুন' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== undefined && (
        <RoleForm role={editing} roles={roles} onCancel={() => setEditing(undefined)} onSave={onSave} />
      )}

      {confirming && (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirming(null) }}>
          <div className="modal modal-sm">
            <header className="modal-head"><h3 className="mb-0">{lang === 'bn' ? 'ভূমিকা মুছবেন?' : 'Delete role?'}</h3></header>
            <div className="modal-body">
              <p>{lang === 'bn'
                ? `“${p(confirming.name)}” ভূমিকা ও তার অনুমতিসমূহ মুছে যাবে।`
                : `The role “${p(confirming.name)}” and its permission set will be removed.`}</p>
            </div>
            <footer className="modal-foot">
              <button className="btn btn-outline" onClick={() => setConfirming(null)}>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
              <button className="btn btn-danger" onClick={() => onDelete(confirming)}>{lang === 'bn' ? 'মুছুন' : 'Delete'}</button>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}
