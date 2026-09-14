import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    logoBox: { width: '50%', alignItems: 'flex-start' },
    logo: { maxHeight: 95, maxWidth: 250, objectFit: 'contain', objectPositionX: 'left', marginBottom: 30 },
    textLine: { fontSize: 10, color: '#333333', lineHeight: 1.3 },
    textLineGray: { fontSize: 10, color: '#555555', lineHeight: 1.3 },
    bold: { fontFamily: 'Helvetica-Bold', color: '#111111' },
    billToBox: { marginTop: 25 },
    billToTitle: { fontSize: 10, color: '#888888', marginBottom: 8 },
    titleBox: { width: '50%', alignItems: 'flex-end' },
    invoiceTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
    invoiceNumber: { color: '#888888', fontSize: 11, marginBottom: 30 },
    metaTable: { width: '100%', marginBottom: 10 },
    metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 },
    metaLabel: { color: '#888888', width: '60%', textAlign: 'right', paddingRight: 20 },
    metaValue: { textAlign: 'right', color: '#333333' },
    balanceBox: { backgroundColor: '#f4f4f4', padding: 8, flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20, borderRadius: 2 },
    balanceTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11 },
    balanceAmount: { fontFamily: 'Helvetica-Bold', fontSize: 11 },
    table: { width: '100%', marginBottom: 30 },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: '#4b4b4b', color: '#ffffff', paddingVertical: 8, borderRadius: 2 },
    tableHeaderCol1: { width: '55%', paddingLeft: 10 },
    tableHeaderCol2: { width: '15%', paddingLeft: 10 },
    tableHeaderCol3: { width: '15%', paddingLeft: 10, textAlign: 'right' },
    tableHeaderCol4: { width: '15%', paddingLeft: 10, paddingRight: 10, textAlign: 'right' },
    tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eeeeee' },
    tableCol1: { width: '55%', paddingLeft: 10 },
    tableCol2: { width: '15%', paddingLeft: 10, color: '#555555' },
    tableCol3: { width: '15%', paddingLeft: 10, textAlign: 'right', color: '#555555' },
    tableCol4: { width: '15%', paddingLeft: 10, paddingRight: 10, textAlign: 'right', color: '#555555' },
    bottomSection: { flexDirection: 'column' },
    totalsWrapper: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 40 },
    totalsBox: { width: '40%' },
    totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
    totalLabel: { color: '#888888', paddingRight: 20 },
    totalValue: { textAlign: 'right', minWidth: 60 },
    totalRowBold: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6, marginBottom: 6 },
    amountPaidRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
    notesSectionContainer: { width: '100%' },
    noteItem: { marginBottom: 20 },
    noteTitle: { color: '#888888', marginBottom: 6 },
});

const InvoiceReactPDFTemplate = ({ invoice, currency, templateTheme }) => {
    const themeColor = templateTheme?.color || '#4b4b4b';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        {invoice.logo && (
                            <Image src={invoice.logo} style={styles.logo} />
                        )}
                        <View>
                            {invoice.senderDetails.name && <Text style={[styles.textLine, styles.bold]}>{invoice.senderDetails.name}</Text>}
                            {(invoice.senderDetails.address || '').split('\n').filter(l => l.trim() !== '').map((line, i) => (
                                <Text key={i} style={styles.textLine}>{line}</Text>
                            ))}
                        </View>
                        <View style={styles.billToBox}>
                            <Text style={styles.billToTitle}>Bill To:</Text>
                            <View>
                                {invoice.clientDetails.name && <Text style={[styles.textLine, styles.bold]}>{invoice.clientDetails.name}</Text>}
                                {(invoice.clientDetails.address || '').split('\n').filter(l => l.trim() !== '').map((line, i) => (
                                    <Text key={i} style={styles.textLine}>{line}</Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.titleBox}>
                        <Text style={[styles.invoiceTitle, { color: themeColor }]}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}># {invoice.invoiceNumber}</Text>

                        <View style={styles.metaTable}>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Date:</Text>
                                <Text style={styles.metaValue}>{invoice.date}</Text>
                            </View>
                            {invoice.paymentTerms && (
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaLabel}>Payment Terms:</Text>
                                    <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
                                </View>
                            )}
                            {invoice.dueDate && (
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaLabel}>Due Date:</Text>
                                    <Text style={styles.metaValue}>{invoice.dueDate}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.balanceBox}>
                            <Text style={styles.balanceTitle}>Balance Due:</Text>
                            <Text style={styles.balanceAmount}>{currency}{invoice.balanceDue.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableHeaderRow, { backgroundColor: themeColor }]}>
                        <Text style={[styles.tableHeaderCol1, { color: '#ffffff' }]}>Item</Text>
                        <Text style={[styles.tableHeaderCol2, { color: '#ffffff' }]}>Quantity</Text>
                        <Text style={[styles.tableHeaderCol3, { color: '#ffffff' }]}>Rate</Text>
                        <Text style={[styles.tableHeaderCol4, { color: '#ffffff' }]}>Amount</Text>
                    </View>
                    {invoice.items.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCol1, styles.bold]}>{item.description}</Text>
                            <Text style={styles.tableCol2}>{item.quantity}</Text>
                            <Text style={styles.tableCol3}>{currency}{parseFloat(item.rate).toFixed(2)}</Text>
                            <Text style={styles.tableCol4}>{currency}{item.amount.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSection}>
                    {/* Totals Section */}
                    <View style={styles.totalsWrapper}>
                        <View style={styles.totalsBox}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal:</Text>
                                <Text style={styles.totalValue}>{currency}{invoice.subtotal.toFixed(2)}</Text>
                            </View>
                            {invoice.discount > 0 && (
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Discount ({invoice.discount}%):</Text>
                                    <Text style={styles.totalValue}>-{currency}{(invoice.discountAmount || 0).toFixed(2)}</Text>
                                </View>
                            )}
                            {invoice.taxRate > 0 && (
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
                                    <Text style={styles.totalValue}>{currency}{invoice.taxAmount.toFixed(2)}</Text>
                                </View>
                            )}
                            {invoice.shipping > 0 && (
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Shipping:</Text>
                                    <Text style={styles.totalValue}>{currency}{invoice.shipping.toFixed(2)}</Text>
                                </View>
                            )}
                            <View style={styles.totalRowBold}>
                                <Text style={[styles.totalLabel, styles.bold]}>Total:</Text>
                                <Text style={[styles.totalValue, styles.bold]}>{currency}{invoice.total.toFixed(2)}</Text>
                            </View>
                            <View style={styles.amountPaidRow}>
                                <Text style={styles.totalLabel}>Amount Paid:</Text>
                                <Text style={styles.totalValue}>{currency}{invoice.amountPaid.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes, Terms, Bank Details (Full Width At Bottom) */}
                    <View style={styles.notesSectionContainer}>
                        {invoice.notes && (
                            <View style={styles.noteItem}>
                                <Text style={styles.noteTitle}>Notes:</Text>
                                {(invoice.notes || '').split('\n').filter(l => l.trim() !== '').map((line, i) => (
                                    <Text key={i} style={styles.textLine}>{line}</Text>
                                ))}
                            </View>
                        )}
                        {invoice.terms && (
                            <View style={styles.noteItem}>
                                <Text style={styles.noteTitle}>Terms:</Text>
                                {(invoice.terms || '').split('\n').filter(l => l.trim() !== '').map((line, i) => (
                                    <Text key={i} style={styles.textLine}>{line}</Text>
                                ))}
                            </View>
                        )}
                        {invoice.bankDetails && (
                            <View style={styles.noteItem}>
                                <Text style={styles.noteTitle}>Bank Details:</Text>
                                {(invoice.bankDetails || '').split('\n').filter(l => l.trim() !== '').map((line, i) => (
                                    <Text key={i} style={styles.textLine}>{line}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default InvoiceReactPDFTemplate;
