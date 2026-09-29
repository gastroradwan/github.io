# GASTRORADWAN Public Web – Git workflow a rollback

## Účel

Tento dokument popisuje řízený způsob změn veřejného webu GASTRORADWAN.
Navazuje na `docs/SPEC_GASTRORADWAN_PUBLIC_WEB.md`, WEB-001 a WEB-002.

## Zdroj pravdy

- technický zdroj pravdy: GitHub repozitář `gastroradwan/github.io`;
- produkční větev: `main`;
- produkční hosting: GitHub Pages;
- doména je řízena souborem `CNAME`;
- významné změny musí být dohledatelné k Issue a Pull Requestu.

## Standardní změnový postup

1. Existuje GitHub Issue s cílem, rozsahem a akceptačními kritérii.
2. Z aktuálního `main` vznikne samostatná větev.
3. Změny se provedou pouze ve větvi.
4. Vznikne Pull Request do `main` s odkazem na Issue.
5. PR musí projít workflow `Validate Public Web`.
6. Před merge se ověří rozsah změn a případné dopady na EZApp, data, SEO, bezpečnost a integrace.
7. Po schválení se PR sloučí do `main`.
8. GitHub Pages provede produkční deployment.
9. Ověří se úspěšný deployment a základní dostupnost produkčního webu.
10. Výsledek se zaznamená do Issue/PR.

Významné změny se nesmějí provádět přímým commitem do `main`.

## CI pravidla

Workflow veřejného webu je validační, nikoli mutační:

- používá pouze `contents: read`;
- nesmí provádět `git commit` ani `git push`;
- nesmí automaticky opravovat produkční HTML;
- kontroluje interní odkazy, kotvy, lokální assety a povinnou hlavní navigaci;
- musí selhat, pokud validační proces sám změní pracovní strom.

## Rollback

Rollback se provádí novým dohledatelným commitem/PR; historie `main` se nepřepisuje.

### Preferovaný postup

1. Určit poslední známý dobrý commit v `main`.
2. Identifikovat commit nebo merge, který způsobil regresi.
3. Vytvořit urgentní Issue nebo použít existující incidentní Issue.
4. Vytvořit rollback větev z aktuálního `main`.
5. Revertovat vadný commit ve větvi.
6. Otevřít Pull Request s popisem incidentu a identifikací revertovaného commitu.
7. Nechat proběhnout `Validate Public Web`.
8. Po úspěšné kontrole PR sloučit.
9. Ověřit úspěšný GitHub Pages deployment a produkční web.

### Nouzový režim

Při závažném produkčním incidentu lze proces zrychlit, ale změna musí zůstat dohledatelná: Issue/incident, samostatný revert commit, následné ověření deploymentu a dodatečný audit.

Zakázáno je přepisování historie `main` pomocí force-push jako běžný rollback mechanismus.

## Hranice

Tento workflow se týká veřejného webu. Změny autentizace, Customer 360, Supabase, EZApp API nebo zákaznických dat se řídí samostatnými EZApp Issues a bezpečnostními gate definovanými v řídicí specifikaci.
