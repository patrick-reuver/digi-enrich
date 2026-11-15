# Digi Enrich – Projektstand und Architekturentscheidungen

Stand: 2026-11-15 | Status: **MVP-Vorbereitung** | Verantwortungsbereich: Digi-Pal

> Diese Datei dokumentiert den tatsächlichen GitHub-Stand und vereinbarte Entscheidungen. **Der Nutzer hat am 15.11.2026 den lokalen Start, den CSV-Upload sowie nach Behebung eines Shell-Key-Konflikts einen erfolgreichen Firecrawl-/OpenRouter-Anreicherungslauf mit gefundenen Daten bestätigt.** Dies ist noch kein Nachweis eines Produktions-Builds, geprüfter Quellen-/Ergebnisqualität, CSV-Exports oder verifizierter lokaler Git-Remotes.

## Zielbild

Digi Enrich soll langfristig zwei Arbeitsweisen unterstützen:

1. **Enrichment:** bekannte Unternehmen und berufliche Kontakte anhand vorhandener Informationen anreichern.
2. **Discovery:** künftig neue relevante Firmen und Ansprechpartner identifizieren.

Die erste Version dient Digi-Pal intern; eine spätere kundenfähige Lösung wird architektonisch berücksichtigt, aber **nicht** im MVP umgesetzt. Es wird auf dem vorhandenen Repository aufgebaut; keine neue Plattform und kein Rewrite.

## Repository und Synchronisierung

| Merkmal | Stand |
| --- | --- |
| Eigenes Repository | [patrick-reuver/digi-enrich](https://github.com/patrick-reuver/digi-enrich) |
| Herkunft / Upstream | [firecrawl/fire-enrich](https://github.com/firecrawl/fire-enrich) |
| Lizenz | MIT (ursprüngliche Copyright-/Lizenzhinweise erhalten) |
| Primärsprache / UI | TypeScript, Next.js / React |
| GitHub-Synchronisierung | **2026-11-15 erfolgreich**: `main` per Fast-Forward von `e395306e8bca501bf9a7bb33b80dc81ad5724370` auf Upstream `4ce8ba2fcf8a65578208e2caa729b47bca0ab5ac` |
| Vorheriger Rückstand | 6 Commits, 0 eigene vorausliegende Commits |
| Lokales Arbeitsverzeichnis | Nach erfolgloser Suche wurde der aktuelle Fork lokal geklont; Anwendung startfähig (Nutzerbestätigung 15.11.2026) |
| Lokaler Remote `upstream` | **Ungeprüft / einzurichten** |
| Laufender Test | **Funktionaler Enrichment-Lauf erfolgreich (Nutzerbestätigung):** Firecrawl + OpenRouter nach `unset OPENAI_API_KEY`; Daten gefunden. Details zu Quellen, Export, Kosten und Produktions-Build offen (P0-03) |

WICHTIG: Die Aktualisierung des *GitHub-Forks* erfolgte vor dem lokalen Klon. Der lokale Checkout wurde vom Nutzer als erfolgreich bestätigt. Die tatsächliche Remote-Konfiguration sollte bei Gelegenheit mit `git remote -v` geprüft werden.

## Verbindliche MVP-Entscheidungen

- **CSV als einziger Daten-Eingang und primärer Export.** Kein EspoCRM-API-Zugriff, kein allgemeiner API-Produktumfang, keine Cron-Automatisierung.
- **Lokal ausführen**, zunächst mit bestehenden externen APIs. Firecrawl-API-Schlüssel ist nach Nutzerangabe vorhanden.
- **OpenRouter als bevorzugter Zugang zu OpenAI-Modellen**; OpenRouter-Key nicht als Drop-in in den bisherigen OpenAI-Client eintragen, bevor ein kleiner Adapter implementiert und getestet wurde.
- **Modellqualität zunächst nicht optimieren.** Ein funktionsfähiger, reproduzierbarer Standard-Test geht vor Modellvergleich. Kein lokales LLM im MVP.
- **Ein Test mit einem kleinen, rechtmäßig nutzbaren Datensatz**, wenige Datenfelder, dokumentierte Ergebnisse und geschätzter/abgerechneter API-Verbrauch.
- **Branding erst nach funktionierender Baseline**. UI/UX-Konzept später mit Penpot; keine technischen Änderungen aus dem Design erzwingen.
- **theHarvester, eigene Firecrawl-Instanz, Crawl4AI, E-Mail-Zustellbarkeitsprüfung, Kostendashboard, höhere CSV-Limits und EspoCRM-Integration**: ausdrücklich nachgelagert.
- Perspektivische Nutzung durch Kunden erfordert vor Bereitstellung u. a. Datenschutz-, Sicherheits-, Lizenz- und Mandantentrennungsprüfung.

## Technischer Ist-Stand nach Codeprüfung

### Vorhanden

- CSV-Upload, Spaltenauswahl, Felder-Mapping, Streaming-Ausgabe und Export in der Weboberfläche (siehe `app/fire-enrich/` und README).
- API-Routen u. a. `app/api/enrich/route.ts`, `app/api/scrape/route.ts`, `app/api/generate-fields/route.ts`, `app/api/chat/route.ts`.
- Agentenstruktur in `lib/agent-architecture/` zur Unternehmensrecherche und Datenextraktion.
- Firecrawl-SDK in `lib/services/firecrawl.ts`; OpenAI-SDK in `lib/services/openai.ts`.
- Quellen- und Konfidenzfelder in der Datenaufbereitung.

### Wichtige Abweichungen / technische Schulden

| Befund | Auswirkung / nächster Schritt |
| --- | --- |
| README nennt GPT-4o, der aktualisierte Code verwendet an mehreren Stellen `gpt-5` und `gpt-5-mini` (z. B. `lib/services/openai.ts`, `app/api/generate-fields/route.ts`). | **Nicht** blind GPT-4o als aktuellen Code-Standard annehmen; tatsächlichen Modellpfad im Test protokollieren. |
| Der OpenAI-Client wird mit `new OpenAI({ apiKey })` ohne konfiguriertes `baseURL` angelegt. Weitere OpenAI-Clients separat prüfen. | OpenRouter erfordert mindestens korrektes `baseURL`, Modellbezeichner und Prüfung der strukturierten JSON-/Zod-Ausgaben. Eine kleine Konfiguration/Adapter-Lösung für den Standardpfad bauen. |
| Enrichment-Endpunkt verarbeitet Daten ohne eigene Anwendungsauthentifizierung. | Nur lokal/abgeschottet testen; vor externer Exposition Authentifizierung und Autorisierung. |
| Der Code verarbeitet bis zu 10 Zeilen parallel (`lib/config/enrichment.ts`). | Kleine Testmengen, Kosten und Rate-Limits beobachten; Konfiguration vor Bulk-Läufen prüfen. |
| `app/fire-enrich/config.ts` erlaubt im Unlimited-Modus größere Limits, aber `app/api/enrich/route.ts` akzeptiert maximal 10 Felder und besitzt unabhängig davon eine 5-MB-Headerprüfung. | Inkonsistente Limits zunächst dokumentieren, **nicht** pauschal erhöhen. |
| UI hält API-Keys bei manueller Eingabe im Browser-`localStorage` vor; Backend unterstützt teils API-Key-Header. | Für interne Tests ausschließlich serverseitige `.env.local` bevorzugen; vor Kundeneinsatz Secret-Handling neu bewerten. |
| Server loggt u. a. Kontakt-E-Mail-Adressen während der Verarbeitung. | Vor personenbezogener Nutzung Log-Minimierung/Retention und Datenschutz-Folgen prüfen. |
| Fire Enrich ist **nicht vollständig offline**, selbst bei lokalem Next.js-Betrieb. | Internet/API-Kosten und Auftragsverarbeitungs-/Datenübertragungsfragen vor realen Kundendaten klären. |
| Sicherheits-/Abhängigkeitstests und vollständige Qualitätsprüfung stehen noch aus. | UI-Start, CSV-Import und ein echter Enrichment-Lauf mit gefundenen Daten sind vom Nutzer bestätigt; `npm run build`, Lint-/Security-Checks, Quellen-/Ergebnisvalidierung, Kosten und CSV-Export bleiben offen. |

Hinweis zu den Daten: KI-Konfidenz allein beweist die Richtigkeit nicht. Ergebnisse müssen nachvollziehbaren Quellen zugeordnet und insbesondere Personen-/E-Mail-Daten verifiziert werden.

## Definition der ersten erfolgreichen Baseline

Die Baseline gilt als erreicht, wenn:

1. Ein vorhandener Klon kontrolliert aktualisiert oder ein neuer Klon erstellt wurde; `origin` zeigt auf Digi-Pal, `upstream` auf Firecrawl.
2. Die App lokal startet, ohne Secrets im Repository zu hinterlegen.
3. Ein konfigurierter OpenRouter-Zugang die für die erste CSV-Anreicherung benötigten OpenAI-kompatiblen Aufrufe inkl. erwarteter strukturierter Ausgaben zuverlässig bedient **oder** eine konkrete, dokumentierte Inkompatibilität festgestellt wurde.
4. Ein bewusst kleiner, rechtmäßig verfügbarer Testdatensatz importiert und mit ausgewählten Firmenfeldern angereichert wurde.
5. Quellen, nicht gefundene Werte, Fehler, Laufzeit und API-Verbrauch im Testprotokoll festgehalten wurden.
6. CSV-Export nachvollziehbar ist; keine Änderungen am CRM erfolgen.

Ein scheinbar erfolgreicher HTTP-Status ohne stimmige extrahierte Daten erfüllt die Definition nicht.

## Datenmodell-Leitplanken (noch keine Implementierung)

Künftig strikt unterscheiden:

- **Company:** Name, normalisierte Domain, Website, Branche, Standort, Größe, Techniksignale, Zeitstempel.
- **Person/Contact:** Name, bekannte geschäftliche E-Mail, öffentlich nachweisbare Funktion und Unternehmenszuordnung.
- **Enrichment evidence:** Feld, Wert, Quellen-URL, Abrufzeit, Konfidenz, Verifikationsstatus, Herkunft/Provider.
- **Identity resolution:** Domain und Company-Key als Anker; keine automatischen Zusammenführungen unsicherer Kontakte.
- **Export:** ursprüngliche Felder erhalten; neue Felder und Quellen separat, konfliktbehaftete Werte nicht still überschreiben.

Für das MVP genügt das vorhandene CSV-Modell. Datenbank, dauerhaftes Personenprofiling und EspoCRM-Mapping sind noch kein Bauauftrag.

## Geparkte Zukunftsoptionen

### EspoCRM / Linkado

Linkado setzt EspoCRM ein; derzeit ist **kein API-Zugang** verfügbar. Erst CSV-Import/-Export und mögliche Feldzuordnung für Firmen/Kontakte evaluieren. Eine spätere serverseitige API-, Skript- oder Schaltflächenintegration innerhalb des CRM ist eine Option und setzt Berechtigungen, Dublettenprüfung, Preview/Review, Audit und Zustimmung voraus.

### theHarvester / SOCMINT

theHarvester ist primär ein Python-basiertes Tool für **domain-/organisationsbezogene OSINT-Recherche bei autorisierten Sicherheitsprüfungen**. Die Fähigkeit, öffentlich gelistete E-Mails, Personen oder URLs zu finden, macht es **nicht automatisch zu einem dedizierten Tool für Social-Media-Profile einzelner Personen**. Der User möchte langfristig SOCMINT/öffentliche Social-Media-Profile untersuchen. Die fachliche Eignung, Provider-AGB, Rechtmäßigkeit und Datensparsamkeit separat prüfen; keine unautorisierte Zielrecherche oder automatische Profilzuordnung im MVP. Separate Integration statt Vermischung mit Next.js.

Quelle: https://github.com/laramies/theHarvester (GPL-2.0-only).

### Scraper / Modelle

- **Eigene Firecrawl-Instanz:** später prüfen, inklusive Infrastruktur- und Funktionsparität.
- **Crawl4AI:** potenzieller selbst gehosteter Webcrawler/Scraper; kein verifizierter 1:1-Ersatz für sämtliche Firecrawl-Search-/Scrape-Aufrufe. Quelle: https://docs.crawl4ai.com/
- **OpenRouter-Modelle oder lokale Modelle:** erst nach erfolgreichem MVP vergleichen: Zod/JSON-Schema-Kompatibilität, Quellenqualität, Latenz, Preis und Stabilität.
- **E-Mail-Validierung:** zunächst Syntax + Domain/DNS/MX. SMTP-`VRFY`, RCPT-Tests oder „Ping“ beweisen keine Zustellbarkeit und können geblockt werden; nur bei geklärter Rechtmäßigkeit, schonend und mit eindeutiger Statuskennzeichnung prüfen.
- **Kostendashboard:** für später Ausgaben pro CSV-Job, Datensatz, Feld, Provider/Modell und erfolgtem Treffer erfassen; kein Implementierungsumfang für das erste MVP.
- **Limits / Bulk:** erst nach Messung von API-Verbrauch, Qualität und Rate-Limits erhöhen.
- **Penpot:** erst nach funktionierender Baseline; Digi-Pal-Branding, nachvollziehbare Quelleneinsicht, einfache CSV-Abläufe.

## Datenschutz, Sicherheit und Lizenz

- Keine echten personenbezogenen Daten ohne geeignete Rechtsgrundlage, Zweckbindung und Datenminimierung an externe Dienste senden.
- DSGVO Art. 5, 6, 13/14, 28 je nach Konstellation; Regeln für B2B-Kontaktaufnahme gesondert beachten.
- Vor Kundenbetrieb mindestens AuthN/AuthZ, Secret-Handling, Protokollierung, Aufbewahrung/Löschung, Mandantentrennung, Herkunftsnachweise und Vertragsthemen prüfen.
- MIT-Lizenz von Fire Enrich mit Original-Hinweisen erhalten; externe Bibliotheken und Dienste jeweils gesondert prüfen.
- Keine API-Keys, Kontaktlisten, vollständigen Rohantworten oder personenbezogenen Beispiel-CSV-Dateien in Git commiten.
- Keine kostenverursachenden API-Tests ohne vorherige Nutzerfreigabe.

## Quelle / Nachweise

- Fire Enrich: https://github.com/firecrawl/fire-enrich
- Digi Enrich: https://github.com/patrick-reuver/digi-enrich
- OpenRouter API: https://openrouter.ai/developers
- OpenRouter Structured Output: https://openrouter.ai/docs
- theHarvester: https://github.com/laramies/theHarvester
- Crawl4AI: https://docs.crawl4ai.com/
- EspoCRM REST API: https://docs.espocrm.com/development/api/
- Umsetzung: [Roadmap](ROADMAP.md) und [Lokales Setup](LOCAL_SETUP.md)
