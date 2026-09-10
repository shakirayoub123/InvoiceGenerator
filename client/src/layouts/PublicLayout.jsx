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
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all print:hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-900 cursor-pointer hover:opacity-80 transition-opacity">
                        {appLogo ? (
                            <img src={appLogo} alt="MIR Systems" className="h-10 max-w-[200px] object-contain" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                MIR<span className="text-blue-600 font-light relative -left-1">Systems</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-6 text-sm font-bold ml-auto">
                        <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors hidden md:block">Admin Login</Link>
                        <a href="https://mirwebsolutions.com/" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-0.5">
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
