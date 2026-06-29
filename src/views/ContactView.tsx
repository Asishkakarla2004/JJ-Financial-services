import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoanType } from '../types';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, 
  HelpCircle, ChevronDown, ChevronUp, UserCheck, MessageSquare 
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { cmsSettings, addMessage } = useApp();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loanTypeInterest: 'Business Loan' as string,
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: "Where is the main corporate headquarters located?",
      a: "Our central corporate headquarters is located at JJ Towers, Suite 402, Senapati Bapat Road, Pune, Maharashtra 411016. Visitors are welcome from Monday to Friday, 9:30 AM to 6:00 PM."
    },
    {
      q: "How fast will an executive reach out to me after submitting a message?",
      a: "Our lending advisors review incoming contact submissions in real-time. You can expect a direct phone call or email follow-up in less than 2 business hours."
    },
    {
      q: "Can I discuss customized mortgage options or collateral swaps?",
      a: "Absolutely! For customized corporate term loans, mortgage swap assessments, or high-value gold loans, we recommend indicating 'Business Loan' or 'Home Loan' in the contact form, and our Senior Underwriter will schedule a private consultation."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your inquiry message.');
      return;
    }

    // Call shared action
    addMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      loanTypeInterest: formData.loanTypeInterest,
      message: formData.message
    });

    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      loanTypeInterest: 'Business Loan',
      message: ''
    });

    // Reset feedback after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 view-enter" id="contact-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Real-time Support & Inquiries
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Have queries regarding capital limits, gold valuation multipliers, or active repayment files? Write to us, and our senior lending advisors will call you within 2 hours.
          </p>
        </div>

        {/* Main Content Form + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details & Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Info Cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-6">
              <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-widest font-mono border-b border-slate-50 pb-3">
                Corporate Headquarters
              </h3>
              
              <ul className="space-y-4 text-xs">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-850">Pune Office Address</p>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      {cmsSettings.contactAddress}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-850">Telephone Hotline</p>
                    <p className="font-mono text-slate-500 mt-0.5">{cmsSettings.contactPhone}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mon to Fri, 9:30 AM to 6:00 PM</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-850">Official Email Channels</p>
                    <p className="font-mono text-slate-500 mt-0.5">{cmsSettings.contactEmail}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">For general documents, interest adjustments, pre-approvals</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Direct Loan Officer Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-md border border-slate-800">
              <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-teal-500/20 shrink-0 bg-slate-800">
                  <img 
                    src={cmsSettings.officerImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCofvg1fK3PfdSu1p1g-HZZBkIwBm8l_43oVoM7oG-xbXCdhbpOn5P44Dw8BQ0hjCLL7SHtHQZqC-dOFRlE-WgRSs8uL3AyWOZG2P1RwR6EGEZt3YaYX02mSjBSi-7ZfESQgQzE5MkSwc0MNHOuHam1-wCCaDNOlbURWbiE8s6LPMxU3YEbtWp6inxghmSQusFco32zDt__gDXbev8Rs170otWC2u0qwv9mmHKhD5emk0i2wVWhCODcF4PSjQ_LsMCFWvsDhQdx9cdu"}
                    alt={cmsSettings.officerName || "John Anderson"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-teal-400 uppercase tracking-wider">Direct Liaison</h4>
                  <p className="text-xs text-white font-semibold mt-0.5">
                    {cmsSettings.officerName || 'John Anderson'}
                  </p>
                  <p className="text-[10px] text-teal-300 font-medium mt-0.5">{cmsSettings.officerRole || 'Senior Loan Officer'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Mobile hotline: {cmsSettings.officerPhone || '+91 95678 90123'}</p>
                </div>
              </div>
            </div>



          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6" id="contact-form-card">
            <div className="space-y-1.5 border-b border-slate-50 pb-3">
              <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-teal-600" />
                Submit an Inquiry
              </h2>
              <p className="text-xs text-slate-500">
                Provide your active credentials and financial requirements. Our underwriting executives will contact you.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3 text-center" id="form-success-feedback">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900">Inquiry Received Successfully!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Thank you for writing to us. We have queued your request in our central message ledger. Switch your role to **System Admin** via the Navbar dropdown and click **Customer Messages** to see your submission live!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="inquiry-form">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. amit@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Contact Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">Select Loan Interest</label>
                    <select
                      value={formData.loanTypeInterest}
                      onChange={(e) => setFormData({ ...formData, loanTypeInterest: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    >
                      <option value="Business Loan">Business Term Loan</option>
                      <option value="Personal Loan">Personal Micro-Credit</option>
                      <option value="Home Loan">Housing Mortgage Finance</option>
                      <option value="Gold Loan">Liquid Gold Credit</option>
                      <option value="Education Loan">Global Degree Student Credit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 block">Message Details</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details of your business project, gold weight, or required mortgage moratorium parameters..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                  id="inquiry-submit-btn"
                >
                  Submit Message Securely
                  <Send size={13} />
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Support FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-4 pt-4" id="contact-faq">
          <div className="text-center mb-6">
            <h2 className="font-display font-extrabold text-lg text-slate-950 flex items-center justify-center gap-1.5">
              <HelpCircle size={18} className="text-teal-600" />
              Contact Desk Support FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = faqOpen[i];
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-3xs overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold text-xs text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    id={`contact-faq-toggle-${i}`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-teal-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/20" id={`contact-faq-answer-${i}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
