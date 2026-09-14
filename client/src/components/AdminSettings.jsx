import { useState, useRef, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import { SettingsContext } from '../contexts/SettingsContext';

const AdminSettings = () => {
    const { appLogo, setAppLogo } = useContext(SettingsContext);
    const [loading, setLoading] = useState(false);
    const [localLogo, setLocalLogo] = useState(appLogo);
    const fileInputRef = useRef(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/settings`, { appLogo: localLogo });
            setAppLogo(res.data.appLogo);
            setTimeout(() => {
                setLoading(false);
                toast.success('Branding settings updated successfully!');
            }, 500);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error('Failed to save settings.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Global Branding Settings</h2>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-600 block mb-3">Application Master Logo</label>
                        <p className="text-xs text-slate-500 mb-4">This logo will replace the 'MIR Systems' placeholder across the entire application interface (Navbar, Admin Dashboard, etc).</p>

                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                                {!localLogo ? (
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-mir-blue hover:border-mir-blue hover:bg-blue-50 transition-all cursor-pointer group"
                                    >
                                        <Upload size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                                        <span className="text-sm font-bold tracking-tight">Upload Logo</span>
                                    </div>
                                ) : (
                                    <div className="relative w-40 h-40 border border-slate-200 rounded-2xl bg-white p-4 shadow-sm flex items-center justify-center group overflow-hidden">
                                        <img src={localLogo} alt="Global App Logo" className="max-w-full max-h-full object-contain" />
                                        <button
                                            onClick={() => setLocalLogo('')}
                                            className="absolute top-2 right-2 bg-red-50 text-red-500 border border-red-100 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-500 hover:text-white"
                                            title="Remove Logo"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                            </div>

                            <div className="flex-1 space-y-4 pt-2">
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600 leading-relaxed">
                                    <strong>Recommendation:</strong> Use a high-resolution PNG with a transparent background. Dimensions should ideally be landscape (e.g. 500x150px) for best results in the navbar.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-mir-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20 transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                        >
                            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <Save size={16} />}
                            {loading ? 'Saving Changes...' : 'Save Configuration'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
