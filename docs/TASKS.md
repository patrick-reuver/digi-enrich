# Digi Enrich – Nächste Aufgaben (manuell geführtes Backlog)

Stand: 2026-11-15. Die GitHub-Issue-Funktion ist bei diesem Repository derzeit deaktiviert (GitHub API 410). Dieses Dokument hält deshalb die zunächst vorgesehenen, überprüfbaren Aufgaben fest. Sobald Issues aktiviert werden, können die Aufgaben einzeln übertragen und hier verlinkt werden.

## Statusübersicht

| ID | Aufgabe | Status | Abhängigkeit |
| --- | --- | --- | --- |
| P0-01 | Lokalen Klon identifizieren, Remotes einrichten, Build starten | **Abgeschlossen (Nutzerbestätigung, 15.11.2026)** | keine |
| P0-02 | OpenRouter-Minimaladapter und strukturierten Output testen | **Abgeschlossen – Funktionslauf vom Nutzer bestätigt (15.11.2026)** | P0-01 |
| P0-03 | 1–3-Zeilen-CSV-Smoke-Test und Qualitätsprotokoll | Offen | P0-02 |

### P0-01 – Lokalbestand und Setup — abgeschlossen (vom Nutzer bestätigt)

- [x] Nach nicht gefundenem lokalem Klon den aktuellen Digi-Enrich-Fork in das gewünschte Verzeichnis geklont.
- [x] Aktuellen GitHub-Code lokal geladen.
- [x] Lokalen Entwicklungsstart und Erreichbarkeit der Oberfläche vom Nutzer bestätigt.
- [x] CSV-Datei hochgeladen; anschließend erscheint erwartungsgemäß die Abfrage des Firecrawl-API-Schlüssels.
- [ ] Ergänzende Kontrolle: tatsächliche `git remote -v`-Ausgabe und separater Produktions-Build (`npm run build`) wurden nicht vorgelegt. **Nicht als nachgewiesen darstellen; kein Blocker für P0-02.**

**Abnahmeentscheidung:** P0-01 für den vereinbarten lokalen MVP-Smoke-Test erfolgreich abgeschlossen (Nutzerbestätigung am 15.11.2026). **Noch nicht getestet:** echter Firecrawl-/LLM-Aufruf, Enrichment-Resultate, CSV-Export oder Produktions-Build. Diese Grenzen gehören zu P0-02/P0-03 bzw. zur ergänzenden Technikprüfung.

### P0-02 – Vorhandene APIs minimal verdrahten — abgeschlossen (funktionaler Test)

**Abnahme 15.11.2026:** Nach dem lokalen Start des Feature-Branches funktionierte der CSV-Upload. Der erste reale Enrichment-Versuch lieferte HTTP 401: Ein anderer, bereits global in der Shell gesetzter `OPENAI_API_KEY` hatte den OpenRouter-Schlüssel aus `.env.local` übersteuert. Nach `unset OPENAI_API_KEY` bestätigte der Nutzer, dass der Enrichment-Lauf vollständig durchgelaufen ist und Daten gefunden wurden. **Damit gilt P0-02 als funktional abgeschlossen.**

- [x] OpenAI-Client-/Modellpfade geprüft; minimale Konfiguration für OpenRouter-`baseURL` und Primär-/Fast-Modell integriert.
- [x] Serverseitige Testkonfiguration über `.env.local` genutzt; keine Secrets im Repository erfasst.
- [x] Funktionslauf über Firecrawl + OpenRouter nach Behebung des 401-Fehlers durch Nutzer bestätigt.
- [x] Ursache und Workaround in [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) protokolliert.
- [ ] **Nicht separat bestätigt:** Produktions-Build (`npm run build`), formale Zod-/Schema-Prüfung aller Ergebnisfelder, API-Kosten, Quellenqualität und CSV-Export. Diese Checks gehören zur technischen Nachprüfung bzw. **P0-03**.
- [ ] Veraltete README-Verweise auf GPT-4o vs. Upstream-GPT-5-Defaults bei späterer Dokumentationspflege bereinigen; funktionaler Blocker ist dies nicht.

**Scope-Grenze:** Ein erfolgreicher Nutzerlauf belegt die grundsätzliche Provider-Integration, nicht die Fehlerfreiheit beliebiger Modelle, Datenbestände oder den produktiven Kundeneinsatz. Die Implementierung ist aktuell im [Draft-PR #1](https://github.com/patrick-reuver/digi-enrich/pull/1) auf dem Feature-Branch; noch nicht mit `main` gemerged.

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
