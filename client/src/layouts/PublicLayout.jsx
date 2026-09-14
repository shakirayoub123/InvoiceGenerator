import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { SettingsContext } from '../contexts/SettingsContext';

const PublicLayout = ({ children }) => {
    const { appLogo } = useContext(SettingsContext);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col relative selection:bg-mir-blue selection:text-white print:bg-white print:min-h-0 print:h-auto print:block hide-on-print-wrapper relative">

            {/* SaaS Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute top-[60%] left-[20%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Enterprise Navbar */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all print:hidden h-20 flex flex-col justify-center">
                <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <Link to="/" className="flex items-center" style={{ width: '220px', height: '60px' }}>
                        {appLogo ? (
                            <img src={appLogo} alt="Mir Web Solutions" style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.8)', transformOrigin: 'left center' }} />
                        ) : (
                            <img src="/White final MWS Logo.png" alt="Mir Web Solutions" style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.8)', transformOrigin: 'left center' }} className="drop-shadow-sm opacity-95" />
                        )}
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-extrabold ml-auto">
                        <Link to="/" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all">Home</Link>
                        <Link to="/referral" className="flex items-center justify-center px-3 md:px-5 py-2 md:py-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all">Referral</Link>
                        <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>
                        <Link to="/login" className="flex items-center justify-center px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-600 shadow-sm transition-all">Admin</Link>
                        <a href="https://mirwebsolutions.com/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-black transition-all hover:-translate-y-0.5 ml-2">
                            Agency Site <ChevronRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content (Injected Pages) */}
            {children}

            {/* Modern Detailed Footer */}
            <footer className="bg-[#0b1120] text-slate-300 py-4 mt-auto relative z-10 print:hidden overflow-hidden">
                {/* Subtle footer gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-50"></div>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 border-t border-slate-800 pt-6 pb-2 text-center lg:text-left">
                        <div className="sm:col-span-2 lg:col-span-2 pr-0 lg:pr-12 flex flex-col items-center lg:items-start">
                            <div className="flex items-center gap-2 mb-4" style={{ height: '40px' }}>
                                {appLogo ? (
                                    <img src={appLogo} alt="Mir Web Solutions" style={{ height: '100%', width: 'auto', maxWidth: '200px', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.5)', transformOrigin: 'left center' }} />
                                ) : (
                                    <img src="/White final MWS Logo.png" alt="Mir Web Solutions" style={{ height: '100%', width: 'auto', maxWidth: '200px', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.5)', transformOrigin: 'left center' }} className="drop-shadow-sm opacity-90" />
                                )}
                            </div>
                            <p className="text-slate-400 leading-relaxed text-xs mb-6 max-w-[200px] mt-2">
                                Empowering modern businesses with enterprise-grade SaaS tools and digital transformation services.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Product</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Invoice Generator</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Company</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Legal</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500 text-center">
                        <p>&copy; {new Date().getFullYear()} Mir Web Solutions. All Rights Reserved.</p>

                        <div className="flex flex-wrap justify-center items-center gap-3">
                            <a href="https://www.facebook.com/mirwebsolutions" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="https://twitter.com/mirwebsolutions" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:-translate-y-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/company/mirwebsolutions/" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="https://www.instagram.com/mirwebsolutions/" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-[#E4405F] hover:text-white transition-all transform hover:-translate-y-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://www.youtube.com/channel/UCQz1vnF8u7_Kyxbqr1HeuYw" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-[#FF0000] hover:text-white transition-all transform hover:-translate-y-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
