# NextTech RecruitAI Architektur

## Architektur

Presentation Layer

↓

Service Layer

↓

Repository Layer

↓

Prisma ORM

↓

PostgreSQL

---

## Projektstruktur

app/

components/

components/form/

repositories/

services/

master-data/

types/

lib/

docs/

prisma/

---

## Grundprinzipien

- Keine direkte Prisma Nutzung in Pages
- Repository Pattern
- Service Layer
- Wiederverwendbare Komponenten
- Master Data als zentrale Quelle
- TypeScript First
- Dokumentation gehört zum Entwicklungsprozess
## Candidate Module

components/candidate/

- ProfileImageCard
- CandidateProfileForm
- CvUploadCard
- AiSummaryCard

Die page.tsx übernimmt ausschließlich die Orchestrierung.

Geschäftslogik befindet sich im Service Layer.

Datenzugriffe erfolgen ausschließlich über Repository und Prisma.