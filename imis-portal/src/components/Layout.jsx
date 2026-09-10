import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { notices } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/', key: 'navHome', end: true },
  { to: '/about', key: 'navAbout' },
  { to: '/services', key: 'navServices' },
  { to: '/holding-tax', key: 'navHolding' },
  { to: '/payment', key: 'navPayment' },
  { to: '/notices', key: 'navNotices' },
  { to: '/tenders', key: 'navTenders' },
  { to: '/grievance', key: 'navGrievance' },
  { to: '/councillors', key: 'navCouncillors' },
  { to: '/contact', key: 'navContact' },
]

function TopBar() {
  const { t, lang, toggle } = useLang()
  return (
    <div className="topbar">
      <div className="wrap">
        <div className="topbar-left">
          <span className="flagdot" aria-hidden="true" />
          <span>{t('govt')}</span>
        </div>
        <div className="topbar-right">
          <span className="hide-sm">{t('ministry')}</span>
          <a href="#footer">{t('hotline')}: 333</a>
          <button className="langbtn" onClick={toggle} aria-label="Switch language">
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Sends signed-in officers to the back office and everyone else to sign-in. */
function OfficerLink() {
  const { isAuthenticated } = useAuth()
  const { lang } = useLang()
  return isAuthenticated
    ? <Link className="btn btn-accent btn-sm" to="/admin">▦ {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</Link>
    : <Link className="btn btn-outline btn-sm" to="/login">🔐 {lang === 'bn' ? 'অফিসার লগইন' : 'Officer login'}</Link>
}

function Masthead() {
  const { t } = useLang()
  return (
    <header className="masthead">
      <div className="wrap">
        <Link to="/" className="crest" aria-hidden="true" tabIndex={-1}>KCC</Link>
        <div>
          <div className="brand-name">
            <Link to="/" style={{ color: 'inherit' }}>IMIS</Link>
          </div>
          <div className="brand-sub">{t('orgName')} · {t('publicPortal')}</div>
        </div>
        <div className="masthead-spacer" />
        <div className="masthead-actions no-print">
          <Link className="btn btn-outline btn-sm" to="/grievance">{t('lodge')}</Link>
          <Link className="btn btn-primary btn-sm" to="/payment">{t('navPayment')}</Link>
          <OfficerLink />
        </div>
      </div>
    </header>
  )
}

function Nav() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className="nav no-print" aria-label="Main">
      <div className="wrap">
        <button className="navtoggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          ☰ {t('navServices')}
        </button>
        <div className={`navlinks ${open ? 'open' : ''}`} style={{ display: undefined }}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              {t(item.key)}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Ticker() {
  const { p } = useLang()
  const urgent = notices.slice(0, 4)
  return (
    <div className="marquee no-print" role="region" aria-label="Announcements">
      <span className="tag">নোটিশ · NOTICE</span>
      <div className="marquee-viewport">
        <div className="marquee-track">
          {urgent.map((n) => (
            <Link key={n.id} to={`/notices/${n.id}`} style={{ color: '#7c2d12' }}>◆ {p(n.title)}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Footer() {
  const { t, n } = useLang()
  return (
    <footer className="footer" id="footer">
      <div className="wrap cols">
        <div>
          <h4>{t('imis')}</h4>
          <p className="small">{t('footerAbout')}</p>
          <p className="small mb-0">{t('hotline')}: <strong style={{ color: '#fff' }}>৩৩৩</strong> · 041-720424</p>
        </div>
        <div>
          <h4>{t('quickLinks')}</h4>
          <ul>
            <li><Link to="/holding-tax">{t('navHolding')}</Link></li>
            <li><Link to="/payment">{t('navPayment')}</Link></li>
            <li><Link to="/services/trade-licence">Trade Licence</Link></li>
            <li><Link to="/services/birth-death">Birth & Death Registration</Link></li>
            <li><Link to="/grievance">{t('navGrievance')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t('navAbout')}</h4>
          <ul>
            <li><Link to="/about">{t('orgName')}</Link></li>
            <li><Link to="/councillors">{t('navCouncillors')}</Link></li>
            <li><Link to="/notices">{t('navNotices')}</Link></li>
            <li><Link to="/tenders">{t('navTenders')}</Link></li>
            <li><Link to="/contact">{t('navContact')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t('navContact')}</h4>
          <p className="small mb-0">
            {t('orgName')}<br />
            KCC Bhaban, Sher-e-Bangla Road<br />
            Khulna 9100, Bangladesh<br />
            info@khulnacity.gov.bd
          </p>
        </div>
      </div>
      <div className="wrap bottom">
        <span>© {n(new Date().getFullYear())} {t('orgName')}. {t('copyright')}</span>
        <span>{t('demoNote')}</span>
      </div>
    </footer>
  )
}

function ToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button className="totop no-print" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top">↑</button>
  )
}

export default function Layout() {
  const { t } = useLang()
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])

  return (
    <>
      <a className="skip" href="#main">{t('skipToContent')}</a>
      <TopBar />
      <Masthead />
      <Nav />
      <Ticker />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ToTop />
    </>
  )
}
