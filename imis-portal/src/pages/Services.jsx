import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Alert, Field } from '../components/ui'
import { services, steps } from '../data/mockData'

export function ServiceList() {
  const { t, p, lang } = useLang()
  const [q, setQ] = useState('')

  const term = q.trim().toLowerCase()
  const list = term
    ? services.filter((s) =>
        `${s.name.en} ${s.name.bn} ${s.tagline.en} ${s.tagline.bn}`.toLowerCase().includes(term))
    : services

  return (
    <>
      <PageHead
        title={t('citizenServices')}
        subtitle={lang === 'bn'
          ? 'আইএমআইএস-এর আওতাধীন সকল নাগরিক সেবা — প্রয়োজনীয় কাগজপত্র, ফি ও সেবা প্রদানের সময়সীমাসহ।'
          : 'Every municipal service delivered through IMIS — with the documents required, the fee and the service standard.'}
        crumbs={[{ label: t('navServices') }]}
      />

      <Section>
        <div className="card no-print mb-2">
          <Field label={t('search')} htmlFor="sq">
            <input id="sq" type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={lang === 'bn' ? 'সেবার নাম লিখুন…' : 'Type a service name…'} />
          </Field>
        </div>

        <div className="grid grid-3">
          {list.map((s) => (
            <Link key={s.slug} className="service-card" to={s.to}>
              <span className="ico" aria-hidden="true">{s.icon}</span>
              <h3>{p(s.name)}</h3>
              <p>{p(s.tagline)}</p>
              <div className="meta">
                <span>💰 {p(s.fee)}</span>
                <span>⏱ {p(s.time)}</span>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && <div className="mt-2"><Alert tone="warn">{t('noResult')}</Alert></div>}
      </Section>
    </>
  )
}

export function ServiceDetail() {
  const { slug } = useParams()
  const { t, p, n, lang } = useLang()
  const [applied, setApplied] = useState(null)
  const [form, setForm] = useState({ name: '', mobile: '', holding: '', note: '' })
  const [errors, setErrors] = useState({})

  const svc = services.find((s) => s.slug === slug)
  if (!svc) return <Navigate to="/services" replace />

  // Holding tax has a dedicated screen of its own.
  if (svc.slug === 'holding-tax') return <Navigate to="/holding-tax" replace />

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = t('required')
    if (!/^01[3-9]\d{8}$/.test(form.mobile.replace(/[-\s]/g, ''))) {
      err.mobile = lang === 'bn' ? '১১ ডিজিটের বৈধ মোবাইল নম্বর দিন।' : 'Enter a valid 11-digit mobile number.'
    }
    setErrors(err)
    if (Object.keys(err).length) return
    setApplied(`APP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`)
  }

  return (
    <>
      <PageHead
        title={`${svc.icon} ${p(svc.name)}`}
        subtitle={p(svc.tagline)}
        crumbs={[{ label: t('navServices'), to: '/services' }, { label: p(svc.name) }]}
      />

      <Section>
        <div className="grid grid-2">
          <div>
            <div className="card">
              <h3>{lang === 'bn' ? 'সেবার বিবরণ' : 'About this service'}</h3>
              <p>{p(svc.description)}</p>
              <dl className="kv">
                <dt>{lang === 'bn' ? 'ফি' : 'Fee'}</dt><dd>{p(svc.fee)}</dd>
                <dt>{lang === 'bn' ? 'সেবা প্রদানের সময়' : 'Service standard'}</dt><dd>{p(svc.time)}</dd>
                <dt>{lang === 'bn' ? 'দায়িত্বপ্রাপ্ত শাখা' : 'Responsible section'}</dt>
                <dd>{t('orgName')}</dd>
              </dl>
            </div>

            <div className="card mt-2">
              <h3>📎 {lang === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : 'Documents required'}</h3>
              <ul>
                {(lang === 'bn' ? svc.docs.bn : svc.docs.en).map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            <div className="card mt-2">
              <h3>🪜 {t('howItWorks')}</h3>
              <ol className="timeline" style={{ listStyle: 'none' }}>
                {steps.map((s) => (
                  <li key={s.n}>
                    <span className="when">{lang === 'bn' ? `ধাপ ${n(s.n)}` : `Step ${s.n}`}</span>
                    <strong>{p(s.title)}</strong> — {p(s.text)}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div>
            {applied ? (
              <div className="card">
                <Alert tone="ok">
                  ✅ {lang === 'bn' ? 'আপনার আবেদন গৃহীত হয়েছে।' : 'Your application has been received.'}
                </Alert>
                <dl className="kv">
                  <dt>{lang === 'bn' ? 'আবেদন আইডি' : 'Application ID'}</dt><dd>{applied}</dd>
                  <dt>{lang === 'bn' ? 'সেবা' : 'Service'}</dt><dd>{p(svc.name)}</dd>
                  <dt>{lang === 'bn' ? 'প্রত্যাশিত নিষ্পত্তি' : 'Expected completion'}</dt><dd>{p(svc.time)}</dd>
                </dl>
                <p className="small muted">
                  {lang === 'bn'
                    ? 'আবেদন আইডি সংরক্ষণ করুন — অগ্রগতি জানতে এটি প্রয়োজন হবে।'
                    : 'Keep this application ID — you will need it to track progress.'}
                </p>
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => window.print()}>🖨 {t('print')}</button>
                  <button className="btn btn-outline" onClick={() => setApplied(null)}>
                    {lang === 'bn' ? 'নতুন আবেদন' : 'New application'}
                  </button>
                </div>
              </div>
            ) : (
              <form className="card" onSubmit={submit} noValidate>
                <h3>📝 {t('apply')}</h3>
                <Field label={lang === 'bn' ? 'আবেদনকারীর নাম' : 'Applicant name'} htmlFor="an" error={errors.name}>
                  <input id="an" type="text" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
                </Field>
                <Field label={lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile number'} htmlFor="am" error={errors.mobile}>
                  <input id="am" type="tel" value={form.mobile} onChange={set('mobile')}
                    aria-invalid={Boolean(errors.mobile)} placeholder="01XXXXXXXXX" />
                </Field>
                <Field label={`${lang === 'bn' ? 'হোল্ডিং নম্বর' : 'Holding number'} (${t('optional')})`} htmlFor="ah">
                  <input id="ah" type="text" value={form.holding} onChange={set('holding')} />
                </Field>
                <Field label={`${lang === 'bn' ? 'বিস্তারিত' : 'Details'} (${t('optional')})`} htmlFor="adet">
                  <textarea id="adet" value={form.note} onChange={set('note')} />
                </Field>
                <button className="btn btn-primary" type="submit">{t('submit')}</button>
                <p className="small muted mt-2 mb-0">
                  {lang === 'bn'
                    ? 'ডেমো ফরম — কোনো তথ্য সংরক্ষণ বা প্রেরণ করা হয় না।'
                    : 'Demo form — nothing is stored or transmitted.'}
                </p>
              </form>
            )}

            <div className="card mt-2">
              <h3>{t('quickLinks')}</h3>
              <ul>
                {services.filter((s) => s.slug !== svc.slug).slice(0, 5).map((s) => (
                  <li key={s.slug}><Link to={s.to}>{s.icon} {p(s.name)}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
