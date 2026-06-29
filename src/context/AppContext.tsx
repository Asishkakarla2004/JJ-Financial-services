import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoanApplication, ContactMessage, User, CmsSettings, SystemActivity, LoanType } from '../types';

interface AppContextType {
  applications: LoanApplication[];
  messages: ContactMessage[];
  users: User[];
  cmsSettings: CmsSettings;
  activities: SystemActivity[];
  currentRole: 'Guest' | 'Customer' | 'Admin';
  // Actions
  addApplication: (app: Omit<LoanApplication, 'id' | 'date' | 'progress'>) => void;
  updateApplicationStatus: (id: string, status: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed') => void;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: 'Unread' | 'Read' | 'Replied') => void;
  addUser: (user: Omit<User, 'id' | 'joinedDate'>) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Inactive') => void;
  updateCmsSettings: (settings: CmsSettings) => void;
  switchRole: (role: 'Guest' | 'Customer' | 'Admin') => void;
  addActivity: (user: string, action: string, type: 'success' | 'warning' | 'info') => void;
  resetAllData: () => void;
}

const initialApplications: LoanApplication[] = [
  {
    id: 'L-1001',
    applicantName: 'Rohan Sharma',
    loanType: 'Business',
    amount: 2500000,
    tenure: 5,
    status: 'Pending',
    date: '2026-06-26',
    purpose: 'Business Expansion & Technology Upgrade',
    interestRate: 12.0,
    monthlyEMI: 55611,
    progress: 40, // Underwriting stage
  },
  {
    id: 'L-1002',
    applicantName: 'Rohan Sharma',
    loanType: 'Home',
    amount: 4500000,
    tenure: 15,
    status: 'Disbursed',
    date: '2025-08-10',
    purpose: 'Residential Flat Purchase',
    interestRate: 8.4,
    monthlyEMI: 44031,
    progress: 100, // Fully disbursed
  },
  {
    id: 'L-1003',
    applicantName: 'Arun Sharma',
    loanType: 'Personal',
    amount: 500000,
    tenure: 3,
    status: 'Disbursed',
    date: '2026-02-14',
    purpose: 'Medical Expenses & Family Wedding',
    interestRate: 10.5,
    monthlyEMI: 16253,
    progress: 100,
  },
  {
    id: 'L-1004',
    applicantName: 'Priya Patel',
    loanType: 'Home',
    amount: 6000000,
    tenure: 20,
    status: 'Disbursed',
    date: '2025-11-05',
    purpose: 'Premium Villa Construction',
    interestRate: 8.4,
    monthlyEMI: 51694,
    progress: 100,
  },
  {
    id: 'L-1005',
    applicantName: 'Rohan Kapoor',
    loanType: 'Gold',
    amount: 1200000,
    tenure: 2,
    status: 'Rejected',
    date: '2026-04-18',
    purpose: 'Immediate Cash Requirement',
    interestRate: 9.0,
    monthlyEMI: 54812,
    progress: 100,
  },
  {
    id: 'L-1006',
    applicantName: 'Vikram Singh',
    loanType: 'Business',
    amount: 1500000,
    tenure: 3,
    status: 'Approved',
    date: '2026-06-25',
    purpose: 'Inventory Purchase & Working Capital',
    interestRate: 12.0,
    monthlyEMI: 49821,
    progress: 80, // Awaiting Disbursement
  }
];

const initialMessages: ContactMessage[] = [
  {
    id: 'MSG-001',
    name: 'Amit Verma',
    email: 'amit@example.com',
    phone: '+91 98765 43210',
    loanTypeInterest: 'Business Loan',
    message: 'Looking to expand my small retail shop. Need details on flexible repayment plans and collateral requirements.',
    date: '2026-06-25',
    status: 'Unread'
  },
  {
    id: 'MSG-002',
    name: 'Sunita Rao',
    email: 'sunita@example.com',
    phone: '+91 87654 32109',
    loanTypeInterest: 'Home Loan',
    message: 'What is the standard pre-approval timeline for home loans? I have shortlisted a flat in Pune and want to make an offer quickly.',
    date: '2026-06-27',
    status: 'Unread'
  },
  {
    id: 'MSG-003',
    name: 'Rahul Roy',
    email: 'rahul.roy@example.com',
    phone: '+91 76543 21098',
    loanTypeInterest: 'Personal Loan',
    message: 'I am interested in a personal loan of ₹3,00,000 for home renovation. Can I pre-close the loan without any penalty?',
    date: '2026-06-24',
    status: 'Replied'
  }
];

const initialUsers: User[] = [
  { id: 'U-001', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '+91 99999 88888', role: 'Customer', status: 'Active', joinedDate: '2025-08-01' },
  { id: 'U-002', name: 'Arun Sharma', email: 'arun.sharma@example.com', phone: '+91 91234 56789', role: 'Customer', status: 'Active', joinedDate: '2026-01-12' },
  { id: 'U-003', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 92345 67890', role: 'Customer', status: 'Active', joinedDate: '2025-03-04' },
  { id: 'U-004', name: 'Rohan Kapoor', email: 'rohan.kapoor@example.com', phone: '+91 93456 78901', role: 'Customer', status: 'Inactive', joinedDate: '2025-05-20' },
  { id: 'U-005', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 94567 89012', role: 'Customer', status: 'Active', joinedDate: '2026-06-15' },
  { id: 'U-006', name: 'John Anderson', email: 'john.a@jjfinancial.com', phone: '+91 95678 90123', role: 'Employee', status: 'Active', joinedDate: '2024-11-01' }
];

const defaultCmsSettings: CmsSettings = {
  heroTitle: 'Fast, Secure, and Trusted Loan Solutions',
  heroSubtitle: 'Empowering your financial dreams with tailored credit options, transparent processing, and competitive interest rates for all your life goals.',
  visionText: 'To be the most trusted financial partner in India, known for innovation, speed, and unwavering commitment to customer success.',
  missionText: 'To provide accessible and ethical financial services that bridge the gap between aspirations and reality for every Indian citizen.',
  contactAddress: 'Chirala,Ap-523155',
  contactEmail: 'svraokakarla@gmail.com',
  contactPhone: '+91 9440266550',
  personalLoanRate: 10.5,
  businessLoanRate: 12.0,
  homeLoanRate: 8.5,
  goldLoanRate: 9.0,
  educationLoanRate: 7.5,
  officerName: 'John Anderson',
  officerRole: 'Senior Loan Officer',
  officerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCofvg1fK3PfdSu1p1g-HZZBkIwBm8l_43oVoM7oG-xbXCdhbpOn5P44Dw8BQ0hjCLL7SHtHQZqC-dOFRlE-WgRSs8uL3AyWOZG2P1RwR6EGEZt3YaYX02mSjBSi-7ZfESQgQzE5MkSwc0MNHOuHam1-wCCaDNOlbURWbiE8s6LPMxU3YEbtWp6inxghmSQusFco32zDt__gDXbev8Rs170otWC2u0qwv9mmHKhD5emk0i2wVWhCODcF4PSjQ_LsMCFWvsDhQdx9cdu',
  officerPhone: '+91 95678 90123'
};

const initialActivities: SystemActivity[] = [
  { id: 'ACT-001', user: 'Rohan Sharma', action: 'Applied for a new Business Expansion Loan (₹25,00,000)', time: '2 hours ago', type: 'info' },
  { id: 'ACT-002', user: 'Admin', action: 'Approved Vikram Singh\'s Business Loan (₹15,00,000)', time: '3 hours ago', type: 'success' },
  { id: 'ACT-003', user: 'System', action: 'Disbursed Priya Patel\'s Home Loan (₹60,00,000)', time: '1 day ago', type: 'success' },
  { id: 'ACT-004', user: 'Rohan Kapoor', action: 'Gold Loan application was rejected due to credit rating criteria', time: '2 days ago', type: 'warning' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    const saved = localStorage.getItem('jj_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('jj_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jj_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [cmsSettings, setCmsSettings] = useState<CmsSettings>(() => {
    const saved = localStorage.getItem('jj_cms_settings');
    if (saved) {
      try {
        return { ...defaultCmsSettings, ...JSON.parse(saved) };
      } catch (e) {
        return defaultCmsSettings;
      }
    }
    return defaultCmsSettings;
  });

  const [activities, setActivities] = useState<SystemActivity[]>(() => {
    const saved = localStorage.getItem('jj_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [currentRole, setCurrentRole] = useState<'Guest' | 'Customer' | 'Admin'>(() => {
    const saved = localStorage.getItem('jj_current_role');
    return (saved as any) || 'Guest';
  });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('jj_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('jj_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('jj_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jj_cms_settings', JSON.stringify(cmsSettings));
  }, [cmsSettings]);

  useEffect(() => {
    localStorage.setItem('jj_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('jj_current_role', currentRole);
  }, [currentRole]);

  // Actions implementation
  const addApplication = (app: Omit<LoanApplication, 'id' | 'date' | 'progress'>) => {
    const newId = `L-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    const newApp: LoanApplication = {
      ...app,
      id: newId,
      date: today,
      progress: 20, // Initial stage: "Submitted"
    };

    setApplications((prev) => [newApp, ...prev]);
    addActivity(app.applicantName, `Applied for a new ${app.loanType} Loan (₹${app.amount.toLocaleString('en-IN')})`, 'info');
  };

  const updateApplicationStatus = (id: string, status: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          let progress = app.progress;
          if (status === 'Pending') progress = 40;
          if (status === 'Approved') progress = 80;
          if (status === 'Disbursed') progress = 100;
          if (status === 'Rejected') progress = 100;

          return { ...app, status, progress };
        }
        return app;
      })
    );

    const appObj = applications.find((a) => a.id === id);
    if (appObj) {
      const typeStr = status === 'Approved' ? 'success' : status === 'Rejected' ? 'warning' : 'success';
      addActivity('Admin', `Updated ${appObj.applicantName}'s Loan ${appObj.id} status to ${status}`, typeStr);
    }
  };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newId = `MSG-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const newMsg: ContactMessage = {
      ...msg,
      id: newId,
      date: today,
      status: 'Unread',
    };

    setMessages((prev) => [newMsg, ...prev]);
    addActivity(msg.name, `Sent a message via contact form regarding ${msg.loanTypeInterest}`, 'info');
  };

  const updateMessageStatus = (id: string, status: 'Unread' | 'Read' | 'Replied') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const addUser = (user: Omit<User, 'id' | 'joinedDate'>) => {
    const newId = `U-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const newUser: User = {
      ...user,
      id: newId,
      joinedDate: today,
    };

    setUsers((prev) => [...prev, newUser]);
    addActivity('Admin', `Created new user account for ${user.name} (${user.role})`, 'success');
  };

  const updateUserStatus = (id: string, status: 'Active' | 'Inactive') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    const targetUser = users.find(u => u.id === id);
    if (targetUser) {
      addActivity('Admin', `Set status of ${targetUser.name} to ${status}`, 'info');
    }
  };

  const updateCmsSettings = (settings: CmsSettings) => {
    setCmsSettings(settings);
    addActivity('Admin', `Updated system CMS and loan interest rates`, 'success');
  };

  const switchRole = (role: 'Guest' | 'Customer' | 'Admin') => {
    setCurrentRole(role);
  };

  const addActivity = (user: string, action: string, type: 'success' | 'warning' | 'info') => {
    const newAct: SystemActivity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      user,
      action,
      time: 'Just now',
      type,
    };
    setActivities((prev) => [newAct, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  const resetAllData = () => {
    localStorage.removeItem('jj_applications');
    localStorage.removeItem('jj_messages');
    localStorage.removeItem('jj_users');
    localStorage.removeItem('jj_cms_settings');
    localStorage.removeItem('jj_activities');
    localStorage.removeItem('jj_current_role');

    setApplications(initialApplications);
    setMessages(initialMessages);
    setUsers(initialUsers);
    setCmsSettings(defaultCmsSettings);
    setActivities(initialActivities);
    setCurrentRole('Guest');
    addActivity('System', 'All app data reset to factory defaults', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        messages,
        users,
        cmsSettings,
        activities,
        currentRole,
        addApplication,
        updateApplicationStatus,
        addMessage,
        updateMessageStatus,
        addUser,
        updateUserStatus,
        updateCmsSettings,
        switchRole,
        addActivity,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
