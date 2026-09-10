import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { Section } from '../components/ui'

export default function NotFound() {
  const { t, lang } = useLang()
  return (
    <Section>
      <div className="card center" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🧭</div>
        <h1>404</h1>
        <p className="muted">
          {lang === 'bn'
            ? 'দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।'
            : 'Sorry, the page you are looking for could not be found.'}
        </p>
        <div className="flex" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/">{t('navHome')}</Link>
          <Link className="btn btn-outline" to="/services">{t('navServices')}</Link>
        </div>
      </div>
    </Section>
  )
}
