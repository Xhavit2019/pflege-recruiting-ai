import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/layout/PageHeader";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <PageHeader
          title="Neues Passwort setzen"
          subtitle="Bitte geben Sie Ihr neues Passwort ein."
        />

        <form method="POST" action="/api/auth/reset-password" className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <Input
            name="password"
            type="password"
            placeholder="Neues Passwort"
            required
          />

          <Button type="submit">
            Passwort speichern
          </Button>
        </form>
      </Card>
    </div>
  );
}