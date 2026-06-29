import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoanType, LoanApplication, User, ContactMessage, CmsSettings } from '../types';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  Briefcase, Landmark, ShieldAlert, CheckCircle2, XCircle, Clock,
  FileText, MessageSquare, Settings as SettingsIcon, Users, BarChart2,
  DollarSign, Activity, Save, RefreshCw, Eye, Trash, ArrowRight, Check, X, Search,
  Upload, Image, Plus
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    applications, messages, users, cmsSettings, activities, 
    addApplication, updateApplicationStatus, updateMessageStatus, updateUserStatus, 
    updateCmsSettings, resetAllData, addActivity
  } = useApp();

  // Admin sub-navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'cms' | 'users' | 'reports'>('overview');

  // CMS Form States (initialized with current settings)
  const [cmsForm, setCmsForm] = useState<CmsSettings>({ ...cmsSettings });
  const [cmsSaved, setCmsSaved] = useState(false);
  const [showCmsSuccessModal, setShowCmsSuccessModal] = useState(false);

  React.useEffect(() => {
    setCmsForm({ ...cmsSettings });
  }, [cmsSettings]);

  // User search/filter states
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Customer' | 'Employee'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Manual Loan Application creation states
  const [isAddManualOpen, setIsAddManualOpen] = useState(false);
  const [newAppForm, setNewAppForm] = useState({
    applicantName: '',
    loanType: 'Personal' as LoanType,
    amount: 500000,
    tenure: 3,
    purpose: '',
    interestRate: cmsSettings.personalLoanRate || 10.5,
    status: 'Pending' as 'Pending' | 'Approved' | 'Rejected' | 'Disbursed'
  });

  const getRateForType = (type: LoanType): number => {
    switch (type) {
      case 'Personal': return cmsSettings.personalLoanRate || 10.5;
      case 'Business': return cmsSettings.businessLoanRate || 14.0;
      case 'Home': return cmsSettings.homeLoanRate || 8.5;
      case 'Gold': return cmsSettings.goldLoanRate || 7.5;
      case 'Education': return cmsSettings.educationLoanRate || 9.2;
      default: return 10;
    }
  };

  // Selected contact message for modal details
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Officer Image Upload States & Handlers
  const [dragOver, setDragOver] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageToCrop(reader.result);
          setCropZoom(1);
          setCropPosition({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please drop a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageToCrop(reader.result);
          setCropZoom(1);
          setCropPosition({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Overview calculations
  const totalDisbursed = applications
    .filter(a => a.status === 'Disbursed')
    .reduce((acc, a) => acc + a.amount, 0);

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'Unread').length;

  // Chart 1: Monthly Lending Trend (in Lakhs)
  const monthlyData = [
    { month: 'Jan', Personal: 15, Business: 40, Home: 80 },
    { month: 'Feb', Personal: 22, Business: 55, Home: 120 },
    { month: 'Mar', Personal: 18, Business: 75, Home: 95 },
    { month: 'Apr', Personal: 30, Business: 90, Home: 140 },
    { month: 'May', Personal: 25, Business: 110, Home: 160 },
    { month: 'Jun', Personal: 35, Business: 130, Home: 180 },
  ];

  // Chart 2: Category Split Pie data
  const getPieData = () => {
    const data: { [key: string]: number } = { Business: 0, Home: 0, Personal: 0, Gold: 0, Education: 0 };
    applications.forEach(a => {
      data[a.loanType] += a.amount;
    });
    return Object.keys(data).map(key => ({
      name: `${key} Loan`,
      value: data[key]
    }));
  };

  const pieData = getPieData();
  const COLORS = ['#0d9488', '#4f46e5', '#f59e0b', '#8b5cf6', '#06b6d4'];

  // Handle CMS Form submission
  const handleCmsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsSettings(cmsForm);
    setCmsSaved(true);
    setShowCmsSuccessModal(true);
    setTimeout(() => setCmsSaved(false), 4000);
  };

  // Filter Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch);

    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' ? true : u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col md:flex-row" id="admin-dashboard-container">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800" id="admin-sidebar">
        
        {/* Admin Branding badge */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 font-bold flex items-center justify-center font-display text-xs shrink-0">
            ADM
          </div>
          <div>
            <h3 className="font-display font-bold text-xs text-white">Central Operations</h3>
            <p className="text-[10px] text-rose-400 font-mono tracking-wider font-bold">ROOT SECURITY</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="p-4 flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="admin-tab-overview"
          >
            <BarChart2 size={15} />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'messages' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="admin-tab-messages"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare size={15} />
              <span>Customer Messages</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === 'cms' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="admin-tab-cms"
          >
            <SettingsIcon size={15} />
            CMS Settings (Homepage)
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === 'users' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="admin-tab-users"
          >
            <Users size={15} />
            User Management
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            id="admin-tab-reports"
          >
            <FileText size={15} />
            Reports & Analytics
          </button>
        </nav>

        {/* Database factory reset widget */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center space-y-2">
          <p className="text-[9px] text-slate-500 font-mono">DEBUG UTILITIES</p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data and clear local storage defaults?')) {
                resetAllData();
                alert('All data has been reset successfully!');
              }
            }}
            className="w-full py-1.5 bg-slate-800 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-900/50 text-[10px] font-semibold rounded-lg text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            id="factory-reset-btn"
          >
            <RefreshCw size={10} />
            Factory Reset Sandbox
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-hidden">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-5" id="admin-header">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              Lending Underwriting Console
            </span>
            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">
              Operations Control Panel
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-slate-600">CENTRAL_LEDGER_ONLINE</span>
          </div>
        </div>

        {/* Sub-routing panels */}
        <div className="view-enter" id="admin-sub-panel">
          
          {/* ================= 1. DASHBOARD OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-overview-stats">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Disbursed Capital</p>
                    <p className="text-sm font-bold font-mono text-slate-900">₹{(totalDisbursed / 10000000).toFixed(2)} Cr</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Outstanding Assets</p>
                    <p className="text-sm font-bold font-mono text-slate-900">₹{(totalDisbursed * 0.94 / 10000000).toFixed(2)} Cr</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Pending Auditing</p>
                    <p className="text-sm font-bold font-mono text-amber-700">{pendingCount} Files</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Unread Enquiries</p>
                    <p className="text-sm font-bold font-mono text-rose-700">{unreadMessagesCount} Messages</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="admin-charts-grid">
                
                {/* Bar Chart */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs lg:col-span-8 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-widest font-mono">
                      Lending Volume Trend (₹ in Lakhs)
                    </h3>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="Personal" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Business" fill="#0d9488" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Home" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs lg:col-span-4 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-widest font-mono">
                      Active Portfolios Split
                    </h3>
                  </div>
                  <div className="h-64 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `₹${(Number(value) / 100000).toFixed(1)} Lakhs`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-mono">TOTAL FUNDS</span>
                      <span className="text-xs font-black font-mono">₹{(totalDisbursed / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Core Applications Review Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs p-6" id="review-applications-panel">
                <div className="border-b border-slate-50 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                    Recent Loan Underwriting Applications
                  </h3>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-100">
                      Awaiting Decisions
                    </span>
                    <button
                      onClick={() => {
                        setNewAppForm({
                          applicantName: '',
                          loanType: 'Personal',
                          amount: 500000,
                          tenure: 3,
                          purpose: '',
                          interestRate: cmsSettings.personalLoanRate || 10.5,
                          status: 'Pending'
                        });
                        setIsAddManualOpen(true);
                      }}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                      id="add-application-manual-btn"
                    >
                      <Plus size={13} />
                      <span>Add Manually</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">Account Ref</th>
                        <th className="pb-3 font-semibold">Applicant</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Principal Sum</th>
                        <th className="pb-3 font-semibold">Tenure Moratorium</th>
                        <th className="pb-3 font-semibold">Rate</th>
                        <th className="pb-3 font-semibold">Account Status</th>
                        <th className="pb-3 font-semibold text-right">Committee Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {applications.map((app) => (
                        <tr key={app.id} className="text-slate-700 hover:bg-slate-50/40">
                          <td className="py-3 font-mono font-bold text-slate-900">{app.id}</td>
                          <td className="py-3">
                            <span className="font-semibold text-slate-800">{app.applicantName}</span>
                          </td>
                          <td className="py-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-mono">{app.loanType}</span>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900">₹{app.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 font-mono">{app.tenure} Years</td>
                          <td className="py-3 font-mono">{app.interestRate}%</td>
                          <td className="py-3">
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
                          <td className="py-3 text-right">
                            {app.status === 'Pending' && (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => updateApplicationStatus(app.id, 'Approved')}
                                  className="p-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md transition-colors cursor-pointer"
                                  title="Approve Sanction"
                                >
                                  <Check size={14} className="stroke-[2.5]" />
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                  className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors cursor-pointer"
                                  title="Reject Sanction"
                                >
                                  <X size={14} className="stroke-[2.5]" />
                                </button>
                              </div>
                            )}

                            {app.status === 'Approved' && (
                              <button
                                onClick={() => updateApplicationStatus(app.id, 'Disbursed')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-md cursor-pointer shrink-0"
                              >
                                Clear Funds Disbursal
                              </button>
                            )}

                            {app.status === 'Disbursed' && (
                              <span className="text-[10px] font-mono text-slate-400">Ledger Sealed</span>
                            )}

                            {app.status === 'Rejected' && (
                              <span className="text-[10px] font-mono text-slate-400">File Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Logs Feed */}
              <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 font-mono space-y-4" id="admin-system-logs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                    <Activity size={14} />
                    Live Audit Ledger Activity Streams
                  </h3>
                </div>

                <div className="space-y-2 text-xs h-36 overflow-y-auto">
                  {activities.map((act) => (
                    <div key={act.id} className="flex justify-between hover:bg-slate-850 py-1 px-2 rounded-md">
                      <div className="flex gap-2">
                        <span className="text-rose-500 font-bold">[{act.user}]</span>
                        <span className="text-slate-200">{act.action}</span>
                      </div>
                      <span className="text-slate-500 font-semibold">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= 2. CUSTOMER MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-6" id="messages-manager-panel">
              <div className="border-b border-slate-50 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Contact Form Message Inboxes</h3>
                  <p className="text-xs text-slate-400">A direct feed of incoming requests from public contact pages.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Contact Info</th>
                      <th className="pb-3 font-semibold">Lending Area</th>
                      <th className="pb-3 font-semibold">Message Detail</th>
                      <th className="pb-3 font-semibold">Review Status</th>
                      <th className="pb-3 font-semibold text-right">Inbox Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-400">No contact messages received.</td>
                      </tr>
                    ) : (
                      messages.map((m) => (
                        <tr key={m.id} className="text-slate-700 hover:bg-slate-50/40">
                          <td className="py-3 font-mono whitespace-nowrap">{m.date}</td>
                          <td className="py-3 font-bold text-slate-850">{m.name}</td>
                          <td className="py-3 space-y-0.5">
                            <p className="font-mono">{m.email}</p>
                            <p className="font-mono text-[11px] text-slate-400">{m.phone}</p>
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md text-[10px] font-semibold">{m.loanTypeInterest}</span>
                          </td>
                          <td className="py-3 max-w-xs leading-normal">
                            <p className="truncate text-slate-500 max-w-[200px]" title="Click 'View' to read the full message">{m.message}</p>
                          </td>
                          <td className="py-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              m.status === 'Unread' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                                : m.status === 'Read'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedMessage({ ...m, status: 'Read' });
                                  if (m.status === 'Unread') {
                                    updateMessageStatus(m.id, 'Read');
                                  }
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                              >
                                <Eye size={11} />
                                <span>View</span>
                              </button>
                              {m.status !== 'Replied' && (
                                <button
                                  onClick={() => {
                                    updateMessageStatus(m.id, 'Replied');
                                  }}
                                  className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-[10px] cursor-pointer flex items-center gap-1 font-semibold transition-colors shrink-0"
                                >
                                  <Check size={11} />
                                  <span>Mark Replied</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. CMS SETTINGS FORM ================= */}
          {activeTab === 'cms' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-3xl mx-auto shadow-sm space-y-6" id="cms-manager-panel">
              <div className="space-y-1 border-b border-slate-50 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold block uppercase">
                  Website Copy & Interest Slider Master Config
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-900">Dynamic CMS Landing Page Controls</h3>
                <p className="text-xs text-slate-500">
                  Update homepage marketing copy and change standard interest rates parameters instantly.
                </p>
              </div>

              {cmsSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex items-center gap-2" id="cms-success-toast">
                  <CheckCircle2 size={16} />
                  <span>All landing page settings and system interest rates saved. Switch to **Home** to see changes!</span>
                </div>
              )}

              <form onSubmit={handleCmsSave} className="space-y-6" id="cms-form">
                
                {/* Heros */}
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400">1. Hero Content & Headlines</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Main Hero Headline</label>
                    <input
                      type="text"
                      value={cmsForm.heroTitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Hero Narrative Subtext</label>
                    <textarea
                      rows={3}
                      value={cmsForm.heroSubtitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Vision and missions */}
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400">2. Strategic Directives (Vision & Mission)</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Strategic Vision Text</label>
                    <textarea
                      rows={2}
                      value={cmsForm.visionText}
                      onChange={(e) => setCmsForm({ ...cmsForm, visionText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Strategic Mission Text</label>
                    <textarea
                      rows={2}
                      value={cmsForm.missionText}
                      onChange={(e) => setCmsForm({ ...cmsForm, missionText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Headquarters Details */}
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400">3. Contact Office Details</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Office Address</label>
                    <input
                      type="text"
                      value={cmsForm.contactAddress}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactAddress: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Corporate Support Phone</label>
                      <input
                        type="text"
                        value={cmsForm.contactPhone}
                        onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Corporate Support Email</label>
                      <input
                        type="text"
                        value={cmsForm.contactEmail}
                        onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Liaison (Officer Profile) */}
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400">4. Direct Liaison (Officer Profile)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Officer Name</label>
                      <input
                        type="text"
                        value={cmsForm.officerName}
                        onChange={(e) => setCmsForm({ ...cmsForm, officerName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Officer Role / Designation</label>
                      <input
                        type="text"
                        value={cmsForm.officerRole}
                        onChange={(e) => setCmsForm({ ...cmsForm, officerRole: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Officer Image</label>
                      
                      <div className="flex gap-3 items-start">
                        {/* Current Image Preview */}
                        <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 relative flex items-center justify-center">
                          {cmsForm.officerImage ? (
                            <img 
                              src={cmsForm.officerImage} 
                              alt="Officer Profile" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Image size={18} />
                            </div>
                          )}
                        </div>

                        {/* Drag and Drop File Upload Area */}
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`flex-1 border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer ${
                            dragOver 
                              ? 'border-teal-500 bg-teal-50/20' 
                              : 'border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/10'
                          }`}
                          onClick={() => document.getElementById('officer-image-file-input')?.click()}
                        >
                          <input 
                            id="officer-image-file-input"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileUpload}
                          />
                          <Upload size={14} className="text-slate-400 mx-auto mb-1" />
                          <p className="text-[10px] font-semibold text-slate-600">
                            {dragOver ? 'Drop here!' : 'Click or Drag to Upload'}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">PNG, JPG up to 2MB</p>
                        </div>
                      </div>

                      {/* Optional raw URL fallback */}
                      <div className="pt-1.5">
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">Or paste direct Image URL</label>
                        <input
                          type="text"
                          value={cmsForm.officerImage}
                          onChange={(e) => setCmsForm({ ...cmsForm, officerImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 block">Officer Direct Phone</label>
                      <input
                        type="text"
                        value={cmsForm.officerPhone}
                        onChange={(e) => setCmsForm({ ...cmsForm, officerPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* System Interest Rates */}
                <div className="space-y-4 pb-4">
                  <h4 className="text-xs font-bold font-mono uppercase text-slate-400">5. System Interest Rates (% p.a.)</h4>
                  <p className="text-[11px] text-slate-400">Sliding these values dynamically shifts the standard rate shown across the Home views, EMI calculator, and newly created loan application calculations!</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between font-semibold">
                        <span>Personal Loan Rate</span>
                        <span className="text-teal-600 font-bold">{cmsForm.personalLoanRate}% p.a.</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="0.1" value={cmsForm.personalLoanRate}
                        onChange={(e) => setCmsForm({ ...cmsForm, personalLoanRate: Number(e.target.value) })}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between font-semibold">
                        <span>Business Loan Rate</span>
                        <span className="text-teal-600 font-bold">{cmsForm.businessLoanRate}% p.a.</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="0.1" value={cmsForm.businessLoanRate}
                        onChange={(e) => setCmsForm({ ...cmsForm, businessLoanRate: Number(e.target.value) })}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between font-semibold">
                        <span>Housing Finance Rate</span>
                        <span className="text-teal-600 font-bold">{cmsForm.homeLoanRate}% p.a.</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="0.1" value={cmsForm.homeLoanRate}
                        onChange={(e) => setCmsForm({ ...cmsForm, homeLoanRate: Number(e.target.value) })}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between font-semibold">
                        <span>Gold Asset Credit Rate</span>
                        <span className="text-teal-600 font-bold">{cmsForm.goldLoanRate}% p.a.</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="0.1" value={cmsForm.goldLoanRate}
                        onChange={(e) => setCmsForm({ ...cmsForm, goldLoanRate: Number(e.target.value) })}
                        className="w-full accent-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Floating Bar */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                    id="cms-save-btn"
                  >
                    <Save size={14} />
                    Commit CMS & Rates Changes
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* ================= 4. USER MANAGEMENT ================= */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-6" id="users-manager-panel">
              <div className="border-b border-slate-50 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Unified User Accounts</h3>
                  <p className="text-xs text-slate-400">Audit system registrations, roles, Aadhaar/KYC logins, and status.</p>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100" id="users-filters-row">
                
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200/60 rounded-lg pl-8 pr-4 py-1.5 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="bg-white border border-slate-200/60 rounded-lg px-2 py-1 text-xs focus:outline-hidden text-slate-600"
                  >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customer Only</option>
                    <option value="Employee">Employee Only</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white border border-slate-200/60 rounded-lg px-2 py-1 text-xs focus:outline-hidden text-slate-600"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                </div>

              </div>

              {/* Table of Users */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold">User ID</th>
                      <th className="pb-3 font-semibold">Customer / Name</th>
                      <th className="pb-3 font-semibold">Linked Email</th>
                      <th className="pb-3 font-semibold">Phone</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Joined Date</th>
                      <th className="pb-3 font-semibold">Operational Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="text-slate-700 hover:bg-slate-50/40">
                        <td className="py-3 font-mono font-bold text-slate-900">{u.id}</td>
                        <td className="py-3 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 font-mono">{u.email}</td>
                        <td className="py-3 font-mono">{u.phone}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            u.role === 'Admin' ? 'bg-rose-50 text-rose-700' : u.role === 'Employee' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{u.joinedDate}</td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            u.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-150 text-slate-500'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active')}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                              u.status === 'Active' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= 5. FINANCIAL REPORTS & ANALYTICS ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="reports-stats">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Gross Capital Disbursed</p>
                  <p className="text-xl sm:text-2xl font-display font-black text-slate-900">₹{(totalDisbursed / 10000000).toFixed(2)} Cr</p>
                  <span className="text-[9px] text-slate-400 block">+14% Growth from last Fiscal</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Portfolio Health Yield</p>
                  <p className="text-xl sm:text-2xl font-display font-black text-emerald-600">98.5% NPA-Free</p>
                  <span className="text-[9px] text-slate-400 block">Strict RBI Compliant Limit met</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Average Ticket Size</p>
                  <p className="text-xl sm:text-2xl font-display font-black text-slate-900">₹25.8 Lakhs</p>
                  <span className="text-[9px] text-slate-400 block">Driven heavily by Business loans</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Estimated Revenue Yield</p>
                  <p className="text-xl sm:text-2xl font-display font-black text-teal-600">₹2.45 Cr/mo</p>
                  <span className="text-[9px] text-slate-400 block">Accrued monthly EMI commitments</span>
                </div>
              </div>

              {/* Dual-Line Chart: volume vs interest */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-widest font-mono">
                    Lending Capital Volume vs Interest Accruals (Monthly Trends)
                  </h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="Business" stroke="#0d9488" strokeWidth={2} name="Business Term Volume" />
                      <Line type="monotone" dataKey="Home" stroke="#4f46e5" strokeWidth={2} name="Housing Mortgages Volume" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Geographic splits */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs" id="geographic-splits-panel">
                <div className="border-b border-slate-50 pb-3 mb-4">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Lending Capital Volume by City Split</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono text-center">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-slate-400">PUNE METRO</p>
                    <p className="text-lg font-bold text-slate-900">₹82.5 Cr</p>
                    <p className="text-[9px] text-slate-400">55% Portfolio Share</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-slate-400">MUMBAI REGION</p>
                    <p className="text-lg font-bold text-slate-900">₹45.0 Cr</p>
                    <p className="text-[9px] text-slate-400">30% Portfolio Share</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-slate-400">NASHIK DISTRICT</p>
                    <p className="text-lg font-bold text-slate-900">₹15.8 Cr</p>
                    <p className="text-[9px] text-slate-400">10% Portfolio Share</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-slate-400">THANE PERIPHERY</p>
                    <p className="text-lg font-bold text-slate-900">₹7.5 Cr</p>
                    <p className="text-[9px] text-slate-400">5% Portfolio Share</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Contact Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-teal-400" />
                <h3 className="font-display font-bold text-sm tracking-tight">Contact Message Details</h3>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Sender Name</p>
                  <p className="font-bold text-slate-850 text-xs mt-0.5">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Date Received</p>
                  <p className="font-mono text-slate-700 text-xs mt-0.5">{selectedMessage.date}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Email Address</p>
                  <p className="font-mono text-slate-700 text-xs mt-0.5 select-all">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Phone Number</p>
                  <p className="font-mono text-slate-700 text-xs mt-0.5 select-all">{selectedMessage.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Lending Interest</p>
                  <p className="mt-0.5">
                    <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                      {selectedMessage.loanTypeInterest}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Review Status</p>
                  <p className="mt-0.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      selectedMessage.status === 'Unread' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : selectedMessage.status === 'Read'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {selectedMessage.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider mb-1.5">Message Content</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              {selectedMessage.status !== 'Replied' ? (
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, 'Replied');
                    setSelectedMessage({ ...selectedMessage, status: 'Replied' });
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <Check size={14} />
                  <span>Mark Replied</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Marked as Replied</span>
                </div>
              )}

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Cropper Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image size={16} className="text-teal-400" />
                <h3 className="font-display font-bold text-sm tracking-tight">Crop Profile Photo</h3>
              </div>
              <button 
                onClick={() => setImageToCrop(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center">
              <p className="text-[11px] text-slate-500 text-center mb-4">
                Drag to pan the image, or adjust using the sliders below to center your photo perfectly inside the circle.
              </p>

              {/* Cropping Window (256x256) */}
              <div 
                className="w-64 h-64 border-2 border-slate-200 rounded-2xl overflow-hidden relative bg-slate-100 flex items-center justify-center select-none"
                style={{ cursor: isDraggingCrop ? 'grabbing' : 'grab' }}
                onMouseDown={(e) => {
                  setIsDraggingCrop(true);
                  setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
                }}
                onMouseMove={(e) => {
                  if (!isDraggingCrop) return;
                  setCropPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                  });
                }}
                onMouseUp={() => setIsDraggingCrop(false)}
                onMouseLeave={() => setIsDraggingCrop(false)}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    setIsDraggingCrop(true);
                    setDragStart({ 
                      x: e.touches[0].clientX - cropPosition.x, 
                      y: e.touches[0].clientY - cropPosition.y 
                    });
                  }
                }}
                onTouchMove={(e) => {
                  if (!isDraggingCrop || e.touches.length !== 1) return;
                  setCropPosition({
                    x: e.touches[0].clientX - dragStart.x,
                    y: e.touches[0].clientY - dragStart.y
                  });
                }}
                onTouchEnd={() => setIsDraggingCrop(false)}
              >
                {/* Scaled/Translated Image */}
                <img 
                  src={imageToCrop} 
                  alt="Original content" 
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  style={{
                    transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`,
                    transformOrigin: 'center'
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Circular Crop Guide Mask */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Surrounding darken overlay */}
                  <div className="absolute inset-0 bg-slate-900/40"></div>
                  {/* Punchout circle */}
                  <div className="w-48 h-48 rounded-full border-2 border-white bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.4)]"></div>
                </div>
              </div>

              {/* Controls */}
              <div className="w-full mt-6 space-y-4">
                {/* Zoom slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Zoom</span>
                    <span className="text-teal-600 font-bold">{Math.round(cropZoom * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    step="0.05" 
                    value={cropZoom}
                    onChange={(e) => setCropZoom(Number(e.target.value))}
                    className="w-full accent-teal-600 bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                {/* Horizontal / Vertical Position offsets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>Horizontal Pan</span>
                    </div>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      step="1" 
                      value={cropPosition.x}
                      onChange={(e) => setCropPosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                      className="w-full accent-slate-600 bg-slate-100 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>Vertical Pan</span>
                    </div>
                    <input 
                      type="range" 
                      min="-150" 
                      max="150" 
                      step="1" 
                      value={cropPosition.y}
                      onChange={(e) => setCropPosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                      className="w-full accent-slate-600 bg-slate-100 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                onClick={() => setImageToCrop(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const img = new window.Image();
                  img.src = imageToCrop;
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 256;
                    canvas.height = 256;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(0, 0, 256, 256);

                      ctx.translate(128 + cropPosition.x, 128 + cropPosition.y);
                      ctx.scale(cropZoom, cropZoom);

                      const imgWidth = img.naturalWidth || 1;
                      const imgHeight = img.naturalHeight || 1;
                      const ratio = Math.min(256 / imgWidth, 256 / imgHeight);
                      const drawWidth = imgWidth * ratio;
                      const drawHeight = imgHeight * ratio;

                      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

                      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
                      setCmsForm(prev => ({ ...prev, officerImage: croppedDataUrl }));
                      setImageToCrop(null);
                    }
                  };
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Check size={14} />
                <span>Crop & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Application Modal */}
      {isAddManualOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-teal-400" />
                <h3 className="font-display font-bold text-sm tracking-tight">Add Manual Loan Application</h3>
              </div>
              <button 
                onClick={() => setIsAddManualOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newAppForm.applicantName.trim()) {
                alert("Please enter applicant name.");
                return;
              }
              if (newAppForm.amount <= 0) {
                alert("Please enter a valid loan amount.");
                return;
              }
              if (newAppForm.tenure <= 0) {
                alert("Please enter a valid tenure.");
                return;
              }

              // Calculate monthly EMI
              const P = newAppForm.amount;
              const r = (newAppForm.interestRate / 12) / 100;
              const n = newAppForm.tenure * 12;
              const emiVal = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

              addApplication({
                applicantName: newAppForm.applicantName,
                loanType: newAppForm.loanType,
                amount: Number(newAppForm.amount),
                tenure: Number(newAppForm.tenure),
                purpose: newAppForm.purpose || `Manually entered ${newAppForm.loanType} loan file`,
                interestRate: Number(newAppForm.interestRate),
                monthlyEMI: isNaN(emiVal) || !isFinite(emiVal) ? 0 : emiVal,
                status: newAppForm.status
              });

              addActivity('Admin', `Manually created ${newAppForm.loanType} Loan for ${newAppForm.applicantName}`, 'success');
              setIsAddManualOpen(false);
            }}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Applicant Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600 block">Applicant Name</label>
                    <input
                      type="text"
                      required
                      value={newAppForm.applicantName}
                      onChange={(e) => setNewAppForm({ ...newAppForm, applicantName: e.target.value })}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  {/* Loan Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Loan Type</label>
                    <select
                      value={newAppForm.loanType}
                      onChange={(e) => {
                        const type = e.target.value as LoanType;
                        setNewAppForm({
                          ...newAppForm,
                          loanType: type,
                          interestRate: getRateForType(type)
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    >
                      <option value="Personal">Personal Loan</option>
                      <option value="Business">Business Loan</option>
                      <option value="Home">Home Loan</option>
                      <option value="Gold">Gold Loan</option>
                      <option value="Education">Education Loan</option>
                    </select>
                  </div>

                  {/* Account Status */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Initial Status</label>
                    <select
                      value={newAppForm.status}
                      onChange={(e) => setNewAppForm({ ...newAppForm, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    >
                      <option value="Pending">Pending Audit</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Disbursed">Disbursed (Ledger Sealed)</option>
                    </select>
                  </div>

                  {/* Principal Sum */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Principal Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={newAppForm.amount}
                      onChange={(e) => setNewAppForm({ ...newAppForm, amount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white font-mono"
                    />
                  </div>

                  {/* Tenure in Years */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Tenure (Years)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      value={newAppForm.tenure}
                      onChange={(e) => setNewAppForm({ ...newAppForm, tenure: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white font-mono"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Interest Rate (%)</label>
                    <input
                      type="number"
                      required
                      step="0.05"
                      min="0.1"
                      value={newAppForm.interestRate}
                      onChange={(e) => setNewAppForm({ ...newAppForm, interestRate: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white font-mono"
                    />
                  </div>

                  {/* Purpose */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600 block">Loan Purpose / Remarks</label>
                    <textarea
                      value={newAppForm.purpose}
                      onChange={(e) => setNewAppForm({ ...newAppForm, purpose: e.target.value })}
                      placeholder="e.g. Business expansion or capital investments"
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddManualOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Check size={14} />
                  <span>Create Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CMS Settings Save Success Modal */}
      {showCmsSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={24} />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-slate-900 text-base">Changes Saved Successfully!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your dynamic landing page text updates, contact details, and system interest rate modifications are now fully committed to the active site copy.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCmsSuccessModal(false)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                id="cms-success-ok-btn"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
