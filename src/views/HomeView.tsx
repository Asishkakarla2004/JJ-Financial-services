import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LoanType } from '../types';
import { 
  Building2, UserCheck, Percent, Clock, Briefcase, HelpCircle, 
  ChevronDown, ChevronUp, ArrowRight, Calculator, CheckCircle2, User, Phone, Mail, Award,
  Home, Car, GraduationCap, ShieldCheck, Star, Landmark, MapPin
} from 'lucide-react';

const getLoanIcon = (type: string) => {
  switch (type) {
    case 'Home': return <Home size={18} />;
    case 'Business': return <Briefcase size={18} />;
    case 'Personal': return <User size={18} />;
    case 'Gold': return <Landmark size={18} />;
    case 'Education': return <GraduationCap size={18} />;
    default: return <Percent size={18} />;
  }
};

const getLoanIconBg = (type: string) => {
  switch (type) {
    case 'Home': return 'bg-[#1e40af] text-white'; // Indigo/Blue
    case 'Business': return 'bg-[#006e2f] text-white'; // Green
    case 'Personal': return 'bg-[#be185d] text-white'; // Pink/Red
    case 'Gold': return 'bg-[#b45309] text-white'; // Amber/Gold
    case 'Education': return 'bg-[#6d28d9] text-white'; // Purple
    default: return 'bg-slate-700 text-white';
  }
};

const getLoanTags = (type: string) => {
  switch (type) {
    case 'Business': return 'SME Growth, Working Capital, Expansion';
    case 'Home': return 'Housing Finance, Mortgages, Real Estate';
    case 'Personal': return 'Immediate Liquidity, Family Expenses, Debt Consolidation';
    case 'Gold': return 'Instant Cash, Asset Backed, High Valuations';
    case 'Education': return 'Higher Education, Study Abroad, Academic Funding';
    default: return 'Financial Support, Flexible Credits';
  }
};

const getApplicantLocation = (name: string) => {
  const cities = [
    "BKC, Mumbai",
    "Viman Nagar, Pune",
    "Salt Lake, Kolkata",
    "Connaught Place, Delhi",
    "Indiranagar, Bengaluru",
    "Gachibowli, Hyderabad"
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return cities[sum % cities.length] + ", India";
};

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab }) => {
  const { cmsSettings, applications, switchRole } = useApp();

  const recentApprovals = [
    ...applications.filter(app => app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Pending'),
    {
      id: 'L-STATIC-1',
      applicantName: 'Rajesh Kumar',
      loanType: 'Home' as const,
      amount: 4500000,
      tenure: 15,
      status: 'Disbursed' as const,
      date: '2024-10-22',
      purpose: 'Eco-friendly Smart Housing Development',
      interestRate: 8.4,
      monthlyEMI: 44031,
      progress: 100,
    },
    {
      id: 'L-STATIC-2',
      applicantName: 'Sonal Gupta',
      loanType: 'Business' as const,
      amount: 12500000,
      tenure: 7,
      status: 'Pending' as const,
      date: '2024-10-21',
      purpose: 'Zero-Waste Organic Grocery Store Setup',
      interestRate: 12.0,
      monthlyEMI: 220000,
      progress: 35,
    },
    {
      id: 'L-STATIC-3',
      applicantName: 'Amit Sharma',
      loanType: 'Personal' as const,
      amount: 800000,
      tenure: 4,
      status: 'Disbursed' as const,
      date: '2024-10-20',
      purpose: 'Premium Electric Vehicle Financing',
      interestRate: 10.5,
      monthlyEMI: 20412,
      progress: 100,
    }
  ];

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [selectedCalcType, setSelectedCalcType] = useState<LoanType>('Business');

  // Sync interest rate with CMS rate on selection
  useEffect(() => {
    switch (selectedCalcType) {
      case 'Personal': setInterestRate(cmsSettings.personalLoanRate); break;
      case 'Business': setInterestRate(cmsSettings.businessLoanRate); break;
      case 'Home': setInterestRate(cmsSettings.homeLoanRate); break;
      case 'Gold': setInterestRate(cmsSettings.goldLoanRate); break;
      case 'Education': setInterestRate(cmsSettings.educationLoanRate); break;
    }
  }, [selectedCalcType, cmsSettings]);

  // EMI Calculations
  const calculateEMI = () => {
    const P = loanAmount;
    const r = (interestRate / 12) / 100;
    const n = tenureYears * 12;
    
    if (r === 0) return { emi: P / n, totalPayable: P, totalInterest: 0 };
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    
    return {
      emi: Math.round(emi),
      totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest)
    };
  };

  const { emi, totalPayable, totalInterest } = calculateEMI();
  const interestPercentage = Math.round((totalInterest / totalPayable) * 100) || 0;
  const principalPercentage = 100 - interestPercentage;

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({
    0: true, // open first by default
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: "What documents are required to apply for a Business Loan?",
      a: "Generally, you will need company registration proofs, last 2 years audited financial statements, bank accounts statement for the last 6 months, and KYC documents of all directors/partners."
    },
    {
      q: "How does the Gold Loan interest rate calculation work?",
      a: "Gold loans at JJ Financial are calculated based on the purity and net weight of the gold. Interest is applied monthly, with highly flexible repayment schedules including interest-only payments."
    },
    {
      q: "Can I pre-close my personal loan early? Are there charges?",
      a: "Yes, you can pre-close your Personal Loan after 6 successful EMI payments. We have zero pre-closure charges for individual borrowers after the lock-in period."
    },
    {
      q: "What is the turnaround time for a Housing Finance application?",
      a: "Once all verified property papers and income documents are submitted, we provide official approvals in as little as 3 to 5 business days."
    }
  ];

  const handleApplyNow = () => {
    // Automatically log in Rohan Sharma and fill in details
    switchRole('Customer');
    // Store presets for EMI application in localStorage
    localStorage.setItem('jj_preset_loan_type', selectedCalcType);
    localStorage.setItem('jj_preset_amount', loanAmount.toString());
    localStorage.setItem('jj_preset_tenure', tenureYears.toString());
    setCurrentTab('customer-dashboard');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen view-enter" id="home-view-container">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[819px] flex items-center overflow-hidden bg-slate-950" id="hero-banner">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center brightness-[0.4]"
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjJZ_X5r-ZrhFPsISW_gk9wBu-pmxnQUp2BbImnAhU4ed7zxQPrL9JUF6XwHMTY-Hbc2QoiOnEKIZBnOZKhPK-I7Bh4cBsaI6MeM--RrSZ4lVUieAH0Zl1CSmAerBxKvTz0zmfYxdbs9KgHq0V3rgdwiSgTHYz6yu9UZCS73ZCOTVU9MODMbmdPBIdzodtcbPNOxgaHYhJKlvfQ0cjf6kbQkk43QkItB3HSrfVc6s3k1fq3v4D-bgJGT7ytlfK0qKhAsYq1-0yUY2w')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#002452]/85 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl text-left space-y-6">
            <span className="inline-block px-4 py-1.5 bg-[#006e2f] text-white font-semibold text-xs tracking-widest rounded-full uppercase">
              Trust Since 1998
            </span>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none" id="cms-hero-title">
              Fast, Secure, and Trusted <span className="text-[#6bff8f] block sm:inline">Loan Solutions</span>
            </h1>
            
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl" id="cms-hero-subtitle">
              {cmsSettings.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleApplyNow}
                className="px-8 py-4 bg-[#006e2f] hover:bg-[#005c26] text-white font-bold text-xs rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                id="hero-apply-btn"
              >
                Apply for Loan
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('solutions-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                id="hero-calculator-btn"
              >
                Explore Loans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission, Vision & Values Section (Overlapping Hero Section) */}
      <section className="-mt-20 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="mission-vision-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Our Mission */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-[#002452]"></div>
            <div className="w-12 h-12 bg-[#002452]/5 rounded-xl flex items-center justify-center mb-6">
              <Award className="text-[#002452]" size={24} />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#002452] mb-3">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed" id="cms-mission-text">
              {cmsSettings.missionText}
            </p>
          </div>

          {/* Card 2: Our Vision */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-[#006e2f]"></div>
            <div className="w-12 h-12 bg-[#006e2f]/5 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="text-[#006e2f]" size={24} />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#002452] mb-3">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed" id="cms-vision-text">
              {cmsSettings.visionText}
            </p>
          </div>

          {/* Card 3: Our Values */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-slate-900"></div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="text-slate-700" size={24} />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#002452] mb-3">Our Values</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Integrity first, transparency always, and a customer-centric approach that ensures financial growth for all stakeholders.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Meet Your Loan Officer Section */}
      <section className="py-16 bg-[#f0f3ff]" id="meet-loan-officer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Portrait image with call out badge */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white max-w-md mx-auto">
                <img 
                  className="w-full h-full object-cover" 
                  alt={`${cmsSettings.officerName || 'John Anderson'}, ${cmsSettings.officerRole || 'Senior Loan Officer'}`} 
                  src={cmsSettings.officerImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCofvg1fK3PfdSu1p1g-HZZBkIwBm8l_43oVoM7oG-xbXCdhbpOn5P44Dw8BQ0hjCLL7SHtHQZqC-dOFRlE-WgRSs8uL3AyWOZG2P1RwR6EGEZt3YaYX02mSjBSi-7ZfESQgQzE5MkSwc0MNHOuHam1-wCCaDNOlbURWbiE8s6LPMxU3YEbtWp6inxghmSQusFco32zDt__gDXbev8Rs170otWC2u0qwv9mmHKhD5emk0i2wVWhCODcF4PSjQ_LsMCFWvsDhQdx9cdu"}
                  referrerPolicy="no-referrer"
                  id="officer-img-john"
                />
              </div>
              
              {/* Floating call badge */}
              <div className="absolute -bottom-6 right-4 sm:right-12 bg-white p-5 rounded-xl shadow-xl border border-slate-100 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#006e2f] rounded-full flex items-center justify-center text-white">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider">Direct Line</p>
                    <p className="font-bold text-[#002452] text-sm">{cmsSettings.officerPhone || '+91 95678 90123'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Copy and bullets */}
            <div className="space-y-6">
              <h4 className="text-[#006e2f] font-mono tracking-widest uppercase font-bold text-xs">
                Expert Guidance
              </h4>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#002452] tracking-tight">
                Meet {cmsSettings.officerName || 'John Anderson'}, <span className="block text-[#006e2f]">{cmsSettings.officerRole || 'Senior Loan Officer'}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                With over 20 years of experience in the banking sector, {cmsSettings.officerName || 'John'} specializes in large-scale business financing and complex mortgage structures. He has helped over 1,500 families secure their dream homes.
              </p>

              <ul className="space-y-4 pt-2">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#006e2f] shrink-0" size={18} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Gold Medalist in Finance Management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#006e2f] shrink-0" size={18} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Expert in Indian SME Loan Policies</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#006e2f] shrink-0" size={18} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Personalized Fiscal Counseling</span>
                </li>
              </ul>

              <div className="pt-4">
                <button 
                  onClick={() => {
                    alert("Consultation Scheduled! John Anderson will reach out on your registered contact number +91 98765 43210 shortly.");
                  }}
                  className="px-8 py-4 bg-[#002452] hover:bg-[#001736] text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-900/10 transition-all active:scale-95 cursor-pointer"
                >
                  Schedule a Free Consultation
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Stats Counter Section */}
      <section className="py-12 bg-[#002452] text-white" id="stats-counter-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-1">5,200+</div>
              <p className="text-xs sm:text-sm text-slate-300">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-1">3,800+</div>
              <p className="text-xs sm:text-sm text-slate-300">Loans Approved</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-1">96%</div>
              <p className="text-xs sm:text-sm text-slate-300">Approval Rate</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-1">4.9/5</div>
              <p className="text-xs sm:text-sm text-slate-300">Satisfaction Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recent Loan Approvals */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="recent-loan-approvals">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#002452] tracking-tight">
              Recent Loan Approvals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Live updates from our approval desk across India.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentTab('stories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[#002452] hover:text-[#001736] font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-colors"
          >
            View Success Stories
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Responsive Grid of Cards mimicking the reference image precisely */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentApprovals.map((app) => {
            const isCompleted = app.status === 'Disbursed';
            const displayStatus = isCompleted ? 'Completed' : app.status === 'Approved' ? 'Approved' : 'Published';
            const progressVal = app.progress || (isCompleted ? 100 : app.status === 'Approved' ? 80 : 40);
            const disbursedAmt = Math.round((app.amount * progressVal) / 100);
            
            return (
              <div 
                key={app.id} 
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* 1. Header (Status pill, fiscal year, and color icon on right) */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full ${
                      isCompleted 
                        ? 'bg-slate-100 text-slate-700' 
                        : app.status === 'Approved' 
                        ? 'bg-emerald-50 text-[#006e2f]' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {displayStatus}
                    </span>
                    <span className="text-slate-400 font-semibold text-[9px] sm:text-[11px] tracking-wider border border-slate-200/60 rounded px-2 py-0.5">
                      FY 2026-2027
                    </span>
                  </div>
                  
                  {/* Colored Round-Corner Square with Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs ${getLoanIconBg(app.loanType)}`}>
                    {getLoanIcon(app.loanType)}
                  </div>
                </div>

                {/* 2. Main Title (Purpose) & Category Subtitle */}
                <div className="space-y-1 mb-4">
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-snug tracking-tight line-clamp-2 h-12">
                    {app.purpose || `${app.loanType} Loan for ${app.applicantName}`}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                    {getLoanTags(app.loanType)}
                  </p>
                </div>

                {/* 3. Location info */}
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-6">
                  <MapPin size={14} className="shrink-0" />
                  <span>{getApplicantLocation(app.applicantName)}</span>
                </div>

                {/* 4. Budget & Funded row metrics */}
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Budget</span>
                    <span className="font-mono font-extrabold text-slate-900">
                      ₹{app.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Funded</span>
                    <span className="font-mono font-extrabold text-[#006e2f]">
                      ₹{disbursedAmt.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 5. Progress Bar and label */}
                <div className="mt-4">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#006e2f] rounded-full transition-all duration-500"
                      style={{ width: `${progressVal}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block text-right mt-1.5">
                    {progressVal}% funded
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Tailored Solutions for Every Need (Bento Grid) */}
      <section className="py-16 bg-[#f9f9ff]" id="solutions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#002452] tracking-tight">
              Tailored Solutions for Every Need
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Discover our wide range of loan products designed with flexible repayment terms and low interest rates to help you achieve your milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Home Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Home'); setLoanAmount(4500000); setTenureYears(15); }}>
              <Home className="text-blue-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Home Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Rates starting at {cmsSettings.homeLoanRate}% p.a. Flexible tenure up to 30 years.
              </p>
            </div>

            {/* 2. Car Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Personal'); setLoanAmount(800000); setTenureYears(4); }}>
              <Car className="text-emerald-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Car Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Drive your dream car with up to 100% on-road funding.
              </p>
            </div>

            {/* 3. Business Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Business'); setLoanAmount(2500000); setTenureYears(5); }}>
              <Briefcase className="text-amber-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Business Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Fuel your growth with collateral-free SME financing.
              </p>
            </div>

            {/* 4. Education Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Education'); setLoanAmount(1500000); setTenureYears(7); }}>
              <GraduationCap className="text-indigo-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Education Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Invest in your future with deferred repayment options.
              </p>
            </div>

            {/* 5. Personal Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Personal'); setLoanAmount(500000); setTenureYears(3); }}>
              <User className="text-rose-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Personal Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Quick approval and minimal documentation for personal needs.
              </p>
            </div>

            {/* 6. Two-Wheeler Loan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => { setSelectedCalcType('Personal'); setLoanAmount(150000); setTenureYears(2); }}>
              <Clock className="text-teal-600 mb-6 group-hover:scale-115 transition-transform" size={40} />
              <h3 className="font-display font-extrabold text-lg text-[#002452] mb-2">Two-Wheeler Loan</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Instant approval for your next bike or scooter.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. EMI Calculator Section */}
      <section className="py-16 bg-white" id="calculator-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="emi-calculator-card">
            
            {/* Left Slider inputs side (Col-7) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-8">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#002452] tracking-tight">
                  EMI Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Adjust the inputs below to calculate your estimated monthly installment and loan summary instantly.
                </p>
              </div>

              {/* Selector Tabs to change Loan Preset */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded-xl max-w-md">
                {(['Business', 'Personal', 'Home', 'Gold', 'Education'] as LoanType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCalcType(type)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedCalcType === type
                        ? 'bg-[#002452] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {type} Loan
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Loan Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#002452]">Loan Amount</label>
                    <p className="text-[10px] sm:text-xs text-slate-400">Min: ₹10,000 / Max: ₹5 Cr</p>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#006e2f] font-mono font-bold text-sm sm:text-base">₹</span>
                    <input 
                      type="text"
                      value={loanAmount === 0 ? "" : loanAmount.toLocaleString('en-IN')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const num = val ? Number(val) : 0;
                        setLoanAmount(num);
                      }}
                      onBlur={() => {
                        if (loanAmount < 10000) setLoanAmount(10000);
                        if (loanAmount > 50000000) setLoanAmount(50000000);
                      }}
                      className="w-full sm:w-48 bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-right font-mono font-bold text-sm sm:text-base text-[#006e2f] focus:outline-hidden focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#002452]">Interest Rate</label>
                    <p className="text-[10px] sm:text-xs text-slate-400">Range: 1% to 35% p.a</p>
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      step="0.1"
                      min="1"
                      max="35"
                      value={interestRate || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInterestRate(val === "" ? 0 : Number(val));
                      }}
                      onBlur={() => {
                        if (interestRate < 1) setInterestRate(1);
                        if (interestRate > 35) setInterestRate(35);
                      }}
                      className="w-full sm:w-28 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-right font-mono font-bold text-sm sm:text-base text-[#006e2f] focus:outline-hidden focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                    <span className="ml-2 text-slate-500 font-bold text-xs sm:text-sm">% p.a</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#002452]">Loan Tenure</label>
                    <p className="text-[10px] sm:text-xs text-slate-400">Range: 1 to 40 Years</p>
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      type="number"
                      min="1"
                      max="40"
                      value={tenureYears || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTenureYears(val === "" ? 0 : Math.round(Number(val)));
                      }}
                      onBlur={() => {
                        if (tenureYears < 1) setTenureYears(1);
                        if (tenureYears > 40) setTenureYears(40);
                      }}
                      className="w-full sm:w-28 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-right font-mono font-bold text-sm sm:text-base text-[#006e2f] focus:outline-hidden focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                    <span className="ml-2 text-slate-500 font-bold text-xs sm:text-sm">Years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right breakdown card column (Col-5) */}
            <div className="lg:col-span-5 bg-[#f0f3ff] p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-center font-display font-extrabold text-lg text-[#002452] mb-6">Loan Breakdown</h4>
                
                {/* Pie/Donut Chart SVG */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-44 h-44">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" fill="transparent" r="16" stroke="#E5E7EB" strokeWidth="3" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        fill="transparent" 
                        r="16" 
                        stroke="#006e2f" 
                        strokeWidth="3.2" 
                        strokeDasharray={`${interestPercentage} 100`} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly EMI</p>
                      <p className="text-xl sm:text-2xl font-black text-[#002452]" id="calculated-emi-value">
                        ₹ {emi.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-3 h-3 bg-slate-300 rounded-full inline-block"></span> 
                      Principal Amount
                    </span>
                    <span className="font-bold text-slate-900">₹ {loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-3 h-3 bg-[#006e2f] rounded-full inline-block"></span> 
                      Total Interest
                    </span>
                    <span className="font-bold text-[#006e2f]">₹ {totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 flex justify-between text-sm sm:text-base font-extrabold text-[#002452]">
                    <span>Total Payment</span>
                    <span>₹ {totalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Why Choose Us (The JJ Advantage) */}
      <section className="py-16 bg-[#f9f9ff]" id="advantage-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#002452] text-center mb-12">
            The JJ Advantage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center text-[#006e2f]">
                <Percent size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-[#002452] text-sm">Best Rates</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Competitive interest rates benchmarked against industry standards.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center text-[#006e2f]">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-[#002452] text-sm">Secure & Private</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Banking-grade encryption to protect your sensitive financial data.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center text-[#006e2f]">
                <Briefcase size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-[#002452] text-sm">No Hidden Costs</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Zero hidden charges or pre-payment penalties on select products.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. FAQs Accordion */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="faq-section">
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-[#002452] tracking-tight flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-[#006e2f]" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Have queries? Here are swift answers from our experts.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleFaq(0)}
              className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-xs sm:text-sm text-[#002452] hover:bg-slate-50 transition-colors cursor-pointer"
              id="faq-toggle-0"
            >
              <span>What documents are required for a Home Loan?</span>
              {faqOpen[0] ? <ChevronUp size={18} className="text-[#006e2f]" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {faqOpen[0] && (
              <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4" id="faq-answer-0">
                Typically, we require Identity proof (Aadhar/PAN), Address proof, last 6 months bank statements, and salary slips or IT returns for the last 3 years.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleFaq(1)}
              className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-xs sm:text-sm text-[#002452] hover:bg-slate-50 transition-colors cursor-pointer"
              id="faq-toggle-1"
            >
              <span>How long does the approval process take?</span>
              {faqOpen[1] ? <ChevronUp size={18} className="text-[#006e2f]" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {faqOpen[1] && (
              <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4" id="faq-answer-1">
                Preliminary approval happens within 24 hours. The final disbursement usually takes 3-7 working days depending on the property valuation and legal verification.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleFaq(2)}
              className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-xs sm:text-sm text-[#002452] hover:bg-slate-50 transition-colors cursor-pointer"
              id="faq-toggle-2"
            >
              <span>Are there any prepayment charges?</span>
              {faqOpen[2] ? <ChevronUp size={18} className="text-[#006e2f]" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {faqOpen[2] && (
              <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4" id="faq-answer-2">
                For floating-rate individual loans, there are zero prepayment charges. For fixed-rate or business loans, a nominal fee may apply.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
