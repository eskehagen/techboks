# EmailJS Opsætning Guide - TechBoks E-handel

## Oversigt
EmailJS giver dig mulighed for at sende emails direkte fra din hjemmeside uden backend-server. Når en kunde indsender en ordre, vil den blive sendt til din email (eskehagen@gmail.com).

## Trin 1: Opret EmailJS Konto

1. Gå til https://www.emailjs.com/
2. Klik "Sign Up" (øverst til højre)
3. Udfyld formularen med:
   - **Name**: Dit navn eller TechBoks
   - **Email**: eskehagen@gmail.com (eller din preferred email)
   - **Password**: Sikker password
4. Klik "Create Account"
5. Bekræft din email ved at klikke linket i emailen du modtager

## Trin 2: Få dine EmailJS Credentials

### Service ID:
1. Når du er logget ind, klik på "Email Services" i venstre menu
2. Klik "Add New Service"
3. Vælg "Gmail"
4. Klik "Connect Account" og log ind med din Gmail
5. Navngiv servicen: "TechBoks_Gmail"
6. **Kopier Service ID** (ser ud som: `service_xxxxx`) - du skal bruge dette senere

### Template ID:
1. Klik på "Email Templates" i venstre menu
2. Klik "Create New Template"
3. Giv den navn: "Order Confirmation"
4. I skabelonen, sæt følgende indhold:

```
Subject: 🛒 Ny ordre fra {{customer_name}} - TechBoks

To: {{to_email}}

---

**ORDRE BEKRÆFTELSE**

Kunde Information:
- Navn: {{customer_name}}
- Email: {{customer_email}}
- Telefon: {{customer_phone}}
- Adresse: {{customer_address}}

Forsendelsesmetode: {{shipping_method}}
Portokost: {{shipping_cost}} kr

---

**PRODUKTER:**
{{items_list}}

Subtotal: {{subtotal}} kr
Forsendelse: {{shipping_cost}} kr
TOTAL: {{total}} kr

Dato: {{order_date}}

---

Tak for ordren!
```

5. Klik "Save"
6. **Kopier Template ID** (ser ud som: `template_xxxxx`)

### Public Key:
1. Klik på "Account" i venstre menu
2. Under "API Keys", find "Public Key"
3. **Kopier Public Key** (starter med `pk_`)

## Trin 3: Integrer EmailJS i Websiden

Du har nu tre værdier:
- **Service ID**: `service_xxxxx`
- **Template ID**: `template_xxxxx`
- **Public Key**: `pk_xxxxx`

1. Åbn filen `c:\EHSProjects\TechBoks\techboks\emailjs-config.js`
2. Erstat værdierne:

```javascript
// emailjs-config.js
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID_HERE';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
```

3. Spar filen

## Trin 4: Test Systemet

1. Gå til din hjemmeside: http://localhost:8000/index.html (eller hvor du hosters den)
2. Tilføj et produkt til kurven
3. Gå til "Se Indkøbskurv"
4. Klik "Gå til Betaling"
5. Udfyld formularen:
   - Navn: Dit navn
   - Email: Din test email
   - Telefon: +4540000000
   - Adresse: Test Gade 1, 2100 KBH
6. Vælg forsendelsesmetode
7. Klik "Gennemfør ordre"

**Forventet resultat**: Du skal modtage en email med ordre detaljer inden for sekunder

## Trin 5: Opsæt Auto-reply til Kunder (Valgfrit)

Hvis du vil sende en bekræftelse til kunden også:

1. Opret en ny template kaldet "Customer Confirmation"
2. Send til `{{customer_email}}` i stedet for `{{to_email}}`
3. Opsæt det i checkout.html (se instruktioner nedenfor)

## EmailJS Integration i Checkout

Filen `checkout.html` indeholder allerede EmailJS kode, men du skal aktivere den:

1. Åbn `checkout.html` i en teksteditor
2. Find linjen: `emailjs.init(EMAILJS_PUBLIC_KEY);`
3. Det skal nu virke når en ordre indsendes

## Fejlfinding

**Problem**: "EmailJS is not defined"
- **Løsning**: Kontroller at `emailjs-config.js` er indlæst før checkout.html bruger det

**Problem**: "Service ID not found"
- **Løsning**: Kontroller at SERVICE_ID er kopieret korrekt fra EmailJS dashboard

**Problem**: Mails ankommer ikke
- **Løsning**:
  1. Tjek Gmail indstillinger - tillad "mindre sikre apps"
  2. Tjek spam-mappen
  3. Sikr at template variablerne matcher nøjagtigt

## Vigtige Noter

⚠️ **Sikkerhed**:
- Public Key er ikke hemmeligt (det er offentlig)
- Service ID og Template ID er også ikke hemmeligt
- Private Key skal ALDRIG deles

✅ **Limits**:
- EmailJS gratis tier tillader 200 emails/måned
- Dette burde være nok for små forretninger
- Upgrade mulig hvis du får flere ordrer

📧 **Test emails**:
- Første email tager 5-15 sekunder
- Efterfølgende emails er hurtigere
- Husk at tjekke spam-mappe

## Support

- EmailJS dokumentation: https://www.emailjs.com/docs/
- EmailJS dashboard: https://dashboard.emailjs.com/
- Gmail app passwords: https://support.google.com/accounts/answer/185833

---

Når du har udfyldt alle trin, skal hele e-handels systemet være funktionelt! 🎉
