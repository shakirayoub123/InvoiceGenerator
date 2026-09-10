import React from 'react';
import InvoiceGenerator from '../components/InvoiceGenerator';
import { Search, Settings as SettingsIcon, UserCircle } from 'lucide-react';

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="w-full max-w-[1400px] mx-auto pt-20 pb-16 px-6 lg:px-12 relative z-10 animate-fade-in print:hidden text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest hover:bg-blue-100 cursor-pointer transition-colors">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Free Enterprise Tool
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto">
                    Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional Invoices</span> in Seconds.
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                    The fastest, most elegant way to bill your clients. Generate unlimited, high-quality PDF invoices directly from your browser—no sign up required.
                </p>
            </section>

            {/* Main Tool Injection */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 print:py-0 print:px-0 mb-24">
                <InvoiceGenerator />
            </main>


            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative z-10 print:hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Everything you need to get paid faster.</h2>
                        <p className="text-slate-500 text-lg">Built with enterprise-grade technology to streamline your billing workflow.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Search size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Native PDF Rendering</h3>
                            <p className="text-slate-500 leading-relaxed">Experience zero-loss, vector-quality PDF generation scaling perfectly to exact A4 print specifications natively via browser.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><SettingsIcon size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Calculations</h3>
                            <p className="text-slate-500 leading-relaxed">Tax, shipping, and discount variables are computed in real-time, completely eliminating mathematical errors in your ledger.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors"><UserCircle size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
                            <p className="text-slate-500 leading-relaxed">All generated data strictly resides in your local session. We do not track, trace, or save your financial data without submission.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
