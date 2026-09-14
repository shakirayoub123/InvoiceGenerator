import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, Palette, LayoutTemplate, X, Check } from 'lucide-react';
import { format } from 'date-fns';

const AdminTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New Template State
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        color: '#3b82f6',
        layout: 'modern'
    });

    const fetchTemplates = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/templates`);
            setTemplates(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const deleteTemplate = async (id) => {
        if (window.confirm('Deleting this theme template is permanent. Are you sure?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/templates/${id}`);
                setTemplates(templates.filter(t => t._id !== id));
                toast.success('Template deleted successfully!');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete template.');
            }
        }
    };

    const handleCreateTemplate = async (e) => {
        e.preventDefault();
        if (!newTemplate.name) return toast.error('Template Name is required.');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/templates`, newTemplate);
            setTemplates([res.data, ...templates]);
            setShowCreateModal(false);
            setNewTemplate({ name: '', color: '#3b82f6', layout: 'modern' });
            toast.success('New template created successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create template.');
        }
    };

    return (
        <div className="w-full space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoice Templates</h1>
                    <p className="text-slate-500 font-medium mt-1">Design and manage overarching styles and themes for your invoices.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                    <Plus size={18} /> Create Template
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-12 text-slate-500 font-medium">Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500 font-medium shadow-sm">No templates configured yet. Create one to get started!</div>
                ) : (
                    templates.map((template) => (
                        <div key={template._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group relative overflow-hidden">
                            {/* Color Bar Accent */}
                            <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: template.color }}></div>

                            <div className="flex justify-between items-start mt-2 mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">{template.name}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Created {format(new Date(template.createdAt), 'MMM d, yyyy')}</p>
                                </div>
                                <button onClick={() => deleteTemplate(template._id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-auto shadow-sm">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#f8fafc] rounded-xl p-3 border border-slate-100">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><Palette size={12} /> Color</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: template.color }}></div>
                                        <div className="text-sm font-bold text-slate-700">{template.color}</div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#f8fafc] rounded-xl p-3 border border-slate-100">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><LayoutTemplate size={12} /> Layout</div>
                                    <div className="text-sm font-bold text-slate-700 capitalize">{template.layout}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Template Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-slate-900">New Template</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleCreateTemplate} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Template Name</label>
                                <input
                                    type="text"
                                    value={newTemplate.name}
                                    onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    placeholder="e.g. Enterprise Dark"
                                    className="w-full bg-[#f8fafc] border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-mir-blue/20 focus:border-mir-blue transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Primary Accent Color</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={newTemplate.color}
                                        onChange={e => setNewTemplate({ ...newTemplate, color: e.target.value })}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-white border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={newTemplate.color}
                                        onChange={e => setNewTemplate({ ...newTemplate, color: e.target.value })}
                                        className="flex-1 bg-[#f8fafc] border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 uppercase focus:outline-none focus:ring-2 focus:ring-mir-blue/20 focus:border-mir-blue transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Layout Base</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        onClick={() => setNewTemplate({ ...newTemplate, layout: 'modern' })}
                                        className={`px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${newTemplate.layout === 'modern' ? 'bg-blue-50 border-mir-blue text-mir-blue' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                    >
                                        <span className="font-bold text-sm">Modern</span>
                                        {newTemplate.layout === 'modern' && <Check size={16} />}
                                    </div>
                                    <div
                                        onClick={() => setNewTemplate({ ...newTemplate, layout: 'minimal' })}
                                        className={`px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${newTemplate.layout === 'minimal' ? 'bg-blue-50 border-mir-blue text-mir-blue' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                    >
                                        <span className="font-bold text-sm">Minimal</span>
                                        {newTemplate.layout === 'minimal' && <Check size={16} />}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">
                                Save Template
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTemplates;
