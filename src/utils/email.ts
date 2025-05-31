const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Authentification via API Key
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Initialisation de l'API TransactionalEmails
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Envoi d'un email via Brevo (ex Sendinblue)
 * @param {string} to - Adresse email destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} text - Contenu texte brut
 * @param {string} [html] - Contenu HTML optionnel
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyToken = `${token}`;
  const verifyUrl = `https://tonapp.com/verify-email?token=${token}`;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: to }];
  (sendSmtpEmail.subject = "Confirme ton adresse email"),
    (sendSmtpEmail.textContent = "Bonjour");
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Bienvenue 👋</h2>
    <p>Merci de t'être inscrit sur notre plateforme.</p>
    <p>Ton code de confirmation: "${verifyToken}".</p>
    <p>Pour confirmer ton adresse email, clique sur le lien ci-dessous :</p>
    <a href="${verifyUrl}" style="color: #4f46e5; text-decoration: none;">Confirmer mon email</a>
    <p>Si tu n'as pas demandé cette inscription, ignore ce message.</p>
    <br/>
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
