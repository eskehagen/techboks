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

    // Send mail til ejer
    Logger.log('Sender email til butikkejer...');
    sendOrderEmailToShop(data);
    Logger.log('✓ Email sendt til butikkejer');

    // Send mail til kunde
    Logger.log('Sender email til kunde: ' + data.customerEmail);
    sendOrderEmailToCustomer(data);
    Logger.log('✓ Email sendt til kunde');

    // Opdater caches
    cache.put(emailKey, 'true', 300);
    cache.put(globalKey, (globalCount + 1).toString(), 3600);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Ordre modtaget og emails sendt',
      orderId: generateOrderId(),
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
function sendOrderEmailToShop(orderData) {
  try {
    const shopEmail = 'eskehagen@gmail.com';

    // Validering
    if (!shopEmail || !isValidEmail(shopEmail)) {
      throw new Error('Ugyldig butik email: ' + shopEmail);
    }

    // Formatér items liste
    let itemsHtml = '';
    if (orderData.items && Array.isArray(orderData.items)) {
      itemsHtml = orderData.items.map(item => `
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px;">${sanitizeText(item.name)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;"><strong>${(item.price * item.quantity).toFixed(2)} kr</strong></td>
        </tr>
      `).join('');
    }

    // Formatér bemærkninger
    let notesSection = '';
    if (orderData.customerNotes && orderData.customerNotes.trim() !== '') {
      notesSection = `<p style="margin: 15px 0; padding: 15px; background: #f0f0f0; border-left: 4px solid #667eea; font-size: 14px; color: #333;">${sanitizeText(orderData.customerNotes)}</p>`;
    }

    const subject = `Ny TechBoks.dk ordre - ${sanitizeText(orderData.customerName)}`;

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
            .header h1 { margin: 0; font-size: 26px; font-weight: bold; }
            .header p { margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; }
            .section { padding: 20px; border-bottom: 1px solid #f0f0f0; }
            .section:last-child { border-bottom: none; }
            .section h2 { color: #667eea; font-size: 15px; margin: 0 0 15px 0; font-weight: bold; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; }
            .info-item { background: #f9f9f9; padding: 10px; border-radius: 5px; }
            .info-label { color: #667eea; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { margin-top: 4px; color: #333; font-size: 13px; }
            .products-table { width: 100%; border-collapse: collapse; margin: 0; background: white; }
            .products-table th { background: #667eea; color: white; padding: 10px; text-align: left; font-size: 11px; font-weight: bold; }
            .products-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            .products-table tr:last-child td { border-bottom: none; }
            .price-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; border-radius: 8px; margin: 15px 0; }
            .price-row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
            .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid rgba(255,255,255,0.3); padding-top: 8px; margin-top: 8px; }
            .info-box { background: #e8f4f8; padding: 12px; border-radius: 5px; border-left: 4px solid #667eea; font-size: 12px; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 11px; }
            .footer p { margin: 3px 0; }
            @media (max-width: 600px) {
              body { padding: 5px; }
              .wrapper { padding: 5px 0; }
              .container { border-radius: 4px; }
              .header { padding: 25px 15px; }
              .header h1 { font-size: 22px; }
              .header p { font-size: 12px; }
              .section { padding: 15px; }
              .section h2 { font-size: 14px; margin-bottom: 12px; }
              .info-grid { grid-template-columns: 1fr; gap: 8px; }
              .info-item { padding: 8px; }
              .info-label { font-size: 9px; }
              .info-value { font-size: 12px; margin-top: 3px; }
              .products-table th { padding: 8px; font-size: 10px; }
              .products-table td { padding: 8px; font-size: 12px; }
              .price-box { padding: 15px; margin: 12px 0; }
              .price-row { font-size: 12px; margin: 5px 0; }
              .total-row { font-size: 15px; }
              .info-box { padding: 10px; font-size: 11px; }
              .footer { padding: 12px; font-size: 10px; }
              .footer p { margin: 2px 0; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div style="margin-bottom: 15px;">
                  <img src="https://www.techboks.dk/images/logo_transparent.png" alt="TechBoks Logo" style="max-width: 120px; height: auto;">
                </div>
                <h1>NY ORDRE MODTAGET</h1>
                <p>TechBoks.dk Ordresystem</p>
              </div>

              <div class="section">
                <h2>Kunde Information</h2>
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
                    <div class="info-value">${sanitizeText(orderData.customerAddress)}</div>
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

              <div style="padding: 25px 20px;">
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
                  <p><strong>Ordre modtaget:</strong> ${new Date().toLocaleString('da-DK')}</p>
                </div>
              </div>

              <div class="footer">
                <p><strong>TechBoks.dk</strong></p>
                <p>3D printede produkter i høj kvalitet</p>
                <p>&copy; 2025 TechBoks. Alle rettigheder forbeholdt.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    Logger.log('Sender til: ' + shopEmail);
    Logger.log('Emne: ' + subject);
    GmailApp.sendEmail(shopEmail, subject, {
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
function sendOrderEmailToCustomer(orderData) {
  try {
    const customerEmail = orderData.customerEmail;

    // Validering
    if (!customerEmail || !isValidEmail(customerEmail)) {
      throw new Error('Ugyldig kunde email: ' + customerEmail);
    }

    // Formatér items liste
    let itemsHtml = '';
    if (orderData.items && Array.isArray(orderData.items)) {
      itemsHtml = orderData.items.map(item => `
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px;">${sanitizeText(item.name)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;"><strong>${(item.price * item.quantity).toFixed(2)} kr</strong></td>
        </tr>
      `).join('');
    }

    // Formatér bemærkninger
    let notesSection = '';
    if (orderData.customerNotes && orderData.customerNotes.trim() !== '') {
      notesSection = `<p style="margin: 12px 0; font-size: 14px; color: #555;"><em>"${sanitizeText(orderData.customerNotes)}"</em></p>`;
    }

    const subject = '✅ Ordrebekræftelse - TechBoks.dk';

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
            .header h1 { margin: 0; font-size: 26px; font-weight: bold; }
            .header p { margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; }
            .greeting { padding: 20px; background: #f9f9f9; border-bottom: 2px solid #667eea; }
            .greeting h2 { color: #667eea; font-size: 16px; margin: 0 0 8px 0; }
            .greeting p { margin: 4px 0; font-size: 13px; color: #555; }
            .section { padding: 20px; border-bottom: 1px solid #f0f0f0; }
            .section h3 { color: #667eea; font-size: 13px; margin: 0 0 12px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
            .products-table { width: 100%; border-collapse: collapse; margin: 0; background: white; }
            .products-table th { background: #667eea; color: white; padding: 10px; text-align: left; font-size: 11px; font-weight: bold; }
            .products-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            .products-table tr:last-child td { border-bottom: none; }
            .highlight-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; border-radius: 8px; margin: 15px 0; }
            .highlight-box p { margin: 6px 0; font-size: 13px; }
            .highlight-box strong { font-size: 16px; }
            .info-list { list-style: none; margin: 10px 0; }
            .info-list li { padding: 8px 0; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
            .info-list li:last-child { border-bottom: none; }
            .info-list-label { color: #667eea; font-weight: bold; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 11px; }
            .footer p { margin: 3px 0; }
            .divider { height: 2px; background: linear-gradient(90deg, #667eea 0%, transparent 50%, #667eea 100%); margin: 10px 0; }
            @media (max-width: 600px) {
              body { padding: 5px; }
              .wrapper { padding: 5px 0; }
              .container { border-radius: 4px; }
              .header { padding: 25px 15px; }
              .header h1 { font-size: 22px; }
              .header p { font-size: 12px; }
              .greeting { padding: 15px; }
              .greeting h2 { font-size: 15px; margin-bottom: 6px; }
              .greeting p { font-size: 12px; margin: 3px 0; }
              .section { padding: 15px; }
              .section h3 { font-size: 12px; margin-bottom: 10px; }
              .products-table th { padding: 8px; font-size: 10px; }
              .products-table td { padding: 8px; font-size: 12px; }
              .highlight-box { padding: 15px; margin: 12px 0; }
              .highlight-box p { font-size: 12px; margin: 5px 0; }
              .highlight-box strong { font-size: 15px; }
              .info-list li { padding: 6px 0; font-size: 12px; }
              .footer { padding: 12px; font-size: 10px; }
              .footer p { margin: 2px 0; }
              .divider { margin: 8px 0; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div style="margin-bottom: 15px;">
                  <img src="https://www.techboks.dk/images/logo_transparent.png" alt="TechBoks Logo" style="max-width: 120px; height: auto;">
                </div>
                <h1>ORDREBEKRÆFTELSE</h1>
                <p>Din ordre er modtaget og bekræftet</p>
              </div>

              <div class="greeting">
                <h2>Hej ${sanitizeText(orderData.customerName)}!</h2>
                <p>Tusind tak for interessen for mine Mustang gadgets!</p>
                <p>Din ordre er modtaget og bekræftet. Print og klargøring af netop dine produkter startes nu.</p>
              </div>

              <div class="section">
                <h3>Dine Produkter</h3>
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
                </ul>
              </div>

              <div style="padding: 25px 20px;">
                <div class="highlight-box">
                  <p>Subtotal: ${parseFloat(orderData.subtotal).toFixed(2)} kr</p>
                  <p>Forsendelse: ${parseFloat(orderData.shippingCost).toFixed(2)} kr</p>
                  <div class="divider"></div>
                  <p><strong>TOTAL: ${parseFloat(orderData.total).toFixed(2)} kr</strong></p>
                </div>
              </div>

              <div class="section" style="background: #f0f7ff;">
                <h3>Leveringstid</h3>
                <p style="font-size: 14px; margin: 0;">Afhængig af ordrens størrelse og travlhed skal du forvente <strong>1 uges klargøring</strong> af produkterne. Du vil modtage besked så snart din ordre er klar til forsendelse eller afhentning.</p>
              </div>

              <div class="section" style="background: #f0f7ff;">
                <h3>Betaling</h3>
                <p style="font-size: 14px; margin: 0;">Betal venligst via <strong>MobilePay</strong> til: <strong style="font-size: 16px;">50935952</strong></p>
                <p style="font-size: 14px; margin: 8px 0 0 0;">Betal før forsendelse eller ved afhentning.</p>
              </div>

              <div class="section" style="background: #e8f5e9;">
                <h3>Spørgsmål?</h3>
                <p style="font-size: 14px; margin: 0;">Hvis du har spørgsmål til din ordre, kan du besvare denne mail. Jeg svarer hurtigst muligt!</p>
              </div>

              <div class="footer">
                <p><strong>TechBoks.dk</strong></p>
                <p>Eske Hagen Sinding</p>
                <p>3D printede produkter i høj kvalitet</p>
                <p style="margin-top: 8px; opacity: 0.8;&copy; 2025 TechBoks. Alle rettigheder forbeholdt.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    Logger.log('Sender til customer: ' + customerEmail);
    Logger.log('Emne: ' + subject);
    GmailApp.sendEmail(customerEmail, subject, {
      htmlBody: htmlBody
    });
    Logger.log('✓ Email til kunde sendt');

  } catch (error) {
    Logger.log('❌ FEJL ved email til kunde: ' + error.toString());
    throw new Error('Kunne ikke sende email til kunde: ' + error.toString());
  }
}

/**
 * Generer unik ordre ID
 */
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}
