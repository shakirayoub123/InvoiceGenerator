import React from 'react';

const InvoicePrintTemplate = ({ invoice, currency, templateTheme }) => {
    const themeColor = templateTheme?.color || '#333333';

    return (
        <div className="w-full bg-[#ffffff] text-[#333333]" style={{ padding: '0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-14">
                {/* Logo & From */}
                <div className="w-[55%] flex flex-col">
                    {invoice.logo && (
                        <div className="mb-8">
                            <img src={invoice.logo} alt="Logo" className="max-h-24 object-contain" />
                        </div>
                    )}

                    <div className="text-[13px] text-[#555555] whitespace-pre-wrap leading-[1.6]">
                        {invoice.senderDetails.name && <div className="font-bold text-[#333333]">{invoice.senderDetails.name}</div>}
                        {invoice.senderDetails.address}
                    </div>

                    <div className="mt-10">
                        <div className="text-[13px] text-[#888888] mb-2">Bill To:</div>
                        <div className="text-[13px] text-[#555555] whitespace-pre-wrap leading-[1.6]">
                            {invoice.clientDetails.name && <div className="font-bold text-[#333333]">{invoice.clientDetails.name}</div>}
                            {invoice.clientDetails.address}
                        </div>
                    </div>
                </div>

                {/* Title & Info */}
                <div className="w-[40%] flex flex-col items-end">
                    <h1 className="text-[44px] font-normal text-[#333333] mb-1 uppercase" style={templateTheme && templateTheme.color ? { color: templateTheme.color } : {}}>
                        INVOICE
                    </h1>
                    <div className="text-[#888888] text-[15px] mb-12"># {invoice.invoiceNumber} {invoice.clientDetails?.name || ''}</div>

                    <table className="w-full text-[13px] mb-2">
                        <tbody>
                            <tr>
                                <td className="text-right text-[#888888] py-1.5 pr-8 w-[60%]">Date:</td>
                                <td className="text-right text-[#333333]">{invoice.date}</td>
                            </tr>
                            {invoice.paymentTerms && (
                                <tr>
                                    <td className="text-right text-[#888888] py-1.5 pr-8">Payment Terms:</td>
                                    <td className="text-right text-[#333333]">{invoice.paymentTerms}</td>
                                </tr>
                            )}
                            {invoice.dueDate && (
                                <tr>
                                    <td className="text-right text-[#888888] py-1.5 pr-8">Due Date:</td>
                                    <td className="text-right text-[#333333]">{invoice.dueDate}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="w-full bg-[#f4f4f4] py-2 px-6 flex justify-between items-center rounded-sm">
                        <span className="font-bold text-[14px] text-[#333333]">Balance Due:</span>
                        <span className="font-bold text-[14px] text-[#333333]">{currency}{invoice.balanceDue.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="w-full mb-12">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[#ffffff]" style={{ backgroundColor: templateTheme && templateTheme.color ? templateTheme.color : '#4b4b4b' }}>
                            <th className="py-2 px-4 font-normal text-[13px] w-[55%] rounded-l-sm">Item</th>
                            <th className="py-2 px-4 font-normal text-[13px] text-left w-[15%]">Quantity</th>
                            <th className="py-2 px-4 font-normal text-[13px] text-right w-[15%]">Rate</th>
                            <th className="py-2 px-4 font-normal text-[13px] text-right w-[15%] rounded-r-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-4 px-4 text-[13px] font-bold text-[#333333] whitespace-pre-wrap align-top">{item.description}</td>
                                <td className="py-4 px-4 text-[13px] text-[#555555] text-left align-top">{item.quantity}</td>
                                <td className="py-4 px-4 text-[13px] text-[#555555] text-right align-top">{currency}{parseFloat(item.rate).toFixed(2)}</td>
                                <td className="py-4 px-4 text-[13px] text-[#555555] text-right align-top">{currency}{item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Notes */}
            <div className="flex justify-between items-start">
                <div className="w-[55%] flex flex-col gap-5 pr-8 mt-10">
                    {invoice.notes && (
                        <div>
                            <div className="text-[13px] text-[#888888] mb-1">Notes:</div>
                            <div className="text-[13px] text-[#333333] whitespace-pre-wrap leading-[1.6]">{invoice.notes}</div>
                        </div>
                    )}
                    {invoice.terms && (
                        <div>
                            <div className="text-[13px] text-[#888888] mb-1">Terms:</div>
                            <div className="text-[13px] text-[#333333] whitespace-pre-wrap leading-[1.6]">{invoice.terms}</div>
                        </div>
                    )}
                    {invoice.bankDetails && (
                        <div>
                            <div className="text-[13px] text-[#888888] mb-1">Bank Details:</div>
                            <div className="text-[13px] text-[#333333] whitespace-pre-wrap leading-[1.6]">
                                {invoice.bankDetails}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-[40%]">
                    <table className="w-full text-[13px]">
                        <tbody>
                            <tr>
                                <td className="py-1.5 text-right text-[#888888] pr-8 w-[60%]">Subtotal:</td>
                                <td className="py-1.5 text-right text-[#333333]">{currency}{invoice.subtotal.toFixed(2)}</td>
                            </tr>
                            {invoice.discount > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-[#888888] pr-8">Discount ({invoice.discount}%):</td>
                                    <td className="py-1.5 text-right text-[#333333]">-{currency}{(invoice.discountAmount || 0).toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.taxRate > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-[#888888] pr-8">Tax ({invoice.taxRate}%):</td>
                                    <td className="py-1.5 text-right text-[#333333]">{currency}{invoice.taxAmount.toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.shipping > 0 && (
                                <tr>
                                    <td className="py-1.5 text-right text-[#888888] pr-8">Shipping:</td>
                                    <td className="py-1.5 text-right text-[#333333]">{currency}{invoice.shipping.toFixed(2)}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="py-2 text-right text-[#888888] pr-8">Total:</td>
                                <td className="py-2 text-right text-[#333333]">{currency}{invoice.total.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 text-right text-[#888888] pr-8 pt-4">Amount Paid:</td>
                                <td className="py-1.5 text-right text-[#333333] pt-4">{currency}{invoice.amountPaid.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicePrintTemplate;
