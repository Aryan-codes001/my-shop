/**
 * Editable Business Configuration & Services Catalog Data
 * Saini CSC, Banking & Photography Center (Uttar Pradesh, India)
 */

export const BUSINESS_INFO = {
  name: "Deep Digital Seva & Studio",
  shortName: "Deep Digital Seva",
  owner: "Ashok Kumar",
  phone: "+91 97582 86172",
  whatsapp: "+91 97582 86172",
  email: "kumarashok975828@gmail.com",
  address: "Near Bus Stand, Dehradun Road, Chhutmalpur, Saharanpur, Uttar Pradesh - 247662",
  workingHours: "Monday - Saturday: 8:00 AM - 8:00 PM, Sunday: 9:00 AM - 2:00 PM",
  tagline: "Your Trusted One-Stop Center for CSP Banking, Government CSC Services, Cyber Cafe & Photography Studio",
  aboutText: "Serving Chhutmalpur and the local community since 2000, we are a trusted family-run digital service center in Uttar Pradesh. We aim to bridge the digital gap by providing secure AEPS banking support, online government registration forms, fast photocopy & laminations, and premium passport photos/event photography—all under one roof. Our center provides clear Hindi-English guidance for all local community needs.",
  stats: {
    yearsOfService: "26+",
    customersServed: "50,000+",
    successRate: "99.8%"
  }
};

export const TRUST_BADGES = [
  {
    title: "All-in-One Digital Hub",
    desc: "No need to visit multiple shops. Get banking, official government forms, and photo prints in one secure stop."
  },
  {
    title: "Fast & Error-Free Forms",
    desc: "We ensure accurate data input for exam forms, scholarships, and certificates to avoid application rejections."
  },
  {
    title: "Secure Cash & Banking",
    desc: "Certified CSP point. Safe cash withdrawals via Aadhaar (AEPS), transfers, and passbook updates in seconds."
  },
  {
    title: "Experienced Local Support",
    desc: "Proudly serving Chhutmalpur & local families since 2000 with friendly customer assistance in Hindi and English."
  },
  {
    title: "Affordable & Fair Rates",
    desc: "Transparent government service fees and cost-effective document print/copy pricing."
  },
  {
    title: "Urgent/Tatkal Facilities",
    desc: "Instant passport size photos, quick laminations, fast color prints, and urgent online form filings."
  }
];

export const BANKING_SERVICES = [
  { id: "b1", name: "Aadhaar Enabled Payment (AEPS)", desc: "Withdraw cash, check balance, or get mini statement securely using your thumb impression." },
  { id: "b2", name: "Instant Money Transfer (DMT)", desc: "Send money safely to any bank account across India instantly, 24/7." },
  { id: "b3", name: "Cash Withdrawal / Deposit", desc: "Everyday banking deposit and withdrawal help through micro-ATM and certified CSP support." },
  { id: "b4", name: "Account Opening Assistance", desc: "Get help opening new savings or current accounts with nationalized and commercial banks." },
  { id: "b5", name: "DBT & Subsidy Assistance", desc: "Check and resolve issues with direct benefit transfers for LPG, PM Kisan, and student scholarships." },
  { id: "b6", name: "Mini Statement & Balance Enquiry", desc: "Quick verification of your active balance and recent bank transactions." },
  { id: "b7", name: "Passbook & Statement Assistance", desc: "Assistance in printing and understanding bank transactions and ledger copies." },
  { id: "b8", name: "UPI & Digital Wallet Help", desc: "Learn to use PhonePe, GooglePay, Paytm, and BHIM UPI safely for digital transactions." }
];

export const CSC_SERVICES = {
  certificates: [
    { 
      name: "Income Certificate (आय प्रमाण पत्र)", 
      desc: "Application support and document verification.",
      docs: ["Aadhaar Card", "Self Declaration Form (स्व-घोषणा पत्र)", "Photo", "Salary Slip or Income declaration", "Ration Card copy"],
      price: "₹100"
    },
    { 
      name: "Caste Certificate (जाति प्रमाण पत्र)", 
      desc: "Submissions for SC, ST, OBC certificates.",
      docs: ["Aadhaar Card", "Self Declaration Form", "Photo", "Old Caste certificate of family member", "Ration Card copy"],
      price: "₹100"
    },
    { 
      name: "Domicile Certificate (निवास प्रमाण पत्र)", 
      desc: "Proof of residence certificate filing.",
      docs: ["Aadhaar Card", "Photo", "Self Declaration Form", "Electricity Bill or Gram Pradhan certified letter", "School Transfer Certificate"],
      price: "₹100"
    },
    { 
      name: "Birth Certificate (जन्म प्रमाण पत्र)", 
      desc: "New registration and correction services.",
      docs: ["Hospital Birth Slip / Nagar Palika report", "Aadhaar Card of Parents", "Address proof of parents"],
      price: "₹100"
    },
    { 
      name: "Death Certificate (मृत्यु प्रमाण पत्र)", 
      desc: "Filing and application assistance.",
      docs: ["Hospital Death Report / Cremation receipt", "Aadhaar Card of Deceased", "Applicant ID & Relation Proof"],
      price: "₹100"
    },
    { 
      name: "Character Certificate (चरित्र प्रमाण पत्र)", 
      desc: "Police clearance & local character verification assistance.",
      docs: ["Aadhaar Card", "Passport Photo", "Gram Pradhan / Ward Member Character Slip", "Active Mobile number"],
      price: "₹100"
    }
  ],
  registrations: [
    { 
      name: "New PAN Card Application", 
      desc: "Apply for new PAN card or request correction/update.",
      docs: ["Aadhaar Card (Full DOB required)", "2 Passport Size Photos", "Signature or Thumb Impression"],
      price: "₹200"
    },
    { 
      name: "Voter ID Cards (पहचान पत्र)", 
      desc: "Apply for a new Voter Card, download digital copy, or edit details.",
      docs: ["Aadhaar Card", "Passport Size Photo", "Age Proof (10th marksheet or Birth Certificate)", "Address proof"],
      price: "₹200"
    },
    { 
      name: "E-Shram Card Registration", 
      desc: "Register unorganized workers for central benefits.",
      docs: ["Aadhaar Card", "Bank Account Passbook", "Aadhaar-linked Mobile number"],
      price: "₹50"
    },
    { 
      name: "Ayushman Card Help (Golden Card)", 
      desc: "Assistance to download and check eligibility for Rs. 5 Lakh medical cover.",
      docs: ["Aadhaar Card", "Ration Card (NFSA) showing family details", "Registered Mobile number"],
      price: "₹30"
    },
    { 
      name: "Labour Card Services", 
      desc: "State labor department registrations and benefit claims.",
      docs: ["Aadhaar Card", "Bank Passbook", "Niyojan Praman Patra (90 days work proof)", "Photo"],
      price: "₹80"
    },
    { 
      name: "Ration Card (राशन कार्ड)", 
      desc: "Apply for new ration cards, add family members, or modify units.",
      docs: ["Aadhaar Card of all family members", "Income Certificate of Family Head", "Group Family Photo", "Bank Passbook"],
      price: "₹100"
    },
    { 
      name: "Farmer ID Card (किसान पहचान पत्र)", 
      desc: "Apply for new Farmer Identity Card (Kisan Registration).",
      docs: ["Aadhaar Card", "Land Revenue Slip (Khatauni / Khasra)", "Bank Account Passbook", "Passport Size Photo"],
      price: "₹100"
    }
  ],
  education: [
    { 
      name: "Scholarship Forms (छात्रवृत्ति)", 
      desc: "UP Scholarship & National Scholarship portal forms.",
      docs: ["Aadhaar Card", "Previous Class Marksheet", "Income, Caste & Domicile Certificates", "Fee Receipt", "College Admission Number", "Bank Passbook"],
      price: "₹100"
    },
    { 
      name: "College & School Admissions", 
      desc: "Online registrations for state colleges, universities, and schools.",
      docs: ["Aadhaar Card", "Marksheets (10th/12th)", "Transfer Certificate (TC)", "Character Certificate", "Passport Photos"],
      price: "₹80"
    },
    { 
      name: "Competitive Exam Forms", 
      desc: "Apply for government jobs (SSC, Railway, UP Police, PET, UPTET, etc.).",
      docs: ["Educational Marksheets", "Aadhaar Card", "Caste / Domicile proof", "Scanned Photo & Signature"],
      price: "₹100"
    },
    { 
      name: "Resume & CV Writing", 
      desc: "Professional resumes made quickly for interviews.",
      docs: ["Educational Qualification details", "Personal details (Address, DOB)", "Work Experience history"],
      price: "₹30"
    },
    { 
      name: "College Counselling & Admission Support", 
      desc: "Choice filling and registration support.",
      docs: ["Exam Admit Card & Score Card", "Aadhaar Card", "Marksheets", "Counselling Roll number"],
      price: "₹150"
    }
  ],
  utility: [
    { 
      name: "Electricity & Utility Bills", 
      desc: "Quick digital bill payments with printed receipts.",
      docs: ["Consumer Number (CA Number / Account ID)", "Old Electricity Bill copy"],
      price: "₹20"
    },
    { 
      name: "Mobile & DTH Recharge", 
      desc: "Instant recharge for Jio, Airtel, Vi, BSNL, Dish TV.",
      docs: ["Mobile Number or DTH Subscriber ID", "Operator name"],
      price: "₹10"
    },
    { 
      name: "FASTag Purchase & Recharge", 
      desc: "Buy new FASTags or recharge existing highway tags.",
      docs: ["Vehicle Registration Certificate (RC Book)", "Aadhaar Card of Owner"],
      price: "₹50"
    },
    { 
      name: "Travel Bookings (IRCTC & Bus)", 
      desc: "Authorized railway ticket booking, flight bookings, and local bus reservations.",
      docs: ["Passenger Names, Ages, and Gender", "Aadhaar Card (Required for flights)", "Active Mobile number"],
      price: "₹30"
    },
    { 
      name: "Passport Appointment Setup", 
      desc: "Apply for fresh passport/reissues and book appointments.",
      docs: ["Aadhaar Card", "10th Marksheet (for Non-ECR status)", "PAN Card or Bank Passbook copy"],
      price: "₹200"
    }
  ]
};

export const CYBER_SERVICES = [
  { name: "Black & White Printing", desc: "Fast printing of school projects, documents, and bills at very low rates." },
  { name: "Premium Color Printing", desc: "High-quality resume prints, digital tickets, and official letters." },
  { name: "High-Speed Photocopy (Xerox)", desc: "Bulk photocopies of study notes, ID cards, and government documents." },
  { name: "Digital Document Scanning", desc: "High-resolution scanning to PDF or JPEG formats for email and uploads." },
  { name: "Lamination Services", desc: "Protect your certificates, Aadhaar cards, and marksheet documents from damage." },
  { name: "Hindi & English Typing", desc: "Accurate typing work for affidavits, applications, and school projects." },
  { name: "Email & PDF Services", desc: "Assistance in forwarding documents, converting file formats, and digital storage." },
  { name: "ID Card Print (PVC Card)", desc: "Print durable PVC plastic cards for Aadhaar, PAN, and Voter ID." },
  { name: "Spiral & Document Binding", desc: "Neat binding for school assignments, reports, and books." },
  { name: "Form Correction Support", desc: "Correcting uploaded document mistakes and re-submitting government forms." }
];

export const PHOTOGRAPHY_SERVICES = [
  { name: "Passport Size Photos (Instant)", desc: "Get high-quality professional passport photos printed in just 5 minutes." },
  { name: "Studio Portrait Photography", desc: "Clean studio portraits for family, job profiles, and matrimonial bios." },
  { name: "Wedding Photography & Video", desc: "Capture your big wedding events with professional camera operators." },
  { name: "Birthday & Party Photography", desc: "Special coverage for family gatherings, rituals, and local celebrations." },
  { name: "Advanced Photo Editing", desc: "Restoration of old damaged photos, color corrections, and background removal." },
  { name: "Invitation Card Design", desc: "Custom digital invitations for weddings, birthdays, and griha pravesh." }
];

export const OTHER_SERVICES = [
  { name: "DTH & Cable Recharge", desc: "Recharge for Tata Play, Dish TV, Airtel Digital TV, Videocon." },
  { name: "Water & Gas Bill Payments", desc: "Easy online payments for home utility meters." },
  { name: "Insurance Premium Payment Support", desc: "Pay premiums for LIC, SBI, HDFC, and other life/general policies." },
  { name: "GST Registration Assistance", desc: "Basic online filing guidance for local shopkeepers and businesses." },
  { name: "MSME & Udyam Registration", desc: "Get government business identity certificates for MSME loans." },
  { name: "Grievance / Complaint Submission", desc: "Online registration of complaints on Jan Sunwai and public portals." },
  { name: "Affidavit & Notary Guidance", desc: "Help with writing text drafts for official stamp papers." }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Visit or Message Us",
    desc: "Walk into Deep Center, call us, or send details on WhatsApp."
  },
  {
    step: "2",
    title: "Provide Documents",
    desc: "Share your Aadhaar, photos, or details depending on the required service."
  },
  {
    step: "3",
    title: "Fast Verification & Processing",
    desc: "We process your banking transactions or fill out the digital application accurately."
  },
  {
    step: "4",
    title: "Get Print & Confirmation",
    desc: "Receive your cash, PVC card, printed form receipt, or photos instantly."
  }
];

export const TESTIMONIALS = [
  {
    quote: "Deep Digital Seva saved me three trips to the tehsil. They made my Income and Domicile certificates in a week at very cheap rates. Highly recommended!",
    author: "Rakesh Yadav",
    role: "Local Farmer",
    location: "Chhutmalpur"
  },
  {
    quote: "Very reliable banking assistance. I withdraw my pension every month via Aadhaar finger impression. Ashok is always polite and prints the transaction slip immediately.",
    author: "Sunita Devi",
    role: "Pensioner",
    location: "Chhutmalpur"
  },
  {
    quote: "I visited them for my UP Police exam form. They did everything correctly, formatted my photo/signature as required, and gave me a clear printout. Got my admit card without issues!",
    author: "Amit Kumar",
    role: "Student",
    location: "Chhutmalpur"
  },
  {
    quote: "Excellent photography studio. We got our daughter's birthday photos and frames done here. The photo editing quality is superb, and they printed the album on time.",
    author: "Dr. Alok Maurya",
    role: "Homeopathic Practitioner",
    location: "Chhutmalpur Market"
  }
];

export const FAQS = [
  {
    q: "What documents are needed for making caste/income certificates?",
    a: "Usually, you need your Aadhaar Card, self-declaration form, a passport size photograph, land revenue slip (for income), and ration card. Walk into our shop, and we will scan and format everything for you."
  },
  {
    q: "Are cash withdrawals safe? Do you provide bank receipts?",
    a: "Yes, 100% safe. We run an authorized AEPS/CSP kiosk. After every Aadhaar withdrawal or money transfer, we print an official transaction receipt showing the withdrawn amount and remaining balance."
  },
  {
    q: "Do you help with correction in scholarship and job forms?",
    a: "Yes, we do correction work. If you have made a mistake in your candidate profile, marks, or certificate numbers, we assist in checking active correction windows and re-uploading documents."
  },
  {
    q: "Can I get passport size photos immediately?",
    a: "Yes. Our studio offers instant digital portrait prints. We clean the background and print a sheet of 8 passport size photos on glossy photo paper in under 5 minutes."
  },
  {
    q: "Do you book railway and travel tickets?",
    a: "Yes, we are authorized IRCTC booking support providers. We can book railway tickets, local AC/sleeper bus travel tickets, and schedule passport appointments."
  },
  {
    q: "Can I send documents on WhatsApp before visiting?",
    a: "Absolutely! You can message us on WhatsApp with clear scans or pictures of your documents, explain the service needed, and we will have your forms drafted before you arrive to save time."
  }
];

export const SEO_METADATA = {
  title: "Deep Digital Seva - CSC, Banking & Photography Center - Chhutmalpur, Saharanpur",
  description: "Get CSP AEPS banking, online government certificates (income, caste, domicile), cyber cafe print/copy, competitive exam forms, and instant passport photo prints at Deep Digital Seva, Dehradun Road, Chhutmalpur, UP.",
  keywords: "Deep Digital Seva, Deep CSC, Cyber Cafe Chhutmalpur, AEPS withdraw Chhutmalpur, Saharanpur digital seva, UP Government forms, PAN card shop Chhutmalpur, passport photo studio Saharanpur",
  googleBusinessDescription: "Deep Digital Seva & Studio is Uttar Pradesh's leading multi-service kiosk. We specialize in Aadhaar withdraw (AEPS), instant money transfer, government scheme filings, scholarship applications, voter/PAN registration, high-speed photocopy/laminations, and studio photography/passport photos."
};
