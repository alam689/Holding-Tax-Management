// ---------------------------------------------------------------------------
// Roles and the permission matrix (Settings → Roles / Permissions).
//
// A permission is <resource>.<action>. Resources are the modules plus the
// administrative areas; actions follow the manual's row Actions.
// ---------------------------------------------------------------------------
import { MODULES } from './modules'

export const ACTIONS = [
  { key: 'view', label: { en: 'View', bn: 'দেখা' } },
  { key: 'create', label: { en: 'Create', bn: 'তৈরি' } },
  { key: 'edit', label: { en: 'Edit', bn: 'সম্পাদনা' } },
  { key: 'delete', label: { en: 'Delete', bn: 'মুছে ফেলা' } },
  { key: 'export', label: { en: 'Export', bn: 'রপ্তানি' } },
]

/** Every resource that can be permissioned. */
export const RESOURCES = [
  ...MODULES.map((m) => ({ key: m.key, label: m.title, group: m.group })),
  { key: 'dashboard', label: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, group: 'system' },
  { key: 'data-export', label: { en: 'Data Export', bn: 'ডেটা রপ্তানি' }, group: 'system' },
  { key: 'data-import', label: { en: 'Data Import', bn: 'ডেটা আমদানি' }, group: 'system' },
  { key: 'users', label: { en: 'Users', bn: 'ইউজার' }, group: 'system' },
  { key: 'roles', label: { en: 'Roles', bn: 'ভূমিকা' }, group: 'system' },
  { key: 'map', label: { en: 'View Map', bn: 'মানচিত্র' }, group: 'system' },
]

const all = (resources, actions) => {
  const out = {}
  resources.forEach((r) => { out[r] = [...actions] })
  return out
}

const everyResource = RESOURCES.map((r) => r.key)
const moduleKeys = MODULES.map((m) => m.key)
const fsmKeys = MODULES.filter((m) => m.group === 'fsm').map((m) => m.key)

export const seedRoles = [
  {
    key: 'admin',
    name: { en: 'System Administrator', bn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর' },
    description: { en: 'Unrestricted access to every module and setting.', bn: 'সকল মডিউল ও সেটিংসে সম্পূর্ণ প্রবেশাধিকার।' },
    tone: 'red',
    system: true,
    users: 1,
  },
  {
    key: 'revenue',
    name: { en: 'Revenue Officer', bn: 'রাজস্ব কর্মকর্তা' },
    description: { en: 'Building and tax records, exports and reports.', bn: 'ইমারত ও কর সংক্রান্ত রেকর্ড, রপ্তানি ও প্রতিবেদন।' },
    tone: 'green',
    system: false,
    users: 2,
  },
  {
    key: 'assessor',
    name: { en: 'Assessor', bn: 'কর নির্ধারক' },
    description: { en: 'Field assessment and survey verification.', bn: 'মাঠ মূল্যায়ন ও জরিপ যাচাই।' },
    tone: 'blue',
    system: false,
    users: 2,
  },
  {
    key: 'fsm-operator',
    name: { en: 'FSM Operator', bn: 'এফএসএম অপারেটর' },
    description: { en: 'Containments, applications, emptying and plant records.', bn: 'কনটেইনমেন্ট, আবেদন, খালি করা ও প্ল্যান্টের রেকর্ড।' },
    tone: 'amber',
    system: false,
    users: 0,
  },
  {
    key: 'operator',
    name: { en: 'Data Entry Operator', bn: 'ডাটা এন্ট্রি অপারেটর' },
    description: { en: 'Data capture only — no deletion or settings.', bn: 'শুধু তথ্য এন্ট্রি — মুছে ফেলা বা সেটিংস নয়।' },
    tone: 'grey',
    system: false,
    users: 3,
  },
]

export const seedPermissions = {
  admin: all(everyResource, ACTIONS.map((a) => a.key)),
  revenue: {
    ...all(['building-structures', 'building-surveys'], ['view', 'create', 'edit', 'export']),
    ...all(['roads', 'drains'], ['view', 'export']),
    ...all(fsmKeys, ['view']),
    dashboard: ['view'],
    'data-export': ['view', 'export'],
    map: ['view'],
  },
  assessor: {
    ...all(['building-structures'], ['view', 'edit']),
    ...all(['building-surveys'], ['view', 'create', 'edit']),
    ...all(['containments', 'containment-surveys'], ['view', 'create', 'edit']),
    dashboard: ['view'],
    map: ['view'],
  },
  'fsm-operator': {
    ...all(fsmKeys, ['view', 'create', 'edit', 'export']),
    dashboard: ['view'],
    'data-export': ['view', 'export'],
    map: ['view'],
  },
  operator: {
    ...all(moduleKeys, ['view', 'create']),
    dashboard: ['view'],
    map: ['view'],
  },
}

export const statusToneOf = (roleKey, roles) => roles.find((r) => r.key === roleKey)?.tone || 'grey'
