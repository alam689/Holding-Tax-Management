import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { PageHead, Section, StatusBadge, Alert, useDateFmt } from '../components/ui'
import { tenders } from '../data/mockData'

export default function Tenders() {
  const { t, p, n, money, lang } = useLang()
  const fmt = useDateFmt()
  const [filter, setFilter] = useState('all')

  const list = filter === 'all' ? tenders : tenders.filter((x) => x.status === filter)

  const daysLeft = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000)

  return (
    <>
      <PageHead
        title={t('navTenders')}
        subtitle={lang === 'bn'
          ? 'পিপিআর ২০০৮ অনুসরণে প্রকাশিত সকল দরপত্র বিজ্ঞপ্তি — উন্মুক্ত ও সমাপ্ত।'
          : 'All procurement notices published under PPR 2008 — both open and closed.'}
        crumbs={[{ label: t('navTenders') }]}
      />

      <Section>
        <div className="flex mb-2 no-print">
          {[
            { k: 'all', en: 'All', bn: 'সব' },
            { k: 'open', en: 'Open', bn: 'চলমান' },
            { k: 'closed', en: 'Closed', bn: 'সমাপ্ত' },
          ].map((f) => (
            <button key={f.k} className={`btn btn-sm ${filter === f.k ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f.k)}>
              {lang === 'bn' ? f.bn : f.en}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{lang === 'bn' ? 'দরপত্র আইডি' : 'Tender ID'}</th>
                <th>{t('title')}</th>
                <th>{lang === 'bn' ? 'পদ্ধতি' : 'Method'}</th>
                <th className="num">{lang === 'bn' ? 'প্রাক্কলিত মূল্য' : 'Estimated value'}</th>
                <th>{t('deadline')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((x) => {
                const d = daysLeft(x.deadline)
                return (
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>
                      {p(x.title)}
                      <div className="small muted">
                        {lang === 'bn' ? 'প্রকাশ' : 'Published'}: {fmt(x.published)}
                      </div>
                    </td>
                    <td className="small">{p(x.method)}</td>
                    <td className="num">{money(x.value)}</td>
                    <td>
                      {fmt(x.deadline)}
                      {x.status === 'open' && d >= 0 && (
                        <div className="small" style={{ color: d <= 7 ? '#c8102e' : '#6b7b89' }}>
                          {lang === 'bn' ? `${n(d)} দিন বাকি` : `${d} days left`}
                        </div>
                      )}
                    </td>
                    <td><StatusBadge status={x.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <div className="mt-2"><Alert tone="warn">{t('noResult')}</Alert></div>}

        <Alert tone="info">
          {lang === 'bn'
            ? 'দরপত্র দলিল সংগ্রহ ও দাখিল জাতীয় ই-জিপি পোর্টালের (eprocure.gov.bd) মাধ্যমে সম্পন্ন করতে হবে।'
            : 'Tender documents must be purchased and bids submitted through the national e-GP portal (eprocure.gov.bd).'}
        </Alert>
      </Section>
    </>
  )
}
