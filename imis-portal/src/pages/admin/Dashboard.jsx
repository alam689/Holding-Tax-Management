import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { BarChart, DonutChart, SeriesBarChart, Sparkline, PALETTE } from '../../components/charts'
import { notices, tenders, complaints } from '../../data/mockData'
import { ROLES } from '../../data/users'

// --- sample analytics -------------------------------------------------------
const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const MONTHS_BN = ['জুলা', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে', 'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন']
const COLLECTION = [18.4, 24.1, 31.7, 27.2, 22.9, 19.6, 26.8, 33.4, 41.2, 29.5, 24.7, 38.9] // ৳ lakh

const ZONE_WARDS = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31]
const HOLDINGS_PER_WARD = [4820, 3910, 4460, 3120, 5240, 2980, 4130, 3670, 5010, 2740, 3380]
const ASSESSED = [4210, 3480, 4090, 2760, 4710, 2610, 3720, 3190, 4480, 2350, 2980]
const COLLECTED = [3260, 2540, 3170, 1980, 3690, 1930, 2810, 2340, 3520, 1640, 2180]
const APPLICATIONS = [128, 96, 141, 77, 164, 63, 112, 88, 151, 59, 74]

const KPIS = [
  {
    key: 'holdings', value: '118,400', accent: '#0f7b41', icon: '🏠',
    label: { en: 'Assessed Holdings', bn: 'মূল্যায়িত হোল্ডিং' },
    delta: '+2.4%', trend: [92, 96, 101, 104, 109, 113, 118],
  },
  {
    key: 'demand', value: '৳ 46.2 Cr', accent: '#1d4ed8', icon: '🧾',
    label: { en: 'Current Year Demand', bn: 'চলতি বছরের ধার্য' },
    delta: '+8.1%', trend: [31, 34, 36, 39, 41, 44, 46],
  },
  {
    key: 'collected', value: '৳ 37.4 Cr', accent: '#0891b2', icon: '💰',
    label: { en: 'Collected to Date', bn: 'আদায়কৃত' },
    delta: '81% of demand', trend: [18, 22, 26, 29, 32, 35, 37],
  },
  {
    key: 'arrear', value: '৳ 8.8 Cr', accent: '#d97706', icon: '📉',
    label: { en: 'Outstanding Arrear', bn: 'অনাদায়ী বকেয়া' },
    delta: '−3.2%', trend: [12, 11.6, 11, 10.4, 9.7, 9.2, 8.8],
  },
  {
    key: 'licences', value: '42,350', accent: '#7c3aed', icon: '📜',
    label: { en: 'Active Trade Licences', bn: 'সক্রিয় ট্রেড লাইসেন্স' },
    delta: '+1,240 this year', trend: [37, 38, 39, 40, 41, 42, 42.3],
  },
  {
    key: 'grievance', value: '316', accent: '#c8102e', icon: '📣',
    label: { en: 'Open Grievances', bn: 'চলমান অভিযোগ' },
    delta: '48 due this week', trend: [402, 388, 371, 355, 340, 327, 316],
  },
]

/** Collapsible panel with the accent rule, as in the reference dashboard. */
function Panel({ title, subtitle, children, action, wide }) {
  const [open, setOpen] = useState(true)
  return (
    <section className={`panel ${wide ? 'panel-wide' : ''}`}>
      <header className="panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <div className="small muted">{subtitle}</div>}
        </div>
        <div className="flex">
          {action}
          <button className="panel-toggle" onClick={() => setOpen((o) => !o)}
            aria-expanded={open} aria-label={open ? 'Collapse panel' : 'Expand panel'}>
            {open ? '−' : '+'}
          </button>
        </div>
      </header>
      {open && <div className="panel-body">{children}</div>}
    </section>
  )
}

export default function Dashboard() {
  const { p, n, lang } = useLang()
  const { user } = useAuth()
  const [fy, setFy] = useState('2026-27')

  const months = lang === 'bn' ? MONTHS_BN : MONTHS
  const wardLabels = ZONE_WARDS.map((w) => n(w))

  const collectionData = useMemo(
    () => COLLECTION.map((v, i) => ({ label: months[i], value: v })),
    [months],
  )

  const statusData = [
    { label: lang === 'bn' ? 'পরিশোধিত' : 'Paid', value: 81, color: PALETTE[0] },
    { label: lang === 'bn' ? 'বকেয়া' : 'Due', value: 15, color: '#d97706' },
    { label: lang === 'bn' ? 'আপত্তি/স্থগিত' : 'Under objection', value: 4, color: '#c8102e' },
  ]

  const useTypeData = [
    { label: lang === 'bn' ? 'আবাসিক' : 'Residential', value: 78400 },
    { label: lang === 'bn' ? 'বাণিজ্যিক' : 'Commercial', value: 21600 },
    { label: lang === 'bn' ? 'মিশ্র' : 'Mixed', value: 11300 },
    { label: lang === 'bn' ? 'শিল্প' : 'Industrial', value: 4200 },
    { label: lang === 'bn' ? 'প্রাতিষ্ঠানিক' : 'Institutional', value: 2900 },
  ]

  const channelData = [
    { label: 'bKash', value: 41 },
    { label: 'Nagad', value: 23 },
    { label: 'Rocket', value: 9 },
    { label: lang === 'bn' ? 'কার্ড' : 'Card', value: 14 },
    { label: lang === 'bn' ? 'ব্যাংক / কাউন্টার' : 'Bank / counter', value: 13 },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return lang === 'bn' ? 'শুভ সকাল' : 'Good morning'
    if (h < 17) return lang === 'bn' ? 'শুভ অপরাহ্ন' : 'Good afternoon'
    return lang === 'bn' ? 'শুভ সন্ধ্যা' : 'Good evening'
  }

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</h1>
          <p className="small muted mb-0">
            {greeting()}, {p(user.name)} · {p(ROLES[user.role].label)}
            {user.ward ? ` · ${lang === 'bn' ? 'ওয়ার্ড' : 'Ward'} ${n(user.ward)}` : ''}
          </p>
        </div>
        <div className="flex">
          <label className="small muted" htmlFor="fy">{lang === 'bn' ? 'অর্থবছর' : 'Financial year'}</label>
          <select id="fy" value={fy} onChange={(e) => setFy(e.target.value)} style={{ width: 'auto' }}>
            {['2026-27', '2025-26', '2024-25'].map((y) => <option key={y} value={y}>{n(y)}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨 {lang === 'bn' ? 'প্রিন্ট' : 'Print'}</button>
        </div>
      </div>

      <div className="kpi-grid">
        {KPIS.map((k) => (
          <div className="kpi" key={k.key} style={{ '--kpi': k.accent }}>
            <span className="kpi-watermark" aria-hidden="true">{k.icon}</span>
            <div className="kpi-value">{lang === 'bn' ? n(k.value) : k.value}</div>
            <div className="kpi-label">{p(k.label)}</div>
            <div className="kpi-foot">
              <span className="kpi-delta">{k.delta}</span>
              <Sparkline values={k.trend} color="#fff" />
            </div>
          </div>
        ))}
      </div>

      <Panel
        title={lang === 'bn' ? 'মাসভিত্তিক হোল্ডিং ট্যাক্স আদায়' : 'Holding tax collection by month'}
        subtitle={`${lang === 'bn' ? 'অর্থবছর' : 'FY'} ${n(fy)} · ${lang === 'bn' ? 'লক্ষ টাকায়' : 'in ৳ lakh'}`}
        wide
      >
        <BarChart data={collectionData} height={260} format={(v) => n(v)}
          legend={[{ label: lang === 'bn' ? 'আদায় (লক্ষ ৳)' : 'Collection (৳ lakh)', color: PALETTE[0] }]} />
      </Panel>

      <div className="panel-row">
        <Panel title={lang === 'bn' ? 'হোল্ডিং ট্যাক্সের অবস্থা' : 'Holding tax status'}
          subtitle={lang === 'bn' ? 'শতাংশে' : 'share of total demand'}>
          <DonutChart data={statusData} format={(v) => `${n(v)}%`}
            centreLabel={lang === 'bn' ? 'মোট' : 'total'} />
        </Panel>

        <Panel title={lang === 'bn' ? 'ব্যবহার অনুযায়ী হোল্ডিং' : 'Holdings by use type'}
          subtitle={lang === 'bn' ? 'সংখ্যা' : 'number of holdings'}>
          <DonutChart data={useTypeData} format={(v) => n(v.toLocaleString('en-US'))}
            centreLabel={lang === 'bn' ? 'হোল্ডিং' : 'holdings'} />
        </Panel>
      </div>

      <Panel
        title={lang === 'bn' ? 'ওয়ার্ডভিত্তিক মূল্যায়ন ও আদায়' : 'Assessment and collection per ward'}
        subtitle={lang === 'bn' ? 'নির্বাচিত ওয়ার্ডসমূহ' : 'sampled wards across the three zones'}
        wide
      >
        <SeriesBarChart
          categories={wardLabels}
          series={[
            { label: lang === 'bn' ? 'মোট হোল্ডিং' : 'Total holdings', values: HOLDINGS_PER_WARD, color: '#cbd5e1' },
            { label: lang === 'bn' ? 'মূল্যায়িত' : 'Assessed', values: ASSESSED, color: PALETTE[1] },
            { label: lang === 'bn' ? 'আদায় সম্পন্ন' : 'Collected', values: COLLECTED, color: PALETTE[0] },
          ]}
          height={280}
          format={(v) => n(v)}
        />
      </Panel>

      <div className="panel-row">
        <Panel title={lang === 'bn' ? 'ওয়ার্ডভিত্তিক আবেদন' : 'Applications per ward'}
          subtitle={lang === 'bn' ? 'চলতি মাস' : 'current month'}>
          <BarChart data={ZONE_WARDS.map((w, i) => ({ label: n(w), value: APPLICATIONS[i] }))}
            height={230} color={PALETTE[2]} format={(v) => n(v)} />
        </Panel>

        <Panel title={lang === 'bn' ? 'পেমেন্ট চ্যানেল' : 'Payment channel mix'}
          subtitle={lang === 'bn' ? 'শতাংশে' : 'share of online transactions'}>
          <DonutChart data={channelData} format={(v) => `${n(v)}%`}
            centreLabel={lang === 'bn' ? 'অনলাইন' : 'online'} />
        </Panel>
      </div>

      <div className="panel-row">
        <Panel title={lang === 'bn' ? 'সাম্প্রতিক অভিযোগ' : 'Recent grievances'}
          action={<Link className="btn btn-outline btn-sm" to="/grievance">{lang === 'bn' ? 'সব' : 'All'}</Link>}>
          <div className="table-wrap" style={{ border: 0 }}>
            <table style={{ minWidth: 0 }}>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong className="small">{c.id}</strong>
                      <div className="small muted">{p(c.subject)}</div>
                    </td>
                    <td className="small">{p(c.category)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={lang === 'bn' ? 'নোটিশ ও দরপত্র' : 'Notices & tenders'}
          action={<Link className="btn btn-outline btn-sm" to="/notices">{lang === 'bn' ? 'সব' : 'All'}</Link>}>
          <ul className="plainlist">
            {notices.slice(0, 3).map((no) => (
              <li key={no.id}>📢 <Link to={`/notices/${no.id}`}>{p(no.title)}</Link></li>
            ))}
            {tenders.filter((x) => x.status === 'open').map((tn) => (
              <li key={tn.id}>📄 {p(tn.title)}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
