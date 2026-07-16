import LoginForm from "@/components/auth/LoginForm";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";

type PageProps = {
  searchParams: Promise<{
    passwordReset?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const passwordResetSuccessful = params.passwordReset === "1";
  const error = params.error;

  const errorMessage =
    error === "wrongPassword" || error === "userNotFound"
      ? "E-Mail-Adresse oder Passwort ist nicht korrekt."
      : error === "invalidReset"
        ? "Die Anfrage zum Zurücksetzen des Passworts ist ungültig."
        : error === "invalidToken"
          ? "Der Passwort-Link ist ungültig oder wurde bereits verwendet."
          : error === "tokenExpired"
            ? "Der Passwort-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an."
            : error === "passwordTooShort"
              ? "Das neue Passwort muss mindestens 8 Zeichen lang sein."
              : error === "failed"
                ? "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
                : null;

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <PageHeader
          title="Login"
          subtitle="Melden Sie sich bei NextTech RecruitAI an."
        />

        {passwordResetSuccessful && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt
            mit dem neuen Passwort anmelden.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <LoginForm />
      </Card>
    </div>
  );
}