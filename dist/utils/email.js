"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendThankYouEmail = exports.sendEmail = void 0;
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
const email_i18n_1 = require("./email.i18n");
// ─────────────────────────────────────
// Brevo client setup
// ─────────────────────────────────────
const defaultClient = sib_api_v3_sdk_1.default.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
// ─────────────────────────────────────
// Utils
// ─────────────────────────────────────
const getResetPasswordUrl = (token) => `https://disktro-carma-frontend.onrender.com/auth/reset-password?token=${token}`;
const getSafeLanguage = (language) => {
    if (language === "spanish" ||
        language === "catalan" ||
        language === "english") {
        return language;
    }
    return "english";
};
// ─────────────────────────────────────
// Send verify / reset email
// ─────────────────────────────────────
const sendEmail = async (to, token, type, language) => {
    const lang = getSafeLanguage(language);
    const sendSmtpEmail = new sib_api_v3_sdk_1.default.SendSmtpEmail();
    sendSmtpEmail.sender = {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Disktro",
    };
    sendSmtpEmail.to = [{ email: to }];
    if (type === "verify-email") {
        const content = email_i18n_1.emailContent.verifyEmail[lang] || email_i18n_1.emailContent.verifyEmail.english;
        sendSmtpEmail.subject = content.subject;
        sendSmtpEmail.htmlContent = content.html(token);
    }
    if (type === "reset-password") {
        const resetUrl = getResetPasswordUrl(token);
        const content = email_i18n_1.emailContent.resetPassword[lang] || email_i18n_1.emailContent.resetPassword.english;
        sendSmtpEmail.subject = content.subject;
        sendSmtpEmail.htmlContent = content.html(resetUrl);
    }
    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`📧 Email (${type}) envoyé à ${to} — id ${response.messageId}`);
    }
    catch (error) {
        console.error("❌ Erreur envoi email :", error.response?.body || error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
// ─────────────────────────────────────
// Thank you tester email
// ─────────────────────────────────────
const sendThankYouEmail = async (to, language) => {
    const lang = getSafeLanguage(language);
    const sendSmtpEmail = new sib_api_v3_sdk_1.default.SendSmtpEmail();
    sendSmtpEmail.sender = {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Disktro",
    };
    sendSmtpEmail.to = [{ email: to }];
    const content = email_i18n_1.emailContent.thankYouTester[lang] || email_i18n_1.emailContent.thankYouTester.english;
    sendSmtpEmail.subject = content.subject;
    sendSmtpEmail.htmlContent = content.html();
    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`📧 Email thank-you-tester envoyé à ${to} — id ${response.messageId}`);
    }
    catch (error) {
        console.error("❌ Erreur envoi email thank-you-tester :", error.response?.body || error);
        throw error;
    }
};
exports.sendThankYouEmail = sendThankYouEmail;
