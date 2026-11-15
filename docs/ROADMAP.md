# Digi Enrich – Roadmap und priorisierte Aufgaben

Stand: 2026-11-15 | Prinzip: **erst lauffähige CSV-Baseline, dann UX/Integrationen**

Diese Roadmap ist eine Planung, keine Behauptung abgeschlossener Implementierung. Abgeschlossen sind die GitHub-Upstream-Synchronisierung, die initiale Projektdokumentation und **P0-01 (lokaler Start und CSV-Upload bis zur API-Key-Abfrage, vom Nutzer am 15.11.2026 bestätigt)**. Am 15.11.2026 bestätigte der Nutzer zusätzlich einen nach Behebung eines Shell-Key-Konflikts erfolgreich durchgelaufenen Firecrawl-/OpenRouter-Enrichment-Lauf mit gefundenen Ergebnissen. Damit ist P0-02 funktional abgeschlossen; P0-03 (Quellen-/Qualitätsprüfung und CSV-Export) bleibt offen.

## Scope / Priorisierung

| Phase | Priorität | Ziel | Definition of Done | Stand |
| --- | --- | --- | --- | --- |
| 0. Fork-Basis | P0 | GitHub-Fork aktuell, Dokumentation/Backlog | `main` mit Firecrawl synchronisiert; Dokumente im Repo | GitHub-Sync + Dokumentation erledigt |
| 1. Lokaler Checkout | P0 | Aktuellen Fork lokal laden und starten | Lokalstart und CSV-Upload bis zur API-Key-Abfrage bestätigt; einzelne Git-/Build-Checks nicht separat belegt | **Abgeschlossen nach Nutzerbestätigung** |
| 2. Minimaler Provider-Pfad | P0 | Vorhandenen Firecrawl-Key und OpenRouter sicher anbinden | Nach behobenem Shell-Key-Konflikt wurde ein vollständiger Enrichment-Lauf mit gefundenen Daten vom Nutzer bestätigt; Detailvalidierung in P0-03 | **Abgeschlossen (funktional)** |
| 3. CSV-Baseline-Test | P0 | Enrichment fachlich nachweisen | 1–3 berechtigte Testdatensätze, 3–5 Firmenfelder, Ergebnis-/Quellen-/Kostenprotokoll und CSV-Export | Offen |
| 4. Produkt-/UX-Grundlage | P1 | Digi-Pal Branding und klares Bedienkonzept | Penpot-Entwurf bestätigt; UI bei Funktionserhalt minimal angepasst | Geplant |
| 5. Erste Produkt-Härtung | P1 | Sichere interne Pilot-Nutzung | Authentifizierung, Logging/Secret-Prüfung, kontrollierte Limits, Datenschutzkonzept | Geplant |
| 6. Integrationen/Erweiterungen | P2 | EspoCRM, zusätzliche OSINT-/Scraper-Quellen | gesonderte Machbarkeitsprüfung pro Modul | Zurückgestellt |
| 7. Kundenfähige Lösung | P3 | Optionale Bereitstellung bei Dritten | Compliance, Berechtigungen, Betriebs- und Kostentransparenz, Supportkonzept | Zukunft |

## Reihenfolge der ersten konkreten Arbeiten

### P0-01 – Vorhandenen Klon finden und Git-Basis prüfen (abgeschlossen nach Nutzerbestätigung)

- Lokalen Projektpfad ermitteln; **nicht** versehentlich erneut in ein vorhandenes Projekt klonen.
- `git status --short`, `git branch --show-current`, `git remote -v`, `git log -5 --oneline` prüfen.
- Vorhandene lokale Änderungen zuerst sichern/prüfen.
- `origin` auf `patrick-reuver/digi-enrich`, `upstream` auf `firecrawl/fire-enrich` setzen.
- Lokalen `main` mit dem **bereits auf GitHub aktualisierten** `origin/main` fast-forwarden, keinesfalls ungeprüft force-pushen.
- `npm ci` (vorzugsweise vorhandene npm-Lockdatei respektieren), `npm run build` und `npm run dev` testen.
- Ergebnis, Systemvoraussetzungen und Fehlermeldungen dokumentieren.

**Abnahmevermerk 15.11.2026:** Nach erfolgloser Suche wurde der aktuelle Fork lokal geklont. Die Weboberfläche startete; ein CSV-Upload führte zur Firecrawl-Key-Abfrage (Nutzerbestätigung). Separater Produktions-Build und tatsächliche Remotes sind noch nicht durch eine Terminalausgabe belegt; als ergänzende Checks offen, ohne P0-02 zu blockieren.

### P0-02 – OpenRouter minimal kompatibel anbinden (abgeschlossen: Nutzerbestätigung 15.11.2026)

- Alle tatsächlich produktiven OpenAI-Client-Instanzen und Modellstrings ermitteln (`lib/services/openai.ts`, `app/api/generate-fields/route.ts`, ggf. weitere).
- Festhalten: Aktueller Code enthält `gpt-5`/`gpt-5-mini`; README-Text zu GPT-4o ist veraltet.
- Einen zentralen, kleinen Konfigurationspunkt für `baseURL`, API-Key und Modellbezeichner schaffen, ohne die Agentenarchitektur neu zu schreiben.
- OpenRouter-Endpunkt `https://openrouter.ai/api/v1`, dazu passende Modell-ID und Zod/`response_format`-Kompatibilität prüfen.
- Ggf. für den ersten Test auf ein **konkret bestätigtes kompatibles Modell** festlegen; erst danach echte Modellalternativen prüfen.
- Firecrawl-Zugang aus lokaler `.env.local`, keine API-Keys aus browserseitigem `localStorage` für den geplanten Normalbetrieb.
- Konkreten Token-/Credit-Verbrauch klein halten und Test nur nach Freigabe ausführen.

**Abnahmevermerk:** Der Nutzer bestätigte einen vollständig durchgelaufenen Enrichment-Lauf mit gefundenen Daten über Firecrawl und OpenRouter, nachdem `unset OPENAI_API_KEY` einen globalen Shell-Key-Konflikt beseitigte. Formale Ergebnis-/Quellenprüfung, Export und Kostenmessung gehören zu P0-03; ein separater Produktions-Build ist nicht nachgewiesen. Der Feature-Branch/PR #1 ist noch nicht in `main` gemerged.

### P0-03 – CSV-Smoke-Test und Bewertung

- Kleine CSV mit 1–3 eigenen/freigegebenen beruflichen Beispielen; definierte E-Mail-Spalte.
- Nur 3–5 Standardfelder (z. B. Firmenname, Branche, Website, Standort, Unternehmensgröße).
- Testmatrix: ursprüngliche Werte, recherchierte Werte, Quellennachweis, Konfidenz, Validierung, Fehlermeldung, Dauer, Provider/Modell und Verbrauch.
- Fehlende Werte als fehlend markieren, nicht erfinden; Domain-/Personenkonflikte gesondert protokollieren.
- Exportdatei auf Spalten, UTF-8, korrekte Zuordnung und Quellennachweis prüfen.
- **Kein** EspoCRM-Sync, keine Bulk-Discovery, keine automatisierte Mail-Verifizierung.

**Abnahme:** Testprotokoll mit nachvollziehbaren Ergebnissen, CSV-Export und Go/No-Go für UI/Branding.

## Nach der Baseline (Backlog, kein MVP-Umfang)

1. **P1 UI/UX und Digi-Pal-Branding:** Penpot-Flow für CSV-Upload → Feldwahl → Jobstatus → Ergebnisse/Quellen → Export; Brandfarben/Typografie, Barrierefreiheit, bestehende MIT-Hinweise beibehalten.
2. **P1 Härtung:** Benutzerzugriff, sichere Credentials, datensparsame Logs, Löschkonzept, defensives Rate-Limiting; bestehende Inkonsistenzen der Zeilen-/Feld-/Upload-Limits bereinigen.
3. **P2 Kontakt-Discovery:** rechtmäßige, belegte Ansprechpartner-Suche mit Identitätsabgleich; Firmen- und Personenanreicherung konzeptionell trennen.
4. **P2 EspoCRM/Linkado:** zuerst CSV-Feldmapping von Account/Contact/Lead; später optional API-/CRM-Skript mit Preview, Dublettencheck und bestätigtem Writeback; API-Zugang derzeit **nicht** vorhanden.
5. **P2 theHarvester/SOCMINT:** prüfen, welche autorisierten OSINT-Daten tatsächlich relevant sind. Für Social-Media-Profile von Personen ist theHarvester nicht als dediziertes SOCMINT-Werkzeug nachgewiesen. Getrennter Dienst und rechtliche/AGB-Prüfung.
6. **P2 E-Mail-Validierung:** Syntax/DNS/MX zuerst; SMTP-Reaktionen oder kommerzielle Prüfservices erst nach Nutzwert-, Kosten- und Datenschutzprüfung.
7. **P2 Alternative Scraper/Modelle:** Crawl4AI oder selbst gehostetes Firecrawl, lokale Modelle, echte Qualitäts-/Kosten-Benchmarks erst nach MVP.
8. **P2 Kostendashboard:** API-Aufrufe, Tokens, Credits, Kosten pro Job/Datensatz/erfolgreichem Feld, Budgetgrenzen und Warnungen.
9. **P2 Batch-Limits:** gemessene Last und Credit-Verbrauch vor Erhöhung von Datensatz-/Feldlimits.
10. **P3 Kundenprodukt:** Mandantenfähigkeit, Rechtekonzept, Löschung, Audit, Compliance, SLA/Betrieb; keine voreilige SaaS-Architektur.

## Risiken / Entscheidungsregeln

- **MVP-Fokus:** Pro Phase nur technisch notwendige Änderungen. TheHarvester, Penpot-Relaunch, CRM-API und Infrastruktur-Alternativen dürfen Baseline nicht blockieren.
- **Provider-Kompatibilität:** OpenRouter ist OpenAI-kompatibel, aber das bedeutet nicht, dass jedes Modell dieselben strukturierten Responses liefert.
- **Kostenschutz:** Auch der lokal aktivierte Unlimited-Modus entfernt keine Firecrawl-/LLM-Abrechnung. Kleine Testmengen und explizite Kostenfreigabe.
- **Datenqualität:** Harte Abgrenzung Unternehmen vs. Person; Quelle und Aktualität explizit; keine unbelegten Kontaktbehauptungen.
- **Recht:** OSINT-Daten sind nicht automatisch frei für personenbezogene Marketing-Profile und Werbung.
- **Git:** Upstream-Aktualisierungen kontrolliert übernehmen, nicht unbesehen gegen eigene Arbeit überschreiben.

## Referenzen

- [Projektstand und Entscheidungen](PROJECT_STATUS.md)
- [Lokales Setup und sicherer Git-Abgleich](LOCAL_SETUP.md)
- [Upstream](https://github.com/firecrawl/fire-enrich)
