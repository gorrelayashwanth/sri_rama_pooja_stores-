"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Retrieve credentials from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
// Configure Nodemailer SMTP Transporter
const transporter = nodemailer_1.default.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
const sendEmail = async (to, subject, htmlContent) => {
    console.log(`[Email Service] Preparing email for: ${to}`);
    if (!SMTP_USER || !SMTP_PASS) {
        console.log(`[Email Service] SMTP credentials not set. Logging email content instead:
Subject: ${subject}
To: ${to}
Body Preview: ${htmlContent.substring(0, 300)}...`);
        return { success: true, message: "Logged due to missing SMTP credentials" };
    }
    try {
        const info = await transporter.sendMail({
            from: `"Sri Rama Pooja Store" <${SMTP_USER}>`,
            to,
            subject,
            html: htmlContent,
        });
        console.log(`[Email Service] Email sent successfully: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error("[Email Service] Failed to send email:", error);
        return { success: false, error };
    }
};
exports.sendEmail = sendEmail;
const sendSMS = async (to, body) => {
    console.log(`[SMS Service] Preparing SMS for: ${to}`);
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.log(`[SMS Service] Twilio credentials not set. Logging SMS body instead:
To: ${to}
Body: ${body}`);
        return { success: true, message: "Logged due to missing Twilio credentials" };
    }
    try {
        // Send using native Node.js fetch (Node 18+ has global fetch)
        const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
        const params = new URLSearchParams();
        params.append("To", to.startsWith("+") ? to : `+91${to}`);
        params.append("From", TWILIO_PHONE_NUMBER);
        params.append("Body", body);
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || "Unknown error from Twilio");
        }
        console.log(`[SMS Service] SMS sent successfully, SID: ${responseData.sid}`);
        return { success: true, sid: responseData.sid };
    }
    catch (error) {
        console.error("[SMS Service] Failed to send SMS:", error);
        return { success: false, error };
    }
};
exports.sendSMS = sendSMS;
