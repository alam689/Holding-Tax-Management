import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { Field, Alert, Badge } from '../../components/ui'
import { initialsOf } from '../../components/AdminLayout'
import { ROLES, sections, statusMeta, activityLog } from '../../data/users'
import { WARDS } from '../../data/mockData'

function strengthOf(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

export default function Profile() {
  const { user, updateUser, changePassword } = useAuth()
  const { t, p, n, lang } = useLang()

  const [tab, setTab] = useState('details')
  const [form, setForm] = useState({
    nameEn: user.name.en, nameBn: user.name.bn,
    designationEn: user.designation.en, designationBn: user.designation.bn,
    email: user.email, phone: user.phone,
    section: user.section.en, ward: user.ward ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwDone, setPwDone] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
    setSaved(false)
  }
  const setP = (k) => (e) => {
    setPw((f) => ({ ...f, [k]: e.target.value }))
    setPwErrors((x) => ({ ...x, [k]: undefined }))
    setPwDone(false)
  }

  const saveDetails = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.nameEn.trim()) err.nameEn = t('required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = lang === 'bn' ? 'সঠিক ইমেইল দিন।' : 'Enter a valid email address.'
    }
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[-\s]/g, ''))) {
      err.phone = lang === 'bn' ? '১১ ডিজিটের বৈধ মোবাইল নম্বর দিন।' : 'Enter a valid 11-digit mobile number.'
    }
    setErrors(err)
    if (Object.keys(err).length) return

    const sec = sections.find((s) => s.value === form.section)
    updateUser(user.id, {
      name: { en: form.nameEn.trim(), bn: form.nameBn.trim() || form.nameEn.trim() },
      designation: { en: form.designationEn.trim(), bn: form.designationBn.trim() || form.designationEn.trim() },
      email: form.email.trim(),
      phone: form.phone.trim(),
      section: sec ? sec.label : user.section,
      ward: form.ward === '' ? null : Number(form.ward),
    })
    setSaved(true)
  }

  const savePassword = (e) => {
    e.preventDefault()
    const err = {}
    if (!pw.current) err.current = t('required')
    if (pw.next.length < 8) {
      err.next = lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'The password must be at least 8 characters.'
    }
    if (pw.next !== pw.confirm) {
      err.confirm = lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না।' : 'The two passwords do not match.'
    }
    setPwErrors(err)
    if (Object.keys(err).length) return

    const res = changePassword(user.id, pw.current, pw.next)
    if (!res.ok) {
      setPwErrors({ current: lang === 'bn' ? 'বর্তমান পাসওয়ার্ড সঠিক নয়।' : 'The current password is incorrect.' })
      return
    }
    setPw({ current: '', next: '', confirm: '' })
    setPwDone(true)
  }

  const strength = strengthOf(pw.next)
  const strengthLabel = [
    { en: 'Very weak', bn: 'খুবই দুর্বল' }, { en: 'Weak', bn: 'দুর্বল' },
    { en: 'Fair', bn: 'মোটামুটি' }, { en: 'Strong', bn: 'শক্তিশালী' }, { en: 'Very strong', bn: 'খুব শক্তিশালী' },
  ][strength]

  const role = ROLES[user.role]
  const st = statusMeta[user.status]

  const TABS = [
    { k: 'details', en: 'Profile details', bn: 'প্রোফাইল তথ্য' },
    { k: 'password', en: 'Password', bn: 'পাসওয়ার্ড' },
    { k: 'activity', en: 'Recent activity', bn: 'সাম্প্রতিক কার্যক্রম' },
  ]

  return (
    <>
      <div className="page-bar">
        <h1>{lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</h1>
      </div>

      <div className="profile-head panel">
        <span className="avatar avatar-lg" aria-hidden="true">{initialsOf(user.name.en)}</span>
        <div style={{ flex: '1 1 260px' }}>
          <h2 className="mb-0">{p(user.name)}</h2>
          <p className="small muted mb-0">{p(user.designation)} · {p(user.section)}</p>
          <div className="flex mt-1">
            <Badge tone={role.tone}>{p(role.label)}</Badge>
            <Badge tone={st.tone}>{p(st.label)}</Badge>
            {user.ward && <Badge tone="blue">{lang === 'bn' ? `ওয়ার্ড ${n(user.ward)}` : `Ward ${user.ward}`}</Badge>}
          </div>
        </div>
        <dl className="kv" style={{ flex: '1 1 260px' }}>
          <dt>{lang === 'bn' ? 'ইউজার আইডি' : 'User ID'}</dt><dd>{user.id}</dd>
          <dt>{lang === 'bn' ? 'ইউজারনেম' : 'Username'}</dt><dd>{user.username}</dd>
          <dt>{lang === 'bn' ? 'সর্বশেষ লগইন' : 'Last login'}</dt><dd>{n(user.lastLogin)}</dd>
          <dt>{lang === 'bn' ? 'অ্যাকাউন্ট তৈরি' : 'Member since'}</dt><dd>{n(user.createdAt)}</dd>
        </dl>
      </div>

      <div className="tabs no-print">
        {TABS.map((x) => (
          <button key={x.k} className={tab === x.k ? 'active' : ''} onClick={() => setTab(x.k)}>
            {lang === 'bn' ? x.bn : x.en}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <form className="panel panel-pad" onSubmit={saveDetails} noValidate>
          {saved && <Alert tone="ok">✅ {lang === 'bn' ? 'প্রোফাইল হালনাগাদ হয়েছে।' : 'Your profile has been updated.'}</Alert>}
          <div className="form-row">
            <Field label={lang === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} htmlFor="pne" error={errors.nameEn}>
              <input id="pne" type="text" value={form.nameEn} onChange={set('nameEn')} aria-invalid={Boolean(errors.nameEn)} />
            </Field>
            <Field label={lang === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'} htmlFor="pnb">
              <input id="pnb" type="text" value={form.nameBn} onChange={set('nameBn')} />
            </Field>
          </div>
          <div className="form-row">
            <Field label={lang === 'bn' ? 'পদবি (ইংরেজি)' : 'Designation (English)'} htmlFor="pde">
              <input id="pde" type="text" value={form.designationEn} onChange={set('designationEn')} />
            </Field>
            <Field label={lang === 'bn' ? 'পদবি (বাংলা)' : 'Designation (Bangla)'} htmlFor="pdb">
              <input id="pdb" type="text" value={form.designationBn} onChange={set('designationBn')} />
            </Field>
          </div>
          <div className="form-row">
            <Field label={t('email')} htmlFor="pem" error={errors.email}>
              <input id="pem" type="email" value={form.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} />
            </Field>
            <Field label={t('mobile')} htmlFor="pph" error={errors.phone}>
              <input id="pph" type="tel" value={form.phone} onChange={set('phone')} aria-invalid={Boolean(errors.phone)} />
            </Field>
          </div>
          <div className="form-row">
            <Field label={lang === 'bn' ? 'শাখা' : 'Section'} htmlFor="psc">
              <select id="psc" value={form.section} onChange={set('section')}>
                {sections.map((s) => <option key={s.value} value={s.value}>{p(s.label)}</option>)}
              </select>
            </Field>
            <Field label={`${t('ward')} (${t('optional')})`} htmlFor="pwd">
              <select id="pwd" value={form.ward} onChange={set('ward')}>
                <option value="">{lang === 'bn' ? 'সকল ওয়ার্ড' : 'All wards'}</option>
                {WARDS.map((w) => (
                  <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>
                ))}
              </select>
            </Field>
          </div>
          <Alert tone="info">
            {lang === 'bn'
              ? 'ভূমিকা ও অ্যাকাউন্টের অবস্থা কেবল সিস্টেম অ্যাডমিনিস্ট্রেটর পরিবর্তন করতে পারেন।'
              : 'Your role and account status can only be changed by a system administrator.'}
          </Alert>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">{lang === 'bn' ? 'সংরক্ষণ' : 'Save changes'}</button>
            <button className="btn btn-outline" type="button" onClick={() => {
              setForm({
                nameEn: user.name.en, nameBn: user.name.bn,
                designationEn: user.designation.en, designationBn: user.designation.bn,
                email: user.email, phone: user.phone,
                section: user.section.en, ward: user.ward ?? '',
              })
              setErrors({}); setSaved(false)
            }}>{t('reset')}</button>
          </div>
        </form>
      )}

      {tab === 'password' && (
        <form className="panel panel-pad" id="password" onSubmit={savePassword} noValidate style={{ maxWidth: 560 }}>
          {pwDone && <Alert tone="ok">✅ {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তিত হয়েছে।' : 'Your password has been changed.'}</Alert>}
          <Field label={lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current password'} htmlFor="cpw" error={pwErrors.current}>
            <input id="cpw" type="password" value={pw.current} onChange={setP('current')}
              autoComplete="current-password" aria-invalid={Boolean(pwErrors.current)} />
          </Field>
          <Field label={lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New password'} htmlFor="npw" error={pwErrors.next}
            hint={lang === 'bn' ? 'অন্তত ৮ অক্ষর; বড়-ছোট হাতের অক্ষর, সংখ্যা ও চিহ্ন ব্যবহার করুন।' : 'At least 8 characters; mix upper and lower case, digits and a symbol.'}>
            <input id="npw" type="password" value={pw.next} onChange={setP('next')}
              autoComplete="new-password" aria-invalid={Boolean(pwErrors.next)} />
          </Field>
          {pw.next && (
            <div className="pw-meter" data-level={strength}>
              <span /><span /><span /><span />
              <em>{p(strengthLabel)}</em>
            </div>
          )}
          <Field label={lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm new password'} htmlFor="rpw" error={pwErrors.confirm}>
            <input id="rpw" type="password" value={pw.confirm} onChange={setP('confirm')}
              autoComplete="new-password" aria-invalid={Boolean(pwErrors.confirm)} />
          </Field>
          <button className="btn btn-primary" type="submit">
            {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change password'}
          </button>
        </form>
      )}

      {tab === 'activity' && (
        <div className="panel panel-pad">
          <ul className="timeline">
            {activityLog.map((a) => (
              <li key={a.at}>
                <span className="when">{n(a.at)}</span>
                {lang === 'bn' ? a.bn : a.en}
              </li>
            ))}
          </ul>
          <Alert tone="info">
            {lang === 'bn'
              ? 'সম্পূর্ণ অডিট ট্রেইল সিস্টেম অ্যাডমিনিস্ট্রেটরের কাছে সংরক্ষিত থাকে।'
              : 'The complete audit trail is retained by the system administrator.'}
          </Alert>
        </div>
      )}
    </>
  )
}
