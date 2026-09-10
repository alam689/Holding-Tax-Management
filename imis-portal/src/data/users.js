// ---------------------------------------------------------------------------
// Demo user directory and role matrix for the IMIS back office.
// In production these come from the IMIS identity service; passwords would
// never live on the client.
// ---------------------------------------------------------------------------

export const ROLES = {
  admin: {
    key: 'admin',
    label: { en: 'System Administrator', bn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর' },
    tone: 'red',
    can: ['dashboard', 'users', 'profile', 'settings'],
  },
  revenue: {
    key: 'revenue',
    label: { en: 'Revenue Officer', bn: 'রাজস্ব কর্মকর্তা' },
    tone: 'green',
    can: ['dashboard', 'profile'],
  },
  assessor: {
    key: 'assessor',
    label: { en: 'Assessor', bn: 'কর নির্ধারক' },
    tone: 'blue',
    can: ['dashboard', 'profile'],
  },
  operator: {
    key: 'operator',
    label: { en: 'Data Entry Operator', bn: 'ডাটা এন্ট্রি অপারেটর' },
    tone: 'grey',
    can: ['dashboard', 'profile'],
  },
}

export const roleList = Object.values(ROLES)

// The demo password for every seeded account.
export const DEMO_PASSWORD = 'imis@2026'

export const seedUsers = [
  {
    id: 'USR-001',
    username: 'admin',
    password: DEMO_PASSWORD,
    name: { en: 'Md. Kamrul Hasan', bn: 'মোঃ কামরুল হাসান' },
    designation: { en: 'Chief Executive Officer', bn: 'প্রধান নির্বাহী কর্মকর্তা' },
    role: 'admin',
    section: { en: 'Administration', bn: 'প্রশাসন' },
    ward: null,
    email: 'ceo@khulnacity.gov.bd',
    phone: '01711-800001',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2026-09-07 09:12',
  },
  {
    id: 'USR-002',
    username: 'revenue',
    password: DEMO_PASSWORD,
    name: { en: 'Md. Ruhul Amin', bn: 'মোঃ রুহুল আমিন' },
    designation: { en: 'Chief Revenue Officer', bn: 'প্রধান রাজস্ব কর্মকর্তা' },
    role: 'revenue',
    section: { en: 'Revenue', bn: 'রাজস্ব' },
    ward: null,
    email: 'revenue@khulnacity.gov.bd',
    phone: '01711-800002',
    status: 'active',
    createdAt: '2024-02-02',
    lastLogin: '2026-09-06 16:40',
  },
  {
    id: 'USR-003',
    username: 'assessor',
    password: DEMO_PASSWORD,
    name: { en: 'Sultana Razia', bn: 'সুলতানা রাজিয়া' },
    designation: { en: 'Assessor, Zone 2', bn: 'কর নির্ধারক, জোন ২' },
    role: 'assessor',
    section: { en: 'Assessment', bn: 'মূল্যায়ন' },
    ward: 12,
    email: 'assessor2@khulnacity.gov.bd',
    phone: '01711-800003',
    status: 'active',
    createdAt: '2024-06-11',
    lastLogin: '2026-09-07 08:05',
  },
  {
    id: 'USR-004',
    username: 'operator1',
    password: DEMO_PASSWORD,
    name: { en: 'Md. Sohel Rana', bn: 'মোঃ সোহেল রানা' },
    designation: { en: 'Data Entry Operator', bn: 'ডাটা এন্ট্রি অপারেটর' },
    role: 'operator',
    section: { en: 'Revenue', bn: 'রাজস্ব' },
    ward: 6,
    email: 'operator1@khulnacity.gov.bd',
    phone: '01711-800004',
    status: 'active',
    createdAt: '2025-03-19',
    lastLogin: '2026-09-05 11:22',
  },
  {
    id: 'USR-005',
    username: 'operator2',
    password: DEMO_PASSWORD,
    name: { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' },
    designation: { en: 'Data Entry Operator', bn: 'ডাটা এন্ট্রি অপারেটর' },
    role: 'operator',
    section: { en: 'Licence', bn: 'লাইসেন্স' },
    ward: 18,
    email: 'operator2@khulnacity.gov.bd',
    phone: '01711-800005',
    status: 'inactive',
    createdAt: '2025-07-04',
    lastLogin: '2026-04-28 14:51',
  },
  {
    id: 'USR-006',
    username: 'assessor3',
    password: DEMO_PASSWORD,
    name: { en: 'Md. Ferdous Alam', bn: 'মোঃ ফেরদৌস আলম' },
    designation: { en: 'Assessor, Zone 3', bn: 'কর নির্ধারক, জোন ৩' },
    role: 'assessor',
    section: { en: 'Assessment', bn: 'মূল্যায়ন' },
    ward: 24,
    email: 'assessor3@khulnacity.gov.bd',
    phone: '01711-800006',
    status: 'active',
    createdAt: '2025-09-30',
    lastLogin: '2026-09-04 10:03',
  },
  {
    id: 'USR-007',
    username: 'licence',
    password: DEMO_PASSWORD,
    name: { en: 'Md. Zakir Hossain', bn: 'মোঃ জাকির হোসেন' },
    designation: { en: 'Licence Officer', bn: 'লাইসেন্স কর্মকর্তা' },
    role: 'revenue',
    section: { en: 'Licence', bn: 'লাইসেন্স' },
    ward: null,
    email: 'licence@khulnacity.gov.bd',
    phone: '01711-800007',
    status: 'active',
    createdAt: '2024-11-08',
    lastLogin: '2026-09-07 09:47',
  },
  {
    id: 'USR-008',
    username: 'operator3',
    password: DEMO_PASSWORD,
    name: { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
    designation: { en: 'Data Entry Operator', bn: 'ডাটা এন্ট্রি অপারেটর' },
    role: 'operator',
    section: { en: 'Assessment', bn: 'মূল্যায়ন' },
    ward: 3,
    email: 'operator3@khulnacity.gov.bd',
    phone: '01711-800008',
    status: 'suspended',
    createdAt: '2026-01-22',
    lastLogin: '2026-08-14 12:30',
  },
]

export const sections = [
  { value: 'Administration', label: { en: 'Administration', bn: 'প্রশাসন' } },
  { value: 'Revenue', label: { en: 'Revenue', bn: 'রাজস্ব' } },
  { value: 'Assessment', label: { en: 'Assessment', bn: 'মূল্যায়ন' } },
  { value: 'Licence', label: { en: 'Licence', bn: 'লাইসেন্স' } },
  { value: 'Engineering', label: { en: 'Engineering', bn: 'প্রকৌশল' } },
  { value: 'Conservancy', label: { en: 'Conservancy', bn: 'পরিচ্ছন্নতা' } },
  { value: 'Health', label: { en: 'Health', bn: 'স্বাস্থ্য' } },
]

export const statusMeta = {
  active: { tone: 'green', label: { en: 'Active', bn: 'সক্রিয়' } },
  inactive: { tone: 'grey', label: { en: 'Inactive', bn: 'নিষ্ক্রিয়' } },
  suspended: { tone: 'red', label: { en: 'Suspended', bn: 'স্থগিত' } },
}

// Recent activity shown on the profile page.
export const activityLog = [
  { at: '2026-09-07 09:12', en: 'Signed in from 103.108.x.x (Chrome, Windows)', bn: '103.108.x.x থেকে সাইন ইন (ক্রোম, উইন্ডোজ)' },
  { at: '2026-09-06 17:31', en: 'Approved trade licence application APP-2026-40218', bn: 'ট্রেড লাইসেন্স আবেদন APP-2026-40218 অনুমোদন' },
  { at: '2026-09-06 15:04', en: 'Generated the ward 12 holding tax demand register', bn: 'ওয়ার্ড ১২-এর হোল্ডিং ট্যাক্স ডিমান্ড রেজিস্টার তৈরি' },
  { at: '2026-09-05 11:48', en: 'Updated the assessment of holding 12-311-0044', bn: 'হোল্ডিং 12-311-0044-এর মূল্যায়ন হালনাগাদ' },
  { at: '2026-09-04 10:19', en: 'Changed the account password', bn: 'অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন' },
]
