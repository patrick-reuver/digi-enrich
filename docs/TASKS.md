# Digi Enrich – Nächste Aufgaben (manuell geführtes Backlog)

Stand: 2026-11-15. Die GitHub-Issue-Funktion ist bei diesem Repository derzeit deaktiviert (GitHub API 410). Dieses Dokument hält deshalb die zunächst vorgesehenen, überprüfbaren Aufgaben fest. Sobald Issues aktiviert werden, können die Aufgaben einzeln übertragen und hier verlinkt werden.

## Statusübersicht

| ID | Aufgabe | Status | Abhängigkeit |
| --- | --- | --- | --- |
| P0-01 | Lokalen Klon identifizieren, Remotes einrichten, Build starten | **Abgeschlossen (Nutzerbestätigung, 15.11.2026)** | keine |
| P0-02 | OpenRouter-Minimaladapter und strukturierten Output testen | **401-Ursache behoben; Ergebnisprüfung offen** | P0-01 |
| P0-03 | 1–3-Zeilen-CSV-Smoke-Test und Qualitätsprotokoll | Offen | P0-02 |

### P0-01 – Lokalbestand und Setup — abgeschlossen (vom Nutzer bestätigt)

- [x] Nach nicht gefundenem lokalem Klon den aktuellen Digi-Enrich-Fork in das gewünschte Verzeichnis geklont.
- [x] Aktuellen GitHub-Code lokal geladen.
- [x] Lokalen Entwicklungsstart und Erreichbarkeit der Oberfläche vom Nutzer bestätigt.
- [x] CSV-Datei hochgeladen; anschließend erscheint erwartungsgemäß die Abfrage des Firecrawl-API-Schlüssels.
- [ ] Ergänzende Kontrolle: tatsächliche `git remote -v`-Ausgabe und separater Produktions-Build (`npm run build`) wurden nicht vorgelegt. **Nicht als nachgewiesen darstellen; kein Blocker für P0-02.**

**Abnahmeentscheidung:** P0-01 für den vereinbarten lokalen MVP-Smoke-Test erfolgreich abgeschlossen (Nutzerbestätigung am 15.11.2026). **Noch nicht getestet:** echter Firecrawl-/LLM-Aufruf, Enrichment-Resultate, CSV-Export oder Produktions-Build. Diese Grenzen gehören zu P0-02/P0-03 bzw. zur ergänzenden Technikprüfung.

### P0-02 – Vorhandene APIs minimal verdrahten

**Stand (15.11.2026):** Beim ersten Lauf HTTP 401; Nutzer bestätigte einen andersartigen `OPENAI_API_KEY` in der Shell. Nach `unset OPENAI_API_KEY` funktionierte Schritt 2, zusätzliche Diagnose entfiel. **Bestätigte Ursache:** Prozessumgebung übersteuerte `.env.local`. Noch keine explizite Bestätigung eines vollständigen, schema-validen Enrichment-Ergebnisses und CSV-Exports. [Fehleranalyse](OPENROUTER_SETUP.md#fehlversuch-15112026--http-401-bei-openrouter-ursache-bestatigt-konfiguration-korrigiert).\n\n**Vorheriger Zwischenstand (15.11.2026, Nutzerbestätigung):** Feature-Branch lokal gestartet; Firecrawl-Sample-CSV ließ sich hochladen, die E-Mail-Spalte wurde erkannt, und die Anwendung zeigte ohne erneute API-Key-Abfrage die Konfiguration mit 22 Datensätzen und drei ausgewählten Feldern (Company Name, Company Description, Industry). Dies bestätigt den UI-/Import-Pfad, **nicht** die externe Firecrawl-/OpenRouter-Anreicherung oder die tatsächliche Modellkompatibilität. Ein Produktions-Build ist nicht gesondert belegt. Anleitung: [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md).

- [ ] Verwendete OpenAI-Client-Instanzen und aktuell hartcodierte Modellnamen erfassen.
- [ ] Nur notwendige Anpassungen für OpenRouter-`baseURL`, Modellnamen und serverseitige Secret-Konfiguration vornehmen.
- [ ] Mit Firecrawl + OpenRouter JSON-Schema/Zod-Ausgabe für den gewählten Standardpfad validieren.
- [ ] Dokumentationsabweichung README (GPT-4o) vs. Code (`gpt-5`/`gpt-5-mini`) korrigieren.
- [ ] Fehler, API-Verbrauch und Modell dokumentieren. Kostenpflichtigen Test erst nach ausdrücklicher Freigabe.

**Abnahme:** mindestens ein nachweislich schema-valides Ergebnis; andernfalls reproduzierbarer Blocker.

### P0-03 – CSV-Testlauf

- [ ] Mit rechtmäßig verwendbaren 1–3 Beispielen CSV erstellen (keine personenbezogene Datei in Git).
- [ ] 3–5 Firmenfelder anreichern und Ergebnis/Quellen/Konfidenz prüfen.
- [ ] Laufzeit, Fehler und tatsächlichen API-Verbrauch protokollieren.
- [ ] CSV-Ergebnisexport prüfen.
- [ ] Go/No-Go für Branding und Penpot festhalten.

**Abnahme:** nachvollziehbares Testprotokoll mit konkretem Datenbefund oder Fehlernachweis.

## Bewusst zurückgestellte Aufgaben

- Penpot-/Digi-Pal-Branding.
- Kontakt-Discovery und SOCMINT/theHarvester-Eignungsprüfung.
- EspoCRM/Linkado: CSV-Feldmapping, später optional serverseitige API-/Skriptintegration (kein API-Zugang vorhanden).
- Zustellbarkeitsprüfung von E-Mail-Adressen, alternative Scraper (Crawl4AI, eigene Firecrawl-Instanz), Modellbenchmarks.
- Kostendashboard und größere Batch-/Feld-Limits.
- Kundentauglicher Betrieb (Rechte, Datenschutz, Sicherheit, Nachvollziehbarkeit).

Vollständige Priorisierung und Kriterien in [ROADMAP.md](ROADMAP.md), technische Erkenntnisse in [PROJECT_STATUS.md](PROJECT_STATUS.md).
