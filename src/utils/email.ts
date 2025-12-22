const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Authentification via API Key
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY!;
// console.log("Clé API brute :", JSON.stringify(process.env.BREVO_API_KEY));

// Initialisation de l'API TransactionalEmails
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Envoi d'un email via Brevo (ex Sendinblue)
 * @param {string} to - Adresse email destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} text - Contenu texte brut
 * @param {string} [html] - Contenu HTML optionnel
 */
export const sendEmail = async (to: string, token: string, type: string) => {
  const verifyToken = `${token}`;
  const resetUrl = `https://disktro-carma-frontend.onrender.com/auth/reset-password?token=${token}`;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: to }];
  ((sendSmtpEmail.subject =
    type === "verify-email"
      ? "Confirmez votre adresse email"
      : "Réinitialisation de votre mot de passe"),
    (sendSmtpEmail.textContent = "Bonjour"));
  const html =
    type === "verify-email"
      ? `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Bienvenue 👋</h2>
    <p>Merci de t'être inscrit sur notre plateforme.</p>
    <p>Votre code de confirmation: <strong>${verifyToken}</strong></p>
    <p>Pour confirmer votre adresse email, veuillez renseigner ce code sur la plateforme :</p>
    <p>Si tu n'as pas demandé cette inscription, ignore ce message.</p>
    <br/>
    <p>Ce code expire dans 1 heure</p>
    <p>À très vite !</p>
  </div>
`
      : `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <p>Vous avez demandé une réinitialisation de mot de passe.</p>
            <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Ce lien expire dans 1 heure.</p>
            <p>À très vite !</p>
          </div>
        `;
  if (html) {
    sendSmtpEmail.htmlContent = html;
  }

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 Email envoyé à ${to} : messageId ${response.messageId}`);
  } catch (error: any) {
    console.error(
      `❌ Erreur envoi email :`,
      error.response ? error.response.body : error
    );
  }
};

export const sendThankYouEmail = async (to: string) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: "Disktro",
  };

  sendSmtpEmail.to = [{ email: to }];

  sendSmtpEmail.subject = "Merci pour votre test 🎧";

  sendSmtpEmail.textContent =
    "Merci pour votre test. L’équipe Disktro vous remercie.";

  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="color:#1F89A5;">Merci 🎉</h2>

      <p>
        Nous avons bien reçu votre test et nous vous remercions pour votre participation.
      </p>

      <p>
        Votre retour est précieux et nous aide à améliorer continuellement la plateforme.
      </p>

      <p>
        Si une action de votre part est nécessaire, notre équipe vous contactera.
      </p>

      <br/>

      <p>
        À très vite,<br/>
        <strong>L’équipe Disktro</strong>
      </p>
    </div>
  `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `📧 Email de remerciement envoyé à ${to} (id ${response.messageId})`
    );
  } catch (error: any) {
    console.error(
      "❌ Erreur envoi email de remerciement :",
      error.response ? error.response.body : error
    );
  }
};
