import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Lock, User, ArrowRight, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!credentials.email) {
            setError('Please enter your email address first.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/send-otp`, { email: credentials.email });
            if (res.data.success) {
                setOtpSent(true);
                setSuccessMessage('OTP sent to your email!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            let res;
            if (loginMode === 'password') {
                res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`, {
                    email: credentials.email,
                    password: credentials.password.replace(/\s+/g, '') // Tolerance for typed blank spaces
                });
            } else {
                if (!otpSent) return;
                res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/verify-otp`, {
                    email: credentials.email,
                    otp: otpCode
                });
            }

            if (res.data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminToken', res.data.token);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials or OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-mir-blue rounded-full blur-3xl opacity-10"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-mir-accent rounded-full blur-3xl opacity-10"></div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

                    <div className="p-10 pb-6 text-center border-b border-slate-50">
                        <div className="w-16 h-16 bg-gradient-to-br from-mir-accent to-mir-blue rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 transform rotate-3">
                            <Building size={32} className="text-white transform -rotate-3" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Gateway</h1>
                        <p className="text-sm text-slate-500 mt-2">Sign in to manage your corporate invoices</p>
                    </div>

                    <div className="px-10 pt-6">
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => { setLoginMode('password'); setError(''); setSuccessMessage(''); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMode === 'password' ? 'bg-white text-mir-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Password
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginMode('otp'); setError(''); setSuccessMessage(''); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMode === 'otp' ? 'bg-white text-mir-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Email OTP
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 text-center animate-shake">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-emerald-50 text-emerald-600 text-sm font-semibold p-3 rounded-xl border border-emerald-100 text-center flex items-center justify-center gap-2">
                                    <CheckCircle2 size={16} /> {successMessage}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={credentials.email}
                                        onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }); setOtpSent(false); }}
                                        placeholder="Enter admin email address"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-mir-blue focus:ring-2 focus:ring-mir-blue/20 transition-all font-medium text-slate-700"
                                        disabled={otpSent && loginMode === 'otp'}
                                    />
                                </div>
                            </div>

                            {loginMode === 'password' && (
                                <div className="animate-fade-in">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            value={credentials.password}
                                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                            placeholder="Enter secure password"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-mir-blue focus:ring-2 focus:ring-mir-blue/20 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                            )}

                            {loginMode === 'otp' && (
                                <div className="animate-fade-in space-y-4 pt-2">
                                    {!otpSent ? (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={loading}
                                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-500/30 transition-all flex justify-center items-center gap-2"
                                        >
                                            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Send OTP to Email'}
                                        </button>
                                    ) : (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Enter 6-Digit OTP</label>
                                            <div className="relative">
                                                <KeyRound size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength="6"
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="000000"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base tracking-widest text-center focus:outline-none focus:border-mir-blue focus:ring-2 focus:ring-mir-blue/20 transition-all font-black text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 pb-10">
                                {!(loginMode === 'otp' && !otpSent) && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-mir-blue hover:bg-mir-blue-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2 group"
                                    >
                                        {loading ? (
                                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        ) : (
                                            <>
                                                {loginMode === 'otp' ? 'Login with OTP' : 'Access Dashboard'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex items-center justify-center gap-2">
                        <Lock size={14} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">Secure 256-bit Encrypted Connection</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
