const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

router.get('/', async (req, res) => {
    try {
        const templates = await Template.find().sort({ createdAt: -1 });
        res.json(templates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const template = new Template({
        name: req.body.name,
        color: req.body.color,
        layout: req.body.layout
    });
    try {
        const newTemplate = await template.save();
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Template.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
