import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LoanApplication, LoanType } from '../types';
import { 
  Building2, UserCheck, Percent, Clock, Briefcase, FileText, CheckCircle2, 
  HelpCircle, AlertCircle, ArrowRight, Sparkles, User, Settings as SettingsIcon,
  CreditCard, Calendar, BarChart2, DollarSign, List, Shield, ChevronRight, Check
} from 'lucide-react';

export const CustomerDashboardView: React.FC = () => {
  const { applications, addApplication, cmsSettings, addActivity } = useApp();
  
  // Sidebar tab state
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'apply' | 'profile' | 'history' | 'status'>('overview');

  // Form states for new application
  const [loanType, setLoanType] = useState<LoanType>('Business');
  const [amount, setAmount] = useState<number>(1000000);
  const [tenure, setTenure] = useState<number>(5);
  const [purpose, setPurpose] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Check if there are presets from the home EMI calculator
  useEffect(() => {
    const presetType = localStorage.getItem('jj_preset_loan_type');
    const presetAmount = localStorage.getItem('jj_preset_amount');
    const presetTenure = localStorage.getItem('jj_preset_tenure');

    if (presetType && presetAmount && presetTenure) {
      setLoanType(presetType as LoanType);
      setAmount(Number(presetAmount));
      setTenure(Number(presetTenure));
      setActiveSubTab('apply'); // immediately switch to apply tab

      // Clean up presets
      localStorage.removeItem('jj_preset_loan_type');
      localStorage.removeItem('jj_preset_amount');
      localStorage.removeItem('jj_preset_tenure');
    }
  }, []);

  // Filter Rohan Sharma's applications
  const rohanApps = applications.filter(app => app.applicantName === 'Rohan Sharma');

  // Find active underwriting loan or most recent pending one
  const activeApp = rohanApps.find(app => app.status === 'Pending' || app.status === 'Approved') || rohanApps[0];

  // Calculate stats
  const totalOutstanding = rohanApps
    .filter(app => app.status === 'Disbursed' && app.progress < 100)
    .reduce((acc, a) => acc + a.amount, 0);

  const totalDisbursedCount = rohanApps.filter(app => app.status === 'Disbursed').length;

  // Handler for New Loan Submission
  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setFormError('');

    if (!purpose.trim()) {
      setFormError('Please describe the financial purpose of this loan.');
      return;
    }

    // Determine interest rate and emi
    let rate = 10.5;
    switch (loanType) {
      case 'Personal': rate = cmsSettings.personalLoanRate; break;
      case 'Business': rate = cmsSettings.businessLoanRate; break;
      case 'Home': rate = cmsSettings.homeLoanRate; break;
      case 'Gold': rate = cmsSettings.goldLoanRate; break;
      case 'Education': rate = cmsSettings.educationLoanRate; break;
    }

    const P = amount;
    const r = (rate / 12) / 100;
    const n = tenure * 12;
    const emiVal = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    addApplication({
      applicantName: 'Rohan Sharma',
      loanType,
      amount,
      tenure,
      purpose,
      interestRate: rate,
      monthlyEMI: emiVal,
      status: 'Pending'
    });

    setSuccessMsg('Your loan application was successfully queued in our underwriting database!');
    setPurpose('');
    
    // Redirect back to overview after 3 seconds
    setTimeout(() => {
      setSuccessMsg('');
      setActiveSubTab('overview');
    }, 4000);
  };

  // Quick Moratorium Handler
  const handleMoratoriumRequest = () => {
    alert('Moratorium request of 3 months submitted to audit board. Case ID: MOR-8924. We will call you within 24 hours.');
    addActivity('Rohan Sharma', 'Requested 3-month moratorium on Home Loan L-1002', 'warning');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col md:flex-row" id="customer-dashboard-container">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800" id="customer-sidebar">
        {/* User Quick Info */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 font-bold flex items-center justify-center font-display text-xs shrink-0">
            RS
          </div>
          <div className="overflow-hidden">
            <h3 className="font-display font-bold text-xs text-white truncate">Rohan Sharma</h3>
            <p className="text-[10px] text-teal-400 font-mono tracking-wider">CUST-80249</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 space-y-1">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeSubTab === 'overview' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="cust-tab-overview"
          >
            <BarChart2 size={15} />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveSubTab('apply')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeSubTab === 'apply' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="cust-tab-apply"
          >
            <FileText size={15} />
            Apply for New Loan
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeSubTab === 'history' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="cust-tab-history"
          >
            <List size={15} />
            My Active Loans ({rohanApps.length})
          </button>

          <button
            onClick={() => setActiveSubTab('status')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeSubTab === 'status' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="cust-tab-status"
          >
            <Shield size={15} />
            Check Loan Status
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeSubTab === 'profile' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="cust-tab-profile"
          >
            <User size={15} />
            View My Profile
          </button>
        </nav>

        {/* Bottom legal notice */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[9px] font-mono text-slate-500 text-center">
          NBFC SECURE SHELL v1.02
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-hidden">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-5" id="customer-header">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              Secured Customer Portal
            </span>
            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">
              Welcome back, Rohan Sharma!
            </h1>
          </div>
          
          <div className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs shrink-0 font-mono">
            <Calendar size={14} className="text-teal-600" />
            <span className="text-slate-600">Last login: Today, 11:24 AM</span>
          </div>
        </div>

        {/* Content router */}
        <div className="view-enter" id="customer-sub-view-panel">
          
          {/* ================= 1. OVERVIEW TAB ================= */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="cust-stats-row">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Outstanding Principal</p>
                    <p className="text-sm font-bold font-mono text-slate-900">₹{totalOutstanding.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase font-bold">Total Disbursed</p>
                    <p className="text-sm font-bold font-mono text-slate-900">{totalDisbursedCount} Loans</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Monthly Commitments</p>
                    <p className="text-sm font-bold font-mono text-teal-600">
                      ₹{rohanApps.filter(a => a.status === 'Disbursed' && a.progress < 100).reduce((acc, a) => acc + a.monthlyEMI, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Credit score status</p>
                    <p className="text-sm font-bold font-mono text-emerald-700">785 / Excellent</p>
                  </div>
                </div>
              </div>

              {/* Active Application Status Tracker */}
              {activeApp && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-6" id="active-loan-tracker-panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-teal-600 font-bold block">
                        Real-time Pipeline Tracking
                      </span>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        {activeApp.loanType} Expansion Loan (Ref: {activeApp.id})
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">Status:</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        activeApp.status === 'Disbursed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : activeApp.status === 'Approved'
                          ? 'bg-teal-50 text-teal-700 border border-teal-100'
                          : activeApp.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {activeApp.status === 'Pending' ? 'Under Underwriting' : activeApp.status}
                      </span>
                    </div>
                  </div>

                  {/* Progressive Line Tracker */}
                  <div className="relative pt-2 pb-6" id="progress-dots-line">
                    {/* Background track line */}
                    <div className="absolute left-4 sm:left-0 right-0 top-6 h-1 bg-slate-100 hidden sm:block"></div>
                    <div 
                      className="absolute left-0 top-6 h-1 bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-500 hidden sm:block"
                      style={{ width: `${activeApp.progress}%` }}
                    ></div>

                    {/* Step Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative">
                      
                      {/* Step 1 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0">
                          1
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-950">Applied</p>
                          <p className="text-[10px] text-slate-400 font-mono">Step Complete</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeApp.progress >= 40 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {activeApp.progress > 40 ? <Check size={12} /> : '2'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-950">KYC Auditing</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {activeApp.progress >= 40 ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeApp.progress >= 60 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {activeApp.progress > 60 ? <Check size={12} /> : '3'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-950">Underwriting</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {activeApp.progress === 60 ? 'Currently Active' : activeApp.progress > 60 ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeApp.progress >= 80 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {activeApp.progress > 80 ? <Check size={12} /> : '4'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-950">Approval Board</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {activeApp.progress >= 80 ? 'Pre-Approved' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Step 5 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeApp.progress === 100 && activeApp.status === 'Disbursed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          5
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-950">Disbursed</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {activeApp.status === 'Disbursed' ? 'Funds Cleared' : 'Pending'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="customer-quick-actions">
                
                {/* Apply Shortcut */}
                <button 
                  onClick={() => setActiveSubTab('apply')}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 p-5 rounded-2xl text-white text-left transition-all shadow-md shadow-teal-500/10 cursor-pointer flex flex-col justify-between group h-36"
                  id="act-apply-btn"
                >
                  <div className="p-2 bg-white/10 rounded-xl w-fit">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider">Quick Action</h4>
                    <p className="text-sm font-black mt-0.5">Apply for New Loan</p>
                    <p className="text-[10px] text-teal-100 mt-1 leading-normal">Submit immediate gold weight or business working capital requests.</p>
                  </div>
                </button>

                {/* Moratorium Shortcut */}
                <button 
                  onClick={handleMoratoriumRequest}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:border-slate-200 text-left transition-all cursor-pointer flex flex-col justify-between h-36 group"
                  id="act-moratorium-btn"
                >
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">Lending Relief</h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 group-hover:text-teal-600 transition-colors">Request Moratorium</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">Defer up to 3 EMI schedules for seasonal crops or industrial strikes.</p>
                  </div>
                </button>

                {/* Ledger Check */}
                <button 
                  onClick={() => setActiveSubTab('history')}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:border-slate-200 text-left transition-all cursor-pointer flex flex-col justify-between h-36 group"
                  id="act-ledger-btn"
                >
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">Ledgers</h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 group-hover:text-teal-600 transition-colors">Repayment Ledgers</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">Print official tax certificates, payment histories, and interest splits.</p>
                  </div>
                </button>

              </div>

              {/* Active Loans Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs p-6" id="active-loans-table-wrapper">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Active Lending Accounts</h3>
                  <button 
                    onClick={() => setActiveSubTab('history')} 
                    className="text-teal-600 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Accounts
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">Account ID</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Disbursed Amount</th>
                        <th className="pb-3 font-semibold">Moratorium Tenure</th>
                        <th className="pb-3 font-semibold">Monthly EMI</th>
                        <th className="pb-3 font-semibold text-right">Active Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {rohanApps.map(app => (
                        <tr key={app.id} className="text-slate-700">
                          <td className="py-3 font-mono font-bold text-slate-900">{app.id}</td>
                          <td className="py-3">
                            <span className="font-semibold text-slate-800">{app.loanType}</span>
                          </td>
                          <td className="py-3 font-mono font-semibold">₹{app.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 font-mono">{app.tenure} Years</td>
                          <td className="py-3 font-mono font-semibold text-teal-600">₹{app.monthlyEMI.toLocaleString('en-IN')}/mo</td>
                          <td className="py-3 text-right">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === 'Disbursed' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : app.status === 'Approved'
                                ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                : app.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= 2. APPLY TAB ================= */}
          {activeSubTab === 'apply' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-3xl mx-auto shadow-sm space-y-6" id="apply-new-loan-panel">
              <div className="space-y-1.5 border-b border-slate-50 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-teal-600 font-bold block uppercase">
                  Digital KYC Verification Core
                </span>
                <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-teal-600" />
                  Apply for a New Loan Portfolio
                </h2>
                <p className="text-xs text-slate-500">
                  Select your product and sliders. Submitting adds this immediately to our underwriting dashboard and logs.
                </p>
              </div>

              {successMsg ? (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3 text-center" id="apply-success-box">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{successMsg}</p>
                  <p className="text-[11px] text-slate-500">
                    Switch your role to **System Admin** via the dropdown to immediately approve or reject this new application!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyLoan} className="space-y-6" id="apply-loan-form">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Loan Type Selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600 block">Select Loan Product</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {(['Business', 'Personal', 'Home', 'Gold', 'Education'] as LoanType[]).map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setLoanType(type)}
                          className={`py-3 px-2 border rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                            loanType === type 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {type} Loan
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Requested Principle Amount</span>
                      <span className="font-mono font-bold text-slate-900 bg-teal-50 px-2.5 py-1 rounded-md text-teal-700 border border-teal-100">
                        ₹{amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="10000000"
                      step="50000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>₹50,000</span>
                      <span>₹50 Lakhs</span>
                      <span>₹1 Crore</span>
                    </div>
                  </div>

                  {/* Tenure slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Repayment Period</span>
                      <span className="font-mono font-bold text-slate-900 bg-teal-50 px-2.5 py-1 rounded-md text-teal-700 border border-teal-100">
                        {tenure} Years ({tenure * 12} Mos)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1 Year</span>
                      <span>10 Years</span>
                      <span>20 Years</span>
                    </div>
                  </div>

                  {/* Purpose text */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Detail Financial Purpose</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Purchasing modern tooling machinery for Pune factory expansion, or funding foreign student semester."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    id="submit-loan-app-btn"
                  >
                    Submit Underwriting File
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================= 3. ACTIVE LOANS LIST TAB ================= */}
          {activeSubTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Your Active Lending Portfolios</h3>
                  <p className="text-xs text-slate-400">Total accounts currently serviced under PAN: ***894A.</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('apply')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  + Apply for Another
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="customer-loans-grid">
                {rohanApps.map((app) => (
                  <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">{app.loanType} Loan Account</h4>
                          <span className="text-[10px] font-mono text-slate-400">#{app.id}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{app.date}</span>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Disbursed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : app.status === 'Approved'
                          ? 'bg-teal-50 text-teal-700 border border-teal-100'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic">"{app.purpose}"</p>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">Principle Amount</p>
                        <p className="font-bold text-slate-900 font-mono">₹{app.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Interest Rate</p>
                        <p className="font-bold text-slate-900 font-mono">{app.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">EMI Obligation</p>
                        <p className="font-bold text-teal-600 font-mono">₹{app.monthlyEMI.toLocaleString('en-IN')}/mo</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Lending pipeline progress</span>
                        <span>{app.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${app.status === 'Rejected' ? 'bg-rose-500' : 'bg-teal-600'}`} 
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {app.status === 'Disbursed' && (
                      <div className="pt-2 flex gap-2">
                        <button 
                          onClick={() => alert(`Pre-payment order created for ${app.id}. Payment gateway sandbox initialized.`)}
                          className="w-full py-1.5 border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          Pre-Pay Outstanding
                        </button>
                        <button 
                          onClick={() => alert(`Downloading Loan NOC & Certificate for Account ${app.id}...`)}
                          className="w-full py-1.5 border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          Certificate PDF
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. CHECK STATUS TAB ================= */}
          {activeSubTab === 'status' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-3xl mx-auto shadow-sm space-y-6" id="check-status-panel">
              <div className="space-y-1 border-b border-slate-50 pb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Verification Desk</span>
                <h3 className="font-display font-extrabold text-lg text-slate-900">Current Application Underwriting Checklist</h3>
                <p className="text-xs text-slate-500">A detailed lookup of requirements submitted under Rohan Sharma.</p>
              </div>

              {activeApp ? (
                <div className="space-y-6">
                  
                  {/* Current Active Step Callout */}
                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl flex items-center gap-3">
                    <Clock size={18} className="text-teal-600 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                    <div className="text-xs text-teal-800 leading-normal">
                      <strong>Current Phase: {activeApp.progress}% - Underwriting Audits.</strong> Our central risk officers are validating tax certifications and corporate bank ledgers for Account <strong>{activeApp.id}</strong>.
                    </div>
                  </div>

                  {/* Checklist Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800">Primary PAN & Aadhaar KYC Authentication</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">VERIFIED</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800">Bank Account Ledger Statement (6 Months Uploaded)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">VERIFIED</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Clock size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800">Risk Assessment & Collateral Appraisal Auditing</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">IN PROGRESS</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <span>4</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">Credit Board Final Sanction Letter Sign-off</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">PENDING</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center leading-normal">
                    *Checklists are automatically logged by our internal credit API nodes. To speed up verification, submit outstanding documents through the Chat interface.
                  </p>

                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No pending or active applications found.</p>
              )}
            </div>
          )}

          {/* ================= 5. PROFILE TAB ================= */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-2xl mx-auto shadow-sm space-y-8" id="customer-profile-panel">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 text-teal-600 font-display font-extrabold text-sm flex items-center justify-center border border-teal-500/20 shrink-0">
                  RS
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-slate-900">Rohan Sharma</h3>
                  <p className="text-xs text-slate-400">KYC Status: <strong className="text-emerald-600">VERIFIED NBFC CUSTOMER</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400">Registered Email Address</p>
                  <p className="font-bold text-slate-800">rohan.sharma@example.com</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">Mobile Phone Number</p>
                  <p className="font-bold text-slate-800 font-mono">+91 99999 88888</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">Permanent PAN Card</p>
                  <p className="font-bold text-slate-800 font-mono">BCVPS****M</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">Registered Aadhar UID</p>
                  <p className="font-bold text-slate-800 font-mono">**** **** 4892</p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-slate-400">Billing Address</p>
                  <p className="font-bold text-slate-800 leading-normal">
                    Flat 402, Royal Orchard Residency, Kalyani Nagar, Pune, MH 411006
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <h4 className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">KYC Auditing Records</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-white rounded-md border border-slate-200/50">
                    <p className="text-slate-400">PAN Audit</p>
                    <p className="font-bold text-emerald-600 mt-0.5">PASSED</p>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200/50">
                    <p className="text-slate-400">Income Audit</p>
                    <p className="font-bold text-emerald-600 mt-0.5">PASSED</p>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200/50">
                    <p className="text-slate-400">Bureau Score</p>
                    <p className="font-bold text-emerald-600 mt-0.5">PASSED</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
};
