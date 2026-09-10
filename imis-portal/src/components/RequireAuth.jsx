import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { Alert } from './ui'
import { Link } from 'react-router-dom'

/**
 * Route guard. Sends anonymous visitors to /login (remembering where they were
 * heading) and shows a clear refusal when the account lacks the permission.
 */
export default function RequireAuth({ perm, children }) {
  const { isAuthenticated, can } = useAuth()
  const { lang } = useLang()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (perm && !can(perm)) {
    return (
      <>
        <div className="page-bar"><h1>{lang === 'bn' ? 'প্রবেশাধিকার নেই' : 'Access denied'}</h1></div>
        <div className="panel panel-pad">
          <Alert tone="warn">
            🔒 {lang === 'bn'
              ? 'এই পৃষ্ঠাটি দেখার অনুমতি আপনার ভূমিকার নেই। প্রয়োজনে সিস্টেম অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।'
              : 'Your role does not have permission to view this page. Contact the system administrator if you need access.'}
          </Alert>
          <Link className="btn btn-primary" to="/admin">
            {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to dashboard'}
          </Link>
        </div>
      </>
    )
  }

  return children
}
