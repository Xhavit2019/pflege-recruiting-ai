# Changelog

## 2026-07-06

### Added
- Role-Based Access Control (RBAC) für Unternehmen und Administratoren
- Such-, Filter- und Sortierfunktionen für Admin Jobs
- Such-, Filter- und Sortierfunktionen für Admin Users
- Such-, Filter- und Sortierfunktionen für Admin Applications
- Such-, Filter- und Sortierfunktionen für Company Applications

### Improved
- Company Dashboard zeigt nur eigene Daten
- Company Jobs zeigen nur eigene Stellenanzeigen
- Company Applications zeigen nur Bewerbungen auf eigene Stellen
- Bewerbungsdetailseite gegen Fremdzugriff abgesichert
- Modernisiertes UI mit Mint-/Petrol-Farbschema
- Verbesserte Buttons, Cards und Formulare

### Security
- Admin APIs abgesichert
- Company APIs abgesichert
- Rollenprüfung für Statusänderungen
- Rollenprüfung für KI-Matching
## Version 0.2.1

### Hinzugefügt

- Profilbild-Upload
- profileImageUrl im Datenmodell
- ProfileImageCard
- CandidateProfileForm
- CvUploadCard
- AiSummaryCard

### Refaktoriert

- Candidate Profile vollständig in Komponenten aufgeteilt
- page.tsx erheblich vereinfacht
- Vorbereitung auf modulare Architektur

### Architektur

- Einführung des Candidate-Komponentenmoduls
- Wiederverwendbare UI-Struktur
# Changelog

## Version 0.2.0

### Neu

- Neues Prisma Schema V2
- Repository Architektur
- Service Architektur
- Master Data eingeführt
- Wiederverwendbare Form-Komponenten
- Candidate Dashboard überarbeitet
- Profile Completion Service
- Dashboard zeigt Profilfortschritt

### Verbessert

- Typisierung erweitert
- Candidate API modernisiert
- Code-Struktur vereinheitlicht

### Hinzugefügt

- Profilbild-Upload für Bewerber
- Speicherung von profileImageUrl im CandidateProfile
- Upload-Verzeichnis: public/uploads/profile
- Dashboard zeigt Profilfortschritt
- Candidate Profile an neues Schema V2 angepasst