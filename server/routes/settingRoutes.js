const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// Get settings
router.get('/', async (req, res) => {
    try {
        let settings = await Setting.findOne({ key: 'global' });
        if (!settings) {
            settings = await Setting.create({ key: 'global', appLogo: '' });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update settings
router.put('/', async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate(
            { key: 'global' },
            req.body,
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
