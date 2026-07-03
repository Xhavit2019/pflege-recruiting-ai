import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/layout/PageHeader";

export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <PageHeader
          title="Registrieren"
          subtitle="Erstellen Sie ein Konto als Bewerber oder Unternehmen."
        />

        <form method="POST" action="/api/register" className="space-y-4">
          <Input name="name" placeholder="Name" required />

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

          <Select name="role" defaultValue="candidate">
            <option value="candidate">Bewerber</option>
            <option value="company">Unternehmen</option>
          </Select>

          <Button type="submit">
            Konto erstellen
          </Button>
        </form>
      </Card>
    </div>
  );
}