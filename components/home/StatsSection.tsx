import Card from "@/components/ui/Card";

export default function StatsSection() {
  return (
    <section>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Plattform</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">24/7</h3>
          <p className="mt-2 text-sm text-slate-600">
            Bewerbungen und Stellen jederzeit verfügbar.
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">KI-Matching</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">AI</h3>
          <p className="mt-2 text-sm text-slate-600">
            Unterstützung bei Analyse und Vorauswahl.
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Zielgruppe</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">Pflege</h3>
          <p className="mt-2 text-sm text-slate-600">
            Speziell für Pflege und Gesundheit entwickelt.
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Technologie</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">NextTech</h3>
          <p className="mt-2 text-sm text-slate-600">
            Moderne Softwareplattform mit KI-Fokus.
          </p>
        </Card>
      </div>
    </section>
  );
}