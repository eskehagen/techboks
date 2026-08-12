/**
 * Håndel POST requests fra websiden
 */
const SECURITY_TOKEN = 'TB-8472-SECURE-991';

function doPost(e) {
  try {
    let data = null;

    // Parse logik
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
    if (data.botField && data.botField.trim() !== "") {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Ordre modtaget'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Basal input validering
    if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
      throw new Error('Ugyldig email: ' + (data.customerEmail || 'tom'));
    }

    if (data.customerEmail.length > 150) {
      throw new Error('Email er for lang');
    }

    // SIKKERHEDSLAG 3: Rate limiting
    const cache = CacheService.getScriptCache();
    const emailKey = 'rate_limit_' + Utilities.base64Encode(data.customerEmail);
    if (cache.get(emailKey)) {
      throw new Error('Der er netop oprettet en ordre med denne email. Vent venligst 5 minutter.');
    }

    const globalKey = 'global_order_count';
    let globalCount = parseInt(cache.get(globalKey) || '0');
    if (globalCount >= 30) {
      throw new Error('Systemet har midlertidigt travlt. Prøv igen om lidt.');
    }

    // Generer ordre ID tidligt, så det kan bruges i emails og Airtable
    const orderId = generateOrderId();

    // Send mail til ejer
    Logger.log('Sender email til butikkejer...');
    sendOrderEmailToShop(data, orderId);
    Logger.log('✓ Email sendt til butikkejer');

    // Send mail til kunde
    Logger.log('Sender email til kunde: ' + data.customerEmail);
    sendOrderEmailToCustomer(data, orderId);
    Logger.log('✓ Email sendt til kunde');

    // Sync til Airtable (fejler ikke ordreoprettelsen hvis Airtable fejler)
    try {
      syncToAirtable(data, orderId);
      Logger.log('✓ Ordre synkroniseret til Airtable');
    } catch (airtableError) {
      Logger.log('⚠ Airtable sync fejlede (ordre er stadig gyldig): ' + airtableError.toString());
    }

    // Opdater caches
    cache.put(emailKey, 'true', 300);
    cache.put(globalKey, (globalCount + 1).toString(), 3600);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Ordre modtaget og emails sendt',
      orderId: orderId,
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

/**
 * Valider email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize tekst - fjern problematiske tegn
 */
function sanitizeText(text) {
  if (!text) return '';
  return text.replace(/[\r\n]/g, ' ').trim();
}

/**
 * Send ordre email til butikkejer - HTML VERSION
 */
function sendOrderEmailToShop(orderData, orderId) {
  try {
    const shopEmail = 'eskehagen@gmail.com';

    // Validering
    if (!shopEmail || !isValidEmail(shopEmail)) {
      throw new Error('Ugyldig butik email: ' + shopEmail);
    }

    // Formatér items liste
    let itemsHtml = '';
    if (orderData.items && Array.isArray(orderData.items)) {
      itemsHtml = orderData.items.map((item, i) => {
        const rowBg = i % 2 === 0 ? '#ffffff' : '#f7f8f9';
        const variantLine = item.variant ? `<br><span style="color: #676c73; font-size: 12px; font-weight: 400;">${sanitizeText(item.variant)}</span>` : '';
        return `
        <tr>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; font-size: 13.5px; background: ${rowBg}; color: #13181d;">${sanitizeText(item.name)}${variantLine}</td>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; text-align: center; font-size: 13.5px; background: ${rowBg}; color: #13181d;">${item.quantity}</td>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; text-align: right; font-size: 13.5px; background: ${rowBg}; color: #13181d;"><strong>${(item.price * item.quantity).toFixed(2)} kr</strong></td>
        </tr>
      `;
      }).join('');
    }

    // Formatér bemærkninger
    let notesSection = '';
    if (orderData.customerNotes && orderData.customerNotes.trim() !== '') {
      notesSection = `<p style="margin: 16px 0 0 0; padding: 14px 16px; background: #eef0f2; border-left: 3px solid #3bd8a9; border-radius: 0 12px 12px 0; font-size: 13.5px; color: #25292f;">${sanitizeText(orderData.customerNotes)}</p>`;
    }

    const subject = `Ny TechBoks.dk ordre [${orderId}] - ${sanitizeText(orderData.customerName)}`;

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
            .header { background: #13181d; color: #ffffff; padding: 36px 28px; text-align: center; }
            .brand { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
            .brand .accent { color: #3bd8a9; }
            .eyebrow { display: inline-block; margin-top: 18px; background: #3bd8a9; color: #091d16; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; padding: 7px 16px; border-radius: 999px; }
            .header h1 { margin: 16px 0 0 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.6); }
            .section { padding: 24px 28px; border-bottom: 1px solid #eef0f2; }
            .section:last-child { border-bottom: none; }
            .section h2 { color: #676c73; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 14px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; }
            .info-item { background: #eef0f2; padding: 12px 14px; border-radius: 14px; }
            .info-label { color: #676c73; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
            .info-value { margin-top: 4px; color: #13181d; font-size: 13.5px; word-break: break-word; }
            .products-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 0; }
            .products-table th { background: #13181d; color: #ffffff; padding: 11px 12px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
            .products-table th:first-child { border-top-left-radius: 10px; }
            .products-table th:last-child { border-top-right-radius: 10px; }
            .products-table td { padding: 11px 12px; border-bottom: 1px solid #eef0f2; font-size: 13.5px; background: #ffffff; }
            .products-table tr:nth-child(even) td { background: #f7f8f9; }
            .products-table tr:last-child td { border-bottom: none; }
            .price-box { background: #3bd8a9; color: #091d16; padding: 20px; border-radius: 18px; margin: 18px 0; }
            .price-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 13.5px; }
            .total-row { font-weight: 700; font-size: 17px; border-top: 1.5px solid rgba(9,29,22,0.2); padding-top: 10px; margin-top: 10px; }
            .info-box { background: #dec6ab; padding: 14px 16px; border-radius: 14px; font-size: 12.5px; color: #13181d; }
            .info-box p { margin: 3px 0; }
            .footer { background: #13181d; color: rgba(255,255,255,0.65); padding: 22px; text-align: center; font-size: 11.5px; }
            .footer strong { color: #ffffff; }
            .footer p { margin: 3px 0; }
            @media (max-width: 600px) {
              body { padding: 12px 6px; }
              .container { border-radius: 16px; }
              .header { padding: 28px 18px; }
              .header h1 { font-size: 21px; }
              .header p { font-size: 12px; }
              .section { padding: 18px; }
              .section h2 { font-size: 10.5px; margin-bottom: 12px; }
              .info-grid { grid-template-columns: 1fr; gap: 8px; }
              .info-item { padding: 10px 12px; }
              .info-label { font-size: 9px; }
              .info-value { font-size: 12.5px; margin-top: 3px; }
              .products-table th { padding: 9px 10px; font-size: 9.5px; }
              .products-table td { padding: 9px 10px; font-size: 12.5px; }
              .price-box { padding: 16px; margin: 14px 0; }
              .price-row { font-size: 12.5px; margin: 5px 0; }
              .total-row { font-size: 15px; }
              .info-box { padding: 12px 14px; font-size: 11.5px; }
              .footer { padding: 16px; font-size: 10.5px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="brand">Tech<span class="accent">Boks</span></div>
                <span class="eyebrow">Ny ordre</span>
                <h1>NY ORDRE MODTAGET</h1>
                <p>TechBoks.dk Ordresystem</p>
              </div>

              <div class="section">
                <h2>Kunde information</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Navn</div>
                    <div class="info-value">${sanitizeText(orderData.customerName)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${sanitizeText(orderData.customerEmail)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Telefon</div>
                    <div class="info-value">${sanitizeText(orderData.customerPhone)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Adresse</div>
                    <div class="info-value">${sanitizeText(orderData.customerAddress)}<br>${sanitizeText(orderData.customerCityPostal)}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Produkter</h2>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th style="text-align: left;">Produkt</th>
                      <th style="text-align: center;">Antal</th>
                      <th style="text-align: right;">Pris</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                ${notesSection}
              </div>

              <div class="section">
                <h2>Forsendelse</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Metode</div>
                    <div class="info-value">${orderData.shippingMethod === 'pickup' ? 'Afhentning' : 'Forsendelse'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Omkostning</div>
                    <div class="info-value">${parseFloat(orderData.shippingCost).toFixed(2)} kr</div>
                  </div>
                </div>
              </div>

              <div style="padding: 25px 28px;">
                <div class="price-box">
                  <div class="price-row">
                    <span>Subtotal:</span>
                    <strong>${parseFloat(orderData.subtotal).toFixed(2)} kr</strong>
                  </div>
                  <div class="price-row">
                    <span>Forsendelse:</span>
                    <strong>${parseFloat(orderData.shippingCost).toFixed(2)} kr</strong>
                  </div>
                  <div class="price-row total-row">
                    <span>TOTAL:</span>
                    <strong>${parseFloat(orderData.total).toFixed(2)} kr</strong>
                  </div>
                </div>
                <div class="info-box">
                  <p><strong>Ordre ID:</strong> ${orderId}</p>
                  <p><strong>Ordre modtaget:</strong> ${new Date().toLocaleString('da-DK')}</p>
                </div>
              </div>

              <div class="footer">
                <p><strong>TechBoks.dk</strong></p>
                <p>3D printede produkter i høj kvalitet</p>
                <p>&copy; 2026 TechBoks. Alle rettigheder forbeholdt.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    Logger.log('Sender til: ' + shopEmail);
    Logger.log('Emne: ' + subject);
    GmailApp.sendEmail(shopEmail, subject, '', {
      htmlBody: htmlBody
    });
    Logger.log('✓ Email til butikkejer sendt');

  } catch (error) {
    Logger.log('❌ FEJL ved email til butikkejer: ' + error.toString());
    throw new Error('Kunne ikke sende email til butikkejer: ' + error.toString());
  }
}

/**
 * Send bekræftelsesmail til kunden - HTML VERSION
 */
function sendOrderEmailToCustomer(orderData, orderId) {
  try {
    const customerEmail = orderData.customerEmail;

    // Validering
    if (!customerEmail || !isValidEmail(customerEmail)) {
      throw new Error('Ugyldig kunde email: ' + customerEmail);
    }

    // Formatér items liste
    let itemsHtml = '';
    if (orderData.items && Array.isArray(orderData.items)) {
      itemsHtml = orderData.items.map((item, i) => {
        const rowBg = i % 2 === 0 ? '#ffffff' : '#f7f8f9';
        const variantLine = item.variant ? `<br><span style="color: #676c73; font-size: 12px; font-weight: 400;">${sanitizeText(item.variant)}</span>` : '';
        return `
        <tr>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; font-size: 13.5px; background: ${rowBg}; color: #13181d;">${sanitizeText(item.name)}${variantLine}</td>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; text-align: center; font-size: 13.5px; background: ${rowBg}; color: #13181d;">${item.quantity}</td>
          <td style="padding: 11px 12px; border-bottom: 1px solid #eef0f2; text-align: right; font-size: 13.5px; background: ${rowBg}; color: #13181d;"><strong>${(item.price * item.quantity).toFixed(2)} kr</strong></td>
        </tr>
      `;
      }).join('');
    }

    // Formatér bemærkninger
    let notesSection = '';
    if (orderData.customerNotes && orderData.customerNotes.trim() !== '') {
      notesSection = `<p style="margin: 14px 0 0 0; font-size: 13.5px; color: #676c73;"><em>"${sanitizeText(orderData.customerNotes)}"</em></p>`;
    }

    const subject = `Ordrebekræftelse [${orderId}] - TechBoks.dk`;

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
            .header { background: #13181d; color: #ffffff; padding: 36px 28px; text-align: center; }
            .brand { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
            .brand .accent { color: #3bd8a9; }
            .eyebrow { display: inline-block; margin-top: 18px; background: #3bd8a9; color: #091d16; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; padding: 7px 16px; border-radius: 999px; }
            .header h1 { margin: 16px 0 0 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.6); }
            .greeting { padding: 24px 28px; background: #f7f8f9; border-bottom: 2px solid #3bd8a9; }
            .greeting h2 { color: #13181d; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 8px 0; }
            .greeting p { margin: 4px 0; font-size: 13.5px; color: #25292f; }
            .section { padding: 24px 28px; border-bottom: 1px solid #eef0f2; }
            .section h3 { color: #676c73; font-size: 11px; margin: 0 0 14px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; font-family: 'Space Grotesk', 'Inter', sans-serif; }
            .products-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 0; }
            .products-table th { background: #13181d; color: #ffffff; padding: 11px 12px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
            .products-table th:first-child { border-top-left-radius: 10px; }
            .products-table th:last-child { border-top-right-radius: 10px; }
            .products-table td { padding: 11px 12px; border-bottom: 1px solid #eef0f2; font-size: 13.5px; background: #ffffff; }
            .products-table tr:nth-child(even) td { background: #f7f8f9; }
            .products-table tr:last-child td { border-bottom: none; }
            .highlight-box { background: #3bd8a9; color: #091d16; padding: 20px; border-radius: 18px; margin: 18px 0; }
            .highlight-box p { margin: 6px 0; font-size: 13.5px; }
            .highlight-box strong { font-size: 16px; }
            .info-list { list-style: none; margin: 4px 0 0 0; }
            .info-list li { padding: 9px 0; font-size: 13.5px; border-bottom: 1px solid #eef0f2; }
            .info-list li:last-child { border-bottom: none; }
            .info-list-label { color: #676c73; font-weight: 700; }
            .callout { padding: 24px 28px; border-bottom: 1px solid #eef0f2; }
            .callout-mint { background: #eafbf5; }
            .callout-clay { background: #faf4ee; }
            .callout-dark { background: #13181d; color: #ffffff; }
            .callout-dark h3 { color: rgba(255,255,255,0.55); }
            .payment-number { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: #3bd8a9; letter-spacing: 0.02em; }
            .cta-wrap { padding: 6px 28px 28px; text-align: center; }
            .cta-button { display: inline-block; background: #13181d; color: #ffffff !important; font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 600; font-size: 14px; text-decoration: none; padding: 13px 28px; border-radius: 999px; }
            .footer { background: #13181d; color: rgba(255,255,255,0.65); padding: 22px; text-align: center; font-size: 11.5px; }
            .footer strong { color: #ffffff; }
            .footer p { margin: 3px 0; }
            .divider { height: 1.5px; background: rgba(9,29,22,0.2); margin: 10px 0; }
            @media (max-width: 600px) {
              body { padding: 12px 6px; }
              .container { border-radius: 16px; }
              .header { padding: 28px 18px; }
              .header h1 { font-size: 21px; }
              .header p { font-size: 12px; }
              .greeting { padding: 18px; }
              .greeting h2 { font-size: 17px; }
              .greeting p { font-size: 12.5px; }
              .section, .callout { padding: 18px; }
              .section h3 { font-size: 10.5px; margin-bottom: 10px; }
              .products-table th { padding: 9px 10px; font-size: 9.5px; }
              .products-table td { padding: 9px 10px; font-size: 12.5px; }
              .highlight-box { padding: 16px; margin: 14px 0; }
              .highlight-box p { font-size: 12.5px; margin: 5px 0; }
              .highlight-box strong { font-size: 15px; }
              .info-list li { padding: 7px 0; font-size: 12.5px; }
              .payment-number { font-size: 19px; }
              .cta-wrap { padding: 4px 18px 22px; }
              .footer { padding: 16px; font-size: 10.5px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="brand">Tech<span class="accent">Boks</span></div>
                <span class="eyebrow">Ordrebekræftelse</span>
                <h1>DIN ORDRE ER BEKRÆFTET</h1>
                <p>Vi er allerede i gang med at klargøre den</p>
              </div>

              <div class="greeting">
                <h2>Hej ${sanitizeText(orderData.customerName)}!</h2>
                <p>Tusind tak for interessen for mine Mustang gadgets!</p>
                <p>Din ordre er modtaget og bekræftet. Print og klargøring af netop dine produkter startes nu.</p>
                <p style="margin-top: 10px; font-size: 12px; color: #676c73;">Ordre ID: <strong style="color: #13181d;">${orderId}</strong></p>
              </div>

              <div class="section">
                <h3>Dine produkter</h3>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th style="text-align: left;">Produkt</th>
                      <th style="text-align: center;">Antal</th>
                      <th style="text-align: right;">Pris</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                ${notesSection}
              </div>

              <div class="section">
                <h3>Forsendelse</h3>
                <ul class="info-list">
                  <li><span class="info-list-label">Metode:</span> ${orderData.shippingMethod === 'pickup' ? 'Afhentning' : 'Forsendelse'}</li>
                  <li><span class="info-list-label">Omkostning:</span> ${parseFloat(orderData.shippingCost).toFixed(2)} kr</li>
                  ${orderData.shippingMethod !== 'pickup' ? `<li><span class="info-list-label">Leveringsadresse:</span> ${sanitizeText(orderData.customerAddress)}, ${sanitizeText(orderData.customerCityPostal)}</li>` : ''}
                </ul>
              </div>

              <div style="padding: 25px 28px 0;">
                <div class="highlight-box">
                  <p>Subtotal: ${parseFloat(orderData.subtotal).toFixed(2)} kr</p>
                  <p>Forsendelse: ${parseFloat(orderData.shippingCost).toFixed(2)} kr</p>
                  <div class="divider"></div>
                  <p><strong>TOTAL: ${parseFloat(orderData.total).toFixed(2)} kr</strong></p>
                </div>
              </div>

              <div class="callout callout-clay">
                <h3>Leveringstid</h3>
                <p style="font-size: 14px; margin: 0;">Afhængig af ordrens størrelse og travlhed skal du forvente <strong>1 uges klargøring</strong> af produkterne. Du vil modtage besked så snart din ordre er klar til forsendelse eller afhentning.</p>
              </div>

              <div class="callout callout-dark">
                <h3>Betaling</h3>
                <p style="font-size: 14px; margin: 0;">Betal venligst via <strong>MobilePay</strong> til:</p>
                <p class="payment-number" style="margin-top: 6px;">50935952</p>
                <p style="font-size: 13px; margin: 8px 0 0 0; color: rgba(255,255,255,0.7);">Betal før forsendelse eller ved afhentning.</p>
              </div>

              <div class="callout callout-mint" style="border-bottom: none;">
                <h3>Spørgsmål?</h3>
                <p style="font-size: 14px; margin: 0; color: #25292f;">Hvis du har spørgsmål til din ordre, kan du besvare denne mail. Jeg svarer hurtigst muligt!</p>
              </div>

              <div class="cta-wrap">
                <a href="https://techboks.dk" class="cta-button">Besøg TechBoks.dk</a>
              </div>

              <div class="footer">
                <p><strong>TechBoks.dk</strong></p>
                <p>Eske Hagen Sinding</p>
                <p>3D printede produkter i høj kvalitet</p>
                <p style="margin-top: 8px; opacity: 0.8;">&copy; 2026 TechBoks. Alle rettigheder forbeholdt.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    Logger.log('Sender til customer: ' + customerEmail);
    Logger.log('Emne: ' + subject);
    GmailApp.sendEmail(customerEmail, subject, '', {
      htmlBody: htmlBody
    });
    Logger.log('✓ Email til kunde sendt');

  } catch (error) {
    Logger.log('❌ FEJL ved email til kunde: ' + error.toString());
    throw new Error('Kunne ikke sende email til kunde: ' + error.toString());
  }
}

/**
 * Generer unik ordre ID som inkrementelt tal startende fra 200
 */
function generateOrderId() {
  const props = PropertiesService.getScriptProperties();
  const current = parseInt(props.getProperty('ORDER_COUNTER') || '199');
  const next = current + 1;
  props.setProperty('ORDER_COUNTER', next.toString());
  return 'ORD-' + next;
}

/**
 * Synkroniser ordre til Airtable (Kunder + Ordrer tabeller)
 * Kræver Script Properties: AIRTABLE_API_KEY og AIRTABLE_BASE_ID
 */
function syncToAirtable(orderData, orderId) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('AIRTABLE_API_KEY');
  const baseId = props.getProperty('AIRTABLE_BASE_ID');

  if (!apiKey || !baseId) {
    throw new Error('AIRTABLE_API_KEY eller AIRTABLE_BASE_ID mangler i Script Properties');
  }

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json'
  };

  // 1. Find eller opret kunde
  const customerId = findOrCreateCustomer(orderData, baseId, headers);
  Logger.log('Airtable kunde ID: ' + customerId);

  // 2. Slå produkt-records op i Produkter-tabellen via Website ID
  const productRecordIds = findProductRecordIds(orderData.items || [], baseId, headers);
  Logger.log('Airtable produkter fundet: ' + productRecordIds.length);

  // 3. Opret ordre-record
  const orderFields = {
    'Ordre ID': orderId,
    'Kunde': [customerId],
    'Salgsplatform': 'TechBoks.dk'
  };

  if (productRecordIds.length > 0) {
    orderFields['Produkter'] = productRecordIds;
  }

  const orderResponse = UrlFetchApp.fetch(
    'https://api.airtable.com/v0/' + baseId + '/Ordrer',
    { method: 'POST', headers: headers, payload: JSON.stringify({ fields: orderFields }), muteHttpExceptions: true }
  );
  Logger.log('Airtable Ordrer HTTP status: ' + orderResponse.getResponseCode());
  Logger.log('Airtable Ordrer svar: ' + orderResponse.getContentText());
  const orderRecord = JSON.parse(orderResponse.getContentText());

  if (!orderRecord.id) {
    throw new Error('Airtable ordre oprettelse fejlede: ' + orderResponse.getContentText());
  }
  Logger.log('Airtable ordre record ID: ' + orderRecord.id);
}

/**
 * Slå produkter op i Airtable Produkter-tabellen via Website ID.
 * Prøver først fuldt match (fx "skraldespand-venstre"), derefter base-ID (fx "frontboks").
 * Returnerer array af unikke Airtable record IDs.
 */
function findProductRecordIds(items, baseId, headers) {
  const recordIds = [];
  const cache = {};

  for (const item of items) {
    const websiteId = (item.id || '').toLowerCase();
    if (!websiteId) continue;

    // Byg liste af IDs at prøve: fuldt ID først, så base-ID (uden sidste -xxx suffix)
    const idsToTry = [websiteId];
    const lastDash = websiteId.lastIndexOf('-');
    if (lastDash > 0) {
      idsToTry.push(websiteId.substring(0, lastDash));
    }

    let foundId = null;
    for (const tryId of idsToTry) {
      // Brug cache for at undgå gentagne API-kald for samme ID
      if (cache[tryId] !== undefined) {
        foundId = cache[tryId];
        break;
      }
      const searchUrl = 'https://api.airtable.com/v0/' + baseId + '/Produkter?filterByFormula=' +
        encodeURIComponent('({Website ID}="' + tryId + '")');
      const resp = UrlFetchApp.fetch(searchUrl, { method: 'GET', headers: headers, muteHttpExceptions: true });
      const result = JSON.parse(resp.getContentText());
      if (result.records && result.records.length > 0) {
        cache[tryId] = result.records[0].id;
        foundId = result.records[0].id;
        Logger.log('Produkt matchet: "' + websiteId + '" → "' + tryId + '" (' + foundId + ')');
        break;
      } else {
        cache[tryId] = null;
      }
    }

    if (foundId && recordIds.indexOf(foundId) === -1) {
      recordIds.push(foundId);
    } else if (!foundId) {
      Logger.log('⚠ Produkt ikke fundet i Airtable: ' + websiteId);
    }
  }

  return recordIds;
}

/**
 * Find eksisterende kunde på email, eller opret ny kunde
 * Returnerer Airtable record ID for kunden
 */
function findOrCreateCustomer(orderData, baseId, headers) {
  const email = orderData.customerEmail;

  // Søg efter eksisterende kunde med samme email
  const searchUrl = 'https://api.airtable.com/v0/' + baseId + '/Kunder?filterByFormula=' +
    encodeURIComponent('({Email}="' + email + '")');
  const searchResponse = UrlFetchApp.fetch(searchUrl, { method: 'GET', headers: headers });
  const searchResult = JSON.parse(searchResponse.getContentText());

  if (searchResult.records && searchResult.records.length > 0) {
    Logger.log('Airtable: Eksisterende kunde fundet (' + email + ')');
    return searchResult.records[0].id;
  }

  // Opret ny kunde
  Logger.log('Airtable: Opretter ny kunde (' + email + ')');
  const customerPayload = {
    fields: {
      'Kunde ID': sanitizeText(orderData.customerName || ''),
      'Navn': sanitizeText(orderData.customerName || ''),
      'Email': email,
      'Telefon': sanitizeText(orderData.customerPhone || ''),
      'Adresse': [sanitizeText(orderData.customerAddress || ''), sanitizeText(orderData.customerCityPostal || '')].filter(Boolean).join(', ')
    }
  };
  const createResponse = UrlFetchApp.fetch(
    'https://api.airtable.com/v0/' + baseId + '/Kunder',
    { method: 'POST', headers: headers, payload: JSON.stringify(customerPayload) }
  );
  const newCustomer = JSON.parse(createResponse.getContentText());

  if (!newCustomer.id) {
    throw new Error('Airtable kunde oprettelse fejlede: ' + createResponse.getContentText());
  }
  return newCustomer.id;
}

/**
 * TESTFUNKTION - Kør manuelt fra Apps Script editor for at diagnosere Airtable-forbindelsen
 * Slet eller ignorer denne funktion når alt virker
 */
function testAirtableConnection() {
  Logger.log('=== AIRTABLE DIAGNOSE START ===');

  // Trin 1: Tjek Script Properties
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('AIRTABLE_API_KEY');
  const baseId = props.getProperty('AIRTABLE_BASE_ID');

  Logger.log('API Key fundet: ' + (apiKey ? 'JA (' + apiKey.substring(0, 10) + '...)' : 'NEJ - mangler!'));
  Logger.log('Base ID fundet: ' + (baseId ? 'JA (' + baseId + ')' : 'NEJ - mangler!'));

  if (!apiKey || !baseId) {
    Logger.log('STOP: Manglende credentials i Script Properties');
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json'
  };

  // Trin 2: Hent liste over tabeller i basen (meta API)
  Logger.log('--- Tjekker tabeller i basen ---');
  try {
    const metaResponse = UrlFetchApp.fetch(
      'https://api.airtable.com/v0/meta/bases/' + baseId + '/tables',
      { method: 'GET', headers: headers }
    );
    const meta = JSON.parse(metaResponse.getContentText());
    if (meta.tables) {
      meta.tables.forEach(function(t) {
        Logger.log('Tabel fundet: "' + t.name + '"');
        t.fields.forEach(function(f) {
          Logger.log('  Felt: "' + f.name + '" (' + f.type + ')');
        });
      });
    } else {
      Logger.log('Meta svar: ' + metaResponse.getContentText());
    }
  } catch (err) {
    Logger.log('Meta API fejl: ' + err.toString());
  }

  // Trin 3: Test oprettelse af en testkunde
  Logger.log('--- Tester oprettelse i Kunder ---');
  let testCustomerId = null;
  try {
    const testCustomer = {
      fields: {
        'Navn': 'TEST KUNDE - slet mig',
        'Email': 'test@techboks.dk',
        'Telefon': '12345678',
        'Adresse': 'Testvej 1, 1234 Testby'
      }
    };
    const resp = UrlFetchApp.fetch(
      'https://api.airtable.com/v0/' + baseId + '/Kunder',
      { method: 'POST', headers: headers, payload: JSON.stringify(testCustomer), muteHttpExceptions: true }
    );
    Logger.log('Kunder HTTP status: ' + resp.getResponseCode());
    const result = JSON.parse(resp.getContentText());
    if (result.id) {
      testCustomerId = result.id;
      Logger.log('Kunder: OK - record oprettet: ' + result.id);
    } else {
      Logger.log('Kunder FEJL: ' + resp.getContentText());
    }
  } catch (err) {
    Logger.log('Kunder undtagelse: ' + err.toString());
  }

  // Trin 4: Test oprettelse i Ordrer (med linked kunde hvis muligt)
  Logger.log('--- Tester oprettelse i Ordrer ---');
  try {
    const testOrder = {
      fields: {
        'Ordre ID': 'TEST-ORD-slet-mig',
        'Salgsplatform': 'TechBoks.dk'
      }
    };
    if (testCustomerId) {
      testOrder.fields['Kunde'] = [testCustomerId];
    }
    const resp = UrlFetchApp.fetch(
      'https://api.airtable.com/v0/' + baseId + '/Ordrer',
      { method: 'POST', headers: headers, payload: JSON.stringify(testOrder), muteHttpExceptions: true }
    );
    Logger.log('Ordrer HTTP status: ' + resp.getResponseCode());
    Logger.log('Ordrer svar: ' + resp.getContentText());
    const result = JSON.parse(resp.getContentText());
    if (result.id) {
      Logger.log('Ordrer: OK - record oprettet: ' + result.id);
    } else {
      Logger.log('Ordrer FEJL - se svar ovenfor for detaljer');
    }
  } catch (err) {
    Logger.log('Ordrer undtagelse: ' + err.toString());
  }

  Logger.log('=== DIAGNOSE SLUT - se resultater ovenfor ===');
}
