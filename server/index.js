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
app.use('/api/invoices', invoiceRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection
const connectDB = async () => {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.log('No MONGODB_URI found, starting in-memory MongoDB Server...');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    }

    mongoose.connect(mongoUri)
        .then(() => console.log(`Connected to MongoDB at ${mongoUri}`))
        .catch(err => console.error('MongoDB connection error:', err));
};

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
