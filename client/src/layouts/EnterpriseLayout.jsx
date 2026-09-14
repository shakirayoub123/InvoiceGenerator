import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LayoutTemplate, Settings, Users, LogOut, ChevronRight, Menu, X, Search } from 'lucide-react';
import { SettingsContext } from '../contexts/SettingsContext';

const SidebarLink = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-300 mb-1 group relative overflow-hidden
        ${isActive
                    ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-900/50 rounded-r-3xl mr-4'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 rounded-r-3xl mr-4 transition-colors'}
      `}
        >
            <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors relative z-10'} />
            <span className={`font-semibold text-sm relative z-10 ${isActive ? 'text-white' : ''}`}>{label}</span>
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"></div>}
        </Link>
    );
};

const EnterpriseLayout = ({ children }) => {
    const { appLogo } = useContext(SettingsContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            <aside className="w-64 bg-[#1b253b] flex flex-col z-20 text-white pb-6 relative print:hidden">
                <div className="h-28 flex flex-col justify-center items-center px-6 mb-4">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <img src="/White final MWS Logo.png" alt="Mir Web Solutions" className="w-[180px] mt-2 object-contain drop-shadow-md opacity-90" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 pr-2">
                    <SidebarLink to="/admin" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarLink to="/admin/invoices" icon={FileText} label="Invoices" />
                    <SidebarLink to="/admin/clients" icon={Users} label="Clients & Leads" />
                    <SidebarLink to="/admin/templates" icon={LayoutTemplate} label="Templates" />
                    <SidebarLink to="/admin/settings" icon={Settings} label="Settings" />
                </div>

                <div className="px-8 mt-auto italic text-slate-400/80 text-[11px] leading-relaxed relative z-10 border-t border-white/5 pt-6">
                    "Small steps<br />
                    <span className="pl-4">lead to big success."</span>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-white print:h-auto print:overflow-visible">
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] print:hidden">
                    <div className="w-[500px] relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search invoices, clients, products..." className="w-full bg-[#f1f5f9] border border-transparent pl-12 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium placeholder-slate-400" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                        </button>
                        <div className="relative" ref={profileMenuRef}>
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                <div className="w-9 h-9 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">S</div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-black transition-colors">Admin <ChevronRight size={14} className={`inline ml-1 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`} /></span>
                            </div>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-4 w-52 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-sm font-black text-slate-800">Admin User</p>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">admin@mirwebsolutions.com</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] print:p-0 print:bg-white print:overflow-visible">
                    <div className="w-full mx-auto animate-fade-in max-w-[1600px] print:max-w-none">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EnterpriseLayout;
