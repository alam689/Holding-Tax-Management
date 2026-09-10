// ---------------------------------------------------------------------------
// Sample data for the IMIS public portal demo. In production every collection
// here would be served by the IMIS core API.
// ---------------------------------------------------------------------------

export const services = [
  {
    slug: 'holding-tax',
    icon: '🏠',
    name: { en: 'Holding Tax', bn: 'হোল্ডিং ট্যাক্স' },
    tagline: { en: 'Assessment, enquiry, payment & certificate', bn: 'মূল্যায়ন, অনুসন্ধান, পরিশোধ ও সনদ' },
    description: {
      en: 'Search your holding by number or owner name, view the current assessment and arrears, pay online and download the money receipt instantly.',
      bn: 'হোল্ডিং নম্বর বা মালিকের নাম দিয়ে অনুসন্ধান করুন, চলতি মূল্যায়ন ও বকেয়া দেখুন, অনলাইনে পরিশোধ করে তৎক্ষণাৎ রসিদ ডাউনলোড করুন।',
    },
    fee: { en: 'As per assessment', bn: 'মূল্যায়ন অনুযায়ী' },
    time: { en: 'Instant', bn: 'তাৎক্ষণিক' },
    to: '/holding-tax',
    docs: {
      en: ['Holding number or previous money receipt', 'National ID of the owner', 'Deed / mutation copy (for re-assessment)'],
      bn: ['হোল্ডিং নম্বর অথবা পূর্বের রসিদ', 'মালিকের জাতীয় পরিচয়পত্র', 'দলিল / নামজারির কপি (পুনঃমূল্যায়নের জন্য)'],
    },
  },
  {
    slug: 'trade-licence',
    icon: '📜',
    name: { en: 'Trade Licence', bn: 'ট্রেড লাইসেন্স' },
    tagline: { en: 'New issue and yearly renewal', bn: 'নতুন ইস্যু ও বার্ষিক নবায়ন' },
    description: {
      en: 'Apply for a new trade licence or renew an existing one. Fees are calculated automatically from the declared business category.',
      bn: 'নতুন ট্রেড লাইসেন্সের আবেদন বা নবায়ন করুন। ঘোষিত ব্যবসার শ্রেণি অনুযায়ী ফি স্বয়ংক্রিয়ভাবে নির্ধারিত হয়।',
    },
    fee: { en: '৳ 500 – ৳ 15,000', bn: '৳ ৫০০ – ৳ ১৫,০০০' },
    time: { en: '3 working days', bn: '৩ কার্যদিবস' },
    to: '/services/trade-licence',
    docs: {
      en: ['National ID of the applicant', 'Rent agreement or holding ownership proof', 'Two passport-size photographs', 'TIN certificate (if applicable)'],
      bn: ['আবেদনকারীর জাতীয় পরিচয়পত্র', 'ভাড়ার চুক্তিপত্র বা হোল্ডিং মালিকানার প্রমাণ', 'দুই কপি পাসপোর্ট সাইজ ছবি', 'টিআইএন সনদ (প্রযোজ্য ক্ষেত্রে)'],
    },
  },
  {
    slug: 'birth-death',
    icon: '👶',
    name: { en: 'Birth & Death Registration', bn: 'জন্ম ও মৃত্যু নিবন্ধন' },
    tagline: { en: 'Registration, correction, certificate', bn: 'নিবন্ধন, সংশোধন, সনদ' },
    description: {
      en: 'Register a birth or death, apply for a correction, and download a verified certificate linked to the national BDRIS database.',
      bn: 'জন্ম বা মৃত্যু নিবন্ধন করুন, সংশোধনের আবেদন করুন এবং জাতীয় বিডিআরআইএস ডাটাবেসের সাথে যাচাইকৃত সনদ ডাউনলোড করুন।',
    },
    fee: { en: 'Free (within 45 days)', bn: 'বিনামূল্যে (৪৫ দিনের মধ্যে)' },
    time: { en: '5 working days', bn: '৫ কার্যদিবস' },
    to: '/services/birth-death',
    docs: {
      en: ['EPI card or hospital certificate', 'Parents’ National ID / birth certificate', 'Holding tax receipt of the residence'],
      bn: ['ইপিআই কার্ড বা হাসপাতালের সনদ', 'পিতা-মাতার জাতীয় পরিচয়পত্র / জন্মসনদ', 'বসতবাড়ির হোল্ডিং ট্যাক্স রসিদ'],
    },
  },
  {
    slug: 'water-supply',
    icon: '💧',
    name: { en: 'Water Supply & Billing', bn: 'পানি সরবরাহ ও বিলিং' },
    tagline: { en: 'New connection and monthly bills', bn: 'নতুন সংযোগ ও মাসিক বিল' },
    description: {
      en: 'Apply for a domestic or commercial water connection, view monthly bills and settle dues online.',
      bn: 'আবাসিক বা বাণিজ্যিক পানির সংযোগের আবেদন করুন, মাসিক বিল দেখুন এবং অনলাইনে বকেয়া পরিশোধ করুন।',
    },
    fee: { en: '৳ 3,000 connection fee', bn: '৳ ৩,০০০ সংযোগ ফি' },
    time: { en: '7 working days', bn: '৭ কার্যদিবস' },
    to: '/services/water-supply',
    docs: {
      en: ['Holding tax clearance', 'National ID', 'Site sketch of the plot'],
      bn: ['হোল্ডিং ট্যাক্স ছাড়পত্র', 'জাতীয় পরিচয়পত্র', 'প্লটের নকশা'],
    },
  },
  {
    slug: 'building-plan',
    icon: '🏗️',
    name: { en: 'Building Plan Approval', bn: 'ইমারত নকশা অনুমোদন' },
    tagline: { en: 'Plan submission and occupancy', bn: 'নকশা দাখিল ও ব্যবহার সনদ' },
    description: {
      en: 'Submit architectural drawings for scrutiny, track the inspection stages and download the approved plan memo.',
      bn: 'স্থাপত্য নকশা যাচাইয়ের জন্য দাখিল করুন, পরিদর্শনের ধাপ ট্র্যাক করুন এবং অনুমোদিত নকশার স্মারক ডাউনলোড করুন।',
    },
    fee: { en: '৳ 12 per sq. ft.', bn: '৳ ১২ প্রতি বর্গফুট' },
    time: { en: '30 working days', bn: '৩০ কার্যদিবস' },
    to: '/services/building-plan',
    docs: {
      en: ['Ownership deed and mutation', 'Soil test report', 'Architect / engineer certified drawings', 'Up-to-date holding tax receipt'],
      bn: ['মালিকানা দলিল ও নামজারি', 'মাটি পরীক্ষার প্রতিবেদন', 'স্থপতি / প্রকৌশলী প্রত্যয়িত নকশা', 'হালনাগাদ হোল্ডিং ট্যাক্স রসিদ'],
    },
  },
  {
    slug: 'certificates',
    icon: '🧾',
    name: { en: 'Citizen Certificates', bn: 'নাগরিক সনদপত্র' },
    tagline: { en: 'Nationality, inheritance, character', bn: 'নাগরিকত্ব, ওয়ারিশ, চারিত্রিক' },
    description: {
      en: 'Request nationality, inheritance (warish), character or non-marriage certificates countersigned by the ward councillor.',
      bn: 'ওয়ার্ড কাউন্সিলর প্রতিস্বাক্ষরিত নাগরিকত্ব, ওয়ারিশ, চারিত্রিক বা অবিবাহিত সনদের আবেদন করুন।',
    },
    fee: { en: '৳ 100 – ৳ 300', bn: '৳ ১০০ – ৳ ৩০০' },
    time: { en: '2 working days', bn: '২ কার্যদিবস' },
    to: '/services/certificates',
    docs: {
      en: ['National ID', 'Holding tax receipt', 'Applicant photograph'],
      bn: ['জাতীয় পরিচয়পত্র', 'হোল্ডিং ট্যাক্স রসিদ', 'আবেদনকারীর ছবি'],
    },
  },
  {
    slug: 'waste-management',
    icon: '♻️',
    name: { en: 'Waste Management', bn: 'বর্জ্য ব্যবস্থাপনা' },
    tagline: { en: 'Collection schedule and requests', bn: 'সংগ্রহের সময়সূচি ও অনুরোধ' },
    description: {
      en: 'See the ward-wise collection schedule, request a bin, or report an uncollected point directly from the map.',
      bn: 'ওয়ার্ডভিত্তিক সংগ্রহের সময়সূচি দেখুন, বিন চেয়ে অনুরোধ করুন অথবা সংগ্রহ না হওয়া স্থান জানান।',
    },
    fee: { en: 'Free', bn: 'বিনামূল্যে' },
    time: { en: '24 hours', bn: '২৪ ঘণ্টা' },
    to: '/services/waste-management',
    docs: { en: ['Holding number', 'Contact mobile number'], bn: ['হোল্ডিং নম্বর', 'যোগাযোগের মোবাইল নম্বর'] },
  },
  {
    slug: 'market-lease',
    icon: '🏪',
    name: { en: 'Market & Shop Lease', bn: 'বাজার ও দোকান ইজারা' },
    tagline: { en: 'City Corporation market allotment', bn: 'সিটি কর্পোরেশন মার্কেট বরাদ্দ' },
    description: {
      en: 'View vacant shops in City Corporation markets, download the lease schedule and submit an allotment application.',
      bn: 'সিটি কর্পোরেশনের মার্কেটের খালি দোকান দেখুন, ইজারার তফসিল ডাউনলোড করুন এবং বরাদ্দের আবেদন দাখিল করুন।',
    },
    fee: { en: 'As per schedule', bn: 'তফসিল অনুযায়ী' },
    time: { en: '15 working days', bn: '১৫ কার্যদিবস' },
    to: '/services/market-lease',
    docs: { en: ['National ID', 'Trade licence', 'Bank solvency certificate'], bn: ['জাতীয় পরিচয়পত্র', 'ট্রেড লাইসেন্স', 'ব্যাংক সচ্ছলতার সনদ'] },
  },
]

// The 31 general wards of the City Corporation.
export const WARDS = Array.from({ length: 31 }, (_, i) => i + 1)

export const stats = [
  { key: 'holdings', value: 118400, label: { en: 'Assessed Holdings', bn: 'মূল্যায়িত হোল্ডিং' }, icon: '🏠' },
  { key: 'population', value: 718000, label: { en: 'Population', bn: 'জনসংখ্যা' }, icon: '👥' },
  { key: 'wards', value: 31, label: { en: 'Wards', bn: 'ওয়ার্ড' }, icon: '🗺️' },
  { key: 'area', value: 45.65, suffix: ' km²', label: { en: 'Area', bn: 'আয়তন' }, icon: '📐' },
  { key: 'licences', value: 42350, label: { en: 'Trade Licences', bn: 'ট্রেড লাইসেন্স' }, icon: '📜' },
  { key: 'collection', value: 81, suffix: '%', label: { en: 'Tax Collection Rate', bn: 'কর আদায়ের হার' }, icon: '📈' },
]

export const notices = [
  {
    id: 'NTC-2026-041',
    date: '2026-08-28',
    urgent: true,
    title: { en: 'Holding tax rebate of 5% for payment before 30 September 2026', bn: '৩০ সেপ্টেম্বর ২০২৬-এর মধ্যে পরিশোধে হোল্ডিং ট্যাক্সে ৫% রেয়াত' },
    body: {
      en: 'Citizens who clear the full financial year 2026–27 holding tax on or before 30 September 2026 will receive a 5% rebate. The rebate is applied automatically on the online payment screen and printed on the money receipt.',
      bn: '২০২৬–২৭ অর্থবছরের সম্পূর্ণ হোল্ডিং ট্যাক্স ৩০ সেপ্টেম্বর ২০২৬-এর মধ্যে পরিশোধ করলে ৫% রেয়াত পাওয়া যাবে। অনলাইন পেমেন্ট স্ক্রিনে রেয়াত স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে এবং রসিদে মুদ্রিত থাকবে।',
    },
  },
  {
    id: 'NTC-2026-039',
    date: '2026-08-19',
    urgent: false,
    title: { en: 'Quinquennial re-assessment camp — Wards 12, 13 and 14', bn: 'পঞ্চবার্ষিক পুনঃমূল্যায়ন ক্যাম্প — ওয়ার্ড ১২, ১৩ ও ১৪' },
    body: {
      en: 'Assessment officers will visit Wards 12, 13 and 14 from 5 to 20 September 2026. Owners are requested to keep the deed, mutation paper and last money receipt available for verification.',
      bn: '৫ থেকে ২০ সেপ্টেম্বর ২০২৬ পর্যন্ত মূল্যায়ন কর্মকর্তাগণ ওয়ার্ড ১২, ১৩ ও ১৪ পরিদর্শন করবেন। মালিকগণকে দলিল, নামজারির কাগজ ও সর্বশেষ রসিদ প্রস্তুত রাখার অনুরোধ করা হলো।',
    },
  },
  {
    id: 'NTC-2026-036',
    date: '2026-08-06',
    urgent: false,
    title: { en: 'Water supply interruption in the Khalishpur main line on 12 August', bn: '১২ আগস্ট খালিশপুর প্রধান লাইনে পানি সরবরাহ বন্ধ' },
    body: {
      en: 'Due to pump house maintenance, supply along the Khalishpur main line will remain suspended from 08:00 to 16:00 on 12 August 2026. Tanker service will be available on request through the hotline.',
      bn: 'পাম্প হাউস রক্ষণাবেক্ষণের কারণে ১২ আগস্ট ২০২৬ সকাল ৮টা থেকে বিকেল ৪টা পর্যন্ত খালিশপুর প্রধান লাইনে সরবরাহ বন্ধ থাকবে। হটলাইনে অনুরোধ করলে ট্যাংকার সেবা পাওয়া যাবে।',
    },
  },
  {
    id: 'NTC-2026-030',
    date: '2026-07-22',
    urgent: false,
    title: { en: 'Online trade licence renewal opens for FY 2026–27', bn: '২০২৬–২৭ অর্থবছরের অনলাইন ট্রেড লাইসেন্স নবায়ন শুরু' },
    body: {
      en: 'Renewal for financial year 2026–27 is now open on this portal. Late renewal after 31 October 2026 attracts a 10% surcharge.',
      bn: '২০২৬–২৭ অর্থবছরের নবায়ন এই পোর্টালে চালু হয়েছে। ৩১ অক্টোবর ২০২৬-এর পর নবায়নে ১০% সারচার্জ প্রযোজ্য।',
    },
  },
  {
    id: 'NTC-2026-025',
    date: '2026-07-03',
    urgent: false,
    title: { en: 'Recruitment: 4 posts of Assessment Assistant', bn: 'নিয়োগ: মূল্যায়ন সহকারী পদে ৪ জন' },
    body: {
      en: 'Applications are invited for four posts of Assessment Assistant (Grade 16). Last date of application: 31 July 2026.',
      bn: 'মূল্যায়ন সহকারী (গ্রেড ১৬) পদে চারজন নিয়োগের জন্য আবেদন আহ্বান করা হচ্ছে। আবেদনের শেষ তারিখ: ৩১ জুলাই ২০২৬।',
    },
  },
]

export const tenders = [
  {
    id: 'KCC/PROC/2026-27/012',
    published: '2026-08-25',
    deadline: '2026-09-15',
    status: 'open',
    method: { en: 'Open Tendering Method (OTM)', bn: 'উন্মুক্ত দরপত্র পদ্ধতি (ওটিএম)' },
    value: 18500000,
    title: { en: 'Construction of RCC drain from Boyra Bazar to Sonadanga bus terminal', bn: 'বয়রা বাজার থেকে সোনাডাঙ্গা বাস টার্মিনাল পর্যন্ত আরসিসি ড্রেন নির্মাণ' },
  },
  {
    id: 'KCC/PROC/2026-27/010',
    published: '2026-08-14',
    deadline: '2026-09-04',
    status: 'open',
    method: { en: 'Request for Quotation (RFQ)', bn: 'কোটেশনের অনুরোধ (আরএফকিউ)' },
    value: 2450000,
    title: { en: 'Supply of 480 LED street lights with poles for Wards 12 to 18', bn: 'ওয়ার্ড ১২ থেকে ১৮-এর জন্য খুঁটিসহ ৪৮০টি এলইডি সড়কবাতি সরবরাহ' },
  },
  {
    id: 'KCC/PROC/2026-27/007',
    published: '2026-07-30',
    deadline: '2026-08-21',
    status: 'closed',
    method: { en: 'Open Tendering Method (OTM)', bn: 'উন্মুক্ত দরপত্র পদ্ধতি (ওটিএম)' },
    value: 9200000,
    title: { en: 'Procurement of one garbage compactor truck (7 cbm)', bn: 'একটি গার্বেজ কম্প্যাক্টর ট্রাক (৭ ঘনমিটার) সংগ্রহ' },
  },
  {
    id: 'KCC/PROC/2026-27/004',
    published: '2026-07-09',
    deadline: '2026-07-31',
    status: 'closed',
    method: { en: 'Request for Quotation (RFQ)', bn: 'কোটেশনের অনুরোধ (আরএফকিউ)' },
    value: 1150000,
    title: { en: 'Annual maintenance of the City Corporation water pump houses', bn: 'সিটি কর্পোরেশনের পানির পাম্প হাউসের বার্ষিক রক্ষণাবেক্ষণ' },
  },
]

export const councillors = [
  { ward: 1, name: { en: 'Md. Abdul Karim', bn: 'মোঃ আব্দুল করিম' }, phone: '01711-001001', area: { en: 'Sonadanga A Block', bn: 'সোনাডাঙ্গা এ ব্লক' }, reserved: false },
  { ward: 2, name: { en: 'Sheikh Rafiqul Islam', bn: 'শেখ রফিকুল ইসলাম' }, phone: '01711-002002', area: { en: 'Sonadanga B Block', bn: 'সোনাডাঙ্গা বি ব্লক' }, reserved: false },
  { ward: 3, name: { en: 'Md. Jashim Uddin', bn: 'মোঃ জসিম উদ্দিন' }, phone: '01711-003003', area: { en: 'Nirala Residential Area', bn: 'নিরালা আবাসিক এলাকা' }, reserved: false },
  { ward: 4, name: { en: 'A. K. M. Shahidullah', bn: 'এ. কে. এম. শহীদুল্লাহ' }, phone: '01711-004004', area: { en: 'Boyra Bazar', bn: 'বয়রা বাজার' }, reserved: false },
  { ward: 5, name: { en: 'Md. Nurul Amin', bn: 'মোঃ নুরুল আমিন' }, phone: '01711-005005', area: { en: 'Boyra Cross Road', bn: 'বয়রা ক্রস রোড' }, reserved: false },
  { ward: 6, name: { en: 'Md. Habibur Rahman', bn: 'মোঃ হাবিবুর রহমান' }, phone: '01711-006006', area: { en: 'Khalishpur Housing', bn: 'খালিশপুর হাউজিং' }, reserved: false },
  { ward: 7, name: { en: 'Md. Sohel Rana', bn: 'মোঃ সোহেল রানা' }, phone: '01711-007007', area: { en: 'Khalishpur New Colony', bn: 'খালিশপুর নতুন কলোনি' }, reserved: false },
  { ward: 8, name: { en: 'Md. Anwar Hossain', bn: 'মোঃ আনোয়ার হোসেন' }, phone: '01711-008008', area: { en: 'Daulatpur Bazar', bn: 'দৌলতপুর বাজার' }, reserved: false },
  { ward: 9, name: { en: 'Md. Delwar Hossain', bn: 'মোঃ দেলোয়ার হোসেন' }, phone: '01711-009009', area: { en: 'Daulatpur Mohsin Road', bn: 'দৌলতপুর মহসিন রোড' }, reserved: false },
  { ward: 10, name: { en: 'Sheikh Mizanur Rahman', bn: 'শেখ মিজানুর রহমান' }, phone: '01711-010010', area: { en: 'Mohammad Nagar', bn: 'মোহাম্মদ নগর' }, reserved: false },
  { ward: 11, name: { en: 'Md. Aslam Hossain', bn: 'মোঃ আসলাম হোসেন' }, phone: '01711-011011', area: { en: 'Rayer Mahal', bn: 'রায়ের মহল' }, reserved: false },
  { ward: 12, name: { en: 'Md. Ferdous Alam', bn: 'মোঃ ফেরদৌস আলম' }, phone: '01711-012012', area: { en: 'Khan Jahan Ali Road', bn: 'খান জাহান আলী রোড' }, reserved: false },
  { ward: 13, name: { en: 'Md. Shafiqul Islam', bn: 'মোঃ শফিকুল ইসলাম' }, phone: '01711-013013', area: { en: 'Shibbari Mor', bn: 'শিববাড়ী মোড়' }, reserved: false },
  { ward: 14, name: { en: 'Md. Golam Mostafa', bn: 'মোঃ গোলাম মোস্তফা' }, phone: '01711-014014', area: { en: 'Royal Mor', bn: 'রয়্যাল মোড়' }, reserved: false },
  { ward: 15, name: { en: 'Md. Kazi Enamul Haque', bn: 'মোঃ কাজী এনামুল হক' }, phone: '01711-015015', area: { en: 'Picture Palace Mor', bn: 'পিকচার প্যালেস মোড়' }, reserved: false },
  { ward: 16, name: { en: 'Md. Ashraful Alam', bn: 'মোঃ আশরাফুল আলম' }, phone: '01711-016016', area: { en: 'Tutpara Main Road', bn: 'টুটপাড়া মেইন রোড' }, reserved: false },
  { ward: 17, name: { en: 'Md. Sheikh Hafizur Rahman', bn: 'শেখ হাফিজুর রহমান' }, phone: '01711-017017', area: { en: 'Tutpara Central Road', bn: 'টুটপাড়া সেন্ট্রাল রোড' }, reserved: false },
  { ward: 18, name: { en: 'Md. Zakir Hossain', bn: 'মোঃ জাকির হোসেন' }, phone: '01711-018018', area: { en: 'Boro Bazar', bn: 'বড় বাজার' }, reserved: false },
  { ward: 19, name: { en: 'Md. Saiful Islam', bn: 'মোঃ সাইফুল ইসলাম' }, phone: '01711-019019', area: { en: 'Helatala Road', bn: 'হেলাতলা রোড' }, reserved: false },
  { ward: 20, name: { en: 'Md. Motiar Rahman', bn: 'মোঃ মতিয়ার রহমান' }, phone: '01711-020020', area: { en: 'Rupsha Ghat', bn: 'রূপসা ঘাট' }, reserved: false },
  { ward: 21, name: { en: 'Md. Nasir Uddin', bn: 'মোঃ নাসির উদ্দিন' }, phone: '01711-021021', area: { en: 'Rupsha Stand Road', bn: 'রূপসা স্ট্যান্ড রোড' }, reserved: false },
  { ward: 22, name: { en: 'Md. Kamal Hossain', bn: 'মোঃ কামাল হোসেন' }, phone: '01711-022022', area: { en: 'Gollamari', bn: 'গল্লামারী' }, reserved: false },
  { ward: 23, name: { en: 'Md. Ariful Islam', bn: 'মোঃ আরিফুল ইসলাম' }, phone: '01711-023023', area: { en: 'Sonadanga Bus Terminal', bn: 'সোনাডাঙ্গা বাস টার্মিনাল' }, reserved: false },
  { ward: 24, name: { en: 'Md. Rezaul Karim', bn: 'মোঃ রেজাউল করিম' }, phone: '01711-024024', area: { en: 'Moylapota', bn: 'ময়লাপোতা' }, reserved: false },
  { ward: 25, name: { en: 'Md. Shahin Alam', bn: 'মোঃ শাহীন আলম' }, phone: '01711-025025', area: { en: 'Doulatpur Deyana', bn: 'দৌলতপুর দেয়ানা' }, reserved: false },
  { ward: 26, name: { en: 'Md. Iqbal Hossain', bn: 'মোঃ ইকবাল হোসেন' }, phone: '01711-026026', area: { en: 'Mujgunni', bn: 'মুজগুন্নী' }, reserved: false },
  { ward: 27, name: { en: 'Md. Faruk Ahmed', bn: 'মোঃ ফারুক আহমেদ' }, phone: '01711-027027', area: { en: 'Nirjhor Residential', bn: 'নির্ঝর আবাসিক' }, reserved: false },
  { ward: 28, name: { en: 'Md. Alamgir Kabir', bn: 'মোঃ আলমগীর কবির' }, phone: '01711-028028', area: { en: 'Labanchara', bn: 'লবণচরা' }, reserved: false },
  { ward: 29, name: { en: 'Md. Abdur Rob', bn: 'মোঃ আব্দুর রব' }, phone: '01711-029029', area: { en: 'Banargati', bn: 'বানরগাতী' }, reserved: false },
  { ward: 30, name: { en: 'Md. Selim Reza', bn: 'মোঃ সেলিম রেজা' }, phone: '01711-030030', area: { en: 'Horintana', bn: 'হরিণটানা' }, reserved: false },
  { ward: 31, name: { en: 'Md. Tanvir Ahmed', bn: 'মোঃ তানভীর আহমেদ' }, phone: '01711-031031', area: { en: 'Jorakhali', bn: 'জোড়াখালী' }, reserved: false },
  { ward: '1,2,3', name: { en: 'Mrs. Rehana Parvin', bn: 'মিসেস রেহানা পারভীন' }, phone: '01711-201201', area: { en: 'Reserved seat — Wards 1, 2, 3', bn: 'সংরক্ষিত আসন — ওয়ার্ড 1, 2, 3' }, reserved: true },
  { ward: '4,5,6', name: { en: 'Mrs. Shirin Akhter', bn: 'মিসেস শিরীন আক্তার' }, phone: '01711-202202', area: { en: 'Reserved seat — Wards 4, 5, 6', bn: 'সংরক্ষিত আসন — ওয়ার্ড 4, 5, 6' }, reserved: true },
  { ward: '7,8,9', name: { en: 'Mrs. Nasima Begum', bn: 'মিসেস নাসিমা বেগম' }, phone: '01711-203203', area: { en: 'Reserved seat — Wards 7, 8, 9', bn: 'সংরক্ষিত আসন — ওয়ার্ড 7, 8, 9' }, reserved: true },
  { ward: '10,11,12', name: { en: 'Mrs. Rowshan Ara', bn: 'মিসেস রওশন আরা' }, phone: '01711-204204', area: { en: 'Reserved seat — Wards 10, 11, 12', bn: 'সংরক্ষিত আসন — ওয়ার্ড 10, 11, 12' }, reserved: true },
  { ward: '13,14,15', name: { en: 'Mrs. Fatema Khatun', bn: 'মিসেস ফাতেমা খাতুন' }, phone: '01711-205205', area: { en: 'Reserved seat — Wards 13, 14, 15', bn: 'সংরক্ষিত আসন — ওয়ার্ড 13, 14, 15' }, reserved: true },
  { ward: '16,17,18', name: { en: 'Mrs. Salma Begum', bn: 'মিসেস সালমা বেগম' }, phone: '01711-206206', area: { en: 'Reserved seat — Wards 16, 17, 18', bn: 'সংরক্ষিত আসন — ওয়ার্ড 16, 17, 18' }, reserved: true },
  { ward: '19,20,21', name: { en: 'Mrs. Ayesha Siddika', bn: 'মিসেস আয়েশা সিদ্দিকা' }, phone: '01711-207207', area: { en: 'Reserved seat — Wards 19, 20, 21', bn: 'সংরক্ষিত আসন — ওয়ার্ড 19, 20, 21' }, reserved: true },
  { ward: '22,23,24', name: { en: 'Mrs. Mahmuda Khanam', bn: 'মিসেস মাহমুদা খানম' }, phone: '01711-208208', area: { en: 'Reserved seat — Wards 22, 23, 24', bn: 'সংরক্ষিত আসন — ওয়ার্ড 22, 23, 24' }, reserved: true },
  { ward: '25,26,27', name: { en: 'Mrs. Rokeya Sultana', bn: 'মিসেস রোকেয়া সুলতানা' }, phone: '01711-209209', area: { en: 'Reserved seat — Wards 25, 26, 27', bn: 'সংরক্ষিত আসন — ওয়ার্ড 25, 26, 27' }, reserved: true },
  { ward: '28,29,30,31', name: { en: 'Mrs. Hosne Ara Mitu', bn: 'মিসেস হোসনে আরা মিতু' }, phone: '01711-210210', area: { en: 'Reserved seat — Wards 28, 29, 30, 31', bn: 'সংরক্ষিত আসন — ওয়ার্ড 28, 29, 30, 31' }, reserved: true },
]

// --- Holding tax records -----------------------------------------------------
export const holdings = [
  {
    holdingNo: '03-142-0087',
    owner: { en: 'Md. Abdul Motaleb', bn: 'মোঃ আব্দুল মোতালেব' },
    father: { en: 'Late Abdul Jabbar', bn: 'মৃত আব্দুল জব্বার' },
    nid: '19812694xxxxxx',
    ward: 3,
    mohalla: { en: 'Nirala Residential Area, Ward 3', bn: 'নিরালা আবাসিক এলাকা, ওয়ার্ড ৩' },
    useType: { en: 'Residential (owner occupied)', bn: 'আবাসিক (নিজ ব্যবহার)' },
    landArea: 6.5,
    builtArea: 2400,
    storeys: 2,
    annualValue: 96000,
    rates: { holding: 7, conservancy: 2, lighting: 2, water: 1.5 },
    arrear: 4820,
    lastPaid: '2025-11-12',
    ledger: [
      { year: '2025-26', demand: 12360, paid: 7540, receipt: 'MR-2025-118743', date: '2025-11-12' },
      { year: '2024-25', demand: 11800, paid: 11800, receipt: 'MR-2024-096210', date: '2024-10-02' },
      { year: '2023-24', demand: 11800, paid: 11800, receipt: 'MR-2023-081455', date: '2023-09-28' },
    ],
  },
  {
    holdingNo: '06-078-0219',
    owner: { en: 'Sultana Razia', bn: 'সুলতানা রাজিয়া' },
    father: { en: 'Md. Fazlul Haque', bn: 'মোঃ ফজলুল হক' },
    nid: '19902694xxxxxx',
    ward: 6,
    mohalla: { en: 'Khalishpur Housing Estate', bn: 'খালিশপুর হাউজিং এস্টেট' },
    useType: { en: 'Residential (rented)', bn: 'আবাসিক (ভাড়া)' },
    landArea: 4.0,
    builtArea: 1600,
    storeys: 1,
    annualValue: 72000,
    rates: { holding: 7, conservancy: 2, lighting: 2, water: 1.5 },
    arrear: 0,
    lastPaid: '2026-07-18',
    ledger: [
      { year: '2025-26', demand: 9270, paid: 9270, receipt: 'MR-2026-131002', date: '2026-07-18' },
      { year: '2024-25', demand: 8900, paid: 8900, receipt: 'MR-2024-097331', date: '2024-09-11' },
    ],
  },
  {
    holdingNo: '12-311-0044',
    owner: { en: 'Rupsha Traders', bn: 'রূপসা ট্রেডার্স' },
    father: { en: '—', bn: '—' },
    nid: '—',
    ward: 12,
    mohalla: { en: 'Khan Jahan Ali Road', bn: 'খান জাহান আলী রোড' },
    useType: { en: 'Commercial', bn: 'বাণিজ্যিক' },
    landArea: 3.2,
    builtArea: 3100,
    storeys: 3,
    annualValue: 264000,
    rates: { holding: 7, conservancy: 2, lighting: 2, water: 1.5 },
    arrear: 21400,
    lastPaid: '2024-12-30',
    ledger: [
      { year: '2025-26', demand: 33990, paid: 12590, receipt: 'MR-2025-120884', date: '2025-12-30' },
      { year: '2024-25', demand: 31200, paid: 31200, receipt: 'MR-2024-098012', date: '2024-12-30' },
    ],
  },
  {
    holdingNo: '18-005-0301',
    owner: { en: 'Md. Shahjahan Ali', bn: 'মোঃ শাহজাহান আলী' },
    father: { en: 'Md. Sultan Ali', bn: 'মোঃ সুলতান আলী' },
    nid: '19752694xxxxxx',
    ward: 18,
    mohalla: { en: 'Boro Bazar, Helatala Road', bn: 'বড় বাজার, হেলাতলা রোড' },
    useType: { en: 'Mixed (residential + shop)', bn: 'মিশ্র (আবাসিক + দোকান)' },
    landArea: 5.0,
    builtArea: 2050,
    storeys: 2,
    annualValue: 132000,
    rates: { holding: 7, conservancy: 2, lighting: 2, water: 1.5 },
    arrear: 1690,
    lastPaid: '2026-02-09',
    ledger: [
      { year: '2025-26', demand: 16995, paid: 15305, receipt: 'MR-2026-125541', date: '2026-02-09' },
      { year: '2024-25', demand: 16100, paid: 16100, receipt: 'MR-2024-099887', date: '2024-11-19' },
    ],
  },
]

// --- Grievance tracking ------------------------------------------------------
export const complaints = [
  {
    id: 'GRV-2026-00817',
    date: '2026-08-24',
    category: { en: 'Street lighting', bn: 'সড়কবাতি' },
    subject: { en: 'Three street lights out near the Ward 14 Shibbari intersection', bn: 'ওয়ার্ড ১৪ শিববাড়ী মোড়ের কাছে তিনটি সড়কবাতি নষ্ট' },
    status: 'in-progress',
    timeline: [
      { at: '2026-08-24', label: { en: 'Complaint received', bn: 'অভিযোগ গৃহীত' } },
      { at: '2026-08-25', label: { en: 'Assigned to Electrical Section', bn: 'বিদ্যুৎ শাখায় প্রেরিত' } },
      { at: '2026-08-28', label: { en: 'Site inspection completed', bn: 'সরেজমিন পরিদর্শন সম্পন্ন' } },
    ],
  },
  {
    id: 'GRV-2026-00755',
    date: '2026-08-02',
    category: { en: 'Waste collection', bn: 'বর্জ্য সংগ্রহ' },
    subject: { en: 'Garbage not collected for five days in Tutpara Central Road lane 4', bn: 'টুটপাড়া সেন্ট্রাল রোডের ৪ নম্বর গলিতে পাঁচ দিন বর্জ্য সংগ্রহ হয়নি' },
    status: 'resolved',
    timeline: [
      { at: '2026-08-02', label: { en: 'Complaint received', bn: 'অভিযোগ গৃহীত' } },
      { at: '2026-08-03', label: { en: 'Assigned to Conservancy Section', bn: 'পরিচ্ছন্নতা শাখায় প্রেরিত' } },
      { at: '2026-08-05', label: { en: 'Collection resumed, complaint resolved', bn: 'সংগ্রহ পুনরায় শুরু, অভিযোগ নিষ্পত্তি' } },
    ],
  },
  {
    id: 'GRV-2026-00902',
    date: '2026-09-01',
    category: { en: 'Water supply', bn: 'পানি সরবরাহ' },
    subject: { en: 'Low water pressure in Labanchara since last week', bn: 'গত সপ্তাহ থেকে লবণচরায় পানির চাপ কম' },
    status: 'received',
    timeline: [{ at: '2026-09-01', label: { en: 'Complaint received', bn: 'অভিযোগ গৃহীত' } }],
  },
]

export const complaintCategories = [
  { value: 'water', label: { en: 'Water supply', bn: 'পানি সরবরাহ' } },
  { value: 'waste', label: { en: 'Waste collection', bn: 'বর্জ্য সংগ্রহ' } },
  { value: 'road', label: { en: 'Road & drainage', bn: 'সড়ক ও ড্রেনেজ' } },
  { value: 'light', label: { en: 'Street lighting', bn: 'সড়কবাতি' } },
  { value: 'tax', label: { en: 'Holding tax & assessment', bn: 'হোল্ডিং ট্যাক্স ও মূল্যায়ন' } },
  { value: 'licence', label: { en: 'Trade licence', bn: 'ট্রেড লাইসেন্স' } },
  { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
]

export const billTypes = [
  { value: 'holding', label: { en: 'Holding Tax', bn: 'হোল্ডিং ট্যাক্স' } },
  { value: 'water', label: { en: 'Water Bill', bn: 'পানির বিল' } },
  { value: 'licence', label: { en: 'Trade Licence Fee', bn: 'ট্রেড লাইসেন্স ফি' } },
  { value: 'lease', label: { en: 'Market Lease Rent', bn: 'বাজার ইজারা ভাড়া' } },
  { value: 'plan', label: { en: 'Building Plan Fee', bn: 'ইমারত নকশা ফি' } },
]

export const paymentChannels = [
  { value: 'bkash', label: 'bKash', icon: '📱' },
  { value: 'nagad', label: 'Nagad', icon: '📲' },
  { value: 'rocket', label: 'Rocket', icon: '🚀' },
  { value: 'card', label: { en: 'Debit / Credit Card', bn: 'ডেবিট / ক্রেডিট কার্ড' }, icon: '💳' },
  { value: 'bank', label: { en: 'Internet Banking', bn: 'ইন্টারনেট ব্যাংকিং' }, icon: '🏦' },
]

export const steps = [
  { n: 1, icon: '🔎', title: { en: 'Find your service', bn: 'সেবা খুঁজুন' }, text: { en: 'Browse the catalogue or search by holding, licence or application number.', bn: 'সেবার তালিকা দেখুন অথবা হোল্ডিং, লাইসেন্স বা আবেদন নম্বর দিয়ে খুঁজুন।' } },
  { n: 2, icon: '📝', title: { en: 'Submit the application', bn: 'আবেদন দাখিল করুন' }, text: { en: 'Fill the online form and upload the listed documents. No paper copy needed.', bn: 'অনলাইন ফরম পূরণ করে তালিকাভুক্ত কাগজপত্র আপলোড করুন। কাগজের কপি লাগবে না।' } },
  { n: 3, icon: '💳', title: { en: 'Pay the fee', bn: 'ফি পরিশোধ করুন' }, text: { en: 'Pay through bKash, Nagad, Rocket, card or internet banking and get an instant receipt.', bn: 'বিকাশ, নগদ, রকেট, কার্ড বা ইন্টারনেট ব্যাংকিংয়ে পরিশোধ করে তাৎক্ষণিক রসিদ নিন।' } },
  { n: 4, icon: '📬', title: { en: 'Track and collect', bn: 'ট্র্যাক করুন ও সংগ্রহ করুন' }, text: { en: 'Follow each approval stage online and download the signed certificate when ready.', bn: 'প্রতিটি অনুমোদনের ধাপ অনলাইনে দেখুন এবং প্রস্তুত হলে স্বাক্ষরিত সনদ ডাউনলোড করুন।' } },
]

export const officials = [
  { role: { en: 'Mayor', bn: 'মেয়র' }, name: { en: 'Engr. Md. Nazrul Islam', bn: 'প্রকৌশলী মোঃ নজরুল ইসলাম' }, phone: '041-720000', email: 'mayor@khulnacity.gov.bd' },
  { role: { en: 'Chief Executive Officer', bn: 'প্রধান নির্বাহী কর্মকর্তা' }, name: { en: 'Md. Kamrul Hasan', bn: 'মোঃ কামরুল হাসান' }, phone: '041-720001', email: 'ceo@khulnacity.gov.bd' },
  { role: { en: 'Chief Engineer', bn: 'প্রধান প্রকৌশলী' }, name: { en: 'Engr. Sabbir Ahmed', bn: 'প্রকৌশলী সাব্বির আহমেদ' }, phone: '041-720002', email: 'ce@khulnacity.gov.bd' },
  { role: { en: 'Chief Revenue Officer', bn: 'প্রধান রাজস্ব কর্মকর্তা' }, name: { en: 'Md. Ruhul Amin', bn: 'মোঃ রুহুল আমিন' }, phone: '041-720003', email: 'revenue@khulnacity.gov.bd' },
  { role: { en: 'Secretary', bn: 'সচিব' }, name: { en: 'Md. Aminul Haque', bn: 'মোঃ আমিনুল হক' }, phone: '041-720004', email: 'secretary@khulnacity.gov.bd' },
]

export const modules = [
  { en: 'Holding Tax & Assessment', bn: 'হোল্ডিং ট্যাক্স ও মূল্যায়ন' },
  { en: 'Trade Licence', bn: 'ট্রেড লাইসেন্স' },
  { en: 'Birth & Death Registration', bn: 'জন্ম ও মৃত্যু নিবন্ধন' },
  { en: 'Water Billing', bn: 'পানির বিলিং' },
  { en: 'Building Plan Approval', bn: 'ইমারত নকশা অনুমোদন' },
  { en: 'Accounts & Budget', bn: 'হিসাব ও বাজেট' },
  { en: 'Asset & Infrastructure Register', bn: 'সম্পদ ও অবকাঠামো রেজিস্টার' },
  { en: 'Procurement & Contract', bn: 'ক্রয় ও চুক্তি' },
  { en: 'Human Resource & Payroll', bn: 'মানবসম্পদ ও বেতন' },
  { en: 'Grievance Redress System', bn: 'অভিযোগ নিষ্পত্তি ব্যবস্থা' },
]
