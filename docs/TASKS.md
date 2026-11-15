# Digi Enrich – Nächste Aufgaben (manuell geführtes Backlog)

Stand: 2026-11-15. Die GitHub-Issue-Funktion ist bei diesem Repository derzeit deaktiviert (GitHub API 410). Dieses Dokument hält deshalb die zunächst vorgesehenen, überprüfbaren Aufgaben fest. Sobald Issues aktiviert werden, können die Aufgaben einzeln übertragen und hier verlinkt werden.

## Statusübersicht

| ID | Aufgabe | Status | Abhängigkeit |
| --- | --- | --- | --- |
| P0-01 | Lokalen Klon identifizieren, Remotes einrichten, Build starten | **Abgeschlossen (Nutzerbestätigung, 15.11.2026)** | keine |
| P0-02 | OpenRouter-Minimaladapter und strukturierten Output testen | Offen | P0-01 |
| P0-03 | 1–3-Zeilen-CSV-Smoke-Test und Qualitätsprotokoll | Offen | P0-02 |

### P0-01 – Lokalbestand und Setup — abgeschlossen (vom Nutzer bestätigt)

- [x] Nach nicht gefundenem lokalem Klon den aktuellen Digi-Enrich-Fork in das gewünschte Verzeichnis geklont.
- [x] Aktuellen GitHub-Code lokal geladen.
- [x] Lokalen Entwicklungsstart und Erreichbarkeit der Oberfläche vom Nutzer bestätigt.
- [x] CSV-Datei hochgeladen; anschließend erscheint erwartungsgemäß die Abfrage des Firecrawl-API-Schlüssels.
- [ ] Ergänzende Kontrolle: tatsächliche `git remote -v`-Ausgabe und separater Produktions-Build (`npm run build`) wurden nicht vorgelegt. **Nicht als nachgewiesen darstellen; kein Blocker für P0-02.**

**Abnahmeentscheidung:** P0-01 für den vereinbarten lokalen MVP-Smoke-Test erfolgreich abgeschlossen (Nutzerbestätigung am 15.11.2026). **Noch nicht getestet:** echter Firecrawl-/LLM-Aufruf, Enrichment-Resultate, CSV-Export oder Produktions-Build. Diese Grenzen gehören zu P0-02/P0-03 bzw. zur ergänzenden Technikprüfung.

### P0-02 – Vorhandene APIs minimal verdrahten

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
