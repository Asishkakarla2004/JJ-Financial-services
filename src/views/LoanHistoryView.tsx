import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoanApplication, LoanType } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { 
  Briefcase, GraduationCap, Home as HomeIcon, Award, Search, 
  Sparkles, CheckCircle2, User, ChevronRight, MessageSquare, ArrowRight, MapPin
} from 'lucide-react';

interface LoanHistoryViewProps {
  setCurrentTab: (tab: string) => void;
}

export const LoanHistoryView: React.FC<LoanHistoryViewProps> = ({ setCurrentTab }) => {
  const { applications, switchRole } = useApp();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Pre-defined success stories exactly matching the reference image
  const successStories = [
    {
      id: 'S-1',
      applicantName: 'Business Expansion & Technology Upgrade',
      purpose: 'Business Expansion & Technology Upgrade',
      loanType: 'Business' as const,
      amount: 2500000,
      fundedAmount: 1000000,
      progress: 40,
      status: 'Published',
      date: '2026-06-25',
      tenure: 5,
      monthlyEMI: 50000,
      location: 'BKC, Mumbai, India',
      categoryTags: 'SME Growth, Working Capital, Expansion',
    },
    {
      id: 'S-2',
      applicantName: 'Residential Flat Purchase',
      purpose: 'Residential Flat Purchase',
      loanType: 'Home' as const,
      amount: 4500000,
      fundedAmount: 4500000,
      progress: 100,
      status: 'Completed',
      date: '2026-06-20',
      tenure: 15,
      monthlyEMI: 44031,
      location: 'BKC, Mumbai, India',
      categoryTags: 'Housing Finance, Mortgages, Real Estate',
    },
    {
      id: 'S-3',
      applicantName: 'Medical Expenses & Family Wedding',
      purpose: 'Medical Expenses & Family Wedding',
      loanType: 'Personal' as const,
      amount: 500000,
      fundedAmount: 500000,
      progress: 100,
      status: 'Completed',
      date: '2026-06-18',
      tenure: 3,
      monthlyEMI: 16250,
      location: 'Indiranagar, Bengaluru, India',
      categoryTags: 'Immediate Liquidity, Family Expenses, Debt Consolidation',
    },
    {
      id: 'S-4',
      applicantName: 'Premium Villa Construction',
      purpose: 'Premium Villa Construction',
      loanType: 'Home' as const,
      amount: 6000000,
      fundedAmount: 6000000,
      progress: 100,
      status: 'Completed',
      date: '2026-06-15',
      tenure: 20,
      monthlyEMI: 56000,
      location: 'Viman Nagar, Pune, India',
      categoryTags: 'Housing Finance, Mortgages, Real Estate',
    },
    {
      id: 'S-5',
      applicantName: 'Inventory Purchase & Working Capital',
      purpose: 'Inventory Purchase & Working Capital',
      loanType: 'Business' as const,
      amount: 1500000,
      fundedAmount: 1200000,
      progress: 80,
      status: 'Approved',
      date: '2026-06-12',
      tenure: 5,
      monthlyEMI: 32000,
      location: 'Connaught Place, Delhi, India',
      categoryTags: 'SME Growth, Working Capital, Expansion',
    },
    {
      id: 'S-6',
      applicantName: 'Eco-friendly Smart Housing Development',
      purpose: 'Eco-friendly Smart Housing Development',
      loanType: 'Home' as const,
      amount: 4500000,
      fundedAmount: 4500000,
      progress: 100,
      status: 'Completed',
      date: '2026-06-10',
      tenure: 15,
      monthlyEMI: 44031,
      location: 'Connaught Place, Delhi, India',
      categoryTags: 'Housing Finance, Mortgages, Real Estate',
    },
  ];

  const allStories = [
    ...successStories,
    ...applications.filter(app => app.id && !app.id.startsWith('L-STATIC') && (app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Pending')).map(app => {
      const isCompleted = app.status === 'Disbursed';
      const progressVal = app.progress || (isCompleted ? 100 : app.status === 'Approved' ? 80 : 40);
      const disbursedAmt = Math.round((app.amount * progressVal) / 100);
      return {
        id: app.id,
        applicantName: app.applicantName,
        purpose: app.purpose || `${app.loanType} Loan for ${app.applicantName}`,
        loanType: app.loanType,
        amount: app.amount,
        fundedAmount: disbursedAmt,
        progress: progressVal,
        status: isCompleted ? 'Completed' : app.status === 'Approved' ? 'Approved' : 'Published',
        date: app.date,
        tenure: app.tenure,
        monthlyEMI: app.monthlyEMI,
        location: getApplicantLocation(app.applicantName),
        categoryTags: getLoanTags(app.loanType),
      };
    })
  ];

  // Filter applications based on search and tab
  const filteredApps = allStories.filter(app => {
    // Search match
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    if (activeFilter === 'Active') {
      return matchesSearch && (app.status === 'Approved' || app.status === 'Published');
    }
    if (activeFilter === 'Completed') {
      return matchesSearch && app.status === 'Completed';
    }
    return matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  // Chart data calculation
  const getChartData = () => {
    const counts: { [key: string]: number } = { Business: 0, Home: 0, Personal: 0, Gold: 0, Education: 0 };
    allStories.forEach(app => {
      if (counts[app.loanType] !== undefined) {
        counts[app.loanType] += app.amount;
      }
    });
    return Object.keys(counts).map(key => ({
      name: `${key} Loan`,
      volume: counts[key] / 100000 // Convert to lakhs
    }));
  };

  const chartData = getChartData();
  const COLORS = ['#0d9488', '#4f46e5', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const handleSpeakToAdvisor = () => {
    setCurrentTab('contact');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 view-enter" id="loan-history-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Corporate Ledger & Portfolio
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Our Loan Success Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Realizing dreams, one disbursement at a time. Below is a real-time record of active, approved, and completed portfolios financed by JJ Financial.
          </p>
        </div>

        {/* Dynamic Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-3xs" id="history-stats-row">
          <div className="text-center md:border-r border-slate-100 space-y-0.5 py-1">
            <p className="text-lg sm:text-2xl font-display font-extrabold text-teal-600">{allStories.length + 1200}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Total Capital Journeys</p>
          </div>
          <div className="text-center md:border-r border-slate-100 space-y-0.5 py-1">
            <p className="text-lg sm:text-2xl font-display font-extrabold text-indigo-600">₹{(allStories.reduce((acc, a) => acc + a.amount, 0) / 10000000 + 150).toFixed(1)} Cr</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Disbursed Volume</p>
          </div>
          <div className="text-center md:border-r border-slate-100 space-y-0.5 py-1">
            <p className="text-lg sm:text-2xl font-display font-extrabold text-amber-600">
              {allStories.filter(a => a.status === 'Approved' || a.status === 'Published').length + 840}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Under Review / Active</p>
          </div>
          <div className="text-center space-y-0.5 py-1">
            <p className="text-lg sm:text-2xl font-display font-extrabold text-emerald-600">
              {allStories.filter(a => a.status === 'Completed').length + 360}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Fully Paid / Cleared</p>
          </div>
        </div>

        {/* Main List Column - Now Full Width */}
        <div className="space-y-6" id="ledger-main-section">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-3xs" id="ledger-controls">
            
            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-slate-50 rounded-lg shrink-0">
              {(['All', 'Active', 'Completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeFilter === f 
                      ? 'bg-white text-teal-600 shadow-3xs border border-slate-200/40' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f} Projects
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant or purpose..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white"
              />
            </div>

          </div>

          {/* List Cards - Beautiful Grid View mimicking reference exactly */}
          {paginatedApps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3" id="stories-grid-empty">
              <p className="text-sm font-semibold text-slate-800">No portfolio records found</p>
              <p className="text-xs text-slate-400">Try checking spelling, removing filters, or adding a new loan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="stories-grid">
              {paginatedApps.map((app) => {
                const isCompleted = app.status === 'Completed';
                return (
                  <div 
                    key={app.id} 
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                    id={`ledger-app-${app.id}`}
                  >
                    {/* Topline header with statuses and color icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full ${
                          isCompleted 
                            ? 'bg-slate-100 text-slate-700' 
                            : app.status === 'Approved' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-slate-400 font-semibold text-[9px] sm:text-[11px] tracking-wider border border-slate-200/60 rounded px-2 py-0.5">
                          FY 2026-2027
                        </span>
                      </div>
                      
                      {/* Round-Corner Colored Square with White Category Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                        app.loanType === 'Home' ? 'bg-[#1e40af]' :
                        app.loanType === 'Business' ? 'bg-[#006e2f]' :
                        app.loanType === 'Personal' ? 'bg-[#be185d]' :
                        app.loanType === 'Gold' ? 'bg-[#b45309]' : 'bg-[#6d28d9]'
                      }`}>
                        {app.loanType === 'Home' && <HomeIcon size={16} />}
                        {app.loanType === 'Business' && <Briefcase size={16} />}
                        {app.loanType === 'Personal' && <User size={16} />}
                        {app.loanType === 'Gold' && <Sparkles size={16} />}
                        {app.loanType === 'Education' && <GraduationCap size={16} />}
                      </div>
                    </div>

                    {/* Main Title and Category tag lines */}
                    <div className="space-y-1 mb-4">
                      <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-snug tracking-tight line-clamp-2 h-12">
                        {app.purpose}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                        {app.categoryTags}
                      </p>
                    </div>

                    {/* Location Tag */}
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-6">
                      <MapPin size={14} className="shrink-0" />
                      <span>{app.location}</span>
                    </div>

                    {/* Budget & Funded Rows */}
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
                          ₹{app.fundedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Beautiful Solid Green Progress Bar and Percentage Label */}
                    <div className="mt-4">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#006e2f] rounded-full transition-all duration-500"
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold block text-right mt-1.5">
                        {app.progress}% funded
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 pt-4" id="history-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-200/60 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-mono text-slate-500 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-slate-200/60 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

        </div>

        {/* Portfolio Distribution & Speak to Advisor underneath the project cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="portfolio-bottom-section">
          
          {/* Chart Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="type-split-widget">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wider font-mono">
                Portfolio Distribution
              </h3>
              <p className="text-xs text-slate-400">Total disbursed value split by loan category (in Lakhs).</p>
            </div>

            <div className="h-56 w-full" id="history-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '11px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')} Lakhs`, 'Total Disbursed']}
                  />
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Speak to Advisor Widget */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden shadow-md border border-slate-800 flex flex-col justify-between" id="speak-to-advisor-widget">
            <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
            <div className="relative space-y-4 flex-1">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 w-fit rounded-xl">
                <MessageSquare size={18} />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-black text-base uppercase tracking-wider text-teal-400">
                  Speak to an Advisor
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have questions regarding corporate structures, flexible gold underwriting multipliers, or flat moratorium extensions?
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                Our senior advisors respond within 2 hours with customized repayment timelines.
              </p>
            </div>
            <div className="relative mt-6">
              <button
                onClick={handleSpeakToAdvisor}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="speak-advisor-btn"
              >
                <span>Connect Instantly</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
