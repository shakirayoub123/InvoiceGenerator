import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, Filter, Eye, FileText, CheckCircle, TrendingUp, Calendar, Download, X, Clock, FilePlus, Users, Package, MoreVertical, Plus } from 'lucide-react';
import { format, parseISO, startOfMonth, startOfYear, isSameMonth, isSameYear, subMonths, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [baseCurrency, setBaseCurrency] = useState('₹');

    // Exchange rates based on USD as pivot (mock data for instant conversion)
    const exchangeRates = {
        '$': 1,       // USD
        '€': 0.93,    // EUR
        '£': 0.81,    // GBP
        '₹': 83.2     // INR
    };

    const convertCurrency = (amount, from, to) => {
        if (from === to) return amount;
        const amountInUSD = amount / (exchangeRates[from] || 1);
        return amountInUSD * (exchangeRates[to] || 1);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [invRes, cliRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/invoices`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/clients`)
                ]);
                setInvoices(invRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setClients(cliRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- METRICS CALCULATION ---
    const now = new Date();
    const currentMonthInvoices = invoices.filter(i => isSameMonth(new Date(i.date), now));
    const previousMonthInvoices = invoices.filter(i => isSameMonth(new Date(i.date), subMonths(now, 1)));

    const totalRevenue = invoices.reduce((acc, i) => acc + convertCurrency(i.total, i.currency || '₹', baseCurrency), 0);
    const monthlyRevenue = currentMonthInvoices.reduce((acc, i) => acc + convertCurrency(i.total, i.currency || '₹', baseCurrency), 0);

    const pendingInvoices = invoices.filter(i => i.status === 'Draft' || i.status === 'Sent' || !i.amountPaid || i.amountPaid < i.total);
    const paidInvoices = invoices.filter(i => i.amountPaid >= i.total && i.total > 0);

    const pendingAmount = pendingInvoices.reduce((acc, i) => acc + convertCurrency(i.total - (i.amountPaid || 0), i.currency || '₹', baseCurrency), 0);
    const paidAmount = paidInvoices.reduce((acc, i) => acc + convertCurrency(i.total, i.currency || '₹', baseCurrency), 0);

    const kpiCurrency = baseCurrency;

    // --- CRM METRICS ---
    const totalClients = clients.length;
    const allLeads = clients.flatMap(c =>
        c.referrals.map(r => ({ ...r, referrerName: c.name }))
    );
    const convertedLeads = allLeads.filter(l => l.status === 'Converted');
    const newLeads = allLeads.filter(l => l.status === 'New');

    // --- CHART DATA CALCULATION ---
    // Generate last 6 months data points
    const chartData = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(now, 5 - i);
        const monthInvoices = invoices.filter(inv => isSameMonth(new Date(inv.date), d));
        return {
            name: format(d, 'MMM'),
            revenue: monthInvoices.reduce((acc, inv) => acc + convertCurrency(inv.total, inv.currency || '₹', baseCurrency), 0)
        };
    });

    const pieChartData = [
        { name: 'Paid', value: invoices.filter(i => i.amountPaid >= i.total && i.total > 0).length, color: '#10b981' },
        { name: 'Pending', value: invoices.filter(i => (!i.amountPaid || i.amountPaid < i.total) && new Date(i.dueDate || Date.now()) >= new Date(new Date().setHours(0, 0, 0, 0))).length, color: '#f59e0b' },
        { name: 'Overdue', value: invoices.filter(i => (!i.amountPaid || i.amountPaid < i.total) && new Date(i.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))).length, color: '#ef4444' }
    ].filter(item => item.value > 0);
    if (pieChartData.length === 0) pieChartData.push({ name: 'No Data', value: 1, color: '#cbd5e1' });

    const leadsPieChartData = [
        { name: 'New', value: allLeads.filter(l => l.status === 'New').length, color: '#3b82f6' },
        { name: 'Contacted', value: allLeads.filter(l => l.status === 'Contacted').length, color: '#f59e0b' },
        { name: 'In Progress', value: allLeads.filter(l => l.status === 'In Progress').length, color: '#8b5cf6' },
        { name: 'Converted', value: allLeads.filter(l => l.status === 'Converted').length, color: '#10b981' },
        { name: 'Declined', value: allLeads.filter(l => l.status === 'Declined').length, color: '#ef4444' }
    ].filter(item => item.value > 0);
    if (leadsPieChartData.length === 0) leadsPieChartData.push({ name: 'No Data', value: 1, color: '#cbd5e1' });

    return (
        <div className="w-full space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Good Evening, Admin!</h1>
                    <p className="text-slate-500 font-medium mt-1">Here's an overview of your invoices and business activity.</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <p className="text-slate-600 font-bold mb-2">{format(now, 'EEE, d MMM yyyy')}</p>
                    <select
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                        className="bg-white border text-center border-slate-200 text-xs font-bold text-slate-700 px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-sm hover:border-mir-blue transition-colors focus:ring-2 focus:ring-mir-blue/20"
                    >
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                        <option value="₹">INR (₹)</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center flex-shrink-0">
                        <FileText size={28} className="fill-current" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Total Invoices</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{invoices.length}</div>
                        <div className="text-[11px] font-bold text-emerald-500 mt-1">+{currentMonthInvoices.length} this month</div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black leading-none">{kpiCurrency}</span>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Total Amount</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{kpiCurrency}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                        <div className="text-[11px] font-bold text-emerald-500 mt-1">+12% from last month</div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center flex-shrink-0">
                        <Clock size={28} className="fill-current" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Pending Invoices</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{pendingInvoices.length}</div>
                        <div className="text-[12px] font-bold text-[#f97316] mt-1">{kpiCurrency}{pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                        <div className="bg-[#8b5cf6] rounded-full w-7 h-7 flex items-center justify-center"><CheckCircle size={16} className="text-white" /></div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Paid Invoices</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{paidInvoices.length}</div>
                        <div className="text-[12px] font-bold text-[#10b981] mt-1">{kpiCurrency}{paidAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                    </div>
                </div>
            </div>

            {/* CRM KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Users size={28} className="fill-current" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Total Clients</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{totalClients}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <Plus size={28} className="stroke-[3]" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Total Leads Generated</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{allLeads.length}</div>
                        <div className="text-[11px] font-bold text-blue-500 mt-1">{newLeads.length} awaiting action</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={28} className="fill-current" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-500">Converted Leads</h3>
                        <div className="text-2xl font-black text-slate-800 mt-0.5">{convertedLeads.length}</div>
                        <div className="text-[11px] font-bold text-emerald-500 mt-1">{allLeads.length > 0 ? Math.round((convertedLeads.length / allLeads.length) * 100) : 0}% Conversion Rate</div>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="space-y-8">
                {/* Main Content Column */}
                <div className="w-full space-y-8">

                    {/* Chart Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Overview</h3>
                                <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 px-4 py-2 rounded-lg outline-none cursor-pointer">
                                    <option>Last 6 Months</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div className="h-48 w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={24}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: '600' }} dy={10} />
                                        <YAxis width={60} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: '600' }} tickFormatter={(value) => `${kpiCurrency}${value >= 1000 ? (value / 1000) + 'K' : value}`} />
                                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                                        <Bar dataKey="revenue" fill="#7baafe" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                            <div className="mb-4 text-center">
                                <h3 className="text-md font-black text-slate-800 tracking-tight">Invoice Status</h3>
                            </div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold', padding: '8px 12px' }} itemStyle={{ color: '#1e293b' }} formatter={(value, name) => [value + ' Invoices', name]} />
                                        <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                            <div className="mb-4 text-center">
                                <h3 className="text-md font-black text-slate-800 tracking-tight">Leads Pipeline</h3>
                            </div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={leadsPieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                                            {leadsPieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold', padding: '8px 12px' }} itemStyle={{ color: '#1e293b' }} formatter={(value, name) => [value + ' Leads', name]} />
                                        <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Activity Tables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Recent Invoices Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                            <div className="p-6 flex justify-between items-center bg-white border-b border-transparent">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Invoices</h2>
                                <Link to="/admin/invoices" className="text-sm font-bold text-[#3b82f6] hover:underline">View All</Link>
                            </div>

                            <div className="overflow-x-auto px-6 pb-6">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-y border-[#e2e8f0]">
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 rounded-l-xl">#</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900">Client</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 text-center">Date</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 text-right">Amount</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 text-center">Status</th>
                                            <th className="py-3.5 px-6 text-xs font-black text-slate-900 text-right rounded-r-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">Loading ledger...</td>
                                            </tr>
                                        ) : invoices.slice(0, 5).map((inv, idx) => {
                                            let isPaid = inv.amountPaid >= inv.total && inv.total > 0;
                                            let isPartiallyPaid = inv.amountPaid > 0 && inv.amountPaid < inv.total;
                                            let isPending = !isPaid && !isPartiallyPaid && new Date(inv.dueDate) >= new Date();
                                            let isOverdue = !isPaid && new Date(inv.dueDate) < new Date();

                                            return (
                                                <tr key={inv._id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === 4 ? 'border-none' : ''}`}>
                                                    <td className="py-4 px-4 text-sm font-semibold text-slate-600">
                                                        INV-{inv.invoiceNumber.padStart(4, '0')}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm font-semibold text-slate-800">
                                                        {inv.clientDetails.name}
                                                    </td>
                                                    <td className="py-4 px-4 text-center text-sm font-medium text-slate-500">
                                                        {format(new Date(inv.date), 'dd MMM yyyy')}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm font-bold text-slate-700 text-right">
                                                        {(inv.currency || '₹')}{inv.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {isPaid && <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#16a34a] font-bold text-xs rounded-full">Paid</span>}
                                                        {isPartiallyPaid && <span className="inline-block px-3 py-1 bg-[#fef08a] text-[#ca8a04] font-bold text-xs rounded-full">Partially Paid</span>}
                                                        {isPending && <span className="inline-block px-3 py-1 bg-[#ffedd5] text-[#ea580c] font-bold text-xs rounded-full">Pending</span>}
                                                        {isOverdue && <span className="inline-block px-3 py-1 bg-[#fee2e2] text-[#ef4444] font-bold text-xs rounded-full">Overdue</span>}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }} className="text-mir-blue hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors" title="View Details">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={(e) => deleteInvoice(inv._id, e)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Leads Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                            <div className="p-6 flex justify-between items-center bg-white border-b border-transparent">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Leads</h2>
                                <Link to="/admin/clients" className="text-sm font-bold text-[#3b82f6] hover:underline">View All</Link>
                            </div>
                            <div className="overflow-x-auto px-6 pb-6">
                                <table className="w-full text-left border-collapse min-w-[400px]">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-y border-[#e2e8f0]">
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 rounded-l-xl">Lead</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900">Referred By</th>
                                            <th className="py-3.5 px-4 text-xs font-black text-slate-900 text-center rounded-r-xl">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="py-12 text-center text-slate-500 font-medium">Loading leads...</td>
                                            </tr>
                                        ) : allLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="py-12 text-center text-slate-500 font-medium">No leads generated yet.</td>
                                            </tr>
                                        ) : allLeads.slice(0, 5).map((lead, idx) => {
                                            const getStatusColor = (status) => {
                                                switch (status) {
                                                    case 'New': return 'bg-blue-100 text-blue-700';
                                                    case 'Contacted': return 'bg-amber-100 text-amber-700';
                                                    case 'In Progress': return 'bg-purple-100 text-purple-700';
                                                    case 'Converted': return 'bg-emerald-100 text-emerald-700';
                                                    case 'Declined': return 'bg-red-100 text-red-700';
                                                    default: return 'bg-slate-100 text-slate-700';
                                                }
                                            };
                                            return (
                                                <tr key={idx} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === 4 ? 'border-none' : ''}`}>
                                                    <td className="py-4 px-4">
                                                        <div className="text-sm font-bold text-slate-800">{lead.leadName}</div>
                                                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{format(new Date(lead.dateReferred || Date.now()), 'dd MMM yyyy')}</div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm font-semibold text-slate-600">
                                                        {lead.referrerName}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`inline-block px-3 py-1 font-bold text-[11px] rounded-full ${getStatusColor(lead.status)}`}>{lead.status}</span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Invoice Templates */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <FileText size={18} /> Invoice Templates
                            </h3>
                            <Link to="/admin/templates" className="text-[#3b82f6] text-xs font-bold hover:underline">View All</Link>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <div className="w-full h-32 bg-slate-100 rounded-lg mb-2 border border-slate-200 flex items-center justify-center shadow-inner relative overflow-hidden group cursor-pointer">
                                    {/* Mock wireframe */}
                                    <div className="w-[80%] h-[70%] bg-white shadow-sm border border-slate-200 p-2 flex flex-col gap-1">
                                        <div className="h-2 bg-blue-500 w-1/4"></div>
                                        <div className="h-1 bg-slate-200 w-full mt-2"></div>
                                        <div className="h-1 bg-slate-200 w-full"></div>
                                        <div className="h-1 bg-slate-200 w-full"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye className="text-white" size={20} />
                                    </div>
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-500">Modern</p>
                            </div>
                            <div className="flex-1">
                                <div className="w-full h-32 bg-slate-100 rounded-lg mb-2 border border-slate-200 flex items-center justify-center shadow-inner relative overflow-hidden group cursor-pointer">
                                    {/* Mock wireframe */}
                                    <div className="w-[80%] h-[70%] bg-white shadow-sm border border-slate-200 p-2 border-t-8 border-t-slate-800 flex flex-col gap-1">
                                        <div className="h-1 bg-slate-200 w-full mt-2"></div>
                                        <div className="h-1 bg-slate-200 w-full"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye className="text-white" size={20} />
                                    </div>
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-500">Minimal</p>
                            </div>
                        </div>
                        <Link to="/admin/templates" className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#3b82f6] flex justify-center items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors mt-6">
                            <Plus size={16} /> Create New Template
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- INVOICE VIEW MODAL (Kept from previous build for detailed viewing) --- */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 border border-slate-200 flex flex-col">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 flex justify-between items-center z-20">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Invoice Details</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Generated on {format(new Date(selectedInvoice.date), 'PPPP')}</p>
                            </div>
                            <button onClick={() => setSelectedInvoice(null)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-12">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedInvoice.clientDetails.name}</h3>
                                    {selectedInvoice.clientDetails.email && <div className="text-sm font-medium text-slate-500">{selectedInvoice.clientDetails.email}</div>}
                                    {selectedInvoice.clientDetails.address && <div className="text-sm font-medium text-slate-500 whitespace-pre-wrap mt-2">{selectedInvoice.clientDetails.address}</div>}
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Invoice Number</div>
                                    <div className="text-3xl font-black text-mir-blue">INV-{selectedInvoice.invoiceNumber.padStart(4, '0')}</div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Line Items Data</div>
                                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-100/50">
                                            <tr>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-slate-500 w-1/2">Description</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-slate-500 text-center">Qty</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-slate-500 text-right">Rate</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-slate-500 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice.items.map((item, idx) => (
                                                <tr key={idx} className="border-t border-slate-100">
                                                    <td className="py-4 px-6 text-sm font-bold text-slate-700">{item.description}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-slate-500 text-center">{item.quantity}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-slate-500 text-right">{(selectedInvoice.currency || '₹')}{item.rate.toFixed(2)}</td>
                                                    <td className="py-4 px-6 text-sm font-black text-slate-800 text-right">{(selectedInvoice.currency || '₹')}{item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t border-slate-200">
                                            <tr>
                                                <td colSpan="3" className="py-4 px-6 text-sm font-bold text-slate-500 text-right">Subtotal</td>
                                                <td className="py-4 px-6 text-sm font-black text-slate-800 text-right">{(selectedInvoice.currency || '₹')}{(selectedInvoice.subtotal || 0).toFixed(2)}</td>
                                            </tr>
                                            {selectedInvoice.taxAmount > 0 && (
                                                <tr>
                                                    <td colSpan="3" className="py-2 px-6 text-sm font-bold text-slate-500 text-right">Tax ({selectedInvoice.taxRate}%)</td>
                                                    <td className="py-2 px-6 text-sm font-bold text-slate-700 text-right">+{(selectedInvoice.currency || '₹')}{selectedInvoice.taxAmount.toFixed(2)}</td>
                                                </tr>
                                            )}
                                            {selectedInvoice.discount > 0 && (
                                                <tr>
                                                    <td colSpan="3" className="py-2 px-6 text-sm font-bold text-emerald-500 text-right">Discount</td>
                                                    <td className="py-2 px-6 text-sm font-bold text-emerald-600 text-right">-{(selectedInvoice.currency || '₹')}{selectedInvoice.discount.toFixed(2)}</td>
                                                </tr>
                                            )}
                                            {selectedInvoice.shipping > 0 && (
                                                <tr>
                                                    <td colSpan="3" className="py-2 px-6 text-sm font-bold text-slate-500 text-right">Shipping</td>
                                                    <td className="py-2 px-6 text-sm font-bold text-slate-700 text-right">+{(selectedInvoice.currency || '₹')}{selectedInvoice.shipping.toFixed(2)}</td>
                                                </tr>
                                            )}
                                            <tr className="bg-slate-100/50">
                                                <td colSpan="3" className="py-5 px-6 text-base font-black text-slate-900 text-right uppercase tracking-widest">Final Total</td>
                                                <td className="py-5 px-6 text-2xl font-black text-mir-blue text-right">{(selectedInvoice.currency || '₹')}{selectedInvoice.total.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
