import SibApiV3Sdk from "sib-api-v3-sdk";
import { emailContent, Language } from "./email.i18n";

// ─────────────────────────────────────
// Brevo client setup
// ─────────────────────────────────────
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY!;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────
type EmailType = "verify-email" | "reset-password";

// ─────────────────────────────────────
// Utils
// ─────────────────────────────────────
const getResetPasswordUrl = (token: string) =>
  `https://bbok.music/auth/reset-password?token=${token}`;

const getSafeLanguage = (language?: string): Language => {
  if (
    language === "spanish" ||
    language === "catalan" ||
    language === "english"
  ) {
    return language;
  }
  return "english";
};

// ─────────────────────────────────────
// Send verify / reset email
// ─────────────────────────────────────
export const sendEmail = async (
  to: string,
  token: string,
  type: EmailType,
  language: string
) => {
  const lang = getSafeLanguage(language);

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: "Bbok",
  };

  sendSmtpEmail.to = [{ email: to }];

  if (type === "verify-email") {
    const content =
      emailContent.verifyEmail[lang] || emailContent.verifyEmail.english;

    sendSmtpEmail.subject = content.subject;
    sendSmtpEmail.htmlContent = content.html(token);
  }

  if (type === "reset-password") {
    const resetUrl = getResetPasswordUrl(token);

    const content =
      emailContent.resetPassword[lang] || emailContent.resetPassword.english;

    sendSmtpEmail.subject = content.subject;
    sendSmtpEmail.htmlContent = content.html(resetUrl);
  }

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 Email (${type}) envoyé à ${to} — id ${response.messageId}`);
  } catch (error: any) {
    console.error("❌ Erreur envoi email :", error.response?.body || error);
    throw error;
  }
};

// ─────────────────────────────────────
// Thank you tester email
// ─────────────────────────────────────
export const sendThankYouEmail = async (to: string, language: string) => {
  const lang = getSafeLanguage(language);

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: "Bbok",
  };

  sendSmtpEmail.to = [{ email: to }];

  const content =
    emailContent.thankYouTester[lang] || emailContent.thankYouTester.english;

  sendSmtpEmail.subject = content.subject;
  sendSmtpEmail.htmlContent = content.html();

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `📧 Email thank-you-tester envoyé à ${to} — id ${response.messageId}`
    );
  } catch (error: any) {
    console.error(
      "❌ Erreur envoi email thank-you-tester :",
      error.response?.body || error
    );
    throw error;
  }
};
