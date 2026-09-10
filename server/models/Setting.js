const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: { type: String, default: 'global', unique: true },
    appLogo: { type: String, default: '' }, // Base64 for the main brand logo
});

module.exports = mongoose.model('Setting', settingSchema);
