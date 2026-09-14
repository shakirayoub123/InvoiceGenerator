import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, Filter, Eye, Edit, X, CheckCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const AdminInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/invoices`);
                setInvoices(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const deleteInvoice = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <span className="font-bold text-white text-base text-center">Delete this invoice permanently?</span>
                <div className="flex justify-center gap-3">
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            const promise = axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/invoices/${id}`);
                            toast.promise(promise, { loading: 'Deleting...', success: 'Invoice deleted', error: 'Failed to delete' });
                            await promise;
                            setInvoices(invoices.filter(i => i._id !== id));
                        } catch (err) {
                            console.error(err);
                        }
                    }} className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-red-600 transition-colors shadow-lg">Delete</button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border border-slate-300">Cancel</button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: { background: '#27272a', color: '#fff', padding: '24px 32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }
        });
    };

    const markAsPaid = (invoice) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <span className="font-bold text-white text-base text-center">Mark invoice as fully paid?</span>
                <div className="flex justify-center gap-3">
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            const payload = { ...invoice, status: 'Paid', amountPaid: invoice.total, balanceDue: 0 };
                            const promise = axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/invoices/${invoice._id}`, payload);
                            toast.promise(promise, { loading: 'Updating...', success: 'Target invoice paid', error: 'Database update failed' });
                            const res = await promise;
                            setInvoices(invoices.map(inv => inv._id === invoice._id ? res.data : inv));
                        } catch (err) {
                            console.error(err);
                        }
                    }} className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">Confirm</button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border border-slate-300">Cancel</button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: { background: '#27272a', color: '#fff', padding: '24px 32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }
        });
    };

    const filteredInvoices = invoices.filter(i =>
        i.clientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoice Ledger</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and view all your generated invoices.</p>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">All Records</h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search clients or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-mir-blue focus:ring-1 focus:ring-mir-blue transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Invoice ID</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Client Info</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center">Items</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Date Issued</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Amount</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">Fetching global ledger data...</td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">No invoice records match your criteria.</td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => {
                                    let isPaid = inv.amountPaid >= inv.total && inv.total > 0;
                                    let isPartiallyPaid = inv.amountPaid > 0 && inv.amountPaid < inv.total;
                                    let isPending = !isPaid && !isPartiallyPaid && new Date(inv.dueDate) >= new Date();
                                    let isOverdue = !isPaid && new Date(inv.dueDate) < new Date();

                                    return (
                                        <tr key={inv._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                                                INV-{inv.invoiceNumber.padStart(4, '0')}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800 text-sm">{inv.clientDetails.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{inv.clientDetails.email || 'No email'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                                    {inv.items.length}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-slate-600">{format(new Date(inv.date), 'MMM d, yyyy')}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-700">
                                                {(inv.currency || '₹')}{inv.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-4 px-6">
                                                {isPaid && <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#16a34a] font-bold text-xs rounded-full">Paid</span>}
                                                {isPartiallyPaid && <span className="inline-block px-3 py-1 bg-[#fef08a] text-[#ca8a04] font-bold text-xs rounded-full">Partially Paid</span>}
                                                {isPending && <span className="inline-block px-3 py-1 bg-[#ffedd5] text-[#ea580c] font-bold text-xs rounded-full">Pending</span>}
                                                {isOverdue && <span className="inline-block px-3 py-1 bg-[#fee2e2] text-[#ef4444] font-bold text-xs rounded-full">Overdue</span>}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!isPaid && (
                                                        <button onClick={() => markAsPaid(inv)} className="text-emerald-500 hover:bg-emerald-50 p-2 rounded-lg transition-colors" title="Mark as Fully Paid">
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => setSelectedInvoice(inv)} className="text-mir-blue hover:bg-blue-50 p-2 rounded-lg transition-colors" title="View Details">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button onClick={() => deleteInvoice(inv._id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- INVOICE VIEW MODAL --- */}
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

export default AdminInvoices;
