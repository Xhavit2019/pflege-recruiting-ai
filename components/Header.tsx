import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Pflege Recruiting AI
          </span>
          <span className="text-xs text-slate-500">
            powered by NextTech
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/jobs" className="hover:text-slate-950">
            Jobs
          </Link>
          <Link href="/company/dashboard" className="hover:text-slate-950">
            Unternehmen
          </Link>
          <Link href="/candidate/dashboard" className="hover:text-slate-950">
            Bewerber
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-950">
            Login
          </Link>

          <Button href="/register">
            Registrieren
          </Button>
        </div>
      </div>
    </header>
  );
}