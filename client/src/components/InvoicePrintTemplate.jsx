import React from 'react';

const InvoicePrintTemplate = ({ invoice, currency, templateTheme }) => {
    const themeColor = templateTheme?.color || '#333333';

    return (
        <div className="w-full bg-white text-slate-800 font-sans" style={{ padding: '0' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-10">
                {/* Logo & From */}
                <div className="w-1/2 flex flex-col">
                    {invoice.logo && (
                        <div className="mb-4">
                            <img src={invoice.logo} alt="Logo" className="max-h-32 object-contain" />
                        </div>
                    )}

                    <div className="w-[80%] h-px bg-slate-300 mt-2 mb-4"></div>

                    <div className="text-[13px] font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {invoice.senderDetails.name + '\n' + (invoice.senderDetails.address || '')}
                    </div>

                    <div className="mt-8">
                        <div className="text-[14px] font-bold text-slate-800 mb-1">Bill To:</div>
                        <div className="text-[13px] font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {invoice.clientDetails.name + (invoice.clientDetails.address ? '\n' + invoice.clientDetails.address : '')}
                        </div>
                    </div>
                </div>

                {/* Title & Info */}
                <div className="w-1/2 flex flex-col items-end">
                    <h1 className="text-5xl tracking-tight font-black uppercase mb-2" style={{ color: themeColor }}>INVOICE</h1>
                    <div className="text-slate-500 mb-10 mr-1 font-bold"># {invoice.invoiceNumber}</div>

                    <table className="w-[80%] text-[13px] mb-4">
                        <tbody>
                            <tr>
                                <td className="text-right text-slate-500 py-1.5 pr-6">Date:</td>
                                <td className="text-right font-medium text-slate-800">{invoice.date}</td>
                            </tr>
                            {invoice.paymentTerms && (
                                <tr>
                                    <td className="text-right text-slate-500 py-1.5 pr-6">Payment Terms:</td>
                                    <td className="text-right font-medium text-slate-800">{invoice.paymentTerms}</td>
                                </tr>
                            )}
                            {invoice.dueDate && (
                                <tr>
                                    <td className="text-right text-slate-500 py-1.5 pr-6">Due Date:</td>
                                    <td className="text-right font-medium text-slate-800">{invoice.dueDate}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="w-[80%] bg-slate-100 py-2.5 px-4 flex justify-between items-center rounded-sm">
                        <span className="font-bold text-[14px] text-slate-800">Balance Due:</span>
                        <span className="font-bold text-[14px] text-slate-800">{currency}{invoice.balanceDue.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="w-full mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-white" style={{ backgroundColor: themeColor }}>
                            <th className="py-2 px-4 font-bold tracking-widest uppercase text-[12px] w-[55%] rounded-l">Item</th>
                            <th className="py-2 px-4 font-bold tracking-widest uppercase text-[12px] text-center w-[15%]">Quantity</th>
                            <th className="py-2 px-4 font-bold tracking-widest uppercase text-[12px] text-right w-[15%]">Rate</th>
                            <th className="py-2 px-4 font-bold tracking-widest uppercase text-[12px] text-right w-[15%] rounded-r">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-slate-100">
                                <td className="py-4 px-4 text-[13px] font-bold text-slate-800 whitespace-pre-wrap">{item.description}</td>
                                <td className="py-4 px-4 text-[13px] text-center text-slate-800">{item.quantity}</td>
                                <td className="py-4 px-4 text-[13px] text-right text-slate-800">{currency}{parseFloat(item.rate).toFixed(2)}</td>
                                <td className="py-4 px-4 text-[13px] text-right text-slate-800">{currency}{item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Notes */}
            <div className="flex justify-between items-start">
                <div className="w-1/2 flex flex-col gap-6 pr-8">
                    {invoice.notes && (
                        <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-1">Notes:</div>
                            <div className="text-[13px] text-slate-800 whitespace-pre-wrap leading-relaxed">{invoice.notes}</div>
                        </div>
                    )}
                    {invoice.terms && (
                        <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-1">Terms:</div>
                            <div className="text-[13px] text-slate-800 whitespace-pre-wrap leading-relaxed">{invoice.terms}</div>
                        </div>
                    )}
                    {invoice.bankDetails && (
                        <div>
                            <div className="text-[13px] font-bold text-slate-800 mb-1">Bank Details:</div>
                            <div className="text-[13px] font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">{invoice.bankDetails}</div>
                        </div>
                    )}
                </div>

                <div className="w-[45%]">
                    <table className="w-full text-[13px]">
                        <tbody>
                            <tr>
                                <td className="py-1.5 text-right text-slate-500 pr-8 w-[60%]">Subtotal:</td>
                                <td className="py-1.5 text-right font-medium text-slate-800">{currency}{invoice.subtotal.toFixed(2)}</td>
                            </tr>
                            {invoice.discount > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-slate-500 pr-8">Discount ({invoice.discount}%):</td>
                                    <td className="py-1.5 text-right font-medium text-slate-800">-{currency}{(invoice.discountAmount || 0).toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.taxRate > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-slate-500 pr-8">Tax ({invoice.taxRate}%):</td>
                                    <td className="py-1.5 text-right font-medium text-slate-800">{currency}{invoice.taxAmount.toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.shipping > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-slate-500 pr-8">Shipping:</td>
                                    <td className="py-1.5 text-right font-medium text-slate-800">{currency}{invoice.shipping.toFixed(2)}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="py-2 text-right text-slate-500 pr-8">Total:</td>
                                <td className="py-2 text-right font-medium text-[14px] text-slate-800">{currency}{invoice.total.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-right text-slate-500 pr-8 border-t border-slate-100 pt-4 mt-2">Amount Paid:</td>
                                <td className="py-2 text-right font-medium text-slate-800 border-t border-slate-100 pt-4 mt-2">{currency}{invoice.amountPaid.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicePrintTemplate;
