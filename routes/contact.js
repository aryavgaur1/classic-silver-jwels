const express   = require('express');
const nodemailer= require('nodemailer');
const Enquiry   = require('../models/Enquiry');
const auth      = require('../middleware/auth');
const router    = express.Router();

// POST /api/contact  — public (send enquiry)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const service = req.body.service || 'Classic Silver Palace Jewellery Enquiry';

    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email, and message are required' });

    // Save to DB
    await Enquiry.create({ name, email, phone, service, message });

    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      // EMAIL 1 — Owner ko notification
      await transporter.sendMail({
        from: `"Classic Silver Palace" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Enquiry from ${name} — Classic Silver Palace`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e0d9cf;border-radius:8px;overflow:hidden">
            <div style="background:#1a1a1a;padding:20px 24px">
              <h2 style="color:#d4af37;font-family:Georgia,serif;margin:0;font-weight:400">New Enquiry Received</h2>
              <p style="color:#ccc;margin:4px 0 0;font-size:13px">Classic Silver Palace – Contact Form</p>
            </div>
            <div style="padding:24px;background:#fffdf9">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 0;color:#888;width:90px"><strong>Name</strong></td><td style="padding:8px 0">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#888"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#888"><strong>Phone</strong></td><td style="padding:8px 0">${phone || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;color:#888"><strong>Service</strong></td><td style="padding:8px 0">${service}</td></tr>
              </table>
              <div style="margin-top:16px;padding:14px;background:#f5f0e8;border-radius:6px;font-size:14px;line-height:1.7">
                <strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}
              </div>
              <p style="margin-top:16px;font-size:12px;color:#aaa">Reply to this email to respond directly to ${name}.</p>
            </div>
          </div>`
      });

      // EMAIL 2 — User ko confirmation
      await transporter.sendMail({
        from: `"Classic Silver Palace" <${process.env.EMAIL_USER}>`,
        to: email,
        replyTo: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `Thank you for your enquiry – Classic Silver Palace`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e0d9cf;border-radius:8px;overflow:hidden">
            <div style="background:#1a1a1a;padding:20px 24px">
              <h2 style="color:#d4af37;font-family:Georgia,serif;margin:0;font-weight:400">Classic Silver Palace</h2>
              <p style="color:#ccc;margin:4px 0 0;font-size:13px">Manufacturer & Exporter – Jaipur, India</p>
            </div>
            <div style="padding:24px;background:#fffdf9">
              <h3 style="font-family:Georgia,serif;font-weight:400;color:#1a1a1a">Dear ${name},</h3>
              <p style="color:#444;line-height:1.7">Thank you for reaching out to <strong>Classic Silver Palace</strong>! We have received your enquiry and our team will get back to you within <strong>24–48 hours</strong>.</p>
              <div style="background:#f5f0e8;border-radius:6px;padding:16px;margin:16px 0">
                <p style="margin:0 0 8px;font-size:11px;color:#888;font-weight:bold;text-transform:uppercase;letter-spacing:.05em">Your Enquiry Details</p>
                <p style="margin:4px 0;font-size:14px;color:#333"><strong>Name:</strong> ${name}</p>
                <p style="margin:4px 0;font-size:14px;color:#333"><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p style="margin:4px 0;font-size:14px;color:#333"><strong>Service:</strong> ${service}</p>
                <p style="margin:4px 0;font-size:14px;color:#333"><strong>Message:</strong> ${message}</p>
              </div>
              <p style="color:#444;font-size:14px">📧 info@indianclassicsilverjewellery.com<br>📞 +91-94140-72173</p>
              <p style="color:#888;font-size:12px;margin-top:24px">Classic Silver Palace, V-2, Chameli Wala Market, M.I. Road, Jaipur – 302003, India</p>
            </div>
          </div>`
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Failed to send. Please try again.' });
  }
});

// GET /api/contact/enquiries  — admin only
router.get('/enquiries', auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(200);
    res.json(enquiries);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
