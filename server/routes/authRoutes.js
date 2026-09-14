const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Temporary in-memory store for OTPs (For production use Redis or MongoDB)
const otpStore = new Map();



const dns = require('dns').promises;

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with an expiration of 10 minutes
        otpStore.set(email.toLowerCase(), { otp, expires: Date.now() + 10 * 60 * 1000 });

        // Resolve IPv4 for Gmail strictly to bypass Render IPv6 Blocks
        const ipv4Addresses = await dns.resolve4('smtp.gmail.com');
        const smtpHost = ipv4Addresses.length > 0 ? ipv4Addresses[0] : 'smtp.gmail.com';

        // Configure Nodemailer dynamically with the resolved IPv4 Address
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL || 'Miritsolutions@gmail.com',
                pass: process.env.SMTP_PASSWORD || 'rllkbysqrzoyowiz'
            },
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send Email
        const mailOptions = {
            from: 'Mir Web Solutions <Miritsolutions@gmail.com>',
            to: email,
            subject: 'Your Admin Login OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1e293b;">Admin Authentication</h2>
                    <p style="color: #64748b;">You requested a One Time Password to access the Admin Panel.</p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="color: #64748b; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[AUTH] OTP successfully sent to ${email} via IPv4 ${smtpHost}`);
        res.json({ success: true, message: 'OTP sent successfully!' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email.toLowerCase());

    if (!storedData) {
        return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
    }

    if (Date.now() > storedData.expires) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (storedData.otp === otp) {
        otpStore.delete(email.toLowerCase());
        res.json({ success: true, message: 'Verified successfully', token: 'mock-jwt-token-123' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Default Static Login Fallback
    if (email.toLowerCase() === 'admin@miritsolutions.com' && password === 'admin123') {
        res.json({ success: true, message: 'Logged in successfully', token: 'mock-jwt-token-123' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
});

module.exports = router;
