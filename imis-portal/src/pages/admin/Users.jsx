import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { Field, Alert, Badge } from '../../components/ui'
import { initialsOf } from '../../components/AdminLayout'
import { ROLES, roleList, sections, statusMeta, DEMO_PASSWORD } from '../../data/users'
import { WARDS } from '../../data/mockData'

const PAGE_SIZE = 6

const EMPTY = {
  username: '', password: DEMO_PASSWORD,
  nameEn: '', nameBn: '', designationEn: '', designationBn: '',
  role: 'operator', section: 'Revenue', ward: '', email: '', phone: '', status: 'active',
}

function UserForm({ editing, onCancel, onDone }) {
  const { createUser, updateUser, usernameTaken } = useAuth()
  const { t, p, n, lang } = useLang()
  const [form, setForm] = useState(() => (editing
    ? {
        username: editing.username, password: editing.password,
        nameEn: editing.name.en, nameBn: editing.name.bn,
        designationEn: editing.designation.en, designationBn: editing.designation.bn,
        role: editing.role, section: editing.section.en, ward: editing.ward ?? '',
        email: editing.email, phone: editing.phone, status: editing.status,
      }
    : EMPTY))
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!/^[a-z0-9._-]{3,20}$/i.test(form.username.trim())) {
      err.username = lang === 'bn' ? '৩–২০ অক্ষরের ইউজারনেম দিন (অক্ষর, সংখ্যা, . _ -)।' : 'Use 3–20 characters: letters, digits, dot, underscore or hyphen.'
    } else if (usernameTaken(form.username, editing?.id)) {
      err.username = lang === 'bn' ? 'এই ইউজারনেম ইতিমধ্যে ব্যবহৃত।' : 'That username is already taken.'
    }
    if (!form.nameEn.trim()) err.nameEn = t('required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = lang === 'bn' ? 'সঠিক ইমেইল দিন।' : 'Enter a valid email address.'
    }
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[-\s]/g, ''))) {
      err.phone = lang === 'bn' ? '১১ ডিজিটের বৈধ মোবাইল নম্বর দিন।' : 'Enter a valid 11-digit mobile number.'
    }
    if (!editing && form.password.length < 8) {
      err.password = lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'The password must be at least 8 characters.'
    }
    setErrors(err)
    if (Object.keys(err).length) return

    const sec = sections.find((s) => s.value === form.section)
    const payload = {
      username: form.username.trim().toLowerCase(),
      password: form.password,
      name: { en: form.nameEn.trim(), bn: form.nameBn.trim() || form.nameEn.trim() },
      designation: { en: form.designationEn.trim() || '—', bn: form.designationBn.trim() || form.designationEn.trim() || '—' },
      role: form.role,
      section: sec ? sec.label : { en: form.section, bn: form.section },
      ward: form.ward === '' ? null : Number(form.ward),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
    }
    if (editing) { updateUser(editing.id, payload); onDone('updated') }
    else { createUser(payload); onDone('created') }
  }

  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <form className="modal" onSubmit={submit} noValidate>
        <header className="modal-head">
          <h3 className="mb-0">
            {editing
              ? (lang === 'bn' ? 'ইউজার সম্পাদনা' : 'Edit user')
              : (lang === 'bn' ? 'নতুন ইউজার' : 'New user')}
          </h3>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <div className="form-row">
            <Field label={lang === 'bn' ? 'ইউজারনেম' : 'Username'} htmlFor="uu" error={errors.username}>
              <input id="uu" type="text" value={form.username} onChange={set('username')}
                aria-invalid={Boolean(errors.username)} disabled={Boolean(editing)} />
            </Field>
            <Field label={editing
              ? (lang === 'bn' ? 'পাসওয়ার্ড রিসেট' : 'Reset password')
              : (lang === 'bn' ? 'প্রাথমিক পাসওয়ার্ড' : 'Initial password')}
              htmlFor="up" error={errors.password}>
              <input id="up" type="text" value={form.password} onChange={set('password')}
                aria-invalid={Boolean(errors.password)} />
            </Field>
          </div>

          <div className="form-row">
            <Field label={lang === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} htmlFor="un" error={errors.nameEn}>
              <input id="un" type="text" value={form.nameEn} onChange={set('nameEn')} aria-invalid={Boolean(errors.nameEn)} />
            </Field>
            <Field label={lang === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'} htmlFor="unb">
              <input id="unb" type="text" value={form.nameBn} onChange={set('nameBn')} />
            </Field>
          </div>

          <div className="form-row">
            <Field label={lang === 'bn' ? 'পদবি (ইংরেজি)' : 'Designation (English)'} htmlFor="ud">
              <input id="ud" type="text" value={form.designationEn} onChange={set('designationEn')} />
            </Field>
            <Field label={lang === 'bn' ? 'পদবি (বাংলা)' : 'Designation (Bangla)'} htmlFor="udb">
              <input id="udb" type="text" value={form.designationBn} onChange={set('designationBn')} />
            </Field>
          </div>

          <div className="form-row">
            <Field label={t('email')} htmlFor="ue" error={errors.email}>
              <input id="ue" type="email" value={form.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} />
            </Field>
            <Field label={t('mobile')} htmlFor="uph" error={errors.phone}>
              <input id="uph" type="tel" value={form.phone} onChange={set('phone')}
                aria-invalid={Boolean(errors.phone)} placeholder="01XXXXXXXXX" />
            </Field>
          </div>

          <div className="form-row">
            <Field label={lang === 'bn' ? 'ভূমিকা' : 'Role'} htmlFor="ur">
              <select id="ur" value={form.role} onChange={set('role')}>
                {roleList.map((r) => <option key={r.key} value={r.key}>{p(r.label)}</option>)}
              </select>
            </Field>
            <Field label={lang === 'bn' ? 'শাখা' : 'Section'} htmlFor="us">
              <select id="us" value={form.section} onChange={set('section')}>
                {sections.map((s) => <option key={s.value} value={s.value}>{p(s.label)}</option>)}
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field label={`${t('ward')} (${t('optional')})`} htmlFor="uw">
              <select id="uw" value={form.ward} onChange={set('ward')}>
                <option value="">{lang === 'bn' ? 'সকল ওয়ার্ড' : 'All wards'}</option>
                {WARDS.map((w) => (
                  <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>
                ))}
              </select>
            </Field>
            <Field label={lang === 'bn' ? 'অবস্থা' : 'Status'} htmlFor="ust">
              <select id="ust" value={form.status} onChange={set('status')}>
                {Object.entries(statusMeta).map(([k, v]) => (
                  <option key={k} value={k}>{p(v.label)}</option>
                ))}
              </select>
            </Field>
          </div>

          <p className="small muted mb-0">
            {lang === 'bn'
              ? `নির্বাচিত ভূমিকার অনুমতি: ${ROLES[form.role].can.join(', ')}`
              : `Permissions for this role: ${ROLES[form.role].can.join(', ')}`}
          </p>
        </div>

        <footer className="modal-foot">
          <button className="btn btn-outline" type="button" onClick={onCancel}>
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button className="btn btn-primary" type="submit">
            {editing ? (lang === 'bn' ? 'হালনাগাদ' : 'Save changes') : (lang === 'bn' ? 'ইউজার তৈরি' : 'Create user')}
          </button>
        </footer>
      </form>
    </div>
  )
}

function ConfirmDelete({ target, onCancel, onConfirm }) {
  const { p, lang } = useLang()
  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal modal-sm">
        <header className="modal-head">
          <h3 className="mb-0">{lang === 'bn' ? 'ইউজার মুছে ফেলবেন?' : 'Delete this user?'}</h3>
        </header>
        <div className="modal-body">
          <p>
            {lang === 'bn'
              ? `“${p(target.name)}” (${target.username}) অ্যাকাউন্টটি স্থায়ীভাবে মুছে যাবে। এই কাজটি ফেরানো যাবে না।`
              : `The account “${p(target.name)}” (${target.username}) will be permanently removed. This cannot be undone.`}
          </p>
          <Alert tone="warn">
            {lang === 'bn'
              ? 'বিকল্প হিসেবে অ্যাকাউন্টটি নিষ্ক্রিয় করলে অডিট ট্রেইল অক্ষুণ্ণ থাকে।'
              : 'Deactivating the account instead keeps its audit trail intact.'}
          </Alert>
        </div>
        <footer className="modal-foot">
          <button className="btn btn-outline" onClick={onCancel}>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
          <button className="btn btn-danger" onClick={onConfirm}>{lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</button>
        </footer>
      </div>
    </div>
  )
}

export default function Users() {
  const { users, user: me, updateUser, deleteUser, resetDirectory } = useAuth()
  const { t, p, n, lang } = useLang()

  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(undefined) // undefined = closed, null = new
  const [confirming, setConfirming] = useState(null)
  const [flash, setFlash] = useState(null)

  useEffect(() => { setPage(1) }, [q, role, status])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return users.filter((u) => {
      if (role && u.role !== role) return false
      if (status && u.status !== status) return false
      if (!term) return true
      return `${u.username} ${u.name.en} ${u.name.bn} ${u.email} ${u.id}`.toLowerCase().includes(term)
    })
  }, [users, q, role, status])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    all: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
  }

  const flashText = {
    created: { en: 'The user account has been created.', bn: 'ইউজার অ্যাকাউন্ট তৈরি হয়েছে।' },
    updated: { en: 'The user account has been updated.', bn: 'ইউজার অ্যাকাউন্ট হালনাগাদ হয়েছে।' },
    deleted: { en: 'The user account has been deleted.', bn: 'ইউজার অ্যাকাউন্ট মুছে ফেলা হয়েছে।' },
    status: { en: 'The account status has been changed.', bn: 'অ্যাকাউন্টের অবস্থা পরিবর্তিত হয়েছে।' },
    reset: { en: 'The demo directory has been restored.', bn: 'ডেমো ডিরেক্টরি পুনরুদ্ধার হয়েছে।' },
  }

  const toggleStatus = (u) => {
    updateUser(u.id, { status: u.status === 'active' ? 'inactive' : 'active' })
    setFlash('status')
  }

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>{lang === 'bn' ? 'ইউজার ব্যবস্থাপনা' : 'User Management'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? `মোট ${n(counts.all)} জন · সক্রিয় ${n(counts.active)} · নিষ্ক্রিয় ${n(counts.inactive)} · স্থগিত ${n(counts.suspended)}`
              : `${counts.all} accounts · ${counts.active} active · ${counts.inactive} inactive · ${counts.suspended} suspended`}
          </p>
        </div>
        <div className="flex">
          <button className="btn btn-outline btn-sm" onClick={() => { resetDirectory(); setFlash('reset') }}>
            ↺ {lang === 'bn' ? 'ডেমো রিসেট' : 'Reset demo data'}
          </button>
          <button className="btn btn-primary" onClick={() => setEditing(null)}>
            + {lang === 'bn' ? 'নতুন ইউজার' : 'New user'}
          </button>
        </div>
      </div>

      {flash && <Alert tone="ok">✅ {p(flashText[flash])}</Alert>}

      <div className="panel panel-pad no-print">
        <div className="form-row">
          <Field label={t('search')} htmlFor="uq">
            <input id="uq" type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={lang === 'bn' ? 'নাম, ইউজারনেম বা ইমেইল…' : 'Name, username or email…'} />
          </Field>
          <Field label={lang === 'bn' ? 'ভূমিকা' : 'Role'} htmlFor="uf">
            <select id="uf" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">{lang === 'bn' ? 'সব ভূমিকা' : 'All roles'}</option>
              {roleList.map((r) => <option key={r.key} value={r.key}>{p(r.label)}</option>)}
            </select>
          </Field>
          <Field label={lang === 'bn' ? 'অবস্থা' : 'Status'} htmlFor="usf">
            <select id="usf" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">{lang === 'bn' ? 'সব অবস্থা' : 'All statuses'}</option>
              {Object.entries(statusMeta).map(([k, v]) => <option key={k} value={k}>{p(v.label)}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="table-wrap mt-2">
        <table>
          <thead>
            <tr>
              <th>{lang === 'bn' ? 'ইউজার' : 'User'}</th>
              <th>{lang === 'bn' ? 'ভূমিকা ও শাখা' : 'Role & section'}</th>
              <th>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</th>
              <th>{lang === 'bn' ? 'ওয়ার্ড' : 'Ward'}</th>
              <th>{lang === 'bn' ? 'সর্বশেষ লগইন' : 'Last login'}</th>
              <th>{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
              <th className="no-print">{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {view.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex" style={{ flexWrap: 'nowrap' }}>
                    <span className="avatar" aria-hidden="true">{initialsOf(u.name.en)}</span>
                    <span>
                      <strong>{p(u.name)}</strong>
                      <div className="small muted">@{u.username} · {u.id}</div>
                    </span>
                  </div>
                </td>
                <td>
                  <Badge tone={ROLES[u.role].tone}>{p(ROLES[u.role].label)}</Badge>
                  <div className="small muted">{p(u.section)}</div>
                </td>
                <td className="small">
                  {u.email}
                  <div className="muted">{n(u.phone)}</div>
                </td>
                <td>{u.ward ? n(u.ward) : <span className="muted">—</span>}</td>
                <td className="small">{n(u.lastLogin)}</td>
                <td><Badge tone={statusMeta[u.status].tone}>{p(statusMeta[u.status].label)}</Badge></td>
                <td className="no-print">
                  <div className="rowactions">
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(u)}>
                      {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(u)}
                      disabled={u.id === me.id}>
                      {u.status === 'active'
                        ? (lang === 'bn' ? 'নিষ্ক্রিয়' : 'Deactivate')
                        : (lang === 'bn' ? 'সক্রিয়' : 'Activate')}
                    </button>
                    <button className="btn btn-outline btn-sm btn-danger-ghost"
                      onClick={() => setConfirming(u)} disabled={u.id === me.id}
                      title={u.id === me.id ? (lang === 'bn' ? 'নিজের অ্যাকাউন্ট মোছা যাবে না' : 'You cannot delete your own account') : undefined}>
                      {lang === 'bn' ? 'মুছুন' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <Alert tone="warn">{t('noResult')}</Alert>}

      {pages > 1 && (
        <div className="pager no-print">
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((x) => x - 1)}>←</button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setPage(i + 1)}>{n(i + 1)}</button>
          ))}
          <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage((x) => x + 1)}>→</button>
          <span className="small muted">
            {lang === 'bn'
              ? `${n(filtered.length)} টির মধ্যে ${n(view.length)} টি`
              : `showing ${view.length} of ${filtered.length}`}
          </span>
        </div>
      )}

      {editing !== undefined && (
        <UserForm
          editing={editing}
          onCancel={() => setEditing(undefined)}
          onDone={(kind) => { setEditing(undefined); setFlash(kind) }}
        />
      )}

      {confirming && (
        <ConfirmDelete
          target={confirming}
          onCancel={() => setConfirming(null)}
          onConfirm={() => { deleteUser(confirming.id); setConfirming(null); setFlash('deleted') }}
        />
      )}
    </>
  )
}
