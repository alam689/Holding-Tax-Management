# IMIS — Khulna City Corporation

Public portal **and** back office for an **Integrated Municipal Information System (IMIS)**, built as
a React single-page application. Frontend only — every record is served from local sample data in
`src/data/`, so the whole thing runs with no backend.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` produces a static bundle in `dist/`.

## Sign in

Officer login is at `/login` (or the **Officer login** button in the public header).

| Username | Role | Sees |
| --- | --- | --- |
| `admin` | System Administrator | Everything, including User Management and Settings |
| `revenue` | Revenue Officer | Dashboard, profile |
| `assessor` | Assessor | Dashboard, profile |
| `operator1` | Data Entry Operator | Dashboard, profile |

Password for every demo account: `imis@2026`

## Public portal

| Route | Screen |
| --- | --- |
| `/` | Home — hero search, service catalogue, statistics, notices, tenders, process steps, mayor's message |
| `/about` | Overview, vision & mission, IMIS modules, milestones |
| `/services`, `/services/:slug` | Service catalogue and per-service detail with an application form |
| `/holding-tax` | Holding tax enquiry, assessment sheet, payment ledger, tax calculator |
| `/payment` | Online bill payment with rebate/service charge and a printable money receipt |
| `/notices`, `/notices/:id` | Notice board and notice detail |
| `/tenders` | Procurement notices with open/closed filter and deadline countdown |
| `/grievance` | Lodge a complaint and track one through its timeline |
| `/councillors` | 31 ward councillors, 10 reserved seats, and the officers |
| `/contact` | Address, section contacts, contact form |

## Back office

The sidebar follows the IMIS Web App user manual section for section.

| Route | Screen |
| --- | --- |
| `/login` | Sign in — validation, show/hide password, "keep me signed in", inactive/suspended handling, click-to-fill demo accounts |
| `/admin` | **Dashboard** — 6 KPI tiles with sparklines, 8 collapsible chart panels |
| `/admin/building/*` | **Building Information Management** — Building Structures, Building Surveys |
| `/admin/utility/*` | **Utility Information Management** — Roads, Drains |
| `/admin/fsm/*` | **FSM Information Management** — Containments, Containment Surveys, Applications, Emptying Service History, Next Emptying Info, Transfer Stations, Treatment Plants, Service Providers, Compost Sales, Sludge Collection, Help Desks |
| `/admin/data-export` | **Data Export** — pick modules, CSV (one file each) or JSON (single file), date window, row-count summary |
| `/admin/data-import` | **Data Import** — CSV upload, auto column mapping, per-row validation with a preview, commit only the valid rows |
| `/admin/settings/users` | **Users** — search, role/status filters, create, edit, activate/deactivate, delete |
| `/admin/settings/roles` | **Roles** — role CRUD; system roles and roles still in use are protected |
| `/admin/settings/permissions` | **Permissions** — resource × action matrix per role, with row/column/grant-all toggles |
| `/admin/profile` | **My Profile** — details, password change with a strength meter, activity log |
| `/admin/map` | **View Map** — Layers tab and Tools tab, including **Find Nearest Road** and **Find Tax Due Buildings** |

### The list-screen engine

Every one of the 15 list modules is one declarative entry in `src/data/modules.js`
(columns, filters, seeded sample rows) rendered by a single `<DataModule>`, which supplies the
manual's three-part pattern:

- **Filters** — free-text search across all columns, plus per-column controls chosen by type:
  exact match for selects and wards, minimum for numbers and money, "from" for dates, contains for text.
- **Actions** — row level: View (detail modal), Edit (generated form with validation), Delete
  (with confirmation). Plus New record, and multi-select with bulk delete.
- **Tools** — export all or selected rows to CSV, print the table, show/hide any column,
  restore the sample data.

Sortable columns, page sizes of 10/25/50, and full pagination come with it.

**Access control.** `RequireAuth` redirects anonymous visitors to `/login` remembering where they
were headed, and shows an explicit *Access denied* page when a role lacks a permission. The sidebar
only renders items the signed-in role can reach — an operator sees no Users/Roles/Permissions — and
no user can delete or deactivate their own account.

**Session.** "Keep me signed in" stores the session in `localStorage`, otherwise `sessionStorage`.
The user directory is persisted in `localStorage`, so users you create survive a reload — the
**Reset demo data** button restores the seed.

## Features

- **Full English / Bangla interface** across both the portal and the back office. Every string, date
  and numeral switches, including Bengali digits (৳ ৯,২৮০ · ২৪ আগস্ট ২০২৬). The choice persists.
- **Charts with no charting library.** `src/components/charts.jsx` hand-rolls the SVG: bar, donut,
  stacked/grouped series and sparkline, each with hover states and native tooltips.
- **Working holding tax calculator.** Holding 7% + conservancy 2% + lighting 2% + water 1.5% of the
  annual value, adjusted by a use-type factor, with the 5% early-payment rebate.
- **Simulated payment flow** with validation, rebate, 1.2% PSP charge and a printable money receipt.
- **Print stylesheets** for both areas — chrome drops away so receipts and dashboards print cleanly.
- **Accessible by default** — skip link, labelled fields, `aria-invalid`, `aria-expanded` menus,
  Escape/click-away on popovers, and a `prefers-reduced-motion` guard.
- Responsive from 320px; the admin sidebar collapses to icons on desktop and to a drawer on mobile.

## Sample data to try

- Holdings: `03-142-0087`, `06-078-0219`, `12-311-0044`, `18-005-0301`
- Complaints: `GRV-2026-00817`, `GRV-2026-00755`, `GRV-2026-00902`
- Notices: `NTC-2026-041` … `NTC-2026-025`

## Structure

```
src/
  main.jsx              entry — language + auth providers, router
  App.jsx               route table (public, auth, back office)
  context/
    LangContext.jsx     language state, t() / p() / n() / money() helpers
    AuthContext.jsx     sign-in, session, and the user directory (CRUD)
  context/DataContext   module record store (CRUD + import), roles, permissions
  data/
    dictionary.js       bilingual UI strings
    mockData.js         services, holdings, notices, tenders, councillors, complaints
    users.js            demo accounts, roles, permissions, sections
    modules.js          the 15 list modules — columns, filters, seeded rows
    roles.js            role list, resources, actions, seeded permission matrix
  components/
    Layout.jsx          public chrome — top bar, masthead, nav, ticker, footer
    AdminLayout.jsx     admin shell — collapsible sidebar, topbar, user menu
    adminNav.js         the sidebar tree (mirrors the user manual)
    DataModule.jsx      the generic list screen: Filters, Actions, Tools
    RequireAuth.jsx     route guard (authentication + permission)
    charts.jsx          SVG bar / donut / series / sparkline
    ui.jsx              PageHead, Section, CountUp, Field, Alert, badges, dates
  pages/                one file per public screen
  pages/admin/          Dashboard, Profile, Users, Roles, Permissions,
                        DataExport, DataImport, ViewMap, Placeholder
  styles/app.css        public portal
  styles/admin.css      login and back office
```

## Notes

This is a demonstration build. Authentication runs entirely in the browser, passwords live in
`src/data/users.js` as sample data, the payment gateway is simulated, and no card, PIN or credential
is ever requested or transmitted. Wiring it to a real IMIS means replacing the imports from
`src/data/` with API calls and moving authentication to the identity service — the components
already consume the final data shapes.
