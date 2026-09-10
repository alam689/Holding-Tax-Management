import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { Field, Alert } from '../components/ui'
import { DEMO_PASSWORD, ROLES } from '../data/users'

const DEMO_ACCOUNTS = ['admin', 'revenue', 'assessor', 'operator1']

export default function Login() {
  const { login, isAuthenticated, users } = useAuth()
  const { t, p, lang, toggle } = useLang()
  const nav = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const from = location.state?.from?.pathname || '/admin'
  if (isAuthenticated) return <Navigate to={from} replace />

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
    setFailure(null)
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.username.trim()) err.username = t('required')
    if (!form.password) err.password = t('required')
    setErrors(err)
    if (Object.keys(err).length) return

    setBusy(true)
    // Simulated round trip to the identity service.
    setTimeout(() => {
      const res = login(form)
      setBusy(false)
      if (res.ok) { nav(from, { replace: true }); return }
      setFailure(res.reason)
    }, 550)
  }

  const failureText = {
    notfound: { en: 'No account exists with that username.', bn: 'এই ইউজারনেমে কোনো অ্যাকাউন্ট নেই।' },
    password: { en: 'The password is incorrect.', bn: 'পাসওয়ার্ড সঠিক নয়।' },
    inactive: { en: 'This account is inactive. Contact the system administrator.', bn: 'এই অ্যাকাউন্টটি নিষ্ক্রিয়। সিস্টেম অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।' },
    suspended: { en: 'This account has been suspended.', bn: 'এই অ্যাকাউন্টটি স্থগিত করা হয়েছে।' },
  }

  const fill = (username) => {
    setForm({ username, password: DEMO_PASSWORD, remember: false })
    setErrors({}); setFailure(null)
  }

  return (
    <div className="login">
      <div className="login-aside">
        <div className="login-brand">
          <span className="crest" aria-hidden="true">KCC</span>
          <div>
            <strong>IMIS</strong>
            <div className="small">{t('orgName')}</div>
          </div>
        </div>
        <h2>{t('imis')}</h2>
        <p>
          {lang === 'bn'
            ? 'হোল্ডিং ট্যাক্স, ট্রেড লাইসেন্স, পানির বিল, জন্ম-মৃত্যু নিবন্ধন ও অভিযোগ ব্যবস্থাপনার সমন্বিত প্ল্যাটফর্ম। শুধুমাত্র অনুমোদিত কর্মকর্তাদের জন্য।'
            : 'The integrated platform for holding tax, trade licences, water billing, civil registration and grievance redress. Authorised officers only.'}
        </p>
        <ul className="login-points">
          {[
            { en: 'Role-based access for every section', bn: 'প্রতিটি শাখার জন্য ভূমিকাভিত্তিক প্রবেশাধিকার' },
            { en: 'Live demand, collection and arrear dashboards', bn: 'লাইভ ডিমান্ড, আদায় ও বকেয়া ড্যাশবোর্ড' },
            { en: 'Every action written to the audit trail', bn: 'প্রতিটি কার্যক্রম অডিট ট্রেইলে সংরক্ষিত' },
          ].map((x) => <li key={x.en}>✓ {lang === 'bn' ? x.bn : x.en}</li>)}
        </ul>
        <Link className="small login-back" to="/">← {lang === 'bn' ? 'নাগরিক পোর্টালে ফিরুন' : 'Back to the public portal'}</Link>
      </div>

      <div className="login-panel">
        <form className="login-card" onSubmit={submit} noValidate>
          <div className="spread">
            <h1>{lang === 'bn' ? 'সাইন ইন' : 'Sign in'}</h1>
            <button type="button" className="langbtn langbtn-dark" onClick={toggle}>
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
          <p className="muted small">
            {lang === 'bn' ? 'আপনার দাপ্তরিক অ্যাকাউন্ট দিয়ে প্রবেশ করুন।' : 'Use your official IMIS account to continue.'}
          </p>

          {failure && <Alert tone="warn">{p(failureText[failure] || failureText.password)}</Alert>}

          <Field label={lang === 'bn' ? 'ইউজারনেম' : 'Username'} htmlFor="lu" error={errors.username}>
            <input id="lu" type="text" value={form.username} onChange={set('username')}
              autoComplete="username" autoFocus aria-invalid={Boolean(errors.username)} placeholder="admin" />
          </Field>

          <Field label={lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'} htmlFor="lp" error={errors.password}>
            <div className="pw-wrap">
              <input id="lp" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                autoComplete="current-password" aria-invalid={Boolean(errors.password)} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </Field>

          <div className="spread">
            <label className="flex small" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={form.remember} onChange={set('remember')} />
              {lang === 'bn' ? 'আমাকে মনে রাখুন' : 'Keep me signed in'}
            </label>
            <a className="small" href="#reset" onClick={(e) => e.preventDefault()}>
              {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
            </a>
          </div>

          <button className="btn btn-primary login-submit" type="submit" disabled={busy}>
            {busy ? t('loading') : (lang === 'bn' ? 'সাইন ইন করুন' : 'Sign in')}
          </button>

          <div className="demo-box">
            <div className="small" style={{ fontWeight: 600, marginBottom: '.35rem' }}>
              {lang === 'bn' ? 'ডেমো অ্যাকাউন্ট (ক্লিক করলে পূরণ হবে)' : 'Demo accounts — click to fill'}
            </div>
            <div className="flex">
              {DEMO_ACCOUNTS.map((u) => {
                const rec = users.find((x) => x.username === u)
                return (
                  <button key={u} type="button" className="btn btn-outline btn-sm" onClick={() => fill(u)}>
                    {u} · {rec ? p(ROLES[rec.role].label) : ''}
                  </button>
                )
              })}
            </div>
            <div className="small muted mt-1">
              {lang === 'bn' ? 'সকলের পাসওয়ার্ড: ' : 'Password for all: '}<code>{DEMO_PASSWORD}</code>
            </div>
          </div>

          <p className="small muted center mb-0">
            {lang === 'bn'
              ? 'ডেমো পরিবেশ — যাচাই ব্রাউজারেই সম্পন্ন হয়, কোনো তথ্য প্রেরিত হয় না।'
              : 'Demo environment — authentication runs in the browser and nothing is transmitted.'}
          </p>
        </form>
      </div>
    </div>
  )
}
