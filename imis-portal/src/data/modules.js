// ---------------------------------------------------------------------------
// Module registry for the IMIS back office.
//
// Every list screen in the user manual follows the same shape — Filters,
// Actions and Tools over a table — so each module is described declaratively
// here and rendered by <DataModule>. Columns drive the table, the record form
// and the detail view; `filters` names the columns that get a filter control.
// ---------------------------------------------------------------------------

// Deterministic PRNG so the sample data is stable between reloads.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length)]
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1))
const dec = (r, a, b, d = 1) => +(a + r() * (b - a)).toFixed(d)
const pad = (n, w = 4) => String(n).padStart(w, '0')

const WARD_COUNT = 31
const date = (r, startDays, endDays) => {
  const base = new Date('2026-09-07').getTime()
  const d = new Date(base - int(r, startDays, endDays) * 86400000)
  return d.toISOString().slice(0, 10)
}

export const MOHALLAS = [
  { en: 'Sonadanga A Block', bn: 'সোনাডাঙ্গা এ ব্লক' },
  { en: 'Nirala Residential', bn: 'নিরালা আবাসিক' },
  { en: 'Boyra Bazar', bn: 'বয়রা বাজার' },
  { en: 'Khalishpur Housing', bn: 'খালিশপুর হাউজিং' },
  { en: 'Daulatpur Bazar', bn: 'দৌলতপুর বাজার' },
  { en: 'Khan Jahan Ali Road', bn: 'খান জাহান আলী রোড' },
  { en: 'Tutpara Central Road', bn: 'টুটপাড়া সেন্ট্রাল রোড' },
  { en: 'Boro Bazar', bn: 'বড় বাজার' },
  { en: 'Rupsha Stand Road', bn: 'রূপসা স্ট্যান্ড রোড' },
  { en: 'Gollamari', bn: 'গল্লামারী' },
  { en: 'Mujgunni', bn: 'মুজগুন্নী' },
  { en: 'Labanchara', bn: 'লবণচরা' },
]

const NAMES = [
  { en: 'Md. Abdul Motaleb', bn: 'মোঃ আব্দুল মোতালেব' },
  { en: 'Sultana Razia', bn: 'সুলতানা রাজিয়া' },
  { en: 'Md. Shahjahan Ali', bn: 'মোঃ শাহজাহান আলী' },
  { en: 'Rupsha Traders', bn: 'রূপসা ট্রেডার্স' },
  { en: 'Md. Habibur Rahman', bn: 'মোঃ হাবিবুর রহমান' },
  { en: 'Nasima Begum', bn: 'নাসিমা বেগম' },
  { en: 'Md. Ferdous Alam', bn: 'মোঃ ফেরদৌস আলম' },
  { en: 'Sheikh Mizanur Rahman', bn: 'শেখ মিজানুর রহমান' },
  { en: 'Ayesha Siddika', bn: 'আয়েশা সিদ্দিকা' },
  { en: 'Md. Zakir Hossain', bn: 'মোঃ জাকির হোসেন' },
]

const SURVEYORS = [
  { en: 'Md. Sohel Rana', bn: 'মোঃ সোহেল রানা' },
  { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' },
  { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
  { en: 'Md. Ruhul Amin', bn: 'মোঃ রুহুল আমিন' },
]

const PROVIDERS = [
  { en: 'KCC Conservancy Fleet', bn: 'কেসিসি পরিচ্ছন্নতা বহর' },
  { en: 'Rupsha Vacutug Services', bn: 'রূপসা ভ্যাকুট্যাগ সার্ভিসেস' },
  { en: 'Khalishpur Sanitation Co.', bn: 'খালিশপুর স্যানিটেশন কোং' },
  { en: 'Daulatpur Cleaners', bn: 'দৌলতপুর ক্লিনার্স' },
]

// --- option lists (each option is {value, label:{en,bn}, tone?}) ------------
const opt = (value, en, bn, tone) => ({ value, label: { en, bn }, tone })

const USE_TYPES = [
  opt('residential', 'Residential', 'আবাসিক'),
  opt('commercial', 'Commercial', 'বাণিজ্যিক'),
  opt('mixed', 'Mixed', 'মিশ্র'),
  opt('industrial', 'Industrial', 'শিল্প'),
  opt('institutional', 'Institutional', 'প্রাতিষ্ঠানিক'),
]

const STRUCTURE_STATUS = [
  opt('active', 'Active', 'সক্রিয়', 'green'),
  opt('under-construction', 'Under construction', 'নির্মাণাধীন', 'amber'),
  opt('abandoned', 'Abandoned', 'পরিত্যক্ত', 'grey'),
]

const SURVEY_STATUS = [
  opt('draft', 'Draft', 'খসড়া', 'grey'),
  opt('submitted', 'Submitted', 'দাখিলকৃত', 'blue'),
  opt('verified', 'Verified', 'যাচাইকৃত', 'green'),
  opt('rejected', 'Rejected', 'প্রত্যাখ্যাত', 'red'),
]

const CONDITION = [
  opt('good', 'Good', 'ভালো', 'green'),
  opt('fair', 'Fair', 'মোটামুটি', 'amber'),
  opt('poor', 'Poor', 'খারাপ', 'red'),
]

const CONTAINMENT_TYPES = [
  opt('septic', 'Septic tank', 'সেপটিক ট্যাংক'),
  opt('pit', 'Pit latrine', 'পিট ল্যাট্রিন'),
  opt('twin-pit', 'Twin pit', 'টুইন পিট'),
  opt('open', 'Open discharge', 'উন্মুক্ত নিষ্কাশন'),
]

const ACCESSIBILITY = [
  opt('easy', 'Easy', 'সহজ', 'green'),
  opt('moderate', 'Moderate', 'মাঝারি', 'amber'),
  opt('difficult', 'Difficult', 'কঠিন', 'red'),
]

const APP_STATUS = [
  opt('pending', 'Pending', 'অপেক্ষমাণ', 'amber'),
  opt('assigned', 'Assigned', 'নিয়োজিত', 'blue'),
  opt('completed', 'Completed', 'সম্পন্ন', 'green'),
  opt('cancelled', 'Cancelled', 'বাতিল', 'red'),
]

const PRIORITY = [
  opt('overdue', 'Overdue', 'মেয়াদোত্তীর্ণ', 'red'),
  opt('due-soon', 'Due soon', 'শীঘ্রই দেয়', 'amber'),
  opt('scheduled', 'Scheduled', 'নির্ধারিত', 'green'),
]

const OPERATIONAL = [
  opt('operational', 'Operational', 'চালু', 'green'),
  opt('maintenance', 'Under maintenance', 'রক্ষণাবেক্ষণে', 'amber'),
  opt('closed', 'Closed', 'বন্ধ', 'grey'),
]

const PAY_STATUS = [
  opt('paid', 'Paid', 'পরিশোধিত', 'green'),
  opt('due', 'Due', 'বকেয়া', 'red'),
  opt('partial', 'Partial', 'আংশিক', 'amber'),
]

const TICKET_STATUS = [
  opt('open', 'Open', 'চলমান', 'amber'),
  opt('in-progress', 'In progress', 'প্রক্রিয়াধীন', 'blue'),
  opt('resolved', 'Resolved', 'নিষ্পত্তি', 'green'),
  opt('closed', 'Closed', 'সমাপ্ত', 'grey'),
]

const TICKET_CATEGORY = [
  opt('emptying', 'Emptying request', 'খালি করার অনুরোধ'),
  opt('overflow', 'Containment overflow', 'কনটেইনমেন্ট উপচে পড়া'),
  opt('billing', 'Billing / fee', 'বিল / ফি'),
  opt('road', 'Road & drain', 'সড়ক ও ড্রেন'),
  opt('other', 'Other', 'অন্যান্য'),
]

const ROAD_TYPES = [
  opt('rcc', 'RCC', 'আরসিসি'),
  opt('bitumen', 'Bitumen', 'বিটুমিন'),
  opt('hbb', 'HBB', 'এইচবিবি'),
  opt('earthen', 'Earthen', 'কাঁচা'),
]

const DRAIN_TYPES = [
  opt('open', 'Open', 'উন্মুক্ত'),
  opt('covered', 'Covered', 'ঢাকনাযুক্ত'),
  opt('box', 'Box culvert', 'বক্স কালভার্ট'),
]

const PROVIDER_TYPES = [
  opt('public', 'Public (KCC)', 'সরকারি (কেসিসি)'),
  opt('private', 'Private', 'বেসরকারি'),
  opt('cbo', 'Community based', 'কমিউনিটি ভিত্তিক'),
]

const TECHNOLOGIES = [
  opt('drying-bed', 'Sludge drying bed', 'স্লাজ ড্রায়িং বেড'),
  opt('planted', 'Planted drying bed', 'প্ল্যান্টেড ড্রায়িং বেড'),
  opt('co-compost', 'Co-composting', 'কো-কম্পোস্টিং'),
]

// --- column helpers ---------------------------------------------------------
const col = (key, en, bn, type = 'text', extra = {}) =>
  ({ key, label: { en, bn }, type, ...extra })

// ---------------------------------------------------------------------------
// Module definitions
// ---------------------------------------------------------------------------
export const MODULES = [
  {
    key: 'building-structures',
    group: 'building',
    path: '/admin/building/structures',
    icon: '🏢',
    title: { en: 'Building Structures', bn: 'ইমারত কাঠামো' },
    subtitle: {
      en: 'The building register — every assessed structure with its holding, use type and tax position.',
      bn: 'ইমারত রেজিস্টার — প্রতিটি মূল্যায়িত কাঠামোর হোল্ডিং, ব্যবহারের ধরন ও করের অবস্থা।',
    },
    idPrefix: 'BLD',
    columns: [
      col('id', 'Structure ID', 'কাঠামো আইডি'),
      col('holdingNo', 'Holding no.', 'হোল্ডিং নং'),
      col('owner', 'Owner', 'মালিক', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('mohalla', 'Mohalla', 'মহল্লা', 'bilingual'),
      col('useType', 'Use type', 'ব্যবহারের ধরন', 'select', { options: USE_TYPES }),
      col('storeys', 'Storeys', 'তলা', 'number'),
      col('areaSqft', 'Area (sq.ft)', 'আয়তন (বর্গফুট)', 'number'),
      col('taxDue', 'Tax due', 'বকেয়া কর', 'money'),
      col('status', 'Status', 'অবস্থা', 'select', { options: STRUCTURE_STATUS }),
      col('surveyedAt', 'Surveyed on', 'জরিপের তারিখ', 'date'),
    ],
    filters: ['ward', 'useType', 'status', 'taxDue'],
    generate: (r) => Array.from({ length: 58 }, (_, i) => {
      const m = pick(r, MOHALLAS)
      return {
        id: `BLD-${pad(i + 1)}`,
        holdingNo: `${pad(int(r, 1, 31), 2)}-${pad(int(r, 1, 999), 3)}-${pad(i + 1)}`,
        owner: pick(r, NAMES),
        ward: int(r, 1, WARD_COUNT),
        mohalla: m,
        useType: pick(r, USE_TYPES).value,
        storeys: int(r, 1, 8),
        areaSqft: int(r, 600, 6400),
        taxDue: pick(r, [0, 0, int(r, 1200, 48000)]),
        status: pick(r, STRUCTURE_STATUS).value,
        surveyedAt: date(r, 20, 900),
      }
    }),
  },

  {
    key: 'building-surveys',
    group: 'building',
    path: '/admin/building/surveys',
    icon: '📋',
    title: { en: 'Building Surveys', bn: 'ইমারত জরিপ' },
    subtitle: {
      en: 'Field survey submissions against the building register, with their verification state.',
      bn: 'ইমারত রেজিস্টারের বিপরীতে মাঠ জরিপের দাখিল ও যাচাইয়ের অবস্থা।',
    },
    idPrefix: 'BSV',
    columns: [
      col('id', 'Survey ID', 'জরিপ আইডি'),
      col('buildingId', 'Structure ID', 'কাঠামো আইডি'),
      col('surveyor', 'Surveyor', 'জরিপকারী', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('surveyedAt', 'Survey date', 'জরিপের তারিখ', 'date'),
      col('status', 'Status', 'অবস্থা', 'select', { options: SURVEY_STATUS }),
      col('remarks', 'Remarks', 'মন্তব্য', 'textarea'),
    ],
    filters: ['ward', 'status', 'surveyor'],
    generate: (r) => Array.from({ length: 42 }, (_, i) => ({
      id: `BSV-${pad(i + 1)}`,
      buildingId: `BLD-${pad(int(r, 1, 58))}`,
      surveyor: pick(r, SURVEYORS),
      ward: int(r, 1, WARD_COUNT),
      surveyedAt: date(r, 5, 400),
      status: pick(r, SURVEY_STATUS).value,
      remarks: pick(r, ['Structure matches the register.', 'Storey count updated after inspection.', 'Owner unavailable; revisit required.', 'Use type changed to commercial.']),
    })),
  },

  {
    key: 'roads',
    group: 'utility',
    path: '/admin/utility/roads',
    icon: '🛣️',
    title: { en: 'Roads', bn: 'সড়ক' },
    subtitle: {
      en: 'Road inventory by ward with surface type, dimensions and condition.',
      bn: 'ওয়ার্ডভিত্তিক সড়ক তালিকা — পৃষ্ঠের ধরন, পরিমাপ ও অবস্থা।',
    },
    idPrefix: 'RD',
    columns: [
      col('id', 'Road ID', 'সড়ক আইডি'),
      col('name', 'Road name', 'সড়কের নাম', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('type', 'Surface', 'পৃষ্ঠ', 'select', { options: ROAD_TYPES }),
      col('lengthM', 'Length (m)', 'দৈর্ঘ্য (মি)', 'number'),
      col('widthM', 'Width (m)', 'প্রস্থ (মি)', 'number'),
      col('condition', 'Condition', 'অবস্থা', 'select', { options: CONDITION }),
      col('lastRepair', 'Last repaired', 'সর্বশেষ মেরামত', 'date'),
    ],
    filters: ['ward', 'type', 'condition'],
    generate: (r) => Array.from({ length: 46 }, (_, i) => {
      const m = pick(r, MOHALLAS)
      return {
        id: `RD-${pad(i + 1)}`,
        name: { en: `${m.en} Road ${int(r, 1, 9)}`, bn: `${m.bn} রোড ${int(r, 1, 9)}` },
        ward: int(r, 1, WARD_COUNT),
        type: pick(r, ROAD_TYPES).value,
        lengthM: int(r, 120, 3200),
        widthM: dec(r, 2.4, 12),
        condition: pick(r, CONDITION).value,
        lastRepair: date(r, 30, 1500),
      }
    }),
  },

  {
    key: 'drains',
    group: 'utility',
    path: '/admin/utility/drains',
    icon: '🌊',
    title: { en: 'Drains', bn: 'ড্রেন' },
    subtitle: {
      en: 'Drainage network inventory with type, dimensions and last cleaning date.',
      bn: 'ড্রেনেজ নেটওয়ার্ক তালিকা — ধরন, পরিমাপ ও সর্বশেষ পরিষ্কারের তারিখ।',
    },
    idPrefix: 'DR',
    columns: [
      col('id', 'Drain ID', 'ড্রেন আইডি'),
      col('name', 'Drain name', 'ড্রেনের নাম', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('type', 'Type', 'ধরন', 'select', { options: DRAIN_TYPES }),
      col('lengthM', 'Length (m)', 'দৈর্ঘ্য (মি)', 'number'),
      col('depthM', 'Depth (m)', 'গভীরতা (মি)', 'number'),
      col('condition', 'Condition', 'অবস্থা', 'select', { options: CONDITION }),
      col('lastCleaned', 'Last cleaned', 'সর্বশেষ পরিষ্কার', 'date'),
    ],
    filters: ['ward', 'type', 'condition'],
    generate: (r) => Array.from({ length: 38 }, (_, i) => {
      const m = pick(r, MOHALLAS)
      return {
        id: `DR-${pad(i + 1)}`,
        name: { en: `${m.en} Drain ${int(r, 1, 6)}`, bn: `${m.bn} ড্রেন ${int(r, 1, 6)}` },
        ward: int(r, 1, WARD_COUNT),
        type: pick(r, DRAIN_TYPES).value,
        lengthM: int(r, 80, 2400),
        depthM: dec(r, 0.4, 2.4),
        condition: pick(r, CONDITION).value,
        lastCleaned: date(r, 10, 400),
      }
    }),
  },

  {
    key: 'containments',
    group: 'fsm',
    path: '/admin/fsm/containments',
    icon: '🛢️',
    title: { en: 'Containments', bn: 'কনটেইনমেন্ট' },
    subtitle: {
      en: 'Every on-site containment — septic tanks, pits and twin pits — with access and emptying status.',
      bn: 'সকল কনটেইনমেন্ট — সেপটিক ট্যাংক, পিট ও টুইন পিট — প্রবেশযোগ্যতা ও খালি করার অবস্থাসহ।',
    },
    idPrefix: 'CNT',
    columns: [
      col('id', 'Containment ID', 'কনটেইনমেন্ট আইডি'),
      col('buildingId', 'Structure ID', 'কাঠামো আইডি'),
      col('customer', 'Customer', 'গ্রাহক', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('type', 'Type', 'ধরন', 'select', { options: CONTAINMENT_TYPES }),
      col('volumeM3', 'Volume (m³)', 'আয়তন (ঘনমি)', 'number'),
      col('accessibility', 'Access', 'প্রবেশযোগ্যতা', 'select', { options: ACCESSIBILITY }),
      col('lastEmptied', 'Last emptied', 'সর্বশেষ খালি', 'date'),
      col('status', 'Status', 'অবস্থা', 'select', { options: OPERATIONAL }),
    ],
    filters: ['ward', 'type', 'accessibility', 'status'],
    generate: (r) => Array.from({ length: 64 }, (_, i) => ({
      id: `CNT-${pad(i + 1)}`,
      buildingId: `BLD-${pad(int(r, 1, 58))}`,
      customer: pick(r, NAMES),
      ward: int(r, 1, WARD_COUNT),
      type: pick(r, CONTAINMENT_TYPES).value,
      volumeM3: dec(r, 1.2, 14),
      accessibility: pick(r, ACCESSIBILITY).value,
      lastEmptied: date(r, 20, 1300),
      status: pick(r, OPERATIONAL).value,
    })),
  },

  {
    key: 'containment-surveys',
    group: 'fsm',
    path: '/admin/fsm/containment-surveys',
    icon: '🔍',
    title: { en: 'Containment Surveys', bn: 'কনটেইনমেন্ট জরিপ' },
    subtitle: {
      en: 'Survey records captured against containments in the field.',
      bn: 'মাঠপর্যায়ে কনটেইনমেন্টের বিপরীতে গৃহীত জরিপ।',
    },
    idPrefix: 'CSV',
    columns: [
      col('id', 'Survey ID', 'জরিপ আইডি'),
      col('containmentId', 'Containment ID', 'কনটেইনমেন্ট আইডি'),
      col('surveyor', 'Surveyor', 'জরিপকারী', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('surveyedAt', 'Survey date', 'জরিপের তারিখ', 'date'),
      col('sludgeDepthCm', 'Sludge depth (cm)', 'স্লাজের গভীরতা (সেমি)', 'number'),
      col('status', 'Status', 'অবস্থা', 'select', { options: SURVEY_STATUS }),
    ],
    filters: ['ward', 'status', 'surveyor'],
    generate: (r) => Array.from({ length: 40 }, (_, i) => ({
      id: `CSV-${pad(i + 1)}`,
      containmentId: `CNT-${pad(int(r, 1, 64))}`,
      surveyor: pick(r, SURVEYORS),
      ward: int(r, 1, WARD_COUNT),
      surveyedAt: date(r, 5, 500),
      sludgeDepthCm: int(r, 15, 180),
      status: pick(r, SURVEY_STATUS).value,
    })),
  },

  {
    key: 'applications',
    group: 'fsm',
    path: '/admin/fsm/applications',
    icon: '📨',
    title: { en: 'Applications', bn: 'আবেদন' },
    subtitle: {
      en: 'Citizen emptying requests from intake through assignment to completion.',
      bn: 'নাগরিকের খালি করার অনুরোধ — গ্রহণ থেকে নিয়োগ ও সম্পন্ন পর্যন্ত।',
    },
    idPrefix: 'APP',
    columns: [
      col('id', 'Application ID', 'আবেদন আইডি'),
      col('applicant', 'Applicant', 'আবেদনকারী', 'bilingual'),
      col('phone', 'Phone', 'ফোন'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('containmentId', 'Containment ID', 'কনটেইনমেন্ট আইডি'),
      col('appliedAt', 'Applied on', 'আবেদনের তারিখ', 'date'),
      col('provider', 'Assigned provider', 'নিয়োজিত সেবাদাতা', 'bilingual'),
      col('fee', 'Fee', 'ফি', 'money'),
      col('status', 'Status', 'অবস্থা', 'select', { options: APP_STATUS }),
    ],
    filters: ['ward', 'status', 'appliedAt'],
    generate: (r) => Array.from({ length: 52 }, (_, i) => ({
      id: `APP-${pad(i + 1)}`,
      applicant: pick(r, NAMES),
      phone: `017${int(r, 10000000, 99999999)}`,
      ward: int(r, 1, WARD_COUNT),
      containmentId: `CNT-${pad(int(r, 1, 64))}`,
      appliedAt: date(r, 1, 260),
      provider: pick(r, PROVIDERS),
      fee: pick(r, [1500, 2000, 2500, 3000, 3500]),
      status: pick(r, APP_STATUS).value,
    })),
  },

  {
    key: 'emptying-history',
    group: 'fsm',
    path: '/admin/fsm/emptying-history',
    icon: '🚛',
    title: { en: 'Emptying Service History', bn: 'খালি করার সেবার ইতিহাস' },
    subtitle: {
      en: 'Completed emptying services with volume lifted and disposal destination.',
      bn: 'সম্পন্ন খালি করার সেবা — উত্তোলিত পরিমাণ ও নিষ্কাশনের গন্তব্যসহ।',
    },
    idPrefix: 'EMP',
    columns: [
      col('id', 'Service ID', 'সেবা আইডি'),
      col('applicationId', 'Application ID', 'আবেদন আইডি'),
      col('provider', 'Provider', 'সেবাদাতা', 'bilingual'),
      col('vehicle', 'Vehicle', 'যানবাহন'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('volumeM3', 'Volume (m³)', 'পরিমাণ (ঘনমি)', 'number'),
      col('servedAt', 'Served on', 'সেবার তারিখ', 'date'),
      col('disposalSite', 'Disposal site', 'নিষ্কাশন কেন্দ্র', 'bilingual'),
      col('fee', 'Fee collected', 'আদায়কৃত ফি', 'money'),
    ],
    filters: ['ward', 'provider', 'servedAt'],
    generate: (r) => Array.from({ length: 48 }, (_, i) => ({
      id: `EMP-${pad(i + 1)}`,
      applicationId: `APP-${pad(int(r, 1, 52))}`,
      provider: pick(r, PROVIDERS),
      vehicle: `KHU-${pad(int(r, 11, 99), 2)}-${int(r, 1000, 9999)}`,
      ward: int(r, 1, WARD_COUNT),
      volumeM3: dec(r, 1.5, 9),
      servedAt: date(r, 1, 300),
      disposalSite: pick(r, [
        { en: 'Rajbandh Treatment Plant', bn: 'রাজবাঁধ ট্রিটমেন্ট প্ল্যান্ট' },
        { en: 'Mohesorpasha Transfer Station', bn: 'মহেশ্বরপাশা ট্রান্সফার স্টেশন' },
      ]),
      fee: pick(r, [1500, 2000, 2500, 3000]),
    })),
  },

  {
    key: 'next-emptying',
    group: 'fsm',
    path: '/admin/fsm/next-emptying',
    icon: '⏭️',
    title: { en: 'Next Emptying Info', bn: 'পরবর্তী খালি করার তথ্য' },
    subtitle: {
      en: 'Scheduling view — which containments fall due next, ordered by urgency.',
      bn: 'সময়সূচি — কোন কনটেইনমেন্ট কখন খালি করতে হবে, জরুরিতা অনুযায়ী।',
    },
    idPrefix: 'NXT',
    columns: [
      col('id', 'Schedule ID', 'সূচি আইডি'),
      col('containmentId', 'Containment ID', 'কনটেইনমেন্ট আইডি'),
      col('customer', 'Customer', 'গ্রাহক', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('lastEmptied', 'Last emptied', 'সর্বশেষ খালি', 'date'),
      col('dueDate', 'Next due', 'পরবর্তী তারিখ', 'date'),
      col('daysLeft', 'Days left', 'অবশিষ্ট দিন', 'number'),
      col('priority', 'Priority', 'অগ্রাধিকার', 'select', { options: PRIORITY }),
    ],
    filters: ['ward', 'priority'],
    generate: (r) => Array.from({ length: 44 }, (_, i) => {
      const days = int(r, -120, 240)
      return {
        id: `NXT-${pad(i + 1)}`,
        containmentId: `CNT-${pad(int(r, 1, 64))}`,
        customer: pick(r, NAMES),
        ward: int(r, 1, WARD_COUNT),
        lastEmptied: date(r, 200, 1200),
        dueDate: new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
        daysLeft: days,
        priority: days < 0 ? 'overdue' : days < 30 ? 'due-soon' : 'scheduled',
      }
    }),
  },

  {
    key: 'transfer-stations',
    group: 'fsm',
    path: '/admin/fsm/transfer-stations',
    icon: '🏭',
    title: { en: 'Transfer Stations', bn: 'ট্রান্সফার স্টেশন' },
    subtitle: {
      en: 'Intermediate discharge points between collection vehicles and treatment.',
      bn: 'সংগ্রহকারী যান ও ট্রিটমেন্টের মধ্যবর্তী নিষ্কাশন কেন্দ্র।',
    },
    idPrefix: 'TS',
    columns: [
      col('id', 'Station ID', 'স্টেশন আইডি'),
      col('name', 'Station name', 'স্টেশনের নাম', 'bilingual'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('capacityM3', 'Capacity (m³)', 'ধারণক্ষমতা (ঘনমি)', 'number'),
      col('inflowM3', 'Monthly inflow (m³)', 'মাসিক প্রবাহ (ঘনমি)', 'number'),
      col('operator', 'Operator', 'পরিচালনাকারী', 'bilingual'),
      col('status', 'Status', 'অবস্থা', 'select', { options: OPERATIONAL }),
    ],
    filters: ['ward', 'status'],
    generate: (r) => Array.from({ length: 12 }, (_, i) => {
      const m = MOHALLAS[i % MOHALLAS.length]
      return {
        id: `TS-${pad(i + 1, 3)}`,
        name: { en: `${m.en} Transfer Station`, bn: `${m.bn} ট্রান্সফার স্টেশন` },
        ward: int(r, 1, WARD_COUNT),
        capacityM3: int(r, 20, 120),
        inflowM3: int(r, 60, 900),
        operator: pick(r, PROVIDERS),
        status: pick(r, OPERATIONAL).value,
      }
    }),
  },

  {
    key: 'treatment-plants',
    group: 'fsm',
    path: '/admin/fsm/treatment-plants',
    icon: '⚗️',
    title: { en: 'Treatment Plants', bn: 'ট্রিটমেন্ট প্ল্যান্ট' },
    subtitle: {
      en: 'Faecal sludge treatment facilities, their technology and daily capacity.',
      bn: 'মলবর্জ্য শোধনাগার — প্রযুক্তি ও দৈনিক ধারণক্ষমতা।',
    },
    idPrefix: 'TP',
    columns: [
      col('id', 'Plant ID', 'প্ল্যান্ট আইডি'),
      col('name', 'Plant name', 'প্ল্যান্টের নাম', 'bilingual'),
      col('location', 'Location', 'অবস্থান', 'bilingual'),
      col('technology', 'Technology', 'প্রযুক্তি', 'select', { options: TECHNOLOGIES }),
      col('capacityM3Day', 'Capacity (m³/day)', 'ধারণক্ষমতা (ঘনমি/দিন)', 'number'),
      col('inflowM3Day', 'Inflow (m³/day)', 'প্রবাহ (ঘনমি/দিন)', 'number'),
      col('commissioned', 'Commissioned', 'চালুর তারিখ', 'date'),
      col('status', 'Status', 'অবস্থা', 'select', { options: OPERATIONAL }),
    ],
    filters: ['technology', 'status'],
    generate: (r) => ([
      { id: 'TP-001', name: { en: 'Rajbandh FSTP', bn: 'রাজবাঁধ এফএসটিপি' }, location: { en: 'Rajbandh, Ward 31', bn: 'রাজবাঁধ, ওয়ার্ড ৩১' }, technology: 'drying-bed', capacityM3Day: 60, inflowM3Day: 48, commissioned: '2019-06-30', status: 'operational' },
      { id: 'TP-002', name: { en: 'Mohesorpasha FSTP', bn: 'মহেশ্বরপাশা এফএসটিপি' }, location: { en: 'Mohesorpasha, Ward 2', bn: 'মহেশ্বরপাশা, ওয়ার্ড ২' }, technology: 'planted', capacityM3Day: 35, inflowM3Day: 29, commissioned: '2021-11-14', status: 'operational' },
      { id: 'TP-003', name: { en: 'Labanchara Co-compost Unit', bn: 'লবণচরা কো-কম্পোস্ট ইউনিট' }, location: { en: 'Labanchara, Ward 28', bn: 'লবণচরা, ওয়ার্ড ২৮' }, technology: 'co-compost', capacityM3Day: 18, inflowM3Day: 11, commissioned: '2023-03-08', status: 'maintenance' },
    ]),
  },

  {
    key: 'service-providers',
    group: 'fsm',
    path: '/admin/fsm/service-providers',
    icon: '🤝',
    title: { en: 'Service Providers', bn: 'সেবাদাতা প্রতিষ্ঠান' },
    subtitle: {
      en: 'Licensed emptying operators, their fleet size and performance rating.',
      bn: 'লাইসেন্সপ্রাপ্ত খালি করার প্রতিষ্ঠান — বহরের আকার ও কর্মদক্ষতা।',
    },
    idPrefix: 'SP',
    columns: [
      col('id', 'Provider ID', 'সেবাদাতা আইডি'),
      col('name', 'Provider name', 'প্রতিষ্ঠানের নাম', 'bilingual'),
      col('type', 'Type', 'ধরন', 'select', { options: PROVIDER_TYPES }),
      col('licenceNo', 'Licence no.', 'লাইসেন্স নং'),
      col('vehicles', 'Vehicles', 'যানবাহন', 'number'),
      col('phone', 'Phone', 'ফোন'),
      col('rating', 'Rating', 'রেটিং', 'number'),
      col('status', 'Status', 'অবস্থা', 'select', { options: OPERATIONAL }),
    ],
    filters: ['type', 'status'],
    generate: (r) => PROVIDERS.map((p, i) => ({
      id: `SP-${pad(i + 1, 3)}`,
      name: p,
      type: i === 0 ? 'public' : pick(r, PROVIDER_TYPES).value,
      licenceNo: `KCC/FSM/${2020 + i}/${pad(int(r, 1, 99), 3)}`,
      vehicles: int(r, 1, 9),
      phone: `017${int(r, 10000000, 99999999)}`,
      rating: dec(r, 3, 5, 1),
      status: 'operational',
    })),
  },

  {
    key: 'compost-sales',
    group: 'fsm',
    path: '/admin/fsm/compost-sales',
    icon: '🌱',
    title: { en: 'Compost Sales', bn: 'কম্পোস্ট বিক্রয়' },
    subtitle: {
      en: 'Sales of co-compost produced from treated sludge, with payment status.',
      bn: 'শোধিত স্লাজ থেকে উৎপাদিত কো-কম্পোস্টের বিক্রয় ও পরিশোধের অবস্থা।',
    },
    idPrefix: 'CS',
    columns: [
      col('id', 'Sale ID', 'বিক্রয় আইডি'),
      col('buyer', 'Buyer', 'ক্রেতা', 'bilingual'),
      col('plantId', 'Plant', 'প্ল্যান্ট'),
      col('soldAt', 'Sold on', 'বিক্রয়ের তারিখ', 'date'),
      col('quantityKg', 'Quantity (kg)', 'পরিমাণ (কেজি)', 'number'),
      col('rate', 'Rate (৳/kg)', 'দর (৳/কেজি)', 'number'),
      col('amount', 'Amount', 'মোট', 'money'),
      col('paymentStatus', 'Payment', 'পরিশোধ', 'select', { options: PAY_STATUS }),
    ],
    filters: ['plantId', 'paymentStatus', 'soldAt'],
    generate: (r) => Array.from({ length: 34 }, (_, i) => {
      const qty = int(r, 50, 2400)
      const rate = int(r, 8, 18)
      return {
        id: `CS-${pad(i + 1)}`,
        buyer: pick(r, [
          { en: 'Khulna Nursery & Agro', bn: 'খুলনা নার্সারি অ্যান্ড এগ্রো' },
          { en: 'Dumuria Farmers Co-op', bn: 'ডুমুরিয়া কৃষক সমবায়' },
          { en: 'Green Bangla Agro Ltd.', bn: 'গ্রিন বাংলা এগ্রো লিঃ' },
          { en: 'Batiaghata Rice Growers', bn: 'বটিয়াঘাটা ধান চাষি' },
        ]),
        plantId: pick(r, ['TP-001', 'TP-002', 'TP-003']),
        soldAt: date(r, 3, 500),
        quantityKg: qty,
        rate,
        amount: qty * rate,
        paymentStatus: pick(r, PAY_STATUS).value,
      }
    }),
  },

  {
    key: 'sludge-collection',
    group: 'fsm',
    path: '/admin/fsm/sludge-collection',
    icon: '🧪',
    title: { en: 'Sludge Collection', bn: 'স্লাজ সংগ্রহ' },
    subtitle: {
      en: 'Sludge delivered into treatment plants, by provider and vehicle.',
      bn: 'ট্রিটমেন্ট প্ল্যান্টে পৌঁছানো স্লাজ — সেবাদাতা ও যানবাহন অনুযায়ী।',
    },
    idPrefix: 'SC',
    columns: [
      col('id', 'Collection ID', 'সংগ্রহ আইডি'),
      col('plantId', 'Plant', 'প্ল্যান্ট'),
      col('provider', 'Provider', 'সেবাদাতা', 'bilingual'),
      col('vehicle', 'Vehicle', 'যানবাহন'),
      col('sourceWard', 'Source ward', 'উৎস ওয়ার্ড', 'number'),
      col('volumeM3', 'Volume (m³)', 'পরিমাণ (ঘনমি)', 'number'),
      col('collectedAt', 'Collected on', 'সংগ্রহের তারিখ', 'date'),
    ],
    filters: ['plantId', 'sourceWard', 'collectedAt'],
    generate: (r) => Array.from({ length: 50 }, (_, i) => ({
      id: `SC-${pad(i + 1)}`,
      plantId: pick(r, ['TP-001', 'TP-002', 'TP-003']),
      provider: pick(r, PROVIDERS),
      vehicle: `KHU-${pad(int(r, 11, 99), 2)}-${int(r, 1000, 9999)}`,
      sourceWard: int(r, 1, WARD_COUNT),
      volumeM3: dec(r, 2, 11),
      collectedAt: date(r, 1, 240),
    })),
  },

  {
    key: 'help-desks',
    group: 'fsm',
    path: '/admin/fsm/help-desks',
    icon: '☎️',
    title: { en: 'Help Desks', bn: 'হেল্প ডেস্ক' },
    subtitle: {
      en: 'Citizen tickets raised at the ward help desks and the hotline.',
      bn: 'ওয়ার্ড হেল্প ডেস্ক ও হটলাইনে গৃহীত নাগরিক টিকিট।',
    },
    idPrefix: 'HD',
    columns: [
      col('id', 'Ticket ID', 'টিকিট আইডি'),
      col('citizen', 'Citizen', 'নাগরিক', 'bilingual'),
      col('phone', 'Phone', 'ফোন'),
      col('ward', 'Ward', 'ওয়ার্ড', 'number'),
      col('category', 'Category', 'ক্যাটাগরি', 'select', { options: TICKET_CATEGORY }),
      col('openedAt', 'Opened on', 'খোলার তারিখ', 'date'),
      col('assignedTo', 'Assigned to', 'দায়িত্বপ্রাপ্ত', 'bilingual'),
      col('status', 'Status', 'অবস্থা', 'select', { options: TICKET_STATUS }),
      col('note', 'Note', 'নোট', 'textarea'),
    ],
    filters: ['ward', 'category', 'status'],
    generate: (r) => Array.from({ length: 46 }, (_, i) => ({
      id: `HD-${pad(i + 1)}`,
      citizen: pick(r, NAMES),
      phone: `018${int(r, 10000000, 99999999)}`,
      ward: int(r, 1, WARD_COUNT),
      category: pick(r, TICKET_CATEGORY).value,
      openedAt: date(r, 0, 180),
      assignedTo: pick(r, SURVEYORS),
      status: pick(r, TICKET_STATUS).value,
      note: pick(r, ['Citizen contacted by phone.', 'Site visit scheduled.', 'Forwarded to the conservancy section.', 'Awaiting vehicle availability.']),
    })),
  },
]

export const MODULE_GROUPS = {
  building: { en: 'Building Information Management', bn: 'ইমারত তথ্য ব্যবস্থাপনা', icon: '🏢' },
  utility: { en: 'Utility Information Management', bn: 'ইউটিলিটি তথ্য ব্যবস্থাপনা', icon: '🛣️' },
  fsm: { en: 'FSM Information Management', bn: 'এফএসএম তথ্য ব্যবস্থাপনা', icon: '♻️' },
}

export const moduleByKey = (key) => MODULES.find((m) => m.key === key)

/** Builds the seeded sample rows for one module. */
export function seedRows(mod, seed = 20260907) {
  return mod.generate(rng(seed + mod.key.length * 7919))
}

// Column option lookup used by badges and the record form.
export function optionOf(colDef, value) {
  return colDef.options?.find((o) => o.value === value)
}
