import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type JobSearchProps = {
  q?: string;
  city?: string;
  employmentType?: string;
};

export default function JobSearch({
  q = "",
  city = "",
  employmentType = "",
}: JobSearchProps) {
  return (
    <form
      method="GET"
      action="/jobs"
      className="mb-8 rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Input
          name="q"
          placeholder="🔍 Beruf oder Stichwort"
          defaultValue={q}
        />

        <Input
          name="city"
          placeholder="📍 Ort"
          defaultValue={city}
        />

        <Input
          name="employmentType"
          placeholder="💼 Beschäftigungsart"
          defaultValue={employmentType}
        />

        <Button type="submit">
          Suchen
        </Button>
      </div>
    </form>
  );
}