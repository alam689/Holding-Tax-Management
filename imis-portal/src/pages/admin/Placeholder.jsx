import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { Alert } from '../../components/ui'

/** Stand-in for the back-office modules that are outside this build's scope. */
export default function Placeholder({ title, note }) {
  const { lang } = useLang()
  const { pathname } = useLocation()
  return (
    <>
      <div className="page-bar"><h1>{title}</h1></div>
      <div className="panel panel-pad center" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '2.6rem' }}>🚧</div>
        <h3>{lang === 'bn' ? 'মডিউলটি এই ডেমোর অন্তর্ভুক্ত নয়' : 'This module is not part of the demo'}</h3>
        <p className="muted">
          {note || (lang === 'bn'
            ? 'ড্যাশবোর্ড, প্রোফাইল ও ইউজার ব্যবস্থাপনা সম্পূর্ণভাবে তৈরি করা হয়েছে। এই রুটটি নেভিগেশনের কাঠামো দেখানোর জন্য রাখা হয়েছে।'
            : 'The dashboard, profile and user management screens are fully built. This route exists to show where the remaining modules attach.')}
        </p>
        <code className="small muted">{pathname}</code>
        <div className="flex mt-2" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/admin">{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</Link>
          <Link className="btn btn-outline" to="/admin/users">{lang === 'bn' ? 'ইউজার ব্যবস্থাপনা' : 'User Management'}</Link>
        </div>
      </div>
      <Alert tone="info">
        {lang === 'bn'
          ? 'প্রকৃত বাস্তবায়নে প্রতিটি মডিউল আইএমআইএস কোর এপিআই থেকে ডেটা নেবে।'
          : 'In the real implementation each module is backed by the IMIS core API.'}
      </Alert>
    </>
  )
}
