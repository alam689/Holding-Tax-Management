import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Field, Alert } from '../components/ui'
import { officials } from '../data/mockData'

export default function Contact() {
  const { t, p, n, lang } = useLang()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = t('required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = lang === 'bn' ? 'সঠিক ইমেইল দিন।' : 'Enter a valid email address.'
    }
    if (!form.message.trim()) err.message = t('required')
    setErrors(err)
    if (Object.keys(err).length === 0) setSent(true)
  }

  return (
    <>
      <PageHead
        title={t('navContact')}
        subtitle={lang === 'bn'
          ? 'সিটি কর্পোরেশন ভবনের ঠিকানা, অফিস সময় ও শাখাভিত্তিক যোগাযোগের তথ্য।'
          : 'Where to find us, when we are open, and who to speak to in each section.'}
        crumbs={[{ label: t('navContact') }]}
      />

      <Section>
        <div className="grid grid-2">
          <div>
            <div className="card">
              <h3>📍 {lang === 'bn' ? 'ঠিকানা' : 'Address'}</h3>
              <p className="mb-0">
                {t('orgName')}<br />
                {lang === 'bn' ? 'কেসিসি ভবন, শের-এ-বাংলা রোড' : 'KCC Bhaban, Sher-e-Bangla Road'}<br />
                {lang === 'bn' ? 'খুলনা — ৯১০০, বাংলাদেশ' : 'Khulna — 9100, Bangladesh'}
              </p>
              <dl className="kv mt-2">
                <dt>{t('hotline')}</dt><dd>{n(333)} · 041-720424</dd>
                <dt>{lang === 'bn' ? 'ফোন' : 'Phone'}</dt><dd>041-720424, 041-761234</dd>
                <dt>{t('email')}</dt><dd><a href="mailto:info@khulnacity.gov.bd">info@khulnacity.gov.bd</a></dd>
                <dt>{lang === 'bn' ? 'অফিস সময়' : 'Office hours'}</dt>
                <dd>{lang === 'bn' ? 'রবি – বৃহস্পতি, ৯:০০ – ১৭:০০' : 'Sun – Thu, 9:00 – 17:00'}</dd>
              </dl>
            </div>

            <div className="card mt-2">
              <h3>👥 {lang === 'bn' ? 'শাখাভিত্তিক যোগাযোগ' : 'Section contacts'}</h3>
              <div className="table-wrap" style={{ border: 0 }}>
                <table style={{ minWidth: 0 }}>
                  <tbody>
                    {officials.map((o) => (
                      <tr key={o.email}>
                        <td>
                          <strong>{p(o.name)}</strong>
                          <div className="small muted">{p(o.role)}</div>
                        </td>
                        <td className="small">
                          <a href={`tel:${o.phone.replace('-', '')}`}>{n(o.phone)}</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card mt-2">
              <h3>🗺️ {lang === 'bn' ? 'অবস্থান' : 'Location'}</h3>
              <div style={{
                height: 200, borderRadius: 'var(--radius)', display: 'grid', placeItems: 'center',
                background: 'repeating-linear-gradient(45deg, #eef4f0 0 14px, #e4ece7 14px 28px)',
                border: '1px solid var(--line)', color: 'var(--ink-3)', textAlign: 'center', padding: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '1.8rem' }}>📌</div>
                  {lang === 'bn'
                    ? '২২.৮১° উত্তর, ৮৯.৫৬° পূর্ব — শের-এ-বাংলা রোড, খুলনা'
                    : '22.81° N, 89.56° E — Sher-e-Bangla Road, Khulna'}
                </div>
              </div>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="card">
                <Alert tone="ok">
                  ✅ {lang === 'bn'
                    ? 'আপনার বার্তা গৃহীত হয়েছে। ৩ কার্যদিবসের মধ্যে উত্তর দেওয়া হবে।'
                    : 'Your message has been received. We reply within 3 working days.'}
                </Alert>
                <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                  {lang === 'bn' ? 'আরেকটি বার্তা' : 'Send another'}
                </button>
              </div>
            ) : (
              <form className="card" onSubmit={submit} noValidate>
                <h3>✉️ {lang === 'bn' ? 'বার্তা পাঠান' : 'Send a message'}</h3>
                <Field label={t('yourName')} htmlFor="cn" error={errors.name}>
                  <input id="cn" type="text" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
                </Field>
                <Field label={t('email')} htmlFor="ce" error={errors.email}>
                  <input id="ce" type="email" value={form.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} />
                </Field>
                <Field label={lang === 'bn' ? 'বিষয়' : 'Subject'} htmlFor="cs">
                  <input id="cs" type="text" value={form.subject} onChange={set('subject')} />
                </Field>
                <Field label={lang === 'bn' ? 'বার্তা' : 'Message'} htmlFor="cm" error={errors.message}>
                  <textarea id="cm" value={form.message} onChange={set('message')} aria-invalid={Boolean(errors.message)} />
                </Field>
                <button className="btn btn-primary" type="submit">{t('submit')}</button>
              </form>
            )}

            <div className="card mt-2">
              <Alert tone="info">
                {lang === 'bn'
                  ? 'সেবা সংক্রান্ত অভিযোগের জন্য এই ফরমের পরিবর্তে অভিযোগ নিষ্পত্তি ব্যবস্থা ব্যবহার করুন — সেখানে ট্র্যাকিং নম্বর পাওয়া যায়।'
                  : 'For a service complaint, use the grievance system instead of this form — it issues a tracking number.'}
              </Alert>
              <Link className="btn btn-outline" to="/grievance">{t('lodge')} →</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
