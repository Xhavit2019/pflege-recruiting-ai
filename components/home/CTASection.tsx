import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-16 text-center text-white shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
        Bereit für den nächsten Schritt?
      </p>

      <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
        Die Zukunft des Pflege-Recruitings
        <br />
        beginnt heute.
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
        Pflege Recruiting AI verbindet Unternehmen und Bewerber mit
        moderner KI-Technologie.
        Schnell. Intelligent. Sicher.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button href="/register">
          Kostenlos registrieren
        </Button>

        <Button href="/jobs">
          Stellen entdecken
        </Button>
      </div>

      <div className="mt-12 grid gap-6 border-t border-slate-700 pt-10 md:grid-cols-3">
        <div>
          <h3 className="text-3xl font-bold">24/7</h3>
          <p className="mt-2 text-sm text-slate-400">
            Plattform jederzeit verfügbar
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">KI</h3>
          <p className="mt-2 text-sm text-slate-400">
            Intelligentes Matching zwischen Bewerbern und Unternehmen
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">NextTech</h3>
          <p className="mt-2 text-sm text-slate-400">
            Entwickelt für die Zukunft des Recruitings
          </p>
        </div>
      </div>
    </section>
  );
}