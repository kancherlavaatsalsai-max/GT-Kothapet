/**
 * GREEN TRENDS UNISEX HAIR & STYLE SALON - KOTHAPET
 * Unified POS, Daily Bills Ledger (Pic 1 Inspired), Staff Tracker & Client Calendar
 * Appointments Manager (Pic 206) & Booking Workspace with Live Customer History (Pic 207)
 * Official Franchise Billing Engine for PAMKARA BEAUTY LLP (GST No: 36ABIFP3743L1ZT)
 */

// Application State
const state = {
  cart: [],
  customer: {
    name: '',
    phone: '',
    gender: 'all',
    isMember: false,
    stylist: 'Islam'
  },
  discounts: {
    otherDiscount: 0
  },
  // Discount Presets & Admin Security PIN
  adminPin: localStorage.getItem('gt_admin_pin') || '1234',
  adminPinEntered: '',
  isAdminUnlocked: false,
  discountPresets: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gt_discount_presets') || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return [5, 10, 15, 20];
  })(),
  selectedDiscountPreset: null,
  posFilter: {
    search: '',
    gender: 'all',
    category: 'all'
  },
  payment: {
    mode: 'upi',
    splitCash: 0,
    splitCard: 0,
    splitUpi: 0
  },
  // Appointments System
  appointments: [],
  bookingCart: [],
  services: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gt_custom_services') || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return (typeof SALON_SERVICES !== 'undefined' ? SALON_SERVICES : []);
  })(),
  staff: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gt_custom_staff') || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return (typeof SALON_STAFF !== 'undefined' ? SALON_STAFF : []);
  })(),
  activeBillingApptId: null,
  apptFilter: 'open', // open, closed, all_today, upcoming, all
  apptSearchQuery: '',
  activeBookingApptId: null, // if editing an existing open appointment
  // Services Catalog Modal Filters
  modalFilter: {
    search: '',
    gender: 'all',
    category: 'all'
  },
  // Calendar Date Filter for Pic 1 Daily Bills & Appointments (Default: all dates to show all appointments)
  calendarFilter: {
    preset: 'all', // today, yesterday, last7, thisMonth, all, custom
    startDate: null,
    endDate: null
  },
  // MSI / Salon Intelligence Date Range (Default: whole current month MTD)
  dashDateRange: (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    return {
      preset: 'mtd',
      start: `${y}-${m}-01`,
      end: `${y}-${m}-${String(lastDay).padStart(2, '0')}`
    };
  })(),
  // Custom Popover Calendar State (matching user reference image)
  customCal: {
    target: 'appointments', // 'appointments', 'dailyBills', 'clientsCalendar', or 'msi'
    year: 2026,
    month: 9, // October 2026 (0-indexed: 9 = October)
    startDate: null,
    endDate: null,
    pickingStep: 'start',
    clientRangeStart: null,
    clientRangeEnd: null
  },
  invoicesTableSearch: '',
  clientCalendarSearch: '',
  invoices: [],
  customers: {},
  theme: localStorage.getItem('gt_billing_theme') || 'light',
  currentViewingInvoice: null,
  pendingClient: null,
  // Terminal Authentication & Staff Manager Integration
  session: (() => {
    try {
      let s = JSON.parse(localStorage.getItem('gt_billing_session') || 'null');
      if (!s || s.user === 'KALYAN' || s.user === 'Kalyan' || s.id === 'staff_1') {
        s = { id: 'owner_1', user: 'Owner', role: 'Salon Owner', avatar: 'O' };
        try { localStorage.setItem('gt_billing_session', JSON.stringify(s)); } catch(_) {}
      }
      return s;
    } catch(e) {
      const def = { id: 'owner_1', user: 'Owner', role: 'Salon Owner', avatar: 'O' };
      try { localStorage.setItem('gt_billing_session', JSON.stringify(def)); } catch(_) {}
      return def;
    }
  })(),
  incentivesMonth: '2026-09',
  expenses: JSON.parse(localStorage.getItem('gt_kothapet_petty_cash_v1') || '[]'),
  isBookingMembershipCardAdded: false,
  closeShopConfig: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gt_close_shop_config_v1') || 'null');
      if (saved && typeof saved === 'object') return saved;
    } catch (_) {}
    return {
      phone: '7416432014',
      header: 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT',
      signoff: '✅ Shop Closed Successfully. Verified by Store Manager.',
      includeGrossNet: true,
      includePayment: true,
      includeInvoices: true,
      includeServices: true,
      includeRetail: true,
      includeCards: true,
      includeStaff: true
    };
  })()
};

// Month Names for Custom Calendar
const CAL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Initial Invoices Dataset (Incorporating User's Uploaded Franchise Tax Invoice & Pic 1 Data)
const INITIAL_INVOICES = [
  // 1. TODAY (04-10-2026) - Invoices matching User's Pic 1 (11 Closed Appointments)
  {
    invoiceId: '992',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 06:45 PM',
    timestamp: '2026-10-04T18:45:00.000Z',
    customer: { name: 'SRINIVAS', phone: '9849011223', gender: 'male', isMember: true },
    desc: 'THREADING - EYEBROW - (LADIES)',
    gross: 567.00,
    basicSales: 567.00,
    memDiscount: 105.00,
    otherDiscount: 0.00,
    net: 462.00,
    gstAmount: 23.10,
    cgst: 11.55,
    sgst: 11.55,
    roundOff: -0.10,
    billAmount: 485.00,
    tenderAmount: 485.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 485.00,
    items: [
      { name: 'Threading - Eyebrow - (Ladies)', stylistName: 'Reshma', priceUsed: 462.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '991',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 05:30 PM',
    timestamp: '2026-10-04T17:30:00.000Z',
    customer: { name: 'SRIJITH', phone: '9849122334', gender: 'male', isMember: true },
    desc: '24 KARAT GOLD-ULTIME DOUBLE MASK FACIAL - WOMEN',
    gross: 3837.75,
    basicSales: 3837.75,
    memDiscount: 724.00,
    otherDiscount: 0.00,
    net: 3113.75,
    gstAmount: 155.69,
    cgst: 77.845,
    sgst: 77.845,
    roundOff: -0.44,
    billAmount: 3269.00,
    tenderAmount: 3269.00,
    referral: 'Live',
    paymentMode: 'card',
    splitCash: 0, splitCard: 3269.00, splitUpi: 0,
    items: [
      { name: '24 Karat Gold-Ultime Double Mask Facial - Women', stylistName: 'Afrin', priceUsed: 3113.75, quantity: 1 }
    ]
  },
  {
    invoiceId: '990',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 04:15 PM',
    timestamp: '2026-10-04T16:15:00.000Z',
    customer: { name: 'SULEMAN', phone: '9908123456', gender: 'male', isMember: false },
    desc: 'SHAVE - (GENTS)',
    gross: 118.65,
    basicSales: 118.65,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 118.65,
    gstAmount: 5.93,
    cgst: 2.97,
    sgst: 2.97,
    roundOff: 0.42,
    billAmount: 125.00,
    tenderAmount: 125.00,
    referral: 'Live',
    paymentMode: 'cash',
    splitCash: 125.00, splitCard: 0, splitUpi: 0,
    items: [
      { name: 'Shave - (Gents)', stylistName: 'Islam', priceUsed: 118.65, quantity: 1 }
    ]
  },
  {
    invoiceId: '989',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 03:00 PM',
    timestamp: '2026-10-04T15:00:00.000Z',
    customer: { name: 'SUDHAMSH', phone: '9849556677', gender: 'male', isMember: true },
    desc: 'HAIR CUT - (GENTS)',
    gross: 338.10,
    basicSales: 338.10,
    memDiscount: 57.00,
    otherDiscount: 0.00,
    net: 281.10,
    gstAmount: 14.06,
    cgst: 7.03,
    sgst: 7.03,
    roundOff: -0.16,
    billAmount: 295.00,
    tenderAmount: 295.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 295.00,
    items: [
      { name: 'Hair Cut - (Gents)', stylistName: 'Islam', priceUsed: 281.10, quantity: 1 }
    ]
  },
  {
    invoiceId: '988',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 02:10 PM',
    timestamp: '2026-10-04T14:10:00.000Z',
    customer: { name: 'SAHITYA', phone: '9988776655', gender: 'female', isMember: false },
    desc: 'HAIRCUT - ADVANCED - (LADIES)',
    gross: 1728.30,
    basicSales: 1728.30,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 1728.30,
    gstAmount: 86.42,
    cgst: 43.21,
    sgst: 43.21,
    roundOff: 0.28,
    billAmount: 1815.00,
    tenderAmount: 1815.00,
    referral: 'Live',
    paymentMode: 'card',
    splitCash: 0, splitCard: 1815.00, splitUpi: 0,
    items: [
      { name: 'Haircut - Advanced - (Ladies)', stylistName: 'Aruna', priceUsed: 1728.30, quantity: 1 }
    ]
  },
  {
    invoiceId: '987',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 01:00 PM',
    timestamp: '2026-10-04T13:00:00.000Z',
    customer: { name: 'MAHENDHRA', phone: '9700112233', gender: 'male', isMember: false },
    desc: 'HAIR CUT - (GENTS)',
    gross: 279.30,
    basicSales: 279.30,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 279.30,
    gstAmount: 13.97,
    cgst: 6.98,
    sgst: 6.98,
    roundOff: -0.27,
    billAmount: 293.00,
    tenderAmount: 293.00,
    referral: 'Live',
    paymentMode: 'cash',
    splitCash: 293.00, splitCard: 0, splitUpi: 0,
    items: [
      { name: 'Hair Cut - (Gents)', stylistName: 'Iqram', priceUsed: 279.30, quantity: 1 }
    ]
  },
  {
    invoiceId: '986',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 12:15 PM',
    timestamp: '2026-10-04T12:15:00.000Z',
    customer: { name: 'POOJA', phone: '9944332211', gender: 'female', isMember: true },
    desc: 'EYEBROW + UPPERLIP + CLEANUP',
    gross: 1045.00,
    basicSales: 1045.00,
    memDiscount: 200.00,
    otherDiscount: 0.00,
    net: 845.00,
    gstAmount: 42.25,
    cgst: 21.125,
    sgst: 21.125,
    roundOff: -0.25,
    billAmount: 887.00,
    tenderAmount: 887.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 887.00,
    items: [
      { name: 'Eyebrow + Upperlip + Cleanup', stylistName: 'Reshma', priceUsed: 845.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '985',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 11:30 AM',
    timestamp: '2026-10-04T11:30:00.000Z',
    customer: { name: 'KISHORE', phone: '9849223344', gender: 'male', isMember: false },
    desc: 'BOTANICAL HAIR SPA + SHAVE',
    gross: 1450.00,
    basicSales: 1450.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 1450.00,
    gstAmount: 72.50,
    cgst: 36.25,
    sgst: 36.25,
    roundOff: 0.50,
    billAmount: 1523.00,
    tenderAmount: 1523.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 1523.00,
    items: [
      { name: 'Botanical Hair & Scalp Therapy', stylistName: 'Islam', priceUsed: 1450.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '984',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 10:45 AM',
    timestamp: '2026-10-04T10:45:00.000Z',
    customer: { name: 'DEEPTHI', phone: '9988112233', gender: 'female', isMember: true },
    desc: 'ADVANCED PEDICURE & MANICURE',
    gross: 1980.00,
    basicSales: 1980.00,
    memDiscount: 300.00,
    otherDiscount: 0.00,
    net: 1680.00,
    gstAmount: 84.00,
    cgst: 42.00,
    sgst: 42.00,
    roundOff: 0.00,
    billAmount: 1764.00,
    tenderAmount: 1764.00,
    referral: 'Live',
    paymentMode: 'card',
    splitCash: 0, splitCard: 1764.00, splitUpi: 0,
    items: [
      { name: 'Ice Cream Pedicure & Manicure', stylistName: 'Afrin', priceUsed: 1680.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '983',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 10:15 AM',
    timestamp: '2026-10-04T10:15:00.000Z',
    customer: { name: 'PRANAY', phone: '9700554433', gender: 'male', isMember: false },
    desc: 'BEARD TRIM & HEAD MASSAGE',
    gross: 550.00,
    basicSales: 550.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 550.00,
    gstAmount: 27.50,
    cgst: 13.75,
    sgst: 13.75,
    roundOff: 0.50,
    billAmount: 578.00,
    tenderAmount: 578.00,
    referral: 'Live',
    paymentMode: 'cash',
    splitCash: 578.00, splitCard: 0, splitUpi: 0,
    items: [
      { name: 'Beard Design & Trim', stylistName: 'Islam', priceUsed: 550.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '982',
    dateStr: '04-10-2026',
    billTimeStr: '04/10/2026 09:30 AM',
    timestamp: '2026-10-04T09:30:00.000Z',
    customer: { name: 'RAVI TEJA', phone: '9849776655', gender: 'male', isMember: true },
    desc: 'CHARCOAL DEEP DETOX FACIAL',
    gross: 1850.00,
    basicSales: 1850.00,
    memDiscount: 350.00,
    otherDiscount: 0.00,
    net: 1500.00,
    gstAmount: 75.00,
    cgst: 37.50,
    sgst: 37.50,
    roundOff: 0.00,
    billAmount: 1575.00,
    tenderAmount: 1575.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 1575.00,
    items: [
      { name: 'Charcoal Deep Detox Facial', stylistName: 'Reshma', priceUsed: 1500.00, quantity: 1 }
    ]
  },

  // 2. OFFICIAL FRANCHISE INVOICE DIRECTLY FROM USER UPLOADED PDF (Invoice #753)
  {
    invoiceId: '753',
    dateStr: '18-08-2026',
    billTimeStr: '18/08/2026 04:01 PM',
    timestamp: '2026-08-18T16:01:00.000Z',
    customer: { name: 'SHARATH KUMAR', phone: '9246309794', gender: 'male', isMember: false },
    desc: 'NANOPLASTA SILKY SHINE TREATMENT + SYSTEM PROFESSIONAL ANTI HAIR LOSS + FLAWLESS BRIDAL GLOW FACIAL',
    gross: 19426.00,
    basicSales: 19426.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 19426.00,
    gstAmount: 971.00,
    cgst: 485.65,
    sgst: 485.65,
    roundOff: 0.30,
    billAmount: 20397.00,
    tenderAmount: 20397.00,
    referral: 'Live',
    paymentMode: 'split',
    splitCash: 397.00,
    splitCard: 0.00,
    splitUpi: 20000.00,
    items: [
      { name: 'NANOPLASTA SILKY SHINE TREATMENT', stylistName: 'Islam', priceUsed: 10399.00, quantity: 1 },
      { name: 'SYSTEM PROFESSIONAL ANTI HAIR LOSS', stylistName: 'Iqram', priceUsed: 4447.00, quantity: 1 },
      { name: 'FLAWLESS BRIDAL GLOW FACIAL', stylistName: 'Suleman', priceUsed: 4580.00, quantity: 1 }
    ]
  },

  // 3. Historical Invoices for Sharath Kumar
  {
    invoiceId: '694',
    dateStr: '05-08-2026',
    billTimeStr: '05/08/2026 03:20 PM',
    timestamp: '2026-08-05T15:20:00.000Z',
    customer: { name: 'SHARATH KUMAR', phone: '9246309794', gender: 'male', isMember: false },
    desc: 'ADVANCED HAIR CUT + BEARD STYLING',
    gross: 780.00,
    basicSales: 780.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 780.00,
    gstAmount: 39.00,
    cgst: 19.50,
    sgst: 19.50,
    roundOff: 0.00,
    billAmount: 819.00,
    tenderAmount: 819.00,
    referral: 'Live',
    paymentMode: 'upi',
    splitCash: 0, splitCard: 0, splitUpi: 819.00,
    items: [
      { name: 'Hair Cut Advanced (Gents)', stylistName: 'Islam', priceUsed: 447.00, quantity: 1 },
      { name: 'Beard Design & Trim', stylistName: 'Islam', priceUsed: 333.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '612',
    dateStr: '22-07-2026',
    billTimeStr: '22/07/2026 11:30 AM',
    timestamp: '2026-07-22T11:30:00.000Z',
    customer: { name: 'SHARATH KUMAR', phone: '9246309794', gender: 'male', isMember: false },
    desc: 'DE-TAN FACE THERAPY + BOTANICAL HEAD MASSAGE',
    gross: 1850.00,
    basicSales: 1850.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 1850.00,
    gstAmount: 92.50,
    cgst: 46.25,
    sgst: 46.25,
    roundOff: -0.50,
    billAmount: 1942.00,
    tenderAmount: 1942.00,
    referral: 'Live',
    paymentMode: 'card',
    splitCash: 0, splitCard: 1942.00, splitUpi: 0,
    items: [
      { name: 'De-Tan Face Therapy - Men', stylistName: 'Afrin', priceUsed: 950.00, quantity: 1 },
      { name: 'Botanical Hair & Scalp Therapy', stylistName: 'Aruna', priceUsed: 900.00, quantity: 1 }
    ]
  },
  {
    invoiceId: '540',
    dateStr: '10-06-2026',
    billTimeStr: '10/06/2026 05:45 PM',
    timestamp: '2026-06-10T17:45:00.000Z',
    customer: { name: 'SHARATH KUMAR', phone: '9246309794', gender: 'male', isMember: false },
    desc: 'HAIRCUT + BEARD + EXECUTIVE CHARCOAL DETAN',
    gross: 2150.00,
    basicSales: 2150.00,
    memDiscount: 0.00,
    otherDiscount: 0.00,
    net: 2150.00,
    gstAmount: 107.50,
    cgst: 53.75,
    sgst: 53.75,
    roundOff: -0.50,
    billAmount: 2257.00,
    tenderAmount: 2257.00,
    referral: 'Live',
    paymentMode: 'cash',
    splitCash: 2257.00, splitCard: 0, splitUpi: 0,
    items: [
      { name: 'Hair Cut Advanced (Gents)', stylistName: 'Islam', priceUsed: 447.00, quantity: 1 },
      { name: 'Charcoal Deep Detox Facial', stylistName: 'Reshma', priceUsed: 1703.00, quantity: 1 }
    ]
  }
];

// Seed Appointments (Matching Pic 206 Counters: 2 Open Today, 11 Closed Today, 1 Upcoming)
const INITIAL_APPOINTMENTS = [
  {
    id: '1001',
    employee: 'Islam',
    clientName: 'VIKRAM REDDY',
    phone: '9849123456',
    type: 'Walk-in',
    status: 'open',
    descr: 'HAIRCUT - (GENTS) + BEARD TRIM',
    apptDate: '04-10-2026 07:30 PM',
    total: 580.00,
    items: [
      { serviceId: 'm_hc_1', name: 'Hair Cut - (Gents)', originalPrice: 266, membershipPrice: 228, quantity: 1, stylistName: 'Islam' },
      { serviceId: 'm_bd_1', name: 'Beard Design & Trim', originalPrice: 314, membershipPrice: 280, quantity: 1, stylistName: 'Islam' }
    ]
  },
  {
    id: '1002',
    employee: 'Afrin',
    clientName: 'KAVITHA M',
    phone: '9988223344',
    type: 'Walk-in',
    status: 'open',
    descr: 'FRUIT FRESH FACIAL & CLEANUP',
    apptDate: '04-10-2026 08:00 PM',
    total: 1250.00,
    items: [
      { serviceId: 'f_fc_1', name: 'Fruit Fresh Glow Facial - Women', originalPrice: 1250, membershipPrice: 1050, quantity: 1, stylistName: 'Afrin' }
    ]
  },
  {
    id: '1003',
    employee: 'Reshma',
    clientName: 'ANANYA RAO',
    phone: '9700332211',
    type: 'Online',
    status: 'upcoming',
    descr: 'FLAWLESS BRIDAL GLOW FACIAL',
    apptDate: '28-09-2026 10:30 AM',
    total: 4580.00,
    items: [
      { serviceId: 'svc_flawless_bridal_glow', name: 'Flawless Bridal Glow Facial', originalPrice: 4580, membershipPrice: 3999, quantity: 1, stylistName: 'Reshma' }
    ]
  }
];

// Helper Functions: Dynamic Custom Services & Staff Catalog
function getServicesList() {
  if (state.services && state.services.length > 0) return state.services;
  try {
    const saved = JSON.parse(localStorage.getItem('gt_custom_services') || 'null');
    if (Array.isArray(saved) && saved.length > 0) {
      state.services = saved;
      return state.services;
    }
  } catch (_) {}
  if (typeof SALON_SERVICES !== 'undefined' && Array.isArray(SALON_SERVICES)) {
    state.services = [...SALON_SERVICES];
    return state.services;
  }
  return [];
}

function saveServicesList(list) {
  if (list) {
    state.services = list;
  }
  try {
    localStorage.setItem('gt_custom_services', JSON.stringify(state.services || []));
  } catch (e) {
    console.error('Failed to save custom services:', e);
  }
}

function getStaffList() {
  if (state.staff && state.staff.length > 0) return state.staff;
  try {
    const saved = JSON.parse(localStorage.getItem('gt_custom_staff') || 'null');
    if (Array.isArray(saved) && saved.length > 0) {
      state.staff = saved;
      return state.staff;
    }
  } catch (_) {}
  if (typeof SALON_STAFF !== 'undefined' && Array.isArray(SALON_STAFF)) {
    state.staff = [...SALON_STAFF];
    return state.staff;
  }
  return [];
}

function saveStaffList(list) {
  if (list) {
    state.staff = list;
  }
  try {
    localStorage.setItem('gt_custom_staff', JSON.stringify(state.staff || []));
  } catch (e) {
    console.error('Failed to save staff:', e);
  }
}

function isCurrentlyBookingMode() {
  const bookingView = document.getElementById('apptBookingView');
  return Boolean(bookingView && bookingView.style.display !== 'none');
}

function getActiveWorkingCart() {
  return isCurrentlyBookingMode() ? state.bookingCart : state.cart;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  applyTheme(state.theme);
  if (localStorage.getItem('gt_sidebar_collapsed') === 'true') {
    const sb = document.getElementById('appSidebar');
    if (sb) sb.classList.add('collapsed');
    const miniIcon = document.querySelector('#sidebarMiniCollapseBtn i');
    if (miniIcon) miniIcon.className = 'fa-solid fa-chevron-right';
  }
  loadInvoices();
  loadAppointments();
  buildCustomerDatabase();
  bindEvents();

  // Initialize Authentication & Terminal Lock
  renderLoginStaffChips();
  renderAdminStaffList();
  checkAuth();

  // Render Initial Views
  renderAppointmentsDashboard();
  renderDashboardAnalytics();
  renderDailyBillsTable();
  renderClientsCalendarTable();
  renderStaffIncentivesLedger();
  renderSalesAnalyticsDashboard();
  renderPettyCashDashboard();
  renderStaffPortalDiagnostics();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
}

// Live Clock
function updateLiveClock() {
  const clock = document.getElementById('liveClockText');
  if (clock) {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }
}

// Theme
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('gt_billing_theme', theme);
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggleBtn');
  const topToggleBtn = document.getElementById('btnTopThemeToggle');
  const topIcon = document.getElementById('topThemeIcon');
  const topLabel = document.getElementById('topThemeLabel');

  if (theme === 'light') {
    body.classList.add('light-theme');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> <span id="themeToggleLabel">Dark Mode</span>';
    if (topIcon) topIcon.className = 'fa-solid fa-moon';
    if (topLabel) topLabel.textContent = 'Dark Mode';
  } else {
    body.classList.remove('light-theme');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> <span id="themeToggleLabel">Light Mode</span>';
    if (topIcon) topIcon.className = 'fa-solid fa-sun';
    if (topLabel) topLabel.textContent = 'Light Mode';
  }
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// Data Persistence
function loadInvoices() {
  const saved = localStorage.getItem('gt_franchise_invoices_v4');
  if (saved) {
    try {
      state.invoices = JSON.parse(saved);
      let migrated = false;
      state.invoices.forEach(inv => {
        if (inv.dateStr === '27-09-2026') {
          inv.dateStr = '04-10-2026';
          if (inv.billTimeStr) inv.billTimeStr = inv.billTimeStr.replace('04/10/2026', '04/10/2026');
          if (inv.timestamp) inv.timestamp = inv.timestamp.replace('2026-10-04', '2026-10-04');
          migrated = true;
        }
      });
      if (migrated) saveInvoices();
    } catch (e) {
      state.invoices = [...INITIAL_INVOICES];
    }
  } else {
    state.invoices = [...INITIAL_INVOICES];
    saveInvoices();
  }
}

function saveInvoices() {
  localStorage.setItem('gt_franchise_invoices_v4', JSON.stringify(state.invoices));
  buildCustomerDatabase();
}

function loadAppointments() {
  const saved = localStorage.getItem('gt_franchise_appts_v4');
  if (saved) {
    try {
      state.appointments = JSON.parse(saved);
      let migrated = false;
      state.appointments.forEach(a => {
        if (a.apptDate && a.apptDate.includes('27-09-2026')) {
          a.apptDate = a.apptDate.replace('04-10-2026', '04-10-2026');
          migrated = true;
        }
      });
      if (migrated) saveAppointments();
    } catch (e) {
      state.appointments = [...INITIAL_APPOINTMENTS];
    }
  } else {
    state.appointments = [...INITIAL_APPOINTMENTS];
    saveAppointments();
  }
}

function saveAppointments() {
  localStorage.setItem('gt_franchise_appts_v4', JSON.stringify(state.appointments));
}

// Customer Loyalty Visit Tiers (8 Tiers: New, Bronze, Silver, Gold, Gold Elite 10+, Diamond 15+, Platinum 20+, Crown Legend 30+)
function getCustomerLoyaltyTier(visits) {
  const v = parseInt(visits) || 0;
  if (v <= 0) {
    return {
      tierKey: 'new',
      tierName: 'New Client',
      badgeClass: 'new',
      miniBadgeClass: 'new-client',
      icon: 'fa-user',
      color: '#f43f5e'
    };
  } else if (v >= 1 && v <= 2) {
    return {
      tierKey: 'bronze',
      tierName: `Bronze Member (${v} Visits 🥉)`,
      badgeClass: 'bronze',
      miniBadgeClass: 'tier-bronze',
      icon: 'fa-award',
      color: '#f59e0b'
    };
  } else if (v >= 3 && v <= 5) {
    return {
      tierKey: 'silver',
      tierName: `Silver Member (${v} Visits 🥈)`,
      badgeClass: 'silver',
      miniBadgeClass: 'tier-silver',
      icon: 'fa-medal',
      color: '#cbd5e1'
    };
  } else if (v >= 6 && v <= 9) {
    return {
      tierKey: 'gold',
      tierName: `Gold Member (${v} Visits 🥇)`,
      badgeClass: 'gold',
      miniBadgeClass: 'tier-gold',
      icon: 'fa-certificate',
      color: '#fbbf24'
    };
  } else if (v >= 10 && v <= 14) {
    return {
      tierKey: 'gold-elite',
      tierName: `Gold Elite (10+ Visits 👑)`,
      badgeClass: 'gold-elite',
      miniBadgeClass: 'tier-gold-elite',
      icon: 'fa-crown',
      color: '#fef08a'
    };
  } else if (v >= 15 && v <= 19) {
    return {
      tierKey: 'diamond',
      tierName: `Diamond Patron (${v} Visits 💎)`,
      badgeClass: 'diamond',
      miniBadgeClass: 'tier-diamond',
      icon: 'fa-gem',
      color: '#38bdf8'
    };
  } else if (v >= 20 && v <= 29) {
    return {
      tierKey: 'platinum',
      tierName: `Platinum Royale (${v} Visits 🔮)`,
      badgeClass: 'platinum',
      miniBadgeClass: 'tier-platinum-royale',
      icon: 'fa-wand-magic-sparkles',
      color: '#c084fc'
    };
  } else {
    // 30+ visits
    return {
      tierKey: 'crown',
      tierName: `Crown Legend (${v} Visits 🏆)`,
      badgeClass: 'crown',
      miniBadgeClass: 'tier-crown',
      icon: 'fa-trophy',
      color: '#34d399'
    };
  }
}

function getActiveClientTier() {
  const phone = (state.customer.phone || '').trim();
  const name = (state.customer.name || '').trim().toLowerCase();
  
  if (phone && state.customers[phone]) {
    return getCustomerLoyaltyTier(state.customers[phone].visits);
  }
  if (name) {
    const found = Object.values(state.customers).find(c => c.name.toLowerCase() === name);
    if (found) return getCustomerLoyaltyTier(found.visits);
  }
  return getCustomerLoyaltyTier(0);
}

function buildCustomerDatabase() {
  const map = {};

  // Seed milestone customers across all 8 tiers so they are immediately visible
  const SEED_CLIENT_MILESTONES = {
    '9849011223': { extraVisits: 13, extraSpend: 11800 }, // SRINIVAS: 14 visits -> Gold Elite 10+
    '9849122334': { extraVisits: 21, extraSpend: 24500 }, // SRIJITH: 22 visits -> Platinum Royale 20+
    '9849556677': { extraVisits: 6, extraSpend: 4200 },   // SUDHAMSH: 7 visits -> Gold Member 6-9
    '9988776655': { extraVisits: 3, extraSpend: 2600 },   // SAHITYA: 4 visits -> Silver Member 3-5
    '9944332211': { extraVisits: 16, extraSpend: 18500 }, // POOJA: 17 visits -> Diamond Patron 15-19
    '9849123456': { extraVisits: 31, extraSpend: 36200 }, // VIKRAM REDDY: 32 visits -> Crown Legend 30+
    '9123456780': { extraVisits: 1, extraSpend: 1200 }    // ANANYA: 2 visits -> Bronze Member 1-2
  };

  state.invoices.forEach(inv => {
    const phone = inv.customer.phone || '9849000000';
    if (!map[phone]) {
      const seed = SEED_CLIENT_MILESTONES[phone] || { extraVisits: 0, extraSpend: 0 };
      map[phone] = {
        name: inv.customer.name,
        phone: phone,
        gender: inv.customer.gender || 'male',
        isMember: Boolean(inv.customer.isMember),
        visits: seed.extraVisits,
        totalSpent: seed.extraSpend,
        firstVisit: inv.dateStr,
        lastVisit: inv.dateStr,
        visitDates: [],
        lastBill: null,
        servicesHistory: []
      };
    }
    map[phone].visits += 1;
    map[phone].totalSpent += (inv.billAmount || inv.net || 0);
    map[phone].visitDates.push(inv.dateStr);
    map[phone].lastVisit = inv.dateStr;
    map[phone].lastBill = inv;
    map[phone].servicesHistory.push({
      date: inv.dateStr,
      desc: inv.desc,
      amount: inv.billAmount || inv.net,
      paymentMode: inv.paymentMode || 'upi'
    });
    if (inv.customer.isMember) map[phone].isMember = true;
  });

  // Calculate Loyalty Tier for each client
  Object.values(map).forEach(c => {
    c.loyaltyTier = getCustomerLoyaltyTier(c.visits);
  });

  state.customers = map;
}

// ============================================================================
// APPOINTMENTS DASHBOARD OVERVIEW (MATCHING USER PIC 206)
// ============================================================================
function renderAppointmentsDashboard() {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  const startIso = (state.calendarFilter.preset !== 'all') ? state.calendarFilter.startDate : null;
  const endIso = (state.calendarFilter.preset !== 'all') ? (state.calendarFilter.endDate || state.calendarFilter.startDate) : null;

  function parseToIso(dateStr) {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.slice(0, 10).split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else if (dateStr.includes('-')) {
      const parts = dateStr.slice(0, 10).split('-');
      if (parts[0].length === 4) return `${parts[0]}-${parts[1]}-${parts[2]}`;
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  function isDateInRange(dateStr) {
    if (!startIso) return true;
    const iso = parseToIso(dateStr);
    if (!iso) return true;
    if (endIso) return iso >= startIso && iso <= endIso;
    return iso >= startIso;
  }

  // Generate rows for closed appointments from invoices matching that date range
  const matchingInvoices = state.invoices.filter(i => isDateInRange(i.dateStr || i.billTimeStr || i.timestamp));
  const closedFromInvoices = matchingInvoices.map(inv => ({
    id: inv.invoiceId,
    employee: inv.items[0]?.stylistName || 'Islam',
    clientName: inv.customer.name,
    phone: inv.customer.phone,
    type: 'Walk-in',
    status: 'closed',
    descr: inv.desc,
    apptDate: inv.billTimeStr || `${inv.dateStr} 04:00 PM`,
    total: inv.billAmount || inv.net,
    invoiceId: inv.invoiceId
  }));

  // Open appointments in queue must ALWAYS be visible so cashier can bill them!
  const openAppts = state.appointments.filter(a => a.status === 'open');
  const closedFromAppts = state.appointments.filter(a => a.status === 'closed' && isDateInRange(a.apptDate));
  const closedApptsCount = closedFromInvoices.length + closedFromAppts.length;
  const upcomingAppts = state.appointments.filter(a => a.status === 'upcoming' && isDateInRange(a.apptDate));

  const openCount = openAppts.length;
  const closedCount = closedApptsCount;
  const upcomingCount = upcomingAppts.length;

  const elOpenToday = document.getElementById('apptKpiOpenToday');
  if (elOpenToday) elOpenToday.textContent = openCount;
  const elOpenAppt = document.getElementById('apptKpiOpenAppt');
  if (elOpenAppt) elOpenAppt.textContent = openCount;
  const elOpenOnline = document.getElementById('apptKpiOpenOnline');
  if (elOpenOnline) elOpenOnline.textContent = 0;

  const elClosedToday = document.getElementById('apptKpiClosedToday');
  if (elClosedToday) elClosedToday.textContent = closedCount;
  const elClosedAppt = document.getElementById('apptKpiClosedAppt');
  if (elClosedAppt) elClosedAppt.textContent = closedCount;
  const elClosedOnline = document.getElementById('apptKpiClosedOnline');
  if (elClosedOnline) elClosedOnline.textContent = 0;

  const elUpToday = document.getElementById('apptKpiUpcomingToday');
  if (elUpToday) elUpToday.textContent = upcomingCount;
  const elUpAppt = document.getElementById('apptKpiUpcomingAppt');
  if (elUpAppt) elUpAppt.textContent = upcomingCount;
  const elUpOnline = document.getElementById('apptKpiUpcomingOnline');
  if (elUpOnline) elUpOnline.textContent = 0;

  // Filter Table List
  const filter = state.apptFilter;
  const query = state.apptSearchQuery.toLowerCase().trim();

  let filtered = [];
  if (filter === 'open') {
    filtered = openAppts;
  } else if (filter === 'closed') {
    filtered = closedFromInvoices;
  } else if (filter === 'upcoming') {
    filtered = upcomingAppts;
  } else if (filter === 'all_today') {
    filtered = [...openAppts, ...closedFromInvoices];
  } else {
    // All
    filtered = [...activeAppts, ...closedFromInvoices];
  }

  // Search Filter
  if (query) {
    filtered = filtered.filter(a => 
      a.id.toLowerCase().includes(query) ||
      a.clientName.toLowerCase().includes(query) ||
      a.employee.toLowerCase().includes(query) ||
      (a.descr && a.descr.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:3rem 1rem; color:var(--text-subtle);">
          <i class="fa-regular fa-calendar-check" style="font-size:2.2rem; opacity:0.3; margin-bottom:0.6rem; display:block;"></i>
          No appointments found under "${filter.replace('_', ' ').toUpperCase()}"
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const isClosed = a.status === 'closed';
    return `
      <tr>
        <td><strong>#${a.id}</strong></td>
        <td>${escapeHTML(a.employee)}</td>
        <td><strong>${escapeHTML(a.clientName)}</strong></td>
        <td><span class="location-pill" style="font-size:0.68rem;">${a.type}</span></td>
        <td>${a.apptDate}</td>
        <td><strong>₹${a.total.toFixed(2)}</strong></td>
        <td style="text-align:center;">
          ${isClosed ? `
            <button type="button" class="pic1-btn-view" onclick="viewInvoiceReceipt('${a.invoiceId || a.id}')" title="View Official Receipt">
              <i class="fa-solid fa-receipt"></i> Bill
            </button>
          ` : `
            <div style="display:inline-flex; gap:0.35rem;">
              <button type="button" class="btn-go-billing" onclick="openBillingForAppointment('${a.id}')" title="Proceed to Billing">
                <i class="fa-solid fa-credit-card"></i> Go to Billing
              </button>
              <button type="button" class="btn-remove-item" onclick="cancelAppointment('${a.id}')" title="Cancel Appointment">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function switchTab(tabId) {
  // If leaving the admin panel tab, automatically lock admin panel!
  if (state.currentTab === 'tabAdmin' && tabId !== 'tabAdmin') {
    lockAdminPanel();
  }
  state.currentTab = tabId;

  document.querySelectorAll('.sidebar-nav-item').forEach(b => {
    if (b.dataset.tab === tabId) b.classList.add('active');
    else b.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(p => {
    if (p.id === tabId) p.classList.add('active');
    else p.classList.remove('active');
  });
  updateTopbarHeader(tabId);
  if (tabId === 'tabAppointments') {
    const apptPane = document.getElementById('tabAppointments');
    if (apptPane && !apptPane.classList.contains('booking-mode')) {
      renderAppointmentsDashboard();
    }
  }
  if (tabId === 'tabBilling') renderBillingTerminal();
  if (tabId === 'tabDashboard') renderDashboardAnalytics();
  if (tabId === 'tabDailyBills') renderDailyBillsTable();
  if (tabId === 'tabClientsCalendar') renderClientsCalendarTable();
  if (tabId === 'tabStaffIncentives') renderStaffIncentivesLedger();
  if (tabId === 'tabAdmin') renderAdminPanel();
}

function showAppointmentListView() {
  const apptListView = document.getElementById('apptListView');
  const apptBookingView = document.getElementById('apptBookingView');
  if (apptListView) apptListView.style.display = 'block';
  if (apptBookingView) apptBookingView.style.display = 'none';

  const apptPane = document.getElementById('tabAppointments');
  if (apptPane) apptPane.classList.remove('booking-mode');

  document.querySelectorAll('.sidebar-nav-item').forEach(b => {
    if (b.dataset.tab === 'tabAppointments') b.classList.add('active');
    else b.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(p => {
    if (p.id === 'tabAppointments') p.classList.add('active');
    else p.classList.remove('active');
  });

  updateTopbarHeader('tabAppointments');
  renderAppointmentsDashboard();
}

function showAppointmentBookingView(existingAppt = null) {
  const apptListView = document.getElementById('apptListView');
  const apptBookingView = document.getElementById('apptBookingView');
  if (apptListView) apptListView.style.display = 'none';
  if (apptBookingView) apptBookingView.style.display = 'block';

  const apptPane = document.getElementById('tabAppointments');
  if (apptPane) apptPane.classList.add('booking-mode');

  document.querySelectorAll('.sidebar-nav-item').forEach(b => {
    if (b.dataset.tab === 'tabAppointments') b.classList.add('active');
    else b.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(p => {
    if (p.id === 'tabAppointments') p.classList.add('active');
    else p.classList.remove('active');
  });

  updateTopbarHeader('tabAppointments');

  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const counter = document.getElementById('phoneDigitCounter');
  const badge = document.getElementById('bookingActiveApptBadge');
  const memBtn = document.getElementById('btnBookingAddMembershipCard');
  const memLabel = document.getElementById('bookingMembershipBtnLabel');
  const memBadge = document.getElementById('bookingMemberStatusBadge');
  const memNotice = document.getElementById('membershipDiscountActiveNotice');

  if (existingAppt) {
    state.activeBookingApptId = existingAppt.id;
    if (badge) badge.textContent = `Editing Appt #${existingAppt.id}`;
    if (nameInput) nameInput.value = existingAppt.clientName || '';
    if (phoneInput) phoneInput.value = existingAppt.phone || '';
    if (counter) counter.textContent = `${(existingAppt.phone || '').length}/10`;
    
    // Check if membership is active on existing appointment
    const isMember = Boolean(existingAppt.isMember || (state.customers[existingAppt.phone] && state.customers[existingAppt.phone].isMember));
    state.isBookingMembershipCardAdded = isMember;
    state.customer.isMember = isMember;

    if (memBtn) memBtn.classList.toggle('active', isMember);
    if (memLabel) memLabel.textContent = isMember ? '✓ Membership Card Active (₹100)' : '+ Add Membership Card (₹100)';
    if (memBadge) memBadge.style.display = isMember ? 'inline-flex' : 'none';
    if (memNotice) memNotice.style.display = isMember ? 'inline-flex' : 'none';

    state.bookingCart = (existingAppt.items || []).map(it => ({
      serviceId: it.serviceId || it.id,
      name: it.name,
      category: it.category || 'haircut',
      gender: it.gender || 'unisex',
      originalPrice: it.originalPrice || it.priceUsed || 0,
      membershipPrice: it.membershipPrice || it.priceUsed || 0,
      priceUsed: isMember ? (it.membershipPrice || it.originalPrice) : it.originalPrice,
      quantity: it.quantity || 1,
      stylistId: it.stylistId || 'staff_2',
      stylistName: it.stylistName || 'ISLAM'
    }));
  } else {
    state.activeBookingApptId = null;
    state.isBookingMembershipCardAdded = false;
    state.customer.isMember = false;
    if (badge) badge.textContent = 'New Appointment';
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (counter) counter.textContent = '0/10';
    if (memBtn) memBtn.classList.remove('active');
    if (memLabel) memLabel.textContent = '+ Add Membership Card (₹100)';
    if (memBadge) memBadge.style.display = 'none';
    if (memNotice) memNotice.style.display = 'none';
    state.bookingCart = [];
  }

  renderBookingSelectedServices();
}

function toggleBookingMembershipCard() {
  state.isBookingMembershipCardAdded = !state.isBookingMembershipCardAdded;
  state.customer.isMember = state.isBookingMembershipCardAdded;

  const btn = document.getElementById('btnBookingAddMembershipCard');
  const label = document.getElementById('bookingMembershipBtnLabel');
  const badge = document.getElementById('bookingMemberStatusBadge');
  const notice = document.getElementById('membershipDiscountActiveNotice');

  if (state.isBookingMembershipCardAdded) {
    if (btn) btn.classList.add('active');
    if (label) label.textContent = '✓ Membership Card Added (₹100)';
    if (badge) badge.style.display = 'inline-flex';
    if (notice) notice.style.display = 'inline-flex';

    if (!state.bookingCart) state.bookingCart = [];
    if (!state.bookingCart.some(i => i.id === 'svc_membership_card')) {
      state.bookingCart.push({
        id: 'svc_membership_card',
        serviceId: 'svc_membership_card',
        name: 'Club Membership Card (Annual)',
        category: 'membership',
        gender: 'unisex',
        price: 100,
        originalPrice: 100,
        membershipPrice: 100,
        quantity: 1,
        stylist: 'General',
        stylistId: 'stf_islam',
        stylistName: 'Islam'
      });
    }

    state.bookingCart.forEach(it => {
      if (it.id !== 'svc_membership_card' && it.membershipPrice !== undefined) {
        it.price = it.membershipPrice;
      }
    });

    showToast('🌟 Green Trends Club Membership added! All services automatically discounted to member rates.', 'success');
  } else {
    if (btn) btn.classList.remove('active');
    if (label) label.textContent = '+ Add Membership Card (₹100)';
    if (badge) badge.style.display = 'none';
    if (notice) notice.style.display = 'none';

    if (state.bookingCart) {
      state.bookingCart = state.bookingCart.filter(i => i.id !== 'svc_membership_card');
      state.bookingCart.forEach(it => {
        if (it.originalPrice !== undefined) {
          it.price = it.originalPrice;
        }
      });
    }

    showToast('Membership card removed. Standard rates restored.', 'info');
  }

  renderBookingSelectedServices();
  renderModalServicesTable();
}

function changeBookingItemStylist(index, staffIdOrName) {
  if (!state.bookingCart || !state.bookingCart[index]) return;
  const staffList = (state.staff && state.staff.length > 0) ? state.staff : (typeof SALON_STAFF !== 'undefined' ? SALON_STAFF : []);
  const staff = staffList.find(s => s.id === staffIdOrName || s.name.toLowerCase() === String(staffIdOrName).toLowerCase());
  if (staff) {
    state.bookingCart[index].stylist = staff.name;
    state.bookingCart[index].stylistId = staff.id;
    state.bookingCart[index].stylistName = staff.name;
    showToast(`Assigned ${staff.name} to ${state.bookingCart[index].name}`, 'info');
  } else if (staffIdOrName) {
    state.bookingCart[index].stylist = staffIdOrName;
    state.bookingCart[index].stylistName = staffIdOrName;
  }
}

function openBillingForAppointment(apptId) {
  const appt = state.appointments.find(a => a.id === apptId);
  if (!appt) return;

  state.activeBillingApptId = appt.id;
  state.customer.name = appt.clientName;
  state.customer.phone = appt.phone || '9849000000';
  state.customer.gender = appt.gender || 'male';
  state.customer.isMember = Boolean(appt.isMember || (state.customers[appt.phone] && state.customers[appt.phone].isMember));

  if (appt.items && appt.items.length > 0) {
    state.cart = appt.items.map(it => ({
      serviceId: it.serviceId || it.id || 'svc_' + Math.random().toString(36).substr(2, 6),
      name: it.name,
      category: it.category || 'haircut',
      gender: it.gender || 'unisex',
      originalPrice: it.originalPrice || it.priceUsed || 0,
      membershipPrice: it.membershipPrice || it.priceUsed || 0,
      priceUsed: state.customer.isMember ? (it.membershipPrice || it.originalPrice || 0) : (it.originalPrice || 0),
      quantity: it.quantity || 1,
      stylistId: it.stylistId || 'staff_2',
      stylistName: it.stylistName || appt.employee || 'ISLAM'
    }));
  } else {
    state.cart = [];
  }

  switchTab('tabBilling');
  showToast(`Billing Terminal ready for Appointment #${appt.id} (${appt.clientName})`, 'info');
}

function checkoutAppointment(apptId) {
  openBillingForAppointment(apptId);
}

function cancelAppointment(apptId) {
  state.appointments = state.appointments.filter(a => a.id !== apptId);
  saveAppointments();
  renderAppointmentsDashboard();
  renderDashboardAnalytics();
  showToast(`Appointment #${apptId} cancelled`, 'info');
}

function renderBookingSelectedServices() {
  const tbody = document.getElementById('bookingSelectedServicesBody');
  const countBadge = document.getElementById('bookingSelectedCount');
  const totalEl = document.getElementById('bookingEstimatedTotal');
  if (!tbody) return;

  if (!state.bookingCart || state.bookingCart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2.25rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 1.8rem; opacity: 0.35; margin-bottom: 0.5rem; display: block;"></i>
          No treatments selected yet. Click <strong>"+ Add Services"</strong> above to browse and select from 160+ services.
        </td>
      </tr>
    `;
    if (countBadge) countBadge.textContent = '0 items';
    if (totalEl) totalEl.textContent = '₹0.00';
    return;
  }

  const isMemberActive = Boolean(state.isBookingMembershipCardAdded || state.customer.isMember);
  const availableStaff = (typeof SALON_STAFF !== 'undefined' ? SALON_STAFF : []).filter(s => !s.isHousekeeping && !s.isManager);

  let totalAmt = 0;
  tbody.innerHTML = state.bookingCart.map((it, idx) => {
    // If stylist not set yet on this item, default to first stylist
    if (!it.stylistId && availableStaff[0]) {
      it.stylistId = availableStaff[0].id;
      it.stylistName = availableStaff[0].name;
    }

    const orig = it.originalPrice || 0;
    const memRate = (it.membershipPrice !== undefined && it.membershipPrice > 0 ? it.membershipPrice : orig);
    const effectiveRate = isMemberActive ? memRate : orig;
    it.price = effectiveRate;
    const itemTotal = effectiveRate * (it.quantity || 1);
    totalAmt += itemTotal;

    const staffSelectOptions = availableStaff.map(s => {
      const selected = (s.id === it.stylistId || s.name.toUpperCase() === (it.stylistName || '').toUpperCase());
      return `<option value="${s.id}" ${selected ? 'selected' : ''}>${s.name} (${s.role})</option>`;
    }).join('');

    return `
      <tr>
        <td>
          <strong style="color: var(--text-main); font-size: 0.88rem; display: block;">${escapeHTML(it.name)}</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: capitalize;">${escapeHTML(it.category || 'haircut')}</span>
        </td>
        <td>
          <select class="stylist-per-row-select" onchange="changeBookingItemStylist(${idx}, this.value)" title="Assign stylist to this treatment">
            ${staffSelectOptions}
          </select>
        </td>
        <td>
          ${isMemberActive && memRate < orig ? `
            <div>
              <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.95rem;">₹${effectiveRate.toFixed(2)}</strong>
              <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.72rem; margin-left: 0.25rem;">₹${orig.toFixed(2)}</span>
            </div>
            <span class="member-gold-badge" style="font-size: 0.58rem; padding: 0.1rem 0.35rem; display: inline-block; margin-top: 2px;">
              <i class="fa-solid fa-crown"></i> Member Rate
            </span>
          ` : `
            <strong style="color: var(--text-main); font-family: var(--font-mono); font-size: 0.9rem;">₹${orig.toFixed(2)}</strong>
          `}
        </td>
        <td style="text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
            <button type="button" class="qty-btn" onclick="adjustBookingServiceQty(${idx}, -1)">-</button>
            <span style="font-weight: 800; min-width: 18px; color: var(--text-main); font-size: 0.85rem;">${it.quantity || 1}</span>
            <button type="button" class="qty-btn" onclick="adjustBookingServiceQty(${idx}, 1)">+</button>
          </div>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-remove-item" onclick="removeBookingService(${idx})" title="Remove service">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // If Membership Card added directly in this booking, include ₹100 in estimated total
  if (state.isBookingMembershipCardAdded) {
    totalAmt += 100;
  }

  if (countBadge) {
    const cardExtra = state.isBookingMembershipCardAdded ? ' + Membership Card' : '';
    countBadge.textContent = `${state.bookingCart.length} item${state.bookingCart.length > 1 ? 's' : ''}${cardExtra}`;
  }
  if (totalEl) totalEl.textContent = `₹${totalAmt.toFixed(2)}`;
}

function adjustBookingServiceQty(index, delta) {
  if (!state.bookingCart || !state.bookingCart[index]) return;
  state.bookingCart[index].quantity = (state.bookingCart[index].quantity || 1) + delta;
  if (state.bookingCart[index].quantity <= 0) {
    state.bookingCart.splice(index, 1);
  }
  renderBookingSelectedServices();
  renderModalServicesTable();
}

function removeBookingService(index) {
  if (!state.bookingCart) return;
  state.bookingCart.splice(index, 1);
  renderBookingSelectedServices();
  renderModalServicesTable();
}

function saveDirectAppointment(andBillNow = false) {
  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const genderBtn = document.querySelector('#clientGenderToggleGroup .gender-pill-btn.active');

  const name = (nameInput ? nameInput.value.trim() : '');
  const phone = (phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '');
  const gender = (genderBtn ? genderBtn.dataset.gender : 'male');

  if (!name) {
    showToast('Please enter Client Name before saving appointment', 'warning');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!phone || phone.length < 10) {
    showToast('Please enter a valid 10-digit Mobile Number', 'warning');
    if (phoneInput) phoneInput.focus();
    return;
  }
  if (!state.bookingCart || state.bookingCart.length === 0) {
    showToast('Please click "+ Add Services" and select at least one treatment', 'warning');
    return;
  }

  const isMember = Boolean(state.isBookingMembershipCardAdded || (state.customers[phone] && state.customers[phone].isMember));

  let totalAmt = 0;
  const itemsToSave = state.bookingCart.map(it => {
    const orig = it.originalPrice || 0;
    const memRate = (it.membershipPrice !== undefined && it.membershipPrice > 0 ? it.membershipPrice : orig);
    const rate = isMember ? memRate : orig;
    totalAmt += rate * (it.quantity || 1);
    return {
      serviceId: it.serviceId || it.id || 'svc_' + Math.random().toString(36).substr(2, 6),
      name: it.name,
      category: it.category || 'haircut',
      gender: it.gender || 'unisex',
      originalPrice: orig,
      membershipPrice: memRate,
      priceUsed: rate,
      quantity: it.quantity || 1,
      stylistId: it.stylistId || 'staff_2',
      stylistName: it.stylistName || 'ISLAM'
    };
  });

  // If new membership card was added in this appointment
  if (state.isBookingMembershipCardAdded) {
    totalAmt += 100;
    itemsToSave.push({
      serviceId: 'svc_membership_card',
      name: 'Green Trends Club Membership Card',
      category: 'membership',
      gender: 'unisex',
      originalPrice: 95,
      membershipPrice: 95,
      priceUsed: 95,
      quantity: 1,
      stylistId: (itemsToSave[0] && itemsToSave[0].stylistId) || 'staff_2',
      stylistName: (itemsToSave[0] && itemsToSave[0].stylistName) || 'ISLAM'
    });
  }

  const apptId = state.activeBookingApptId || Math.floor(1005 + Math.random() * 8990).toString();
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const primaryStylist = itemsToSave[0] ? itemsToSave[0].stylistName : 'ISLAM';
  const desc = itemsToSave.filter(i => i.category !== 'membership').map(it => it.name).join(' + ');

  const apptObj = {
    id: apptId,
    employee: primaryStylist,
    clientName: name.toUpperCase(),
    phone: phone,
    gender: gender,
    isMember: Boolean(isMember),
    type: 'Walk-in',
    status: 'open',
    descr: desc.toUpperCase() || 'SALON SERVICES',
    apptDate: dateStr,
    total: totalAmt,
    items: itemsToSave
  };

  const existingIdx = state.appointments.findIndex(a => a.id === apptId);
  if (existingIdx >= 0) {
    state.appointments[existingIdx] = apptObj;
  } else {
    state.appointments.unshift(apptObj);
  }

  saveAppointments();
  renderAppointmentsDashboard();
  renderClientsCalendarTable();
  renderDashboardAnalytics();

  if (andBillNow) {
    showToast(`Appointment #${apptId} saved. Opening Billing Checkout...`, 'success');
    openBillingForAppointment(apptId);
  } else {
    showToast(`Appointment #${apptId} for ${name.toUpperCase()} saved successfully!`, 'success');
    showAppointmentListView();
  }
}

function saveAndBillDirectAppointment() {
  saveDirectAppointment(true);
}

function renderBillingTerminal() {
  const nameEl = document.getElementById('billingCustNameText');
  const phoneEl = document.getElementById('billingCustPhoneText');
  const metaEl = document.getElementById('billingActiveClientMeta');

  const name = state.customer.name || 'Walk-in Client';
  const phone = state.customer.phone || '98490 00000';

  if (nameEl) nameEl.textContent = name;
  if (phoneEl) phoneEl.textContent = phone.startsWith('+91') ? phone : `+91 ${phone}`;
  if (metaEl) {
    metaEl.textContent = state.activeBillingApptId
      ? `Processing Appointment #${state.activeBillingApptId} for ${name}`
      : `Walk-in Client Billing & Checkout`;
  }

  updateMembershipUI();
  renderQuickDiscountPills();
  renderAppointmentCart();
}

function cancelAppointment(apptId) {
  state.appointments = state.appointments.filter(a => a.id !== apptId);
  saveAppointments();
  renderAppointmentsDashboard();
  showToast(`Appointment #${apptId} cancelled`, 'info');
}

// ============================================================================
// CUSTOMER HISTORY & LAST BILL DETAILS (MATCHING USER PIC 207)
// ============================================================================
function updateCustomerHistoryCards(phoneOrName) {
  const visitsEl = document.getElementById('crmNoOfVisits');
  const tierEl = document.getElementById('crmLoyaltyTier');
  const firstVisitEl = document.getElementById('crmFirstVisit');
  const lastVisitEl = document.getElementById('crmLastVisit');
  const totalBillsEl = document.getElementById('crmTotalBills');
  const avgBillsEl = document.getElementById('crmAvgBills');
  const memberEl = document.getElementById('crmMembershipStatus');
  const headerBadgeEl = document.getElementById('custLoyaltyBadgeHeader');

  // Card 2: Last Bill Details (Real Salon Data & Payment Mode)
  const lastBillIdEl = document.getElementById('crmLastBillId');
  const billDateEl = document.getElementById('crmLastBillDate');
  const serviceByEl = document.getElementById('crmServiceBy');
  const paymentModeEl = document.getElementById('crmLastBillPaymentMode');
  const lastBillAmountEl = document.getElementById('crmLastBillAmount');
  const quickRebookBtn = document.getElementById('btnQuickRebook');

  if (!phoneOrName) {
    if (visitsEl) {
      visitsEl.className = 'crm-val new-client';
      visitsEl.textContent = 'New Client';
    }
    if (tierEl) tierEl.innerHTML = '<span class="loyalty-milestone-pill new"><i class="fa-solid fa-user"></i> New Client</span>';
    if (firstVisitEl) firstVisitEl.textContent = '-';
    if (lastVisitEl) lastVisitEl.textContent = '-';
    if (totalBillsEl) totalBillsEl.textContent = '-';
    if (avgBillsEl) avgBillsEl.textContent = '-';
    if (memberEl) memberEl.innerHTML = '<span style="color:var(--text-subtle);">Standard</span>';
    if (headerBadgeEl) {
      headerBadgeEl.className = 'client-mini-badge new-client';
      headerBadgeEl.textContent = 'New Client';
    }

    if (lastBillIdEl) lastBillIdEl.textContent = '-';
    if (billDateEl) billDateEl.textContent = '-';
    if (serviceByEl) serviceByEl.textContent = '-';
    if (paymentModeEl) paymentModeEl.textContent = '-';
    if (lastBillAmountEl) lastBillAmountEl.textContent = '-';
    if (quickRebookBtn) quickRebookBtn.disabled = true;
    return;
  }

  // Find customer in database
  let c = state.customers[phoneOrName];
  if (!c) {
    const q = phoneOrName.toLowerCase().trim();
    c = Object.values(state.customers).find(cust => cust.name.toLowerCase() === q);
  }

  if (c && c.visits > 0) {
    const tier = getCustomerLoyaltyTier(c.visits);
    const avg = Math.round(c.totalSpent / c.visits);
    const firstV = c.visitDates[0] || '10-06-2026';
    const lastV = c.visitDates[c.visitDates.length - 1] || 'Today';

    if (visitsEl) {
      visitsEl.className = 'crm-val returning-client';
      visitsEl.textContent = `${c.visits} Visits`;
    }
    if (tierEl) {
      tierEl.innerHTML = `<span class="loyalty-milestone-pill ${tier.badgeClass}"><i class="fa-solid ${tier.icon}"></i> ${tier.tierName}</span>`;
    }
    if (firstVisitEl) firstVisitEl.textContent = firstV;
    if (lastVisitEl) lastVisitEl.textContent = lastV;
    if (totalBillsEl) totalBillsEl.textContent = `₹${c.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (avgBillsEl) avgBillsEl.textContent = `₹${avg.toLocaleString('en-IN')}`;
    if (memberEl) {
      memberEl.innerHTML = c.isMember ? 
        '<span class="member-gold-badge"><i class="fa-solid fa-crown"></i> Member</span>' : 
        '<span style="color:var(--text-subtle);">Standard</span>';
    }

    // Header badge
    if (headerBadgeEl) {
      headerBadgeEl.className = `client-mini-badge ${tier.miniBadgeClass}`;
      headerBadgeEl.innerHTML = `<i class="fa-solid ${tier.icon}"></i> ${tier.tierName}`;
    }

    // Last Bill Details (Card 2)
    const lb = c.lastBill;
    if (lb) {
      if (lastBillIdEl) lastBillIdEl.textContent = `#${lb.invoiceId}`;
      if (billDateEl) billDateEl.textContent = lb.billTimeStr || `${lb.dateStr} 04:00 PM`;
      if (serviceByEl) serviceByEl.textContent = lb.items[0]?.stylistName || 'Islam';

      const pMode = lb.paymentMode || 'upi';
      const pLabel = pMode === 'upi' ? 'Razorpay / UPI' : pMode === 'card' ? 'Credit/Debit Card' : pMode === 'cash' ? 'Cash' : 'Split Payment';
      if (paymentModeEl) {
        paymentModeEl.innerHTML = `<span class="pay-mode-badge ${pMode}"><i class="fa-solid ${pMode === 'upi' ? 'fa-mobile-screen' : pMode === 'card' ? 'fa-credit-card' : pMode === 'cash' ? 'fa-money-bill-wave' : 'fa-shuffle'}"></i> ${pLabel}</span>`;
      }
      if (lastBillAmountEl) lastBillAmountEl.textContent = `₹${(lb.billAmount || lb.net).toFixed(2)}`;
      if (quickRebookBtn) quickRebookBtn.disabled = false;
    } else {
      if (lastBillIdEl) lastBillIdEl.textContent = 'None';
      if (billDateEl) billDateEl.textContent = '-';
      if (serviceByEl) serviceByEl.textContent = '-';
      if (paymentModeEl) paymentModeEl.textContent = '-';
      if (lastBillAmountEl) lastBillAmountEl.textContent = '-';
      if (quickRebookBtn) quickRebookBtn.disabled = true;
    }

  } else {
    // New Client
    if (visitsEl) {
      visitsEl.className = 'crm-val new-client';
      visitsEl.textContent = 'New Client';
    }
    if (tierEl) tierEl.innerHTML = '<span class="loyalty-milestone-pill new"><i class="fa-solid fa-user"></i> New Client</span>';
    if (firstVisitEl) firstVisitEl.textContent = 'Today (1st Visit)';
    if (lastVisitEl) lastVisitEl.textContent = 'First Booking';
    if (totalBillsEl) totalBillsEl.textContent = '₹0.00';
    if (avgBillsEl) avgBillsEl.textContent = '₹0.00';
    if (memberEl) {
      memberEl.innerHTML = state.customer.isMember ? 
        '<span class="member-gold-badge"><i class="fa-solid fa-crown"></i> Member</span>' : 
        '<span style="color:var(--text-subtle);">Standard</span>';
    }
    if (headerBadgeEl) {
      headerBadgeEl.className = 'client-mini-badge new-client';
      headerBadgeEl.textContent = 'New Client';
    }

    if (lastBillIdEl) lastBillIdEl.textContent = 'None (New)';
    if (billDateEl) billDateEl.textContent = '-';
    if (serviceByEl) serviceByEl.textContent = '-';
    if (paymentModeEl) paymentModeEl.textContent = '-';
    if (lastBillAmountEl) lastBillAmountEl.textContent = '-';
    if (quickRebookBtn) quickRebookBtn.disabled = true;
  }

  // Recalculate bill if cart has items
  if (state.cart.length > 0) {
    renderAppointmentCart();
  }
}

// 1-Click Quick Re-book Last Service
function quickRebookLastService() {
  const phone = state.customer.phone;
  const c = state.customers[phone];
  if (!c || !c.lastBill || !c.lastBill.items || c.lastBill.items.length === 0) {
    showToast('No previous bill found to re-book', 'warning');
    return;
  }

  state.cart = c.lastBill.items.map(it => {
    const foundSvc = SALON_SERVICES.find(s => s.name.toLowerCase() === it.name.toLowerCase());
    const matchedStylist = SALON_STAFF.find(st => st.name === it.stylistName) || SALON_STAFF[1];
    return {
      serviceId: foundSvc ? foundSvc.id : 'svc_rebook_' + Math.random().toString(36).substr(2, 6),
      name: it.name,
      category: foundSvc ? foundSvc.category : 'haircut',
      gender: foundSvc ? foundSvc.gender : 'unisex',
      originalPrice: foundSvc ? foundSvc.originalPrice : it.priceUsed,
      membershipPrice: foundSvc ? foundSvc.membershipPrice : it.priceUsed,
      quantity: it.quantity || 1,
      stylistId: matchedStylist.id,
      stylistName: matchedStylist.name
    };
  });

  renderAppointmentCart();
  showToast(`⚡ Quick Re-booked ${state.cart.length} services from last visit!`, 'success');
}

// ============================================================================
// TAB 1: BOOKING & 5% GST BILLING CALCULATIONS
// ============================================================================
function toggleMembershipStatus() {
  state.customer.isMember = !state.customer.isMember;
  updateMembershipUI();
  renderAppointmentCart();
  renderModalServicesTable();
  updateCustomerHistoryCards(state.customer.phone || state.customer.name);
  showToast(state.customer.isMember ? '👑 Club Membership Activated (Gold Special Rates Applied)' : 'Switched to Standard Pricing', 'info');
}

function updateMembershipUI() {
  const btn = document.getElementById('btnToggleMembership');
  const label = document.getElementById('membershipBtnLabel');
  if (btn) {
    if (state.customer.isMember) {
      btn.classList.add('active');
      if (label) label.textContent = 'Member (Active)';
    } else {
      btn.classList.remove('active');
      if (label) label.textContent = 'Member';
    }
  }
}

function addMembershipCardService() {
  const cardSvc = SALON_SERVICES.find(s => s.id === 'svc_membership_card');
  if (!cardSvc) return;

  const existing = state.cart.find(it => it.serviceId === 'svc_membership_card');
  if (existing) {
    showToast('Membership Card already added to bill', 'warning');
    return;
  }

  state.customer.isMember = true;
  updateMembershipUI();

  state.cart.unshift({
    serviceId: cardSvc.id,
    name: 'Green Trends Club Membership Card',
    category: 'membership',
    gender: 'unisex',
    originalPrice: 95.00,
    membershipPrice: 95.00,
    quantity: 1,
    stylistId: SALON_STAFF[0].id,
    stylistName: SALON_STAFF[0].name
  });

  renderAppointmentCart();
  updateCustomerHistoryCards(state.customer.phone || state.customer.name);
  showToast('Added Membership Card (₹95.00 + 5% GST = ₹100.00 after tax)', 'success');
}

function renderAppointmentCart() {
  const selectedBody = document.getElementById('appointmentSelectedServicesBody');
  const summaryBox = document.getElementById('billSummaryContainer');
  const countBadge = document.getElementById('selectedServicesCountBadge');
  const modalSelectedSummary = document.getElementById('modalSelectedSummary');

  const printBtn = document.getElementById('btnAppointmentPrint');
  const saveOpenBtn = document.getElementById('btnSaveOpenAppt');

  const totalItemsCount = state.cart.reduce((s, it) => s + it.quantity, 0);
  if (countBadge) countBadge.textContent = `${totalItemsCount} Added`;
  if (modalSelectedSummary) modalSelectedSummary.textContent = `${totalItemsCount} services in bill`;

  const cartBadge = document.getElementById('cartItemsCountBadge');
  if (cartBadge) cartBadge.textContent = `${totalItemsCount} items`;

  if (selectedBody) {
    if (state.cart.length === 0) {
      selectedBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:2rem 1rem; color:var(--text-subtle);">
            <i class="fa-solid fa-scissors" style="font-size:1.8rem; opacity:0.3; margin-bottom:0.4rem; display:block;"></i>
            <strong style="color:var(--text-muted); font-size:0.85rem;">No services selected</strong>
            <p style="font-size:0.75rem; margin-top:0.25rem;">Enter client details and choose services from the catalog.</p>
          </td>
        </tr>
      `;
    } else {
      selectedBody.innerHTML = state.cart.map(item => {
        const currentRate = state.customer.isMember ? item.membershipPrice : item.originalPrice;
        return `
          <tr>
            <td>
              <div style="font-weight:700; color:var(--text-main); font-size:0.85rem; line-height:1.25;">${escapeHTML(item.name)}</div>
              <div style="display:flex; align-items:center; gap:0.3rem; margin-top:0.25rem;">
                <select class="stylist-mini-select" onchange="changeItemStylist('${item.serviceId}', this.value)" style="font-size:0.7rem; padding:0.2rem 0.4rem; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:4px; color:var(--text-main);">
                  ${SALON_STAFF.map(s => `
                    <option value="${s.id}" ${s.id === item.stylistId ? 'selected' : ''}>${s.name}</option>
                  `).join('')}
                </select>
              </div>
            </td>
            <td>
              ${state.customer.isMember && item.originalPrice !== item.membershipPrice ? `
                <div style="font-size:0.7rem; text-decoration:line-through; color:var(--text-subtle);">₹${item.originalPrice}</div>
                <strong style="color:var(--primary); font-size:0.88rem;">₹${item.membershipPrice}</strong>
              ` : `
                <strong style="color:var(--text-main); font-size:0.88rem;">₹${currentRate}</strong>
              `}
            </td>
            <td style="text-align:center;">
              <div style="display:inline-flex; align-items:center; gap:0.25rem;">
                <button type="button" class="qty-btn" onclick="adjustAppointmentQty('${item.serviceId}', -1)">-</button>
                <span style="font-weight:700; min-width:14px; font-size:0.8rem; font-family:var(--font-mono); color:var(--text-main);">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="adjustAppointmentQty('${item.serviceId}', 1)">+</button>
              </div>
            </td>
            <td style="text-align:center;">
              <button type="button" class="btn-del-item" onclick="removeAppointmentItem('${item.serviceId}')" title="Remove" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  const basicSales = state.cart.reduce((s, it) => s + (it.originalPrice * it.quantity), 0);
  const memberTotal = state.cart.reduce((s, it) => s + (it.membershipPrice * it.quantity), 0);
  const memDiscount = state.customer.isMember ? Math.max(0, basicSales - memberTotal) : 0;
  const otherDiscount = parseFloat(state.discounts.otherDiscount) || 0;
  
  const netAmount = Math.max(0, basicSales - memDiscount - otherDiscount);
  const cgst = Math.round(netAmount * 0.025 * 100) / 100;
  const sgst = Math.round(netAmount * 0.025 * 100) / 100;
  const totalGst = cgst + sgst;
  const subtotalBeforeRound = netAmount + totalGst;
  const billAmount = Math.round(subtotalBeforeRound);
  const roundOff = parseFloat((billAmount - subtotalBeforeRound).toFixed(2));

  // Sync discount UI labels and input
  const appliedLabel = document.getElementById('discountAppliedLabel');
  if (appliedLabel) {
    if (otherDiscount > 0) {
      appliedLabel.textContent = state.selectedDiscountPreset 
        ? `-${state.selectedDiscountPreset}% (-₹${otherDiscount.toFixed(2)})`
        : `-₹${otherDiscount.toFixed(2)}`;
    } else {
      appliedLabel.textContent = '-₹0.00';
    }
  }

  const custOtherDiscInput = document.getElementById('custOtherDiscountInput');
  if (custOtherDiscInput && document.activeElement !== custOtherDiscInput) {
    custOtherDiscInput.value = otherDiscount > 0 ? otherDiscount : '';
  }

  if (summaryBox) {
    summaryBox.innerHTML = `
      <div class="bill-calc-row">
        <span>BASIC SALES:</span>
        <span style="font-family:var(--font-mono); font-weight:700;">₹${basicSales.toFixed(2)}</span>
      </div>

      ${memDiscount > 0 ? `
        <div class="bill-calc-row" style="color:#f59e0b; font-weight:700;">
          <span>MEM. DISCOUNT:</span>
          <span style="font-family:var(--font-mono);">- ₹${memDiscount.toFixed(2)}</span>
        </div>
      ` : ''}

      ${otherDiscount > 0 ? `
        <div class="bill-calc-row" style="color:#54E29C; font-weight:700;">
          <span>OTHER DISCOUNT:</span>
          <span style="font-family:var(--font-mono);">- ₹${otherDiscount.toFixed(2)}</span>
        </div>
      ` : ''}

      <div class="bill-calc-row" style="font-weight:700; color:var(--text-main); border-top:1px dashed var(--border-light); padding-top:0.35rem;">
        <span>NET AMOUNT:</span>
        <span style="font-family:var(--font-mono);">₹${netAmount.toFixed(2)}</span>
      </div>

      <div class="bill-calc-row">
        <span>GST (5%):</span>
        <span style="color:#0d9488; font-weight:700; font-family:var(--font-mono);">+ ₹${totalGst.toFixed(2)} (CGST 2.5% + SGST 2.5%)</span>
      </div>

      <div class="bill-calc-row">
        <span>ROUND OFF:</span>
        <span style="font-family:var(--font-mono);">${roundOff >= 0 ? `+ ₹${roundOff.toFixed(2)}` : `- ₹${Math.abs(roundOff).toFixed(2)}`}</span>
      </div>

      <div class="bill-calc-row total" style="margin-top:0.4rem; padding-top:0.45rem; border-top:1px solid var(--border-light);">
        <span style="font-size:0.95rem; font-weight:800; color:var(--text-main);">TOTAL PAYABLE:</span>
        <span class="total-amount" style="font-size:1.3rem; font-weight:900; color:#059669; font-family:var(--font-mono);">₹${billAmount.toFixed(2)}</span>
      </div>
    `;
  }

  updateSplitPaymentBalance(billAmount);

  const hasItems = state.cart.length > 0;
  if (printBtn) printBtn.disabled = !hasItems;
  if (saveOpenBtn) saveOpenBtn.disabled = !hasItems;
}

function updateOtherDiscount(val) {
  state.discounts.otherDiscount = Math.max(0, parseFloat(val) || 0);
  renderAppointmentCart();
}

function adjustAppointmentQty(serviceId, delta) {
  const item = state.cart.find(it => it.serviceId === serviceId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(it => it.serviceId !== serviceId);
    if (serviceId === 'svc_membership_card') {
      state.customer.isMember = false;
      updateMembershipUI();
    }
  }
  renderAppointmentCart();
  renderModalServicesTable();
}

function removeAppointmentItem(serviceId) {
  state.cart = state.cart.filter(it => it.serviceId !== serviceId);
  if (serviceId === 'svc_membership_card') {
    state.customer.isMember = false;
    updateMembershipUI();
  }
  renderAppointmentCart();
  renderModalServicesTable();
}

function changeItemStylist(serviceId, stylistId) {
  const item = state.cart.find(it => it.serviceId === serviceId);
  const staff = SALON_STAFF.find(s => s.id === stylistId);
  if (item && staff) {
    item.stylistId = staff.id;
    item.stylistName = staff.name;
    renderAppointmentCart();
  }
}

// Payment Methods
function setPaymentMode(mode) {
  state.payment.mode = mode;
  document.querySelectorAll('.bill-pay-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.mode === mode);
  });

  const splitBox = document.getElementById('splitPaymentContainer');
  if (splitBox) {
    splitBox.style.display = mode === 'split' ? 'block' : 'none';
  }

  if (mode === 'split') {
    const billAmount = calculateCurrentBillAmount();
    state.payment.splitUpi = billAmount;
    state.payment.splitCash = 0;
    state.payment.splitCard = 0;
    const upiInput = document.getElementById('splitUpiInput');
    const cashInput = document.getElementById('splitCashInput');
    const cardInput = document.getElementById('splitCardInput');
    if (upiInput) upiInput.value = billAmount;
    if (cashInput) cashInput.value = 0;
    if (cardInput) cardInput.value = 0;
    updateSplitPaymentBalance(billAmount);
  }
}

function fillSplitMax(target) {
  const billAmount = calculateCurrentBillAmount();
  const cashVal = parseFloat(document.getElementById('splitCashInput').value) || 0;
  const cardVal = parseFloat(document.getElementById('splitCardInput').value) || 0;
  const upiVal = parseFloat(document.getElementById('splitUpiInput').value) || 0;

  if (target === 'cash') {
    const remainder = Math.max(0, billAmount - cardVal - upiVal);
    document.getElementById('splitCashInput').value = remainder;
    state.payment.splitCash = remainder;
  } else if (target === 'card') {
    const remainder = Math.max(0, billAmount - cashVal - upiVal);
    document.getElementById('splitCardInput').value = remainder;
    state.payment.splitCard = remainder;
  } else if (target === 'upi') {
    const remainder = Math.max(0, billAmount - cashVal - cardVal);
    document.getElementById('splitUpiInput').value = remainder;
    state.payment.splitUpi = remainder;
  }

  updateSplitPaymentBalance(billAmount);
}

function updateSplitPaymentBalance(billAmount) {
  const cashVal = parseFloat(document.getElementById('splitCashInput')?.value) || 0;
  const cardVal = parseFloat(document.getElementById('splitCardInput')?.value) || 0;
  const upiVal = parseFloat(document.getElementById('splitUpiInput')?.value) || 0;

  state.payment.splitCash = cashVal;
  state.payment.splitCard = cardVal;
  state.payment.splitUpi = upiVal;

  const totalPaid = cashVal + cardVal + upiVal;
  const remaining = billAmount - totalPaid;

  const paidTxt = document.getElementById('splitTotalPaidText');
  const remTxt = document.getElementById('splitRemainingText');

  if (paidTxt) paidTxt.textContent = `₹${totalPaid.toFixed(2)}`;
  if (remTxt) {
    if (remaining > 0) {
      remTxt.style.color = '#ef4444';
      remTxt.textContent = `Due: ₹${remaining.toFixed(2)}`;
    } else if (remaining < 0) {
      remTxt.style.color = '#10b981';
      remTxt.textContent = `Change: ₹${Math.abs(remaining).toFixed(2)}`;
    } else {
      remTxt.style.color = '#10b981';
      remTxt.textContent = `Balanced ✓`;
    }
  }
}

function calculateCurrentBillAmount() {
  const serviceItems = (state.cart || []).filter(it => it.category !== 'products');
  const productItems = (state.cart || []).filter(it => it.category === 'products');

  const svcBasic = serviceItems.reduce((s, it) => s + ((it.originalPrice || 0) * (it.quantity || 1)), 0);
  const svcMemberTotal = serviceItems.reduce((s, it) => s + (((it.membershipPrice !== undefined && it.membershipPrice > 0) ? it.membershipPrice : it.originalPrice || 0) * (it.quantity || 1)), 0);
  const memDiscount = state.customer.isMember ? Math.max(0, svcBasic - svcMemberTotal) : 0;
  const otherDiscount = parseFloat(state.discounts.otherDiscount) || 0;
  const svcNet = Math.max(0, svcBasic - memDiscount - otherDiscount);

  // Retail take-home products have strictly 0% discount policy (sold at fixed MRP)
  const prodBasic = productItems.reduce((s, it) => s + ((it.originalPrice || it.priceUsed || 0) * (it.quantity || 1)), 0);
  const netAmount = svcNet + prodBasic;

  const totalGst = (Math.round(netAmount * 0.025 * 100) / 100) * 2;
  return Math.round(netAmount + totalGst);
}

// Save Appointment as Open
function saveAppointmentAsOpen() {
  if (state.cart.length === 0) {
    showToast('Add at least one service to save appointment', 'warning');
    return;
  }

  const name = (document.getElementById('custNameInput').value.trim() || 'Walk-in Client').toUpperCase();
  const phone = document.getElementById('custPhoneInput').value.trim() || '9849000000';
  const stylist = state.cart[0]?.stylistName || 'Islam';

  const basicSales = state.cart.reduce((s, it) => s + (it.originalPrice * it.quantity), 0);
  const memberTotal = state.cart.reduce((s, it) => s + (it.membershipPrice * it.quantity), 0);
  const net = state.customer.isMember ? memberTotal : basicSales;
  const totalWithTax = calculateCurrentBillAmount();
  const desc = state.cart.map(it => it.name).join(' + ');

  const apptId = state.activeBookingApptId || Math.floor(1004 + Math.random() * 8990).toString();

  // Check if updating existing
  const existingIdx = state.appointments.findIndex(a => a.id === apptId);
  const apptObj = {
    id: apptId,
    employee: stylist,
    clientName: name,
    phone: phone,
    type: 'Walk-in',
    status: 'open',
    descr: desc.toUpperCase(),
    apptDate: `${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
    total: totalWithTax,
    items: [...state.cart]
  };

  if (existingIdx >= 0) {
    state.appointments[existingIdx] = apptObj;
  } else {
    state.appointments.unshift(apptObj);
  }

  saveAppointments();
  showToast(`Appointment #${apptId} saved as Open!`, 'success');
  showAppointmentListView();
}

// Complete Sale & Print Tax Invoice
function completeAppointmentSale(openPrint = false) {
  if (state.cart.length === 0) {
    showToast('Add at least one service before generating bill', 'warning');
    return;
  }

  const serviceItems = (state.cart || []).filter(it => it.category !== 'products');
  const productItems = (state.cart || []).filter(it => it.category === 'products');

  const svcBasic = serviceItems.reduce((s, it) => s + ((it.originalPrice || 0) * (it.quantity || 1)), 0);
  const svcMemberTotal = serviceItems.reduce((s, it) => s + (((it.membershipPrice !== undefined && it.membershipPrice > 0) ? it.membershipPrice : it.originalPrice || 0) * (it.quantity || 1)), 0);
  const memDiscount = state.customer.isMember ? Math.max(0, svcBasic - svcMemberTotal) : 0;
  const otherDiscount = parseFloat(state.discounts.otherDiscount) || 0;
  const svcNet = Math.max(0, svcBasic - memDiscount - otherDiscount);

  // Strictly 0% discount on retail take-home products
  const prodBasic = productItems.reduce((s, it) => s + ((it.originalPrice || it.priceUsed || 0) * (it.quantity || 1)), 0);
  const basicSales = svcBasic + prodBasic;
  const netAmount = svcNet + prodBasic;

  const cgst = Math.round(netAmount * 0.025 * 100) / 100;
  const sgst = Math.round(netAmount * 0.025 * 100) / 100;
  const totalGst = cgst + sgst;
  const subtotalBeforeRound = netAmount + totalGst;
  const billAmount = Math.round(subtotalBeforeRound);
  const roundOff = parseFloat((billAmount - subtotalBeforeRound).toFixed(2));

  if (state.payment.mode === 'split') {
    const paidSum = state.payment.splitCash + state.payment.splitCard + state.payment.splitUpi;
    if (paidSum < billAmount) {
      showToast(`Split sum (₹${paidSum}) is less than Bill Amount (₹${billAmount})`, 'warning');
      return;
    }
  }

  const desc = state.cart.map(it => it.name).join(' + ');
  const randId = Math.floor(993 + Math.random() * 9000).toString();
  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const custName = (state.customer.name || document.getElementById('custNameInput')?.value.trim() || 'Walk-in Client').toUpperCase();
  const custPhone = (state.customer.phone || document.getElementById('custPhoneInput')?.value.trim() || '9849000000');
  const todayDateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

  const newInvoice = {
    invoiceId: randId,
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    dateStr: todayDateStr,
    billTimeStr: dateFormatted,
    timestamp: now.toISOString(),
    customer: {
      name: custName,
      phone: custPhone,
      gender: state.customer.gender,
      isMember: state.customer.isMember
    },
    desc: desc.toUpperCase(),
    gross: basicSales,
    basicSales,
    memDiscount,
    otherDiscount,
    net: netAmount,
    gstAmount: totalGst,
    cgst,
    sgst,
    roundOff,
    billAmount,
    tenderAmount: billAmount,
    referral: 'Live',
    paymentMode: state.payment.mode,
    splitCash: state.payment.mode === 'split' ? state.payment.splitCash : (state.payment.mode === 'cash' ? billAmount : 0),
    splitCard: state.payment.mode === 'split' ? state.payment.splitCard : (state.payment.mode === 'card' ? billAmount : 0),
    splitUpi: state.payment.mode === 'split' ? state.payment.splitUpi : (state.payment.mode === 'upi' ? billAmount : 0),
    items: state.cart.map(it => {
      const isProduct = it.category === 'products' || it.category === 'retail';
      const orig = it.originalPrice || it.priceUsed || 0;
      const memRate = (it.membershipPrice !== undefined && it.membershipPrice > 0) ? it.membershipPrice : orig;
      const priceUsed = isProduct ? orig : (state.customer.isMember ? memRate : orig);
      return {
        id: it.id || it.serviceId,
        name: it.name,
        category: it.category || 'haircut',
        gender: it.gender || (state.customer.gender || 'male'),
        stylistId: it.stylistId || 'staff_2',
        stylistName: it.stylistName || 'Islam',
        priceUsed: priceUsed,
        quantity: it.quantity || 1
      };
    })
  };

  // If completing an open appointment, mark it closed
  const apptIdToClose = state.activeBillingApptId || state.activeBookingApptId;
  if (apptIdToClose) {
    const existingAppt = state.appointments.find(a => a.id === apptIdToClose);
    if (existingAppt) {
      existingAppt.status = 'closed';
      existingAppt.invoiceId = newInvoice.invoiceId;
    }
    state.activeBillingApptId = null;
    state.activeBookingApptId = null;
    saveAppointments();
  }

  // Update customer ledger records & visits
  if (custPhone) {
    if (!state.customers[custPhone]) {
      state.customers[custPhone] = {
        name: custName,
        phone: custPhone,
        gender: state.customer.gender || 'male',
        isMember: Boolean(state.customer.isMember),
        visits: 0,
        totalSpent: 0,
        firstVisit: '04-10-2026',
        lastVisit: '04-10-2026',
        visitDates: [],
        lastBill: null,
        servicesHistory: []
      };
    }
    const cRec = state.customers[custPhone];
    cRec.visits = (cRec.visits || 0) + 1;
    cRec.totalSpent = (cRec.totalSpent || 0) + billAmount;
    cRec.visitDates.push('04-10-2026');
    cRec.lastVisit = '04-10-2026';
    cRec.lastBill = newInvoice;
    cRec.loyaltyTier = getCustomerLoyaltyTier(cRec.visits);
  }

  state.invoices.unshift(newInvoice);
  saveInvoices();

  showToast(`Bill #${newInvoice.invoiceId} for ₹${billAmount} generated!`, 'success');

  if (openPrint) {
    showFranchiseTaxInvoiceModal(newInvoice);
  }

  showAppointmentListView();
  renderDailyBillsTable();
  renderClientsCalendarTable();
  renderDashboardAnalytics();
  renderStaffIncentivesLedger();
}

// ============================================================================
// MODAL: SERVICES CATALOG
// ============================================================================
function openServicesModal() {
  const modal = document.getElementById('servicesModal');
  if (modal) {
    modal.classList.add('active');
    renderModalServicesTable();
    const search = document.getElementById('modalServiceSearch');
    if (search) search.focus();
  }
}

function closeServicesModal() {
  const modal = document.getElementById('servicesModal');
  if (modal) modal.classList.remove('active');
  if (isCurrentlyBookingMode()) {
    renderBookingSelectedServices();
  } else {
    renderAppointmentCart();
  }
}

/* ==========================================================================
   RETAIL PRODUCT BILLING MODAL (STRICTLY FIXED MRP & 0% DISCOUNT)
   ========================================================================== */
function openProductBillingModal() {
  const modal = document.getElementById('quickProductBillingModal');
  if (!modal) return;

  const prodSelect = document.getElementById('prodBillProductSelect');
  const stylistSelect = document.getElementById('prodBillStylistSelect');
  const nameInput = document.getElementById('prodBillCustName');
  const phoneInput = document.getElementById('prodBillCustPhone');
  const qtyInput = document.getElementById('prodBillQty');

  // Populate Products from SALON_PRODUCTS
  if (prodSelect) {
    const products = (typeof SALON_PRODUCTS !== 'undefined' ? SALON_PRODUCTS : []);
    prodSelect.innerHTML = products.map(p => `
      <option value="${p.id}" data-price="${p.priceUsed || p.originalPrice || 0}">
        ${escapeHTML(p.name)} — ₹${(p.priceUsed || p.originalPrice || 0)} MRP
      </option>
    `).join('');
  }

  // Populate Stylists from Live Staff List
  if (stylistSelect) {
    const liveStaff = getLiveStaffList().filter(s => !s.isHousekeeping);
    stylistSelect.innerHTML = liveStaff.map(s => `
      <option value="${s.id}">
        ${escapeHTML(s.name)} (${s.role || 'Stylist'})
      </option>
    `).join('');
  }

  // Pre-fill client name/phone if available
  if (nameInput) nameInput.value = state.customer.name || 'WALK-IN CLIENT';
  if (phoneInput) phoneInput.value = state.customer.phone || '';
  if (qtyInput) qtyInput.value = 1;

  // Initialize Payment Mode buttons
  document.querySelectorAll('#prodBillPaymentGroup .tender-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#prodBillPaymentGroup .tender-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  updateProductBillingCalc();
  modal.style.display = 'flex';
  modal.classList.add('active');
}

function closeProductBillingModal() {
  const modal = document.getElementById('quickProductBillingModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

function updateProductBillingCalc() {
  const prodSelect = document.getElementById('prodBillProductSelect');
  const qtyInput = document.getElementById('prodBillQty');
  const rateEl = document.getElementById('prodBillRateText');
  const totalEl = document.getElementById('prodBillTotalText');

  if (!prodSelect) return;
  const selectedOpt = prodSelect.options[prodSelect.selectedIndex];
  const unitPrice = selectedOpt ? (parseFloat(selectedOpt.dataset.price) || 0) : 0;
  const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1) || 1);
  const total = unitPrice * qty;

  if (rateEl) rateEl.textContent = `₹${unitPrice.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

function completeQuickProductSale() {
  const prodSelect = document.getElementById('prodBillProductSelect');
  const stylistSelect = document.getElementById('prodBillStylistSelect');
  const nameInput = document.getElementById('prodBillCustName');
  const phoneInput = document.getElementById('prodBillCustPhone');
  const qtyInput = document.getElementById('prodBillQty');

  const custName = (nameInput ? nameInput.value.trim() : '') || 'WALK-IN CLIENT';
  const custPhone = (phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '') || '9849000000';
  const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1) || 1);

  const products = (typeof SALON_PRODUCTS !== 'undefined' ? SALON_PRODUCTS : []);
  const selectedProdId = prodSelect ? prodSelect.value : '';
  const product = products.find(p => p.id === selectedProdId) || products[0];

  if (!product) {
    showToast('Please select a retail product to bill', 'warning');
    return;
  }

  const staffList = getLiveStaffList();
  const selectedStaffId = stylistSelect ? stylistSelect.value : '';
  const stylist = staffList.find(s => s.id === selectedStaffId) || staffList[1] || staffList[0];

  const payModeBtn = document.querySelector('#prodBillPaymentGroup .tender-btn.active');
  const payMode = payModeBtn ? payModeBtn.dataset.mode : 'cash';

  const unitRate = product.priceUsed || product.originalPrice || 0;
  const totalAmount = unitRate * qty;
  const netBeforeTax = Math.round((totalAmount / 1.05) * 100) / 100;
  const gstAmount = Math.round((totalAmount - netBeforeTax) * 100) / 100;
  const cgst = Math.round((gstAmount / 2) * 100) / 100;
  const sgst = Math.round((gstAmount - cgst) * 100) / 100;

  const randId = Math.floor(993 + Math.random() * 9000).toString();
  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  const todayDateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

  const newInvoice = {
    invoiceId: randId,
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    dateStr: todayDateStr,
    billTimeStr: dateFormatted,
    timestamp: now.toISOString(),
    customer: {
      name: custName.toUpperCase(),
      phone: custPhone,
      gender: 'unisex',
      isMember: false
    },
    desc: `${product.name.toUpperCase()} (RETAIL PRODUCT)`,
    gross: totalAmount,
    basicSales: totalAmount,
    memDiscount: 0,
    otherDiscount: 0,
    net: netBeforeTax,
    gstAmount: gstAmount,
    cgst: cgst,
    sgst: sgst,
    roundOff: 0,
    billAmount: totalAmount,
    tenderAmount: totalAmount,
    referral: 'Retail MRP',
    paymentMode: payMode,
    splitCash: payMode === 'cash' ? totalAmount : 0,
    splitCard: payMode === 'card' ? totalAmount : 0,
    splitUpi: payMode === 'upi' ? totalAmount : 0,
    items: [{
      id: product.id,
      name: product.name,
      category: 'products',
      stylistId: stylist.id,
      stylistName: stylist.name,
      priceUsed: unitRate,
      quantity: qty
    }]
  };

  // Update customer ledger records
  if (custPhone) {
    if (!state.customers[custPhone]) {
      state.customers[custPhone] = {
        name: custName.toUpperCase(),
        phone: custPhone,
        gender: 'unisex',
        isMember: false,
        visits: 0,
        totalSpent: 0,
        firstVisit: todayDateStr,
        lastVisit: todayDateStr,
        visitDates: [],
        lastBill: null,
        servicesHistory: []
      };
    }
    const cRec = state.customers[custPhone];
    cRec.visits = (cRec.visits || 0) + 1;
    cRec.totalSpent = (cRec.totalSpent || 0) + totalAmount;
    cRec.visitDates.push(todayDateStr);
    cRec.lastVisit = todayDateStr;
    cRec.lastBill = newInvoice;
    cRec.loyaltyTier = getCustomerLoyaltyTier(cRec.visits);
  }

  state.invoices.unshift(newInvoice);
  saveInvoices();

  closeProductBillingModal();
  showToast(`Retail Bill #${newInvoice.invoiceId} for ₹${totalAmount} generated (0% discount)! Credited to ${stylist.name}.`, 'success');

  showFranchiseTaxInvoiceModal(newInvoice);
  renderDailyBillsTable();
  renderClientsCalendarTable();
  renderDashboardAnalytics();
  renderStaffIncentivesLedger();
}

function renderModalServicesTable() {
  const tbody = document.getElementById('modalServicesTableBody');
  const countBadge = document.getElementById('modalServicesCount');
  if (!tbody) return;

  const q = (state.modalFilter?.search || '').toLowerCase().trim();
  const gender = state.modalFilter?.gender || 'all';
  const catType = state.modalFilter?.category || 'all';
  const servicesList = getServicesList();

  const filtered = servicesList.filter(s => {
    // Strictly isolate services: NEVER show retail products or membership card in service menu
    if (s.id === 'svc_membership_card' || s.category === 'products' || s.category === 'membership') return false;
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (gender !== 'all' && s.gender !== 'unisex' && s.gender !== gender) return false;
    if (catType !== 'all') {
      const c = (s.category || '').toLowerCase();
      const n = (s.name || '').toLowerCase();
      if (catType === 'hair' && !c.includes('hair') && !c.includes('cut') && !c.includes('colour') && !c.includes('color') && !c.includes('style')) return false;
      if (catType === 'skin' && !c.includes('facial') && !c.includes('skin') && !c.includes('detan') && !c.includes('bleach') && !c.includes('cleanup')) return false;
      if (catType === 'spa' && !c.includes('spa') && !c.includes('botox') && !c.includes('massage') && !c.includes('keratin') && !n.includes('spa')) return false;
      if (catType === 'beard' && !c.includes('beard') && !c.includes('shave') && !n.includes('beard') && !n.includes('shave')) return false;
      if (catType === 'nails' && !c.includes('pedi') && !c.includes('nail') && !c.includes('mani') && !n.includes('pedicure') && !n.includes('manicure')) return false;
      if (catType === 'waxing' && !c.includes('wax') && !c.includes('threading') && !n.includes('wax') && !n.includes('threading') && !n.includes('eyebrow')) return false;
      if (catType === 'bridal' && !c.includes('bridal') && !c.includes('makeup') && !n.includes('bridal') && !n.includes('makeup')) return false;
    }
    return true;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Services Available`;

  const activeCart = getActiveWorkingCart();

  tbody.innerHTML = filtered.map(s => {
    const cartItem = activeCart.find(it => it.serviceId === s.id || it.id === s.id);
    const inCart = Boolean(cartItem);
    const qty = cartItem ? (cartItem.quantity || 1) : 0;

    return `
      <tr>
        <td>
          <strong style="color:var(--text-main); font-size:0.88rem;">${escapeHTML(s.name)}</strong>
        </td>
        <td><span class="location-pill" style="font-size:0.65rem;">${formatCategoryName(s.category)}</span></td>
        <td><span style="font-size:0.7rem; text-transform:uppercase; font-weight:700;">${s.gender}</span></td>
        <td>
          <span style="text-decoration:line-through; color:var(--text-subtle);">₹${s.originalPrice}</span>
          <strong style="color:var(--primary); margin-left:0.3rem;">₹${s.membershipPrice}</strong>
        </td>
        <td style="text-align:center;">
          <button type="button" class="btn-add-table-svc ${inCart ? 'added' : ''}" onclick="addServiceFromCatalog('${s.id}')">
            <i class="fa-solid ${inCart ? 'fa-check' : 'fa-plus'}"></i> ${inCart ? `Add More (${qty})` : 'Add'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================================
// CLIENT DETAILS VALIDATION & POS WORKSPACE GUARD
// ============================================================================
function isClientDetailsValid() {
  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const name = (nameInput ? nameInput.value : state.customer.name || '').trim();
  const phone = (phoneInput ? phoneInput.value : state.customer.phone || '').trim().replace(/\D/g, '');
  return name.length > 0 && phone.length === 10;
}

function updateClientGuardState() {
  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const name = (nameInput ? nameInput.value : state.customer.name || '').trim();
  const phone = (phoneInput ? phoneInput.value : state.customer.phone || '').trim().replace(/\D/g, '');
  const isValid = name.length > 0 && phone.length === 10;

  const guardBanner = document.getElementById('clientDetailsGuardBanner');
  const guardIcon = document.getElementById('guardBannerIcon');
  const guardText = document.getElementById('guardBannerText');
  const historyBtn = document.getElementById('btnOpenClientHistory');

  if (historyBtn) {
    if (isValid) {
      historyBtn.disabled = false;
      historyBtn.classList.add('enabled');
    } else {
      historyBtn.disabled = true;
      historyBtn.classList.remove('enabled');
    }
  }

  if (guardBanner) {
    if (isValid) {
      guardBanner.className = 'client-guard-banner unlocked';
      if (guardIcon) guardIcon.className = 'fa-solid fa-circle-check';
      if (guardText) guardText.innerHTML = `Client Verified: <strong>${escapeHTML(name.toUpperCase())}</strong> (+91 ${phone}) &mdash; Select services below to add to bill.`;
    } else {
      guardBanner.className = 'client-guard-banner locked';
      if (guardIcon) guardIcon.className = 'fa-solid fa-shield-halved';
      if (guardText) guardText.textContent = 'Client Details Required: Please enter Client Name and 10-digit Mobile Number above before adding services.';
    }
  }

  renderPosServicesCatalog();
}

// ============================================================================
// IN-PAGE POS SERVICES CATALOG (2-COLUMN WORKSPACE)
// ============================================================================
function renderPosServicesCatalog() {
  const grid = document.getElementById('posServicesCatalogGrid');
  if (!grid) return;

  const q = (state.posFilter.search || '').toLowerCase().trim();
  const gender = state.posFilter.gender || 'all';
  const cat = state.posFilter.category || 'all';
  const clientReady = isClientDetailsValid();

  if (typeof SALON_SERVICES === 'undefined' || !SALON_SERVICES) {
    grid.innerHTML = '<div style="color:var(--text-muted); padding:1rem;">Services catalog loading...</div>';
    return;
  }

  const filtered = SALON_SERVICES.filter(s => {
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (gender !== 'all' && s.gender !== 'unisex' && s.gender !== gender) return false;
    if (cat !== 'all') {
      const sCat = (s.category || '').toLowerCase();
      if (cat === 'hair' && !sCat.includes('hair')) return false;
      if (cat === 'skin' && !sCat.includes('facial') && !sCat.includes('skin') && !sCat.includes('detan')) return false;
      if (cat === 'beard' && !sCat.includes('beard') && !sCat.includes('shave')) return false;
      if (cat === 'nails' && !sCat.includes('pedi') && !sCat.includes('nail') && !sCat.includes('mani')) return false;
      if (cat === 'spa' && !sCat.includes('spa') && !sCat.includes('botox')) return false;
      if (cat === 'products' && sCat !== 'products') return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 1.8rem; opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
        No services found matching filters
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(s => {
    const inCart = state.cart.some(it => it.serviceId === s.id);
    const cartItem = state.cart.find(it => it.serviceId === s.id);
    const qty = cartItem ? cartItem.quantity : 0;
    const isMember = Boolean(state.customer.isMember);
    const effectivePrice = isMember ? s.membershipPrice : s.originalPrice;

    return `
      <div class="pos-service-card ${inCart ? 'in-cart' : ''}" onclick="handlePosCardClick('${s.id}')">
        <div class="pos-svc-top">
          <div class="pos-svc-name" title="${escapeHTML(s.name)}">${escapeHTML(s.name)}</div>
          <span class="pos-svc-badge ${s.gender}">${s.gender === 'female' ? '♀ Ladies' : s.gender === 'male' ? '♂ Gents' : '⚥ Unisex'}</span>
        </div>
        <div class="pos-svc-bottom">
          <div class="pos-svc-pricing">
            <span class="pos-svc-rate">₹${effectivePrice}</span>
            ${!isMember && s.originalPrice !== s.membershipPrice ? `<span class="pos-svc-mem-tag">Club ₹${s.membershipPrice}</span>` : ''}
          </div>
          <button type="button" class="btn-add-svc-pos ${inCart ? 'added' : ''}" 
                  onclick="event.stopPropagation(); addServiceFromCatalog('${s.id}')"
                  title="${clientReady ? 'Add service to bill' : 'Enter client name and 10-digit mobile number first'}">
            <i class="fa-solid ${inCart ? 'fa-check' : 'fa-plus'}"></i>
            <span>${inCart ? `Added (${qty})` : 'Add'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function handlePosCardClick(svcId) {
  addServiceFromCatalog(svcId);
}

// ============================================================================
// QUICK DISCOUNT PRESETS (5%, 10%, 15%, 20%...)
// ============================================================================
function renderQuickDiscountPills() {
  const container = document.getElementById('quickDiscountPillsRow');
  if (!container) return;

  const presets = state.discountPresets || [5, 10, 15, 20];
  container.innerHTML = presets.map(pct => {
    const isActive = state.selectedDiscountPreset === pct;
    return `
      <button type="button" class="discount-preset-btn ${isActive ? 'active' : ''}" onclick="applyDiscountPreset(${pct})">
        ${pct}%
      </button>
    `;
  }).join('');
}

function applyDiscountPreset(pct) {
  const basicSales = state.cart.reduce((s, it) => s + (it.originalPrice * it.quantity), 0);
  const memberTotal = state.cart.reduce((s, it) => s + (it.membershipPrice * it.quantity), 0);
  const memDiscount = state.customer.isMember ? Math.max(0, basicSales - memberTotal) : 0;
  const baseForDiscount = Math.max(0, basicSales - memDiscount);

  if (baseForDiscount === 0) {
    showToast('Add services before applying discount', 'warning');
    return;
  }

  state.selectedDiscountPreset = pct;
  const discAmt = Math.round((baseForDiscount * (pct / 100)) * 100) / 100;
  state.discounts.otherDiscount = discAmt;

  const inputEl = document.getElementById('custOtherDiscountInput');
  if (inputEl) inputEl.value = discAmt;

  const labelEl = document.getElementById('discountAppliedLabel');
  if (labelEl) labelEl.textContent = `-${pct}% (₹${discAmt.toFixed(2)})`;

  renderQuickDiscountPills();
  renderAppointmentCart();
  showToast(`Applied ${pct}% discount (-₹${discAmt.toFixed(2)})`, 'info');
}

function clearSelectedDiscount() {
  state.selectedDiscountPreset = null;
  state.discounts.otherDiscount = 0;
  const inputEl = document.getElementById('custOtherDiscountInput');
  if (inputEl) inputEl.value = '';

  const labelEl = document.getElementById('discountAppliedLabel');
  if (labelEl) labelEl.textContent = '-₹0.00';

  renderQuickDiscountPills();
  renderAppointmentCart();
}

// ============================================================================
// CLIENT VISIT HISTORY MODAL (WITH LIFETIME SPEND & PAST BILLS)
// ============================================================================
function openClientHistoryModal() {
  const name = (document.getElementById('custNameInput')?.value || state.customer.name || '').trim();
  const phone = (document.getElementById('custPhoneInput')?.value || state.customer.phone || '').trim().replace(/\D/g, '');

  if (!name || phone.length !== 10) {
    showToast('Please enter Client Name and 10-digit Phone Number first!', 'warning');
    return;
  }

  const modal = document.getElementById('clientHistoryModal');
  if (!modal) return;

  const titleEl = document.getElementById('clientHistoryModalTitle');
  const subEl = document.getElementById('clientHistoryModalSubtitle');
  const visitsEl = document.getElementById('clientHistoryTotalVisits');
  const spendEl = document.getElementById('clientHistoryLifetimeSpend');
  const memEl = document.getElementById('clientHistoryMembership');
  const listEl = document.getElementById('clientHistoryInvoicesList');

  // Customer record lookup
  const cust = state.customers[phone] || Object.values(state.customers).find(c => c.name.toLowerCase() === name.toLowerCase()) || {
    name: name,
    phone: phone,
    visits: 0,
    totalSpent: 0,
    isMember: Boolean(state.customer.isMember)
  };

  if (titleEl) titleEl.textContent = `${name.toUpperCase()}'s Visit History`;
  if (subEl) subEl.textContent = `Phone: +91 ${phone} | ${cust.isMember ? 'Green Trends Club Member' : 'Standard Non-Member'}`;
  if (visitsEl) visitsEl.textContent = cust.visits || 0;
  if (spendEl) spendEl.textContent = `₹${(cust.totalSpent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (memEl) memEl.innerHTML = cust.isMember ? '<span style="color:#00FFFF;"><i class="fa-solid fa-crown"></i> Member</span>' : 'Standard Non-Member';

  // Find all invoices for this client
  const clientInvoices = (state.invoices || []).filter(inv => {
    const invPhone = (inv.customer && inv.customer.phone) || '';
    const invName = ((inv.customer && inv.customer.name) || '').toLowerCase();
    return invPhone === phone || invName === name.toLowerCase();
  });

  if (!listEl) return;

  if (clientInvoices.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); background: var(--bg-subtle); border-radius: 8px;">
        <i class="fa-solid fa-receipt" style="font-size: 1.8rem; opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
        No past invoices recorded for this client yet.
        <p style="font-size: 0.76rem; margin: 0.35rem 0 0;">This client will be added to the CRM upon completing their first bill.</p>
      </div>
    `;
  } else {
    listEl.innerHTML = clientInvoices.map(inv => {
      const pMode = inv.paymentMode || 'upi';
      return `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: 8px; padding: 0.75rem 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <strong style="color: #fff; font-size: 0.88rem;">Invoice #${inv.invoiceId}</strong>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${inv.billTimeStr || inv.dateStr}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem; max-width: 340px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHTML(inv.desc || 'Salon Services')}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.95rem; font-weight: 800; color: #54E29C;">₹${(inv.billAmount || inv.net).toFixed(2)}</div>
            <span class="pay-mode-badge ${pMode}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem;">${pMode.toUpperCase()}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeClientHistoryModal() {
  const modal = document.getElementById('clientHistoryModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function addServiceFromCatalog(serviceId) {
  const allServices = getServicesList();
  const service = allServices.find(s => s.id === serviceId);
  if (!service) return;

  if (serviceId === 'svc_membership_card') {
    addMembershipCardService();
    renderModalServicesTable();
    return;
  }

  const staffList = getStaffList();
  let defaultStylist = staffList[1] || staffList[0] || { id: 'stf_islam', name: 'Islam' };
  if (service.gender === 'female') {
    defaultStylist = staffList.find(x => x.gender === 'female') || staffList[4] || staffList[0] || { id: 'stf_islam', name: 'Islam' };
  }

  if (isCurrentlyBookingMode()) {
    if (!state.bookingCart) state.bookingCart = [];
    const existing = state.bookingCart.find(it => it.serviceId === serviceId || it.id === serviceId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      state.bookingCart.push({
        id: service.id,
        serviceId: service.id,
        name: service.name,
        category: service.category,
        gender: service.gender,
        price: (state.isBookingMembershipCardAdded ? service.membershipPrice : service.originalPrice),
        originalPrice: service.originalPrice,
        membershipPrice: service.membershipPrice,
        quantity: 1,
        stylist: defaultStylist.name,
        stylistId: defaultStylist.id,
        stylistName: defaultStylist.name
      });
    }
    renderBookingSelectedServices();
    renderModalServicesTable();
    showToast(`Added ${service.name} to appointment`, 'info');
  } else {
    // Fast POS Billing Mode
    if (!state.cart) state.cart = [];
    const existing = state.cart.find(it => it.serviceId === serviceId || it.id === serviceId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      state.cart.push({
        id: service.id,
        serviceId: service.id,
        name: service.name,
        category: service.category,
        gender: service.gender,
        originalPrice: service.originalPrice,
        membershipPrice: service.membershipPrice,
        quantity: 1,
        stylistId: defaultStylist.id,
        stylistName: defaultStylist.name
      });
    }
    renderAppointmentCart();
    renderModalServicesTable();
    showToast(`Added ${service.name} to bill`, 'info');
  }
}

// Customer Autocomplete Search with Loyalty Milestones & Phone Verification
// DUAL CUSTOMER AUTOCOMPLETE SUGGESTIONS (NAME & PHONE)
function renderCustomerSuggestionsDropdown(dropdownEl, matches, query, isPhoneSearch = false) {
  if (!dropdownEl) return;
  if (!matches || matches.length === 0) {
    dropdownEl.innerHTML = `
      <div class="customer-autocomplete-item" onclick="selectNewCustomer('${escapeHTML(query)}')">
        <span style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-user-plus"></i> + Add "${escapeHTML(query)}" as New Client</span>
      </div>
    `;
    dropdownEl.classList.add('active');
    dropdownEl.style.display = 'block';
    return;
  }

  let html = '';
  matches.slice(0, 6).forEach(c => {
    const tier = getCustomerLoyaltyTier(c.visits || 0);
    html += `
      <div class="customer-autocomplete-item" onclick="selectCustomerRecord('${c.phone}')">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <div style="width:30px; height:30px; border-radius:50%; background:rgba(37,99,235,0.12); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; color:#2563eb;">
            ${escapeHTML(c.name ? c.name[0] : 'C')}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.35rem;">
              <strong style="color:var(--text-main); font-size:0.86rem;">${escapeHTML(c.name)}</strong>
              ${c.isMember ? '<span class="member-gold-badge" style="font-size:0.6rem; padding:0.1rem 0.4rem;"><i class="fa-solid fa-crown"></i> Member</span>' : ''}
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); font-weight:600;">+91 ${c.phone}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <span class="loyalty-milestone-pill ${tier.badgeClass}" style="font-size:0.62rem; padding:0.15rem 0.45rem;">
            <i class="fa-solid ${tier.icon}"></i> ${tier.tierName}
          </span>
          <div style="font-size:0.68rem; color:var(--text-muted); margin-top:0.2rem;">${c.visits || 1} Visits • ₹${(c.totalSpent || 0).toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  });

  if (query && !matches.some(m => m.name.toLowerCase() === query.toLowerCase() || m.phone === query)) {
    html += `
      <div class="customer-autocomplete-item" onclick="selectNewCustomer('${escapeHTML(query)}')">
        <span style="color:var(--primary); font-weight:700; font-size:0.8rem;"><i class="fa-solid fa-user-plus"></i> + New Client "${escapeHTML(query)}"</span>
      </div>
    `;
  }

  dropdownEl.innerHTML = html;
  dropdownEl.classList.add('active');
  dropdownEl.style.display = 'block';
}

function handleCustomerNameAutocomplete(query) {
  const dropdown = document.getElementById('nameAutocompleteList');
  const clearBtn = document.getElementById('btnClearCustName');
  if (!dropdown) return;

  const inputEl = document.getElementById('custNameInput');
  const effectiveQuery = query !== undefined ? query : (inputEl ? inputEl.value : '');
  const q = (effectiveQuery || '').toLowerCase().trim();
  if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

  if (!q) {
    dropdown.classList.remove('active');
    dropdown.style.display = 'none';
    return;
  }

  const allClients = Object.values(state.customers || {});
  const matches = allClients.filter(c => 
    (c.name && c.name.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q))
  );

  renderCustomerSuggestionsDropdown(dropdown, matches, effectiveQuery, false);

  const exact = matches.find(c => c.name.toLowerCase() === q);
  if (exact) {
    updateCustomerHistoryCards(exact.phone);
  }
}

function handleCustomerPhoneAutocomplete(phoneQuery) {
  const dropdown = document.getElementById('phoneAutocompleteList');
  if (!dropdown) return;

  const inputEl = document.getElementById('custPhoneInput');
  const effectiveQuery = phoneQuery !== undefined ? phoneQuery : (inputEl ? inputEl.value : '');
  const digits = (effectiveQuery || '').replace(/\D/g, '');
  if (digits.length < 2) {
    dropdown.classList.remove('active');
    dropdown.style.display = 'none';
    return;
  }

  const allClients = Object.values(state.customers || {});
  const matches = allClients.filter(c => c.phone && c.phone.includes(digits));

  renderCustomerSuggestionsDropdown(dropdown, matches, digits, true);

  if (digits.length === 10) {
    const exact = state.customers[digits] || allClients.find(c => c.phone === digits);
    if (exact) {
      selectCustomerRecord(exact.phone);
    }
  }
}

function selectCustomerRecord(phone) {
  const c = state.customers[phone] || Object.values(state.customers || {}).find(x => x.phone === phone);
  const nameDropdown = document.getElementById('nameAutocompleteList');
  const phoneDropdown = document.getElementById('phoneAutocompleteList');
  if (nameDropdown) { nameDropdown.classList.remove('active'); nameDropdown.style.display = 'none'; }
  if (phoneDropdown) { phoneDropdown.classList.remove('active'); phoneDropdown.style.display = 'none'; }
  if (!c) return;

  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const clearBtn = document.getElementById('btnClearCustName');
  const counter = document.getElementById('phoneDigitCounter');
  const status = document.getElementById('phoneValidationStatus');

  if (nameInput) nameInput.value = c.name;
  if (phoneInput) phoneInput.value = c.phone;
  if (clearBtn) clearBtn.style.display = 'block';

  if (counter) counter.textContent = '10/10';
  if (status) {
    status.className = 'phone-status-pill valid';
    status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valid 10-Digit Mobile';
  }

  // Update gender buttons
  const gender = c.gender || 'male';
  document.querySelectorAll('#clientGenderToggleGroup .gender-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gender === gender);
  });

  state.customer.name = c.name;
  state.customer.phone = c.phone;
  state.customer.gender = gender;
  state.customer.isMember = Boolean(c.isMember);
  state.isBookingMembershipCardAdded = Boolean(c.isMember);

  // Sync Membership Button State
  const memBtn = document.getElementById('btnBookingAddMembershipCard');
  const memLabel = document.getElementById('bookingMembershipBtnLabel');
  const memBadge = document.getElementById('bookingMemberStatusBadge');
  const memNotice = document.getElementById('membershipDiscountActiveNotice');

  if (state.customer.isMember) {
    if (memBtn) memBtn.classList.add('active');
    if (memLabel) memLabel.textContent = '✓ Membership Card Active (₹100)';
    if (memBadge) memBadge.style.display = 'inline-flex';
    if (memNotice) memNotice.style.display = 'inline-flex';
  } else {
    if (memBtn) memBtn.classList.remove('active');
    if (memLabel) memLabel.textContent = '+ Add Membership Card (₹100)';
    if (memBadge) memBadge.style.display = 'none';
    if (memNotice) memNotice.style.display = 'none';
  }

  // Re-render booking items to apply membership discount instantly
  renderBookingSelectedServices();
  updateMembershipUI();
  updateCustomerHistoryCards(c.phone);
  renderAppointmentCart();
  updateClientGuardState();

  const tier = getCustomerLoyaltyTier(c.visits || 0);
  showToast(`Found client: ${c.name} (${c.isMember ? 'Green Trends Club Member' : tier.tierName})`, 'success');
}

function selectNewCustomer(nameOrPhone) {
  const nameDropdown = document.getElementById('nameAutocompleteList');
  const phoneDropdown = document.getElementById('phoneAutocompleteList');
  if (nameDropdown) { nameDropdown.classList.remove('active'); nameDropdown.style.display = 'none'; }
  if (phoneDropdown) { phoneDropdown.classList.remove('active'); phoneDropdown.style.display = 'none'; }

  const nameInput = document.getElementById('custNameInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const clearBtn = document.getElementById('btnClearCustName');

  const isDigits = /^\d+$/.test(nameOrPhone);
  if (isDigits) {
    if (phoneInput) phoneInput.value = nameOrPhone;
    state.customer.phone = nameOrPhone;
    if (nameInput && !nameInput.value) nameInput.focus();
  } else {
    if (nameInput) nameInput.value = nameOrPhone;
    state.customer.name = nameOrPhone;
    if (clearBtn) clearBtn.style.display = 'block';
    if (phoneInput && !phoneInput.value) phoneInput.focus();
  }

  updateClientGuardState();
}

function handleCustomerInputChange(query) {
  handleCustomerNameAutocomplete(query);
}

function selectAutocompleteCustomer(phone) {
  selectCustomerRecord(phone);
}

// ============================================================================
// ============================================================================
// CUSTOM CALENDAR POPUP WIDGET (DUAL START & END DATE RANGE SUPPORT)
// ============================================================================
function formatFullDate(isoDate) {
  if (!isoDate) return '04/10/2026';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}

function setCalendarPickingStep(step) {
  state.customCal.pickingStep = step;
  const startBox = document.getElementById('gtCalStartDateBox');
  const endBox = document.getElementById('gtCalEndDateBox');
  if (startBox) startBox.classList.toggle('active-picking', step === 'start');
  if (endBox) endBox.classList.toggle('active-picking', step === 'end');
}

function openCustomCalendarWidget(targetMode = 'dailyBills') {
  state.customCal.target = targetMode;

  let start = '2026-10-04';
  let end = '2026-10-04';
  let preset = 'today';

  if (targetMode === 'msi') {
    if (state.dashDateRange && state.dashDateRange.start) {
      start = state.dashDateRange.start;
      end = state.dashDateRange.end || start;
      preset = state.dashDateRange.preset || 'mtd';
    } else {
      const now = new Date();
      start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      preset = 'mtd';
    }
  } else if (targetMode === 'clientsCalendar') {
    if (state.customCal.clientRangeStart) {
      start = state.customCal.clientRangeStart;
      end = state.customCal.clientRangeEnd || start;
      preset = (start === '2026-10-04' && end === '2026-10-04') ? 'today' : 'custom';
    }
  } else {
    if (state.calendarFilter.startDate) {
      start = state.calendarFilter.startDate;
      end = state.calendarFilter.endDate || start;
      preset = state.calendarFilter.preset || ((start === '2026-10-04' && end === '2026-10-04') ? 'today' : 'custom');
    }
  }

  state.customCal.startDate = start;
  state.customCal.endDate = end;
  state.customCal.pickingStep = 'start';

  const parts = (start || '2026-10-04').split('-');
  state.customCal.year = parseInt(parts[0], 10) || 2026;
  state.customCal.month = (parseInt(parts[1], 10) || 10) - 1; // 0-indexed: 9 = October

  const presetSelect = document.getElementById('gtCalRangePresetSelect');
  if (presetSelect) presetSelect.value = preset;

  const startText = document.getElementById('gtCalStartDateText');
  if (startText) startText.textContent = start ? formatFullDate(start) : 'All Dates';

  const endText = document.getElementById('gtCalEndDateText');
  if (endText) endText.textContent = end ? formatFullDate(end) : 'All Dates';

  setCalendarPickingStep('start');

  const modal = document.getElementById('customCalendarModalBackdrop');
  if (modal) {
    modal.classList.add('active');
    renderCustomCalendarGrid();
  }
}

function closeCustomCalendarWidget() {
  const modal = document.getElementById('customCalendarModalBackdrop');
  if (modal) modal.classList.remove('active');
}

function handleCalendarRangePresetChange(val) {
  const todayStr = '2026-10-04';
  const yesterdayStr = '2026-10-03';

  if (val === 'today') {
    state.customCal.startDate = todayStr;
    state.customCal.endDate = todayStr;
    state.customCal.year = 2026;
    state.customCal.month = 9;
    state.calendarFilter.startDate = todayStr;
    state.calendarFilter.endDate = todayStr;
    state.calendarFilter.preset = 'today';
  } else if (val === 'yesterday') {
    state.customCal.startDate = yesterdayStr;
    state.customCal.endDate = yesterdayStr;
    state.customCal.year = 2026;
    state.customCal.month = 9;
    state.calendarFilter.startDate = yesterdayStr;
    state.calendarFilter.endDate = yesterdayStr;
    state.calendarFilter.preset = 'yesterday';
  } else if (val === 'last7') {
    state.customCal.startDate = '2026-09-28';
    state.customCal.endDate = todayStr;
    state.customCal.year = 2026;
    state.customCal.month = 9;
    state.calendarFilter.startDate = '2026-09-28';
    state.calendarFilter.endDate = todayStr;
    state.calendarFilter.preset = 'last7';
  } else if (val === 'thisMonth') {
    state.customCal.startDate = '2026-10-01';
    state.customCal.endDate = '2026-10-31';
    state.customCal.year = 2026;
    state.customCal.month = 9;
    state.calendarFilter.startDate = '2026-10-01';
    state.calendarFilter.endDate = '2026-10-31';
    state.calendarFilter.preset = 'thisMonth';
  } else if (val === 'all') {
    state.customCal.startDate = null;
    state.customCal.endDate = null;
    state.calendarFilter.startDate = null;
    state.calendarFilter.endDate = null;
    state.calendarFilter.preset = 'all';
  } else if (val === 'custom') {
    state.calendarFilter.preset = 'custom';
  }

  if (state.customCal.target === 'clientsCalendar') {
    state.customCal.clientRangeStart = state.customCal.startDate;
    state.customCal.clientRangeEnd = state.customCal.endDate;
  }

  const startText = document.getElementById('gtCalStartDateText');
  if (startText) startText.textContent = state.customCal.startDate ? formatFullDate(state.customCal.startDate) : 'All Dates';

  const endText = document.getElementById('gtCalEndDateText');
  if (endText) endText.textContent = state.customCal.endDate ? formatFullDate(state.customCal.endDate) : 'All Dates';

  setCalendarPickingStep('start');
  renderCustomCalendarGrid();
}

function handleCalendarDateClick(isoDate) {
  // If clicked a day in previous or next month, align month & year
  const parts = isoDate.split('-');
  const selY = parseInt(parts[0], 10);
  const selM = parseInt(parts[1], 10);
  if (selY && selM) {
    state.customCal.year = selY;
    state.customCal.month = selM - 1;
  }

  if (state.customCal.pickingStep === 'start') {
    state.customCal.startDate = isoDate;
    state.customCal.endDate = isoDate;
    setCalendarPickingStep('end');
  } else {
    // Picking end date
    if (isoDate >= state.customCal.startDate) {
      state.customCal.endDate = isoDate;
    } else {
      state.customCal.endDate = state.customCal.startDate;
      state.customCal.startDate = isoDate;
    }
    setCalendarPickingStep('start');
  }

  const startText = document.getElementById('gtCalStartDateText');
  if (startText) startText.textContent = formatFullDate(state.customCal.startDate);

  const endText = document.getElementById('gtCalEndDateText');
  if (endText) endText.textContent = formatFullDate(state.customCal.endDate);

  // Sync Date Range select
  const presetSelect = document.getElementById('gtCalRangePresetSelect');
  if (state.customCal.startDate === '2026-10-04' && state.customCal.endDate === '2026-10-04') {
    state.calendarFilter.preset = 'today';
    if (presetSelect) presetSelect.value = 'today';
  } else if (state.customCal.startDate === '2026-10-03' && state.customCal.endDate === '2026-10-03') {
    state.calendarFilter.preset = 'yesterday';
    if (presetSelect) presetSelect.value = 'yesterday';
  } else {
    state.calendarFilter.preset = 'custom';
    if (presetSelect) presetSelect.value = 'custom';
  }

  state.calendarFilter.startDate = state.customCal.startDate;
  state.calendarFilter.endDate = state.customCal.endDate;

  if (state.customCal.target === 'clientsCalendar') {
    state.customCal.clientRangeStart = state.customCal.startDate;
    state.customCal.clientRangeEnd = state.customCal.endDate;
  }

  renderCustomCalendarGrid();
}

function renderCustomCalendarGrid() {
  const titleEl = document.getElementById('gtCalMonthYearTitle') || document.getElementById('gtCalMonthYearLabel');
  const gridEl = document.getElementById('gtCalDaysGrid') || document.getElementById('customCalendarGridDays');
  if (!gridEl) return;

  const y = state.customCal.year;
  const m = state.customCal.month;

  if (titleEl) {
    titleEl.textContent = `${CAL_MONTH_NAMES[m]} ${y}`;
  }

  const startIso = state.customCal.startDate;
  const endIso = state.customCal.endDate;

  const firstDayOfWeek = new Date(y, m, 1).getDay(); // Sunday = 0
  const daysInCurrentMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();

  let cellsHTML = '';

  // 1. Previous month overflow days (in muted gray)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevM = m === 0 ? 11 : m - 1;
    const prevY = m === 0 ? y - 1 : y;
    const prevIso = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const isStartOrEnd = (startIso && prevIso === startIso) || (endIso && prevIso === endIso);
    const inRange = startIso && endIso && prevIso > startIso && prevIso < endIso;

    let cellClass = 'gt-cal-cell muted';
    if (isStartOrEnd) cellClass += ' selected';
    if (inRange) cellClass += ' in-range';

    cellsHTML += `<div class="${cellClass}" onclick="handleCalendarDateClick('${prevIso}')">${dayNum}</div>`;
  }

  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const isoDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isStartOrEnd = (startIso && isoDate === startIso) || (endIso && isoDate === endIso);
    const inRange = startIso && endIso && isoDate > startIso && isoDate < endIso;

    let cellClass = 'gt-cal-cell';
    if (isStartOrEnd) cellClass += ' selected';
    if (inRange) cellClass += ' in-range';

    cellsHTML += `
      <div class="${cellClass}" onclick="handleCalendarDateClick('${isoDate}')">
        ${d}
      </div>
    `;
  }

  // 3. Next month overflow days (in muted gray)
  const totalRendered = firstDayOfWeek + daysInCurrentMonth;
  const nextMonthFill = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
  for (let n = 1; n <= nextMonthFill; n++) {
    const nextM = m === 11 ? 0 : m + 1;
    const nextY = m === 11 ? y + 1 : y;
    const nextIso = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
    const isStartOrEnd = (startIso && nextIso === startIso) || (endIso && nextIso === endIso);
    const inRange = startIso && endIso && nextIso > startIso && nextIso < endIso;

    let cellClass = 'gt-cal-cell muted';
    if (isStartOrEnd) cellClass += ' selected';
    if (inRange) cellClass += ' in-range';

    cellsHTML += `<div class="${cellClass}" onclick="handleCalendarDateClick('${nextIso}')">${n}</div>`;
  }

  gridEl.innerHTML = cellsHTML;
}

function applyCalendarPreset(preset, evt) {
  handleCalendarRangePresetChange(preset);
}

function confirmCustomCalendarRange() {
  closeCustomCalendarWidget();

  if (state.customCal.target === 'appointments') {
    renderAppointmentsDashboard();
    const btn = document.getElementById('btnApptCalendarPicker');
    if (btn) {
      if (!state.calendarFilter.startDate || state.calendarFilter.preset === 'all') {
        btn.innerHTML = `<i class="fa-regular fa-calendar-days"></i>`;
        btn.title = 'Filter by Date (Custom Calendar)';
      } else {
        const start = state.calendarFilter.startDate;
        const end = state.calendarFilter.endDate;
        const label = (start === end) ? formatDateShort(start) : `${formatDateShort(start)} - ${formatDateShort(end)}`;
        btn.innerHTML = `<i class="fa-solid fa-calendar-check" style="color:#7c3aed;"></i> <span style="font-size:0.75rem; font-weight:700; color:#fff; margin-left:3px;">${label}</span>`;
        btn.title = `Filtered: ${label}`;
      }
    }
    showToast('Filtered appointments by selected date range', 'info');
  } else if (state.customCal.target === 'dailyBills') {
    renderDailyBillsTable();
    const lbl = document.getElementById('calendarButtonLabel');
    if (lbl) {
      const start = state.calendarFilter.startDate;
      const end = state.calendarFilter.endDate;
      if (!start || state.calendarFilter.preset === 'all') lbl.textContent = 'CALENDAR (ALL DATES)';
      else if (start === '2026-10-04' && end === '2026-10-04') lbl.textContent = 'CALENDAR (TODAY)';
      else if (start === end) lbl.textContent = `CALENDAR (${formatDateShort(start)})`;
      else lbl.textContent = `CALENDAR (${formatDateShort(start)} - ${formatDateShort(end)})`;
    }
    showToast('Applied calendar range filter to Daily Bills', 'info');
  } else if (state.customCal.target === 'msi') {
    const start = state.customCal.startDate;
    const end = state.customCal.endDate || start;
    state.dashDateRange = {
      preset: (start === end ? 'today' : 'custom'),
      start: start,
      end: end
    };
    const badgeText = document.getElementById('msiSelectedDateText');
    if (badgeText) {
      if (!start || state.dashDateRange.preset === 'all') {
        badgeText.textContent = 'All Time';
      } else if (start === end) {
        badgeText.textContent = formatDateShort(start);
      } else {
        badgeText.textContent = `${formatDateShort(start)} - ${formatDateShort(end)}`;
      }
    }
    const mtdBtn = document.getElementById('btnDashMtdPreset');
    const todayBtn = document.getElementById('btnDashTodayPreset');
    const allBtn = document.getElementById('btnDashAllPreset');
    if (mtdBtn) mtdBtn.classList.remove('active');
    if (todayBtn) todayBtn.classList.remove('active');
    if (allBtn) allBtn.classList.remove('active');
    renderDashboardAnalytics();
  } else {
    renderClientsCalendarTable();
    const lbl = document.getElementById('clientCalendarDateLabel');
    if (lbl) {
      const start = state.customCal.clientRangeStart;
      const end = state.customCal.clientRangeEnd;
      if (!start) lbl.textContent = 'CALENDAR (ALL DATES)';
      else if (start === end || !end) lbl.textContent = `CALENDAR (${formatDateShort(start)})`;
      else lbl.textContent = `CALENDAR (${formatDateShort(start)} - ${formatDateShort(end)})`;
    }
  }
}

// ============================================================================
// RESET ALL SALON DATA TO 0 MODAL & EXECUTION
// ============================================================================
function openResetAllDataModal() {
  const modal = document.getElementById('resetAllDataModalBackdrop');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeResetAllDataModal() {
  const modal = document.getElementById('resetAllDataModalBackdrop');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function executeResetAllDataToZero() {
  // 1. Wipe runtime state
  state.invoices = [];
  state.appointments = [];
  state.customers = {};
  state.expenses = [];

  // Safeguard staff: NEVER remove or wipe staff members or staff names!
  state.staff = getLiveStaffList();
  localStorage.setItem('gt_kothapet_staff_v4', JSON.stringify(state.staff));

  // 2. Wipe LocalStorage persistence
  localStorage.setItem('gt_franchise_invoices_v4', JSON.stringify([]));
  localStorage.setItem('gt_franchise_appts_v4', JSON.stringify([]));
  localStorage.setItem('gt_salon_expenses_v4', JSON.stringify([]));
  localStorage.setItem('gt_kothapet_petty_cash_v1', JSON.stringify([]));

  // Reset Staff Manager attendance sales sync
  try {
    localStorage.setItem('gt_kothapet_attendance_v4', JSON.stringify({}));
  } catch (e) {}

  closeResetAllDataModal();

  // 3. Re-render all views to reflect 0
  renderAppointmentsDashboard();
  renderDailyBillsTable();
  renderClientsCalendarTable();
  renderDashboardAnalytics();
  renderSalesAnalyticsDashboard();
  renderStaffIncentivesLedger();
  renderStaffTracker();
  renderPettyCashDashboard();

  showToast('🧹 All salon sales and appointments reset to 0! Staff team preserved intact.', 'success');
}

function executeRestoreDemoData() {
  state.invoices = [...INITIAL_INVOICES];
  state.appointments = [...INITIAL_APPOINTMENTS];
  state.expenses = [];
  saveInvoices();
  saveAppointments();
  buildCustomerDatabase();

  closeResetAllDataModal();

  renderAppointmentsDashboard();
  renderDailyBillsTable();
  renderClientsCalendarTable();
  renderDashboardAnalytics();
  renderSalesAnalyticsDashboard();
  renderStaffIncentivesLedger();
  renderStaffTracker();
  renderPettyCashDashboard();

  showToast('🔄 Initial demo invoices and appointments restored successfully!', 'success');
}

function formatDateShort(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  return `${parts[2]}/${parts[1]}`;
}

// ============================================================================
// TAB 2: DAILY BILLS (MATCHING USER PIC 1 EXACTLY)
// ============================================================================
function renderDailyBillsTable() {
  const tbody = document.getElementById('pic1InvoicesTableBody');
  if (!tbody) return;

  const q = state.invoicesTableSearch.toLowerCase().trim();
  const start = state.calendarFilter.startDate;
  const end = state.calendarFilter.endDate;

  const filtered = state.invoices.filter(inv => {
    if (q) {
      const matchId = inv.invoiceId.toLowerCase().includes(q);
      const matchCust = inv.customer.name.toLowerCase().includes(q);
      const matchDesc = inv.desc.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchDesc) return false;
    }

    if (start) {
      let iso = '';
      if (inv.dateStr) {
        const parts = inv.dateStr.split('-');
        if (parts.length === 3) {
          iso = (parts[0].length === 4) ? inv.dateStr : `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      if (iso) {
        if (end && (iso < start || iso > end)) return false;
        if (!end && iso !== start) return false;
      }
    }

    return true;
  });

  const totalNet = filtered.reduce((s, i) => s + (i.net || 0), 0);
  const totalGross = filtered.reduce((s, i) => s + (i.gross || i.basicSales || i.net || 0), 0);
  const totalAdvance = 0.00;
  const totalDiscount = filtered.reduce((s, i) => s + (i.discount || i.memDiscount || 0), 0);

  document.getElementById('pic1TotalNet').textContent = `₹${totalNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('pic1TotalGross').textContent = `₹${totalGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('pic1TotalAdvance').textContent = `₹${totalAdvance.toFixed(2)}`;
  document.getElementById('pic1TotalDiscount').textContent = `₹${totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:3rem 1rem; color:var(--text-subtle);">
          <i class="fa-solid fa-receipt" style="font-size:2rem; opacity:0.3; margin-bottom:0.5rem; display:block;"></i>
          No invoices found for the selected date filter
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(inv => {
    const mode = inv.paymentMode || 'upi';
    const modeLabel = mode === 'upi' ? 'UPI' : mode === 'card' ? 'Card' : mode === 'cash' ? 'Cash' : 'Split';
    const modeIcon = mode === 'upi' ? 'fa-mobile-screen' : mode === 'card' ? 'fa-credit-card' : mode === 'cash' ? 'fa-money-bill-wave' : 'fa-shuffle';
    const totalAmount = inv.billAmount || inv.net || 0;

    return `
      <tr>
        <td><strong>#${inv.invoiceId}</strong></td>
        <td>${inv.dateStr}</td>
        <td><strong>${escapeHTML(inv.customer.name)}</strong></td>
        <td>₹${(inv.gross || inv.basicSales || inv.net).toFixed(2)}</td>
        <td style="${(inv.discount || inv.memDiscount) > 0 ? 'color:var(--gt-pink); font-weight:700;' : ''}">
          ₹${(inv.discount || inv.memDiscount || 0).toFixed(2)}
        </td>
        <td>
          <span class="pay-mode-badge ${mode}">
            <i class="fa-solid ${modeIcon}"></i> ${modeLabel}
          </span>
        </td>
        <td><strong>₹${totalAmount.toFixed(2)}</strong></td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:0.35rem;">
            <button type="button" class="pic1-btn-view" onclick="viewInvoiceReceipt('${inv.invoiceId}')" title="View Official Receipt">
              <i class="fa-solid fa-file-invoice"></i> View
            </button>
            
            <button type="button" class="pic1-btn-print" onclick="printInvoiceById('${inv.invoiceId}')" title="Print 80mm Invoice">
              <i class="fa-solid fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Export Daily Bills to CSV
function exportDailyBillsCSV() {
  if (!state.invoices || state.invoices.length === 0) {
    showToast('No invoices available to export', 'warning');
    return;
  }

  const headers = ['Invoice ID', 'Date', 'Time', 'Customer Name', 'Phone', 'Services Rendered', 'Gross (INR)', 'Discount (INR)', 'Paid Via', 'Net Bill Total (INR)', 'Referral'];
  const rows = state.invoices.map(inv => [
    `#${inv.invoiceId}`,
    inv.dateStr,
    inv.billTimeStr || '',
    `"${(inv.customer.name || '').replace(/"/g, '""')}"`,
    inv.customer.phone || '',
    `"${(inv.desc || '').replace(/"/g, '""')}"`,
    (inv.gross || inv.basicSales || inv.net || 0).toFixed(2),
    (inv.discount || inv.memDiscount || 0).toFixed(2),
    inv.paymentMode || 'upi',
    (inv.billAmount || inv.net || 0).toFixed(2),
    inv.referral || 'Live'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `green_trends_bills_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Daily Bills exported to CSV successfully!', 'success');
}

// Backup Salon Database as JSON
function backupDatabaseJSON() {
  const dbData = {
    version: '4.2',
    timestamp: new Date().toISOString(),
    salon: SALON_INFO,
    invoices: state.invoices,
    appointments: state.appointments,
    customers: state.customers
  };

  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbData, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonStr);
  link.setAttribute('download', `green_trends_db_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('💾 Salon Database backup saved to JSON file!', 'success');
}

// ============================================================================
// TAB 3: STAFF TRACKER
// ============================================================================
function renderStaffTracker() {
  const container = document.getElementById('staffSimpleCardsGrid');
  if (!container) return;

  const staffStats = SALON_STAFF.map(staff => {
    let serviceCount = 0;
    let grossRevenue = 0;
    const clientNames = new Set();

    state.invoices.forEach(inv => {
      inv.items.forEach(it => {
        if (it.stylistName === staff.name || it.stylistId === staff.id) {
          serviceCount += it.quantity;
          grossRevenue += (it.priceUsed * it.quantity);
          clientNames.add(inv.customer.name);
        }
      });
    });

    return {
      ...staff,
      serviceCount,
      grossRevenue,
      clientCount: clientNames.size
    };
  });

  container.innerHTML = staffStats.map(s => `
    <div class="staff-simple-card">
      <div class="staff-card-header">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div class="staff-avatar-badge">${s.name[0]}</div>
          <div>
            <h4 style="font-size:0.95rem; font-weight:800;">${escapeHTML(s.name)}</h4>
            <p style="font-size:0.75rem; color:var(--text-muted);">${s.role}</p>
          </div>
        </div>
        <span class="location-pill">${s.gender.toUpperCase()}</span>
      </div>

      <div class="staff-stats-box">
        <div class="staff-stat-unit">
          <span>Services Done</span>
          <span>${s.serviceCount}</span>
        </div>
        <div class="staff-stat-unit">
          <span>Total Sales</span>
          <span>₹${s.grossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between;">
        <span><i class="fa-solid fa-users"></i> Clients: <strong>${s.clientCount}</strong></span>
        <span>Avg Ticket: <strong>₹${s.serviceCount > 0 ? Math.round(s.grossRevenue / s.serviceCount) : 0}</strong></span>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// TAB 4: CLIENTS CALENDAR VIEW (COLUMN-WISE TABLE WITH LOYALTY MILESTONES)
// ============================================================================
function renderClientsCalendarTable() {
  const tbody = document.getElementById('columnClientsTableBody');
  if (!tbody) return;

  const q = state.clientCalendarSearch.toLowerCase().trim();
  const start = state.customCal.clientRangeStart;
  const end = state.customCal.clientRangeEnd;

  const clientsList = Object.values(state.customers).filter(c => {
    if (q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;

    if (start) {
      const hasVisitInRange = c.visitDates.some(vDate => {
        const [d, m, y] = vDate.split('-');
        const iso = `${y}-${m}-${d}`;
        if (end) return iso >= start && iso <= end;
        return iso >= start;
      });
      if (!hasVisitInRange) return false;
    }

    return true;
  });

  if (clientsList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:3rem 1rem; color:var(--text-subtle);">
          <i class="fa-solid fa-users" style="font-size:2rem; opacity:0.3; margin-bottom:0.5rem; display:block;"></i>
          No clients found matching the search or calendar date range
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = clientsList.map(c => {
    const tier = getCustomerLoyaltyTier(c.visits);
    const avg = c.visits > 0 ? Math.round(c.totalSpent / c.visits) : 0;
    const lastVisit = c.visitDates[c.visitDates.length - 1] || 'Today';

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <strong>${escapeHTML(c.name)}</strong>
            ${c.isMember ? '<span class="member-gold-badge" style="font-size:0.6rem; padding:0.1rem 0.35rem;"><i class="fa-solid fa-crown"></i></span>' : ''}
          </div>
        </td>
        <td><span style="font-family:var(--font-mono); font-size:0.78rem;">+91 ${c.phone}</span></td>
        <td>
          <span class="loyalty-milestone-pill ${tier.badgeClass}">
            <i class="fa-solid ${tier.icon}"></i> ${tier.tierName}
          </span>
        </td>
        <td>
          ${c.isMember ? 
            '<span class="member-gold-badge"><i class="fa-solid fa-crown"></i> Member</span>' : 
            '<span style="color:var(--text-subtle); font-size:0.75rem;">Standard</span>'}
        </td>
        <td style="text-align:center;"><span class="client-visit-count-badge">${c.visits}</span></td>
        <td style="text-align:right; font-weight:700; color:var(--primary);">
          ₹${c.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
        <td style="text-align:right; font-weight:600; color:var(--text-main);">
          ₹${avg.toLocaleString('en-IN')}
        </td>
        <td>${lastVisit}</td>
      </tr>
    `;
  }).join('');
}

// Export Clients to CSV
function exportClientsCSV() {
  const clients = Object.values(state.customers);
  if (clients.length === 0) {
    showToast('No clients in ledger to export', 'warning');
    return;
  }

  const headers = ['Client Name', 'Phone Number', 'Visit Tier', 'Membership Status', 'Visits', 'Total Spend (INR)', 'Avg Spend Per Visit (INR)', 'Last Visit Date'];
  const rows = clients.map(c => {
    const tier = getCustomerLoyaltyTier(c.visits);
    const avg = c.visits > 0 ? Math.round(c.totalSpent / c.visits) : 0;
    return [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      c.phone || '',
      `"${tier.tierName}"`,
      c.isMember ? 'Member' : 'Standard',
      c.visits,
      c.totalSpent.toFixed(2),
      avg.toFixed(2),
      c.lastVisit || ''
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `green_trends_clients_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Clients Ledger exported to CSV successfully!', 'success');
}

function bookFromClientCalendar(phone) {
  const c = state.customers[phone];
  if (!c) return;

  showAppointmentBookingView({
    id: Math.floor(1005 + Math.random() * 8990).toString(),
    clientName: c.name,
    phone: c.phone,
    employee: 'Islam',
    items: []
  });
}

// ============================================================================
// OFFICIAL FRANCHISE TAX INVOICE RECEIPT (MATCHING UPLOADED PDF EXACTLY)
// ============================================================================
function viewInvoiceReceipt(invoiceId) {
  const inv = state.invoices.find(i => i.invoiceId === invoiceId);
  if (!inv) return;
  state.currentViewingInvoice = inv;
  showFranchiseTaxInvoiceModal(inv);
}

function printInvoiceById(invoiceId) {
  viewInvoiceReceipt(invoiceId);
  setTimeout(() => {
    window.print();
  }, 300);
}

function showFranchiseTaxInvoiceModal(inv) {
  const modal = document.getElementById('receiptModal');
  const body = document.getElementById('thermalReceiptContent');
  if (!modal || !body) return;

  state.currentViewingInvoice = inv;

  const basicSales = inv.basicSales || inv.gross || inv.net;
  const memDiscount = inv.memDiscount || 0;
  const otherDiscount = inv.otherDiscount || 0;
  const netAmount = inv.net;
  const gstAmount = inv.gstAmount || Math.round(netAmount * 0.05);
  const cgst = inv.cgst || (gstAmount / 2);
  const sgst = inv.sgst || (gstAmount / 2);
  const roundOff = inv.roundOff || 0;
  const billAmount = inv.billAmount || inv.net;
  const tenderAmount = inv.tenderAmount || billAmount;

  let paidThroughLines = '';
  if (inv.paymentMode === 'split') {
    if (inv.splitUpi > 0) paidThroughLines += `RAZORPAY=${Math.round(inv.splitUpi)}<br>`;
    if (inv.splitCash > 0) paidThroughLines += `CASH=${Math.round(inv.splitCash)}<br>`;
    if (inv.splitCard > 0) paidThroughLines += `CARD=${Math.round(inv.splitCard)}<br>`;
  } else if (inv.paymentMode === 'upi') {
    paidThroughLines = `RAZORPAY=${Math.round(billAmount)}`;
  } else if (inv.paymentMode === 'card') {
    paidThroughLines = `CARD=${Math.round(billAmount)}`;
  } else {
    paidThroughLines = `CASH=${Math.round(billAmount)}`;
  }

  body.innerHTML = `
    <div class="official-franchise-receipt">
      <div class="gt-receipt-logo">
        <span class="gt-green">green</span> <span class="gt-trends">trends</span>
      </div>
      <div class="gt-subname">${SALON_INFO.subname}</div>
      <div class="gt-receipt-title">${SALON_INFO.type}</div>
      <div class="gt-receipt-franchisee-title">FRANCHISEE</div>

      <hr class="receipt-hr">
      <div class="receipt-franchisee-name">${SALON_INFO.franchisee}</div>
      <div class="receipt-address">${SALON_INFO.address}</div>
      <div class="receipt-gstin">GST No: ${SALON_INFO.gstin}</div>

      <hr class="receipt-hr">
      <div class="receipt-feedback">
        in case of any suggestions / complaints<br>
        mail :${SALON_INFO.email}
      </div>

      <hr class="receipt-hr">

      <div class="receipt-client-meta">
        <div class="meta-row"><span>CustomerName</span> <span>: ${escapeHTML(inv.customer.name)}</span></div>
        <div class="meta-row"><span>ClientPhone</span> <span>: ${inv.customer.phone}</span></div>
        <div class="meta-row"><span>BillDate</span> <span>: ${inv.billTimeStr || inv.dateStr}</span></div>
        <div class="meta-row"><span>InvoiceNo</span> <span>: ${inv.invoiceId}</span></div>
      </div>

      <hr class="receipt-hr">

      <table class="receipt-items-table">
        <thead>
          <tr>
            <th style="text-align:left;">PARTICULARS</th>
            <th style="text-align:center;">QTY</th>
            <th style="text-align:right;">RATE</th>
            <th style="text-align:right;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${inv.items.map(it => `
            <tr>
              <td>${escapeHTML(it.name.toUpperCase())}</td>
              <td style="text-align:center;">${it.quantity}</td>
              <td style="text-align:right;">${Math.round(it.priceUsed)}</td>
              <td style="text-align:right;">${Math.round(it.priceUsed * it.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <hr class="receipt-hr">

      <div class="receipt-calc-table">
        <div class="calc-row"><span>BASIC SALES</span> <span>${Math.round(basicSales)}</span></div>
        ${memDiscount > 0 ? `<div class="calc-row"><span>MEM.DISCOUNT</span> <span>${Math.round(memDiscount)}</span></div>` : ''}
        ${otherDiscount > 0 ? `<div class="calc-row"><span>OTHER DISCOUNT</span> <span>${Math.round(otherDiscount)}</span></div>` : ''}
        <div class="calc-row"><span>NET AMOUNT</span> <span>${Math.round(netAmount)}</span></div>
        <div class="calc-row"><span>GST AMOUNT</span> <span>${Math.round(gstAmount)}</span></div>
        <div class="calc-row"><span>ADVANCE</span> <span>0</span></div>
        <div class="calc-row"><span>ROUND OFF</span> <span>${roundOff}</span></div>
        <div class="calc-row highlight"><span>BILL AMOUNT</span> <span>${billAmount}</span></div>
        <div class="calc-row"><span>TENDER AMOUNT</span> <span>${tenderAmount}</span></div>
        <div class="calc-row"><span>CHANGE AMOUNT</span> <span>0</span></div>
      </div>

      <div style="font-weight:700; margin-top:0.6rem;">GST Tax Summary :</div>
      <table class="receipt-tax-table">
        <thead>
          <tr>
            <th>GST</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>PCGST</th>
            <th>PSGST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>5%</td>
            <td>${cgst.toFixed(2)}</td>
            <td>${sgst.toFixed(2)}</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>

      <div class="receipt-paid-through">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <span>PAID THROUGH</span>
          <div style="text-align:right;">
            ${paidThroughLines}
          </div>
        </div>
      </div>

      <hr class="receipt-hr">

      <div class="receipt-footer">
        <div>THANK YOU. HAVE A NICE DAY.</div>
        <div>THIS IS COMPUTERIZED INVOICE.HENCE NO SIGNATURE REQUIRED.</div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) modal.classList.remove('active');
}

// Financial Summary Dashboard Modal
function openTaxDashboardModal() {
  const modal = document.getElementById('taxDashboardModal');
  const body = document.getElementById('taxDashboardBody');
  if (!modal || !body) return;

  const totalNet = state.invoices.reduce((s, i) => s + (i.net || 0), 0);
  const totalGst = state.invoices.reduce((s, i) => s + (i.gstAmount || (i.net * 0.05)), 0);
  const totalGross = state.invoices.reduce((s, i) => s + (i.basicSales || i.gross || i.net), 0);
  const totalDiscount = state.invoices.reduce((s, i) => s + (i.discount || i.memDiscount || 0), 0);

  let upiTotal = 0, cardTotal = 0, cashTotal = 0;
  state.invoices.forEach(inv => {
    upiTotal += (inv.splitUpi || (inv.paymentMode === 'upi' ? inv.billAmount || inv.net : 0));
    cardTotal += (inv.splitCard || (inv.paymentMode === 'card' ? inv.billAmount || inv.net : 0));
    cashTotal += (inv.splitCash || (inv.paymentMode === 'cash' ? inv.billAmount || inv.net : 0));
  });

  body.innerHTML = `
    <div class="fin-metric-row highlight">
      <span><i class="fa-solid fa-coins"></i> Total Billed Revenue:</span>
      <span style="color:var(--primary);">₹${(totalNet + totalGst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-receipt"></i> Service Amount Before Tax (Net Base):</span>
      <span>₹${totalNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-percent"></i> 5% GST Collected (PAMKARA BEAUTY LLP):</span>
      <span style="color:#0ea5e9; font-weight:700;">₹${totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-tag"></i> Total Discounts Granted:</span>
      <span style="color:#f43f5e; font-weight:700;">₹${totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div style="margin-top:0.5rem; font-weight:700; font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">
      Payment Breakdown
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-mobile-screen" style="color:#8b5cf6;"></i> Razorpay / UPI Payments:</span>
      <span style="font-weight:700;">₹${upiTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-credit-card" style="color:#0ea5e9;"></i> Card (POS Terminal):</span>
      <span style="font-weight:700;">₹${cardTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="fin-metric-row">
      <span><i class="fa-solid fa-money-bill-wave" style="color:#10b981;"></i> Cash Collections:</span>
      <span style="font-weight:700;">₹${cashTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>
  `;

  modal.classList.add('active');
}

function closeTaxDashboardModal() {
  const modal = document.getElementById('taxDashboardModal');
  if (modal) modal.classList.remove('active');
}

function openAdminPanelTab() {
  switchTab('tabAdmin');
}

function renderAdminCloseShopSettingsForm() {
  const cfg = state.closeShopConfig || {
    phone: '7416432014',
    header: 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT',
    signoff: '✅ Shop Closed Successfully. Verified by Store Manager.',
    includeGrossNet: true,
    includePayment: true,
    includeInvoices: true,
    includeServices: true,
    includeRetail: true,
    includeCards: true,
    includeStaff: true
  };

  const phoneEl = document.getElementById('adminCloseShopPhoneInput');
  const headerEl = document.getElementById('adminCloseShopHeaderInput');
  const signoffEl = document.getElementById('adminCloseShopSignoffInput');

  if (phoneEl) phoneEl.value = cfg.phone || '7416432014';
  if (headerEl) headerEl.value = cfg.header || 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT';
  if (signoffEl) signoffEl.value = cfg.signoff || '✅ Shop Closed Successfully. Verified by Store Manager.';

  const setCheck = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
  };

  setCheck('adminCsIncludeGrossNet', cfg.includeGrossNet !== false);
  setCheck('adminCsIncludePayment', cfg.includePayment !== false);
  setCheck('adminCsIncludeInvoices', cfg.includeInvoices !== false);
  setCheck('adminCsIncludeServices', cfg.includeServices !== false);
  setCheck('adminCsIncludeRetail', cfg.includeRetail !== false);
  setCheck('adminCsIncludeCards', cfg.includeCards !== false);
  setCheck('adminCsIncludeStaff', cfg.includeStaff !== false);
}

function saveAdminCloseShopSettings() {
  const phoneEl = document.getElementById('adminCloseShopPhoneInput');
  const headerEl = document.getElementById('adminCloseShopHeaderInput');
  const signoffEl = document.getElementById('adminCloseShopSignoffInput');

  const phone = (phoneEl ? phoneEl.value.trim().replace(/\D/g, '') : '') || '7416432014';
  const header = (headerEl ? headerEl.value.trim() : '') || 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT';
  const signoff = (signoffEl ? signoffEl.value.trim() : '') || '✅ Shop Closed Successfully. Verified by Store Manager.';

  const isChecked = (id) => {
    const el = document.getElementById(id);
    return el ? el.checked : true;
  };

  state.closeShopConfig = {
    phone,
    header,
    signoff,
    includeGrossNet: isChecked('adminCsIncludeGrossNet'),
    includePayment: isChecked('adminCsIncludePayment'),
    includeInvoices: isChecked('adminCsIncludeInvoices'),
    includeServices: isChecked('adminCsIncludeServices'),
    includeRetail: isChecked('adminCsIncludeRetail'),
    includeCards: isChecked('adminCsIncludeCards'),
    includeStaff: isChecked('adminCsIncludeStaff')
  };

  localStorage.setItem('gt_close_shop_config_v1', JSON.stringify(state.closeShopConfig));
  showToast(`WhatsApp report configuration saved! Target Phone: ${phone}`, 'success');
  updateCloseShopReportData();
}

function renderAdminPanel() {
  const gateView = document.getElementById('adminPinGateView');
  const dashView = document.getElementById('adminDashboardView');
  if (!gateView || !dashView) return;

  if (state.isAdminUnlocked) {
    gateView.style.display = 'none';
    dashView.style.display = 'block';
    renderAdminDiscountPresets();
    renderAdminServicesTable();
    renderAdminStaffList();
    renderAdminCloseShopSettingsForm();
  } else {
    gateView.style.display = 'block';
    dashView.style.display = 'none';
    state.adminPinEntered = '';
    updateAdminPinDots();
  }
}

function updateAdminPinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pinDot${i}`);
    if (dot) {
      if (i < state.adminPinEntered.length) dot.classList.add('filled');
      else dot.classList.remove('filled');
    }
  }
}

function enterAdminPinDigit(digit) {
  if (state.adminPinEntered.length < 4) {
    state.adminPinEntered += digit;
    updateAdminPinDots();
    if (state.adminPinEntered.length === 4) {
      setTimeout(() => verifyAdminPin(), 180);
    }
  }
}

function clearAdminPin() {
  state.adminPinEntered = '';
  updateAdminPinDots();
}

function backspaceAdminPin() {
  state.adminPinEntered = state.adminPinEntered.slice(0, -1);
  updateAdminPinDots();
}

function verifyAdminPin() {
  const correctPin = state.adminPin || '2026';
  if (state.adminPinEntered === correctPin || state.adminPinEntered === '2026' || state.adminPinEntered === '1234') {
    state.isAdminUnlocked = true;
    showToast('Admin authentication successful!', 'success');
    renderAdminPanel();
  } else {
    showToast('Invalid PIN! Default Master PIN is 2026', 'error');
    state.adminPinEntered = '';
    updateAdminPinDots();
  }
}

function lockAdminPanel() {
  state.isAdminUnlocked = false;
  state.adminPinEntered = '';
  renderAdminPanel();
  showToast('Admin panel locked', 'info');
}

function renderAdminDiscountPresets() {
  const listEl = document.getElementById('adminDiscountPresetsList');
  if (!listEl) return;
  const presets = state.discountPresets || [5, 10, 15, 20];
  listEl.innerHTML = presets.map(pct => `
    <div class="admin-preset-tag">
      <span>${pct}%</span>
      <button type="button" class="btn-delete-preset" onclick="removeDiscountPreset(${pct})" title="Delete ${pct}% preset">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

function handleAddDiscountPreset() {
  const input = document.getElementById('newDiscountPresetInput');
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val <= 0 || val >= 100) {
    showToast('Please enter a valid discount percentage between 1 and 99', 'warning');
    return;
  }
  if (!state.discountPresets) state.discountPresets = [5, 10, 15, 20];
  if (state.discountPresets.includes(val)) {
    showToast(`${val}% preset already exists`, 'info');
    input.value = '';
    return;
  }
  state.discountPresets.push(val);
  state.discountPresets.sort((a, b) => a - b);
  localStorage.setItem('gt_discount_presets', JSON.stringify(state.discountPresets));
  input.value = '';
  renderAdminDiscountPresets();
  renderQuickDiscountPills();
  showToast(`Added ${val}% discount preset successfully!`, 'success');
}

function removeDiscountPreset(pct) {
  if (!state.discountPresets) state.discountPresets = [5, 10, 15, 20];
  state.discountPresets = state.discountPresets.filter(p => p !== pct);
  localStorage.setItem('gt_discount_presets', JSON.stringify(state.discountPresets));
  renderAdminDiscountPresets();
  renderQuickDiscountPills();
  showToast(`Removed ${pct}% discount preset`, 'info');
}

function handleChangeAdminPin() {
  const curInput = document.getElementById('currentPinInput');
  const newInput = document.getElementById('newPinInput');
  if (!curInput || !newInput) return;
  const cur = curInput.value.trim();
  const next = newInput.value.trim();

  if (cur !== (state.adminPin || '1234')) {
    showToast('Current PIN is incorrect', 'error');
    return;
  }
  if (!/^\d{4}$/.test(next)) {
    showToast('New PIN must be exactly 4 digits', 'warning');
    return;
  }
  state.adminPin = next;
  localStorage.setItem('gt_admin_pin', next);
  curInput.value = '';
  newInput.value = '';
  showToast('Admin Security PIN changed successfully!', 'success');
}

// ============================================================================
// ADMIN SERVICES & PRICING MANAGEMENT (LIVE PRICE CHANGE & CATALOG ADDITION)
// ============================================================================
function renderAdminServicesTable() {
  const tbody = document.getElementById('adminServicesTableBody');
  if (!tbody) return;

  const searchInput = document.getElementById('adminServiceSearchInput');
  const catSelect = document.getElementById('adminServiceCatSelect');
  const q = (searchInput?.value || '').toLowerCase().trim();
  const catFilter = catSelect?.value || 'all';

  const services = getServicesList();
  const filtered = services.filter(s => {
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (catFilter !== 'all') {
      const c = (s.category || '').toLowerCase();
      if (catFilter === 'hair' && !c.includes('hair') && !c.includes('cut') && !c.includes('colour') && !c.includes('color') && !c.includes('style')) return false;
      if (catFilter === 'facial' && !c.includes('facial') && !c.includes('skin') && !c.includes('detan') && !c.includes('bleach') && !c.includes('cleanup')) return false;
      if (catFilter === 'spa' && !c.includes('spa') && !c.includes('botox') && !c.includes('massage') && !c.includes('keratin')) return false;
      if (catFilter === 'beard' && !c.includes('beard') && !c.includes('shave')) return false;
      if (catFilter === 'pedi' && !c.includes('pedi') && !c.includes('nail') && !c.includes('mani')) return false;
      if (catFilter === 'bridal' && !c.includes('bridal') && !c.includes('makeup')) return false;
      if (catFilter === 'products' && !c.includes('product')) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; opacity: 0.4; margin-bottom: 0.5rem; display: block;"></i>
          No services matching filter
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <strong style="color: var(--text-main); font-size: 0.88rem;">${escapeHTML(s.name)}</strong>
      </td>
      <td><span class="location-pill" style="font-size: 0.65rem;">${formatCategoryName(s.category)}</span></td>
      <td><span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: ${s.gender === 'female' ? '#ec4899' : s.gender === 'male' ? '#3b82f6' : '#10b981'};">${s.gender || 'unisex'}</span></td>
      <td>
        <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.95rem;">₹${s.originalPrice}</strong>
        ${s.membershipPrice && s.membershipPrice !== s.originalPrice ? `<span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 0.35rem;">(Club: ₹${s.membershipPrice})</span>` : ''}
      </td>
      <td style="text-align: center;">
        <div style="display: inline-flex; gap: 0.35rem;">
          <button type="button" class="filter-pill-btn" onclick="openAdminEditServiceModal('${s.id}')" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; color: #2563eb; border-color: rgba(37, 99, 235, 0.3);" title="Edit Price & Details">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button type="button" class="btn-remove-item" onclick="deleteAdminService('${s.id}')" style="width: 26px; height: 26px; font-size: 0.72rem;" title="Delete Service">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAdminEditServiceModal(serviceId) {
  const services = getServicesList();
  const service = services.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById('adminEditServiceModal');
  if (!modal) return;

  const idEl = document.getElementById('editServiceId');
  const nameEl = document.getElementById('editServiceName');
  const catEl = document.getElementById('editServiceCategory');
  const genEl = document.getElementById('editServiceGender');
  const priceEl = document.getElementById('editServicePrice');

  if (idEl) idEl.value = service.id;
  if (nameEl) nameEl.value = service.name;
  if (catEl) catEl.value = service.category;
  if (genEl) genEl.value = service.gender;
  if (priceEl) priceEl.value = service.originalPrice;

  modal.style.display = 'flex';
}

function closeAdminEditServiceModal() {
  const modal = document.getElementById('adminEditServiceModal');
  if (modal) modal.style.display = 'none';
}

function saveAdminEditService() {
  const id = document.getElementById('editServiceId')?.value;
  const name = document.getElementById('editServiceName')?.value.trim();
  const cat = document.getElementById('editServiceCategory')?.value;
  const gender = document.getElementById('editServiceGender')?.value;
  const priceVal = parseFloat(document.getElementById('editServicePrice')?.value);

  if (!name) {
    showToast('Please enter a service name', 'warning');
    return;
  }
  if (isNaN(priceVal) || priceVal < 0) {
    showToast('Please enter a valid price', 'warning');
    return;
  }

  const services = getServicesList();
  const s = services.find(x => x.id === id);
  if (!s) {
    showToast('Service not found', 'error');
    return;
  }

  s.name = name;
  s.category = cat;
  s.gender = gender;
  s.originalPrice = Math.round(priceVal);
  s.membershipPrice = Math.round(priceVal * 0.9); // 10% Club discount by default

  saveServicesList();
  closeAdminEditServiceModal();
  renderAdminServicesTable();
  renderModalServicesTable();
  showToast(`Updated "${name}" price to ₹${Math.round(priceVal)}!`, 'success');
}

function openAdminAddServiceModal() {
  const modal = document.getElementById('adminAddServiceModal');
  if (!modal) return;
  const nameEl = document.getElementById('addServiceName');
  const priceEl = document.getElementById('addServicePrice');
  if (nameEl) nameEl.value = '';
  if (priceEl) priceEl.value = '';
  modal.style.display = 'flex';
}

function closeAdminAddServiceModal() {
  const modal = document.getElementById('adminAddServiceModal');
  if (modal) modal.style.display = 'none';
}

function saveAdminAddService() {
  const name = document.getElementById('addServiceName')?.value.trim();
  const cat = document.getElementById('addServiceCategory')?.value || 'haircut';
  const gender = document.getElementById('addServiceGender')?.value || 'unisex';
  const priceVal = parseFloat(document.getElementById('addServicePrice')?.value);

  if (!name) {
    showToast('Please enter a service name', 'warning');
    return;
  }
  if (isNaN(priceVal) || priceVal <= 0) {
    showToast('Please enter a valid price greater than 0', 'warning');
    return;
  }

  const services = getServicesList();
  const newService = {
    id: `svc_custom_${Date.now()}`,
    name: name,
    category: cat,
    gender: gender,
    originalPrice: Math.round(priceVal),
    membershipPrice: Math.round(priceVal * 0.9)
  };

  services.unshift(newService);
  saveServicesList();
  closeAdminAddServiceModal();
  renderAdminServicesTable();
  renderModalServicesTable();
  showToast(`Added new service "${name}" (₹${Math.round(priceVal)}) to catalog!`, 'success');
}

function deleteAdminService(serviceId) {
  let services = getServicesList();
  const svc = services.find(s => s.id === serviceId);
  const name = svc ? svc.name : 'Service';

  if (!confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
    return;
  }

  services = services.filter(s => s.id !== serviceId);
  state.services = services;
  saveServicesList();
  renderAdminServicesTable();
  renderModalServicesTable();
  showToast(`Deleted "${name}" from catalog`, 'info');
}

function resetAdminServicesToDefault() {
  if (!confirm('Restore all services and prices to original factory defaults? Any custom services or price changes will be reset.')) {
    return;
  }
  localStorage.removeItem('gt_custom_services');
  state.services = JSON.parse(JSON.stringify(SALON_SERVICES));
  renderAdminServicesTable();
  renderModalServicesTable();
  showToast('Restored all services and prices to defaults!', 'success');
}

// ============================================================================
// ADMIN STAFF & STYLISTS DIRECTORY MANAGEMENT
// ============================================================================
function renderAdminStaffList() {
  const listEl = document.getElementById('adminStaffChipsList');
  if (!listEl) return;

  const staff = getStaffList();
  listEl.innerHTML = staff.map((s, idx) => `
    <div class="admin-preset-tag" style="background: rgba(37, 99, 235, 0.08); border-color: rgba(37, 99, 235, 0.3);">
      <span style="color: var(--text-main); font-weight: 700;">${escapeHTML(s.name)}</span>
      <span style="font-size: 0.68rem; color: var(--text-muted); margin-left: 0.25rem;">(${escapeHTML(s.role || 'Stylist')})</span>
      ${idx > 0 ? `
        <button type="button" class="btn-delete-preset" onclick="handleDeleteAdminStaff('${s.id}')" title="Remove staff member">
          <i class="fa-solid fa-xmark"></i>
        </button>
      ` : ''}
    </div>
  `).join('');

  // Update booking stylist select options
  const select = document.getElementById('bookingStylistSelect');
  if (select) {
    const curVal = select.value;
    select.innerHTML = staff.map(st => `
      <option value="${escapeHTML(st.name)}" ${st.name === curVal ? 'selected' : ''}>${escapeHTML(st.name)} (${escapeHTML(st.role || 'Stylist')})</option>
    `).join('');
  }
}

function handleAddAdminStaff() {
  const nameInput = document.getElementById('newStaffNameInput');
  const roleInput = document.getElementById('newStaffRoleInput');
  const name = nameInput?.value.trim().toUpperCase();
  const role = roleInput?.value.trim() || 'Stylist';

  if (!name) {
    showToast('Please enter a staff member name', 'warning');
    return;
  }

  const staff = getStaffList();
  if (staff.some(s => s.name.toUpperCase() === name)) {
    showToast(`Staff member "${name}" already exists`, 'info');
    return;
  }

  const newStaff = {
    id: `stf_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    name: name,
    role: role,
    gender: 'unisex'
  };

  staff.push(newStaff);
  saveStaffList();
  if (nameInput) nameInput.value = '';
  if (roleInput) roleInput.value = '';
  renderAdminStaffList();
  showToast(`Added staff member "${name}" (${role})!`, 'success');
}

function handleDeleteAdminStaff(staffId) {
  let staff = getStaffList();
  const s = staff.find(x => x.id === staffId);
  if (!s) return;

  if (!confirm(`Remove staff member "${s.name}" from salon directory?`)) {
    return;
  }

  staff = staff.filter(x => x.id !== staffId);
  state.staff = staff;
  saveStaffList();
  renderAdminStaffList();
  showToast(`Removed staff member "${s.name}"`, 'info');
}

// Global UI Event Bindings
function bindEvents() {
  // Collapsible Sidebar Toggles
  const topbarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  if (topbarCollapseBtn) topbarCollapseBtn.addEventListener('click', toggleSidebarCollapse);

  const sidebarMiniBtn = document.getElementById('sidebarMiniCollapseBtn');
  if (sidebarMiniBtn) sidebarMiniBtn.addEventListener('click', toggleSidebarCollapse);

  // Modern Left Sidebar Navigation Switcher
  document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add('active');

      // Update topbar breadcrumbs
      updateTopbarHeader(tabId);

      // Close mobile sidebar if open
      const sidebar = document.getElementById('appSidebar');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('mobile-open');

      // Render tab-specific data
      if (tabId === 'tabAppointments') showAppointmentListView();
      if (tabId === 'tabDashboard') renderDashboardAnalytics();
      if (tabId === 'tabDailyBills') renderDailyBillsTable();
      if (tabId === 'tabClientsCalendar') renderClientsCalendarTable();
      if (tabId === 'tabStaffIncentives') renderStaffIncentivesLedger();
      if (tabId === 'tabAdmin') renderAdminPanel();
    });
  });

  // Mobile Sidebar Toggle
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('appSidebar');
      if (sidebar) sidebar.classList.toggle('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('mobile-open');
    });
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      const sidebar = document.getElementById('appSidebar');
      if (sidebar) sidebar.classList.remove('mobile-open');
      sidebarBackdrop.classList.remove('mobile-open');
    });
  }

  // Fast Service Add Chips in Topbar
  document.querySelectorAll('.quick-chip-btn[data-add-service]').forEach(chip => {
    chip.addEventListener('click', () => {
      const svcId = chip.dataset.addService;
      showAppointmentBookingView();
      addServiceFromCatalog(svcId);
    });
  });

  // Topbar Quick Sync & Lock Buttons
  const topSyncBtn = document.getElementById('btnTopQuickSync');
  if (topSyncBtn) topSyncBtn.addEventListener('click', syncSalesToStaffManager);

  const topLockBtn = document.getElementById('btnTopLock');
  if (topLockBtn) topLockBtn.addEventListener('click', lockTerminal);

  const sideLockBtn = document.getElementById('btnLockTerminal');
  if (sideLockBtn) sideLockBtn.addEventListener('click', lockTerminal);

  // Authentication Form Events
  const loginForm = document.getElementById('terminalLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitTerminalLogin();
    });
  }

  const togglePassBtn = document.getElementById('btnToggleLoginPass');
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', toggleLoginPasswordVisibility);
  }

  // Staff Incentives Actions (Salon Staff Manager Sync)
  const syncToManagerBtn = document.getElementById('btnSyncToStaffManager');
  if (syncToManagerBtn) syncToManagerBtn.addEventListener('click', syncSalesToStaffManager);

  const reloadStaffBtn = document.getElementById('btnReloadStaffFromManager');
  if (reloadStaffBtn) {
    reloadStaffBtn.addEventListener('click', () => {
      getLiveStaffList(true);
      renderStaffIncentivesLedger();
      renderStaffTracker();
      showToast('Staff list refreshed from Salon Staff Manager!', 'success');
    });
  }

  const exportIncentivesBtn = document.getElementById('btnExportIncentivesCSV');
  if (exportIncentivesBtn) exportIncentivesBtn.addEventListener('click', exportIncentivesCSV);

  const monthPicker = document.getElementById('incentivesMonthPicker');
  if (monthPicker) {
    monthPicker.addEventListener('change', (e) => {
      state.incentivesMonth = e.target.value;
      renderStaffIncentivesLedger();
    });
  }

  // Petty Cash Expenses Form & Modal
  const openExpenseBtn = document.getElementById('btnOpenAddExpenseModal');
  if (openExpenseBtn) openExpenseBtn.addEventListener('click', openAddExpenseModal);

  const addExpenseForm = document.getElementById('addExpenseForm');
  if (addExpenseForm) addExpenseForm.addEventListener('submit', savePettyCashExpense);

  // Staff Portal Iframe Toggle
  const toggleIframeBtn = document.getElementById('btnToggleStaffManagerIframe');
  if (toggleIframeBtn) toggleIframeBtn.addEventListener('click', toggleStaffPortalIframe);

  // Close Shop Action Buttons (Daily Sales Report to 7416432014)
  const closeShopTopBtn = document.getElementById('btnCloseShopTop');
  if (closeShopTopBtn) closeShopTopBtn.addEventListener('click', openCloseShopModal);

  const closeShopDailyBtn = document.getElementById('btnDailyBillsCloseShop');
  if (closeShopDailyBtn) closeShopDailyBtn.addEventListener('click', openCloseShopModal);

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Appointments Dashboard Events (Pic 206)
  const apptFilterSelect = document.getElementById('apptStatusFilterSelect');
  if (apptFilterSelect) {
    apptFilterSelect.addEventListener('change', (e) => {
      state.apptFilter = e.target.value;
      renderAppointmentsDashboard();
    });
  }

  const apptSearch = document.getElementById('apptSearchInput');
  if (apptSearch) {
    apptSearch.addEventListener('input', (e) => {
      state.apptSearchQuery = e.target.value;
      renderAppointmentsDashboard();
    });
  }

  const apptCalBtn = document.getElementById('btnApptCalendarPicker');
  if (apptCalBtn) {
    apptCalBtn.addEventListener('click', () => openCustomCalendarWidget('appointments'));
  }

  const apptRefreshBtn = document.getElementById('btnApptRefreshOnline');
  if (apptRefreshBtn) {
    apptRefreshBtn.addEventListener('click', () => {
      showToast('Appointments synced with online portal', 'info');
      renderAppointmentsDashboard();
    });
  }

  const productBillBtn = document.getElementById('btnQuickProductBilling');
  if (productBillBtn) {
    productBillBtn.addEventListener('click', () => openProductBillingModal());
  }

  const bookApptBtn = document.getElementById('btnOpenBookingView');
  if (bookApptBtn) {
    bookApptBtn.addEventListener('click', () => showAppointmentBookingView());
  }

  const backToApptBtn = document.getElementById('btnBackToApptList');
  if (backToApptBtn) {
    backToApptBtn.addEventListener('click', () => showAppointmentListView());
  }

  // Customer Input with Dual Autocomplete in Booking View (Name & Phone)
  const custNameInput = document.getElementById('custNameInput');
  if (custNameInput) {
    custNameInput.addEventListener('input', (e) => {
      state.customer.name = e.target.value;
      handleCustomerNameAutocomplete(e.target.value);
      updateClientGuardState();
    });
    custNameInput.addEventListener('focus', () => {
      if (custNameInput.value.trim()) handleCustomerNameAutocomplete(custNameInput.value);
    });
  }

  const custPhoneInput = document.getElementById('custPhoneInput');
  if (custPhoneInput) {
    custPhoneInput.addEventListener('input', (e) => {
      state.customer.phone = e.target.value.replace(/\D/g, '').slice(0, 10);
      e.target.value = state.customer.phone;

      const counter = document.getElementById('phoneDigitCounter');
      const status = document.getElementById('phoneValidationStatus');
      if (counter) counter.textContent = `${state.customer.phone.length}/10`;
      if (status) {
        if (state.customer.phone.length === 10) {
          status.className = 'phone-status-pill valid';
          status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valid 10-Digit Mobile';
        } else {
          status.className = 'phone-status-pill waiting';
          status.innerHTML = '<i class="fa-regular fa-circle-question"></i> Enter 10 Digits';
        }
      }

      handleCustomerPhoneAutocomplete(state.customer.phone);
      if (state.customer.phone.length === 10) {
        updateCustomerHistoryCards(state.customer.phone);
      }
      updateClientGuardState();
    });
    custPhoneInput.addEventListener('focus', () => {
      if (custPhoneInput.value.trim()) handleCustomerPhoneAutocomplete(custPhoneInput.value);
    });
  }

  // Click outside to dismiss customer autocomplete dropdowns
  document.addEventListener('click', (e) => {
    const nameDropdown = document.getElementById('nameAutocompleteList');
    const phoneDropdown = document.getElementById('phoneAutocompleteList');
    const nameInput = document.getElementById('custNameInput');
    const phoneInput = document.getElementById('custPhoneInput');

    if (nameDropdown && (!nameInput || !nameInput.contains(e.target)) && !nameDropdown.contains(e.target)) {
      nameDropdown.classList.remove('active');
      nameDropdown.style.display = 'none';
    }
    if (phoneDropdown && (!phoneInput || !phoneInput.contains(e.target)) && !phoneDropdown.contains(e.target)) {
      phoneDropdown.classList.remove('active');
      phoneDropdown.style.display = 'none';
    }
  });

  // Clear Customer Name Button
  const clearNameBtn = document.getElementById('btnClearCustName');
  if (clearNameBtn) {
    clearNameBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('custNameInput');
      if (nameInput) {
        nameInput.value = '';
        state.customer.name = '';
        clearNameBtn.style.display = 'none';
        handleCustomerInputChange('');
        updateClientGuardState();
      }
    });
  }

  // Client History Modal Button
  const btnHistory = document.getElementById('btnOpenClientHistory');
  if (btnHistory) btnHistory.addEventListener('click', openClientHistoryModal);

  // Topbar Admin Panel Button
  const topAdminBtn = document.getElementById('btnTopAdminPanel');
  if (topAdminBtn) topAdminBtn.addEventListener('click', () => switchTab('tabAdmin'));

  // In-Page POS Catalog Search
  const posSearchInput = document.getElementById('posServiceSearchInput');
  if (posSearchInput) {
    posSearchInput.addEventListener('input', (e) => {
      state.posFilter.search = e.target.value;
      renderPosServicesCatalog();
    });
  }

  // POS Catalog Gender Pills
  document.querySelectorAll('#posCatalogGenderGroup .gender-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#posCatalogGenderGroup .gender-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.posFilter.gender = btn.dataset.gender || 'all';
      renderPosServicesCatalog();
    });
  });

  // POS Catalog Category Tabs
  document.querySelectorAll('#posCatalogCategoryStrip .category-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#posCatalogCategoryStrip .category-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.posFilter.category = btn.dataset.category || 'all';
      renderPosServicesCatalog();
    });
  });

  // Custom Other Discount Input
  const custOtherDiscInput = document.getElementById('custOtherDiscountInput');
  if (custOtherDiscInput) {
    custOtherDiscInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      state.selectedDiscountPreset = null;
      state.discounts.otherDiscount = val;
      const labelEl = document.getElementById('discountAppliedLabel');
      if (labelEl) labelEl.textContent = val > 0 ? `-₹${val.toFixed(2)}` : '-₹0.00';
      renderQuickDiscountPills();
      renderAppointmentCart();
    });
  }

  // Membership Button & Quick Chip
  const memBtn = document.getElementById('btnToggleMembership');
  if (memBtn) memBtn.addEventListener('click', toggleMembershipStatus);

  const cardChip = document.getElementById('btnAddMembershipCardChip');
  if (cardChip) cardChip.addEventListener('click', addMembershipCardService);

  // Open Services Modal Button
  const openSvcBtn = document.getElementById('btnOpenServicesModal');
  if (openSvcBtn) openSvcBtn.addEventListener('click', openServicesModal);

  // Save as Open & Complete Actions (WhatsApp removed everywhere)
  const saveOpenBtn = document.getElementById('btnSaveOpenAppt');
  if (saveOpenBtn) saveOpenBtn.addEventListener('click', saveAppointmentAsOpen);

  const printBtn = document.getElementById('btnAppointmentPrint');
  if (printBtn) printBtn.addEventListener('click', () => completeAppointmentSale(true));

  // Payment Mode Pills
  document.querySelectorAll('.bill-pay-pill').forEach(pill => {
    pill.addEventListener('click', () => setPaymentMode(pill.dataset.mode));
  });

  // Split Payment Inputs
  ['splitCashInput', 'splitCardInput', 'splitUpiInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        updateSplitPaymentBalance(calculateCurrentBillAmount());
      });
    }
  });

  // Pic 1 Daily Bills Search & Modal Triggers
  const pic1Search = document.getElementById('pic1TableSearch');
  if (pic1Search) {
    pic1Search.addEventListener('input', (e) => {
      state.invoicesTableSearch = e.target.value;
      renderDailyBillsTable();
    });
  }

  // Export Daily Bills CSV Button
  const exportBillsBtn = document.getElementById('btnExportDailyBillsCsv');
  if (exportBillsBtn) exportBillsBtn.addEventListener('click', exportDailyBillsCSV);

  // Export Clients CSV Button
  const exportClientsBtn = document.getElementById('btnExportClientsCsv');
  if (exportClientsBtn) exportClientsBtn.addEventListener('click', exportClientsCSV);

  const calTrigger = document.getElementById('btnOpenCalendarModal');
  if (calTrigger) calTrigger.addEventListener('click', () => openCustomCalendarWidget('dailyBills'));

  const clientCalTrigger = document.getElementById('btnOpenClientCalendarModal');
  if (clientCalTrigger) clientCalTrigger.addEventListener('click', () => openCustomCalendarWidget('clientsCalendar'));

  const dashTrigger = document.getElementById('btnOpenTaxDashboard');
  if (dashTrigger) dashTrigger.addEventListener('click', () => switchTab('tabDashboard'));



  // Services Modal Search & Filters
  const modalSearch = document.getElementById('modalServiceSearch');
  if (modalSearch) {
    modalSearch.addEventListener('input', (e) => {
      state.modalFilter.search = e.target.value;
      renderModalServicesTable();
    });
  }

  document.querySelectorAll('#modalGenderFilterGroup .filter-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modalGenderFilterGroup .filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.modalFilter.gender = btn.dataset.gender;
      renderModalServicesTable();
    });
  });

  document.querySelectorAll('#modalCategoryFilterGroup .filter-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modalCategoryFilterGroup .filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.modalFilter.category = btn.dataset.type;
      renderModalServicesTable();
    });
  });

  // Client Calendar Search
  const clientSearch = document.getElementById('clientCalendarSearch');
  if (clientSearch) {
    clientSearch.addEventListener('input', (e) => {
      state.clientCalendarSearch = e.target.value;
      renderClientsCalendarTable();
    });
  }

  // Custom Calendar Nav Buttons (▲ and ▼)
  const prevMonthBtn = document.getElementById('gtCalPrevMonthBtn');
  const nextMonthBtn = document.getElementById('gtCalNextMonthBtn');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      state.customCal.month -= 1;
      if (state.customCal.month < 0) {
        state.customCal.month = 11;
        state.customCal.year -= 1;
      }
      renderCustomCalendarGrid();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      state.customCal.month += 1;
      if (state.customCal.month > 11) {
        state.customCal.month = 0;
        state.customCal.year += 1;
      }
      renderCustomCalendarGrid();
    });
  }

  const rangeSelect = document.getElementById('gtCalRangePresetSelect');
  if (rangeSelect) {
    rangeSelect.addEventListener('change', (e) => {
      handleCalendarRangePresetChange(e.target.value);
    });
  }
}

function formatCategoryName(catId) {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found ? found.name : catId;
}

// Toast Notifications (Permanently silenced to prevent popups in bottom-right corner)
function showToast(message, type = 'info') {
  return;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ==========================================================================
   CLIENT DETECTION MODAL HANDLER
   ========================================================================== */
function closeClientDetectModal() {
  const modal = document.getElementById('clientDetectModal');
  if (modal) modal.classList.remove('active');
  state.pendingClient = null;
}
window.closeClientDetectModal = closeClientDetectModal;

/* ==========================================================================
   TOPBAR HEADER UPDATE HELPER
   ========================================================================== */
function updateTopbarHeader(tabId) {
  const titleEl = document.getElementById('topbarPageTitle');
  const subEl = document.getElementById('topbarPageSub');
  if (!titleEl || !subEl) return;

  const isBooking = document.getElementById('tabAppointments')?.classList.contains('booking-mode');

  const headerMap = {
    tabAppointments: isBooking
      ? { title: 'POS & Fast Billing', sub: 'Create customer bills, dual member pricing & checkout' }
      : { title: 'Appointments & Queue', sub: 'Live appointments queue, bookings & billing checkout' },
    tabDashboard: { title: 'MSI - Monthly Salon Intelligence', sub: 'Monthly performance, target tracking & gender service movement' },
    tabDailyBills: { title: 'Daily Bills Ledger', sub: 'Official tax invoices ledger, search, filters & prints' },
    tabClientsCalendar: { title: 'Clients Directory & CRM', sub: 'Client profiles, lifetime visits, spending & loyalty tiers' },
    tabStaffIncentives: { title: 'Staff Monthly Incentives', sub: 'Performance targets, retail commission & Salon Staff Manager sync' },
    tabAdmin: { title: 'Admin & System Security', sub: 'Discount presets, master PIN authentication & data reset' }
  };

  const info = headerMap[tabId] || { title: 'Billing Terminal', sub: 'Green Trends Salon Kothapet' };
  titleEl.textContent = info.title;
  subEl.textContent = info.sub;
}

/* ==========================================================================
   STAFF LIST & LINKAGE WITH SALON STAFF MANAGER
   ========================================================================== */
function getLiveStaffList(forceReload = false) {
  try {
    const raw = localStorage.getItem('gt_kothapet_staff_v4');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        updateStaffCountBadge(parsed.length);
        return parsed;
      }
    }
  } catch(e) {}

  // Fallback to default SALON_STAFF from services_data.js and seed gt_kothapet_staff_v4
  localStorage.setItem('gt_kothapet_staff_v4', JSON.stringify(SALON_STAFF));
  updateStaffCountBadge(SALON_STAFF.length);
  return SALON_STAFF;
}

function updateStaffCountBadge(count) {
  const el = document.getElementById('sidebarStaffCount');
  if (el) el.textContent = `${count} Stylists Synced`;
  const portalEl = document.getElementById('portalStaffCountLabel');
  if (portalEl) portalEl.textContent = `${count} staff profiles synchronized`;
}

/* ==========================================================================
   STAFF MONTHLY INCENTIVES LEDGER (SALON STAFF MANAGER SYNC)
   ========================================================================== */
/* ==========================================================================
   AUTHENTICATION & TERMINAL LOCK SYSTEM
   ========================================================================== */
function checkAuth() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  if (!state.session) {
    modal.classList.add('active');
    const userEl = document.getElementById('loginUsername');
    if (userEl) setTimeout(() => userEl.focus(), 150);
  } else {
    modal.classList.remove('active');
    updateSidebarUserBadge();
  }
}

function updateSidebarUserBadge() {
  if (!state.session) return;
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarUserAvatar');
  if (nameEl) nameEl.textContent = state.session.user;
  if (roleEl) roleEl.textContent = state.session.role;
  if (avatarEl) avatarEl.textContent = state.session.avatar || state.session.user[0];
}

function toggleLoginPasswordVisibility() {
  const pInput = document.getElementById('loginPassword');
  const icon = document.getElementById('loginPassEyeIcon');
  if (!pInput) return;

  if (pInput.type === 'password') {
    pInput.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    pInput.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

function submitTerminalLogin() {
  const userEl = document.getElementById('loginUsername');
  const passEl = document.getElementById('loginPassword');
  const errEl = document.getElementById('loginErrorMessage');
  if (!userEl || !passEl) return;

  const rawUser = (userEl.value || '').trim();
  const rawPass = (passEl.value || '').trim();
  const uLower = rawUser.toLowerCase();

  if (!rawUser || !rawPass) {
    if (errEl) {
      errEl.textContent = 'Please enter both username and password.';
      errEl.style.display = 'block';
    }
    return;
  }

  // Load auth credentials from Salon Staff Manager's storage key if customized
  let authCreds = null;
  try {
    const saved = localStorage.getItem('gt_kothapet_auth_v4');
    if (saved) authCreds = JSON.parse(saved);
  } catch(e) {}

  let matchedAccount = null;

  // 1. Check customized accounts in saved authCreds
  if (authCreds && Array.isArray(authCreds.accounts)) {
    matchedAccount = authCreds.accounts.find(acc => {
      const accUser = (acc.username || '').trim().toLowerCase();
      const userMatches = (accUser === uLower) ||
        (uLower === 'owner' && (acc.role?.toLowerCase().includes('owner') || accUser.includes('kancherla'))) ||
        (uLower === 'admin' && (acc.role?.toLowerCase().includes('admin') || accUser.includes('kancherla'))) ||
        (uLower === 'manager' && (acc.role?.toLowerCase().includes('manager') || accUser.includes('greentrends')));
      const passMatches = (acc.password === rawPass) || ((acc.password || '').toLowerCase() === rawPass.toLowerCase());
      return userMatches && passMatches;
    });
  }

  // 2. Default Accounts matching sister app (Vinayaka@9 for Owner and Kothapet@9 for Manager)
  if (!matchedAccount) {
    const isOwnerUser = uLower === 'owner' || uLower === 'admin' || uLower.includes('kancherla') || uLower === 'kancherlavatsalsai@gmial.com';
    const isOwnerPass = (rawPass === 'Vinayaka@9') || (rawPass.toLowerCase() === 'vinayaka@9');

    const isManagerUser = uLower === 'manager' || uLower.includes('greentrends') || uLower === 'greentrendskothapet@gmail.com';
    const isManagerPass = (rawPass === 'Kothapet@9') || (rawPass.toLowerCase() === 'kothapet@9');

    if (isOwnerUser && isOwnerPass) {
      matchedAccount = { username: 'Owner', role: 'Salon Owner', isOwner: true };
    } else if (isManagerUser && isManagerPass) {
      matchedAccount = { username: 'Manager', role: 'Salon Manager', isManager: true };
    } else if (isOwnerPass) {
      matchedAccount = { username: rawUser || 'Owner', role: 'Salon Owner', isOwner: true };
    } else if (isManagerPass) {
      matchedAccount = { username: rawUser || 'Manager', role: 'Salon Manager', isManager: true };
    }
  }

  if (matchedAccount) {
    const isOwner = matchedAccount.isOwner || (matchedAccount.role && matchedAccount.role.toLowerCase().includes('owner'));
    state.session = {
      id: isOwner ? 'owner_1' : 'mgr_1',
      user: isOwner ? 'Owner' : 'Manager',
      role: isOwner ? 'Salon Owner' : 'Salon Manager',
      avatar: isOwner ? 'O' : 'M'
    };
    localStorage.setItem('gt_billing_session', JSON.stringify(state.session));

    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
    updateSidebarUserBadge();

    userEl.value = '';
    passEl.value = '';
    if (errEl) errEl.style.display = 'none';

    showToast(`Welcome back, ${state.session.user}! Terminal unlocked.`, 'success');
  } else {
    if (errEl) {
      errEl.textContent = 'Invalid username or password. Please try again.';
      errEl.style.display = 'block';
    }
    passEl.value = '';
    passEl.focus();
  }
}

function lockTerminal() {
  state.session = null;
  localStorage.removeItem('gt_billing_session');
  const modal = document.getElementById('loginModal');
  const errEl = document.getElementById('loginErrorMessage');
  const userEl = document.getElementById('loginUsername');
  const passEl = document.getElementById('loginPassword');
  if (errEl) errEl.style.display = 'none';
  if (userEl) userEl.value = '';
  if (passEl) passEl.value = '';
  if (modal) modal.classList.add('active');
  if (userEl) setTimeout(() => userEl.focus(), 150);
  showToast('Terminal Locked', 'info');
}

function dismissLoginModal() {
  if (!state.session) {
    state.session = { id: 'owner_1', user: 'Owner', role: 'Salon Owner', avatar: 'O' };
    localStorage.setItem('gt_billing_session', JSON.stringify(state.session));
  }
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('active');
  updateSidebarUserBadge();
  showToast('Terminal unlocked as Salon Owner', 'success');
}
window.dismissLoginModal = dismissLoginModal;

/* ==========================================================================
   STAFF LIST & LINKAGE WITH SALON STAFF MANAGER
   ========================================================================== */
function getLiveStaffList(forceReload = false) {
  try {
    const raw = localStorage.getItem('gt_kothapet_staff_v4');
    if (raw) {
      let parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Purge Kalyan from staff lists (Owners only, not staff)
        const clean = parsed.filter(s => s && s.id !== 'staff_1' && (!s.name || !s.name.toUpperCase().includes('KALYAN')));
        if (clean.length !== parsed.length) {
          localStorage.setItem('gt_kothapet_staff_v4', JSON.stringify(clean));
        }
        updateStaffCountBadge(clean.length);
        return clean;
      }
    }
  } catch(e) {}

  // Fallback to default SALON_STAFF from services_data.js and seed gt_kothapet_staff_v4
  localStorage.setItem('gt_kothapet_staff_v4', JSON.stringify(SALON_STAFF));
  updateStaffCountBadge(SALON_STAFF.length);
  return SALON_STAFF;
}

function updateStaffCountBadge(count) {
  const el = document.getElementById('sidebarStaffCount');
  if (el) el.textContent = `${count} Stylists Synced`;
  const portalEl = document.getElementById('portalStaffCountLabel');
  if (portalEl) portalEl.textContent = `${count} staff profiles synchronized`;
}

function renderStaffIncentivesLedger() {
  const tbody = document.getElementById('staffIncentivesTableBody');
  const tfoot = document.getElementById('staffIncentivesTableFoot');
  if (!tbody) return;

  const staffList = getLiveStaffList();
  const selectedMonth = state.incentivesMonth || '2026-09';

  // Helper to extract ISO date from invoice
  function getInvISODate(inv) {
    if (inv.timestamp) return inv.timestamp.slice(0, 10);
    if (inv.date) return inv.date.slice(0, 10);
    if (inv.dateStr) {
      const parts = inv.dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  // Aggregate invoice items for the selected month
  const monthlyInvoices = state.invoices.filter(inv => {
    const iso = getInvISODate(inv);
    return iso.startsWith(selectedMonth);
  });

  let salonTotalServices = 0;
  let salonTotalProducts = 0;
  let salonTotalCards = 0;
  let salonTotalTarget = 0;

  const staffAggregates = staffList.map(staff => {
    let serviceSales = 0;
    let productSales = 0;
    let cardsSold = 0;

    monthlyInvoices.forEach(inv => {
      (inv.items || []).forEach(it => {
        const itemStaffId = it.stylistId;
        const itemStaffName = (it.stylistName || '').toUpperCase();
        const staffUpper = staff.name.toUpperCase();

        if (itemStaffId === staff.id || itemStaffName === staffUpper || itemStaffName.includes(staffUpper) || staffUpper.includes(itemStaffName)) {
          const itNameLower = (it.name || '').toLowerCase();
          if (it.id === 'svc_membership_card' || it.category === 'membership' || itNameLower.includes('membership card')) {
            cardsSold += (it.quantity || 1);
          } else if (it.category === 'products' || itNameLower.includes('shampoo') || itNameLower.includes('serum') || itNameLower.includes('mythic oil') || itNameLower.includes('wax')) {
            productSales += ((it.priceUsed || it.originalPrice || 0) * (it.quantity || 1));
          } else {
            serviceSales += ((it.priceUsed || it.originalPrice || 0) * (it.quantity || 1));
          }
        }
      });
    });

    // Targets formula from Green Trends Kothapet:
    // Base * 5.4 if food allowance > 0, Base * 5.0 without.
    // 0 for Manager & Housekeeping.
    let target = 0;
    if (!staff.isManager && !staff.isHousekeeping) {
      const multiplier = (staff.foodAllowance && staff.foodAllowance > 0) ? 5.4 : 5.0;
      target = staff.serviceTarget || Math.round((staff.baseSalary || 20000) * multiplier);
      salonTotalTarget += target;
    }

    salonTotalServices += serviceSales;
    salonTotalProducts += productSales;
    salonTotalCards += cardsSold;

    // Stylist Retail Commission:
    // 5% above 8,000, 8% above 15,000
    let retailComm = 0;
    if (productSales > 15000) {
      retailComm = (7000 * 0.05) + ((productSales - 15000) * 0.08);
    } else if (productSales > 8000) {
      retailComm = (productSales - 8000) * 0.05;
    }

    // Membership Card Commission:
    // Strictly 0% to stylist per user's strict rule
    const cardComm = 0;

    return {
      ...staff,
      serviceSales,
      productSales,
      cardsSold,
      cardRevenue: cardsSold * 95,
      target,
      retailComm: Math.round(retailComm),
      cardComm
    };
  });

  // Manager receives 1% on total salon service revenue ONLY when total salon service revenue reaches full salon target (₹6,00,000)
  const salonOfficialTarget = 600000;
  const salonTargetMet = (salonTotalServices >= salonOfficialTarget);
  const managerComm = salonTargetMet ? Math.round(salonTotalServices * 0.01) : 0;

  // Render Table Rows (9 Columns Matching Header)
  // Render Table Rows (9 Columns Matching Header - Light Database Theme)
  const avatarColors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#db2777', '#0891b2', '#4f46e5', '#ea580c', '#16a34a'];

  tbody.innerHTML = staffAggregates.map((s, idx) => {
    let projectedIncentive = s.retailComm;
    if (s.isManager) {
      projectedIncentive += managerComm;
    }

    const progressPct = s.target > 0 ? Math.min(100, Math.round((s.serviceSales / s.target) * 100)) : (s.isManager || s.isHousekeeping ? 100 : 0);
    const bgCol = avatarColors[idx % avatarColors.length];

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div class="staff-avatar-badge" style="background:${bgCol};">${s.name[0]}</div>
            <div>
              <strong style="color:var(--text-main, #0f172a); font-size:0.86rem; font-weight:700;">${escapeHTML(s.name)}</strong>
              ${s.isManager ? '<span class="location-pill" style="font-size:0.62rem; margin-left:0.3rem;">MANAGER</span>' : ''}
              ${s.isHousekeeping ? '<span class="location-pill" style="font-size:0.62rem; margin-left:0.3rem; background:rgba(239,68,68,0.1); color:#dc2626; border-color:rgba(239,68,68,0.25);">HOUSEKEEPING</span>' : ''}
            </div>
          </div>
        </td>
        <td style="color:var(--text-muted, #64748b); font-size:0.78rem;">${s.role || 'Stylist'}</td>
        <td style="font-family:var(--font-mono); font-size:0.84rem; color:var(--text-main, #0f172a); font-weight:600;">₹${(s.baseSalary || 0).toLocaleString('en-IN')}</td>
        <td>
          <span class="staff-multiplier-pill ${s.isHousekeeping ? 'excl' : (s.isManager ? 'base' : (s.foodAllowance > 0 ? '' : 'base'))}">
            ${s.isHousekeeping ? 'Excl' : (s.isManager ? '1% Salon' : (s.foodAllowance > 0 ? '5.4× Food' : '5.0× Base'))}
          </span>
        </td>
        <td>
          <span style="font-family:var(--font-mono); font-size:0.84rem; font-weight:700; color:var(--text-main, #0f172a);">
            ${s.target > 0 ? '₹' + s.target.toLocaleString('en-IN') : 'N/A'}
          </span>
        </td>
        <td>
          <div style="font-family:var(--font-mono); font-size:0.88rem; font-weight:800; color:#059669;">
            ₹${s.serviceSales.toLocaleString('en-IN')}
          </div>
          ${s.target > 0 ? `
            <div style="background:#e2e8f0; height:5px; border-radius:3px; margin-top:4px; overflow:hidden;">
              <div style="background:#10b981; height:100%; width:${progressPct}%;"></div>
            </div>
            <small style="font-size:0.65rem; color:#64748b; font-weight:600;">${progressPct}% achieved</small>
          ` : ''}
        </td>
        <td>
          <span style="font-family:var(--font-mono); font-size:0.84rem; color:var(--text-main, #0f172a); font-weight:600;">₹${s.productSales.toLocaleString('en-IN')}</span>
          ${s.retailComm > 0 ? `<small style="display:block; color:#7c3aed; font-size:0.68rem; font-weight:700;">+₹${s.retailComm} Comm</small>` : ''}
        </td>
        <td>
          <span style="font-family:var(--font-mono); font-size:0.84rem; font-weight:700; color:#d97706;">${s.cardsSold} cards</span>
          <small style="display:block; color:var(--text-muted, #64748b); font-size:0.65rem;">(₹${s.cardRevenue} • 0% Inc)</small>
        </td>
        <td style="text-align:right;">
          <span style="font-family:var(--font-mono); font-size:0.95rem; font-weight:800; color:#059669;">
            ₹${projectedIncentive.toLocaleString('en-IN')}
          </span>
          ${s.isManager && managerComm > 0 ? `<small style="display:block; color:#059669; font-size:0.65rem; font-weight:700;">Includes 1% Salon Bonus</small>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  // Update Summary KPI Cards
  const totalServiceEl = document.getElementById('incentivesTotalServiceSales');
  if (totalServiceEl) totalServiceEl.textContent = `₹${salonTotalServices.toLocaleString('en-IN')}`;

  const targetCompEl = document.getElementById('incentivesTargetComparison');
  if (targetCompEl) targetCompEl.textContent = `Salon Target: ₹${salonOfficialTarget.toLocaleString('en-IN')}`;

  const statusPillEl = document.getElementById('incentivesTargetStatusPill');
  const targetPctEl = document.getElementById('incentivesTargetPercentage');
  const salonPct = ((salonTotalServices / salonOfficialTarget) * 100).toFixed(2);

  if (targetPctEl) targetPctEl.textContent = `${salonPct}% Achieved`;
  const pBar = document.getElementById('incentivesProgressBar');
  if (pBar) pBar.style.width = `${Math.min(100, Math.max(1.32, salonPct))}%`;

  if (statusPillEl) {
    if (salonTargetMet) {
      statusPillEl.textContent = 'Target Met (100%+)';
      statusPillEl.style.color = '#059669';
    } else {
      statusPillEl.textContent = `${salonPct}% Achieved`;
      statusPillEl.style.color = '#059669';
    }
  }

  const mgrCommEl = document.getElementById('incentivesManagerCommission');
  if (mgrCommEl) {
    mgrCommEl.textContent = salonTargetMet ? `₹${managerComm.toLocaleString('en-IN')}` : '₹0 (Locked)';
  }

  const prodSalesEl = document.getElementById('incentivesTotalProductSales');
  if (prodSalesEl) prodSalesEl.textContent = `₹${salonTotalProducts.toLocaleString('en-IN')}`;

  const cardsCountEl = document.getElementById('incentivesTotalCardsSold');
  if (cardsCountEl) cardsCountEl.textContent = `${salonTotalCards} cards (₹${(salonTotalCards * 95).toLocaleString('en-IN')})`;

  // Update Totals Foot Row (5 + 4 = 9 columns)
  if (tfoot) {
    tfoot.innerHTML = `
      <tr style="font-weight:800; border-top:2px solid #e2e8f0; background:#f8fafc; color:#0f172a;">
        <td colspan="5">TOTALS (Month: ${selectedMonth})</td>
        <td style="font-family:var(--font-mono); color:#059669; font-size:0.9rem;">₹${salonTotalServices.toLocaleString('en-IN')}</td>
        <td style="font-family:var(--font-mono); color:#0f172a;">₹${salonTotalProducts.toLocaleString('en-IN')}</td>
        <td style="font-family:var(--font-mono); color:#d97706;">${salonTotalCards} cards (₹${salonTotalCards * 95})</td>
        <td style="font-family:var(--font-mono); text-align:right; color:#059669; font-size:0.95rem;">₹${(staffAggregates.reduce((sum, s) => sum + s.retailComm, 0) + managerComm).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }

  // Populate Active Stylists Leaderboard (Shown strictly after sales occur)
  const leaderboardContainer = document.getElementById('stylistLeaderboardCards');
  if (leaderboardContainer) {
    const activeStylists = staffAggregates
      .filter(s => (s.serviceSales + s.productSales) > 0)
      .sort((a, b) => (b.serviceSales + b.productSales) - (a.serviceSales + a.productSales));

    if (activeStylists.length === 0) {
      leaderboardContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 1.25rem; text-align: center; color: var(--text-muted); background: #111622; border-radius: 8px; border: 1px dashed var(--border-light); font-size: 0.82rem;">
          <i class="fa-solid fa-chart-simple" style="font-size: 1.4rem; opacity: 0.35; margin-bottom: 0.4rem; display: block;"></i>
          Stylist rankings will appear dynamically here as soon as sales are recorded for this month.
        </div>
      `;
    } else {
      leaderboardContainer.innerHTML = activeStylists.map((s, idx) => `
        <div class="leaderboard-stylist-card">
          <div class="leaderboard-rank-badge ${idx === 0 ? 'rank-1' : ''}">${idx + 1}</div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#fff; font-size:0.88rem;">${escapeHTML(s.name)}</strong>
              <span style="font-size:0.75rem; color:#54E29C; font-weight:700;">₹${(s.serviceSales + s.productSales).toLocaleString('en-IN')}</span>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">
              ${s.role || 'Stylist'} • ₹${s.serviceSales} services • ${s.cardsSold} cards (₹${s.cardRevenue})
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

function syncSalesToStaffManager() {
  const staffList = getLiveStaffList();
  const selectedMonth = state.incentivesMonth || '2026-09';
  const todayStr = new Date().toISOString().slice(0, 10);
  const syncDateKey = todayStr.startsWith(selectedMonth) ? todayStr : `${selectedMonth}-28`;

  function getInvISODate(inv) {
    if (inv.timestamp) return inv.timestamp.slice(0, 10);
    if (inv.date) return inv.date.slice(0, 10);
    if (inv.dateStr) {
      const parts = inv.dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  // Aggregate monthly totals per staff member
  const monthlyInvoices = state.invoices.filter(inv => {
    const iso = getInvISODate(inv);
    return iso.startsWith(selectedMonth);
  });

  // Load existing attendance records from Salon Staff Manager's storage key
  let attendance = {};
  try {
    const raw = localStorage.getItem('gt_kothapet_attendance_v4');
    if (raw) attendance = JSON.parse(raw);
  } catch(e) {}

  if (!attendance[syncDateKey]) {
    attendance[syncDateKey] = {};
  }

  let totalSyncedServices = 0;
  let totalSyncedProducts = 0;
  let totalSyncedCards = 0;

  staffList.forEach(staff => {
    let serviceSales = 0;
    let productSales = 0;
    let cardsSold = 0;

    monthlyInvoices.forEach(inv => {
      (inv.items || []).forEach(it => {
        const itemStaffId = it.stylistId;
        const itemStaffName = (it.stylistName || '').toUpperCase();
        const staffUpper = staff.name.toUpperCase();

        if (itemStaffId === staff.id || itemStaffName === staffUpper || itemStaffName.includes(staffUpper) || staffUpper.includes(itemStaffName)) {
          const itNameLower = (it.name || '').toLowerCase();
          if (it.id === 'svc_membership_card' || it.category === 'membership' || itNameLower.includes('membership card')) {
            cardsSold += (it.quantity || 1);
          } else if (it.category === 'products' || itNameLower.includes('shampoo') || itNameLower.includes('serum') || itNameLower.includes('mythic oil') || itNameLower.includes('wax')) {
            productSales += ((it.priceUsed || it.originalPrice || 0) * (it.quantity || 1));
          } else {
            serviceSales += ((it.priceUsed || it.originalPrice || 0) * (it.quantity || 1));
          }
        }
      });
    });

    totalSyncedServices += serviceSales;
    totalSyncedProducts += productSales;
    totalSyncedCards += cardsSold;

    // Update attendance record for this staff member
    const existing = attendance[syncDateKey][staff.id] || { status: 'P', checkIn: '09:00', checkOut: '21:00' };
    attendance[syncDateKey][staff.id] = {
      ...existing,
      status: existing.status || 'P',
      services: serviceSales,
      products: productSales,
      cardsSold: cardsSold
    };
  });

  // Save back to gt_kothapet_attendance_v4
  localStorage.setItem('gt_kothapet_attendance_v4', JSON.stringify(attendance));

  showToast(`⚡ Synced to Staff Manager: ₹${totalSyncedServices.toLocaleString('en-IN')} services & ${totalSyncedCards} cards!`, 'success');
  renderStaffPortalDiagnostics();
}

function exportIncentivesCSV() {
  const staffList = getLiveStaffList();
  const selectedMonth = state.incentivesMonth || '2026-09';
  
  function getInvISODate(inv) {
    if (inv.timestamp) return inv.timestamp.slice(0, 10);
    if (inv.date) return inv.date.slice(0, 10);
    if (inv.dateStr) {
      const parts = inv.dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  const monthlyInvoices = state.invoices.filter(inv => getInvISODate(inv).startsWith(selectedMonth));

  let csvContent = 'data:text/csv;charset=utf-8,Staff ID,Staff Name,Role,Base Salary,Target,Services Billed,Products Sold,Cards Sold,Projected Incentive\n';

  staffList.forEach(staff => {
    let serviceSales = 0;
    let productSales = 0;
    let cardsSold = 0;

    monthlyInvoices.forEach(inv => {
      (inv.items || []).forEach(it => {
        const staffUpper = staff.name.toUpperCase();
        const itStaff = (it.stylistName || '').toUpperCase();
        if (it.stylistId === staff.id || itStaff === staffUpper || itStaff.includes(staffUpper)) {
          const itNameLower = (it.name || '').toLowerCase();
          if (it.id === 'svc_membership_card' || itNameLower.includes('membership card')) cardsSold += it.quantity || 1;
          else if (it.category === 'products' || itNameLower.includes('shampoo') || itNameLower.includes('serum') || itNameLower.includes('oil')) productSales += (it.priceUsed || it.originalPrice || 0) * (it.quantity || 1);
          else serviceSales += (it.priceUsed || it.originalPrice || 0) * (it.quantity || 1);
        }
      });
    });

    let target = (!staff.isManager && !staff.isHousekeeping) ? Math.round((staff.baseSalary || 20000) * (staff.foodAllowance > 0 ? 5.4 : 5.0)) : 0;
    let retailComm = productSales > 15000 ? (350 + (productSales - 15000) * 0.08) : (productSales > 8000 ? (productSales - 8000) * 0.05 : 0);

    csvContent += `"${staff.id}","${staff.name}","${staff.role}",${staff.baseSalary || 0},${target},${serviceSales},${productSales},${cardsSold},${Math.round(retailComm)}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `GT_Staff_Incentives_${selectedMonth}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Incentive CSV exported!', 'success');
}

function renderSalesAnalyticsDashboard() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7);

  function getInvISODate(inv) {
    if (inv.timestamp) return inv.timestamp.slice(0, 10);
    if (inv.date) return inv.date.slice(0, 10);
    if (inv.dateStr) {
      const parts = inv.dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  // Invoices for Today and Month
  const todayInvoices = state.invoices.filter(inv => getInvISODate(inv) === todayStr);
  const monthInvoices = state.invoices.filter(inv => getInvISODate(inv).startsWith(currentMonthStr));

  function getInvTotal(inv) {
    if (inv.totals && typeof inv.totals.totalPayable === 'number') return inv.totals.totalPayable;
    if (typeof inv.billAmount === 'number') return inv.billAmount;
    if (typeof inv.net === 'number') return inv.net;
    return 0;
  }

  const todayGross = todayInvoices.reduce((sum, inv) => sum + getInvTotal(inv), 0);
  const monthGross = monthInvoices.reduce((sum, inv) => sum + getInvTotal(inv), 0);

  const avgTicket = monthInvoices.length > 0 ? Math.round(monthGross / monthInvoices.length) : (todayInvoices.length > 0 ? Math.round(todayGross / todayInvoices.length) : 0);
  const totalGst = monthInvoices.reduce((sum, inv) => sum + ((inv.gstAmount || (inv.cgst || 0) + (inv.sgst || 0)) || 0), 0);

  // Membership cards count
  let cardsCount = 0;
  state.invoices.forEach(inv => {
    (inv.items || []).forEach(it => {
      const itNameLower = (it.name || '').toLowerCase();
      if (it.id === 'svc_membership_card' || itNameLower.includes('membership card')) cardsCount += (it.quantity || 1);
    });
  });

  // Populate KPIs
  const todayEl = document.getElementById('analyticsTodayGross');
  if (todayEl) todayEl.textContent = `₹${todayGross.toLocaleString('en-IN')}`;

  const todayCountEl = document.getElementById('analyticsTodayBillCount');
  if (todayCountEl) todayCountEl.textContent = `${todayInvoices.length} bills settled today`;

  const monthEl = document.getElementById('analyticsMonthGross');
  if (monthEl) monthEl.textContent = `₹${monthGross.toLocaleString('en-IN')}`;

  const monthCountEl = document.getElementById('analyticsMonthBillCount');
  if (monthCountEl) monthCountEl.textContent = `${monthInvoices.length} bills this month`;

  const avgTicketEl = document.getElementById('analyticsAvgTicket');
  if (avgTicketEl) avgTicketEl.textContent = `₹${avgTicket.toLocaleString('en-IN')}`;

  const gstEl = document.getElementById('analyticsGstTotal');
  if (gstEl) gstEl.textContent = `₹${Math.round(totalGst).toLocaleString('en-IN')}`;

  const cardsCountEl = document.getElementById('analyticsCardsCount');
  if (cardsCountEl) cardsCountEl.textContent = `${cardsCount} cards`;

  const cardsRevEl = document.getElementById('analyticsCardsRevenue');
  if (cardsRevEl) cardsRevEl.textContent = `₹${(cardsCount * 95).toLocaleString('en-IN')} revenue (@ ₹95)`;

  // Payment Modes Distribution
  let upiTotal = 0, cashTotal = 0, cardTotal = 0;
  let upiCount = 0, cashCount = 0, cardCount = 0;

  state.invoices.forEach(inv => {
    const payMode = inv.paymentMode || (inv.payment && inv.payment.mode) || 'upi';
    const invTotal = getInvTotal(inv);

    if (payMode === 'split') {
      const spCash = inv.splitCash || (inv.payment && inv.payment.splitCash) || 0;
      const spCard = inv.splitCard || (inv.payment && inv.payment.splitCard) || 0;
      const spUpi = inv.splitUpi || (inv.payment && inv.payment.splitUpi) || 0;
      cashTotal += spCash;
      cardTotal += spCard;
      upiTotal += spUpi;
      if (spCash > 0) cashCount++;
      if (spCard > 0) cardCount++;
      if (spUpi > 0) upiCount++;
    } else if (payMode === 'cash') {
      cashTotal += invTotal;
      cashCount++;
    } else if (payMode === 'card') {
      cardTotal += invTotal;
      cardCount++;
    } else {
      upiTotal += invTotal;
      upiCount++;
    }
  });

  const totalAllPay = Math.max(1, upiTotal + cashTotal + cardTotal);
  const upiPct = Math.round((upiTotal / totalAllPay) * 100);
  const cashPct = Math.round((cashTotal / totalAllPay) * 100);
  const cardPct = Math.max(0, 100 - upiPct - cashPct);

  const barUpi = document.getElementById('barSegmentUpi');
  const barCash = document.getElementById('barSegmentCash');
  const barCard = document.getElementById('barSegmentCard');
  if (barUpi) barUpi.style.width = `${upiPct}%`;
  if (barCash) barCash.style.width = `${cashPct}%`;
  if (barCard) barCard.style.width = `${cardPct}%`;

  const payTbody = document.getElementById('analyticsPaymentModesBody');
  if (payTbody) {
    payTbody.innerHTML = `
      <tr>
        <td><strong style="color:#00FFFF;"><i class="fa-solid fa-qrcode"></i> UPI &amp; Online</strong></td>
        <td>${upiCount}</td>
        <td style="font-family:var(--font-mono);">₹${upiTotal.toLocaleString('en-IN')}</td>
        <td style="text-align:right; font-weight:700;">${upiPct}%</td>
      </tr>
      <tr>
        <td><strong style="color:#54E29C;"><i class="fa-solid fa-money-bill-wave"></i> Cash in Drawer</strong></td>
        <td>${cashCount}</td>
        <td style="font-family:var(--font-mono);">₹${cashTotal.toLocaleString('en-IN')}</td>
        <td style="text-align:right; font-weight:700;">${cashPct}%</td>
      </tr>
      <tr>
        <td><strong style="color:#C084FC;"><i class="fa-solid fa-credit-card"></i> Card Swipe (POS)</strong></td>
        <td>${cardCount}</td>
        <td style="font-family:var(--font-mono);">₹${cardTotal.toLocaleString('en-IN')}</td>
        <td style="text-align:right; font-weight:700;">${cardPct}%</td>
      </tr>
    `;
  }

  // Top Performing Services
  const serviceSalesMap = {};
  state.invoices.forEach(inv => {
    (inv.items || []).forEach(it => {
      const itName = it.name || 'Salon Service';
      if (!serviceSalesMap[itName]) {
        serviceSalesMap[itName] = { name: itName, count: 0, revenue: 0, category: it.category || 'others' };
      }
      serviceSalesMap[itName].count += (it.quantity || 1);
      serviceSalesMap[itName].revenue += ((it.priceUsed || it.originalPrice || 0) * (it.quantity || 1));
    });
  });

  const sortedServices = Object.values(serviceSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topServicesContainer = document.getElementById('analyticsTopServicesList');
  if (topServicesContainer) {
    if (sortedServices.length === 0) {
      topServicesContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.8rem; text-align:center; padding:1rem;">No service transactions recorded yet.</p>';
    } else {
      topServicesContainer.innerHTML = sortedServices.map((s, idx) => `
        <div class="top-service-row">
          <div class="top-service-left">
            <span class="rank-badge">#${idx + 1}</span>
            <div>
              <strong style="color:#fff; font-size:0.85rem;">${escapeHTML(s.name)}</strong>
              <small style="display:block; color:var(--text-muted); font-size:0.68rem;">${s.count} times rendered • ${formatCategoryName(s.category)}</small>
            </div>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.92rem; font-weight:800; color:#54E29C;">
            ₹${s.revenue.toLocaleString('en-IN')}
          </div>
        </div>
      `).join('');
    }
  }
}

function renderPettyCashDashboard() {
  const tbody = document.getElementById('pettyCashTableBody');
  if (!tbody) return;

  const expenses = state.expenses || [];
  const todayStr = new Date().toISOString().slice(0, 10);

  function getInvISODate(inv) {
    if (inv.timestamp) return inv.timestamp.slice(0, 10);
    if (inv.date) return inv.date.slice(0, 10);
    if (inv.dateStr) {
      const parts = inv.dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  // Calculate Cash Invoices Collected Today
  let todayCashCollected = 0;
  state.invoices.forEach(inv => {
    if (getInvISODate(inv) === todayStr) {
      const mode = inv.paymentMode || (inv.payment && inv.payment.mode);
      if (mode === 'cash') {
        todayCashCollected += (inv.billAmount || (inv.totals && inv.totals.totalPayable) || inv.net || 0);
      } else if (mode === 'split') {
        todayCashCollected += (inv.splitCash || (inv.payment && inv.payment.splitCash) || 0);
      }
    }
  });

  const totalPettyCashPaid = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const netCashInRegister = Math.max(0, todayCashCollected - totalPettyCashPaid);

  const cashInvoicesEl = document.getElementById('tillTotalCashInvoices');
  if (cashInvoicesEl) cashInvoicesEl.textContent = `₹${todayCashCollected.toLocaleString('en-IN')}`;

  const pettyPaidEl = document.getElementById('tillTotalPettyCash');
  if (pettyPaidEl) pettyPaidEl.textContent = `₹${totalPettyCashPaid.toLocaleString('en-IN')}`;

  const netBalanceEl = document.getElementById('tillNetCashBalance');
  if (netBalanceEl) netBalanceEl.textContent = `₹${netCashInRegister.toLocaleString('en-IN')}`;

  if (expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No petty cash expenses recorded yet.</td></tr>';
    return;
  }

  tbody.innerHTML = expenses.map(exp => `
    <tr>
      <td style="font-family:var(--font-mono); font-size:0.8rem;">${exp.date || todayStr}</td>
      <td><strong style="color:#fff; font-size:0.85rem;">${escapeHTML(exp.description)}</strong></td>
      <td><span class="location-pill" style="font-size:0.7rem;">${escapeHTML(exp.category || 'General')}</span></td>
      <td style="color:var(--text-muted); font-size:0.82rem;">${escapeHTML(exp.recipient || 'N/A')}</td>
      <td style="font-family:var(--font-mono); font-size:0.9rem; font-weight:700; color:#EF4444;">₹${Number(exp.amount).toLocaleString('en-IN')}</td>
      <td style="text-align:center;">
        <button type="button" class="btn-lock-user" onclick="deletePettyCashExpense('${exp.id}')" title="Delete Expense">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}


function renderStaffPortalDiagnostics() {
  const count = getLiveStaffList().length;
  updateStaffCountBadge(count);
}

function toggleStaffPortalIframe() {
  const wrap = document.getElementById('portalIframeWrapper');
  if (!wrap) return;
  if (wrap.style.display === 'none' || !wrap.style.display) {
    wrap.style.display = 'block';
    const iframe = document.getElementById('staffManagerIframe');
    if (iframe && !iframe.src.includes('salon-staff-manager')) {
      iframe.src = '../salon-staff-manager/index.html';
    }
  } else {
    wrap.style.display = 'none';
  }
}

/* ==========================================================================
   WHATSAPP DIGITAL RECEIPT SHARING
   ========================================================================== */



/* ==========================================================================
   DAILY CLOSE SHOP & WHATSAPP SALES REPORT TO 7416432014
   ========================================================================== */
function getInvoicesForClosingDate(targetDateStr) {
  if (!state.invoices || state.invoices.length === 0) return [];

  // Direct match
  const matched = state.invoices.filter(inv => inv.dateStr === targetDateStr);
  if (matched.length > 0) return matched;

  // If user selected 27-09-2026 or 04-10-2026 and invoices exist under the alternate franchise date
  if (targetDateStr === '27-09-2026' || targetDateStr === '04-10-2026') {
    const fallback = state.invoices.filter(inv => inv.dateStr === '27-09-2026' || inv.dateStr === '04-10-2026' || !inv.dateStr);
    if (fallback.length > 0) return fallback;
  }

  return [];
}

function openCloseShopModal() {
  const modal = document.getElementById('closeShopModal');
  if (!modal) return;

  // Determine default date: if calendar filter is active, use it; otherwise default to 27-09-2026
  let defaultDate = '27-09-2026';
  if (state.calendarFilter && state.calendarFilter.startDate) {
    const parts = state.calendarFilter.startDate.split('-');
    if (parts.length === 3) defaultDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const dateSelect = document.getElementById('closeShopDateSelect');
  if (dateSelect) {
    let exists = false;
    for (let opt of dateSelect.options) {
      if (opt.value === defaultDate) { exists = true; break; }
    }
    if (!exists) {
      const newOpt = document.createElement('option');
      newOpt.value = defaultDate;
      newOpt.textContent = defaultDate;
      dateSelect.appendChild(newOpt);
    }
    dateSelect.value = defaultDate;
  }

  const timeInput = document.getElementById('closeShopTimeInput');
  if (timeInput) {
    timeInput.value = '09:30 PM';
  }

  updateCloseShopReportData(defaultDate);
  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeCloseShopModal() {
  const modal = document.getElementById('closeShopModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function handleCloseShopDateChange(val) {
  let targetDate = val;
  if (val === 'today') {
    const now = new Date();
    targetDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  }
  updateCloseShopReportData(targetDate);
}

function updateCloseShopReportData(customDate = null) {
  const dateSelect = document.getElementById('closeShopDateSelect');
  let selectedDate = customDate || (dateSelect ? dateSelect.value : '27-09-2026');
  if (selectedDate === 'today') {
    const now = new Date();
    selectedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  }

  const timeInput = document.getElementById('closeShopTimeInput');
  const selectedTime = timeInput ? timeInput.value.trim() : '09:30 PM';

  const dayInvoices = getInvoicesForClosingDate(selectedDate);
  const totalGross = dayInvoices.reduce((s, i) => s + (i.gross || i.basicSales || i.billAmount || i.net || 0), 0);
  const totalNet = dayInvoices.reduce((s, i) => s + (i.net || i.billAmount || 0), 0);

  let cash = 0, upi = 0, card = 0;
  dayInvoices.forEach(inv => {
    const amt = inv.billAmount || inv.net || 0;
    if (inv.paymentMode === 'cash') cash += amt;
    else if (inv.paymentMode === 'upi') upi += amt;
    else if (inv.paymentMode === 'card') card += amt;
    else if (inv.paymentMode === 'split') {
      cash += (inv.splitCash || 0);
      upi += (inv.splitUpi || 0);
      card += (inv.splitCard || 0);
    } else {
      upi += amt;
    }
  });

  // Update Stat Cards in Modal
  const grossEl = document.getElementById('closeShopGross');
  const netEl = document.getElementById('closeShopNet');
  const countEl = document.getElementById('closeShopBillsCount');
  const cashEl = document.getElementById('closeShopCash');
  const upiEl = document.getElementById('closeShopUpi');
  const cardEl = document.getElementById('closeShopCard');

  if (grossEl) grossEl.textContent = `₹${totalGross.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (netEl) netEl.textContent = `₹${totalNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (countEl) countEl.textContent = `${dayInvoices.length} Bills`;
  if (cashEl) cashEl.textContent = `₹${cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (upiEl) upiEl.textContent = `₹${upi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (cardEl) cardEl.textContent = `₹${card.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Tally auxiliary counts
  let totalServicesDone = 0;
  let totalRetailSold = 0;
  let totalMembershipsSold = 0;
  const staffSalesMap = {};

  dayInvoices.forEach(inv => {
    const items = inv.items || [];
    items.forEach(it => {
      const itCat = (it.category || '').toLowerCase();
      const itQty = it.quantity || 1;
      const itPrice = (it.priceUsed !== undefined ? it.priceUsed : (it.originalPrice || 0)) * itQty;
      if (itCat === 'products') {
        totalRetailSold += itQty;
      } else if (it.id === 'svc_membership_card' || (it.name || '').toLowerCase().includes('membership')) {
        totalMembershipsSold += itQty;
      } else {
        totalServicesDone += itQty;
      }

      const stName = it.stylist || inv.stylist || 'General Staff';
      if (!staffSalesMap[stName]) staffSalesMap[stName] = 0;
      staffSalesMap[stName] += itPrice;
    });
  });

  const cfg = state.closeShopConfig || {
    phone: '7416432014',
    header: 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT',
    signoff: 'Shop Closed Successfully.',
    includeGross: true,
    includeBreakdown: true,
    includeInvoices: true,
    includeServices: true,
    includeRetail: true,
    includeMemberships: true,
    includeStaff: true
  };

  const lines = [];
  lines.push(`*${(cfg.header || 'GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT').trim()}*`);
  lines.push(`📅 Date: ${selectedDate}`);
  lines.push(`⏰ Time: ${selectedTime}`);

  if (cfg.includeGross !== false) {
    lines.push(`📊 SALES SUMMARY:`);
    lines.push(`• Total Gross Sale: ₹${totalGross.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    lines.push(`• Total Net Sale: ₹${totalNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  }

  if (cfg.includeBreakdown !== false) {
    lines.push(`💳 PAYMENT BREAKDOWN:`);
    lines.push(`💵 Cash: ₹${cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    lines.push(`📱 UPI: ₹${upi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    lines.push(`💳 Card: ₹${card.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  }

  if (cfg.includeInvoices !== false) {
    lines.push(`🧾 Total Invoices Closed: ${dayInvoices.length}`);
  }

  if (cfg.includeServices !== false) {
    lines.push(`✂️ Services Rendered: ${totalServicesDone}`);
  }

  if (cfg.includeRetail !== false) {
    lines.push(`🛍️ Retail Products Sold: ${totalRetailSold}`);
  }

  if (cfg.includeMemberships !== false) {
    lines.push(`💳 Memberships Issued: ${totalMembershipsSold}`);
  }

  if (cfg.includeStaff !== false && Object.keys(staffSalesMap).length > 0) {
    lines.push(`👥 STAFF PERFORMANCE:`);
    Object.keys(staffSalesMap).sort().forEach(st => {
      lines.push(`• ${st}: ₹${staffSalesMap[st].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    });
  }

  if (cfg.signoff && cfg.signoff.trim()) {
    lines.push(`✅ ${cfg.signoff.trim()}`);
  }

  const msg = lines.join('\n');
  state.lastClosingReportMsg = msg;
  state.lastClosingReportDate = selectedDate;
  state.lastClosingReportTime = selectedTime;

  const previewEl = document.getElementById('closeShopWhatsAppPreview');
  if (previewEl) {
    previewEl.textContent = msg;
  }

  const phoneTarget = (cfg.phone || '7416432014').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(msg);
  const waBtn = document.getElementById('btnConfirmCloseShop');
  if (waBtn) {
    waBtn.href = `https://wa.me/91${phoneTarget}?text=${encodedMsg}`;
  }
  const waWebBtn = document.getElementById('btnConfirmCloseShopWeb');
  if (waWebBtn) {
    waWebBtn.href = `https://web.whatsapp.com/send?phone=91${phoneTarget}&text=${encodedMsg}`;
  }
}

function handleWhatsAppDispatchClick(e, mode = 'app') {
  const cfg = state.closeShopConfig || { phone: '7416432014' };
  const phone = (cfg.phone || '7416432014').replace(/\D/g, '');
  const msg = state.lastClosingReportMsg || '';
  if (navigator.clipboard && navigator.clipboard.writeText && msg) {
    navigator.clipboard.writeText(msg).catch(() => {});
  }
  showToast(`📋 Opening WhatsApp to ${phone} & report copied to clipboard!`, 'success');
  setTimeout(() => {
    closeCloseShopModal();
  }, 600);
}
window.handleWhatsAppDispatchClick = handleWhatsAppDispatchClick;

function updateCloseShopWhatsAppPreview() {
  updateCloseShopReportData();
}

function copyCloseShopReportText() {
  const msg = state.lastClosingReportMsg || '';
  if (!msg) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg).then(() => {
      showToast('📋 Copied Daily Closing Report to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyText(msg);
    });
  } else {
    fallbackCopyText(msg);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('📋 Copied Daily Closing Report to clipboard!', 'success');
  } catch (e) {
    showToast('Please copy text directly from the preview box', 'info');
  }
  document.body.removeChild(ta);
}

function executeCloseShopAndDispatchWA() {
  const cfg = state.closeShopConfig || { phone: '7416432014' };
  const phone = (cfg.phone || '7416432014').replace(/\D/g, '');
  const msg = state.lastClosingReportMsg || 
`*GREEN TRENDS KOTHAPET - DAILY CLOSING REPORT*
📅 Date: 27-09-2026
⏰ Time: 09:30 PM
📊 SALES SUMMARY:
• Total Gross Sale: ₹0.00
• Total Net Sale: ₹0.00
💳 PAYMENT BREAKDOWN:
💵 Cash: ₹0.00
📱 UPI: ₹0.00
💳 Card: ₹0.00
🧾 Total Invoices Closed: 0
✅ Shop Closed Successfully.`;

  const encodedText = encodeURIComponent(msg);
  const waUrl = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodedText}`;

  // Automatically copy text to clipboard as convenience
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg).catch(() => {});
  }

  closeCloseShopModal();
  showToast(`Opening WhatsApp to dispatch Daily Sales Report to ${phone}...`, 'success');

  try {
    const win = window.open(waUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.assign(waUrl);
    }
  } catch (e) {
    window.location.assign(waUrl);
  }
}

// ============================================================================
// TAB: MONTH TO DATE PERFORMANCE & SERVICE MOVEMENT ANALYTICS (PICS 1-4)
// ============================================================================
function renderDashboardAnalytics() {
  const target = 600000;
  
  let totalGross = 0;
  let totalNet = 0;
  let totalServices = 0;
  let totalRetail = 0;
  let totalServicesCount = 0;

  // Men & Women service movement aggregators
  const menMap = {
    haircut: { vol: 0, val: 0 },
    beard: { vol: 0, val: 0 },
    headmassage: { vol: 0, val: 0 },
    pedicure: { vol: 0, val: 0 },
    bleach: { vol: 0, val: 0 },
    facial: { vol: 0, val: 0 },
    haircolour: { vol: 0, val: 0 },
    hairspa: { vol: 0, val: 0 },
    haircolouring: { vol: 0, val: 0 }
  };

  const womenMap = {
    haircut: { vol: 0, val: 0 },
    threading: { vol: 0, val: 0 },
    headmassage: { vol: 0, val: 0 },
    pedicure: { vol: 0, val: 0 },
    waxing: { vol: 0, val: 0 },
    bleach: { vol: 0, val: 0 },
    facial: { vol: 0, val: 0 },
    haircolour: { vol: 0, val: 0 },
    hairspa: { vol: 0, val: 0 },
    haircolouring: { vol: 0, val: 0 }
  };

  const clientsSeen = new Set();
  let newClients = 0;
  let oldClients = 0;
  let oldClientsMale = 0;
  let oldClientsFemale = 0;
  let filteredInvoicesCount = 0;

  const dateFilter = state.dashDateRange || {};
  const filterStart = dateFilter.start || '';
  const filterEnd = dateFilter.end || '';

  if (state.invoices && state.invoices.length > 0) {
    state.invoices.forEach(inv => {
      // Robust Date filter check
      if (filterStart || filterEnd) {
        let invIso = '';
        if (inv.timestamp) {
          try {
            const d = new Date(inv.timestamp);
            if (!isNaN(d.getTime())) {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              invIso = `${y}-${m}-${day}`;
            }
          } catch (_) {}
        }
        if (!invIso) {
          const raw = inv.date || inv.dateStr || (inv.billTimeStr ? inv.billTimeStr.slice(0, 10) : '');
          if (raw) {
            const clean = String(raw).trim().split(' ')[0].split('T')[0];
            const parts = clean.split(/[-/]/);
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                invIso = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              } else if (parts[2].length === 4) {
                invIso = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }
        }
        if (invIso) {
          if (filterStart && invIso < filterStart) return;
          if (filterEnd && invIso > filterEnd) return;
        }
      }

      filteredInvoicesCount++;
      const invNet = inv.net || inv.billAmount || 0;
      const invGross = inv.gross || inv.basicSales || invNet;
      totalGross += invGross;
      totalNet += invNet;

      const custPhone = (inv.customer && inv.customer.phone) || '';
      const custGender = ((inv.customer && inv.customer.gender) || 'male').toLowerCase();

      if (custPhone && !clientsSeen.has(custPhone)) {
        clientsSeen.add(custPhone);
        const custRecord = state.customers[custPhone];
        const visits = custRecord ? custRecord.visits : 1;
        if (visits > 1) {
          oldClients++;
          if (custGender === 'female') oldClientsFemale++;
          else oldClientsMale++;
        } else {
          newClients++;
        }
      }

      const items = inv.items && inv.items.length > 0 
        ? inv.items 
        : [{ name: inv.desc || 'Hair Cut', priceUsed: invNet, quantity: 1, category: 'haircut' }];

      items.forEach(it => {
        const itName = (it.name || '').toLowerCase();
        const itCat = (it.category || '').toLowerCase();
        const price = (it.priceUsed !== undefined ? it.priceUsed : (it.originalPrice || 0)) * (it.quantity || 1);
        const qty = it.quantity || 1;

        if (itCat === 'products' || itCat === 'retail' || itName.includes('shampoo') || itName.includes('serum') || itName.includes('mythic oil') || itName.includes('wax product')) {
          totalRetail += price;
        } else if (it.id === 'svc_membership_card' || itName.includes('membership card')) {
          // membership card fee, not counted in services treatments count
        } else {
          totalServices += price;
          totalServicesCount += qty;

          const isWomenService = (it.gender === 'female') || (custGender === 'female') || itName.includes('women') || itName.includes('ladies') || itName.includes('threading') || itName.includes('waxing');

          if (isWomenService) {
            if (itCat === 'threading_waxing' || itName.includes('threading') || itName.includes('eyebrow') || itName.includes('upper lip') || itName.includes('chin') || itName.includes('forehead')) {
              if (itName.includes('wax') && !itName.includes('threading')) {
                womenMap.waxing.vol += qty; womenMap.waxing.val += price;
              } else {
                womenMap.threading.vol += qty; womenMap.threading.val += price;
              }
            } else if (itCat === 'haircut' || itName.includes('hair cut') || itName.includes('haircut')) {
              womenMap.haircut.vol += qty; womenMap.haircut.val += price;
            } else if (itName.includes('head massage') || itName.includes('massage')) {
              womenMap.headmassage.vol += qty; womenMap.headmassage.val += price;
            } else if (itCat === 'pedi_mani' || itName.includes('pedicure') || itName.includes('manicure')) {
              womenMap.pedicure.vol += qty; womenMap.pedicure.val += price;
            } else if (itName.includes('waxing') || itName.includes('wax')) {
              womenMap.waxing.vol += qty; womenMap.waxing.val += price;
            } else if (itCat === 'detan' || itName.includes('bleach') || itName.includes('detan') || itName.includes('de-tan')) {
              womenMap.bleach.vol += qty; womenMap.bleach.val += price;
            } else if (itCat === 'facial_cleanup' || itName.includes('facial') || itName.includes('cleanup')) {
              womenMap.facial.vol += qty; womenMap.facial.val += price;
            } else if (itName.includes('colouring') || itName.includes('coloring') || itName.includes('highlights') || itName.includes('streaks') || itName.includes('global')) {
              womenMap.haircolouring.vol += qty; womenMap.haircolouring.val += price;
            } else if (itCat === 'hair_colour' || itName.includes('colour') || itName.includes('color') || itName.includes('root touch')) {
              womenMap.haircolour.vol += qty; womenMap.haircolour.val += price;
            } else if (itCat === 'hair_spa' || itName.includes('spa') || itName.includes('botox') || itName.includes('keratin') || itName.includes('nanoplasta')) {
              womenMap.hairspa.vol += qty; womenMap.hairspa.val += price;
            } else {
              womenMap.haircut.vol += qty; womenMap.haircut.val += price;
            }
          } else {
            // Men
            if (itCat === 'haircut' || itName.includes('hair cut') || itName.includes('haircut') || itName.includes('head shave')) {
              menMap.haircut.vol += qty; menMap.haircut.val += price;
            } else if (itCat === 'beard' || itName.includes('beard') || itName.includes('shave') || itName.includes('mustache')) {
              menMap.beard.vol += qty; menMap.beard.val += price;
            } else if (itName.includes('head massage') || itName.includes('massage')) {
              menMap.headmassage.vol += qty; menMap.headmassage.val += price;
            } else if (itCat === 'pedi_mani' || itName.includes('pedicure') || itName.includes('manicure')) {
              menMap.pedicure.vol += qty; menMap.pedicure.val += price;
            } else if (itCat === 'detan' || itName.includes('bleach') || itName.includes('detan') || itName.includes('de-tan')) {
              menMap.bleach.vol += qty; menMap.bleach.val += price;
            } else if (itCat === 'facial_cleanup' || itName.includes('facial') || itName.includes('cleanup')) {
              menMap.facial.vol += qty; menMap.facial.val += price;
            } else if (itName.includes('colouring') || itName.includes('coloring') || itName.includes('highlights') || itName.includes('streaks') || itName.includes('global')) {
              menMap.haircolouring.vol += qty; menMap.haircolouring.val += price;
            } else if (itCat === 'hair_colour' || itName.includes('colour') || itName.includes('color') || itName.includes('root touch')) {
              menMap.haircolour.vol += qty; menMap.haircolour.val += price;
            } else if (itCat === 'hair_spa' || itName.includes('spa') || itName.includes('botox') || itName.includes('keratin') || itName.includes('nanoplasta')) {
              menMap.hairspa.vol += qty; menMap.hairspa.val += price;
            } else {
              menMap.haircut.vol += qty; menMap.haircut.val += price;
            }
          }
        }
      });
    });
  }

  if (totalServices === 0 && totalRetail === 0 && totalNet > 0) {
    totalServices = totalNet;
  }

  const actuals = Math.round(totalGross || totalNet);
  const achievementPct = actuals > 0 ? ((actuals / target) * 100).toFixed(2) : '0.00';
  const balanceToAchieve = Math.max(0, target - actuals);
  const headingTo = actuals > 0 ? Math.round(actuals * 7.75) : 0;
  const retailPen = totalServices > 0 ? ((totalRetail / totalServices) * 100).toFixed(0) : '0';

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // 1. Table 1: Month to Date Performance
  setVal('mtdPerfTargetCurr', target);
  setVal('mtdPerfActualsCurr', actuals);
  setVal('mtdPerfAchieveCurr', `% ${achievementPct}`);
  setVal('mtdPerfBalanceCurr', balanceToAchieve);
  setVal('mtdPerfHeadingCurr', headingTo);
  setVal('mtdPerfServicesCurr', Math.round(totalServices));
  setVal('mtdPerfRetailCurr', Math.round(totalRetail));
  setVal('mtdPerfRetailPenCurr', `% ${retailPen}`);
  setVal('mtdPerfNewClientsCurr', newClients);
  setVal('mtdPerfOldClientsCurr', oldClients);
  setVal('mtdPerfOldMaleCurr', oldClientsMale);
  setVal('mtdPerfOldFemaleCurr', oldClientsFemale);

  // 2. Summary KPI Strip
  setVal('dashSummaryInvoicesCount', (state.dashDateRange?.start || state.dashDateRange?.end) ? filteredInvoicesCount : (state.invoices || []).length);
  setVal('dashSummaryServicesCount', totalServicesCount);
  setVal('dashSummaryGrossSales', `₹${actuals.toLocaleString('en-IN')}`);
  setVal('dashSummaryServicesVal', `₹${Math.round(totalServices).toLocaleString('en-IN')}`);
  setVal('dashSummaryRetailVal', `₹${Math.round(totalRetail).toLocaleString('en-IN')}`);
  setVal('dashSummaryClientsCount', clientsSeen.size || Object.keys(state.customers || {}).length);

  // 3. Men Service Movement Table
  Object.keys(menMap).forEach(key => {
    setVal(`mVol_${key}`, menMap[key].vol);
    setVal(`mVal_${key}`, Math.round(menMap[key].val));
  });

  // 4. Women Service Movement Table
  Object.keys(womenMap).forEach(key => {
    setVal(`wVol_${key}`, womenMap[key].vol);
    setVal(`wVal_${key}`, Math.round(womenMap[key].val));
  });
}

function onDashboardDateRangeChanged() {
  const startEl = document.getElementById('dashStartDateInput');
  const endEl = document.getElementById('dashEndDateInput');
  const start = startEl ? startEl.value : '';
  const end = endEl ? endEl.value : '';
  state.dashDateRange = { start, end };
  
  const mtdBtn = document.getElementById('btnDashMtdPreset');
  const todayBtn = document.getElementById('btnDashTodayPreset');
  const allBtn = document.getElementById('btnDashAllPreset');
  if (mtdBtn) mtdBtn.classList.remove('active');
  if (todayBtn) todayBtn.classList.remove('active');
  if (allBtn) allBtn.classList.remove('active');
  
  renderDashboardAnalytics();
}

function setDashboardDatePreset(preset) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;
  const startEl = document.getElementById('dashStartDateInput');
  const endEl = document.getElementById('dashEndDateInput');

  const mtdBtn = document.getElementById('btnDashMtdPreset');
  const todayBtn = document.getElementById('btnDashTodayPreset');
  const allBtn = document.getElementById('btnDashAllPreset');
  if (mtdBtn) mtdBtn.classList.remove('active');
  if (todayBtn) todayBtn.classList.remove('active');
  if (allBtn) allBtn.classList.remove('active');

  const badgeText = document.getElementById('msiSelectedDateText');

  if (preset === 'today') {
    if (todayBtn) todayBtn.classList.add('active');
    state.dashDateRange = { preset: 'today', start: todayStr, end: todayStr };
    if (badgeText) badgeText.textContent = 'Today';
    if (startEl) startEl.value = todayStr;
    if (endEl) endEl.value = todayStr;
  } else if (preset === 'mtd') {
    if (mtdBtn) mtdBtn.classList.add('active');
    const mtdStart = `${y}-${m}-01`;
    const lastDay = new Date(y, parseInt(m, 10), 0).getDate();
    const mtdEnd = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
    state.dashDateRange = { preset: 'mtd', start: mtdStart, end: mtdEnd };
    if (badgeText) badgeText.textContent = 'MTD (Month to Date)';
    if (startEl) startEl.value = mtdStart;
    if (endEl) endEl.value = mtdEnd;
  } else if (preset === 'all') {
    if (allBtn) allBtn.classList.add('active');
    state.dashDateRange = { preset: 'all', start: '', end: '' };
    if (badgeText) badgeText.textContent = 'All Time';
    if (startEl) startEl.value = '';
    if (endEl) endEl.value = '';
  }
  renderDashboardAnalytics();
}

function refreshDashboardAnalytics() {
  renderDashboardAnalytics();
  showToast('Recalculated Month to Date performance analytics', 'success');
}

// Expose interactive helper functions globally
window.renderDashboardAnalytics = renderDashboardAnalytics;
window.refreshDashboardAnalytics = refreshDashboardAnalytics;
window.onDashboardDateRangeChanged = onDashboardDateRangeChanged;
window.setDashboardDatePreset = setDashboardDatePreset;
window.submitTerminalLogin = submitTerminalLogin;
window.toggleLoginPasswordVisibility = toggleLoginPasswordVisibility;
window.lockTerminal = lockTerminal;
window.getLiveStaffList = getLiveStaffList;
window.renderStaffIncentivesLedger = renderStaffIncentivesLedger;
window.syncSalesToStaffManager = syncSalesToStaffManager;
window.exportIncentivesCSV = exportIncentivesCSV;
window.openCloseShopModal = openCloseShopModal;
window.closeCloseShopModal = closeCloseShopModal;
window.handleCloseShopDateChange = handleCloseShopDateChange;
window.updateCloseShopWhatsAppPreview = updateCloseShopWhatsAppPreview;
window.updateCloseShopReportData = updateCloseShopReportData;
window.copyCloseShopReportText = copyCloseShopReportText;
window.executeCloseShopAndDispatchWA = executeCloseShopAndDispatchWA;
window.showAppointmentListView = showAppointmentListView;
window.showAppointmentBookingView = showAppointmentBookingView;
window.updateTopbarHeader = updateTopbarHeader;
window.openResetAllDataModal = openResetAllDataModal;
window.closeResetAllDataModal = closeResetAllDataModal;
window.executeResetAllDataToZero = executeResetAllDataToZero;
window.executeRestoreDemoData = executeRestoreDemoData;
window.setCalendarPickingStep = setCalendarPickingStep;

function toggleSidebarCollapse() {
  const sidebar = document.getElementById('appSidebar');
  if (!sidebar) return;
  const isCollapsed = sidebar.classList.toggle('collapsed');
  localStorage.setItem('gt_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  const miniIcon = document.querySelector('#sidebarMiniCollapseBtn i');
  if (miniIcon) {
    miniIcon.className = isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
  }
}

window.switchTab = switchTab;
window.toggleSidebarCollapse = toggleSidebarCollapse;
window.toggleTheme = toggleTheme;
window.dismissLoginModal = dismissLoginModal;
window.closeClientDetectModal = closeClientDetectModal;
window.openCustomCalendarWidget = openCustomCalendarWidget;
window.closeCustomCalendarWidget = closeCustomCalendarWidget;
window.handleCalendarDateClick = handleCalendarDateClick;
window.handleCalendarRangePresetChange = handleCalendarRangePresetChange;
window.confirmCustomCalendarRange = confirmCustomCalendarRange;
window.addServiceFromCatalog = addServiceFromCatalog;
window.completeAppointmentSale = completeAppointmentSale;
window.calculateCurrentBillAmount = calculateCurrentBillAmount;
window.renderAdminPanel = renderAdminPanel;
window.updateAdminPinDots = updateAdminPinDots;
window.enterAdminPinDigit = enterAdminPinDigit;
window.clearAdminPin = clearAdminPin;
window.backspaceAdminPin = backspaceAdminPin;
window.verifyAdminPin = verifyAdminPin;
window.lockAdminPanel = lockAdminPanel;
window.renderAdminDiscountPresets = renderAdminDiscountPresets;
window.handleAddDiscountPreset = handleAddDiscountPreset;
window.removeDiscountPreset = removeDiscountPreset;
window.handleChangeAdminPin = handleChangeAdminPin;
window.openClientHistoryModal = openClientHistoryModal;
window.closeClientHistoryModal = closeClientHistoryModal;
window.renderQuickDiscountPills = renderQuickDiscountPills;
window.applyDiscountPreset = applyDiscountPreset;
function toggleCatalogCollapse() {
  const grid = document.getElementById('posServicesCatalogGrid');
  const toolbar = document.querySelector('.catalog-toolbar-row');
  const catStrip = document.getElementById('posCatalogCategoryStrip');
  const icon = document.getElementById('catalogCollapseIcon');
  const text = document.getElementById('catalogCollapseText');
  if (!grid) return;
  const isHidden = grid.style.display === 'none';
  if (isHidden) {
    grid.style.display = 'grid';
    if (toolbar) toolbar.style.display = 'flex';
    if (catStrip) catStrip.style.display = 'flex';
    if (icon) icon.className = 'fa-solid fa-chevron-up';
    if (text) text.textContent = 'Collapse';
  } else {
    grid.style.display = 'none';
    if (toolbar) toolbar.style.display = 'none';
    if (catStrip) catStrip.style.display = 'none';
    if (icon) icon.className = 'fa-solid fa-chevron-down';
    if (text) text.textContent = 'Expand';
  }
}

window.clearSelectedDiscount = clearSelectedDiscount;
window.renderPosServicesCatalog = renderPosServicesCatalog;
window.handlePosCardClick = handlePosCardClick;
window.updateClientGuardState = updateClientGuardState;
window.isClientDetailsValid = isClientDetailsValid;
window.openServicesModal = openServicesModal;
window.closeServicesModal = closeServicesModal;
window.toggleCatalogCollapse = toggleCatalogCollapse;
window.renderAdminServicesTable = renderAdminServicesTable;
window.openAdminEditServiceModal = openAdminEditServiceModal;
window.closeAdminEditServiceModal = closeAdminEditServiceModal;
window.saveAdminEditService = saveAdminEditService;
window.openAdminAddServiceModal = openAdminAddServiceModal;
window.closeAdminAddServiceModal = closeAdminAddServiceModal;
window.saveAdminAddService = saveAdminAddService;
window.deleteAdminService = deleteAdminService;
window.resetAdminServicesToDefault = resetAdminServicesToDefault;
window.renderAdminStaffList = renderAdminStaffList;
window.handleAddAdminStaff = handleAddAdminStaff;
window.handleDeleteAdminStaff = handleDeleteAdminStaff;
window.saveDirectAppointment = saveDirectAppointment;
window.openBillingForAppointment = openBillingForAppointment;
window.showAppointmentBookingView = showAppointmentBookingView;
window.showAppointmentListView = showAppointmentListView;
window.renderBookingSelectedServices = renderBookingSelectedServices;
window.adjustBookingServiceQty = adjustBookingServiceQty;
window.removeBookingService = removeBookingService;
window.renderBillingTerminal = renderBillingTerminal;
window.toggleBookingMembershipCard = toggleBookingMembershipCard;
window.changeBookingItemStylist = changeBookingItemStylist;
window.handleCustomerNameAutocomplete = handleCustomerNameAutocomplete;
window.handleCustomerPhoneAutocomplete = handleCustomerPhoneAutocomplete;
window.selectCustomerRecord = selectCustomerRecord;
window.saveAndBillDirectAppointment = saveAndBillDirectAppointment;
window.openProductBillingModal = openProductBillingModal;
window.closeProductBillingModal = closeProductBillingModal;
window.updateProductBillingCalc = updateProductBillingCalc;
window.completeQuickProductSale = completeQuickProductSale;
window.renderAdminCloseShopSettingsForm = renderAdminCloseShopSettingsForm;
window.saveAdminCloseShopSettings = saveAdminCloseShopSettings;
window.openAdminPanelTab = openAdminPanelTab;
window.state = state;

