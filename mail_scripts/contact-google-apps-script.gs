/**
 * Håndterer POST requests fra kontaktformularen på techboks-redesign.
 * Separat script fra ordre-scriptet (google-apps-script-updated.gs) — egen
 * deployment, egen sikkerhedstoken, egen rate-limit.
 */
const SECURITY_TOKEN = 'TB-2946-CONTACT-773';
const SHOP_EMAIL = 'eskehagen@gmail.com';

function doPost(e) {
  try {
    let data = null;

    if (e && e.parameter && e.parameter.data) {
      try { data = JSON.parse(e.parameter.data); } catch (err) {}
    }
    if (!data && e && e.postData) {
      try {
        if (e.postData.contents) { data = JSON.parse(e.postData.contents); }
      } catch (err) {}
    }

    if (!data) {
      throw new Error('Ugyldigt payload');
    }

    // SIKKERHEDSLAG 1: Token validering
    if (data.token !== SECURITY_TOKEN) {
      throw new Error('Unauthorized adgang');
    }

    // SIKKERHEDSLAG 2: Honeypot check
    if (data.botField && data.botField.trim() !== '') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Besked modtaget'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Basal input validering
    if (!data.name || data.name.trim() === '') {
      throw new Error('Navn mangler');
    }
    if (!data.email || !isValidEmail(data.email)) {
      throw new Error('Ugyldig email: ' + (data.email || 'tom'));
    }
    if (data.email.length > 255) {
      throw new Error('Email er for lang');
    }
    if (!data.message || data.message.trim() === '') {
      throw new Error('Besked mangler');
    }
    if (data.message.length > 5000) {
      throw new Error('Beskeden er for lang');
    }
    if (!data.subject || data.subject.trim() === '') {
      throw new Error('Emne mangler');
    }

    // SIKKERHEDSLAG 3: Rate limiting
    const cache = CacheService.getScriptCache();
    const emailKey = 'contact_rate_limit_' + Utilities.base64Encode(data.email);
    if (cache.get(emailKey)) {
      throw new Error('Der er netop sendt en besked fra denne email. Vent venligst 5 minutter.');
    }

    const globalKey = 'global_contact_count';
    let globalCount = parseInt(cache.get(globalKey) || '0');
    if (globalCount >= 50) {
      throw new Error('Systemet har midlertidigt travlt. Prøv igen om lidt.');
    }

    sendContactEmailToShop(data);

    cache.put(emailKey, 'true', 300);
    cache.put(globalKey, (globalCount + 1).toString(), 3600);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Besked modtaget og videresendt',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('❌ FEJL: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeText(text) {
  if (!text) return '';
  return text.replace(/[\r\n]/g, ' ').trim();
}

/** Bevarer linjeskift, men escaper HTML — til beskedteksten i mailen. */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function sendContactEmailToShop(data) {
  const subject = `Ny besked fra TechBoks.dk — ${sanitizeText(data.subject)}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; color: #13181d; line-height: 1.6; background: #f0efeb; padding: 24px 12px; }
          .wrapper { background: #f0efeb; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #dde0e3; }
          .header { background: #13181d; color: #ffffff; padding: 32px 28px; text-align: center; }
          .brand { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
          .brand .accent { color: #3bd8a9; }
          .eyebrow { display: inline-block; margin-top: 16px; background: #3bd8a9; color: #091d16; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; padding: 7px 16px; border-radius: 999px; }
          .header h1 { margin: 14px 0 0 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
          .section { padding: 24px 28px; border-bottom: 1px solid #eef0f2; }
          .section:last-child { border-bottom: none; }
          .section h2 { color: #676c73; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 14px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; }
          .info-item { background: #eef0f2; padding: 12px 14px; border-radius: 14px; }
          .info-label { color: #676c73; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
          .info-value { margin-top: 4px; color: #13181d; font-size: 13.5px; word-break: break-word; }
          .message-box { background: #eef0f2; padding: 16px; border-radius: 0 14px 14px 0; border-left: 3px solid #3bd8a9; font-size: 14px; color: #25292f; white-space: pre-wrap; }
          .footer { background: #13181d; color: rgba(255,255,255,0.65); padding: 20px; text-align: center; font-size: 11.5px; }
          @media (max-width: 600px) {
            body { padding: 12px 6px; }
            .container { border-radius: 16px; }
            .header { padding: 24px 18px; }
            .header h1 { font-size: 19px; }
            .section { padding: 18px; }
            .info-grid { grid-template-columns: 1fr; gap: 8px; }
            .info-item { padding: 10px 12px; }
            .message-box { padding: 14px; font-size: 13px; }
            .footer { padding: 16px; font-size: 10.5px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="brand">Tech<span class="accent">Boks</span></div>
              <span class="eyebrow">Kontaktformular</span>
              <h1>Ny kontaktbesked</h1>
            </div>
            <div class="section">
              <h2>Afsender</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Navn</div>
                  <div class="info-value">${sanitizeText(data.name)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${sanitizeText(data.email)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Telefon</div>
                  <div class="info-value">${sanitizeText(data.phone) || '—'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Emne</div>
                  <div class="info-value">${sanitizeText(data.subject)}</div>
                </div>
              </div>
            </div>
            <div class="section">
              <h2>Besked</h2>
              <div class="message-box">${escapeHtml(data.message)}</div>
            </div>
            <div class="footer">
              <p>Sendt via kontaktformularen på techboks.dk</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  GmailApp.sendEmail(SHOP_EMAIL, subject, '', {
    htmlBody: htmlBody,
    replyTo: data.email
  });
}
