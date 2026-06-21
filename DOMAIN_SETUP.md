# Napojení domény www.gastroradwan.eu

## Cíl
Veřejný web GASTRORADWAN bude dostupný na:

- https://www.gastroradwan.eu
- kořenová doména https://gastroradwan.eu bude přesměrována na www variantu

## Doporučené DNS nastavení

### Záznam pro www

| Typ | Název | Hodnota |
|---|---|---|
| CNAME | www | gastroradwan.github.io |

### Kořenová doména
Kořenovou doménu `gastroradwan.eu` je vhodné přesměrovat na `https://www.gastroradwan.eu` u registrátora nebo hostingu.

## Pořadí kroků

1. Ověřit správce DNS zóny domény.
2. Přidat CNAME záznam pro `www`.
3. Počkat na propagaci DNS.
4. Ověřit, že `www.gastroradwan.eu` směřuje na GitHub Pages.
5. Přidat do kořene repozitáře soubor `CNAME` s obsahem:

```text
www.gastroradwan.eu
```

6. V GitHub Pages nastavit Custom domain.
7. Zapnout Enforce HTTPS.
8. Přepsat adresy v `sitemap.xml` a `robots.txt` z GitHub adresy na finální doménu.
9. Ověřit hlavní stránku, podstránky, mobilní navigaci a interní odkazy.

## Bezpečnostní poznámka
Soubor `CNAME` nepřidávat dříve, než budou připravené DNS záznamy. Jinak může být web dočasně nedostupný.
