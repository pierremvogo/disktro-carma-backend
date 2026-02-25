export type Language = "english" | "spanish" | "catalan";

type EmailTemplate<T = void> = {
  subject: string;
  html: (value: T) => string;
};

const baseLayout = (title: string, content: string) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#111;">
            
            <!-- Header -->
            <tr>
              <td style="padding:24px 32px;background:#111;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;">Bbok</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px;">
                <h2 style="margin-top:0;font-size:20px;">${title}</h2>
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px;font-size:12px;color:#777;border-top:1px solid #eee;">
                © ${new Date().getFullYear()} Bbok — All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const codeBlock = (code: string) => `
<div style="margin:24px 0;padding:16px;background:#f4f6f8;border-radius:8px;text-align:center;">
  <span style="font-size:28px;letter-spacing:6px;font-weight:bold;">${code}</span>
</div>
`;

const button = (label: string, url: string) => `
<div style="margin:32px 0;text-align:center;">
  <a href="${url}"
     style="background:#111;color:#ffffff;padding:14px 28px;border-radius:8px;
            text-decoration:none;font-weight:bold;display:inline-block;">
    ${label}
  </a>
</div>
`;

export const emailContent: {
  verifyEmail: Record<Language, EmailTemplate<string>>;
  resetPassword: Record<Language, EmailTemplate<string>>;
  thankYouTester: Record<Language, EmailTemplate<void>>;
} = {
  // ─────────────────────────────────────
  // VERIFY EMAIL
  // ─────────────────────────────────────
  verifyEmail: {
    english: {
      subject: "Confirm your email address",
      html: (token) =>
        baseLayout(
          "Confirm your email",
          `
          <p>Welcome to Bbok 👋</p>
          <p>Please use the verification code below to activate your account:</p>
          ${codeBlock(token)}
          <p>This code expires in <strong>1 hour</strong>.</p>
          <p>If you didn’t create an account, you can safely ignore this email.</p>
        `
        ),
    },
    spanish: {
      subject: "Confirma tu correo electrónico",
      html: (token) =>
        baseLayout(
          "Confirma tu correo",
          `
          <p>Bienvenido a Bbok 👋</p>
          <p>Usa el siguiente código para activar tu cuenta:</p>
          ${codeBlock(token)}
          <p>Este código expira en <strong>1 hora</strong>.</p>
        `
        ),
    },
    catalan: {
      subject: "Confirma el teu correu electrònic",
      html: (token) =>
        baseLayout(
          "Confirma el teu correu",
          `
          <p>Benvingut a Bbok 👋</p>
          <p>Utilitza el codi següent per activar el teu compte:</p>
          ${codeBlock(token)}
          <p>Aquest codi caduca en <strong>1 hora</strong>.</p>
        `
        ),
    },
  },

  // ─────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────
  resetPassword: {
    english: {
      subject: "Reset your password",
      html: (url) =>
        baseLayout(
          "Reset your password",
          `
          <p>You requested a password reset.</p>
          <p>Click the button below to choose a new password:</p>
          ${button("Reset password", url)}
          <p>This link expires in <strong>1 hour</strong>.</p>
        `
        ),
    },
    spanish: {
      subject: "Restablecer contraseña",
      html: (url) =>
        baseLayout(
          "Restablecer contraseña",
          `
          <p>Has solicitado un restablecimiento de contraseña.</p>
          ${button("Restablecer contraseña", url)}
          <p>Este enlace expira en <strong>1 hora</strong>.</p>
        `
        ),
    },
    catalan: {
      subject: "Restablir la contrasenya",
      html: (url) =>
        baseLayout(
          "Restablir la contrasenya",
          `
          <p>Has sol·licitat restablir la contrasenya.</p>
          ${button("Restablir contrasenya", url)}
          <p>Aquest enllaç caduca en <strong>1 hora</strong>.</p>
        `
        ),
    },
  },

  // ─────────────────────────────────────
  // THANK YOU TESTER
  // ─────────────────────────────────────
  thankYouTester: {
    english: {
      subject: "Thank you for your participation 🎧",
      html: () =>
        baseLayout(
          "Thank you 🎉",
          `
          <p>Thank you, we have received your participation.</p>
  
          <p>Your feedback helps us improve Bbok.</p>
  
          <p>
            Send us a WhatsApp message to <strong>+237675544431</strong>
            or email us at <strong>mcarmebis@gmail.com</strong> to let us know
            what you would like us to improve and what you would like to listen to!
          </p>
          `
        ),
    },

    spanish: {
      subject: "Gracias por tu participación 🎧",
      html: () =>
        baseLayout(
          "Gracias 🎉",
          `
          <p>Gracias , hemos recibido tu participación.</p>
  
          <p>Tu feedback nos ayuda a mejorar Bbok.</p>
  
          <p>
            Envianos un mensaje en whatsapp al número <strong>+237675544431</strong>
            o un e-mail a <strong>mcarmebis@gmail.com</strong> para escribir-nos
            lo que te gustaría mejorar i escuchar.
          </p>
          `
        ),
    },

    catalan: {
      subject: "Gràcies per la vostra participació 🎧",
      html: () =>
        baseLayout(
          "Gràcies 🎉",
          `
          <p>Gràcies, hem rebut la vostra participació.</p>
  
          <p>Els vostres comentaris ens ajuden a millorar Bbok.</p>
  
          <p>
            Envieu-nos un missatge de WhatsApp al <strong>+237675544431</strong>
            o envieu-nos un correu electrònic a <strong>mcarmebis@gmail.com</strong>
            per fer-nos saber què voleu que millorem
            i què us agradaria escoltar!
          </p>
          `
        ),
    },
  },
};
