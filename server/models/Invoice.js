const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    paymentTerms: { type: String },
    logo: { type: String }, // Base64 string for logo

    senderDetails: {
        name: { type: String, required: true, default: 'Mir Web Solutions' },
        email: { type: String },
        address: { type: String },
        phone: { type: String }
    },

    clientDetails: {
        name: { type: String, required: true },
        email: { type: String },
        address: { type: String },
        phone: { type: String }
    },

    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],

    notes: { type: String },
    terms: { type: String },
    bankDetails: { type: String },

    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    currency: { type: String, default: '₹' },

    status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
