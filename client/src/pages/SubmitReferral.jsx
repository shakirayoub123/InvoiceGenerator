import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STEPS = [
    {
        n: '01',
        title: 'You submit the details',
        body: 'Tell us who you are and who you’re referring. Two minutes, no account required.',
    },
    {
        n: '02',
        title: 'We review the fit',
        body: 'Our partnerships team looks over the referral and checks it against current client needs.',
    },
    {
        n: '03',
        title: 'We reach out directly',
        body: 'If it’s a match, we contact the lead within two business days — you’ll hear back either way.',
    },
];

const ReferralChainDiagram = () => (
    <svg viewBox="0 0 320 260" className="w-full h-auto max-w-sm" role="img" aria-label="Diagram showing a referral moving from partner to lead to outcome">
        <line x1="60" y1="50" x2="60" y2="130" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="60" y1="130" x2="260" y2="130" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="260" y1="130" x2="260" y2="210" stroke="#e2e8f0" strokeWidth="2" />

        <g>
            <circle cx="60" cy="50" r="26" fill="#0f172a" />
            <text x="60" y="55" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" className="font-sans">You</text>
        </g>
        <text x="98" y="54" fill="#64748b" fontSize="12" className="font-sans">Partner Origin</text>

        <g>
            <circle cx="60" cy="130" r="26" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <text x="60" y="135" textAnchor="middle" fill="#0f172a" fontSize="10.5" fontWeight="600" className="font-sans">Lead</text>
        </g>
        <text x="98" y="134" fill="#64748b" fontSize="12" className="font-sans">Lead Target</text>

        <g>
            <circle cx="260" cy="130" r="26" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <text x="260" y="135" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="600" className="font-sans">Review</text>
        </g>

        <g>
            <circle cx="260" cy="210" r="26" fill="#2563eb" />
            <text x="260" y="215" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="600" className="font-sans">Outcome</text>
        </g>
    </svg>
);

const SubmitReferral = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        myName: '', myEmail: '', myPhone: '', myCompany: '',
        leadName: '', leadEmail: '', leadPhone: '', notes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            await axios.post('http://localhost:5001/api/clients/refer', formData);
            setSuccess(true);
            setFormData({ myName: '', myEmail: '', myPhone: '', myCompany: '', leadName: '', leadEmail: '', leadPhone: '', notes: '' });
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
            <div className="w-full min-h-[70vh] flex items-center justify-center p-6 bg-[#fafafa]">
                <div className="max-w-md w-full text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8 bg-blue-100 text-blue-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Referral received</h2>
                    <p className="text-base leading-relaxed mb-10 text-slate-500 font-medium">
                        Thank you for sending this our way. Our partnerships team will review it and reach out to the lead within two business days.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="w-full py-3.5 px-6 rounded-lg font-bold transition-colors mb-5 bg-slate-900 text-white hover:bg-black"
                    >
                        Submit another referral
                    </button>
                    <Link to="/" className="text-sm font-semibold transition-colors text-slate-500 hover:text-slate-900">Back to home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#fafafa] animate-fade-in font-sans">

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest hover:bg-blue-100 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Referral Pipeline
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-7">
                        Send us a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">client</span>, we'll take it from there.
                    </h1>
                    <p className="text-lg md:text-xl font-medium leading-relaxed mb-9 max-w-lg text-slate-500">
                        Submit a referral in under two minutes. No account, no waiting on a callback — just tell us who to talk to and why, and our team follows up directly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                        <button
                            onClick={scrollToForm}
                            className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                        >
                            Submit a referral
                        </button>
                        <a href="https://calendly.com/mirwebsolutions/coffeechat" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-700 font-bold py-3.5 px-8 rounded-full border border-slate-200 shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all transform hover:-translate-y-0.5">
                            Book a Call
                        </a>
                    </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                    <ReferralChainDiagram />
                </div>
            </section>

            {/* How it works */}
            <section className="w-full border-t border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-12">How a referral moves</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {STEPS.map((step) => (
                            <div key={step.n} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                                <div className="text-xs font-extrabold mb-4 text-blue-600 bg-blue-100 inline-block px-3 py-1 rounded-full">{step.n}</div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-sm font-medium leading-relaxed text-slate-500">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section id="referral-form" className="w-full border-t border-slate-200 bg-[#fafafa]">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Submit a referral</h2>
                    <p className="text-lg font-medium text-slate-500 mb-12">
                        The more context you give us, the faster we can follow up with the right approach.
                    </p>

                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm">
                        {error && (
                            <div className="mb-8 px-5 py-4 rounded-xl text-sm font-semibold border bg-red-50 text-red-600 border-red-100 flex items-center gap-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-12">
                            {/* BLOCK 1 */}
                            <div>
                                <div className="pb-4 mb-8 border-b border-slate-100 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-black">1</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Refered By</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5">So we know who to credit and follow up with.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Full name">
                                        <input required type="text" name="myName" value={formData.myName} onChange={handleChange} className={inputClass} placeholder="e.g. John Doe" />
                                    </Field>
                                    <Field label="Email address">
                                        <input required type="email" name="myEmail" value={formData.myEmail} onChange={handleChange} className={inputClass} placeholder="e.g. john@company.com" />
                                    </Field>
                                    <Field label="WhatsApp number" optional>
                                        <input type="text" name="myPhone" value={formData.myPhone} onChange={handleChange} className={inputClass} placeholder="+1..." />
                                    </Field>
                                    <Field label="Company / organization" optional>
                                        <input type="text" name="myCompany" value={formData.myCompany} onChange={handleChange} className={inputClass} placeholder="Acme Inc." />
                                    </Field>
                                    <Field label="Linked URL (Website / LinkedIn)" optional full>
                                        <input type="url" name="myUrl" value={formData.myUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
                                    </Field>
                                </div>
                            </div>

                            {/* BLOCK 2 */}
                            <div>
                                <div className="pb-4 mb-8 border-b border-slate-100 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-black">2</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">The lead</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5">Who we should be talking to.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Client / entity name">
                                        <input required type="text" name="leadName" value={formData.leadName} onChange={handleChange} className={inputClass} placeholder="Jane Smith or TechCorp" />
                                    </Field>
                                    <Field label="Lead email contact" optional>
                                        <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} className={inputClass} placeholder="contact@prospect.com" />
                                    </Field>
                                    <Field label="Lead WhatsApp number" optional>
                                        <input type="text" name="leadPhone" value={formData.leadPhone} onChange={handleChange} className={inputClass} placeholder="+1..." />
                                    </Field>
                                    <Field label="Lead Linked URL (Website / LinkedIn)" optional>
                                        <input type="url" name="leadUrl" value={formData.leadUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
                                    </Field>
                                    <Field label="Additional context" full>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className={inputClass + ' resize-none'} placeholder="What do they need? Any timing or budget context helps." />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm font-semibold text-slate-400">Your information is encrypted in transit.</p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto py-4 px-10 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-black shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                            >
                                {loading ? (
                                    <span className="inline-block h-5 w-5 rounded-full border-2 animate-spin border-white border-t-transparent" />
                                ) : (
                                    'Submit lead secure'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white placeholder-slate-400";

const Field = ({ label, optional, full, children }) => (
    <div className={`space-y-2 ${full ? 'md:col-span-2' : ''}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            {label} {optional && <span className="font-semibold text-slate-400 normal-case tracking-normal ml-1">(Optional)</span>}
        </label>
        {children}
    </div>
);

export default SubmitReferral;