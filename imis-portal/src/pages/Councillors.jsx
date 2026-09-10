import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Badge, Alert } from '../components/ui'
import { councillors, officials } from '../data/mockData'

export default function Councillors() {
  const { t, p, n, lang } = useLang()
  const [showReserved, setShowReserved] = useState('all')

  const list = councillors.filter((c) =>
    showReserved === 'all' ? true : showReserved === 'reserved' ? c.reserved : !c.reserved)

  return (
    <>
      <PageHead
        title={t('navCouncillors')}
        subtitle={lang === 'bn'
          ? '৩১টি সাধারণ ওয়ার্ড ও ১০টি সংরক্ষিত আসনের নির্বাচিত জনপ্রতিনিধিগণ এবং সিটি কর্পোরেশনের দায়িত্বপ্রাপ্ত কর্মকর্তাবৃন্দ।'
          : 'Elected representatives of the 31 general wards and 10 reserved seats, together with the City Corporation’s officers.'}
        crumbs={[{ label: t('navCouncillors') }]}
      />

      <Section title={lang === 'bn' ? 'নির্বাচিত কাউন্সিলরবৃন্দ' : 'Elected Councillors'}>
        <div className="flex mb-2 no-print">
          {[
            { k: 'all', en: 'All', bn: 'সব' },
            { k: 'general', en: 'General wards', bn: 'সাধারণ ওয়ার্ড' },
            { k: 'reserved', en: 'Reserved seats', bn: 'সংরক্ষিত আসন' },
          ].map((f) => (
            <button key={f.k} className={`btn btn-sm ${showReserved === f.k ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowReserved(f.k)}>
              {lang === 'bn' ? f.bn : f.en}
            </button>
          ))}
        </div>

        <div className="grid grid-3">
          {list.map((c) => (
            <div className="card" key={`${c.ward}-${c.name.en}`}>
              <div className="spread">
                <div className="ico" aria-hidden="true"
                  style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-50)', display: 'grid', placeItems: 'center', fontSize: '1.3rem' }}>
                  {c.reserved ? '👩' : '👤'}
                </div>
                {c.reserved
                  ? <Badge tone="amber">{lang === 'bn' ? 'সংরক্ষিত' : 'Reserved'}</Badge>
                  : <Badge tone="green">{lang === 'bn' ? `ওয়ার্ড ${n(c.ward)}` : `Ward ${c.ward}`}</Badge>}
              </div>
              <h3 className="mt-1 mb-0">{p(c.name)}</h3>
              <p className="small muted">{p(c.area)}</p>
              <p className="small mb-0">📞 <a href={`tel:${c.phone.replace('-', '')}`}>{n(c.phone)}</a></p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title={lang === 'bn' ? 'সিটি কর্পোরেশনের কর্মকর্তাবৃন্দ' : 'City Corporation Officers'}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{lang === 'bn' ? 'পদবি' : 'Designation'}</th>
                <th>{lang === 'bn' ? 'নাম' : 'Name'}</th>
                <th>{lang === 'bn' ? 'ফোন' : 'Phone'}</th>
                <th>{lang === 'bn' ? 'ইমেইল' : 'Email'}</th>
              </tr>
            </thead>
            <tbody>
              {officials.map((o) => (
                <tr key={o.email}>
                  <td>{p(o.role)}</td>
                  <td>{p(o.name)}</td>
                  <td><a href={`tel:${o.phone.replace('-', '')}`}>{n(o.phone)}</a></td>
                  <td className="small"><a href={`mailto:${o.email}`}>{o.email}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Alert tone="info">
          {lang === 'bn'
            ? 'অফিস সময়: রবিবার – বৃহস্পতিবার, সকাল ৯টা – বিকাল ৫টা। শুক্র ও শনিবার সাপ্তাহিক ছুটি।'
            : 'Office hours: Sunday – Thursday, 9:00 am – 5:00 pm. Closed on Friday and Saturday.'}
        </Alert>
      </Section>
    </>
  )
}
