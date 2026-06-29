export type LoanType = 'Personal' | 'Business' | 'Home' | 'Gold' | 'Education';

export interface LoanApplication {
  id: string;
  applicantName: string;
  loanType: LoanType;
  amount: number;
  tenure: number; // in years
  status: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed';
  date: string;
  purpose: string;
  interestRate: number;
  monthlyEMI: number;
  progress: number; // percentage (e.g. 20, 40, 60, 80, 100)
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  loanTypeInterest: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Admin' | 'Employee';
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export interface CmsSettings {
  heroTitle: string;
  heroSubtitle: string;
  visionText: string;
  missionText: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  personalLoanRate: number;
  businessLoanRate: number;
  homeLoanRate: number;
  goldLoanRate: number;
  educationLoanRate: number;
  officerName: string;
  officerRole: string;
  officerImage: string;
  officerPhone: string;
}

export interface SystemActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}
