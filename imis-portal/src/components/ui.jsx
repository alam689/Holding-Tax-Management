import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

/** Coloured page banner used at the top of every inner page. */
export function PageHead({ title, subtitle, crumbs = [] }) {
  const { t } = useLang()
  return (
    <>
      <div className="breadcrumb no-print">
        <div className="wrap">
          <Link to="/">{t('navHome')}</Link>
          {crumbs.map((c, i) => (
            <span key={i}>
              {' / '}
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="page-head">
        <div className="wrap">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </>
  )
}

export function Section({ title, eyebrow, subtitle, action, alt, children, id }) {
  return (
    <section className={`section ${alt ? 'section-alt' : ''}`} id={id}>
      <div className="wrap">
        {(title || action) && (
          <div className="section-head section-head-row">
            <div>
              {eyebrow && <div className="eyebrow">{eyebrow}</div>}
              {title && <h2 className="mb-0">{title}</h2>}
              {subtitle && <p className="mt-1">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

/** Count-up number, animated once the element scrolls into view. */
export function CountUp({ value, suffix = '' }) {
  const { n } = useLang()
  const [shown, setShown] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame
    const run = () => {
      const start = performance.now()
      const dur = 1100
      const tick = (now) => {
        const k = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - k, 3)
        setShown(Math.round(value * eased))
        if (k < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect() } }),
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, [value])

  return <span ref={ref}>{n(shown.toLocaleString('en-US'))}{suffix}</span>
}

export function Badge({ tone = 'grey', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const { lang } = useLang()
  const map = {
    received: { tone: 'blue', en: 'Received', bn: 'গৃহীত' },
    'in-progress': { tone: 'amber', en: 'In progress', bn: 'প্রক্রিয়াধীন' },
    resolved: { tone: 'green', en: 'Resolved', bn: 'নিষ্পত্তি' },
    open: { tone: 'green', en: 'Open', bn: 'চলমান' },
    closed: { tone: 'grey', en: 'Closed', bn: 'সমাপ্ত' },
  }
  const s = map[status] || map.received
  return <Badge tone={s.tone}>{lang === 'bn' ? s.bn : s.en}</Badge>
}

/** Text field with label + inline validation message. */
export function Field({ label, error, hint, children, htmlFor }) {
  return (
    <div className="field">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <div className="hint">{hint}</div>}
      {error && <div className="err">{error}</div>}
    </div>
  )
}

export function Alert({ tone = 'info', children }) {
  return <div className={`alert alert-${tone}`}>{children}</div>
}

export function EmptyState({ children }) {
  return <div className="card center muted">{children}</div>
}

/** Formats an ISO date according to the active language. */
export function useDateFmt() {
  const { lang, n } = useLang()
  return (iso) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    const months = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      bn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'],
    }
    return `${n(d.getDate())} ${months[lang][d.getMonth()]} ${n(d.getFullYear())}`
  }
}
