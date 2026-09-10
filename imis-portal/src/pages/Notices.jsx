import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Field, Alert, Badge, useDateFmt } from '../components/ui'
import { notices } from '../data/mockData'

export function NoticeList() {
  const { t, p, lang } = useLang()
  const fmt = useDateFmt()
  const [q, setQ] = useState('')

  const term = q.trim().toLowerCase()
  const list = term
    ? notices.filter((n) => `${n.title.en} ${n.title.bn} ${n.id}`.toLowerCase().includes(term))
    : notices

  return (
    <>
      <PageHead
        title={t('navNotices')}
        subtitle={lang === 'bn'
          ? 'সিটি কর্পোরেশনের সকল বিজ্ঞপ্তি, পরিপত্র ও গণবিজ্ঞপ্তি এক জায়গায়।'
          : 'Every circular, public notice and announcement issued by the City Corporation.'}
        crumbs={[{ label: t('navNotices') }]}
      />
      <Section>
        <div className="card no-print mb-2">
          <Field label={t('search')} htmlFor="nq">
            <input id="nq" type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={lang === 'bn' ? 'শিরোনাম বা নোটিশ নম্বর…' : 'Title or notice number…'} />
          </Field>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{lang === 'bn' ? 'নোটিশ নং' : 'Notice no.'}</th>
                <th>{t('title')}</th>
                <th>{t('date')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>
                    <Link to={`/notices/${n.id}`}>{p(n.title)}</Link>{' '}
                    {n.urgent && <Badge tone="red">{lang === 'bn' ? 'জরুরি' : 'Urgent'}</Badge>}
                  </td>
                  <td>{fmt(n.date)}</td>
                  <td><Link className="btn btn-outline btn-sm" to={`/notices/${n.id}`}>{t('details')}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <div className="mt-2"><Alert tone="warn">{t('noResult')}</Alert></div>}
      </Section>
    </>
  )
}

export function NoticeDetail() {
  const { id } = useParams()
  const { t, p, lang } = useLang()
  const fmt = useDateFmt()
  const notice = notices.find((n) => n.id === id)
  if (!notice) return <Navigate to="/notices" replace />

  const others = notices.filter((n) => n.id !== notice.id).slice(0, 4)

  return (
    <>
      <PageHead
        title={p(notice.title)}
        subtitle={`${notice.id} · ${fmt(notice.date)}`}
        crumbs={[{ label: t('navNotices'), to: '/notices' }, { label: notice.id }]}
      />
      <Section>
        <div className="grid grid-2">
          <div className="card">
            {notice.urgent && <Alert tone="warn">{lang === 'bn' ? 'জরুরি বিজ্ঞপ্তি' : 'Urgent notice'}</Alert>}
            <p>{p(notice.body)}</p>
            <p className="small muted mb-0">
              {lang === 'bn' ? 'স্বাক্ষরিত' : 'Signed'} — {lang === 'bn' ? 'প্রধান নির্বাহী কর্মকর্তা' : 'Chief Executive Officer'}, {t('orgName')}
            </p>
            <div className="form-actions mt-2 no-print">
              <button className="btn btn-outline" onClick={() => window.print()}>🖨 {t('print')}</button>
              <Link className="btn btn-outline" to="/notices">← {t('navNotices')}</Link>
            </div>
          </div>
          <div className="card">
            <h3>{t('latestNotices')}</h3>
            <ul>
              {others.map((n) => (
                <li key={n.id} style={{ marginBottom: '.4rem' }}>
                  <Link to={`/notices/${n.id}`}>{p(n.title)}</Link>
                  <div className="small muted">{fmt(n.date)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
