import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STEPS = [
    { n: '01', title: 'Send Us a Referral', body: 'Share a few details about the person or business you’d like to introduce.' },
    { n: '02', title: 'We Connect', body: 'Our team reaches out, understands their requirements, and discusses how we can help.' },
    { n: '03', title: 'They Become a Client', body: 'If they decide to work with Mir Web Solutions, we take care of the project.' },
    { n: '04', title: 'You Get Rewarded', body: 'Once the referral qualifies, you receive your referral commission.' }
];

const FAQS = [
    { q: 'Do I need to be an existing Mir Web Solutions client?', a: 'No. Anyone can refer a potential client.' },
    { q: 'Do I need to sell the service to the client?', a: 'No. Your role is simply to make the introduction. Our team handles the discussion from there.' },
    { q: 'What happens after I submit a referral?', a: "We'll review the information and contact the referred person or business to understand their requirements." },
    { q: 'When do I receive my referral commission?', a: 'Referral commissions are paid according to our referral terms once the referral becomes a qualifying client.' },
    { q: 'Can I refer more than one client?', a: 'Yes. You can submit multiple referrals whenever you come across a relevant opportunity.' },
    { q: 'What if the person isn\'t ready to start immediately?', a: "That's okay. If they're considering a project, you can still introduce them to us." }
];

const SERVICES = [
    { title: 'Website Design', body: "Modern, professional websites built around the client's goals.", icon: '🌐' },
    { title: 'Website Redesign', body: 'Improve an outdated website with a cleaner, stronger UX.', icon: '✨' },
    { title: 'E-commerce', body: 'Build and improve online stores for a smooth buying experience.', icon: '🛒' },
    { title: 'SEO', body: 'Improve visibility and presence in search engines.', icon: '📈' },
    // { title: 'Lead Generation', body: 'Attract and connect with potential customers effectively.', icon: '🎯' },
    { title: 'Appointment Setting', body: 'Generate qualified conversations and sales opportunities.', icon: '📅' },
    { title: 'Social Media', body: 'Create and manage a consistent social media presence.', icon: '📱' }
];

const TARGETS = [
    'Business owners', 'Founders', 'Coaches & consultants', 'Freelancers',
    'Agencies', 'Professionals', 'E-commerce businesses', 'Startups', 'Existing clients'
];

const SubmitReferral = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        myName: '', myEmail: '', myPhone: '', myCompany: '', myUrl: '',
        leadName: '', leadEmail: '', leadPhone: '', leadUrl: '', notes: '', extraNotes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients/refer`, formData);
            setSuccess(true);
            setFormData({ myName: '', myEmail: '', myPhone: '', myCompany: '', myUrl: '', leadName: '', leadEmail: '', leadPhone: '', leadUrl: '', notes: '', extraNotes: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong on our end. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById('referral-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (success) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 font-sans">
                <div className="max-w-md w-full text-center bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 border-4 border-white shadow-xl shadow-blue-500/10">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Referral Received!</h2>
                    <p className="text-base leading-relaxed mb-10 text-slate-500 font-medium">
                        Thank you for making the introduction. Our team will review the information and reach out to the lead shortly. Look out for updates!
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="w-full py-4 px-6 rounded-2xl font-bold transition-all mb-4 bg-slate-900 text-white hover:bg-black shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] transform hover:-translate-y-0.5"
                    >
                        Submit another referral
                    </button>
                    <Link to="/" className="text-sm font-bold transition-colors text-slate-400 hover:text-slate-900 block mt-2">← Back to home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f8fafc] animate-fade-in font-sans overflow-hidden">

            {/* HERO SECTION */}
            <section className="relative px-6 pt-8 lg:pt-12 pb-20 lg:pb-28 min-h-[90svh] lg:min-h-[calc(100svh-6rem)] flex flex-col justify-center overflow-hidden bg-white w-full">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 mb-8 tracking-wide shadow-sm shadow-blue-500/5">
                        <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Partner Program
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
                        Refer a Client.<br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                            Get Rewarded.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl font-medium leading-relaxed mb-6 max-w-2xl mx-auto text-slate-500">
                        Know a business that needs a better website or digital support? Introduce them to us.
                    </p>
                    <p className="text-base md:text-lg font-medium leading-relaxed mb-12 max-w-2xl mx-auto text-slate-500 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100">
                        We handle the project from start to finish, and <span className="font-bold text-slate-800">you earn a commission</span> when the referral becomes a client.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                        <button
                            onClick={scrollToForm}
                            className="w-full sm:w-auto bg-blue-600 text-white font-black py-4 px-10 rounded-full shadow-[0_8px_25px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-[0_12px_30px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 group"
                        >
                            Become a Partner
                            <svg className="transform group-hover:translate-x-1.5 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mt-6 md:absolute md:-bottom-12">Commission structure based on finalized project tier.</p>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="w-full py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center bg-slate-50 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-6 leading-tight">You make the introduction.<br />We handle the rest.</h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            You don't need to sell our services or manage the project. Simply point them our way, and our expert team takes over entirely.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {STEPS.map((step, idx) => (
                            <div key={idx} className="group p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.15)] hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-400 font-black text-sm tracking-wider mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">{step.n}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{step.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{step.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHO & WHAT */}
            <section className="w-full py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center bg-white relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

                    {/* What */}
                    <div className="lg:col-span-7">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-xl flex items-center justify-center mb-5 border border-indigo-50 shadow-sm shadow-indigo-500/10">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-4">What Can We Help With?</h3>
                        <p className="text-slate-500 text-base font-medium mb-6 leading-relaxed">
                            Your referral can come to us for any of the following professional services:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SERVICES.map((srv, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 shadow-sm transition-all group flex items-start gap-3">
                                    <div className="text-lg p-2 bg-slate-50 group-hover:bg-white rounded-lg shadow-inner border border-slate-100/50 flex-shrink-0 mt-0.5">{srv.icon}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{srv.title}</h4>
                                        <p className="text-xs font-medium text-slate-500 leading-snug">{srv.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Who */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-12">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl flex items-center justify-center mb-5 border border-blue-50 shadow-sm shadow-blue-500/10">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-4">Who Can You Refer?</h3>
                            <p className="text-slate-500 text-base font-medium mb-8 leading-relaxed">
                                You don't need to be a marketing professional or work in the web industry. If someone you know is planning a new website or considering a redesign, they could be a good referral!
                            </p>
                            <div className="flex flex-wrap gap-3 mb-10">
                                {TARGETS.map((item, i) => (
                                    <span key={i} className="px-4 py-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default border border-slate-200 hover:border-blue-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* WHY REFER */}
            <section className="w-full py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">Why partner with Mir Web Solutions?</h2>
                        <p className="text-lg text-slate-400 font-medium">We treat your professional network as importantly as you do.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { t: 'Your Relationship Stays Yours', d: 'We respect the relationship you\'ve built with your client or contact. We act as your specialized technical arm.', icon: '🤝' },
                            { t: 'No Project Management', d: 'Once you make the introduction, our expert team seamlessly handles all ongoing communication and project delivery.', icon: '⚡' },
                            { t: 'Professional Service', d: 'Your referral is handled by a dedicated team from the initial discovery conversation completely through to the final launch.', icon: '💎' },
                            { t: 'Earn From Your Network', d: 'If your referral becomes a committed client, you automatically receive a direct referral percentage commission.', icon: '💸' },
                            { t: 'Long-Term Partnership', d: 'You can continue referring businesses seamlessly whenever you come across a relevant digital opportunity.', icon: '🚀' },
                            { t: 'Lead Generation', d: 'Attract and connect with potential customers effectively.', icon: '🎯' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/80 transition-colors">
                                <div className="text-3xl mb-6 bg-slate-800/80 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">{item.icon}</div>
                                <h4 className="font-extrabold text-xl mb-3 text-white">{item.t}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPECIAL BENEFITS */}
            <section className="w-full py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center bg-gradient-to-br from-indigo-50 to-blue-50 relative border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-100 rounded-full text-xs font-bold text-blue-600 mb-6 tracking-wide shadow-sm">
                            <span className="text-base leading-none">🎁</span>
                            Exclusive Client Package
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-6">Special Benefits for Your Referral</h2>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            When you introduce a business to Mir Web Solutions, your referred contact receives an exclusive client welcome package to ensure their project succeeds from day one:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)] flex items-start gap-5 hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                💰
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">10% Savings on Every Project</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">A direct 10% discount applied to their total project investment.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)] flex items-start gap-5 hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                🎨
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Complimentary Logo Design</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">A custom, professional logo to elevate their brand identity.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)] flex items-start gap-5 hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                🛠️
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">2 Months of Free Maintenance</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">Full post-launch support covering bug fixes, error resolution, plugin updates, and core maintenance.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)] flex items-start gap-5 hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                📊
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">21-Day Technical & SEO Audit</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">A comprehensive post-launch review evaluating site health, performance speeds, security, and search indexing progress.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM SECTION */}
            <section id="referral-form" className="w-full py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center bg-white relative">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Submit a Referral</h2>
                        <p className="text-lg font-medium text-slate-500 max-w-2xl mx-auto">
                            Have someone in mind? You make the introduction. We take care of the rest.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[3rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

                        {error && (
                            <div className="mb-10 p-5 rounded-2xl text-sm font-bold border border-red-200 bg-red-50 text-red-600 flex items-center gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-16">
                            {/* BLOCK 1 */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">1</div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Referred By</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Full Name">
                                        <input required type="text" name="myName" value={formData.myName} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                                    </Field>
                                    <Field label="Email Address">
                                        <input required type="email" name="myEmail" value={formData.myEmail} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                                    </Field>
                                    <Field label="Phone / WhatsApp" optional>
                                        <input type="text" name="myPhone" value={formData.myPhone} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
                                    </Field>
                                    <Field label="Company" optional>
                                        <input type="text" name="myCompany" value={formData.myCompany} onChange={handleChange} className={inputClass} placeholder="Acme Corp" />
                                    </Field>
                                </div>
                                <div className="grid grid-cols-1 gap-6 mt-6">
                                    <Field label="What do they need help with?">
                                        <textarea required name="notes" value={formData.notes} onChange={handleChange} rows="4" className={inputClass + ' resize-none'} placeholder="e.g., They are looking to launch a brand new high-performance website." />
                                    </Field>
                                    <Field label="Anything else we should know?" optional>
                                        <textarea name="extraNotes" value={formData.extraNotes || ''} onChange={handleChange} rows="2" className={inputClass + ' resize-none'} placeholder="Timeline, budget considerations, or specific contacts..." />
                                    </Field>
                                </div>
                            </div>

                            {/* BLOCK 2 */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">2</div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Client Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Client Name">
                                        <input required type="text" name="leadName" value={formData.leadName} onChange={handleChange} className={inputClass} placeholder="Jane Smith" />
                                    </Field>
                                    <Field label="Business / Company Name" optional>
                                        <input type="text" name="leadCompany" value={formData.leadCompany || ''} onChange={handleChange} className={inputClass} placeholder="Tech Enterprises" />
                                    </Field>
                                    <Field label="Email Address">
                                        <input required type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} className={inputClass} placeholder="jane@prospect.com" />
                                    </Field>
                                    <Field label="Phone / WhatsApp" optional>
                                        <input type="text" name="leadPhone" value={formData.leadPhone} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
                                    </Field>
                                    <Field label="Website Link" optional full>
                                        <input type="url" name="leadUrl" value={formData.leadUrl} onChange={handleChange} className={inputClass} placeholder="https://www.theirexistingwebsite.com" />
                                    </Field>
                                </div>
                            </div>


                        </div>

                        <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-2 text-slate-400">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                <p className="text-sm font-bold uppercase tracking-wide">Secure Data</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto py-4 px-10 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-1 disabled:opacity-60 flex items-center justify-center gap-3 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30"
                            >
                                {loading ? (
                                    <span className="inline-block h-6 w-6 rounded-full border-4 animate-spin border-white border-t-transparent" />
                                ) : (
                                    'Securely Submit Referral'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* FAQS */}
            <section className="w-full bg-white py-20 lg:py-24 min-h-[100svh] flex flex-col justify-center border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-6">Common Questions</h2>
                    </div>
                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                        {FAQS.map((faq, i) => (
                            <FAQItem key={i} faq={faq} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const FAQItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="py-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-0 group"
            >
                <span className={`text-base font-bold transition-colors pr-8 ${open ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                    {faq.q}
                </span>
                <span className={`flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${open ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-3xl pr-10">{faq.a}</p>
            </div>
        </div>
    );
};

const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-base font-semibold text-slate-900 transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

const Field = ({ label, optional, full, children }) => (
    <div className={`space-y-2.5 ${full ? 'md:col-span-2' : ''}`}>
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-1">
            {label} {optional && <span className="font-semibold text-slate-400 tracking-wide text-xs uppercase bg-slate-100 px-2 py-0.5 rounded-full ml-1">Optional</span>}
        </label>
        {children}
    </div>
);

export default SubmitReferral;