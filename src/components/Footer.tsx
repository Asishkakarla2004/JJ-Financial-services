import React, { useState } from 'react';
import { Landmark, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { cmsSettings } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" id="footer-section">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500 rounded-lg text-white">
                <Landmark size={18} />
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                JJ Financial Services
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering people and small businesses since 2020. Providing tailored capital, gold credits, home construction plans, and individual micro-loans with maximum speed and absolute integrity.
            </p>
            <div className="text-[10px] font-mono tracking-widest text-teal-400">
              LICENSED NBFC • RBI APPROVED
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
              Loan Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Personal Loans
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Business Term Loans
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Housing Finance
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Gold & Asset Credits
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
              Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Our Journey & Story
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('stories')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Loan Success Stories
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Help & Contact Us
                </button>
              </li>
              <li>
                <span className="text-slate-600">Privacy Policy & Disclosures</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-normal">
                  {cmsSettings.contactAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-teal-500" />
                <span className="text-slate-400">{cmsSettings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-teal-500" />
                <span className="text-slate-400">{cmsSettings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} JJ Financial Services Private Limited. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Corporate Identity Number (CIN): U65923PN2012PTC144321</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
