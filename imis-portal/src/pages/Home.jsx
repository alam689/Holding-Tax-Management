import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { Section, CountUp, StatusBadge, useDateFmt } from '../components/ui'
import { services, stats, notices, tenders, steps, officials } from '../data/mockData'

function Hero() {
  const { t, p } = useLang()
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const go = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    nav(`/holding-tax?q=${encodeURIComponent(term)}`)
  }

  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSub')}</p>
        <form className="hero-search" onSubmit={go} role="search">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('search')}
          />
          <button className="btn btn-accent" type="submit">🔍 {t('search')}</button>
        </form>
        <div className="hero-chips">
          <span>{t('popular')}</span>
          {['03-142-0087', '06-078-0219', '12-311-0044'].map((h) => (
            <button key={h} type="button" onClick={() => nav(`/holding-tax?q=${h}`)}>{h}</button>
          ))}
        </div>
        <div className="flex mt-3">
          <Link className="btn btn-accent" to="/holding-tax">🏠 {t('navHolding')}</Link>
          <Link className="btn btn-ghost" to="/payment">💳 {t('navPayment')}</Link>
          <Link className="btn btn-ghost" to="/grievance">📣 {t('navGrievance')}</Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t, p, n, money } = useLang()
  const fmt = useDateFmt()
  const open = tenders.filter((x) => x.status === 'open')

  return (
    <>
      <Hero />

      <Section
        eyebrow="IMIS"
        title={t('citizenServices')}
        subtitle={t('citizenServicesSub')}
        action={<Link className="btn btn-outline btn-sm" to="/services">{t('viewAll')} →</Link>}
      >
        <div className="grid grid-3">
          {services.slice(0, 6).map((s) => (
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
      </Section>

      <Section alt title={t('ataGlance')}>
        <div className="grid grid-3">
          {stats.map((s) => (
            <div className="stat" key={s.key}>
              <div className="ico" aria-hidden="true">{s.icon}</div>
              <div className="num"><CountUp value={s.value} suffix={s.suffix || ''} /></div>
              <div className="lbl">{p(s.label)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-2">
          <div className="card">
            <div className="spread mb-2">
              <h3 className="mb-0">📢 {t('latestNotices')}</h3>
              <Link className="small" to="/notices">{t('viewAll')} →</Link>
            </div>
            {notices.slice(0, 4).map((no) => {
              const d = new Date(no.date)
              return (
                <div className="notice-item" key={no.id}>
                  <div className="notice-date">
                    <div className="d">{n(d.getDate())}</div>
                    <div className="m">{d.toLocaleString('en', { month: 'short' })}</div>
                  </div>
                  <div className="notice-body">
                    <h4>
                      <Link to={`/notices/${no.id}`}>{p(no.title)}</Link>{' '}
                      {no.urgent && <span className="badge badge-red">New</span>}
                    </h4>
                    <p className="muted">{no.id}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <div className="spread mb-2">
              <h3 className="mb-0">📄 {t('openTenders')}</h3>
              <Link className="small" to="/tenders">{t('viewAll')} →</Link>
            </div>
            {open.map((tn) => (
              <div className="notice-item" key={tn.id}>
                <div className="notice-body" style={{ width: '100%' }}>
                  <h4>{p(tn.title)}</h4>
                  <p className="muted">
                    {tn.id} · {p(tn.method)} · {money(tn.value)}
                  </p>
                  <p className="small mt-1">
                    <StatusBadge status={tn.status} /> {t('deadline')}: <strong>{fmt(tn.deadline)}</strong>
                  </p>
                </div>
              </div>
            ))}
            {open.length === 0 && <p className="muted">{t('noResult')}</p>}
          </div>
        </div>
      </Section>

      <Section alt title={t('howItWorks')} subtitle={t('howItWorksSub')}>
        <div className="grid grid-4 steps">
          {steps.map((s) => (
            <div className="card step" key={s.n}>
              <span className="n">{n(s.n)}</span>
              <h3>{s.icon} {p(s.title)}</h3>
              <p className="small muted mb-0">{p(s.text)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('mayorMessage')}>
        <div className="card" style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div className="crest" style={{ width: 84, height: 84, fontSize: '2rem' }} aria-hidden="true">👤</div>
          <div style={{ flex: '1 1 320px' }}>
            <h3 className="mb-0">{p(officials[0].name)}</h3>
            <p className="small muted">{p(officials[0].role)} · {t('orgName')}</p>
            <p className="mb-0">
              {useLangQuote()}
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}

function useLangQuote() {
  const { lang } = useLang()
  return lang === 'bn'
    ? '“নাগরিক সেবাকে অফিসের কাউন্টার থেকে বের করে প্রত্যেক নাগরিকের হাতের মুঠোয় পৌঁছে দেওয়াই আমাদের অঙ্গীকার। আইএমআইএস পোর্টালের মাধ্যমে হোল্ডিং ট্যাক্স থেকে ট্রেড লাইসেন্স পর্যন্ত প্রতিটি সেবা এখন স্বচ্ছ, ট্র্যাকযোগ্য এবং হয়রানিমুক্ত।”'
    : '“Our commitment is to move citizen services out from behind the office counter and into every resident’s hand. Through the IMIS portal, every service — from holding tax to trade licences — is now transparent, trackable and free of hassle.”'
}
