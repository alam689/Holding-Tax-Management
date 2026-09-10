import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dict } from '../data/dictionary'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('imis.lang') || 'en')

  useEffect(() => {
    localStorage.setItem('imis.lang', lang)
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en'
    document.body.classList.toggle('bn', lang === 'bn')
  }, [lang])

  const value = useMemo(() => {
    const t = (key) => {
      const entry = dict[key]
      if (!entry) return key
      return entry[lang] ?? entry.en ?? key
    }
    // pick a bilingual value out of an object like { en, bn }
    const p = (obj) => (obj ? obj[lang] ?? obj.en : '')
    // localise digits for Bangla
    const n = (value) => {
      const s = String(value)
      if (lang !== 'bn') return s
      const bn = '০১২৩৪৫৬৭৮৯'
      return s.replace(/[0-9]/g, (d) => bn[+d])
    }
    const money = (amount) => `৳ ${n(Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 }))}`
    return { lang, setLang, toggle: () => setLang((l) => (l === 'en' ? 'bn' : 'en')), t, p, n, money }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
