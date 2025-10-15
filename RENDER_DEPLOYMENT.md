# Render Deployment Anleitung für Restaurant ALAS

## 🚀 Quick Start

Diese Anleitung erklärt, wie du die Restaurant ALAS Website auf Render deployen kannst.

---

## ✅ Änderungen für Render

Folgende Dateien wurden angepasst:

1. **package.json**
   - `--turbopack` aus dem Build-Script entfernt (nicht produktionsreif)
   - `start` Script nutzt jetzt den PORT von Render: `next start -p ${PORT:-3000}`

2. **next.config.ts**
   - `output: 'standalone'` hinzugefügt für optimierte Builds
   - Image-Konfiguration für Remote-Bilder

3. **render.yaml**
   - Automatische Konfiguration für Render
   - Region: Frankfurt
   - Free Plan

---

## 📋 Schritt-für-Schritt Anleitung

### 1. Code zu GitHub pushen

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 2. Render Account erstellen

- Gehe zu [render.com](https://render.com)
- Melde dich mit GitHub an

### 3. Neuen Web Service erstellen

1. Klicke auf **"New +"** → **"Web Service"**
2. Wähle dein GitHub Repository aus
3. Render erkennt automatisch die `render.yaml` Konfiguration

### 4. Environment Variables setzen

**WICHTIG!** Setze folgende Environment Variables im Render Dashboard:

#### Pflicht-Variablen:

```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```
👉 Dies ist deine NeonDB Connection String (siehe NEONDB_SETUP.md)

```
NEXT_PUBLIC_BASE_URL=https://deine-app-name.onrender.com
```
👉 Ersetze `deine-app-name` mit deinem tatsächlichen Render Service Namen

#### Optional:
```
NODE_ENV=production
```

---

## 🔧 Manuelle Konfiguration (falls render.yaml nicht erkannt wird)

Falls Render die `render.yaml` nicht automatisch erkennt:

### Build Settings:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Node Version:** 20.x (oder höher)

### Environment:
- **Region:** Frankfurt (oder Europe West)
- **Instance Type:** Free

---

## ⚠️ Häufige Probleme & Lösungen

### Problem: "No open HTTP ports detected"

**Lösung:**
- Stelle sicher, dass der `start` Befehl in package.json korrekt ist
- Die App muss auf `0.0.0.0` und dem Port `$PORT` lauschen
- Next.js macht das automatisch mit `next start -p $PORT`

### Problem: "Bad Gateway"

**Ursachen:**
1. Build ist fehlgeschlagen → Prüfe Build Logs
2. Environment Variables fehlen → Prüfe `DATABASE_URL` und `NEXT_PUBLIC_BASE_URL`
3. App startet nicht → Prüfe Start Command

**Lösung:**
```bash
# Prüfe die Render Logs:
# Dashboard → dein Service → Logs
```

### Problem: Database Connection Error

**Lösung:**
- Stelle sicher, dass `DATABASE_URL` korrekt gesetzt ist
- NeonDB Connection String muss `?sslmode=require` am Ende haben
- Format: `postgresql://user:pass@host/db?sslmode=require`

### Problem: Build dauert zu lange / Timeout

**Lösung:**
- Entferne nicht benötigte Dependencies
- Build Command optimieren
- Auf kostenpflichtigen Plan upgraden (mehr Build-Zeit)

---

## 📊 Nach dem Deployment

### 1. Health Check

Öffne deine Render URL: `https://deine-app.onrender.com`

Die Seite sollte laden. Prüfe:
- ✅ Startseite lädt
- ✅ Navigation funktioniert
- ✅ Speisekarte lädt (Datenbankverbindung)
- ✅ Admin-Login funktioniert

### 2. Environment Variable aktualisieren

**WICHTIG:** Aktualisiere `NEXT_PUBLIC_BASE_URL` mit deiner echten Render URL:

```
NEXT_PUBLIC_BASE_URL=https://restaurant-alas.onrender.com
```

Dann **Redeploy** auslösen.

### 3. Custom Domain (Optional)

Im Render Dashboard kannst du eine Custom Domain hinzufügen:
1. Settings → Custom Domains
2. Domain hinzufügen (z.B. `restaurant-alas.de`)
3. DNS-Einträge bei deinem Domain-Provider setzen

---

## 🔐 Datenbank Setup

Falls du die Datenbank noch nicht eingerichtet hast:

1. Folge der Anleitung in `NEONDB_SETUP.md`
2. Erstelle die Tabellen in NeonDB
3. Setze `DATABASE_URL` in Render
4. Redeploy

---

## 🔄 Updates deployen

Nach Code-Änderungen:

```bash
git add .
git commit -m "Deine Änderung"
git push origin main
```

Render deployt automatisch nach jedem Push auf `main`.

---

## 📝 Render Free Tier Limits

- **750 Stunden/Monat** (ausreichend für 1 Service)
- **Inaktivität:** Service wird nach 15 Min ohne Traffic pausiert
- **Cold Start:** Erste Anfrage nach Pause dauert ~30 Sekunden
- **Automatische SSL-Zertifikate** (HTTPS)

### Upgrade auf kostenpflichtigen Plan für:
- Kein Cold Start
- Mehr Build-Zeit
- Priority Support
- Mehr Ressourcen

---

## 🆘 Support & Troubleshooting

### Render Logs prüfen:
```
Dashboard → dein Service → Logs (oben rechts)
```

### Build Logs anschauen:
```
Dashboard → dein Service → Events → Build Logs
```

### Service neu starten:
```
Dashboard → dein Service → Manual Deploy → "Clear build cache & deploy"
```

---

## ✨ Fertig!

Nach erfolgreichem Deployment ist deine Restaurant-Website live unter:
`https://deine-app-name.onrender.com`

Bei Fragen oder Problemen, prüfe die Render Logs oder erstelle ein Issue im Repository.

---

**Viel Erfolg mit deinem Deployment!** 🎉
