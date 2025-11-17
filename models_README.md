# 3D Model Filer til TechBoks

Denne mappe indeholder alle STL-filer for produkterne.

## Filnavngivning

Alle STL-filer skal navngives som: `product-{id}.stl`

Eksempel:
- `product-1.stl` - Personlig Nøglering
- `product-2.stl` - Telefon Holder
- `product-3.stl` - Plante Urtepotte
- `product-4.stl` - Kabel Organizer
- `product-5.stl` - Bordlampefod
- `product-6.stl` - Krus Holder

## Upload til GitHub

1. Placer alle dine STL-filer i denne mappe
2. Commit og push til GitHub
3. 3D vieweren vil automatisk hente filerne fra:
   ```
   https://raw.githubusercontent.com/eskehagen/techboks/main/models/product-{id}.stl
   ```

## Filformat

- **Format**: STL (ASCII eller Binary)
- **Anbefalede dimensioner**: Modeller skaleres automatisk, men hold dem under 10MB for optimal performance
- **Orientering**: Modellerne centreres automatisk i vieweren

## Test dine modeller

For at teste om dine STL-filer virker:
1. Upload filen til GitHub
2. Åbn produktsiden i browseren
3. 3D vieweren skulle automatisk vise modellen
4. Hvis ikke, tjek browser console for fejlmeddelelser

## Fallback

Hvis en STL-fil ikke kan findes eller indlæses, vil produktkortet vise produkt-emoji'en i stedet.