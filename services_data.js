/**
 * Green Trends Unisex Hair & Style Salon - Kothapet
 * Official Complete Services Price Menu & Catalog
 * Extracted directly from official Green Trends Male & Female Service Menus.
 * All prices are inclusive as per salon policy.
 */

const SALON_INFO = {
  name: "green trends",
  subname: "UNISEX HAIR & STYLE SALON",
  type: "Tax Invoice",
  franchisee: "PAMKARA BEAUTY LLP",
  address: "DOOR NO: 11-9-11/1/2, SY NO: 9/1/D NEW NAGOLE MAIN ROAD LAKSHMI NAGAR COLONY OPP: RATNADEEP SUPER MARKET, KOTHAPET, HYDERABAD, TELANGANA – 500102",
  gstin: "36ABIFP3743L1ZT",
  email: "Pamkarabeauty@gmail.com",
  phone: "9246309794",
  tagline: "THANK YOU. HAVE A NICE DAY."
};

const SALON_STAFF = [
  { id: 'staff_2', name: 'ISLAM', role: 'Hair Stylist', gender: 'male', baseSalary: 25000, foodAllowance: 1500, isManager: false, isHousekeeping: false, serviceTarget: 135000 },
  { id: 'staff_3', name: 'IQRAM', role: 'Hair Stylist', gender: 'male', baseSalary: 25000, foodAllowance: 1500, isManager: false, isHousekeeping: false, serviceTarget: 135000 },
  { id: 'staff_4', name: 'SULEMAN', role: 'Senior Stylist', gender: 'male', baseSalary: 25000, foodAllowance: 1500, isManager: false, isHousekeeping: false, serviceTarget: 135000 },
  { id: 'staff_5', name: 'AFRIN', role: 'Beauty & Skin', gender: 'female', baseSalary: 18000, foodAllowance: 0, isManager: false, isHousekeeping: false, serviceTarget: 90000 },
  { id: 'staff_6', name: 'RESHMA', role: 'Senior Beautician', gender: 'female', baseSalary: 20000, foodAllowance: 0, isManager: false, isHousekeeping: false, serviceTarget: 100000 },
  { id: 'staff_7', name: 'ARUNA', role: 'Spa & Hair Specialist', gender: 'female', baseSalary: 18000, foodAllowance: 0, isManager: false, isHousekeeping: false, serviceTarget: 90000 },
  { id: 'staff_8', name: 'ANUSHA', role: 'Housekeeping', gender: 'female', baseSalary: 16000, foodAllowance: 0, isManager: false, isHousekeeping: true, serviceTarget: 0 },
  { id: 'staff_9', name: 'KARTHIK', role: 'Hair Stylist', gender: 'male', baseSalary: 20000, foodAllowance: 1500, isManager: false, isHousekeeping: false, serviceTarget: 108000 },
  { id: 'staff_10', name: 'BHARGAVI', role: 'Beautician & Skin', gender: 'female', baseSalary: 16000, foodAllowance: 0, isManager: false, isHousekeeping: false, serviceTarget: 80000 },
  { id: 'staff_11', name: 'NAVANITHA', role: 'Unisex Stylist', gender: 'female', baseSalary: 20000, foodAllowance: 0, isManager: false, isHousekeeping: false, serviceTarget: 100000 },
  { id: 'staff_12', name: 'VARSHA', role: 'Manager', gender: 'female', baseSalary: 25000, foodAllowance: 0, isManager: true, isHousekeeping: false, managerCommissionRate: 1, serviceTarget: 0 },
  { id: 'staff_13', name: 'RAMESH', role: 'Manager', gender: 'male', baseSalary: 22000, foodAllowance: 0, isManager: true, isHousekeeping: false, managerCommissionRate: 1, serviceTarget: 0 }
];

const SERVICE_CATEGORIES = [
  { id: 'all', name: 'All Services', icon: 'fa-layer-group' },
  { id: 'haircut', name: 'Hair Cut & Styling', icon: 'fa-scissors' },
  { id: 'beard', name: 'Beard & Shaving', icon: 'fa-user-tie' },
  { id: 'hair_colour', name: 'Hair Colouring & Streaks', icon: 'fa-palette' },
  { id: 'hair_spa', name: 'Hair Spa & Botox/Keratin', icon: 'fa-spa' },
  { id: 'threading_waxing', name: 'Threading & Waxing', icon: 'fa-feather' },
  { id: 'facial_cleanup', name: 'Cleanups & Facials', icon: 'fa-face-smile-beam' },
  { id: 'detan', name: 'De-Tan Care', icon: 'fa-sun' },
  { id: 'pedi_mani', name: 'Pedicure & Manicure', icon: 'fa-hand-sparkles' },
  { id: 'nail_art', name: 'Premium Nail Art', icon: 'fa-gem' },
  { id: 'bridal_makeup', name: 'Bridal & Grooming Makeup', icon: 'fa-wand-magic-sparkles' },
  { id: 'kids', name: "Kids' Grooming", icon: 'fa-child' },
  { id: 'others', name: 'Logistics & Others', icon: 'fa-car' }
];

const SALON_MEMBERSHIP_ITEM = {
  id: 'svc_membership_card',
  name: 'Green Trends Club Membership Card',
  category: 'membership',
  gender: 'unisex',
  originalPrice: 95.00,
  tax: 5.00,
  afterTaxPrice: 100.00
};

const SALON_SERVICES = [
  {
    id: 'svc_nanoplasta_treatment',
    name: 'Nanoplasta Silky Shine Treatment',
    category: 'hair_spa',
    gender: 'unisex',
    originalPrice: 10399.00,
    membershipPrice: 8999.00
  },
  {
    id: 'svc_sp_anti_hair_loss',
    name: 'System Professional Anti Hair Loss',
    category: 'hair_spa',
    gender: 'unisex',
    originalPrice: 4447.00,
    membershipPrice: 3899.00
  },
  {
    id: 'svc_flawless_bridal_glow',
    name: 'Flawless Bridal Glow Facial',
    category: 'facial_cleanup',
    gender: 'unisex',
    originalPrice: 4580.00,
    membershipPrice: 3999.00
  },
  // ==========================================
  // 1. MALE: HAIR CUT & STYLING
  // ==========================================
  {
    id: 'm_hc_1',
    name: 'Hair Cut - (Gents)',
    category: 'haircut',
    gender: 'male',
    originalPrice: 266,
    membershipPrice: 228
  },
  {
    id: 'm_hc_2',
    name: 'Head Shave - (Gents)',
    category: 'haircut',
    gender: 'male',
    originalPrice: 313,
    membershipPrice: 256
  },
  {
    id: 'm_hc_3',
    name: 'Hair Cut Advanced (Gents)',
    category: 'haircut',
    gender: 'male',
    originalPrice: 447,
    membershipPrice: 380
  },
  {
    id: 'm_hc_4',
    name: 'Hair Cut Senior-Men',
    category: 'haircut',
    gender: 'male',
    originalPrice: 475,
    membershipPrice: 390
  },
  {
    id: 'm_hc_5',
    name: 'Hair Cut Advanced-Senior-Men',
    category: 'haircut',
    gender: 'male',
    originalPrice: 666,
    membershipPrice: 551
  },

  // ==========================================
  // 2. MALE: BEARD & SHAVING
  // ==========================================
  {
    id: 'm_brd_1',
    name: 'Shave - (Gents)',
    category: 'beard',
    gender: 'male',
    originalPrice: 113,
    membershipPrice: 94
  },
  {
    id: 'm_brd_2',
    name: 'Beard Styling - (Gents)',
    category: 'beard',
    gender: 'male',
    originalPrice: 228,
    membershipPrice: 199
  },
  {
    id: 'm_brd_3',
    name: 'Shave-Senior-Men',
    category: 'beard',
    gender: 'male',
    originalPrice: 228,
    membershipPrice: 190
  },
  {
    id: 'm_brd_4',
    name: 'Beard Styling -Senior-Men',
    category: 'beard',
    gender: 'male',
    originalPrice: 294,
    membershipPrice: 237
  },

  // ==========================================
  // 3. MALE: HAIR COLOURING
  // ==========================================
  {
    id: 'm_col_1',
    name: 'Moustache Coloring - (Gents)',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 256,
    membershipPrice: 218
  },
  {
    id: 'm_col_2',
    name: 'Hair Colouring - Per Streak (Min 4 Streaks) - (Gents)',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 323,
    membershipPrice: 266
  },
  {
    id: 'm_col_3',
    name: 'Moustache Coloring Special - Ammonia Free - (Gents)',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 323,
    membershipPrice: 266
  },
  {
    id: 'm_col_4',
    name: 'Advanced Streaks Ammonia Free - Per Streak (Min 4 Streaks) - (Gents)',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 390,
    membershipPrice: 323
  },
  {
    id: 'm_col_5',
    name: 'Beard Colour - Regular - (Gents)',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 456,
    membershipPrice: 380
  },
  {
    id: 'm_col_6',
    name: 'Krone Beard Colour - Ammonia Free',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 513,
    membershipPrice: 424
  },
  {
    id: 'm_col_7',
    name: 'Beard Colour - Ammonia Free - Men',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 523,
    membershipPrice: 437
  },
  {
    id: 'm_col_8',
    name: 'Krone Men Global Hair Colouring - Ammonia Free',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 980,
    membershipPrice: 818
  },
  {
    id: 'm_col_9',
    name: 'Global Colouring - Men',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 999,
    membershipPrice: 828
  },
  {
    id: 'm_col_10',
    name: 'Hair Colouring - Ammonia Free - Gents',
    category: 'hair_colour',
    gender: 'male',
    originalPrice: 1294,
    membershipPrice: 1075
  },

  // ==========================================
  // 4. MALE: HAIR SPA & TREATMENT
  // ==========================================
  {
    id: 'm_spa_1',
    name: 'Shampoo Special - Loreal - (Gents)',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 190,
    membershipPrice: 161
  },
  {
    id: 'm_spa_2',
    name: 'Head Massage Pure Coconut Nourisher - Gents',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 609,
    membershipPrice: 504
  },
  {
    id: 'm_spa_3',
    name: 'Head Massage - Menthol Chiller - (Gents)',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 609,
    membershipPrice: 504
  },
  {
    id: 'm_spa_4',
    name: 'Head Massage - Olive Bliss - (Gents)',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 609,
    membershipPrice: 504
  },
  {
    id: 'm_spa_5',
    name: 'Loreal Hair Spa - Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 980,
    membershipPrice: 818
  },
  {
    id: 'm_spa_6',
    name: 'Anti Dandruff Treatment - Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'm_spa_7',
    name: 'Mentho Burst Spa',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'm_spa_8',
    name: 'Loreal Scalp Soothing Treatment - Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 1637,
    membershipPrice: 1361
  },
  {
    id: 'm_spa_9',
    name: 'Loreal Deep Nourishing Treatment - Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 1637,
    membershipPrice: 1361
  },
  {
    id: 'm_spa_10',
    name: 'Amenixyl Anti Hair Loss Treatment - Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 2551,
    membershipPrice: 2123
  },
  {
    id: 'm_spa_11',
    name: 'Serioxyl Hair Density Activator Treatment',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 2551,
    membershipPrice: 2123
  },
  {
    id: 'm_spa_12',
    name: 'Premium Straightening / Smoothing - Short - Gents',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 5085,
    membershipPrice: 4237
  },
  {
    id: 'm_spa_13',
    name: 'Premium Rebonding - Short',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 6256,
    membershipPrice: 5209
  },
  {
    id: 'm_spa_14',
    name: 'Premium Straightening / Smoothing - Medium Men',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 6666,
    membershipPrice: 5551
  },
  {
    id: 'm_spa_15',
    name: 'Premium Rebonding - Medium',
    category: 'hair_spa',
    gender: 'male',
    originalPrice: 7913,
    membershipPrice: 6590
  },

  // ==========================================
  // 5. MALE: CLEANUP, FACIAL & SKIN CARE
  // ==========================================
  {
    id: 'm_fac_1',
    name: 'Skin Lightening Face Cleanup (30 Mins) - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 847,
    membershipPrice: 704
  },
  {
    id: 'm_fac_2',
    name: 'Insta Whitening Clean Up - Gents',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1285,
    membershipPrice: 1066
  },
  {
    id: 'm_fac_3',
    name: 'Green Mask - Add On to Facials - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'm_fac_4',
    name: 'Reaffirming Mask - Add On to Facials - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'm_fac_5',
    name: 'Vitamin Vegetable Mask - Add On to Facials - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'm_fac_6',
    name: 'Goji Mask - Add On to Facials - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1570,
    membershipPrice: 1304
  },
  {
    id: 'm_fac_7',
    name: 'Insta Whitening Clean Up (With Serum) - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1637,
    membershipPrice: 1361
  },
  {
    id: 'm_fac_8',
    name: 'Express Glow Service with Goji Mask - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1913,
    membershipPrice: 1590
  },
  {
    id: 'm_fac_9',
    name: 'K-Gloss Facial - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3428,
    membershipPrice: 2856
  },
  {
    id: 'm_fac_10',
    name: 'Eye Treatment - Advanced - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 951,
    membershipPrice: 799
  },
  {
    id: 'm_fac_11',
    name: 'Glow Up Facial - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1170,
    membershipPrice: 980
  },
  {
    id: 'm_fac_12',
    name: 'Express Glow Service with Vitamin Vegetable Mask - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1761,
    membershipPrice: 1466
  },
  {
    id: 'm_fac_13',
    name: 'Aroma Skin Lightening Facial - Gents',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1694,
    membershipPrice: 1466
  },
  {
    id: 'm_fac_14',
    name: 'Express Glow Service with Gold Mask - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 1913,
    membershipPrice: 1590
  },
  {
    id: 'm_fac_15',
    name: 'Fair Bloom Facial - Gents',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 2285,
    membershipPrice: 1904
  },
  {
    id: 'm_fac_16',
    name: 'Skin Brightening Facial - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 2809,
    membershipPrice: 2342
  },
  {
    id: 'm_fac_17',
    name: 'Perfect White Facial - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3009,
    membershipPrice: 2504
  },
  {
    id: 'm_fac_18',
    name: '24 Karat Gold Facial - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3199,
    membershipPrice: 2504
  },
  {
    id: 'm_fac_19',
    name: 'Active Charcoal Facial - Gents',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3399,
    membershipPrice: 2828
  },
  {
    id: 'm_fac_20',
    name: 'Skin Lightening - Advanced Facial - Gents',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3599,
    membershipPrice: 2999
  },
  {
    id: 'm_fac_21',
    name: 'Perfect White - Ultime Facial - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3913,
    membershipPrice: 3256
  },
  {
    id: 'm_fac_22',
    name: 'Mineral Mud Facial - Men',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 3923,
    membershipPrice: 3266
  },
  {
    id: 'm_fac_23',
    name: '24 Karat Gold - Ultime Facial - (Gents)',
    category: 'facial_cleanup',
    gender: 'male',
    originalPrice: 4037,
    membershipPrice: 3370
  },

  // ==========================================
  // 6. MALE: DE-TAN CARE
  // ==========================================
  {
    id: 'm_dt_1',
    name: 'De-Tan - Face - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 342,
    membershipPrice: 285
  },
  {
    id: 'm_dt_2',
    name: 'De-Tan - Neck - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 342,
    membershipPrice: 285
  },
  {
    id: 'm_dt_3',
    name: 'De-Tan Face & Neck - Men',
    category: 'detan',
    gender: 'male',
    originalPrice: 475,
    membershipPrice: 475
  },
  {
    id: 'm_dt_4',
    name: 'De-Tan - Feet - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 551,
    membershipPrice: 456
  },
  {
    id: 'm_dt_5',
    name: 'De-Tan - Half Arms - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 637,
    membershipPrice: 532
  },
  {
    id: 'm_dt_6',
    name: 'De-Tan - Full Arms - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 951,
    membershipPrice: 799
  },
  {
    id: 'm_dt_7',
    name: 'De-Tan - Full Body - (Gents)',
    category: 'detan',
    gender: 'male',
    originalPrice: 4009,
    membershipPrice: 3342
  },

  // ==========================================
  // 7. MALE: PEDICURE & MANICURE
  // ==========================================
  {
    id: 'm_ped_1',
    name: 'Manicure - Classic - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 770,
    membershipPrice: 637
  },
  {
    id: 'm_ped_2',
    name: 'Manicure - Lush - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 970,
    membershipPrice: 809
  },
  {
    id: 'm_ped_3',
    name: 'Pedicure - Classic - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 770,
    membershipPrice: 637
  },
  {
    id: 'm_ped_4',
    name: 'Pedicure - Lush - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 970,
    membershipPrice: 809
  },
  {
    id: 'm_ped_5',
    name: 'Candy Crush Pedicure - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 1113,
    membershipPrice: 923
  },
  {
    id: 'm_ped_6',
    name: 'Ice Cream Pedicure - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 1218,
    membershipPrice: 1037
  },
  {
    id: 'm_ped_7',
    name: 'Foot Logix Manicure - Signature - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 1170,
    membershipPrice: 980
  },
  {
    id: 'm_ped_8',
    name: 'Foot Logix Pedicure - Signature - Men',
    category: 'pedi_mani',
    gender: 'male',
    originalPrice: 1347,
    membershipPrice: 1147
  },

  // ==========================================
  // 8. MALE: GROOMING MAKEUP & OTHERS
  // ==========================================
  {
    id: 'm_grm_1',
    name: 'Groom Makeup - Artist',
    category: 'bridal_makeup',
    gender: 'male',
    originalPrice: 3266,
    membershipPrice: 3266
  },
  {
    id: 'm_grm_2',
    name: 'Groom Makeup - Sr Artist',
    category: 'bridal_makeup',
    gender: 'male',
    originalPrice: 3809,
    membershipPrice: 3809
  },
  {
    id: 'm_grm_3',
    name: 'Groom Makeup - Expert',
    category: 'bridal_makeup',
    gender: 'male',
    originalPrice: 4361,
    membershipPrice: 4361
  },
  {
    id: 'm_grm_4',
    name: 'Flawless Bridal Glow Facial - Men',
    category: 'bridal_makeup',
    gender: 'male',
    originalPrice: 4580,
    membershipPrice: 3809
  },
  {
    id: 'm_oth_1',
    name: 'Ironing - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 656,
    membershipPrice: 551
  },
  {
    id: 'm_oth_2',
    name: 'Hair Fibre - Male Forehead',
    category: 'others',
    gender: 'male',
    originalPrice: 685,
    membershipPrice: 542
  },

  // ==========================================
  // 9. FEMALE: THREADING & WAXING
  // ==========================================
  {
    id: 'f_th_1',
    name: 'Threading - Eyebrow - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 56,
    membershipPrice: 47
  },
  {
    id: 'f_th_2',
    name: 'Upper Lip Women - Threading / Brazilian Waxing',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 56,
    membershipPrice: 47
  },
  {
    id: 'f_th_3',
    name: 'Threading - Chin - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 66,
    membershipPrice: 56
  },
  {
    id: 'f_th_4',
    name: 'Threading - Forehead - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 66,
    membershipPrice: 56
  },
  {
    id: 'f_th_5',
    name: 'Threading - Sides - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 132,
    membershipPrice: 104
  },
  {
    id: 'f_th_6',
    name: 'Threading - Fullface - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 170,
    membershipPrice: 142
  },
  {
    id: 'f_th_7',
    name: 'Threading - Cheek - (Ladies)',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 199,
    membershipPrice: 161
  },
  {
    id: 'f_wax_1',
    name: 'Brazilian Wax Chin / Forehead / Upperlip - Ladies',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 123,
    membershipPrice: 104
  },
  {
    id: 'f_wax_2',
    name: 'Brazilian Wax Face-Sides',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 170,
    membershipPrice: 142
  },
  {
    id: 'f_wax_3',
    name: 'Brazilian Wax Under Arms - Ladies',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 209,
    membershipPrice: 170
  },
  {
    id: 'f_wax_4',
    name: 'Brazilian Wax Full Face - Ladies',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 628,
    membershipPrice: 399
  },
  {
    id: 'f_wax_5',
    name: 'Cartridge Waxing - Full Arms',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 523,
    membershipPrice: 437
  },
  {
    id: 'f_wax_6',
    name: 'Cartridge Waxing - Half Legs',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 628,
    membershipPrice: 523
  },
  {
    id: 'f_wax_7',
    name: 'Cartridge Waxing - Full Legs',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 751,
    membershipPrice: 628
  },
  {
    id: 'f_wax_8',
    name: 'Cartridge Waxing - Full Back + Midriff - Ladies',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 1904,
    membershipPrice: 1590
  },
  {
    id: 'f_wax_9',
    name: 'Cartridge Waxing - Full Body',
    category: 'threading_waxing',
    gender: 'female',
    originalPrice: 4056,
    membershipPrice: 3370
  },

  // ==========================================
  // 10. FEMALE: HAIR STYLING & CONVENTIONAL CARE
  // ==========================================
  {
    id: 'f_hc_1',
    name: 'Loreal Shampoo & Conditioning Short/Medium Hair - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 380,
    membershipPrice: 313
  },
  {
    id: 'f_hc_2',
    name: 'Hair Cut Basic - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 399,
    membershipPrice: 332
  },
  {
    id: 'f_hc_3',
    name: 'Blow Styling with Shampoo & Conditioning - Short/Medium Women',
    category: 'haircut',
    gender: 'female',
    originalPrice: 628,
    membershipPrice: 513
  },
  {
    id: 'f_hc_4',
    name: 'Blow Styling with Shampoo & Conditioning - Long Women',
    category: 'haircut',
    gender: 'female',
    originalPrice: 828,
    membershipPrice: 685
  },
  {
    id: 'f_hc_5',
    name: 'Head Massage Pure Coconut Nourisher - Ladies',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 675
  },
  {
    id: 'f_hc_6',
    name: 'Head Massage - Menthol Chiller - (Ladies)',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 675
  },
  {
    id: 'f_hc_7',
    name: 'Head Massage - Olive Bliss - (Ladies)',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 675
  },
  {
    id: 'f_hc_8',
    name: 'Haircut Advanced - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 675
  },
  {
    id: 'f_hc_9',
    name: 'Haircut Advanced - Senior Women',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1075,
    membershipPrice: 894
  },
  {
    id: 'f_hc_10',
    name: 'Ironing Medium - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1142,
    membershipPrice: 951
  },
  {
    id: 'f_hc_11',
    name: 'Creative Haircut - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1151,
    membershipPrice: 961
  },
  {
    id: 'f_hc_12',
    name: 'Roller Setting - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1256,
    membershipPrice: 1047
  },
  {
    id: 'f_hc_13',
    name: 'Ironing Long - (Ladies)',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1399,
    membershipPrice: 1161
  },
  {
    id: 'f_hc_14',
    name: 'Change of Style Haircut - Senior Women',
    category: 'haircut',
    gender: 'female',
    originalPrice: 1523,
    membershipPrice: 1266
  },

  // ==========================================
  // 11. FEMALE: PEDICURE CARE
  // ==========================================
  {
    id: 'f_ped_1',
    name: 'Pedicure - Classic - Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 770,
    membershipPrice: 637
  },
  {
    id: 'f_ped_2',
    name: 'Pedicure - Lush - Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 970,
    membershipPrice: 809
  },
  {
    id: 'f_ped_3',
    name: 'Candy Crush Pedicure - Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 1113,
    membershipPrice: 923
  },
  {
    id: 'f_ped_4',
    name: 'Ice Cream Pedicure - Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 1218,
    membershipPrice: 1037
  },
  {
    id: 'f_ped_5',
    name: 'Foot Logix Pedicure - Signature Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 1342,
    membershipPrice: 1142
  },
  {
    id: 'f_ped_6',
    name: 'Foot Logix Pedicure - Luxury - Women',
    category: 'pedi_mani',
    gender: 'female',
    originalPrice: 1570,
    membershipPrice: 1304
  },

  // ==========================================
  // 12. KIDS' GROOMING (BELOW 10 YEARS)
  // ==========================================
  {
    id: 'k_hc_1',
    name: 'Girls Hair Cut - Basic (Below 10 Years)',
    category: 'kids',
    gender: 'kids',
    originalPrice: 266,
    membershipPrice: 228
  },
  {
    id: 'k_hc_2',
    name: 'Trendy Boys Cut - Below 10 Years',
    category: 'kids',
    gender: 'kids',
    originalPrice: 266,
    membershipPrice: 228
  },
  {
    id: 'k_hc_3',
    name: 'Girls Cut - Makeover (Below 10 Years)',
    category: 'kids',
    gender: 'kids',
    originalPrice: 370,
    membershipPrice: 332
  },

  // ==========================================
  // 13. FEMALE: HAIR COLORING, STREAKS & CHEMICALS
  // ==========================================
  {
    id: 'f_col_1',
    name: 'Streaks - Per Streak (Min 6 Streaks) - Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 361,
    membershipPrice: 294
  },
  {
    id: 'f_col_2',
    name: 'Advanced Streaks - Per Streak (Min 6 Streaks) - Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 580,
    membershipPrice: 475
  },
  {
    id: 'f_col_3',
    name: 'Krone Root Touch-Up - Ammonia Free - Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 1113,
    membershipPrice: 923
  },
  {
    id: 'f_col_4',
    name: 'Root Touch-Up - Regular Colouring - (Ladies)',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 1332,
    membershipPrice: 1094
  },
  {
    id: 'f_col_5',
    name: 'Root Touch-Up - Hair Colouring Ammonia Free - Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 1923,
    membershipPrice: 1599
  },
  {
    id: 'f_col_6',
    name: 'Global Colouring - Medium - (Ladies)',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 3323,
    membershipPrice: 2770
  },
  {
    id: 'f_col_7',
    name: 'Krone Global Colouring - Ammonia Free',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 3485,
    membershipPrice: 2894
  },
  {
    id: 'f_col_8',
    name: 'Partial Highlights (12 Streaks) - Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 3923,
    membershipPrice: 3266
  },
  {
    id: 'f_col_9',
    name: 'Krone Global Colouring - Ammonia Free Long Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 4523,
    membershipPrice: 3770
  },
  {
    id: 'f_col_10',
    name: 'Global Colouring - Long - (Ladies)',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 4580,
    membershipPrice: 3809
  },
  {
    id: 'f_col_11',
    name: 'Hair Colouring - Ammonia Free Medium Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 4599,
    membershipPrice: 3828
  },
  {
    id: 'f_col_12',
    name: 'Full Highlights (18 Streaks)',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 5228,
    membershipPrice: 4361
  },
  {
    id: 'f_col_13',
    name: 'Hair Colouring - Ammonia Free Long Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 6494,
    membershipPrice: 5409
  },
  {
    id: 'f_col_14',
    name: 'Creative Colouring (Global + Partial Highlights)',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 7190,
    membershipPrice: 5990
  },
  {
    id: 'f_col_15',
    name: 'Creative Colouring (Global + Partial Highlights) - Long',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 8504,
    membershipPrice: 7085
  },
  {
    id: 'f_col_16',
    name: 'Balayage / Ombre - Medium Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 10561,
    membershipPrice: 8447
  },
  {
    id: 'f_col_17',
    name: 'Balayage / Ombre - Long Women',
    category: 'hair_colour',
    gender: 'female',
    originalPrice: 12256,
    membershipPrice: 9809
  },

  // ==========================================
  // 14. FEMALE: KERATIN, BOTOX & TREATMENTS
  // ==========================================
  {
    id: 'f_sp_1',
    name: 'Loreal Hair Spa - Medium Ladies',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1370,
    membershipPrice: 1142
  },
  {
    id: 'f_sp_2',
    name: 'Loreal Hair Spa - Long Ladies',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1694,
    membershipPrice: 1418
  },
  {
    id: 'f_sp_3',
    name: 'Mentho Burst Spa - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1761,
    membershipPrice: 1466
  },
  {
    id: 'f_sp_4',
    name: 'Mentho Burst Spa - Medium-Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 2028,
    membershipPrice: 1685
  },
  {
    id: 'f_sp_5',
    name: 'Loreal Deep Nourishing Treatment Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 2351,
    membershipPrice: 1961
  },
  {
    id: 'f_sp_6',
    name: 'Anti Dandruff Treatment - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 2351,
    membershipPrice: 1961
  },
  {
    id: 'f_sp_7',
    name: 'Loreal Deep Nourishing Treatment Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 2875,
    membershipPrice: 2399
  },
  {
    id: 'f_sp_8',
    name: 'Anti Dandruff Treatment - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 2875,
    membershipPrice: 2399
  },
  {
    id: 'f_sp_9',
    name: 'Premium Straightening / Smoothening - Medium',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 6923,
    membershipPrice: 5761
  },
  {
    id: 'f_sp_10',
    name: 'Protein Botox - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 8151,
    membershipPrice: 6790
  },
  {
    id: 'f_sp_11',
    name: 'Nanoplastia Silky Shine Treatment - Medium',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 8151,
    membershipPrice: 6790
  },
  {
    id: 'f_sp_12',
    name: 'Premium Straightening / Smoothening - Long',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 9942,
    membershipPrice: 8285
  },
  {
    id: 'f_sp_13',
    name: 'Protein Botox - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 10399,
    membershipPrice: 8666
  },
  {
    id: 'f_sp_14',
    name: 'Nanoplastia Silky Shine Treatment - Long',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 10399,
    membershipPrice: 8666
  },
  {
    id: 'f_sp_15',
    name: 'Premium Rebonding - Medium Ladies',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 9075,
    membershipPrice: 7561
  },
  {
    id: 'f_sp_16',
    name: 'Premium Rebonding - Long Ladies',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 13075,
    membershipPrice: 10894
  },

  // ==========================================
  // 15. SYSTEM PROFESSIONAL (SP) LUXURY RITUALS
  // ==========================================
  {
    id: 'sp_1',
    name: 'SP Add-On Shampeeling - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'sp_2',
    name: 'SP Add-On Alpha Energy - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'sp_3',
    name: 'SP Add-On Molecular Hair Refilling - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'sp_4',
    name: 'SP Add-On Elastic Force - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1237,
    membershipPrice: 1037
  },
  {
    id: 'sp_5',
    name: 'SP Add-On Color Lock - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1961,
    membershipPrice: 1637
  },
  {
    id: 'sp_6',
    name: 'SP Add-On Balance Scalp Energy Serum - Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 1961,
    membershipPrice: 1637
  },
  {
    id: 'sp_7',
    name: 'SP Regenerate Service - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3266,
    membershipPrice: 2723
  },
  {
    id: 'sp_8',
    name: 'SP Elixir Pro-Luxe Oil Treatment - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3266,
    membershipPrice: 2723
  },
  {
    id: 'sp_9',
    name: 'SP Essential Service - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3266,
    membershipPrice: 2723
  },
  {
    id: 'sp_10',
    name: 'SP Regenerate Service - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3656,
    membershipPrice: 3047
  },
  {
    id: 'sp_11',
    name: 'SP Elixir Pro-Luxe Oil Treatment - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3656,
    membershipPrice: 3047
  },
  {
    id: 'sp_12',
    name: 'SP Anti Hair Loss - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3875,
    membershipPrice: 3228
  },
  {
    id: 'sp_13',
    name: 'SP Shampeeling - Medium Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 3875,
    membershipPrice: 3228
  },
  {
    id: 'sp_14',
    name: 'SP Anti Hair Loss - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 4447,
    membershipPrice: 3704
  },
  {
    id: 'sp_15',
    name: 'SP Shampeeling - Long Women',
    category: 'hair_spa',
    gender: 'female',
    originalPrice: 4447,
    membershipPrice: 3704
  },

  // ==========================================
  // 16. FEMALE: FACIALS & ADVANCED CLEANUPS
  // ==========================================
  {
    id: 'f_fac_1',
    name: 'Skin Lightening Face Cleanup (30 Mins) - Women',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 847,
    membershipPrice: 704
  },
  {
    id: 'f_fac_2',
    name: 'Eye Treatment Advanced - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 951,
    membershipPrice: 799
  },
  {
    id: 'f_fac_3',
    name: 'Insta Whitening Clean Up - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1285,
    membershipPrice: 1066
  },
  {
    id: 'f_fac_4',
    name: 'Green Mask - Add On to Facials - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'f_fac_5',
    name: 'Reaffirming Mask - Add On to Facials - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'f_fac_6',
    name: 'Vitamin Vegetable Mask - Add On to Facials - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1294,
    membershipPrice: 1075
  },
  {
    id: 'f_fac_7',
    name: 'Goji Mask - Add On to Facials - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1570,
    membershipPrice: 1304
  },
  {
    id: 'f_fac_8',
    name: 'Insta Whitening Clean Up (With Serum) - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1637,
    membershipPrice: 1361
  },
  {
    id: 'f_fac_9',
    name: 'Gold Mask - Add On to Facials - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1637,
    membershipPrice: 1361
  },
  {
    id: 'f_fac_10',
    name: 'Aroma Skin Lightening Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1694,
    membershipPrice: 1418
  },
  {
    id: 'f_fac_11',
    name: 'Express Glow Service with Green Mask - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1761,
    membershipPrice: 1466
  },
  {
    id: 'f_fac_12',
    name: 'Express Glow Service with Reaffirming Mask',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1761,
    membershipPrice: 1466
  },
  {
    id: 'f_fac_13',
    name: 'Express Glow Service with Vitamin Vegetable Mask - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1761,
    membershipPrice: 1466
  },
  {
    id: 'f_fac_14',
    name: 'Express Glow Service with Goji Mask - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 1913,
    membershipPrice: 1590
  },
  {
    id: 'f_fac_15',
    name: 'Fair Bloom Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 2285,
    membershipPrice: 1904
  },
  {
    id: 'f_fac_16',
    name: 'Skin Brightening Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 2809,
    membershipPrice: 2342
  },
  {
    id: 'f_fac_17',
    name: 'Perfect White Facial - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3009,
    membershipPrice: 2504
  },
  {
    id: 'f_fac_18',
    name: '24 Karat Gold Facial - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3199,
    membershipPrice: 2666
  },
  {
    id: 'f_fac_19',
    name: 'Active Charcoal Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3399,
    membershipPrice: 2828
  },
  {
    id: 'f_fac_20',
    name: 'K-Gloss Facial - Women',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3428,
    membershipPrice: 2856
  },
  {
    id: 'f_fac_21',
    name: 'Skin Lightening - Advanced Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3599,
    membershipPrice: 2999
  },
  {
    id: 'f_fac_22',
    name: 'Mineral Mud Facial - Women',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3923,
    membershipPrice: 3266
  },
  {
    id: 'f_fac_23',
    name: 'Perfect White - Ultime Facial - (Ladies)',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 3913,
    membershipPrice: 3256
  },
  {
    id: 'f_fac_24',
    name: '24 Karat Gold - Ultime Double Mask Facial - Women',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 4180,
    membershipPrice: 3370
  },
  {
    id: 'f_fac_25',
    name: 'Oxygen Facial - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 4180,
    membershipPrice: 3485
  },
  {
    id: 'f_fac_26',
    name: 'Oxygen Facial with Eye Treatment - Ladies',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 4475,
    membershipPrice: 3723
  },
  {
    id: 'f_fac_27',
    name: 'Flawless Bridal Glow Facial - Women',
    category: 'facial_cleanup',
    gender: 'female',
    originalPrice: 4580,
    membershipPrice: 3809
  },

  // ==========================================
  // 17. FEMALE: DE-TAN CARE
  // ==========================================
  {
    id: 'f_dt_1',
    name: 'De-Tan - Under Arms (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 209,
    membershipPrice: 170
  },
  {
    id: 'f_dt_2',
    name: 'De-Tan - Face (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 285,
    membershipPrice: 285
  },
  {
    id: 'f_dt_3',
    name: 'De-Tan - Neck - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 342,
    membershipPrice: 285
  },
  {
    id: 'f_dt_4',
    name: 'De-Tan - Full Back - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 466,
    membershipPrice: 466
  },
  {
    id: 'f_dt_5',
    name: 'De-Tan Face & Neck - Women',
    category: 'detan',
    gender: 'female',
    originalPrice: 475,
    membershipPrice: 475
  },
  {
    id: 'f_dt_6',
    name: 'De-Tan - Feet - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 551,
    membershipPrice: 456
  },
  {
    id: 'f_dt_7',
    name: 'De-Tan - Half Arms - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 637,
    membershipPrice: 532
  },
  {
    id: 'f_dt_8',
    name: 'De-Tan - Half Legs - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 551,
    membershipPrice: 551
  },
  {
    id: 'f_dt_9',
    name: 'De-Tan - Full Arms - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 799,
    membershipPrice: 799
  },
  {
    id: 'f_dt_10',
    name: 'De-Tan - Full Legs - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 913,
    membershipPrice: 913
  },
  {
    id: 'f_dt_11',
    name: 'De-Tan - Full Body - (Ladies)',
    category: 'detan',
    gender: 'female',
    originalPrice: 4009,
    membershipPrice: 3342
  },

  // ==========================================
  // 18. PREMIUM NAIL ART
  // ==========================================
  {
    id: 'nl_1',
    name: 'Nail Extension Removal - 1 Finger',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 190,
    membershipPrice: 161
  },
  {
    id: 'nl_2',
    name: 'Stamping Gel Luxe Nail Art - 1 Finger',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 190,
    membershipPrice: 161
  },
  {
    id: 'nl_3',
    name: 'Nail Extension Refill - Lexan Gel - 1 Finger',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 294,
    membershipPrice: 237
  },
  {
    id: 'nl_4',
    name: 'Overlay (Lexan Gel Extension + Dry Glitter)',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 590,
    membershipPrice: 485
  },
  {
    id: 'nl_5',
    name: 'Gel Polish Removal - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 618,
    membershipPrice: 513
  },
  {
    id: 'nl_6',
    name: 'Chrome Premium Nail Art - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1037,
    membershipPrice: 866
  },
  {
    id: 'nl_7',
    name: 'Holo Premium Nail Art - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1037,
    membershipPrice: 866
  },
  {
    id: 'nl_8',
    name: 'Nail Extension Removal - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1037,
    membershipPrice: 866
  },
  {
    id: 'nl_9',
    name: 'Stamping Gel Luxe Nail Art - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1047,
    membershipPrice: 873
  },
  {
    id: 'nl_10',
    name: 'Gel Polish Application - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1142,
    membershipPrice: 951
  },
  {
    id: 'nl_11',
    name: 'Blossom Gel Luxe Nail Art - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1142,
    membershipPrice: 951
  },
  {
    id: 'nl_12',
    name: 'Cat Eye Nail Luxe Art Finish - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 1285,
    membershipPrice: 1085
  },
  {
    id: 'nl_13',
    name: 'French Nail Polish - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 2570,
    membershipPrice: 2180
  },
  {
    id: 'nl_14',
    name: 'Gum Gel Extension - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 3142,
    membershipPrice: 2618
  },
  {
    id: 'nl_15',
    name: 'Lexan Gel Extension - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 3142,
    membershipPrice: 2618
  },
  {
    id: 'nl_16',
    name: 'Nail Extension Refill - Gum Gel - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 2247,
    membershipPrice: 1866
  },
  {
    id: 'nl_17',
    name: 'Nail Extension Refill - Lexan Gel - 10 Fingers',
    category: 'nail_art',
    gender: 'female',
    originalPrice: 2247,
    membershipPrice: 1866
  },

  // ==========================================
  // 19. BRIDAL & PARTY MAKE-UP, STYLING & MEHNDI
  // ==========================================
  {
    id: 'brd_1',
    name: 'Bridal Saree Draping - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 599,
    membershipPrice: 599
  },
  {
    id: 'brd_2',
    name: 'Bridal Saree Draping - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 818
  },
  {
    id: 'brd_3',
    name: 'Bridal Saree Draping - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1361,
    membershipPrice: 1361
  },
  {
    id: 'brd_4',
    name: 'Hairdo - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 980,
    membershipPrice: 980
  },
  {
    id: 'brd_5',
    name: 'Hairdo - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1304,
    membershipPrice: 1304
  },
  {
    id: 'brd_6',
    name: 'Hairdo - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1637,
    membershipPrice: 1637
  },
  {
    id: 'brd_7',
    name: 'Hairdo - Creative - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1637,
    membershipPrice: 1637
  },
  {
    id: 'brd_8',
    name: 'Hairdo - Creative - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 2180,
    membershipPrice: 2180
  },
  {
    id: 'brd_9',
    name: 'Hairdo - Creative - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 2723,
    membershipPrice: 2723
  },
  {
    id: 'brd_10',
    name: 'Mehndi - Arabic Per Side - (Ladies)',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 399,
    membershipPrice: 399
  },
  {
    id: 'brd_11',
    name: 'Mehndi - Leg Per Side - (Ladies)',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 561,
    membershipPrice: 561
  },
  {
    id: 'brd_12',
    name: 'Mehndi - Normal Per Side - (Ladies)',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 570,
    membershipPrice: 570
  },
  {
    id: 'brd_13',
    name: 'Mehndi - Bridal Special Per Side - (Ladies)',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1113,
    membershipPrice: 1113
  },
  {
    id: 'brd_14',
    name: 'Trial Hairdo - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 818,
    membershipPrice: 818
  },
  {
    id: 'brd_15',
    name: 'Trial Hairdo - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1142,
    membershipPrice: 1142
  },
  {
    id: 'brd_16',
    name: 'Trial Hairdo - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1466,
    membershipPrice: 1466
  },
  {
    id: 'brd_17',
    name: 'Trial Makeup (Half Face - One Look) - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1037,
    membershipPrice: 1037
  },
  {
    id: 'brd_18',
    name: 'Trial Makeup (Half Face - One Look) - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 2123,
    membershipPrice: 2123
  },
  {
    id: 'brd_19',
    name: 'Party Makeup - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1180,
    membershipPrice: 1111
  },
  {
    id: 'brd_20',
    name: 'Bridal Makeup - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1089,
    membershipPrice: 1089
  },
  {
    id: 'brd_21',
    name: 'Bridal Makeup - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1417,
    membershipPrice: 1417
  },
  {
    id: 'brd_22',
    name: 'Party Makeup Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 1637,
    membershipPrice: 1637
  },
  {
    id: 'brd_23',
    name: 'Party Makeup - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 2723,
    membershipPrice: 2723
  },
  {
    id: 'brd_24',
    name: 'Bridal Makeup - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 5447,
    membershipPrice: 5447
  },
  {
    id: 'brd_25',
    name: 'HD Airbrush Make Up - Trail (Half Face) - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 3809,
    membershipPrice: 3809
  },
  {
    id: 'brd_26',
    name: 'Bridal Makeover (Makeup, Hairdo, Saree Draping, File & Polish) - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 12209,
    membershipPrice: 12209
  },
  {
    id: 'brd_27',
    name: 'Bridal Makeover (Makeup, Hairdo, Saree Draping, File & Polish) - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 15694,
    membershipPrice: 15694
  },
  {
    id: 'brd_28',
    name: 'Overall Makeover (Makeup, Hairdo, Saree Draping, File & Polish) - Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 15694,
    membershipPrice: 15694
  },
  {
    id: 'brd_29',
    name: 'Overall Makeover (Makeup, Hairdo, Saree Draping, File & Polish) - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 17209,
    membershipPrice: 17209
  },
  {
    id: 'brd_30',
    name: 'HD Airbrush Make Up - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 16351,
    membershipPrice: 16551
  },
  {
    id: 'brd_31',
    name: 'HD Airbrush Bridal Makeover - Sr Artist',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 16675,
    membershipPrice: 16675
  },
  {
    id: 'brd_32',
    name: 'HD Airbrush Make Up - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 21799,
    membershipPrice: 21799
  },
  {
    id: 'brd_33',
    name: 'HD Airbrush Bridal Makeover - Expert',
    category: 'bridal_makeup',
    gender: 'female',
    originalPrice: 22018,
    membershipPrice: 22018
  },

  // ==========================================
  // 20. OUTSTATION & LOGISTICS (GENTS & LADIES)
  // ==========================================
  {
    id: 'oth_c_1',
    name: 'Conveyance Charges - 6 AM to 6 PM Less 5km - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 599,
    membershipPrice: 599
  },
  {
    id: 'oth_c_2',
    name: 'Conveyance Charges - 6 PM to 6 AM Less 5km - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 1199,
    membershipPrice: 1199
  },
  {
    id: 'oth_c_3',
    name: 'Conveyance Charges - 6 AM to 6 PM Less 5km (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 1199,
    membershipPrice: 1199
  },
  {
    id: 'oth_c_4',
    name: 'Conveyance Charges - 6 PM to 6 AM Less 5km (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 1199,
    membershipPrice: 1199
  },
  {
    id: 'oth_c_5',
    name: 'Conveyance Charges - 6 AM to 6 PM Above 5km - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 1199,
    membershipPrice: 1199
  },
  {
    id: 'oth_c_6',
    name: 'Conveyance Charges - 6 PM to 6 AM Above 5km - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 2399,
    membershipPrice: 2399
  },
  {
    id: 'oth_c_7',
    name: 'Conveyance Charges - 6 AM to 6 PM Above 5km (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 2399,
    membershipPrice: 2399
  },
  {
    id: 'oth_c_8',
    name: 'Conveyance Charges - 6 PM to 6 AM Above 5km - (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 2399,
    membershipPrice: 2399
  },
  {
    id: 'oth_c_9',
    name: 'Outdoor Charges - 6 AM to 6 PM - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 2399,
    membershipPrice: 2399
  },
  {
    id: 'oth_c_10',
    name: 'Outdoor Charges - 6 AM to 6 PM - (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 2399,
    membershipPrice: 2399
  },
  {
    id: 'oth_c_11',
    name: 'Outdoor Charges - 6 PM to 6 AM - (Gents)',
    category: 'others',
    gender: 'male',
    originalPrice: 4799,
    membershipPrice: 4799
  },
  {
    id: 'oth_c_12',
    name: 'Outdoor Charges - 6 PM to 6 AM - (Ladies)',
    category: 'others',
    gender: 'female',
    originalPrice: 4799,
    membershipPrice: 4799
  }
];

// ============================================================================
// DEDICATED RETAIL PRODUCTS CATALOG (Take-Home Haircare & Skincare at MRP)
// Rule: No discount allowed on retail products. Commission: 5% > 8k, 8% > 15k.
// ============================================================================
const SALON_PRODUCTS = [
  {
    id: 'prod_loreal_absolut_shampoo',
    name: "L'Oréal Serie Expert Absolut Repair Shampoo (300ml)",
    brand: "L'Oréal",
    category: 'products',
    gender: 'unisex',
    originalPrice: 795,
    mrp: 795
  },
  {
    id: 'prod_loreal_absolut_mask',
    name: "L'Oréal Serie Expert Absolut Repair Hair Mask (250ml)",
    brand: "L'Oréal",
    category: 'products',
    gender: 'unisex',
    originalPrice: 990,
    mrp: 990
  },
  {
    id: 'prod_loreal_mythic_oil',
    name: "L'Oréal Mythic Oil Original Nourishing Serum (100ml)",
    brand: "L'Oréal",
    category: 'products',
    gender: 'unisex',
    originalPrice: 1350,
    mrp: 1350
  },
  {
    id: 'prod_matrix_biolage_serum',
    name: "Matrix Biolage SmoothProof 6-in-1 Professional Serum (100ml)",
    brand: "Matrix",
    category: 'products',
    gender: 'unisex',
    originalPrice: 550,
    mrp: 550
  },
  {
    id: 'prod_matrix_optic_care_shampoo',
    name: "Matrix Opti.Care Smooth Straight Professional Shampoo (350ml)",
    brand: "Matrix",
    category: 'products',
    gender: 'unisex',
    originalPrice: 650,
    mrp: 650
  },
  {
    id: 'prod_wella_elements_mask',
    name: "Wella Professionals Elements Renewing Hair Mask (150ml)",
    brand: "Wella",
    category: 'products',
    gender: 'unisex',
    originalPrice: 1250,
    mrp: 1250
  },
  {
    id: 'prod_streax_canvoline_serum',
    name: "Streax Professional Canvoline Serum (100ml)",
    brand: "Streax",
    category: 'products',
    gender: 'unisex',
    originalPrice: 450,
    mrp: 450
  },
  {
    id: 'prod_schwarzkopf_osis_wax',
    name: "Schwarzkopf Professional Osis+ Thrill Texture Hair Wax (100ml)",
    brand: "Schwarzkopf",
    category: 'products',
    gender: 'unisex',
    originalPrice: 950,
    mrp: 950
  },
  {
    id: 'prod_moroccan_oil_25ml',
    name: "Moroccanoil Original Treatment Argan Oil (25ml)",
    brand: "Moroccanoil",
    category: 'products',
    gender: 'unisex',
    originalPrice: 1450,
    mrp: 1450
  },
  {
    id: 'prod_gt_argan_serum',
    name: "Green Trends Professional Argan & Macadamia Hair Serum (100ml)",
    brand: "Green Trends",
    category: 'products',
    gender: 'unisex',
    originalPrice: 499,
    mrp: 499
  },
  {
    id: 'prod_gt_antidandruff_lotion',
    name: "Green Trends Intensive Scalp Anti-Dandruff Lotion (120ml)",
    brand: "Green Trends",
    category: 'products',
    gender: 'unisex',
    originalPrice: 399,
    mrp: 399
  },
  {
    id: 'prod_gt_skin_glow_cream',
    name: "Green Trends Radiant Skin Glow Brightening Cream (50g)",
    brand: "Green Trends",
    category: 'products',
    gender: 'unisex',
    originalPrice: 499,
    mrp: 499
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SALON_INFO, SALON_STAFF, SERVICE_CATEGORIES, SALON_SERVICES, SALON_PRODUCTS, SALON_MEMBERSHIP_ITEM };
}
