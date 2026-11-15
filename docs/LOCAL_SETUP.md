# Digi Enrich – Lokaler Klon, Git-Remotes und erster Start

Stand: 2026-11-15. **Anleitung, nicht bereits ausgeführter Lokallauf.** Die folgenden Befehle auf dem eigenen Mac im Terminal ausführen. Nie Schlüssel in Git oder Chatlogs kopieren.

## 1. Vorhandenen Klon suchen

Zunächst in den bekannten Entwicklungsverzeichnissen suchen (z. B. `~/ _workspace` ohne Leerzeichen, falls vorhanden). Eine mögliche Suche:

```bash
find "$HOME" -maxdepth 6 -type d -name "digi-enrich" 2>/dev/null
```

Falls der Ordner gefunden wurde:

```bash
cd "/PFAD/ZUM/BESTEHENDEN/digi-enrich"
git status --short
git branch --show-current
git remote -v
git log -5 --oneline
```

Wichtig: Vorhandene lokale Änderungen bewerten und sichern, bevor ein Update erfolgt.

Falls kein Klon vorhanden ist:

```bash
git clone https://github.com/patrick-reuver/digi-enrich.git
cd digi-enrich
```

## 2. Remotes normalisieren

Ziel:
- `origin` → `https://github.com/patrick-reuver/digi-enrich.git`
- `upstream` → `https://github.com/firecrawl/fire-enrich.git`

Im geöffneten Git-Repository (Befehle entsprechend vorhandener Remotes auswählen):

```bash
git remote -v
git remote set-url origin https://github.com/patrick-reuver/digi-enrich.git
git remote add upstream https://github.com/firecrawl/fire-enrich.git
```

Wenn `upstream` bereits existiert, **anstelle** von `git remote add`:

```bash
git remote set-url upstream https://github.com/firecrawl/fire-enrich.git
```

Erst nach Prüfung des Git-Status (und Sicherung eigener lokaler Commits/Dateien):

```bash
git fetch origin
git fetch upstream
git switch main
git pull --ff-only origin main
git status --short
git remote -v
```

Der GitHub-Fork-`main` wurde am 15.11.2026 bereits bis Upstream SHA `4ce8ba2` aktualisiert. Nicht erneut vom Upstream ungeprüft mergen. Falls `--ff-only` abbricht, **nicht** mit `reset --hard` oder Force-Push reagieren; zuerst die Divergenz prüfen.

## 3. Anwendung installieren

Benötigt Node.js (Upstream-README nennt mindestens 18.18; für die aktualisierte Next.js-Version aktuelle Engine-Anforderungen prüfen). Mit konsistenter Node-LTS-Version und vorhandener npm-Lockdatei starten:

```bash
node --version
npm --version
npm ci
npm run build
npm run dev
```

Anwendung: `http://localhost:3000` bzw. vom Dev-Server genannter Port. Ein Build/Start wurde **noch nicht** durch Digi-Pal verifiziert.

## 4. Externe APIs / Secrets

Eine `.env.local` im Projektverzeichnis nur auf dem Mac anlegen; nicht committen. Keine echten Secrets in `.env.example`.

```dotenv
FIRECRAWL_API_KEY=<lokaler_secret_wert>
# OPENAI_API_KEY erst nach Entscheidung über OpenRouter-Adapter konfigurieren
```

**Achtung:** Aktuell erstellt der Code OpenAI-Clients ohne OpenRouter-`baseURL`. Das Eintragen eines OpenRouter-Schlüssels in `OPENAI_API_KEY` allein ist **nicht** ausreichend. Vor einem echten Enrichment-Test einen minimalen OpenRouter-kompatiblen Providerpfad implementieren und strukturierte Antwortformate prüfen. Die Modellnamen im aktuellen Code sind teilweise `gpt-5` und `gpt-5-mini`, nicht nur das im README genannte GPT-4o. Der spätere Adapter könnte optional eine eigene `OPENAI_BASE_URL` und einen zentralen Modellnamen nutzen; diese Variablen **existieren aktuell noch nicht als garantierte Implementierung**.

## 5. Erster manueller Test – nur nach API-Freigabe

- 1–3 selbst kontrollierte bzw. berechtigt verwendbare E-Mail-Adressen/Firmendomains als CSV.
- 3–5 Felder: Firmenname, Branche, Website, Standort, Mitarbeiterzahl.
- Reale API-Antworten, Quellen, Fehler, Laufzeit, tatsächliche Credits/Token und CSV-Export dokumentieren; keine echten Kunden-Kontaktlisten hochladen.
- Keine API-Schnittstelle zu EspoCRM aktivieren; kein theHarvester in der Baseline.

## 6. Fertig, wenn ...

- Lokaler Klon identifiziert, Remotes geprüft, Branch aktualisiert ohne Datenverlust.
- Build und UI funktionieren.
- Providerkonfiguration mit getesteten strukturierten JSON-Antworten nachvollziehbar.
- Kleiner CSV-Lauf mit Quellen-/Fehlerprotokoll durchführbar.
- Keine Secrets eingecheckt.

Siehe [Projektstatus](PROJECT_STATUS.md) und [Roadmap](ROADMAP.md).
