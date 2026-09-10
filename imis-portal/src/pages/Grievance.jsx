import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Field, Alert, StatusBadge, useDateFmt } from '../components/ui'
import { complaints, complaintCategories, WARDS } from '../data/mockData'

function LodgeForm() {
  const { t, p, n, lang } = useLang()
  const [form, setForm] = useState({ name: '', mobile: '', ward: '', category: 'water', subject: '', details: '', address: '' })
  const [errors, setErrors] = useState({})
  const [ref, setRef] = useState(null)

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
    if (!form.subject.trim()) err.subject = t('required')
    if (form.details.trim().length < 20) {
      err.details = lang === 'bn' ? 'অন্তত ২০ অক্ষরে বিবরণ লিখুন।' : 'Please describe the issue in at least 20 characters.'
    }
    setErrors(err)
    if (Object.keys(err).length) return
    setRef(`GRV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 8999)).padStart(5, '0')}`)
  }

  if (ref) {
    return (
      <div className="card">
        <Alert tone="ok">
          ✅ {lang === 'bn' ? 'আপনার অভিযোগ নিবন্ধিত হয়েছে।' : 'Your complaint has been registered.'}
        </Alert>
        <dl className="kv">
          <dt>{lang === 'bn' ? 'অভিযোগ নম্বর' : 'Complaint number'}</dt><dd>{ref}</dd>
          <dt>{t('category')}</dt>
          <dd>{p(complaintCategories.find((c) => c.value === form.category)?.label || {})}</dd>
          <dt>{lang === 'bn' ? 'নিষ্পত্তির সময়সীমা' : 'Redress standard'}</dt>
          <dd>{lang === 'bn' ? '১৫ কার্যদিবস' : '15 working days'}</dd>
        </dl>
        <p className="small muted">
          {lang === 'bn'
            ? 'অভিযোগ নম্বরটি সংরক্ষণ করুন। পাশের ট্র্যাকিং বক্সে এটি দিয়ে অগ্রগতি দেখতে পারবেন।'
            : 'Keep this number safe — use the tracking box to follow the progress.'}
        </p>
        <button className="btn btn-outline" onClick={() => { setRef(null); setForm({ ...form, subject: '', details: '' }) }}>
          {lang === 'bn' ? 'আরেকটি অভিযোগ' : 'Lodge another'}
        </button>
      </div>
    )
  }

  return (
    <form className="card" onSubmit={submit} noValidate>
      <h3>📣 {t('lodge')}</h3>
      <div className="form-row">
        <Field label={t('yourName')} htmlFor="gn" error={errors.name}>
          <input id="gn" type="text" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field label={lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile number'} htmlFor="gm" error={errors.mobile}>
          <input id="gm" type="tel" value={form.mobile} onChange={set('mobile')}
            aria-invalid={Boolean(errors.mobile)} placeholder="01XXXXXXXXX" />
        </Field>
      </div>
      <div className="form-row">
        <Field label={t('ward')} htmlFor="gw">
          <select id="gw" value={form.ward} onChange={set('ward')}>
            <option value="">{lang === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
            {WARDS.map((w) => (
              <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>
            ))}
          </select>
        </Field>
        <Field label={t('category')} htmlFor="gc">
          <select id="gc" value={form.category} onChange={set('category')}>
            {complaintCategories.map((c) => (
              <option key={c.value} value={c.value}>{p(c.label)}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={`${t('address')} (${t('optional')})`} htmlFor="ga">
        <input id="ga" type="text" value={form.address} onChange={set('address')} />
      </Field>
      <Field label={lang === 'bn' ? 'বিষয়' : 'Subject'} htmlFor="gs" error={errors.subject}>
        <input id="gs" type="text" value={form.subject} onChange={set('subject')} aria-invalid={Boolean(errors.subject)} />
      </Field>
      <Field label={t('description')} htmlFor="gd" error={errors.details}
        hint={lang === 'bn' ? 'স্থান, সময় ও সমস্যার ধরন উল্লেখ করুন।' : 'Mention the location, when it started and the nature of the problem.'}>
        <textarea id="gd" value={form.details} onChange={set('details')} aria-invalid={Boolean(errors.details)} />
      </Field>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">{t('submit')}</button>
        <button className="btn btn-outline" type="button"
          onClick={() => { setForm({ name: '', mobile: '', ward: '', category: 'water', subject: '', details: '', address: '' }); setErrors({}) }}>
          {t('reset')}
        </button>
      </div>
    </form>
  )
}

function Tracker() {
  const { t, p, lang } = useLang()
  const fmt = useDateFmt()
  const [id, setId] = useState('')
  const [result, setResult] = useState(undefined)

  const search = (e) => {
    e.preventDefault()
    const found = complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase())
    setResult(found || null)
  }

  return (
    <div className="card">
      <h3>🔎 {t('track')}</h3>
      <form onSubmit={search}>
        <Field label={lang === 'bn' ? 'অভিযোগ নম্বর' : 'Complaint number'} htmlFor="tid">
          <input id="tid" type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="GRV-2026-00817" />
        </Field>
        <button className="btn btn-primary" type="submit">{t('search')}</button>
      </form>
      <p className="small muted mt-2">
        {lang === 'bn' ? 'ডেমো নম্বর: ' : 'Demo numbers: '}{complaints.map((c) => c.id).join(' · ')}
      </p>

      {result === null && <Alert tone="warn">{t('noResult')}</Alert>}
      {result && (
        <div className="mt-2">
          <div className="spread mb-2">
            <strong>{result.id}</strong>
            <StatusBadge status={result.status} />
          </div>
          <dl className="kv">
            <dt>{t('category')}</dt><dd>{p(result.category)}</dd>
            <dt>{lang === 'bn' ? 'বিষয়' : 'Subject'}</dt><dd>{p(result.subject)}</dd>
            <dt>{lang === 'bn' ? 'দাখিলের তারিখ' : 'Lodged on'}</dt><dd>{fmt(result.date)}</dd>
          </dl>
          <h4 className="mt-2">{lang === 'bn' ? 'অগ্রগতি' : 'Progress'}</h4>
          <ul className="timeline">
            {result.timeline.map((s, i) => (
              <li key={i}>
                <span className="when">{fmt(s.at)}</span>
                {p(s.label)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Grievance() {
  const { t, lang } = useLang()
  return (
    <>
      <PageHead
        title={t('grievanceTitle')}
        subtitle={lang === 'bn'
          ? 'নাগরিক সেবা সংক্রান্ত যেকোনো অভিযোগ অনলাইনে দাখিল করুন এবং প্রতিটি ধাপে অগ্রগতি দেখুন। নিষ্পত্তির সময়সীমা ১৫ কার্যদিবস।'
          : 'Lodge any complaint about municipal services online and follow it at every stage. The redress standard is 15 working days.'}
        crumbs={[{ label: t('navGrievance') }]}
      />
      <Section>
        <div className="grid grid-2">
          <LodgeForm />
          <Tracker />
        </div>
        <Alert tone="info">
          {lang === 'bn'
            ? 'জরুরি প্রয়োজনে হটলাইন ৩৩৩ (২৪ ঘণ্টা) অথবা জাতীয় অভিযোগ ব্যবস্থাপনা পোর্টাল (grs.gov.bd) ব্যবহার করুন।'
            : 'For emergencies call the hotline 333 (24 hours), or use the national Grievance Redress System (grs.gov.bd).'}
        </Alert>
      </Section>
    </>
  )
}
