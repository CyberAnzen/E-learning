require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

exports.SMTP =async (req, res) => {
    try {
        const { to, subject, text } = req.body; // ✅ Extract from request body

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,  // ✅ Fix casing (PORT -> port)
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({ // ✅ Await sendMail
            from: `CyberAnzen <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });

        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email", details: error.message });
    }
};
