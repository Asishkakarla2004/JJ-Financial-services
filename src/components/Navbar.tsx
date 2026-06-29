import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, User as UserIcon, ShieldAlert, LogOut, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentRole, switchRole } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'stories', label: 'Success Stories' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleRoleSwitch = (role: 'Guest' | 'Customer' | 'Admin') => {
    switchRole(role);
    setDropdownOpen(false);
    if (role === 'Customer') {
      setCurrentTab('customer-dashboard');
    } else if (role === 'Admin') {
      setCurrentTab('admin-dashboard');
    } else {
      setCurrentTab('home');
    }
  };

  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'Admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Customer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs" id="main-navigation-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => { setCurrentTab('home'); switchRole('Guest'); }}
              className="flex items-center gap-2.5 cursor-pointer group text-left"
              id="brand-logo-btn"
            >
              <div className="p-2 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl text-white shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform">
                <Landmark size={20} className="stroke-[2.25]" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                  JJ Financial
                </span>
                <span className="text-[10px] font-mono tracking-widest text-teal-600 block uppercase">
                  Services
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // If switching to public tabs, set role to Guest to allow easy browsing,
                    // unless they are logged in and want to browse public pages. We can keep their role.
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-teal-600 bg-teal-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Role & Quick Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick dashboard shortcuts if logged in */}
            {currentRole === 'Customer' && currentTab !== 'customer-dashboard' && (
              <button
                onClick={() => setCurrentTab('customer-dashboard')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                id="quick-customer-dash-btn"
              >
                Go to My Dashboard
                <ArrowRight size={12} />
              </button>
            )}
            {currentRole === 'Admin' && currentTab !== 'admin-dashboard' && (
              <button
                onClick={() => setCurrentTab('admin-dashboard')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                id="quick-admin-dash-btn"
              >
                Go to Admin Panel
                <ArrowRight size={12} />
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer ${getRoleBadgeColor()}`}
                id="role-dropdown-toggle"
              >
                {currentRole === 'Admin' && <ShieldAlert size={14} className="text-rose-600" />}
                {currentRole === 'Customer' && <UserIcon size={14} className="text-emerald-600" />}
                {currentRole === 'Guest' && <UserIcon size={14} className="text-slate-500" />}
                <span>
                  {currentRole === 'Admin' ? 'Admin Portal' : currentRole === 'Customer' ? 'Rohan Sharma' : 'Client Mode'}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200" id="role-dropdown-menu">
                  <div className="px-3 py-1 border-b border-slate-50 mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Select Role (Demo Switcher)
                    </span>
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('Guest')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${currentRole === 'Guest' ? 'font-semibold text-teal-600' : 'text-slate-700'}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <div>
                      <p className="font-medium">Guest Visitor</p>
                      <p className="text-[10px] text-slate-400">Browse landing pages</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('Customer')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50/50 transition-colors cursor-pointer ${currentRole === 'Customer' ? 'font-semibold text-emerald-600' : 'text-slate-700'}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="font-medium">Rohan Sharma (Customer)</p>
                      <p className="text-[10px] text-slate-400">Apply for loans & check status</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('Admin')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-rose-50/50 transition-colors cursor-pointer ${currentRole === 'Admin' ? 'font-semibold text-rose-600' : 'text-slate-700'}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div>
                      <p className="font-medium">System Administrator</p>
                      <p className="text-[10px] text-slate-400">Manage loans, CMS & Reports</p>
                    </div>
                  </button>
                  {currentRole !== 'Guest' && (
                    <button
                      onClick={() => handleRoleSwitch('Guest')}
                      className="w-full text-left px-3.5 py-2 text-xs border-t border-slate-100 text-rose-600 font-semibold hover:bg-rose-50/50 flex items-center gap-2 cursor-pointer mt-1"
                    >
                      <LogOut size={13} />
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 pt-2 pb-4 space-y-1.5 shadow-lg" id="mobile-nav-menu">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${
                currentTab === item.id
                  ? 'bg-teal-50 text-teal-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block px-4">
              Demo Identity
            </span>
            <div className="grid grid-cols-3 gap-1 px-2">
              <button
                onClick={() => { handleRoleSwitch('Guest'); setMobileMenuOpen(false); }}
                className={`py-1.5 text-[11px] font-medium border rounded-lg text-center cursor-pointer ${currentRole === 'Guest' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700'}`}
              >
                Guest
              </button>
              <button
                onClick={() => { handleRoleSwitch('Customer'); setMobileMenuOpen(false); }}
                className={`py-1.5 text-[11px] font-medium border rounded-lg text-center cursor-pointer ${currentRole === 'Customer' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'}`}
              >
                Customer
              </button>
              <button
                onClick={() => { handleRoleSwitch('Admin'); setMobileMenuOpen(false); }}
                className={`py-1.5 text-[11px] font-medium border rounded-lg text-center cursor-pointer ${currentRole === 'Admin' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
