import { cookies } from "next/headers";
import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { CandidateService } from "@/services/candidate.service";
import { ProfileCompletionService } from "@/services/profile-completion.service";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const profile = userId
    ? await CandidateService.getProfile(userId)
    : null;

  const completion = ProfileCompletionService.calculate(profile);

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/candidate/dashboard" />

      <PageHeader
        title="Bewerber Dashboard"
        subtitle="Ihr persönliches Candidate Center für Profil, Bewerbungen und passende Stellen."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Profilstatus"
          value={`${completion.percentage}%`}
          description={`${completion.completed} von ${completion.total} Feldern ausgefüllt`}
        />
        <StatCard
          title="Bewerbungen"
          value={profile?.applications.length ?? 0}
          description="Aktive Bewerbungen"
        />
        <StatCard
          title="Passende Jobs"
          value="0"
          description="KI-Empfehlungen später"
        />
        <StatCard
          title="Deutschlevel"
          value={profile?.germanLevel ?? "-"}
          description="Aktuelles Sprachniveau"
        />
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-900">
          Profilfortschritt
        </h2>

        <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-slate-900"
            style={{ width: `${completion.percentage}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Vervollständigen Sie Ihr Profil, um bessere Jobvorschläge und präzisere KI-Matches zu erhalten.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h2 className="text-xl font-bold text-slate-900">Mein Profil</h2>
          <p className="mt-2 text-slate-600">
            Pflegen Sie Beruf, Erfahrung, Deutschkenntnisse, Mobilität und Verfügbarkeit.
          </p>
          <div className="mt-4">
            <Button href="/candidate/profile">Profil bearbeiten</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-900">Meine Bewerbungen</h2>
          <p className="mt-2 text-slate-600">
            Verfolgen Sie den Status Ihrer Bewerbungen und nächsten Schritte.
          </p>
          <div className="mt-4">
            <Button href="/candidate/applications">Bewerbungen ansehen</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-900">Stellenangebote</h2>
          <p className="mt-2 text-slate-600">
            Finden Sie passende Jobs in verschiedenen Branchen.
          </p>
          <div className="mt-4">
            <Button href="/jobs">Jobs ansehen</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}