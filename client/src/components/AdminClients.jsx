import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Mail, Phone, Building, Briefcase, Plus, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, ArrowRight, Eye, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'clients'

    // Modal states
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients`);
                setClients(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleStatusChange = async (clientId, referralId, newStatus) => {
        try {
            const client = clients.find(c => c._id === clientId);
            const updatedReferrals = client.referrals.map(ref =>
                ref._id === referralId ? { ...ref, status: newStatus } : ref
            );

            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients/${clientId}`, {
                referrals: updatedReferrals
            });

            setClients(clients.map(c =>
                c._id === clientId ? { ...c, referrals: updatedReferrals } : c
            ));
        } catch (err) {
            console.error('Error updating status', err);
        }
    };
    const handleDeleteLead = async (clientId, referralId) => {
        if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
        try {
            const client = clients.find(c => c._id === clientId);
            const updatedReferrals = client.referrals.filter(ref => ref._id !== referralId);

            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients/${clientId}`, {
                referrals: updatedReferrals
            });

            setClients(clients.map(c =>
                c._id === clientId ? { ...c, referrals: updatedReferrals } : c
            ));
        } catch (err) {
            console.error('Error deleting lead', err);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (!window.confirm("Are you sure you want to permanently delete this client and all their referrals?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients/${clientId}`);
            setClients(clients.filter(c => c._id !== clientId));
        } catch (err) {
            console.error('Error deleting client', err);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Converted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Declined': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Flatten all leads into a single array for the Leads table
    const allLeads = clients.flatMap(client =>
        client.referrals.map(ref => ({
            ...ref,
            clientId: client._id,
            referrerName: client.name,
            referrerCompany: client.company,
            referrerEmail: client.email,
            referrerPhone: client.phone
        }))
    ).sort((a, b) => new Date(b.dateReferred) - new Date(a.dateReferred));

    // Filter based on search
    const filteredLeads = allLeads.filter(l =>
        l.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.leadEmail && l.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="w-full space-y-8 animate-fade-in pb-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Client Hub & Referrals</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your clients and oversee all inbound leads seamlessly.</p>
                </div>
            </div>

            {/* Toolbar & Tabs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Custom Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Referred Leads ({allLeads.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'clients' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Clients Directory ({clients.length})
                    </button>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-[300px]">
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={activeTab === 'leads' ? "Search leads or referrers..." : "Search clients..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Content Display */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            ) : activeTab === 'leads' ? (
                /* LEADS DATA TABLE VIEW */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-4 px-6">Lead Details</th>
                                    <th className="py-4 px-6">Referred By</th>
                                    <th className="py-4 px-6">Date Received</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                                            No leads match your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map(lead => (
                                        <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800 text-sm">{lead.leadName}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {lead.leadEmail && <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Mail size={12} /> {lead.leadEmail}</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-700 text-sm">{lead.referrerName}</div>
                                                {lead.referrerCompany && <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">{lead.referrerCompany}</div>}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-semibold text-slate-600">
                                                    {format(new Date(lead.dateReferred), 'MMM dd, yyyy')}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.clientId, lead._id, e.target.value)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none transition-colors shadow-sm text-center text-center ${getStatusColor(lead.status)}`}
                                                >
                                                    <option value="New">New Lead</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Converted">Converted</option>
                                                    <option value="Declined">Declined</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => setSelectedLead(lead)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                        <Eye size={14} /> Details
                                                    </button>
                                                    <button onClick={() => handleDeleteLead(lead.clientId, lead._id)} className="inline-flex items-center justify-center w-8 h-8 text-slate-400 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete Lead">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* CLIENTS DIRECTORY TABLE VIEW */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-4 px-6">Client Identity</th>
                                    <th className="py-4 px-6">Contact Info</th>
                                    <th className="py-4 px-6 text-center">Referrals Logged</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center text-slate-500 font-medium">
                                            No clients match your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map(client => (
                                        <tr key={client._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-md">
                                                        {client.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm tracking-tight">{client.name}</div>
                                                        {client.company && <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">{client.company}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                                                        <Mail size={12} /> <a href={`mailto:${client.email}`}>{client.email}</a>
                                                    </div>
                                                    {client.phone && (
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                            <Phone size={12} /> {client.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-black text-sm border border-slate-200 shadow-sm">
                                                    {client.referrals.length}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => setSelectedClient(client)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                        <Eye size={14} /> Profile
                                                    </button>
                                                    <button onClick={() => handleDeleteClient(client._id)} className="inline-flex items-center justify-center w-8 h-8 text-slate-400 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete Client">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODALS */}

            {/* View Lead Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Briefcase className="text-blue-500" size={24} /> Lead Dossier
                            </h2>
                            <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Lead Identity</h3>
                                <p className="text-lg font-bold text-slate-800">{selectedLead.leadName}</p>
                                <div className="flex flex-col gap-2 mt-2">
                                    {selectedLead.leadEmail && (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Mail size={16} className="text-slate-400" /> {selectedLead.leadEmail}</div>
                                    )}
                                    {selectedLead.leadPhone && (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Phone size={16} className="text-slate-400" /> {selectedLead.leadPhone}</div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Origin & Pipeline</h3>
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="text-sm font-bold text-slate-800">Referred by: {selectedLead.referrerName} {selectedLead.referrerCompany && `(${selectedLead.referrerCompany})`}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">Date Logged: {format(new Date(selectedLead.dateReferred), 'MMMM dd, yyyy')}</p>

                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pipeline Status:</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(selectedLead.status)}`}>{selectedLead.status}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedLead.notes && (
                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Context & Notes</h3>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm font-medium text-slate-700 italic">
                                        "{selectedLead.notes}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* View Client Profile Modal */}
            {selectedClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Building className="text-indigo-500" size={24} /> Client Profile
                            </h2>
                            <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-4xl shadow-xl mx-auto mb-4">
                                {selectedClient.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">{selectedClient.name}</h3>
                            {selectedClient.company && <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mt-2 border border-indigo-100">{selectedClient.company}</p>}

                            <div className="flex flex-col items-center gap-2 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Mail size={16} className="text-slate-400" /> {selectedClient.email}</div>
                                {selectedClient.phone && (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Phone size={16} className="text-slate-400" /> {selectedClient.phone}</div>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Lifetime Statistics</h3>
                                <div className="flex justify-center items-center gap-8">
                                    <div>
                                        <div className="text-4xl font-black text-slate-800">{selectedClient.referrals.length}</div>
                                        <div className="text-xs font-bold text-slate-400 tracking-wider">LEADS SENT</div>
                                    </div>
                                    <div className="h-12 w-px bg-slate-200"></div>
                                    <div>
                                        <div className="text-4xl font-black text-emerald-500">{selectedClient.referrals.filter(r => r.status === 'Converted').length}</div>
                                        <div className="text-xs font-bold text-slate-400 tracking-wider">CONVERTED</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <button
                                onClick={() => {
                                    setSearchTerm(selectedClient.name);
                                    setActiveTab('leads');
                                    setSelectedClient(null);
                                }}
                                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                View All Referrals From Client <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClients;
