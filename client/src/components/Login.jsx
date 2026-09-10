import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            // Mock Authentication
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/admin');
            } else {
                setError('Invalid username or password');
                setLoading(false);
            }
        }, 800);
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

                    <div className="p-10 pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 text-center animate-shake">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Username</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        placeholder="Enter admin username"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-mir-blue focus:ring-2 focus:ring-mir-blue/20 transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
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

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-mir-blue hover:bg-mir-blue-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2 group"
                                >
                                    {loading ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        <>
                                            Access Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
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
