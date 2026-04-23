const nodemailer = require('nodemailer');

// Transporter Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Envoie une notification email à Nexa Soft
 * quand un prospect soumet le formulaire de contact.
 */
async function sendContactNotification({ full_name, email, subject, message }) {
  const date = new Date().toLocaleString('fr-FR', {
    timeZone: 'Africa/Douala',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const whatsappLink = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Nouveau message de ${full_name} (${email}) :\n\nSujet : ${subject}\n\n${message}`
  )}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1e4db7 0%, #0891b2 100%); padding: 32px 40px; text-align: center; }
    .header img { width: 48px; margin-bottom: 12px; }
    .header h1 { color: #fff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.3px; }
    .header p { color: rgba(255,255,255,0.75); font-size: 13px; margin: 6px 0 0; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-top: 10px; letter-spacing: 0.5px; text-transform: uppercase; }
    .body { padding: 36px 40px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 11px; font-weight: 700; color: #6272f1; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
    .field .value { font-size: 15px; color: #1e293b; background: #f8faff; border: 1px solid #e0e9ff; border-radius: 10px; padding: 12px 16px; line-height: 1.6; }
    .message-box { white-space: pre-wrap; word-break: break-word; }
    .divider { border: none; border-top: 1px solid #e8edf5; margin: 28px 0; }
    .cta { text-align: center; margin: 28px 0 8px; }
    .btn { display: inline-block; padding: 13px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; margin: 6px; }
    .btn-reply { background: #1e4db7; color: #ffffff; }
    .btn-whatsapp { background: #25D366; color: #ffffff; }
    .footer { background: #f8faff; padding: 20px 40px; text-align: center; border-top: 1px solid #e8edf5; }
    .footer p { font-size: 12px; color: #94a3b8; margin: 0; }
    .footer strong { color: #6272f1; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📬 Nouveau message prospect</h1>
      <p>${date}</p>
      <span class="badge">Nexa Soft — Formulaire de contact</span>
    </div>

    <div class="body">
      <div class="field">
        <label>👤 Nom complet</label>
        <div class="value">${full_name}</div>
      </div>
      <div class="field">
        <label>📧 Email</label>
        <div class="value"><a href="mailto:${email}" style="color:#1e4db7;text-decoration:none;">${email}</a></div>
      </div>
      <div class="field">
        <label>📌 Sujet</label>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <label>💬 Message</label>
        <div class="value message-box">${message}</div>
      </div>

      <hr class="divider"/>

      <div class="cta">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn btn-reply">
          ✉️ Répondre par email
        </a>
        <a href="${whatsappLink}" class="btn btn-whatsapp" target="_blank">
          💬 Ouvrir WhatsApp
        </a>
      </div>
    </div>

    <div class="footer">
      <p>Ce message a été envoyé automatiquement par le site <strong>NexaSoft</strong>.</p>
      <p style="margin-top:4px;">nexasoft@gmail.com · +237 694 672 953 · Yaoundé, Cameroun</p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Nexa Soft Website" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `[NexaSoft] Nouveau message de ${full_name} — ${subject}`,
    html,
    text: `Nouveau message de ${full_name} (${email})\n\nSujet : ${subject}\n\n${message}\n\n---\nDate : ${date}`,
  });
}

module.exports = { sendContactNotification };
