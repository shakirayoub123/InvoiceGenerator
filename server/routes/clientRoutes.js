const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Get all clients (For admin panel)
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().sort({ updatedAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update client (or update a referral status)
router.put('/:id', async (req, res) => {
    try {
        const clientId = req.params.id;
        const originalClient = await Client.findById(clientId);

        let statusChangedNotification = null;

        // Detect if a status changed
        if (req.body.referrals && originalClient && originalClient.referrals) {
            req.body.referrals.forEach(incomingRef => {
                const originalRef = originalClient.referrals.find(r => r._id.toString() === incomingRef._id?.toString());
                if (originalRef && originalRef.status !== incomingRef.status) {
                    statusChangedNotification = {
                        myEmail: originalClient.email,
                        myName: originalClient.name,
                        leadName: incomingRef.leadName,
                        newStatus: incomingRef.status
                    };
                }
            });
        }

        const client = await Client.findByIdAndUpdate(clientId, req.body, { new: true });

        // Send email to referrer if status changed
        if (statusChangedNotification) {
            const mailOptions = {
                from: 'Mir Web Solutions <Miritsolutions@gmail.com>',
                to: statusChangedNotification.myEmail,
                subject: `Referral Update: ${statusChangedNotification.leadName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #1e293b;">Referral Status Updated</h2>
                        <p style="color: #64748b; font-size: 16px;">Hello ${statusChangedNotification.myName},</p>
                        <p style="color: #334155; margin-top: 20px;">The status for your referral <strong>${statusChangedNotification.leadName}</strong> has been updated to:</p>
                        <div style="margin: 20px auto; padding: 12px 24px; background-color: #f1f5f9; border-radius: 8px; display: inline-block;">
                            <span style="font-weight: bold; color: #2563eb; font-size: 18px;">${statusChangedNotification.newStatus}</span>
                        </div>
                        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Thank you for partnering with Mir Web Solutions!</p>
                    </div>
                `
            };
            try {
                await transporter.sendMail(mailOptions);
                console.log(`[EMAIL] Status update sent to ${statusChangedNotification.myEmail}`);
            } catch (err) {
                console.error('[EMAIL ERROR] Failed to send status update notification:', err.message);
            }
        }

        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete client
router.delete('/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Public Referral Submission
router.post('/refer', async (req, res) => {
    try {
        const { myName, myEmail, myPhone, myCompany, myUrl, leadName, leadEmail, leadPhone, leadUrl, notes } = req.body;

        if (!myEmail || !leadName) {
            return res.status(400).json({ message: 'Your email and Lead name are required.' });
        }

        // Find existing client or create a new one
        let client = await Client.findOne({ email: myEmail.toLowerCase() });

        if (!client) {
            client = new Client({
                name: myName,
                email: myEmail.toLowerCase(),
                phone: myPhone,
                company: myCompany,
                url: myUrl
            });
        } else {
            // Update URL if the client already exists but didn't have one
            if (myUrl && !client.url) client.url = myUrl;
        }

        // Add the referral
        client.referrals.push({
            leadName,
            leadEmail,
            leadPhone,
            leadUrl,
            notes,
            status: 'New'
        });

        await client.save();

        // Send Email Notification to Admin
        try {
            const mailOptions = {
                from: 'Mir Web Solutions <Miritsolutions@gmail.com>',
                to: 'admin@miritsolutions.com, Miritsolutions@gmail.com, hello@mirwebsolutions.com', // Sending to all admins

                subject: `New Enterprise Referral: ${leadName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #1e293b;">New Client Referral</h2>
                        <p style="color: #64748b; font-size: 16px;">You have received a new enterprise referral submission.</p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: left;">
                            <h3 style="color: #2563eb; margin-top: 0;">Referrer Details (Partner)</h3>
                            <p style="color: #334155; margin: 5px 0;"><strong>Name:</strong> ${myName}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>Email:</strong> ${myEmail}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>WhatsApp:</strong> ${myPhone || 'N/A'}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>Company:</strong> ${myCompany || 'N/A'}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>URL:</strong> ${myUrl ? `<a href="${myUrl}">${myUrl}</a>` : 'N/A'}</p>
                            
                            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
                            
                            <h3 style="color: #2563eb; margin-top: 0;">Lead Target Details</h3>
                            <p style="color: #334155; margin: 5px 0;"><strong>Entity Name:</strong> ${leadName}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>Contact Email:</strong> ${leadEmail || 'N/A'}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>WhatsApp:</strong> ${leadPhone || 'N/A'}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>URL:</strong> ${leadUrl ? `<a href="${leadUrl}">${leadUrl}</a>` : 'N/A'}</p>
                            <p style="color: #334155; margin: 5px 0;"><strong>Context/Needs:</strong> ${notes || 'None provided'}</p>
                        </div>
                        <p style="color: #64748b; font-size: 13px;">Log in to the Admin Dashboard to review this lead.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Referral notification sent to Admin for Lead: ${leadName}`);
        } catch (emailError) {
            console.error('[EMAIL ERROR] Failed to send referral notification:', emailError.message);
            // We don't want the API to fail if the email fails, so we just catch it here.
        }

        res.status(201).json({ success: true, message: 'Referral submitted successfully!', client });
    } catch (error) {
        console.error('Referral Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
