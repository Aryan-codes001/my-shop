// Client-side database layer using IndexedDB for Deep Jan Sewa Kendra

const DB_NAME = 'DJSK_Database';
const DB_VERSION = 1;

let dbInstance = null;

// Standard SHA-256 Hashing helper using native Crypto Web API
export async function hashPassword(password) {
  try {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Hashing error, using fallback:', err);
    // Simple fallback hash for older browsers
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_' + hash.toString(16);
  }
}

// Open / Initialize DB
export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database failed to open:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 1. Services store
      if (!db.objectStoreNames.contains('services')) {
        db.createObjectStore('services', { keyPath: 'id' });
      }

      // 2. Applications store
      if (!db.objectStoreNames.contains('applications')) {
        db.createObjectStore('applications', { keyPath: 'trackingId' });
      }

      // 3. Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' });
      }

      // 4. Notifications store
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
      }

      // 5. Studio Bookings store
      if (!db.objectStoreNames.contains('studio_bookings')) {
        db.createObjectStore('studio_bookings', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Helper to run transaction on a store
function getStore(storeName, mode = 'readonly') {
  return openDB().then((db) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return { store, transaction };
  });
}

// Initialize default data if needed
export async function initializeDatabase() {
  await openDB();

  // Initialize Admin User
  const { store: userStore } = await getStore('users', 'readwrite');
  const checkAdmin = new Promise((resolve) => {
    const req = userStore.get('admin@djsk.com');
    req.onsuccess = () => resolve(req.result);
  });
  
  const adminExists = await checkAdmin;
  if (!adminExists) {
    const hashedPassword = await hashPassword('admin123');
    userStore.put({
      email: 'admin@djsk.com',
      password: hashedPassword,
      name: 'Ashok Kumar',
      role: 'admin',
      phone: '9758286172',
      createdAt: new Date().toISOString()
    });
    
    // Add default customer user for testing
    const hashedCustomerPassword = await hashPassword('customer123');
    userStore.put({
      email: 'customer@gmail.com',
      password: hashedCustomerPassword,
      name: 'Rakesh Yadav',
      role: 'customer',
      phone: '9876543210',
      createdAt: new Date().toISOString()
    });
  }

  // Initialize Default Services
  const { store: serviceStore } = await getStore('services', 'readwrite');
  
  // Clean up photo-passport and update photo-album price if they are in existing DB
  serviceStore.delete('photo-passport');
  const getAlbumReq = serviceStore.get('photo-album');
  getAlbumReq.onsuccess = () => {
    const albumService = getAlbumReq.result;
    if (albumService) {
      albumService.price = '₹50 per Sheet';
      serviceStore.put(albumService);
    }
  };

  // Live migrations for caste, domicile, income, voter id, pan card processing times
  const forceUpdateServiceTimes = () => {
    const serviceIdsToUpdate = {
      'cert-caste': '10-12 Days',
      'cert-domicile': '10-12 Days',
      'cert-income': '10-12 Days',
      'reg-voter': '15-20 Days',
      'reg-pan-new': '15-20 Days',
      'reg-pan-corr': '15-20 Days'
    };
    
    for (const [id, newTime] of Object.entries(serviceIdsToUpdate)) {
      const getReq = serviceStore.get(id);
      getReq.onsuccess = () => {
        const service = getReq.result;
        if (service) {
          service.processingTime = newTime;
          serviceStore.put(service);
        }
      };
    }
  };
  forceUpdateServiceTimes();

  // Live migrations for new banking and insurance services
  const forceAddNewServices = () => {
    const newServices = [
      { id: 'bank-aeps', name: 'Aadhaar Enabled Payment (AEPS)', category: 'Banking', desc: 'Withdraw cash, check balance, or get mini statement securely using your thumb impression.', processingTime: 'Instant', docs: ['Aadhaar Card', 'Linked Bank Account Name', 'Thumb impression (Biometric)'], price: '₹0 / Free' },
      { id: 'bank-dmt', name: 'Instant Money Transfer (DMT)', category: 'Banking', desc: 'Send money safely to any bank account across India instantly, 24/7.', processingTime: 'Instant', docs: ['Sender Name & Mobile', 'Recipient Account Number & IFSC'], price: '₹10 (Charges apply)' },
      { id: 'bank-kiosk', name: 'Kiosk Cash Deposit & Withdraw', category: 'Banking', desc: 'Everyday banking deposit and withdrawal help through micro-ATM and certified CSP support.', processingTime: 'Instant', docs: ['Bank Account Passbook / Debit Card', 'Aadhaar Card'], price: '₹0 / Free' },
      { id: 'bank-account', name: 'Account Opening Assistance', category: 'Banking', desc: 'Get help opening new savings or current accounts with nationalized and commercial banks.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'PAN Card', 'Passport size Photo', 'Active Mobile Number'], price: '₹100 (Assistance fee)' },
      { id: 'bank-pmsby', name: 'PMSBY - Pradhan Mantri Suraksha Bima', category: 'Banking', desc: 'Accidental insurance scheme offering ₹2 Lakh cover for just ₹20 per year (for bank account holders).', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Consent Form', 'Thumb impression (Biometric validation)'], price: '₹20 per Year' },
      { id: 'bank-pmjjby', name: 'PMJJBY - Pradhan Mantri Jeevan Jyoti Bima', category: 'Banking', desc: 'Life insurance scheme offering ₹2 Lakh cover for ₹436 per year (for bank account holders aged 18-50).', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Consent Form', 'Thumb impression (Biometric validation)'], price: '₹436 per Year' },
      { id: 'bank-apy', name: 'APY - Atal Pension Yojana', category: 'Banking', desc: 'Government pension scheme offering guaranteed monthly pension of ₹1000 to ₹5000 after age 60.', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Active Mobile Number', 'Thumb impression (Biometric validation)'], price: 'Premium based on Age' },
      { id: 'reg-insurance-life', name: 'Life & Vehicle Insurance Services', category: 'Registrations', desc: 'Apply online or submit details for Life Insurance policies, Vehicle/Bike Insurance renewal, and health covers.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'PAN Card', 'Vehicle RC Copy (for vehicle)', 'Previous policy copy (if any)', 'Income Proof (for high value life cover)'], price: '₹100 (Service charge)' }
    ];
    for (const service of newServices) {
      serviceStore.put(service);
    }
  };
  forceAddNewServices();

  const countServices = new Promise((resolve) => {
    const req = serviceStore.getAllKeys();
    req.onsuccess = () => resolve(req.result.length);
  });

  const serviceCount = await countServices;
  if (serviceCount === 0) {
    const defaultServices = [
      // Certificates
      { id: 'cert-income', name: 'Income Certificate (आय प्रमाण पत्र)', category: 'Certificates', desc: 'Official certificate stating family income.', processingTime: '10-12 Days', docs: ['Aadhaar Card', 'Self Declaration Form', 'Passport Size Photo', 'Salary Slip / Income Declaration'], price: '₹100' },
      { id: 'cert-caste', name: 'Caste Certificate (जाति प्रमाण पत्र)', category: 'Certificates', desc: 'Filing for SC, ST, OBC certificates.', processingTime: '10-12 Days', docs: ['Aadhaar Card', 'Self Declaration Form', 'Passport Size Photo', 'Old Caste Certificate of family member'], price: '₹100' },
      { id: 'cert-domicile', name: 'Domicile Certificate (निवास प्रमाण पत्र)', category: 'Certificates', desc: 'Proof of residence certificate filing.', processingTime: '10-12 Days', docs: ['Aadhaar Card', 'Passport Size Photo', 'Self Declaration Form', 'Electricity Bill / Local Pradhan letter'], price: '₹100' },
      { id: 'cert-birth', name: 'Birth Certificate (जन्म प्रमाण पत्र)', category: 'Certificates', desc: 'New birth registration and correction services.', processingTime: '7-10 Days', docs: ['Hospital Birth Slip / Nagar Palika report', 'Aadhaar Card of Parents'], price: '₹100' },
      { id: 'cert-death', name: 'Death Certificate (मृत्यु प्रमाण पत्र)', category: 'Certificates', desc: 'Death registration and official copy assistance.', processingTime: '7-10 Days', docs: ['Hospital Death Report / Cremation receipt', 'Aadhaar Card of Deceased', 'Applicant ID & Relation Proof'], price: '₹100' },
      { id: 'cert-character', name: 'Character Certificate (चरित्र प्रमाण पत्र)', category: 'Certificates', desc: 'Police verification and clearance certificate setup.', processingTime: '10-15 Days', docs: ['Aadhaar Card', 'Passport Photo', 'Gram Pradhan Character Slip'], price: '₹100' },
      
      // Registrations
      { id: 'reg-pan-new', name: 'New PAN Card Application', category: 'Registrations', desc: 'Apply for fresh Permanent Account Number (PAN).', processingTime: '15-20 Days', docs: ['Aadhaar Card (Full DOB required)', '2 Passport Size Photos', 'Signature / Thumb impression'], price: '₹200' },
      { id: 'reg-pan-corr', name: 'PAN Card Correction / Update', category: 'Registrations', desc: 'Correct name, DOB, father name, or photo in PAN.', processingTime: '15-20 Days', docs: ['Aadhaar Card', 'Existing PAN Card Copy', 'Proof of correct details (Marksheet etc.)'], price: '₹200' },
      { id: 'reg-voter', name: 'Voter ID Registration (पहचान पत्र)', category: 'Registrations', desc: 'Apply for new Voter ID or modify existing entry.', processingTime: '15-20 Days', docs: ['Aadhaar Card', 'Passport Size Photo', 'Age Proof (10th marksheet / Birth Cert)', 'Address Proof'], price: '₹150' },
      { id: 'reg-eshram', name: 'E-Shram Card Registration', category: 'Registrations', desc: 'Government portal registration for unorganized workers.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'Bank Account Passbook', 'Aadhaar-linked Mobile Number'], price: '₹50' },
      { id: 'reg-ayushman', name: 'Ayushman Card Download / Help', category: 'Registrations', desc: 'Golden card setup for ₹5 Lakh family health cover.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'Ration Card (NFSA)', 'Registered Mobile Number'], price: '₹50' },
      
      // Education
      { id: 'edu-scholarship', name: 'Scholarship Form (UP & National)', category: 'Education', desc: 'Apply online for school, college or technical scholarships.', processingTime: '2-3 Days', docs: ['Aadhaar Card', 'Previous Marksheets', 'Income & Caste Certificates', 'College Admission Number & Fee Receipt', 'Bank Passbook'], price: '₹100' },
      { id: 'edu-admission', name: 'College Admission Forms', category: 'Education', desc: 'Form filing support for state colleges and universities.', processingTime: '1-2 Days', docs: ['Marksheets (10th/12th)', 'Aadhaar Card', 'Passport Photo', 'Transfer Certificate (TC)'], price: '₹80' },
      { id: 'edu-exam', name: 'Government Exam Registration', category: 'Education', desc: 'Filing for SSC, Railway, UP Police, PET, TET, etc.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'Educational Marksheets', 'Category Proof (SC/ST/OBC)', 'Passport Photo & Signature scans'], price: '₹100' },
      { id: 'edu-resume', name: 'Professional Resume Creation', category: 'Education', desc: 'Get a clean, professional PDF resume for job interviews.', processingTime: '1-2 Hours', docs: ['Educational qualification details', 'Personal Address & DOB', 'Work Experience details'], price: '₹50' },

      // Utility & Travel
      { id: 'util-electricity', name: 'Electricity Bill Payment', category: 'Utility', desc: 'Pay commercial or residential power bills online instantly.', processingTime: 'Instant', docs: ['Consumer Account Number (CA Number)', 'Old bill copy'], price: '₹20' },
      { id: 'util-passport', name: 'Passport Appointment Setup', category: 'Utility', desc: 'Apply for fresh/reissued passport and schedule PSK visit.', processingTime: '2-3 Days', docs: ['Aadhaar Card', '10th Marksheet (for Non-ECR)', 'Address proof (Bank Statement/Electricity Bill)'], price: '₹200' },
      { id: 'util-travel', name: 'Train / Flight / Bus Bookings', category: 'Utility', desc: 'IRCTC train tickets, flight bookings, and long-route bus tickets.', processingTime: 'Instant', docs: ['Passenger Name & Age', 'ID Proof (Aadhaar or Passport for Flights)', 'Mobile Number'], price: '₹50' },
      
      // Photography & Editing
      { id: 'photo-restoration', name: 'Old Photo Restoration', category: 'Photography', desc: 'Repair torn, damaged, black & white, or faded historical family photos.', processingTime: '1-2 Days', docs: ['Physical copy or high-quality scan of old photo'], price: '₹150' },
      { id: 'photo-editing', name: 'Background Change & Editing', category: 'Photography', desc: 'Professional image touchups, color correction, and backdrop replacements.', processingTime: '1-2 Hours', docs: ['Digital image file'], price: '₹50' },
      { id: 'photo-album', name: 'Wedding & Event Album Design', category: 'Photography', desc: 'Premium custom design for wedding, birthday, and events albums.', processingTime: '5-7 Days', docs: ['Event photographs (digital or drive link)'], price: '₹50 per Sheet' },

      // Banking & CSP (WhatsApp Inquiry only - requires biometric / physical shop visit)
      { id: 'bank-aeps', name: 'Aadhaar Enabled Payment (AEPS)', category: 'Banking', desc: 'Withdraw cash, check balance, or get mini statement securely using your thumb impression.', processingTime: 'Instant', docs: ['Aadhaar Card', 'Linked Bank Account Name', 'Thumb impression (Biometric)'], price: '₹0 / Free' },
      { id: 'bank-dmt', name: 'Instant Money Transfer (DMT)', category: 'Banking', desc: 'Send money safely to any bank account across India instantly, 24/7.', processingTime: 'Instant', docs: ['Sender Name & Mobile', 'Recipient Account Number & IFSC'], price: '₹10 (Charges apply)' },
      { id: 'bank-kiosk', name: 'Kiosk Cash Deposit & Withdraw', category: 'Banking', desc: 'Everyday banking deposit and withdrawal help through micro-ATM and certified CSP support.', processingTime: 'Instant', docs: ['Bank Account Passbook / Debit Card', 'Aadhaar Card'], price: '₹0 / Free' },
      { id: 'bank-account', name: 'Account Opening Assistance', category: 'Banking', desc: 'Get help opening new savings or current accounts with nationalized and commercial banks.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'PAN Card', 'Passport size Photo', 'Active Mobile Number'], price: '₹100 (Assistance fee)' },
      { id: 'bank-pmsby', name: 'PMSBY - Pradhan Mantri Suraksha Bima', category: 'Banking', desc: 'Accidental insurance scheme offering ₹2 Lakh cover for just ₹20 per year (for bank account holders).', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Consent Form', 'Thumb impression (Biometric validation)'], price: '₹20 per Year' },
      { id: 'bank-pmjjby', name: 'PMJJBY - Pradhan Mantri Jeevan Jyoti Bima', category: 'Banking', desc: 'Life insurance scheme offering ₹2 Lakh cover for ₹436 per year (for bank account holders aged 18-50).', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Consent Form', 'Thumb impression (Biometric validation)'], price: '₹436 per Year' },
      { id: 'bank-apy', name: 'APY - Atal Pension Yojana', category: 'Banking', desc: 'Government pension scheme offering guaranteed monthly pension of ₹1000 to ₹5000 after age 60.', processingTime: 'Instant (at Kiosk)', docs: ['Aadhaar Card', 'Bank Passbook / Account details', 'Active Mobile Number', 'Thumb impression (Biometric validation)'], price: 'Premium based on Age' },
      { id: 'reg-insurance-life', name: 'Life & Vehicle Insurance Services', category: 'Registrations', desc: 'Apply online or submit details for Life Insurance policies, Vehicle/Bike Insurance renewal, and health covers.', processingTime: '1-2 Days', docs: ['Aadhaar Card', 'PAN Card', 'Vehicle RC Copy (for vehicle)', 'Previous policy copy (if any)', 'Income Proof (for high value life cover)'], price: '₹100 (Service charge)' }
    ];

    for (const service of defaultServices) {
      serviceStore.put(service);
    }
  }
}

// SERVICES CRUD
export async function getServices() {
  const { store } = await getStore('services', 'readonly');
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export async function addService(service) {
  const { store } = await getStore('services', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put(service);
    req.onsuccess = () => resolve(service);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteService(id) {
  const { store } = await getStore('services', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// APPLICATIONS CRUD
export async function getApplications() {
  const { store } = await getStore('applications', 'readonly');
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export async function getApplicationByTrackingId(trackingId) {
  const { store } = await getStore('applications', 'readonly');
  return new Promise((resolve) => {
    const req = store.get(trackingId);
    req.onsuccess = () => resolve(req.result || null);
  });
}

export async function getApplicationsByUser(email) {
  const all = await getApplications();
  return all.filter(app => app.email === email);
}

export async function addApplication(application) {
  const { store } = await getStore('applications', 'readwrite');
  return new Promise((resolve) => {
    store.put(application);
    resolve(application);
  });
}

export async function updateApplication(application) {
  const { store } = await getStore('applications', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put(application);
    req.onsuccess = () => resolve(application);
    req.onerror = () => reject(req.error);
  });
}

// USERS CRUD
export async function getUserByEmail(email) {
  const { store } = await getStore('users', 'readonly');
  return new Promise((resolve) => {
    const req = store.get(email.toLowerCase());
    req.onsuccess = () => resolve(req.result || null);
  });
}

export async function addUser(user) {
  const { store } = await getStore('users', 'readwrite');
  user.email = user.email.toLowerCase();
  return new Promise((resolve, reject) => {
    const check = store.get(user.email);
    check.onsuccess = () => {
      if (check.result) {
        reject(new Error('User already exists (उपयोगकर्ता पहले से ही मौजूद है)'));
      } else {
        const req = store.add(user);
        req.onsuccess = () => resolve(user);
        req.onerror = () => reject(req.error);
      }
    };
  });
}

// NOTIFICATIONS
export async function getNotifications(userEmail) {
  const { store } = await getStore('notifications', 'readonly');
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result || [];
      // If user is admin, show all notifications, else filter by email
      if (userEmail === 'admin@djsk.com') {
        resolve(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        resolve(all.filter(n => n.email === userEmail).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    };
  });
}

export async function addNotification(notification) {
  const { store } = await getStore('notifications', 'readwrite');
  return new Promise((resolve) => {
    const item = {
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    const req = store.add(item);
    req.onsuccess = (e) => {
      item.id = e.target.result;
      resolve(item);
    };
  });
}

export async function markNotificationRead(id) {
  const { store } = await getStore('notifications', 'readwrite');
  return new Promise((resolve) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result;
      if (item) {
        item.read = true;
        store.put(item);
      }
      resolve(true);
    };
  });
}

// STUDIO BOOKINGS
export async function getStudioBookings() {
  const { store } = await getStore('studio_bookings', 'readonly');
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export async function addStudioBooking(booking) {
  const { store } = await getStore('studio_bookings', 'readwrite');
  return new Promise((resolve) => {
    const item = {
      ...booking,
      createdAt: new Date().toISOString()
    };
    const req = store.add(item);
    req.onsuccess = (e) => {
      item.id = e.target.result;
      resolve(item);
    };
  });
}
