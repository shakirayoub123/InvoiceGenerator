const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#3b82f6' },
    layout: { type: String, default: 'modern' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);
