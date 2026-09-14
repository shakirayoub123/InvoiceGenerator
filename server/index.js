const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

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

    if (mongoUri) {
        try {
            console.log('Attempting to connect to Cloud Data source...');
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
            console.log(`Successfully connected to Cloud MongoDB at ${mongoUri}`);
            return;
        } catch (err) {
            console.error('Cloud Connection Failed (Likely blocked by ISP/Firewall).', err.message);
            console.log('Automatically falling back to fast Local Memory Database to prevent freezing...');
        }
    } else {
        console.log('No MONGODB_URI found, starting Local Memory Database...');
    }

    const mongoServer = await MongoMemoryServer.create();
    const fallbackUri = mongoServer.getUri();
    await mongoose.connect(fallbackUri);
    console.log(`Connected to fallback Local MongoDB at ${fallbackUri}`);
};

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
