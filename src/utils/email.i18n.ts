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
                <h1 style="margin:0;font-size:22px;">Disktro</h1>
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
                © ${new Date().getFullYear()} Disktro — All rights reserved.
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
          <p>Welcome to Disktro 👋</p>
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
          <p>Bienvenido a Disktro 👋</p>
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
          <p>Benvingut a Disktro 👋</p>
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
      subject: "Thank you for your test 🎧",
      html: () =>
        baseLayout(
          "Thank you 🎉",
          `
          <p>We’ve received your test successfully.</p>
          <p>Your feedback helps us build a better Disktro experience.</p>
          <p>Our team may contact you if further input is needed.</p>
        `
        ),
    },
    spanish: {
      subject: "Gracias por tu test 🎧",
      html: () =>
        baseLayout(
          "Gracias 🎉",
          `
          <p>Hemos recibido tu test correctamente.</p>
          <p>Tu feedback nos ayuda a mejorar Disktro.</p>
        `
        ),
    },
    catalan: {
      subject: "Gràcies pel teu test 🎧",
      html: () =>
        baseLayout(
          "Gràcies 🎉",
          `
          <p>Hem rebut el teu test correctament.</p>
          <p>El teu feedback ens ajuda a millorar Disktro.</p>
        `
        ),
    },
  },
};
