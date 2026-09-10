import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { PageHead, Section, Field, Alert } from '../components/ui'
import { billTypes, paymentChannels } from '../data/mockData'

const REBATE_PCT = 5

export default function Payment() {
  const { t, p, n, money, lang } = useLang()
  const [params] = useSearchParams()

  const [form, setForm] = useState({
    type: params.get('type') || 'holding',
    ref: params.get('ref') || '',
    amount: params.get('amount') || '',
    mobile: '',
    email: '',
    channel: 'bkash',
    rebate: true,
  })
  const [errors, setErrors] = useState({})
  const [receipt, setReceipt] = useState(null)
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const gross = Number(form.amount) || 0
  const discount = form.type === 'holding' && form.rebate ? (gross * REBATE_PCT) / 100 : 0
  const serviceCharge = Math.round((gross - discount) * 0.012) // 1.2% PSP charge
  const payable = Math.max(0, gross - discount + serviceCharge)

  const validate = () => {
    const e = {}
    if (!form.ref.trim()) e.ref = t('required')
    if (!gross || gross <= 0) e.amount = lang === 'bn' ? 'সঠিক পরিমাণ দিন।' : 'Enter a valid amount.'
    if (!/^01[3-9]\d{8}$/.test(form.mobile.replace(/[-\s]/g, ''))) {
      e.mobile = lang === 'bn' ? '১১ ডিজিটের বৈধ মোবাইল নম্বর দিন।' : 'Enter a valid 11-digit mobile number.'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = lang === 'bn' ? 'সঠিক ইমেইল দিন।' : 'Enter a valid email address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    // Simulated payment-gateway round trip.
    setTimeout(() => {
      const bill = billTypes.find((b) => b.value === form.type)
      const ch = paymentChannels.find((c) => c.value === form.channel)
      setReceipt({
        trxId: `IMIS${Date.now().toString().slice(-10)}`,
        receiptNo: `MR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`,
        at: new Date(),
        billLabel: bill ? p(bill.label) : form.type,
        channelLabel: typeof ch?.label === 'string' ? ch.label : p(ch?.label),
        ref: form.ref,
        gross, discount, serviceCharge, payable,
        mobile: form.mobile,
      })
      setBusy(false)
    }, 900)
  }

  if (receipt) return <ReceiptView receipt={receipt} onNew={() => setReceipt(null)} />

  return (
    <>
      <PageHead
        title={t('paymentTitle')}
        subtitle={lang === 'bn'
          ? 'বিকাশ, নগদ, রকেট, কার্ড অথবা ইন্টারনেট ব্যাংকিংয়ের মাধ্যমে সিটি কর্পোরেশনের বিল পরিশোধ করুন এবং তাৎক্ষণিক রসিদ নিন।'
          : 'Settle City Corporation bills through bKash, Nagad, Rocket, card or internet banking and download the receipt instantly.'}
        crumbs={[{ label: t('navPayment') }]}
      />

      <Section>
        <div className="grid grid-2">
          <form className="card" onSubmit={submit} noValidate>
            <h3>{t('selectBillType')}</h3>
            <div className="radio-cards mb-2">
              {billTypes.map((b) => (
                <label key={b.value} className={`radio-card ${form.type === b.value ? 'sel' : ''}`}>
                  <input type="radio" name="type" value={b.value}
                    checked={form.type === b.value} onChange={set('type')} />
                  {p(b.label)}
                </label>
              ))}
            </div>

            <Field label={lang === 'bn' ? 'হোল্ডিং / বিল / লাইসেন্স নম্বর' : 'Holding / Bill / Licence number'}
              htmlFor="ref" error={errors.ref}>
              <input id="ref" type="text" value={form.ref} onChange={set('ref')}
                aria-invalid={Boolean(errors.ref)} placeholder="03-142-0087" />
            </Field>

            <div className="form-row">
              <Field label={`${t('amount')} (৳)`} htmlFor="amt" error={errors.amount}>
                <input id="amt" type="number" min="1" value={form.amount} onChange={set('amount')}
                  aria-invalid={Boolean(errors.amount)} />
              </Field>
              <Field label={t('mobile')} htmlFor="mob" error={errors.mobile}
                hint={lang === 'bn' ? 'রসিদ এসএমএসে পাঠানো হবে।' : 'The receipt is sent here by SMS.'}>
                <input id="mob" type="tel" value={form.mobile} onChange={set('mobile')}
                  aria-invalid={Boolean(errors.mobile)} placeholder="01XXXXXXXXX" />
              </Field>
            </div>

            <Field label={`${t('email')} (${t('optional')})`} htmlFor="eml" error={errors.email}>
              <input id="eml" type="email" value={form.email} onChange={set('email')}
                aria-invalid={Boolean(errors.email)} />
            </Field>

            {form.type === 'holding' && (
              <label className="flex small mb-2" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={form.rebate} onChange={set('rebate')} />
                {lang === 'bn' ? `আগাম পরিশোধে ${n(REBATE_PCT)}% রেয়াত` : `Apply the ${REBATE_PCT}% early-payment rebate`}
              </label>
            )}

            <fieldset>
              <legend>{lang === 'bn' ? 'পেমেন্ট চ্যানেল' : 'Payment channel'}</legend>
              <div className="radio-cards">
                {paymentChannels.map((c) => (
                  <label key={c.value} className={`radio-card ${form.channel === c.value ? 'sel' : ''}`}>
                    <input type="radio" name="channel" value={c.value}
                      checked={form.channel === c.value} onChange={set('channel')} />
                    <span aria-hidden="true">{c.icon}</span>
                    {typeof c.label === 'string' ? c.label : p(c.label)}
                  </label>
                ))}
              </div>
            </fieldset>

            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? t('loading') : `${t('proceed')} →`}
            </button>
          </form>

          <div>
            <div className="card">
              <h3>{lang === 'bn' ? 'পরিশোধের সারসংক্ষেপ' : 'Payment summary'}</h3>
              <dl className="kv">
                <dt>{lang === 'bn' ? 'বিলের ধরন' : 'Bill type'}</dt>
                <dd>{p(billTypes.find((b) => b.value === form.type)?.label || {})}</dd>
                <dt>{lang === 'bn' ? 'রেফারেন্স' : 'Reference'}</dt>
                <dd>{form.ref || '—'}</dd>
                <dt>{lang === 'bn' ? 'বিলের পরিমাণ' : 'Bill amount'}</dt>
                <dd>{money(gross)}</dd>
                {discount > 0 && (<>
                  <dt>{lang === 'bn' ? 'রেয়াত' : 'Rebate'}</dt>
                  <dd style={{ color: '#0f7b41' }}>− {money(discount)}</dd>
                </>)}
                <dt>{lang === 'bn' ? 'সার্ভিস চার্জ (১.২%)' : 'Service charge (1.2%)'}</dt>
                <dd>{money(serviceCharge)}</dd>
              </dl>
              <div className="receipt total" style={{ border: 0, borderTop: '2px solid var(--line)' }}>
                <span>{lang === 'bn' ? 'সর্বমোট' : 'Total payable'}</span>
                <span>{money(payable)}</span>
              </div>
            </div>

            <div className="mt-2">
              <Alert tone="info">
                {lang === 'bn'
                  ? 'এটি একটি ডেমো গেটওয়ে — কোনো প্রকৃত লেনদেন সম্পন্ন হবে না এবং কোনো কার্ড বা পিন তথ্য চাওয়া হয় না।'
                  : 'This is a demonstration gateway — no real transaction takes place and no card or PIN details are requested.'}
              </Alert>
              <p className="small muted">
                {lang === 'bn'
                  ? 'বকেয়া জানতে প্রথমে হোল্ডিং ট্যাক্স অনুসন্ধান করুন।'
                  : 'Not sure of your dues? Look them up first.'}{' '}
                <Link to="/holding-tax">{t('holdingSearch')} →</Link>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

function ReceiptView({ receipt: r, onNew }) {
  const { t, n, money, lang } = useLang()
  return (
    <>
      <PageHead title={lang === 'bn' ? 'পরিশোধ সফল' : 'Payment successful'}
        crumbs={[{ label: t('navPayment'), to: '/payment' }, { label: lang === 'bn' ? 'রসিদ' : 'Receipt' }]} />
      <Section>
        <Alert tone="ok">
          ✅ {lang === 'bn'
            ? `লেনদেন সফল হয়েছে। রসিদ ${r.mobile} নম্বরে এসএমএসে পাঠানো হয়েছে।`
            : `Transaction completed. The receipt has been sent by SMS to ${r.mobile}.`}
        </Alert>

        <div className="receipt">
          <div className="rhead">
            <strong>{t('orgName')}</strong>
            <div className="small muted">{t('imis')} · {lang === 'bn' ? 'অর্থ পরিশোধ রসিদ' : 'Money Receipt'}</div>
          </div>
          <dl className="kv">
            <dt>{lang === 'bn' ? 'রসিদ নং' : 'Receipt no.'}</dt><dd>{r.receiptNo}</dd>
            <dt>{lang === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</dt><dd>{r.trxId}</dd>
            <dt>{t('date')}</dt><dd>{r.at.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</dd>
            <dt>{lang === 'bn' ? 'বিলের ধরন' : 'Bill type'}</dt><dd>{r.billLabel}</dd>
            <dt>{lang === 'bn' ? 'রেফারেন্স' : 'Reference'}</dt><dd>{r.ref}</dd>
            <dt>{lang === 'bn' ? 'চ্যানেল' : 'Channel'}</dt><dd>{r.channelLabel}</dd>
            <dt>{lang === 'bn' ? 'বিলের পরিমাণ' : 'Bill amount'}</dt><dd>{money(r.gross)}</dd>
            {r.discount > 0 && (<><dt>{lang === 'bn' ? 'রেয়াত' : 'Rebate'}</dt><dd>− {money(r.discount)}</dd></>)}
            <dt>{lang === 'bn' ? 'সার্ভিস চার্জ' : 'Service charge'}</dt><dd>{money(r.serviceCharge)}</dd>
          </dl>
          <div className="total">
            <span>{lang === 'bn' ? 'পরিশোধিত' : 'Amount paid'}</span>
            <span>{money(r.payable)}</span>
          </div>
          <p className="small muted center mt-2 mb-0">
            {lang === 'bn'
              ? 'কম্পিউটার-উৎপাদিত রসিদ, স্বাক্ষরের প্রয়োজন নেই।'
              : 'Computer-generated receipt — no signature required.'}
          </p>
        </div>

        <div className="form-actions mt-2 no-print">
          <button className="btn btn-primary" onClick={() => window.print()}>🖨 {t('print')}</button>
          <button className="btn btn-outline" onClick={onNew}>
            {lang === 'bn' ? 'আরেকটি বিল পরিশোধ' : 'Pay another bill'}
          </button>
          <Link className="btn btn-outline" to="/">{t('navHome')}</Link>
        </div>
      </Section>
    </>
  )
}
