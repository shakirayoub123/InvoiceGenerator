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
                            <img src={appLogo} alt="Company Logo" style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.8)', transformOrigin: 'left center' }} />
                        ) : (
                            <img src="/White final MWS Logo.png" alt="Mir Web Solutions" style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left center', display: 'block', transform: 'scale(1.8)', transformOrigin: 'left center' }} className="drop-shadow-sm opacity-95" />
                        )}
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-extrabold ml-auto">
                        <Link to="/" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all">Home</Link>

                        <Link to="/referral" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all">Submit a Referral</Link>
                        <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

                        <Link to="/login" className="hidden sm:flex items-center justify-center px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 shadow-sm transition-all focus:ring-4 focus:ring-blue-50">Admin Login</Link>

                        <a href="https://mirwebsolutions.com/" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-full shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5">
                            Agency Site <ChevronRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content (Injected Pages) */}
            {children}

            {/* Modern Detailed Footer */}
            <footer className="bg-[#0b1120] text-slate-300 py-16 mt-auto relative z-10 print:hidden relative overflow-hidden">
                {/* Subtle footer gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-50"></div>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1 pr-6">
                            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-white mb-4">
                                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                MIR<span className="text-blue-500 font-light">Systems</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-xs mb-6 max-w-[200px]">
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

                    <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                        <p>&copy; {new Date().getFullYear()} Mir Web Solutions. All Rights Reserved.</p>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
