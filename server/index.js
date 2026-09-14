const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const invoiceRoutes = require('./routes/invoiceRoutes');
const settingRoutes = require('./routes/settingRoutes');
const templateRoutes = require('./routes/templateRoutes');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
app.use('/api/invoices', invoiceRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// MongoDB connection
const connectDB = async () => {
    let mongoUri = process.env.MONGODB_URI || 'mongodb+srv://miritsolutions_db_user:0LSgKuSGcvNhTHl9@cluster0.bpncrzz.mongodb.net/InvoiceGenerator?retryWrites=true&w=majority&appName=Cluster0';

    try {
        console.log('Attempting to connect to Cloud Data source...');
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`Successfully connected to Cloud MongoDB at ${mongoUri}`);
    } catch (err) {
        console.error('Cloud Connection Failed. PLEASE ENSURE 0.0.0.0/0 IS WHITELISTED IN MONGODB ATLAS NETWORK ACCESS.', err.message);
        // Do not crash the server completely, but do not download MongoMemoryServer either!
    }
};

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
