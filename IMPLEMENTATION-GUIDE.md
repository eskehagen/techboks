# 🚀 TechBoks E-handel System - Implementerings Guide

## ✅ Hvad er implementeret

Dit komplette e-handels system er nu opsat med:

### 🛒 Shopping Cart System
- **cart.js** - Lagrer kurven i localStorage (data gemmes når browser lukkes)
- **cart.html** - Kurv side hvor kunder kan se og redigere deres indkøbs
- **Quantity controls** - +/- knapper på alle produktsider
- **Cart badge** - Viser antal varer i kurven i navigation

### 💳 Checkout System
- **checkout.html** - Betaling side med:
  - Valg af forsendelsesmetode (Post 45/55 kr eller Afhentning gratis)
  - Kunde oplysninger (navn, email, telefon, adresse)
  - Validering af alle felter
  - Order oversigt med priser

### 📧 Email Notifikationer
- **emailjs-config.js** - EmailJS konfiguration
- **Automatiske ordre emails** - Sendes til dig når kunde indgiver ordre
- **Order detaljer** - Email indeholder alle produkter, priser og kundeoplysninger

### ✨ Alle 15 produktsider opdateret
- centerboks.html, frontboks.html, vinterdeksel.html
- kabelophang.html, kabelophanglarge.html, 6pack.html
- anhangerprop.html, hattehyldeclips.html, skraldespand.html
- nakkestottekrog.html, bagagerumkrog.html, frontboksmobilmount.html
- skillerum.html, hattehyldekrog.html, gulvmattetemplate.html

---

## 📋 Next Steps - Hvad du skal gøre

### Trin 1: Opsæt EmailJS (VIGTIG)

Se filen: `EMAILJS-SETUP.md` i projektmappen for detaljerede instruktioner

Kort opsummering:
1. Gå til https://www.emailjs.com/ og opret gratis konto
2. Opret Gmail service
3. Opret email template
4. Kopier dine credentials (Service ID, Template ID, Public Key)
5. Indsæt dem i `emailjs-config.js`:

```javascript
const EMAILJS_SERVICE_ID = 'din_service_id_her';
const EMAILJS_TEMPLATE_ID = 'din_template_id_her';
const EMAILJS_PUBLIC_KEY = 'din_public_key_her';
```

### Trin 2: Test Systemet Lokalt

Hvis du har Node.js installeret, kan du køre:
```bash
cd c:\EHSProjects\TechBoks\techboks
npx http-server
```

Eller brug Python 3:
```bash
python -m http.server 8000
```

Besøg: http://localhost:8000/index.html

### Trin 3: Test Ordre Flow

1. Gå til produktsiden (f.eks. mustang-mach-e.html)
2. Vælg et produkt
3. Øg mængde hvis ønsket
4. Klik "Tilføj til kurv"
5. Gå til "🛒 Kurv" (øverst i navigation)
6. Klik "Gå til Betaling"
7. Udfyld formular med test data:
   - **Navn**: Dit navn
   - **Email**: Din email
   - **Telefon**: +4540000000
   - **Adresse**: Test vej 1, 2100 København Ø
8. Vælg forsendelsesmetode
9. Klik "Gennemfør ordre"
10. Tjek din email for ordre bekræftelse

---

## 📂 Filstruktur - Nye Filer

```
techboks/
├── cart.js                      ✨ NEW - Shopping cart logik
├── cart.html                    ✨ NEW - Shopping cart side
├── checkout.html                ✨ NEW - Betaling side
├── order-confirmation.html      ✨ NEW - Ordre bekræftelse side
├── emailjs-config.js           ✨ NEW - EmailJS konfiguration
├── EMAILJS-SETUP.md            ✨ NEW - EmailJS opsætnings guide
├── index.html                  🔄 UPDATED - Added cart link
├── mustang-mach-e.html         🔄 UPDATED - Added cart link
└── product_sites/
    ├── centerboks.html         🔄 UPDATED - Added add to cart button
    ├── frontboks.html          🔄 UPDATED - Added add to cart button
    ├── vinterdeksel.html       🔄 UPDATED - Added add to cart button
    ├── 6pack.html              🔄 UPDATED - Added add to cart button
    ├── anhangerprop.html       🔄 UPDATED - Added add to cart button
    ├── bagagerumkrog.html      🔄 UPDATED - Added add to cart button
    ├── frontboksmobilmount.html 🔄 UPDATED - Added add to cart button
    ├── gulvmattetemplate.html  🔄 UPDATED - Added add to cart button
    ├── hattehyldeclips.html    🔄 UPDATED - Added add to cart button
    ├── hattehyldekrog.html     🔄 UPDATED - Added add to cart button
    ├── kabelophang.html        🔄 UPDATED - Added add to cart button
    ├── kabelophanglarge.html   🔄 UPDATED - Added add to cart button
    ├── nakkestottekrog.html    🔄 UPDATED - Added add to cart button
    ├── skillerum.html          🔄 UPDATED - Added add to cart button
    └── skraldespand.html       🔄 UPDATED - Added add to cart button
```

---

## 🧪 Test Checklist

Efter at have sat EmailJS op:

- [ ] Kan tilføje produkter til kurv fra produktsider
- [ ] Kurv badge viser korrekt antal varer
- [ ]Cart data gemmes når jeg lukker browsertab
- [ ] Kan se alle produkter i kurv side
- [ ] Kan ændre mængde i kurv
- [ ] Kan fjerne produkter fra kurv
- [ ] Kan gå til checkout fra kurv
- [ ] Forsendelsesmetode ændrer prisen korrekt
- [ ] Formular validering virker (fejl på tomme felter)
- [ ] Ordre indsendes uden fejl
- [ ] Email modtaget i inbox med alle detaljer
- [ ] Ordre bekræftelse side viser korrekte info
- [ ] Kan gå tilbage til handling efter ordre

---

## ⚙️ Konfiguration & Tilpasning

### Ændre Portokostning

I **checkout.html**, søg efter:
```javascript
const shippingCosts = {
    'post-45': 45,
    'post-55': 55,
    'pickup': 0
};
```

Ændre værdierne til dine ønskede portokostninger.

### Ændre Email Modtager

I **emailjs-config.js**:
```javascript
const SHOP_EMAIL = 'din-email@example.com';
```

### Tilpasse Email Template

I EmailJS dashboard, rediger "Order Confirmation" template hvis du vil ændre email format.

---

## 🔐 Sikkerhed & Best Practices

✅ **Godt gjort**:
- Bruger localStorage til kurv (sikker, ingen server)
- Bruger EmailJS (no-backend solution)
- Public Key er ikke hemmeligt (det er meningen)

⚠️ **Vigtigt**:
- Ikke commit kode med rigtige EmailJS credentials til git
- Brug `.gitignore` hvis du har secrets
- Tjek spam-mappe når du tester

---

## 🐛 Fejlfinding

### Problem: "Cart ikke synlig"
**Løsning**: Tjek browser console for fejl (F12)

### Problem: "Ordre indsendt men ingen email"
**Løsning**:
1. Tjek at EmailJS credentials er korrekt i emailjs-config.js
2. Tjek spam-mappe
3. Åbn EmailJS dashboard og tjek om mail blev sendt

### Problem: "Produkter ikke tilføjet til kurv"
**Løsning**:
1. Tjek at cart.js bliver indlæst (F12 → Sources)
2. Tjek for JavaScript fejl i console

### Problem: "Form validering virker ikke"
**Løsning**:
1. Tjek email format: skal være valid email
2. Tjek telefon format: skal være dansk nummer
3. Alle felter skal være udfyldt

---

## 📞 Support & Resources

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **EmailJS Dashboard**: https://dashboard.emailjs.com/
- **Teste email**: Til localhost kan du bruge http-server

---

## 🎉 Du er klar!

Dit e-handels system er nu klar til brug. Når du har sat EmailJS op, vil hele systemet være funktionelt!

**Næste skridt efter test**:
1. Deploy hjemmesiden til hosting (f.eks. GitHub Pages, Vercel, Netlify)
2. Sæt egentlig domæne op (f.eks. techboks.dk)
3. Sæt SSL certificat op (HTTPS)
4. Start med at sælge! 🎉

Lykke til med TechBoks!
