import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import RequireAuth from './components/RequireAuth'
import DataModule from './components/DataModule'
import Home from './pages/Home'
import About from './pages/About'
import { ServiceList, ServiceDetail } from './pages/Services'
import HoldingTax from './pages/HoldingTax'
import Payment from './pages/Payment'
import { NoticeList, NoticeDetail } from './pages/Notices'
import Tenders from './pages/Tenders'
import Grievance from './pages/Grievance'
import Councillors from './pages/Councillors'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/admin/Profile'
import Users from './pages/admin/Users'
import Roles from './pages/admin/Roles'
import Permissions from './pages/admin/Permissions'
import DataExport from './pages/admin/DataExport'
import DataImport from './pages/admin/DataImport'
import ViewMap from './pages/admin/ViewMap'
import Placeholder from './pages/admin/Placeholder'
import { MODULES } from './data/modules'

export default function App() {
  return (
    <Routes>
      {/* ---------- public portal ---------- */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="holding-tax" element={<HoldingTax />} />
        <Route path="payment" element={<Payment />} />
        <Route path="notices" element={<NoticeList />} />
        <Route path="notices/:id" element={<NoticeDetail />} />
        <Route path="tenders" element={<Tenders />} />
        <Route path="grievance" element={<Grievance />} />
        <Route path="councillors" element={<Councillors />} />
        <Route path="contact" element={<Contact />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---------- authentication ---------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------- back office ---------- */}
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />

        {/* Building / Utility / FSM information management */}
        {MODULES.map((m) => (
          <Route key={m.key} path={m.path.replace('/admin/', '')} element={<DataModule mod={m} />} />
        ))}

        <Route path="data-export" element={<DataExport />} />
        <Route path="data-import" element={<DataImport />} />

        <Route path="settings/users" element={<RequireAuth perm="users"><Users /></RequireAuth>} />
        <Route path="settings/roles" element={<RequireAuth perm="users"><Roles /></RequireAuth>} />
        <Route path="settings/permissions" element={<RequireAuth perm="users"><Permissions /></RequireAuth>} />
        <Route path="profile" element={<Profile />} />
        <Route path="map" element={<ViewMap />} />

        {/* legacy paths from the earlier build */}
        <Route path="users" element={<Navigate to="/admin/settings/users" replace />} />
        <Route path="settings" element={<Navigate to="/admin/settings/users" replace />} />

        <Route path="*" element={<Placeholder title="Not found" />} />
      </Route>
    </Routes>
  )
}
