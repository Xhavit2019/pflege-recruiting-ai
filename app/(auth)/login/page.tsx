import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/layout/PageHeader";

export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <PageHeader
          title="Login"
          subtitle="Melden Sie sich bei Pflege Recruiting AI an."
        />

        <form method="POST" action="/api/login" className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="E-Mail"
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Passwort"
            required
          />

          <Button type="submit">
            Einloggen
          </Button>
        </form>
      </Card>
    </div>
  );
}