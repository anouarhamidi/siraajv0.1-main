import { Briefcase, Users, Search, TrendingUp, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: (userType: 'graduate' | 'employer') => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="fixed bg-gradient-to-br from-[#38b6ff]/5 top-0 left-0 right-0 z-50 backdrop-blur-md border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-40 h-10 rounded-xl flex items-center justify-center">
                <img src="siraag-logo.svg" alt="" />
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-[#38b6ff] transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-[#38b6ff] transition-colors font-medium">
                How It Works
              </a>
              <a href="#about" className="hover:text-[#38b6ff] transition-colors font-medium">
                About
              </a>
            </nav>
            <button
                  onClick={() => onGetStarted('graduate')}
                  className="group w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-xl font-semibold shadow-md shadow-[#38b6ff]/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-1"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
          </div>
          
        </div>
      </header>

      <main className="pt-10">
        <section className="back-logo relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#38b6ff]/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-[#38b6ff]/10 px-4 py-2 rounded-full mb-8">
                <TrendingUp className="w-4 h-4 text-[#38b6ff]" />
                <span className="text-sm font-medium text-[#38b6ff]">Connecting Talent with Opportunity</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Launch Your Career
                <span className="block mt-2 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-transparent bg-clip-text">
                  Find Your Dream Job
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                <strong className='bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-transparent bg-clip-text'>SIRAAJ</strong> bridges the gap between fresh graduates and top enterprises, making it easier than ever to find <strong className='bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-transparent bg-clip-text'>local entry-level</strong> opportunities.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onGetStarted('graduate')}
                  className="group w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-xl font-semibold shadow-lg shadow-[#38b6ff]/30 hover:shadow-xl hover:shadow-[#38b6ff]/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#38b6ff] mb-1">500+</div>
                  <div className="text-sm text-slate-600">Active Jobs</div>
                </div>
                <div className="text-center border-x border-slate-200">
                  <div className="text-3xl font-bold text-[#38b6ff] mb-1">200+</div>
                  <div className="text-sm text-slate-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#38b6ff] mb-1">1000+</div>
                  <div className="text-sm text-slate-600">Graduates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Siraaj?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                We provide everything you need to succeed in your job search or talent acquisition
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: 'Smart Job Matching',
                  description: 'Our intelligent system matches graduates with relevant opportunities based on skills and preferences.',
                },
                {
                  icon: Users,
                  title: 'Local Focus',
                  description: 'Find opportunities in your area. We connect you with local businesses looking for fresh talent.',
                },
                {
                  icon: Briefcase,
                  title: 'Entry-Level Friendly',
                  description: 'All listings are specifically curated for fresh graduates and entry-level positions.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    hoveredFeature === index
                      ? 'border-[#38b6ff] shadow-xl shadow-[#38b6ff]/10 -translate-y-1'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      hoveredFeature === index
                        ? 'bg-gradient-to-br from-[#38b6ff] to-[#2a8fd9] scale-110'
                        : 'bg-slate-100'
                    }`}
                  >
                    <feature.icon
                      className={`w-7 h-7 transition-colors ${
                        hoveredFeature === index ? 'text-white' : 'text-[#38b6ff]'
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600">Three simple steps to success</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile in minutes' },
                { step: '02', title: 'Browse or Post Jobs', desc: 'Graduates browse opportunities, employers post openings' },
                { step: '03', title: 'Connect & Hire', desc: 'Apply to jobs or review applications and start working together' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-6xl font-bold text-[#38b6ff]/20 mb-4">{item.step}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                    <CheckCircle className="w-8 h-8 text-[#38b6ff] mt-4" />
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#38b6ff] to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-10 text-white/90">
              Join thousands of graduates and employers already using Siraaj
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onGetStarted('graduate')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#38b6ff] rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Sign Up as Graduate
              </button>
              <button
                onClick={() => onGetStarted('employer')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Sign Up as Employer
              </button>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="logo-img rounded-lg from-[#38b6ff] to-[#2a8fd9] flex items-center justify-center">
                  <img src="siraag-logo-W.svg" alt="" />
                </div>
              </div>
              <p className="text-sm">© 2024 Siraaj. Connecting graduates with opportunities.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
