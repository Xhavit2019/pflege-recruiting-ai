import Card from "@/components/ui/Card";

export default function FeaturesSection() {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Vorteile
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          Recruiting einfacher, schneller und intelligenter.
        </h2>

        <p className="mt-3 text-slate-600">
          Pflege Recruiting AI verbindet moderne Bewerbungsprozesse
          mit KI-gestützter Analyse und klaren Workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-xl font-bold text-slate-900">
            Für Bewerber
          </h3>

          <p className="mt-2 text-slate-600">
            Profil anlegen, Lebenslauf hochladen und passende Stellen
            schneller finden.
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-slate-900">
            Für Unternehmen
          </h3>

          <p className="mt-2 text-slate-600">
            Bewerbungen zentral verwalten, Match-Scores nutzen und
            Kandidaten schneller bewerten.
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-slate-900">
            KI-Unterstützung
          </h3>

          <p className="mt-2 text-slate-600">
            Automatische Analyse, Matching und intelligente
            Bewerbervorschläge.
          </p>
        </Card>
      </div>
    </section>
  );
}