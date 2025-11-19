# TechBoks Produktstruktur

## Oversigt
Dette dokument beskriver den nye produktstruktur for TechBoks hjemmesiden. Produkter identificeres nu med sigende navne i stedet for generiske numre.

## Produkter

### Mustang Mach-E Gadgets

| Produkt ID | Produktnavn | Pris | Filer |
|------------|-------------|------|-------|
| `centerboks` | Center Konsol Boks | 90 kr | `centerboks.html`, `centerboks.stl`, `centerboks.3mf` |
| `frontboks` | Front Boks | 90 kr | `frontboks.html`, `frontboks.stl`, `frontboks.3mf` |
| `vinterdeksel` | Vinter Cover | 90 kr | `vinterdeksel.html`, `vinterdeksel.stl`, `vinterdeksel.3mf` |
| `kabelophang` | Kabel Ophæng | 90 kr | `kabelophang.html`, `kabelophang.stl` |
| `kabelophanglarge` | Kabel Ophæng (Large) | 110 kr | `kabelophanglarge.html`, `kabelophanglarge.stl`, `kabelophanglarge.3mf` |
| `anhangerprop` | Anhængertræk Prop | 40 kr | `anhangerprop.html`, `anhangerprop.stl`, `anhangerprop.3mf` |

## Mappestruktur

```
techboks/
├── index.html                      # Hovedside
├── mustang-mach-e.html             # Mustang Mach-E produktoversigt
├── product_sites/                  # Individuelle produktsider
│   ├── centerboks.html
│   ├── frontboks.html
│   ├── vinterdeksel.html
│   ├── kabelophang.html
│   ├── kabelophanglarge.html
│   ├── anhangerprop.html
│   └── reserved.html
├── 3d-models/                      # 3D model filer
│   ├── centerboks.stl
│   ├── centerboks.3mf
│   ├── frontboks.stl
│   ├── frontboks.3mf
│   ├── vinterdeksel.stl
│   ├── vinterdeksel.3mf
│   ├── kabelophang.stl
│   ├── kabelophanglarge.stl
│   ├── kabelophanglarge.3mf
│   ├── anhangerprop.stl
│   └── anhangerprop.3mf
└── images/                         # Produktbilleder
    ├── centerConsol1.jpg
    ├── centerConsol2.jpg
    ├── centerConsol3.jpg
    ├── frontBox1.jpg
    ├── frontBox2.jpg
    ├── frontBox3.jpg
    ├── vinterCover1.jpg
    ├── vinterCover2.jpg
    ├── ladekabel_std1.jpg
    ├── ladekabel_std2.jpg
    ├── ladekabel_large1.jpg
    ├── ladekabel_large2.jpg
    ├── ladekabel_large3.jpg
    └── anhangerProp.jpg
```

## Sådan tilføjer du et nyt produkt

1. **Opret 3D-filer**: Gem STL/3MF filer i `3d-models/` med produktets ID som filnavn (fx `nytprodukt.stl`)

2. **Tilføj billeder**: Gem produktbilleder i `images/` med beskrivende navne (fx `nytprodukt1.jpg`, `nytprodukt2.jpg`)

3. **Opret produktside**: Kopier en eksisterende HTML-fil fra `product_sites/` og omdøb til produktets ID (fx `nytprodukt.html`)
   - Opdater titel, beskrivelse og billeder
   - Opdater 3D-viewer stien til det korrekte STL-filnavn

4. **Tilføj til produktliste**: I `mustang-mach-e.html`, tilføj et nyt objekt til `products` arrayet:
   ```javascript
   {
       id: 'nytprodukt',
       name: "Nyt Produkt Navn",
       description: "Kort beskrivelse",
       price: 90,
       image: 'nytprodukt1.jpg'
   }
   ```

## Navngivningskonventioner

- **Produkt ID**: Brug små bogstaver uden mellemrum (camelCase eller kebab-case)
  - Eksempler: `centerboks`, `kabelophang`, `anhangerprop`
  
- **HTML-filer**: `{produkt-id}.html`
  - Eksempler: `centerboks.html`, `frontboks.html`

- **3D-filer**: `{produkt-id}.stl` eller `{produkt-id}.3mf`
  - Eksempler: `centerboks.stl`, `frontboks.3mf`

- **Billeder**: Brug beskrivende navne med camelCase eller kebab-case
  - Eksempler: `centerConsol1.jpg`, `frontBox1.jpg`, `vinterCover1.jpg`

## Migration fra gammel struktur

Den gamle struktur brugte generiske navne som `product-1.html`, `product-2.html` osv. 

**Mapping fra gammel til ny struktur:**
- `product-1.html` → `centerboks.html`
- `product-2.html` → `frontboks.html`
- `product-3.html` → `vinterdeksel.html`
- `product-4.html` → `kabelophang.html`
- `product-5.html` → `kabelophanglarge.html`
- `product-6.html` → `anhangerprop.html`

## Fordele ved den nye struktur

1. **Bedre overskuelighed**: Det er nemt at se hvilket produkt en fil hører til
2. **Lettere vedligeholdelse**: Ingen behov for at huske hvilket nummer hører til hvilket produkt
3. **Skalerbarhed**: Nemt at tilføje nye produkter uden at skulle ændre nummerering
4. **Professionelt**: Sigende navne gør kodebasen mere professionel og let at navigere
