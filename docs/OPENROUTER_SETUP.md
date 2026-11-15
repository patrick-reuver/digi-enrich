# Digi Enrich – OpenRouter-Konfiguration (P0-02)

Stand: 2026-11-15 | Status: **Lokaler UI-/CSV-Import vom Nutzer bestätigt; externe API-Anreicherung nicht getestet**

Diese Anleitung gilt erst mit Branch `feat/openrouter-config-mvp` oder nach dessen Merge. Die Änderung ist bewusst minimal: Die bestehenden OpenAI-SDK-Aufrufe bleiben erhalten und erhalten einen optionalen `baseURL` sowie übersteuerbare Modellbezeichner. Ohne gesetzte Overrides bleibt das aktuelle Upstream-Verhalten (GPT-5 / GPT-5-mini) bestehen.

## Vorbereitung

- Lokalen Server mit `Ctrl+C` beenden.
- Den Feature-Branch aus GitHub holen (siehe PR).
- Die Datei `.env.local` nur lokal im **Repo-Root** anlegen. Sie darf weder in Git noch in eine öffentliche Dokumentation gelangen.
- Vor dem ersten kostenverursachenden Test eine explizite Freigabe und ein kleines Budget vereinbaren.

## Beispiel: .env.local

```dotenv
FIRECRAWL_API_KEY=<firecrawl_api_key>
OPENAI_API_KEY=<openrouter_api_key>
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o
OPENAI_MODEL_FAST=openai/gpt-4o-mini
```

Hinweise:
- OpenRouter wird über seine OpenAI-kompatible URL angesprochen; die Modellnamen haben das OpenRouter-Präfix.
- Die Modelle sind **Konfigurationsvorschläge**, kein behauptetes Testergebnis. Beim Provider muss für die benötigten Aufrufe insbesondere `response_format: json_schema` (Structured Outputs) verfügbar sein.
- `OPENAI_API_KEY` bezeichnet hier den Schlüssel des im `OPENAI_BASE_URL` angegebenen Dienstes (OpenRouter).
- Ohne `OPENAI_MODEL_FAST` fällt der schnelle Pfad auf `OPENAI_MODEL` zurück; ohne beide Overrides bleiben die ursprünglichen Modellnamen bestehen.
- Wenn alle Provider-Overrides entfernt werden, werden wieder die normalen OpenAI-Endpunkte verwendet.
- Weder Browser-Key-Dialog noch `localStorage` benötigen im vorgesehenen Ablauf API-Keys: Beide Schlüssel liegen serverseitig in `.env.local` und werden vom vorhandenen `/api/check-env` erkannt.

## Bestätigter Zwischenstand (15.11.2026)

Laut Nutzer und Screenshot: Die Firecrawl-Sample-CSV wird eingelesen (22 Datensätze), die E-Mail-Spalte wird erkannt, und die App zeigt ohne erneute Key-Abfrage die Enrichment-Konfiguration mit drei Feldern (Company Name, Company Description, Industry). **Noch kein Nachweis** für erfolgreiche OpenRouter-/Firecrawl-Aufrufe, strukturierte Ergebnisse, CSV-Export oder separat erfolgreiches `npm run build`.

Vor einem echten, kostenpflichtigen Test die Sample-Datei auf **einen rechtmäßig verwendbaren** eigenen/freigegebenen Datensatz reduzieren; öffentlich enthaltene persönliche geschäftliche E-Mails sind nicht automatisch zur Anreicherung freigegeben. Keine kostenpflichtigen Tests ohne ausdrückliche Freigabe.

## Minimaler Testplan

1. `npm ci` (nur falls noch nicht installiert) und `npm run build` als Compile-/Build-Prüfung.
2. `npm run dev` starten und prüfen, ob die API-Key-Abfrage nach CSV-Upload ausbleibt, wenn die Schlüssel aus der Serverumgebung gelesen werden.
3. **Vor echter API-Ausführung:** freigegebenen Testdatensatz mit 1–3 erlaubten Beispielen und 3–5 Firmenfeldern wählen, API-Kosten/Verbrauch kontrollieren.
4. Bei einem Fehlversuch HTTP-Status, Modellkennung, fehlgeschlagenen Endpunkt und (geschwärzte) Fehlermeldung festhalten. Kein API-Key und keine personenbezogene CSV ins Issue oder Repository kopieren.
5. Ein erfolgreiches Modellresultat muss das erwartete Zod-/JSON-Schema erfüllen; ein HTTP 200 allein genügt nicht.

## Geänderter Code

- `lib/config/llm.ts`: kleine zentrale Client-/Modellkonfiguration.
- `lib/services/openai.ts`: verwendet Client und Primär-/Fast-Modellnamen aus der zentralen Konfiguration.
- `app/api/generate-fields/route.ts`: gleicher Provider wie bei der Enrichment-Pipeline.
- `.env.example`: dokumentiert die optionalen Variablen (ohne Secrets).

## Grenzen

- Kein Provider-Benchmark, kein Fallback-Router, keine lokale Modellimplementierung.
- Keine Änderungen an Firecrawl, CSV-Upload, EspoCRM oder UI/Branding.
- Der lokale UI-Start mit importierter Sample-CSV ist bestätigt. **Nicht nachgewiesen** sind ein erfolgreicher OpenRouter-API-Aufruf, schema-valides Enrichment-Ergebnis oder ein separater Produktions-Build.
- Sicherheit vor Kundeneinsatz: Browser-Key-UI und API-Key-Header müssen separat bewertet werden. Für P0-02 werden sie nicht umgebaut.

Dokumentation: [Roadmap](ROADMAP.md) · [Aufgaben](TASKS.md) · [Projektstand](PROJECT_STATUS.md)
