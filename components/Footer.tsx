import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <h2 className="font-bold text-slate-900">
            Pflege Recruiting AI
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            KI-gestütztes Recruiting für Pflege und Gesundheit.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            powered by NextTech
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Plattform</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/jobs">Jobs</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Registrieren</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Bereiche</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/candidate/dashboard">Bewerber</Link>
            <Link href="/company/dashboard">Unternehmen</Link>
            <Link href="/admin/dashboard">Admin</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">NextTech</h3>
          <p className="mt-3 text-sm text-slate-600">
            Digitale Lösungen, KI-Automatisierung und moderne Softwareplattformen.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Pflege Recruiting AI. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}