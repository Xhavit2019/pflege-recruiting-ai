## Entscheidung – 06.07.2026

Die Plattform verwendet zukünftig konsequent eine rollenbasierte Rechteverwaltung (RBAC).

Rollen:

- Administrator
- Unternehmen
- Bewerber

Regeln:

- Administrator sieht alle Daten.
- Unternehmen sieht ausschließlich eigene Daten.
- Bewerber sieht ausschließlich eigene Daten.
- APIs prüfen Berechtigungen serverseitig.
- UI und API müssen dieselben Berechtigungen verwenden.
# Architecture Decisions

## ADR-001

Repository Pattern

Status: Aktiv

Alle Datenbankzugriffe erfolgen ausschließlich über Repositories.

---

## ADR-002

Service Layer

Status: Aktiv

Geschäftslogik befindet sich ausschließlich in Services.

---

## ADR-003

Master Data

Status: Aktiv

Statische Daten werden zentral unter master-data verwaltet.

---

## ADR-004

Page Architecture

Status: Aktiv

Pages orchestrieren ausschließlich.

Komponenten enthalten Darstellung.

Services enthalten Geschäftslogik.

Repositories enthalten Datenzugriffe.

---

## ADR-005

Candidate Module

Status: Aktiv

Alle Candidate-Komponenten befinden sich unter

components/candidate/

und werden unabhängig voneinander entwickelt.