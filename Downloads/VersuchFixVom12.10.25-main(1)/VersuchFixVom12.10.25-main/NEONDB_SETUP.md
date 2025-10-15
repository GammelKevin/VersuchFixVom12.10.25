# NeonDB Setup für Besucherstatistiken

## Übersicht
Diese Anleitung beschreibt die Einrichtung der Besucherstatistiken-Tabellen in Ihrer NeonDB PostgreSQL-Datenbank.

## Behobene Probleme
✅ Admin-Seiten werden nicht mehr in Statistiken gezählt
✅ IP-Adressen werden korrekt erfasst und angezeigt
✅ Besucherzählung funktioniert mit NeonDB

## 1. NeonDB Projekt einrichten

1. Gehen Sie zu [neon.tech](https://neon.tech)
2. Erstellen Sie ein neues Projekt oder nutzen Sie ein bestehendes
3. Notieren Sie sich die Connection Details

## 2. Tabellen erstellen

### Option A: Über Neon Console
1. Öffnen Sie die SQL Editor Console in Ihrem Neon Dashboard
2. Kopieren Sie den gesamten Inhalt von `create_visitor_stats_neondb.sql`
3. Fügen Sie ihn ein und führen Sie das Script aus

### Option B: Über psql CLI
```bash
psql -h <your-neon-host> -U <username> -d <database> -f create_visitor_stats_neondb.sql
```

### Option C: Über pgAdmin oder andere PostgreSQL Tools
Verbinden Sie sich mit Ihrer NeonDB und führen Sie das SQL-Script aus.

## 3. Umgebungsvariablen konfigurieren

### Für Next.js (React) App
Erstellen Sie eine `.env.local` Datei im `restaurant-alas-react` Verzeichnis:

```env
# NeonDB Connection
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Für Flask App (falls verwendet)
In der `instance/production.cfg`:
```python
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///restaurant.db')
```

## 4. Code-Anpassungen

### Bereits durchgeführte Änderungen:

#### a) Admin-Seiten Tracking deaktiviert
`src/hooks/use-visitor-tracking.ts`:
- Admin-Seiten (`/admin/*`) und Login (`/login`) werden nicht mehr getrackt

#### b) Verbesserte IP-Erfassung
`src/app/api/visitors/route.ts`:
- Unterstützt verschiedene Proxy-Header
- Cloudflare-kompatibel
- Fallback auf localhost statt "unknown"

#### c) Admin-Seiten aus Statistiken gefiltert
- Recent Visitors zeigt keine Admin-Besuche
- Top Pages zeigt keine Admin-Seiten
- Statistiken sind bereinigt

## 5. Tabellen-Struktur

### visitor_stats
- Speichert jeden einzelnen Besuch
- Automatische Geräte-Erkennung
- IP-Adressen (IPv4/IPv6 kompatibel)
- Session-Tracking

### daily_stats
- Aggregierte tägliche Statistiken
- Automatische Updates via Trigger
- Unique Visitors & Total Visits

### Views
- `hourly_stats`: Stündliche Besucherstatistik
- `top_pages`: Top 10 besuchte Seiten (ohne Admin)
- `recent_visitors`: Letzte 50 Besucher (ohne Admin)

## 6. Wartung

### Alte Daten löschen (optional)
```sql
-- Lösche Einträge älter als 90 Tage
DELETE FROM visitor_stats
WHERE visit_time < CURRENT_DATE - INTERVAL '90 days';
```

### Statistiken zurücksetzen
```sql
TRUNCATE TABLE visitor_stats CASCADE;
TRUNCATE TABLE daily_stats CASCADE;
```

## 7. Monitoring

### Gesamtstatistik abrufen
```sql
SELECT
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(*) as total_visits
FROM visitor_stats
WHERE DATE(visit_time) = CURRENT_DATE;
```

### Top-Seiten ohne Admin
```sql
SELECT * FROM top_pages;
```

## Troubleshooting

### IP-Adressen zeigen 127.0.0.1
- Prüfen Sie die Proxy-Konfiguration
- Stellen Sie sicher, dass Ihr Hosting-Provider die richtigen Header weiterleitet

### Admin-Seiten werden trotzdem gezählt
- Cache leeren: `npm run build` und Server neu starten
- Prüfen Sie, ob die aktuelle Version deployed ist

### NeonDB Connection Error
- Prüfen Sie die DATABASE_URL
- SSL-Mode muss auf `require` gesetzt sein
- Firewall-Regeln prüfen

## Support
Bei Problemen prüfen Sie:
1. Neon Dashboard für Connection Details
2. Browser Console für Frontend-Fehler
3. Server Logs für Backend-Fehler