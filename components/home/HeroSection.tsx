import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HeroSection() {
  return (
    <section className="grid items-center gap-10 py-12 md:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          powered by NextTech
        </p>

        <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
          KI-gestütztes Recruiting
          <br />
          für die Pflege.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Finden Sie schneller qualifizierte Pflegekräfte oder Ihren nächsten
          Traumjob. Unsere KI unterstützt Unternehmen und Bewerber beim
          passenden Matching.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/jobs">Jobs entdecken</Button>
          <Button href="/register">Jetzt registrieren</Button>
        </div>
      </div>

      <Card className="p-10">
        <h2 className="text-2xl font-bold text-slate-900">
          Warum Pflege Recruiting AI?
        </h2>

        <ul className="mt-6 space-y-4 text-slate-700">
          <li>✅ KI-gestütztes Matching</li>
          <li>✅ Schnelle Bewerbungsprozesse</li>
          <li>✅ Für Unternehmen und Bewerber</li>
          <li>✅ DSGVO-orientierte Plattform</li>
          <li>✅ Entwickelt für die Pflegebranche</li>
        </ul>
      </Card>
    </section>
  );
}