# Pflege Recruiting AI MVP

Next.js + Prisma + PostgreSQL Grundgerüst für eine KI-Recruiting-Plattform im Pflegebereich.

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Enthalten
- Next.js App Router
- Prisma Datenbankmodell
- NextAuth Vorbereitung
- Rollen: Bewerber, Unternehmen, Admin
- Jobs, Bewerbungen, Kandidatenprofile
- KI-Routen für CV-Zusammenfassung und Matching
