import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/layout/PageHeader";

type PageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const success = params.success === "1";
  const error = params.error;

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <PageHeader
          title="Passwort vergessen"
          subtitle="Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen des Passworts."
        />

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde
            ein Link zum Zurücksetzen des Passworts versendet.
          </div>
        )}

        {error === "missingEmail" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Bitte geben Sie Ihre E-Mail-Adresse ein.
          </div>
        )}

        {error === "failed" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Die E-Mail konnte momentan nicht versendet werden. Bitte
            versuchen Sie es später erneut.
          </div>
        )}

        <form
          method="POST"
          action="/api/auth/forgot-password"
          className="space-y-4"
        >
          <Input
            name="email"
            type="email"
            placeholder="E-Mail"
            required
          />

          <Button type="submit">
            Link zum Zurücksetzen senden
          </Button>
        </form>

        <div className="mt-4 text-sm">
          <a
            href="/login"
            className="text-teal-600 hover:text-teal-700 hover:underline"
          >
            Zurück zum Login
          </a>
        </div>
      </Card>
    </div>
  );
}