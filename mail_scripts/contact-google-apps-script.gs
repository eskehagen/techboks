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
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; color: #333; line-height: 1.6; background: #f5f5f5; padding: 10px; }
          .wrapper { background: #f5f5f5; padding: 10px 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .section { padding: 20px; border-bottom: 1px solid #f0f0f0; }
          .section:last-child { border-bottom: none; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; }
          .info-item { background: #f9f9f9; padding: 10px; border-radius: 5px; }
          .info-label { color: #667eea; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-value { margin-top: 4px; color: #333; font-size: 13px; word-break: break-word; }
          .message-box { background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; font-size: 14px; color: #333; white-space: pre-wrap; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Ny kontaktbesked</h1>
            </div>
            <div class="section">
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
