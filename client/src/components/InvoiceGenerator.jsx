import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Trash2, Printer, Save, Eye, EyeOff, Settings2, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import InvoicePrintTemplate from './InvoicePrintTemplate';

const InvoiceGenerator = () => {
    const fileInputRef = useRef(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [currency, setCurrency] = useState('$');
    const [showTax, setShowTax] = useState(false);
    const [showDiscount, setShowDiscount] = useState(false);
    const [showShipping, setShowShipping] = useState(false);

    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    const [invoice, setInvoice] = useState({
        invoiceNumber: '001',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        paymentTerms: '',
        senderDetails: {
            name: 'Mir Web Solutions',
            address: 'Baramulla, J&K - INDIA\ninfo@mirwebsolutions.com\n+91 7889506606'
        },
        clientDetails: { name: '', address: '' },
        logo: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        notes: '',
        terms: '',
        bankDetails: '',
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        amountPaid: 0,
        balanceDue: 0
    });

    useEffect(() => {
        calculateTotals();
    }, [invoice.items, invoice.taxRate, invoice.discount, invoice.shipping, invoice.amountPaid]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/templates');
                setTemplates(res.data);
                if (res.data.length > 0) setSelectedTemplateId(res.data[0]._id);
            } catch (err) { console.error(err); }
        };
        fetchTemplates();
    }, []);

    const calculateTotals = () => {
        const subtotal = invoice.items.reduce((acc, item) => acc + item.amount, 0);
        const discountAmount = subtotal * ((invoice.discount || 0) / 100);
        const taxAmount = (subtotal - discountAmount) * ((invoice.taxRate || 0) / 100);
        const total = subtotal - discountAmount + taxAmount + (invoice.shipping || 0);
        const balanceDue = total - (invoice.amountPaid || 0);

        setInvoice(prev => ({ ...prev, subtotal, discountAmount, taxAmount, total, balanceDue }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoice.items];
        newItems[index][field] = value;
        if (field === 'quantity' || field === 'rate') {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setInvoice(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice(prev => ({ ...prev, items: newItems.length ? newItems : [{ description: '', quantity: 1, rate: 0, amount: 0 }] }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInvoice(prev => ({ ...prev, logo: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setInvoice(prev => ({ ...prev, logo: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveInvoice = () => {
        toast.promise(
            axios.post('http://localhost:5001/api/invoices', { ...invoice, currency }),
            {
                loading: 'Saving...',
                success: 'Invoice saved to ledger!',
                error: 'Failed to save.'
            }
        );
    };

    const generatePDF = () => {
        setIsPreviewMode(true);
        setTimeout(() => {
            window.print();
        }, 150);
    };

    const togglePreview = () => setIsPreviewMode(!isPreviewMode);

    const selectedTemplate = templates.find(t => t._id === selectedTemplateId) || { color: '#333333', layout: 'modern' };

    const inputHoverClass = "bg-slate-50/50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]";

    return (
        <div className="w-full relative max-w-[1150px] mx-auto font-sans px-4 sm:px-0 mb-12 flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT COLUMN: UNIFIED CANVAS */}
            <div className={`flex-1 w-full relative`}>

                {/* INTERACTIVE INVOICE EDITOR */}
                <div id="invoice-preview" className={`w-full bg-white transition-all overflow-hidden mx-auto ${isPreviewMode ? 'hidden print:hidden' : 'block print:hidden'} shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80 rounded-2xl`} style={{ padding: '6% 8%', minHeight: '1050px' }}>

                    {/* BRAND HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-12 sm:mb-16 gap-8">
                        <div className="w-full sm:w-1/2 flex flex-col items-start">
                            {(!invoice.logo && !isPreview) && (
                                <div onClick={() => fileInputRef.current.click()} className="w-48 h-32 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer transition-all group mb-4">
                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <Plus size={20} className="text-blue-500" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest">Add Brand Logo</span>
                                </div>
                            )}
                            {invoice.logo && (
                                <div className="relative group inline-block mb-4">
                                    <img src={invoice.logo} alt="Company Logo" className="max-w-xs max-h-32 object-contain" />
                                    {!isPreview && (
                                        <button onClick={removeLogo} className="absolute -top-3 -right-3 bg-white shadow-xl text-red-500 hover:text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 hover:bg-red-500 hover:scale-110">
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            )}
                            {!isPreview && <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />}

                            {/* From Section */}
                            <div className="w-full relative mt-2 group pt-5">
                                {!isPreview && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute top-0 left-1 mb-2 block">Sender Details</label>}
                                {isPreview ? (
                                    <div className="text-[15px] font-medium text-slate-800 whitespace-pre-wrap leading-relaxed px-1">{invoice.senderDetails.name + (invoice.senderDetails.address ? '\n' + invoice.senderDetails.address : '')}</div>
                                ) : (
                                    <textarea value={invoice.senderDetails.name + (invoice.senderDetails.address ? '\n' + invoice.senderDetails.address : '')} onChange={(e) => { const lines = e.target.value.split('\n'); setInvoice({ ...invoice, senderDetails: { ...invoice.senderDetails, name: lines[0] || '', address: lines.slice(1).join('\n') } }); }} placeholder="Who is this invoice from? Include Name & Address..." className={`w-full h-28 text-[15px] font-medium text-slate-800 placeholder-slate-300 resize-none leading-relaxed ${inputHoverClass}`}></textarea>
                                )}
                            </div>
                        </div>

                        <div className="w-full sm:w-1/2 flex flex-col sm:items-end text-left sm:text-right gap-6">
                            <input value="INVOICE" readOnly className={`text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase sm:text-right w-full bg-transparent outline-none opacity-90`} />

                            <div className="flex sm:justify-end items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice Code</span>
                                <div className="flex items-center text-lg font-bold text-slate-800">
                                    <span className="text-slate-300 mr-1.5 font-medium">#</span>
                                    {isPreview ? <span>{invoice.invoiceNumber}</span> : <input type="text" value={invoice.invoiceNumber} onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })} className={`w-28 text-left sm:text-right text-lg font-bold ${inputHoverClass}`} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INFO GRID */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-14">
                        {/* Bill To */}
                        <div className="w-full md:w-1/2 relative group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Bill To</label>
                            <div className={`${isPreview ? 'px-1' : ''}`}>
                                {isPreview ? (
                                    <div className="text-[15px] font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">{invoice.clientDetails.name + '\n' + (invoice.clientDetails.address ? invoice.clientDetails.address : '')}</div>
                                ) : (
                                    <textarea value={invoice.clientDetails.name + (invoice.clientDetails.address ? '\n' + invoice.clientDetails.address : '')} onChange={(e) => { const lines = e.target.value.split('\n'); setInvoice({ ...invoice, clientDetails: { ...invoice.clientDetails, name: lines[0] || '', address: lines.slice(1).join('\n') } }); }} placeholder="Client Name & Address details..." className={`w-full h-32 text-[15px] font-medium text-slate-800 placeholder-slate-300 resize-none leading-relaxed ${inputHoverClass}`}></textarea>
                                )}
                            </div>
                        </div>

                        {/* Date / Terms Grid */}
                        <div className="w-full md:w-5/12 ml-auto">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <div className="flex flex-col sm:items-end group">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:pr-2">Date Issued</span>
                                    {isPreview ? <div className="text-[15px] font-medium text-slate-800 sm:pr-2">{invoice.date}</div> : <input type="date" value={invoice.date} onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} className={`w-[140px] text-left sm:text-right text-[15px] font-medium ${inputHoverClass}`} />}
                                </div>
                                <div className="flex flex-col sm:items-end group">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:pr-2">Due Date</span>
                                    {isPreview ? <div className="text-[15px] font-medium text-slate-800 sm:pr-2">{invoice.dueDate}</div> : <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} className={`w-[140px] text-left sm:text-right text-[15px] font-medium ${inputHoverClass}`} />}
                                </div>
                                <div className="flex flex-col sm:items-end col-span-2 group mt-2 border-t border-slate-100 pt-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:pr-2">Payment Terms</span>
                                    {isPreview ? <div className="text-[15px] font-medium text-slate-800 sm:pr-2">{invoice.paymentTerms}</div> : <input type="text" value={invoice.paymentTerms} onChange={(e) => setInvoice({ ...invoice, paymentTerms: e.target.value })} placeholder="e.g. Net 30" className={`w-full sm:w-[220px] text-left sm:text-right text-sm font-medium ${inputHoverClass}`} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LINE ITEMS TABLE */}
                    <div className="mb-14">
                        {/* Table Header */}
                        <div className="w-full bg-[#1b253b] print:bg-[#2a2d34] text-white rounded-xl print:rounded-md flex px-5 py-3.5 mb-3 shadow-[0_4px_12px_rgba(27,37,59,0.1)] print:shadow-none items-center">
                            <div className="text-xs font-bold uppercase tracking-widest w-[50%]">Item Description</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-center w-[15%]">Qty</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-right w-[15%]">Rate</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-right w-[20%]">Amount</div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                            {invoice.items.map((item, index) => (
                                <div key={index} className="flex relative px-4 text-slate-800 py-2 sm:py-3 group border border-transparent hover:border-slate-100 hover:bg-slate-50/50 rounded-xl transition-colors items-center">
                                    <div className="w-[50%] pr-4">
                                        {isPreview ? <div className="whitespace-pre-wrap text-[15px] font-medium">{item.description}</div> : <textarea value={item.description} rows="1" onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Enter product or service..." className={`w-full resize-none text-[15px] font-medium ${inputHoverClass}`} />}
                                    </div>
                                    <div className="w-[15%] text-center">
                                        {isPreview ? <div className="text-[15px] font-medium">{item.quantity}</div> : <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} className={`w-20 text-center text-[15px] font-medium mx-auto ${inputHoverClass}`} />}
                                    </div>
                                    <div className="w-[15%] text-right relative flex items-center justify-end">
                                        {(!isPreview && item.rate > 0) && <span className="text-slate-400 text-[15px] mr-1">{currency}</span>}
                                        {isPreview ? <div className="text-[15px] font-medium">{currency}{parseFloat(item.rate).toFixed(2)}</div> : <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))} className={`w-[90px] text-right text-[15px] font-medium ${inputHoverClass}`} />}
                                    </div>
                                    <div className="w-[20%] text-right text-[15px] font-bold text-slate-900 tracking-tight">
                                        {currency}{item.amount.toFixed(2)}
                                    </div>

                                    {!isPreview && (
                                        <div className="absolute right-[-25px] sm:right-[-40px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto">
                                            <button onClick={() => removeItem(index)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!isPreview && (
                            <button onClick={addItem} className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group px-4">
                                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors text-blue-600">
                                    <Plus size={14} />
                                </div>
                                Add Line Item
                            </button>
                        )}
                    </div>

                    {/* SUMMARY & NOTES */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-12">
                        <div className="w-full md:w-1/2 pr-0 md:pr-10 text-slate-600 flex flex-col gap-8">
                            <div className="group relative">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Notes</label>
                                {isPreview ? <div className="text-[14px] whitespace-pre-wrap px-1 leading-relaxed">{invoice.notes}</div> : <textarea value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} placeholder="Any relevant information not already covered..." className={`w-full h-20 text-[14px] resize-none leading-relaxed ${inputHoverClass}`}></textarea>}
                            </div>
                            <div className="group relative">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Terms & Conditions</label>
                                {isPreview ? <div className="text-[14px] whitespace-pre-wrap px-1 leading-relaxed">{invoice.terms}</div> : <textarea value={invoice.terms} onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })} placeholder="Late fees, payment methods, etc..." className={`w-full h-24 text-[14px] resize-none leading-relaxed ${inputHoverClass}`}></textarea>}
                            </div>
                            <div className="group relative mt-2 pt-6 border-t border-slate-100">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Bank Details & Transfer Info</label>
                                {isPreview ? <div className="text-[14px] whitespace-pre-wrap px-1 leading-relaxed font-medium text-slate-700">{invoice.bankDetails}</div> : <textarea value={invoice.bankDetails} onChange={(e) => setInvoice({ ...invoice, bankDetails: e.target.value })} placeholder="Account name, routing number, IBAN..." className={`w-full h-28 text-[14px] resize-none leading-relaxed font-medium ${inputHoverClass}`}></textarea>}
                            </div>
                        </div>

                        <div className="w-full md:w-[380px] bg-slate-50/50 print:bg-transparent p-6 print:p-0 rounded-3xl border border-slate-100 print:border-none">
                            <table className="w-full text-[15px]">
                                <tbody>
                                    <tr>
                                        <td className="py-2.5 pr-4 text-right font-medium text-slate-500">Subtotal</td>
                                        <td className="py-2.5 text-right font-bold text-slate-800">{currency}{invoice.subtotal.toFixed(2)}</td>
                                    </tr>

                                    {/* Configuration Toggles */}
                                    {!isPreview && (
                                        <tr>
                                            <td colSpan="2" className="pt-4 pb-4 text-right">
                                                <div className="flex justify-end gap-2 pointer-events-auto">
                                                    {!showDiscount && <button onClick={() => setShowDiscount(true)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">+ Discount</button>}
                                                    {!showTax && <button onClick={() => setShowTax(true)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">+ Tax</button>}
                                                    {!showShipping && <button onClick={() => setShowShipping(true)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">+ Shipping</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {showDiscount && (
                                        <tr className="group">
                                            <td className="py-2 pr-4 text-right flex items-center justify-end gap-1.5 font-medium text-slate-500">
                                                {!isPreview && <button onClick={() => { setInvoice({ ...invoice, discount: 0 }); setShowDiscount(false) }} className="w-5 h-5 rounded-md text-slate-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"><X size={12} /></button>}
                                                Discount ({invoice.discount || 0}%)
                                            </td>
                                            <td className="py-2 text-right">
                                                {isPreview ? <span className="font-bold text-slate-800">-{currency}{(invoice.discountAmount || 0).toFixed(2)}</span> : (
                                                    <div className="flex justify-end items-center">
                                                        <input type="number" value={invoice.discount} onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })} className={`w-20 text-right font-bold text-slate-800 ${inputHoverClass}`} /><span className="text-slate-400 font-bold ml-1">%</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {showTax && (
                                        <tr className="group">
                                            <td className="py-2 pr-4 text-right flex items-center justify-end gap-1.5 font-medium text-slate-500">
                                                {!isPreview && <button onClick={() => { setInvoice({ ...invoice, taxRate: 0 }); setShowTax(false) }} className="w-5 h-5 rounded-md text-slate-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"><X size={12} /></button>}
                                                Tax Ratio
                                            </td>
                                            <td className="py-2 text-right">
                                                {isPreview ? <span className="font-bold text-slate-800">{invoice.taxRate}% ({currency}{invoice.taxAmount.toFixed(2)})</span> : (
                                                    <div className="flex justify-end items-center">
                                                        <input type="number" value={invoice.taxRate} onChange={(e) => setInvoice({ ...invoice, taxRate: Number(e.target.value) })} className={`w-16 text-right font-bold text-slate-800 ${inputHoverClass}`} /><span className="text-slate-400 text-sm ml-1">%</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {showShipping && (
                                        <tr className="group">
                                            <td className="py-2 pr-4 text-right flex items-center justify-end gap-1.5 font-medium text-slate-500">
                                                {!isPreview && <button onClick={() => { setInvoice({ ...invoice, shipping: 0 }); setShowShipping(false) }} className="w-5 h-5 rounded-md text-slate-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"><X size={12} /></button>}
                                                Shipping
                                            </td>
                                            <td className="py-2 text-right">
                                                {isPreview ? <span className="font-bold text-slate-800">{currency}{invoice.shipping.toFixed(2)}</span> : (
                                                    <div className="flex justify-end items-center">
                                                        <span className="text-slate-400 text-sm mr-1">{currency}</span><input type="number" value={invoice.shipping} onChange={(e) => setInvoice({ ...invoice, shipping: Number(e.target.value) })} className={`w-20 text-right font-bold text-slate-800 ${inputHoverClass}`} />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td className="py-3 pr-4 text-right font-bold text-slate-800 text-lg border-t border-slate-200/60 mt-4">Total</td>
                                        <td className="py-3 text-right font-black text-slate-900 text-xl border-t border-slate-200/60 mt-4">{currency}{invoice.total.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-right font-medium text-slate-500 pt-6">Amount Paid</td>
                                        <td className="py-2 text-right pt-6">
                                            {isPreview ? <span className="font-bold text-slate-800">{currency}{invoice.amountPaid.toFixed(2)}</span> : (
                                                <div className="flex justify-end items-center">
                                                    <span className="text-slate-400 text-sm mr-1">{currency}</span><input type="number" value={invoice.amountPaid} onChange={(e) => setInvoice({ ...invoice, amountPaid: Number(e.target.value) })} className={`w-24 text-right font-bold text-blue-600 bg-white border border-blue-200 focus:border-blue-500 hover:border-blue-300 transition-all outline-none rounded-lg p-1.5 shadow-[0_2px_10px_rgba(37,99,235,0.1)]`} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className={`mt-6 w-full ${isPreview ? 'bg-slate-100 print:bg-slate-100 text-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'} rounded-2xl p-5 flex justify-between items-center transition-all`}>
                                <span className="font-bold tracking-widest uppercase text-xs opacity-90">Balance Due</span>
                                <span className="font-black text-3xl tracking-tight leading-none">{currency}{invoice.balanceDue.toFixed(2)}</span>
                            </div>

                            {/* Action under balance due */}
                            <div className="flex justify-end items-center gap-3 w-full mt-6 pt-3 print:hidden">
                                <button onClick={handleSaveInvoice} className="px-8 py-3.5 text-sm font-bold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2">
                                    <Save size={16} /> Save Invoice Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div> {/* CLOSES invoice-preview */}

                {/* VISUAL PREVIEW RENDERER */}
                <div id="print-template-wrapper" className={`w-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80 p-8 sm:p-12 rounded-2xl transition-all ${isPreviewMode ? 'block print:block' : 'hidden print:block'} print:shadow-none print:border-none print:p-0 mb-8`}>
                    <InvoicePrintTemplate invoice={invoice} currency={currency} templateTheme={selectedTemplate} />
                </div>

            </div>

            {/* RIGHT COLUMN: ACTION SIDEBAR */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5 print:hidden sticky top-8">

                {/* Configuration Panel */}
                <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80 rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Settings2 size={18} className="text-blue-500" />
                        <h3 className="text-xs font-black tracking-widest uppercase text-slate-800">Invoice Settings</h3>
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Currency</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-sm rounded-xl py-3.5 pl-4 pr-10 font-bold cursor-pointer hover:bg-slate-50 transition-all outline-none appearance-none">
                            <option value="$">US Dollar (USD $)</option>
                            <option value="€">Euro (EUR €)</option>
                            <option value="£">British Pound (GBP £)</option>
                            <option value="₹">Indian Rupee (INR ₹)</option>
                        </select>
                        <div className="pointer-events-none text-slate-400 absolute right-4 bottom-[14px]"><svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" /></svg></div>
                    </div>

                    {templates.length > 0 && (
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Theme Template</label>
                            <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-sm rounded-xl py-3.5 pl-10 pr-10 font-bold cursor-pointer hover:bg-slate-50 transition-all outline-none appearance-none">
                                {templates.map(t => (
                                    <option key={t._id} value={t._id}>{t.name} Theme</option>
                                ))}
                            </select>
                            <div className="pointer-events-none text-blue-500 absolute left-3.5 bottom-3.5"><Palette size={16} /></div>
                            <div className="pointer-events-none text-slate-400 absolute right-4 bottom-[14px]"><svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" /></svg></div>
                        </div>
                    )}
                </div>

                {/* Actions Panel */}
                <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80 rounded-2xl p-6 flex flex-col gap-3">
                    <button onClick={togglePreview} className="w-full py-4 text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2">
                        {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                        {isPreviewMode ? 'Back to Editor' : 'Preview Layout'}
                    </button>
                    <button onClick={generatePDF} className="w-full py-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 rounded-xl transition-all shadow-md shadow-blue-500/30 flex justify-center items-center gap-2">
                        <Printer size={16} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
