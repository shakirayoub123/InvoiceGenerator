const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    leadName: { type: String, required: true },
    leadEmail: { type: String },
    leadPhone: { type: String },
    leadUrl: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Declined'], default: 'New' },
    dateReferred: { type: Date, default: Date.now }
});

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
    url: { type: String },
    referrals: [referralSchema],
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
