import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Field, Alert, StatusBadge, useDateFmt } from '../components/ui'
import { holdings, WARDS } from '../data/mockData'

// Rate table used by the calculator. The City Corporation model tax schedule
// caps the aggregate rate at 12.5% of the annual value.
const RATES = [
  { key: 'holding', pct: 7, label: { en: 'Holding tax @ 7%', bn: 'হোল্ডিং কর @ ৭%' } },
  { key: 'conservancy', pct: 2, label: { en: 'Conservancy rate @ 2%', bn: 'পরিচ্ছন্নতা কর @ ২%' } },
  { key: 'lighting', pct: 2, label: { en: 'Lighting rate @ 2%', bn: 'আলোকায়ন কর @ ২%' } },
  { key: 'water', pct: 1.5, label: { en: 'Water rate @ 1.5%', bn: 'পানি কর @ ১.৫%' } },
]

const USE_FACTOR = [
  { value: 'own', factor: 1, label: { en: 'Residential — owner occupied', bn: 'আবাসিক — নিজ ব্যবহার' } },
  { value: 'rent', factor: 1, label: { en: 'Residential — rented out', bn: 'আবাসিক — ভাড়া প্রদত্ত' } },
  { value: 'mixed', factor: 1.25, label: { en: 'Mixed use', bn: 'মিশ্র ব্যবহার' } },
  { value: 'commercial', factor: 1.5, label: { en: 'Commercial / industrial', bn: 'বাণিজ্যিক / শিল্প' } },
]

function demandOf(h) {
  const totalPct = RATES.reduce((s, r) => s + (h.rates?.[r.key] ?? r.pct), 0)
  return Math.round((h.annualValue * totalPct) / 100)
}

// ---------------------------------------------------------------------------

function HoldingResult({ h }) {
  const { t, p, n, money } = useLang()
  const fmt = useDateFmt()
  const current = demandOf(h)
  const paidThisYear = h.ledger[0]?.paid ?? 0
  const total = h.arrear + Math.max(0, current - paidThisYear)

  return (
    <div className="card mt-2">
      <div className="spread mb-2">
        <div>
          <h3 className="mb-0">{p(h.owner)}</h3>
          <p className="small muted mb-0">
            {t('holdingNo')}: <strong>{h.holdingNo}</strong> · {t('ward')} {n(h.ward)} · {p(h.mohalla)}
          </p>
        </div>
        <StatusBadge status={total > 0 ? 'in-progress' : 'resolved'} />
      </div>

      <div className="grid grid-2">
        <dl className="kv">
          <dt>{t('ownerName')}</dt><dd>{p(h.owner)}</dd>
          <dt>{useLabelFather()}</dt><dd>{p(h.father)}</dd>
          <dt>NID</dt><dd>{h.nid}</dd>
          <dt>{t('ward')}</dt><dd>{n(h.ward)}</dd>
          <dt>{t('mohalla')}</dt><dd>{p(h.mohalla)}</dd>
          <dt>{t('useType')}</dt><dd>{p(h.useType)}</dd>
        </dl>
        <dl className="kv">
          <dt>{useLabelLand()}</dt><dd>{n(h.landArea)} decimal</dd>
          <dt>{useLabelBuilt()}</dt><dd>{n(h.builtArea.toLocaleString('en-US'))} sq.ft · {n(h.storeys)} storey</dd>
          <dt>{t('annualValue')}</dt><dd>{money(h.annualValue)}</dd>
          <dt>{t('currentDue')}</dt><dd>{money(Math.max(0, current - paidThisYear))}</dd>
          <dt>{t('arrear')}</dt><dd style={{ color: h.arrear ? '#c8102e' : undefined }}>{money(h.arrear)}</dd>
          <dt>{t('totalDue')}</dt><dd style={{ fontSize: '1.1rem', color: '#0a6135' }}>{money(total)}</dd>
        </dl>
      </div>

      <div className="form-actions mt-2 no-print">
        <Link className="btn btn-primary" to={`/payment?type=holding&ref=${h.holdingNo}&amount=${total}`}>
          💳 {t('payNow')}
        </Link>
        <button className="btn btn-outline" onClick={() => window.print()}>🖨 {t('print')}</button>
      </div>

      <h4 className="mt-3">🧾 {t('ledger')}</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{useLabelYear()}</th>
              <th className="num">{useLabelDemand()}</th>
              <th className="num">{useLabelPaid()}</th>
              <th className="num">{t('arrear')}</th>
              <th>{useLabelReceipt()}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {h.ledger.map((l) => (
              <tr key={l.year}>
                <td>{n(l.year)}</td>
                <td className="num">{money(l.demand)}</td>
                <td className="num">{money(l.paid)}</td>
                <td className="num">{money(l.demand - l.paid)}</td>
                <td>{l.receipt}</td>
                <td>{fmt(l.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted mt-1 mb-0">
        {useLabelLastPaid()}: {fmt(h.lastPaid)}
      </p>
    </div>
  )
}

// small helpers so the labels stay bilingual without bloating the dictionary
const bi = (en, bn) => function useBi() { const { lang } = useLang(); return lang === 'bn' ? bn : en }
const useLabelFather = bi('Father / Husband', 'পিতা / স্বামী')
const useLabelLand = bi('Land area', 'জমির পরিমাণ')
const useLabelBuilt = bi('Built area', 'নির্মিত এলাকা')
const useLabelYear = bi('Financial Year', 'অর্থবছর')
const useLabelDemand = bi('Demand', 'ধার্য')
const useLabelPaid = bi('Paid', 'পরিশোধিত')
const useLabelReceipt = bi('Money Receipt', 'রসিদ নং')
const useLabelLastPaid = bi('Last payment', 'সর্বশেষ পরিশোধ')

// ---------------------------------------------------------------------------

function Calculator() {
  const { t, p, n, money, lang } = useLang()
  const [annualValue, setAnnualValue] = useState(96000)
  const [use, setUse] = useState('own')
  const [rebate, setRebate] = useState(true)

  const factor = USE_FACTOR.find((u) => u.value === use)?.factor ?? 1
  const lines = useMemo(() => {
    const base = annualValue * factor
    return RATES.map((r) => ({ ...r, amount: (base * r.pct) / 100 }))
  }, [annualValue, factor])

  const gross = lines.reduce((s, l) => s + l.amount, 0)
  const discount = rebate ? gross * 0.05 : 0
  const net = gross - discount

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>🧮 {t('calculator')}</h3>
        <p className="small muted">
          {lang === 'bn'
            ? 'বার্ষিক মূল্যায়ন ও ব্যবহারের ধরন দিন — ধার্য কর তাৎক্ষণিক হিসাব হবে।'
            : 'Enter the annual value and use type — the demand is computed instantly.'}
        </p>

        <Field label={`${t('annualValue')} (৳)`} htmlFor="av"
          hint={lang === 'bn' ? 'বার্ষিক ভাড়া মূল্যের ভিত্তিতে নির্ধারিত।' : 'Derived from the annual rental value of the holding.'}>
          <input id="av" type="number" min="0" step="1000" value={annualValue}
            onChange={(e) => setAnnualValue(Math.max(0, Number(e.target.value) || 0))} />
        </Field>

        <Field label={t('useType')} htmlFor="ut">
          <select id="ut" value={use} onChange={(e) => setUse(e.target.value)}>
            {USE_FACTOR.map((u) => (
              <option key={u.value} value={u.value}>{p(u.label)} (×{u.factor})</option>
            ))}
          </select>
        </Field>

        <label className="flex small" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={rebate} onChange={(e) => setRebate(e.target.checked)} />
          {lang === 'bn' ? '৩০ সেপ্টেম্বরের মধ্যে পরিশোধে ৫% রেয়াত প্রয়োগ করুন' : 'Apply the 5% early-payment rebate (before 30 September)'}
        </label>
      </div>

      <div className="card">
        <h3>{t('assessment')}</h3>
        <div className="table-wrap" style={{ border: 0 }}>
          <table style={{ minWidth: 0 }}>
            <tbody>
              {lines.map((l) => (
                <tr key={l.key}>
                  <td>{p(l.label)}</td>
                  <td className="num">{money(l.amount)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>{lang === 'bn' ? 'মোট ধার্য' : 'Gross demand'}</strong></td>
                <td className="num"><strong>{money(gross)}</strong></td>
              </tr>
              {rebate && (
                <tr>
                  <td style={{ color: '#0f7b41' }}>{lang === 'bn' ? 'রেয়াত (৫%)' : 'Rebate (5%)'}</td>
                  <td className="num" style={{ color: '#0f7b41' }}>− {money(discount)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="receipt total" style={{ border: 0, borderTop: '2px solid var(--line)' }}>
          <span>{t('totalDue')}</span>
          <span>{money(net)}</span>
        </div>
        <p className="small muted mt-2 mb-0">
          {lang === 'bn'
            ? 'এটি নির্দেশক হিসাব। চূড়ান্ত ধার্য কর মূল্যায়ন রেজিস্টার অনুযায়ী নির্ধারিত হবে।'
            : 'Indicative only. The final demand is governed by the assessment register.'}
        </p>
        <Link className="btn btn-primary mt-2" to={`/payment?type=holding&amount=${Math.round(net)}`}>
          {t('payNow')} →
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

export default function HoldingTax() {
  const { t, n, lang } = useLang()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [ward, setWard] = useState('')
  const [submitted, setSubmitted] = useState(Boolean(params.get('q')))

  useEffect(() => {
    const incoming = params.get('q') || ''
    setQ(incoming)
    setSubmitted(Boolean(incoming))
  }, [params])

  const results = useMemo(() => {
    if (!submitted) return null
    const term = q.trim().toLowerCase()
    return holdings.filter((h) => {
      const matchWard = !ward || String(h.ward) === ward
      if (!term) return matchWard
      return (
        matchWard &&
        (h.holdingNo.toLowerCase().includes(term) ||
          h.owner.en.toLowerCase().includes(term) ||
          h.owner.bn.includes(q.trim()) ||
          h.nid.includes(term))
      )
    })
  }, [q, ward, submitted])

  const onSearch = (e) => {
    e.preventDefault()
    setParams(q.trim() ? { q: q.trim() } : {})
    setSubmitted(true)
  }

  return (
    <>
      <PageHead
        title={t('navHolding')}
        subtitle={lang === 'bn'
          ? 'হোল্ডিং নম্বর, মালিকের নাম বা জাতীয় পরিচয়পত্র নম্বর দিয়ে আপনার কর তথ্য দেখুন, বকেয়া যাচাই করুন ও অনলাইনে পরিশোধ করুন।'
          : 'Look up your holding by number, owner name or NID, review the assessment and arrears, and settle the dues online.'}
        crumbs={[{ label: t('navHolding') }]}
      />

      <Section>
        <div className="card no-print">
          <h3>🔎 {t('holdingSearch')}</h3>
          <form onSubmit={onSearch}>
            <div className="form-row">
              <Field label={`${t('holdingNo')} / ${t('ownerName')} / NID`} htmlFor="q">
                <input id="q" type="text" value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="03-142-0087" />
              </Field>
              <Field label={t('ward')} htmlFor="w">
                <select id="w" value={ward} onChange={(e) => setWard(e.target.value)}>
                  <option value="">{lang === 'bn' ? 'সব ওয়ার্ড' : 'All wards'}</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">{t('search')}</button>
              <button className="btn btn-outline" type="button"
                onClick={() => { setQ(''); setWard(''); setSubmitted(false); setParams({}) }}>
                {t('reset')}
              </button>
            </div>
          </form>
          <p className="small muted mt-2 mb-0">
            {lang === 'bn' ? 'ডেমো হোল্ডিং: ' : 'Demo holdings: '}
            {holdings.map((h) => h.holdingNo).join(' · ')}
          </p>
        </div>

        {results && results.length === 0 && (
          <div className="mt-2"><Alert tone="warn">{t('noResult')}</Alert></div>
        )}
        {results && results.map((h) => <HoldingResult key={h.holdingNo} h={h} />)}
      </Section>

      <Section alt title={t('calculator')} id="calculator">
        <Calculator />
      </Section>
    </>
  )
}
