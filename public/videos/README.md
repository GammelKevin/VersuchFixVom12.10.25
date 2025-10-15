# 📹 Video Hero - Anleitung

## So fügen Sie Videos für die Startseite hinzu:

### 1. **Video-Dateien hinzufügen**
Legen Sie Ihre Video-Dateien direkt in diesen Ordner (`/public/videos/`).

**Empfohlene Dateinamen:**
- `restaurant-hero-1.mp4`
- `restaurant-hero-2.mp4`
- `restaurant-hero-3.mp4`
- etc.

### 2. **Video-Anforderungen**

#### **Format:**
- **MP4** (H.264 codec) - Beste Kompatibilität
- Alternative: WebM für moderne Browser

#### **Größe & Qualität:**
- **Auflösung:** 1920x1080 (Full HD) oder 1280x720 (HD)
- **Dateigröße:** Max. 10-15 MB pro Video
- **Länge:** 10-30 Sekunden pro Video
- **Bitrate:** 2-5 Mbps für Web

#### **Optimierung:**
```bash
# Mit ffmpeg optimieren:
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### 3. **Videos in der App konfigurieren**

Die Videos werden automatisch geladen, wenn sie den richtigen Namen haben.
Alternativ können Sie die Videos in `/src/app/page.tsx` anpassen:

```tsx
<VideoHero
  videos={[
    "/videos/restaurant-hero-1.mp4",
    "/videos/restaurant-hero-2.mp4",
    "/videos/restaurant-hero-3.mp4",
  ]}
  autoPlay={true}
  muted={true}
  loop={true}
  randomize={true}  // Videos in zufälliger Reihenfolge abspielen
/>
```

### 4. **Features**

- **Auto-Play:** Videos starten automatisch (stumm für Browser-Kompatibilität)
- **Playlist:** Mehrere Videos werden nacheinander abgespielt
- **Fallback:** Bei Fehler wird ein Standbild angezeigt
- **Controls:** Play/Pause und Mute/Unmute Buttons
- **Responsive:** Passt sich an alle Bildschirmgrößen an

### 5. **Tipps für gute Restaurant-Videos**

#### **Inhalt:**
- Köche bei der Arbeit
- Frische Zutaten
- Fertige Gerichte
- Restaurant-Atmosphäre
- Zufriedene Gäste

#### **Stil:**
- Warme Farben
- Gute Beleuchtung
- Ruhige Kameraführung
- Keine schnellen Schnitte

### 6. **Performance-Tipps**

1. **Komprimieren Sie Videos** ohne sichtbaren Qualitätsverlust
2. **Verwenden Sie kurze Clips** (10-30 Sekunden)
3. **Max. 3-5 Videos** für optimale Ladezeiten
4. **Lazy Loading** für Videos weiter unten auf der Seite

### 7. **Beispiel-Ordnerstruktur**

```
/public/videos/
├── restaurant-hero-1.mp4  (Küche/Kochen)
├── restaurant-hero-2.mp4  (Gerichte)
├── restaurant-hero-3.mp4  (Atmosphäre)
├── restaurant-hero-4.mp4  (Team)
└── restaurant-hero-5.mp4  (Gäste)
```

### 8. **Fallback-Bild**

Falls keine Videos vorhanden sind oder nicht geladen werden können,
wird automatisch ein Fallback-Bild angezeigt.

Platzieren Sie ein Bild unter:
`/public/images/hero-fallback.jpg`

---

## 🎬 Video-Empfehlungen für Restaurant ALAS

1. **Griechische Spezialitäten** beim Zubereiten
2. **Frische Zutaten** (Olivenöl, Feta, Gemüse)
3. **Holzkohlegrill** in Aktion
4. **Gemütliche Atmosphäre** im Restaurant
5. **Team bei der Arbeit**
6. **Zufriedene Gäste** beim Essen

---

**Hinweis:** Videos werden automatisch stumm abgespielt (Browser-Anforderung).
Nutzer können den Ton über den Control-Button aktivieren.