import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { ROLES } from '../data/users'
import { ADMIN_NAV } from './adminNav'

export function initialsOf(name) {
  return String(name || '?')
    .replace(/^(Md\.|Mrs\.|Mr\.|Engr\.|Sheikh)\s+/i, '')
    .split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}


function SidebarGroup({ item, collapsed, can }) {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const hasActive = item.children.some((c) => pathname === c.to)
  const [open, setOpen] = useState(hasActive)
  useEffect(() => { if (hasActive) setOpen(true) }, [hasActive])

  return (
    <div className={`sb-group ${open ? 'open' : ''}`}>
      <button className={`sb-link ${hasActive ? 'active' : ''}`} onClick={() => setOpen((o) => !o)}
        aria-expanded={open} title={lang === 'bn' ? item.bn : item.en}>
        <span className="sb-ico" aria-hidden="true">{item.icon}</span>
        {!collapsed && <span className="sb-text">{lang === 'bn' ? item.bn : item.en}</span>}
        {!collapsed && <span className="sb-caret" aria-hidden="true">{open ? '⌄' : '›'}</span>}
      </button>
      {open && !collapsed && (
        <div className="sb-sub">
          {item.children.filter((c) => !c.perm || can(c.perm)).map((c) => (
            <NavLink key={c.to} to={c.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {lang === 'bn' ? c.bn : c.en}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const { p, lang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const nav = useNavigate()

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onEsc) }
  }, [])

  if (!user) return null

  const signOut = () => { logout(); nav('/login', { replace: true }) }

  return (
    <div className="usermenu" ref={ref}>
      <button className="um-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <span className="avatar" aria-hidden="true">{initialsOf(user.name.en)}</span>
        <span className="um-name">{p(user.name)}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="um-pop" role="menu">
          <div className="um-head">
            <strong>{p(user.name)}</strong>
            <div className="small muted">{p(ROLES[user.role].label)}</div>
            <div className="small muted">{user.email}</div>
          </div>
          <Link to="/admin/profile" role="menuitem" onClick={() => setOpen(false)}>
            🪪 {lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}
          </Link>
          <Link to="/admin/profile#password" role="menuitem" onClick={() => setOpen(false)}>
            🔒 {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
          </Link>
          <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
            🌐 {lang === 'bn' ? 'নাগরিক পোর্টাল' : 'Public Portal'}
          </Link>
          <button role="menuitem" className="um-signout" onClick={signOut}>
            ⏻ {lang === 'bn' ? 'লগ আউট' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminLayout() {
  const { user, can } = useAuth()
  const { t, lang, toggle } = useLang()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('imis.sb') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { localStorage.setItem('imis.sb', collapsed ? '1' : '0') }, [collapsed])
  useEffect(() => { setMobileOpen(false); window.scrollTo({ top: 0 }) }, [pathname])

  const items = ADMIN_NAV.filter((i) => !i.perm || can(i.perm))

  return (
    <div className={`admin ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <aside className="sidebar">
        <div className="sb-brand">
          <span className="sb-crest" aria-hidden="true">KCC</span>
          {!collapsed && (
            <span>
              <strong>IMIS</strong>
              <em>{t('orgName')}</em>
            </span>
          )}
        </div>
        <nav className="sb-nav" aria-label="Admin">
          {items.map((item) => (
            item.children
              ? <SidebarGroup key={item.en} item={item} collapsed={collapsed} can={can} />
              : (
                <NavLink key={item.to} to={item.to} end={item.end}
                  className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
                  title={lang === 'bn' ? item.bn : item.en}>
                  <span className="sb-ico" aria-hidden="true">{item.icon}</span>
                  {!collapsed && <span className="sb-text">{lang === 'bn' ? item.bn : item.en}</span>}
                </NavLink>
              )
          ))}
        </nav>
        {!collapsed && (
          <div className="sb-foot small">
            {t('imis')} v1.0<br />© {new Date().getFullYear()} {t('orgName')}
          </div>
        )}
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <button className="icon-btn" onClick={() => { setCollapsed((c) => !c); setMobileOpen((m) => !m) }}
            aria-label="Toggle navigation">☰</button>
          <div className="admin-top-title">{t('imis')}</div>
          <div className="spacer" />
          <button className="icon-btn" onClick={toggle} aria-label="Switch language">
            {lang === 'en' ? 'বাং' : 'EN'}
          </button>
          <Link className="icon-btn" to="/" title={lang === 'bn' ? 'নাগরিক পোর্টাল' : 'Public portal'}>🌐</Link>
          <UserMenu />
        </header>

        <div className="admin-body">
          <Outlet />
        </div>
      </div>

      {mobileOpen && <div className="sb-scrim" onClick={() => setMobileOpen(false)} />}
    </div>
  )
}
