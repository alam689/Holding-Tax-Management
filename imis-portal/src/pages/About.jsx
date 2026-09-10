import { useLang } from '../context/LangContext'
import { PageHead, Section, CountUp } from '../components/ui'
import { stats, modules } from '../data/mockData'

export default function About() {
  const { t, p, n, lang } = useLang()

  const history = [
    { y: 1884, en: 'Khulna Municipality constituted under the Bengal Municipal Act.', bn: 'বেঙ্গল মিউনিসিপ্যাল অ্যাক্টের আওতায় খুলনা পৌরসভা গঠিত।' },
    { y: 1984, en: 'Elevated to Khulna Municipal Corporation.', bn: 'খুলনা মিউনিসিপ্যাল কর্পোরেশনে উন্নীত।' },
    { y: 1990, en: 'Renamed Khulna City Corporation; 31 wards delimited.', bn: 'খুলনা সিটি কর্পোরেশন নামকরণ; ৩১টি ওয়ার্ডে বিভক্ত।' },
    { y: 2019, en: 'Holding tax register digitised under the Municipal Governance project.', bn: 'পৌর সুশাসন প্রকল্পের আওতায় হোল্ডিং ট্যাক্স রেজিস্টার ডিজিটালকরণ।' },
    { y: 2024, en: 'IMIS rolled out across all administrative sections.', bn: 'সকল প্রশাসনিক শাখায় আইএমআইএস চালু।' },
    { y: 2026, en: 'Citizen-facing public portal launched with online payment.', bn: 'অনলাইন পেমেন্টসহ নাগরিক পোর্টাল উদ্বোধন।' },
  ]

  return (
    <>
      <PageHead
        title={`${t('navAbout')} — ${t('orgName')}`}
        subtitle={lang === 'bn'
          ? 'বাংলাদেশের তৃতীয় বৃহত্তম নগরী এবং খুলনা বিভাগের প্রশাসনিক কেন্দ্র।'
          : 'Bangladesh’s third largest city and the administrative centre of Khulna Division.'}
        crumbs={[{ label: t('navAbout') }]}
      />

      <Section>
        <div className="grid grid-2">
          <div className="card">
            <h3>{lang === 'bn' ? 'পরিচিতি' : 'Overview'}</h3>
            <p>
              {lang === 'bn'
                ? 'খুলনা সিটি কর্পোরেশন স্থানীয় সরকার (সিটি কর্পোরেশন) আইন, ২০০৯ অনুযায়ী পরিচালিত। ৩১টি সাধারণ ওয়ার্ড ও ১০টি সংরক্ষিত মহিলা আসন নিয়ে গঠিত পরিষদ ৪৫.৬৫ বর্গকিলোমিটার এলাকার সড়ক, ড্রেনেজ, পানি সরবরাহ, বর্জ্য ব্যবস্থাপনা, সড়কবাতি, জন্ম-মৃত্যু নিবন্ধন ও ট্রেড লাইসেন্স সেবা প্রদান করে।'
                : 'Khulna City Corporation operates under the Local Government (City Corporation) Act, 2009. Its council — 31 general wards and 10 reserved seats for women — delivers roads, drainage, water supply, waste management, street lighting, birth and death registration and trade licensing across 45.65 square kilometres.'}
            </p>
            <p className="mb-0">
              {lang === 'bn'
                ? 'সিটি কর্পোরেশনের নিজস্ব রাজস্বের প্রধান উৎস হোল্ডিং ট্যাক্স, যা বার্ষিক মূল্যায়নের ভিত্তিতে নির্ধারিত এবং পঞ্চবার্ষিক পুনঃমূল্যায়নের মাধ্যমে হালনাগাদ করা হয়।'
                : 'Holding tax is the principal source of own-source revenue. It is levied on the annual value of each holding and refreshed through a quinquennial re-assessment.'}
            </p>
          </div>

          <div className="card">
            <h3>{lang === 'bn' ? 'ভিশন ও মিশন' : 'Vision & Mission'}</h3>
            <p>
              <strong>{lang === 'bn' ? 'ভিশন: ' : 'Vision: '}</strong>
              {lang === 'bn'
                ? 'একটি পরিকল্পিত, পরিচ্ছন্ন ও নাগরিকবান্ধব নগরী।'
                : 'A planned, clean and citizen-friendly city.'}
            </p>
            <p className="mb-0">
              <strong>{lang === 'bn' ? 'মিশন: ' : 'Mission: '}</strong>
              {lang === 'bn'
                ? 'স্বচ্ছ ও জবাবদিহিমূলক ব্যবস্থাপনার মাধ্যমে সময়াবদ্ধ, হয়রানিমুক্ত ও ডিজিটাল সেবা নিশ্চিত করা।'
                : 'To deliver time-bound, hassle-free and digital services through transparent and accountable administration.'}
            </p>
          </div>
        </div>
      </Section>

      <Section alt title={t('ataGlance')}>
        <div className="grid grid-3">
          {stats.map((s) => (
            <div className="stat" key={s.key}>
              <div className="ico" aria-hidden="true">{s.icon}</div>
              <div className="num"><CountUp value={s.value} suffix={s.suffix || ''} /></div>
              <div className="lbl">{p(s.label)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={lang === 'bn' ? 'আইএমআইএস মডিউলসমূহ' : 'IMIS Modules'}
        subtitle={lang === 'bn'
          ? 'একটি অভিন্ন ডাটাবেসে সংযুক্ত দশটি মডিউল — এই পোর্টালে নাগরিকমুখী অংশটুকু উন্মুক্ত।'
          : 'Ten modules on a single shared database — this portal exposes the citizen-facing surface of them.'}>
        <div className="grid grid-4">
          {modules.map((m, i) => (
            <div className="card" key={i} style={{ padding: '.8rem 1rem' }}>
              <span className="badge badge-green">{n(String(i + 1).padStart(2, '0'))}</span>
              <div style={{ fontWeight: 600, marginTop: '.35rem' }}>{p(m)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title={lang === 'bn' ? 'ইতিহাস' : 'Milestones'}>
        <ul className="timeline">
          {history.map((h) => (
            <li key={h.y}>
              <span className="when">{n(h.y)}</span>
              {lang === 'bn' ? h.bn : h.en}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
