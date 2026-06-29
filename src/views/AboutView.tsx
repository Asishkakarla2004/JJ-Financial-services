import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, Eye, Heart, Shield, Award, Users, Target, ChevronLeft, ChevronRight, Quote, ArrowRight 
} from 'lucide-react';

interface AboutViewProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentTab }) => {
  const { cmsSettings } = useApp();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const coreValues = [
    {
      icon: <Shield className="text-teal-600" size={20} />,
      title: "Radical Integrity",
      desc: "We adhere strictly to RBI regulatory limits and ethical underwriting guidelines. We never compromise transparency for short term gains."
    },
    {
      icon: <Heart className="text-rose-600" size={20} />,
      title: "Absolute Client Empathy",
      desc: "Every loan application is backed by a human story. We construct flexible repayment models designed to fit custom seasonal income curves."
    },
    {
      icon: <Target className="text-indigo-600" size={20} />,
      title: "Digital Velocity",
      desc: "By combining automated credit API validations with senior human underwriter reviews, we deliver decisions in less than 48 hours."
    },
    {
      icon: <Award className="text-amber-600" size={20} />,
      title: "100% Fee Disclosures",
      desc: "No fine print. Every single tax, ledger folio charge, and pre-closure terms is declared in standard bold fonts prior to sign-off."
    }
  ];

  const clientReviews = [
    {
      name: "Amit Verma",
      role: "Founder, Verma Retail Outlets",
      quote: "JJ Financial Services enabled us to secure ₹25 Lakhs in less than 36 hours. Their collateral-free terms and direct underwriter reviews are incredibly professional. Our monthly revenue increased by 40% after the inventory expansion.",
      avatar: "AV",
      loanType: "Business Expansion Loan"
    },
    {
      name: "Priya Patel",
      role: "Homeowner, Premium Villa Project",
      quote: "We were struggling with standard banking documentation for our construction plot. John Anderson personally audited our cash flow structures and finalized our ₹60 Lakhs housing finance pre-approvals in 4 days. Exceptional customer care!",
      avatar: "PP",
      loanType: "Housing Finance"
    },
    {
      name: "Rohan Kapoor",
      role: "Partner, Kapoor Enterprises",
      quote: "The transparency is what stands out. Every ledger charge was declared upfront. No unannounced interest adjustments, no processing speed surprises. I highly recommend JJ Financial for premium corporate lines.",
      avatar: "RK",
      loanType: "Working Capital Credit"
    }
  ];

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % clientReviews.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + clientReviews.length) % clientReviews.length);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen view-enter" id="about-view-container">
      
      {/* 1. Header Hero */}
      <section className="bg-white border-b border-slate-100 py-16 text-center relative overflow-hidden" id="about-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-50/40 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            Our Journey & Story
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            From a tiny localized microfinance initiative in Pune to a premier licensed credit institution, JJ Financial has spent the last decade powering dreams and scaling businesses with absolute trust.
          </p>
        </div>
      </section>

      {/* 2. Brand Timeline Narrative */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-narrative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" 
              alt="JJ Financial Pune corporate headquarters" 
              className="rounded-3xl w-full object-cover aspect-[4/3] shadow-md border border-slate-100"
              referrerPolicy="no-referrer"
              id="about-hq-img"
            />
            <div className="absolute -bottom-5 -right-5 bg-teal-600 text-white p-5 rounded-2xl shadow-xl space-y-1 hidden sm:block">
              <p className="text-2xl font-display font-black">5+ Years</p>
              <p className="text-[10px] font-mono text-teal-100 uppercase tracking-wider">Lending Excellence</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-teal-600">
                <History size={18} className="stroke-[2.25]" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider">Milestones & Vision</span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-950 tracking-tight">
                Empowering Communities with Tailored Capital
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              JJ Financial Services is a trusted and client-focused financial lending company with over 5 years of proven excellence in the loan industry. Since our establishment, we have successfully served thousands of satisfied clients — helping individuals, families, and businesses achieve their financial goals through fast, flexible, and reliable loan solutions. Whether it's a home loan, personal loan, business loan, vehicle loan, or education loan, we offer customized financial products tailored to meet every unique need with ease and efficiency. 
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At JJ Financial Services, we believe that financial assistance should be simple, transparent, and accessible to all. Our team of experienced loan advisors ensures a smooth, hassle-free journey from the very first consultation to final disbursement — with competitive interest rates, quick approvals, and zero hidden charges. Your financial goals are our priority, and we are here to help you achieve them with integrity and trust.
            </p>

            {/* Sub Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100" id="about-stats-row">
              <div className="space-y-0.5">
                <p className="text-lg font-display font-black text-slate-900">Chirala, AP</p>
                <p className="text-[10px] text-slate-400 font-medium">Headquarters</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-display font-black text-slate-900">RBI NBFC</p>
                <p className="text-[10px] text-slate-400 font-medium">Registered Status</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-display font-black text-slate-900">₹1.5+ Cr</p>
                <p className="text-[10px] text-slate-400 font-medium">Lifetime Capital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Strategic Vision & Mission Details */}
      <section className="py-12 bg-white border-y border-slate-100" id="about-mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-2.5 text-teal-600">
                <Eye size={20} />
                <h3 className="font-display font-bold text-base text-slate-900">Our Strategic Vision</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {cmsSettings.visionText}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-2.5 text-teal-600">
                <Users size={20} />
                <h3 className="font-display font-bold text-base text-slate-900">Our Dedicated Mission</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {cmsSettings.missionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Corporate Values */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-values-section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-950 tracking-tight">
            Our Core Corporate Values
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            The guiding operational principles that drive our customer interactions and underwriting audits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-3 hover:border-teal-200 transition-colors">
              <div className="p-2.5 bg-slate-50 rounded-xl w-fit">
                {val.icon}
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">{val.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Client Testimonials Carousel */}
      <section className="py-12 bg-slate-900 text-white relative overflow-hidden" id="testimonials-carousel-section">
        <div className="absolute left-1/4 top-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400 font-bold block">
              Customer Testimonials
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              What Our Clients Say
            </h2>
          </div>

          {/* Testimonial Active Card */}
          <div className="bg-slate-850/80 border border-slate-800 p-8 sm:p-10 rounded-3xl relative shadow-2xl max-w-2xl mx-auto space-y-6">
            <Quote size={32} className="text-teal-400/20 absolute -top-4 -left-4" />
            
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              "{clientReviews[activeReviewIndex].quote}"
            </p>

            <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-display font-bold text-xs">
                {clientReviews[activeReviewIndex].avatar}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-white">{clientReviews[activeReviewIndex].name}</h4>
                <p className="text-[10px] text-slate-400">{clientReviews[activeReviewIndex].role}</p>
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-teal-400 font-mono text-[9px] rounded-md uppercase">
                {clientReviews[activeReviewIndex].loanType}
              </span>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrevReview}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 transition-colors cursor-pointer"
                id="testimonial-prev-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {clientReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReviewIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeReviewIndex === i ? 'bg-teal-400 w-4' : 'bg-slate-700'}`}
                  ></button>
                ))}
              </div>
              <button
                onClick={handleNextReview}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 transition-colors cursor-pointer"
                id="testimonial-next-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Callout */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="about-cta">
        <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-xl sm:text-3xl text-white tracking-tight">
              Ready to accelerate your financial goals?
            </h2>
            <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
              Connect with our credit underwriting team today. We provide upfront loan feasibility estimates and rate parameters within hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('contact')}
                className="w-full sm:w-auto px-6 py-3 bg-white text-teal-700 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                id="about-cta-advisor-btn"
              >
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
