import Button from "@/components/ui/Button";
import TextField from "@/components/form/TextField";

type WorkExperienceFormProps = {
  workExperienceId?: string;
  company?: string | null;
  position?: string | null;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currentlyWorking?: boolean;
};

export default function WorkExperienceForm({
  workExperienceId,
  company,
  position,
  city,
  country,
  startDate,
  endDate,
  currentlyWorking,
}: WorkExperienceFormProps) {
  const action = workExperienceId
    ? `/api/candidate/work-experience/${workExperienceId}`
    : "/api/candidate/work-experience";

  return (
    <form method="POST" action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Unternehmen" name="company" defaultValue={company} required />
        <TextField label="Position" name="position" defaultValue={position} required />
        <TextField label="Stadt" name="city" defaultValue={city} />
        <TextField label="Land" name="country" defaultValue={country} />

        <TextField
          label="Startdatum"
          name="startDate"
          type="date"
          defaultValue={startDate ? startDate.toISOString().slice(0, 10) : ""}
        />

        <TextField
          label="Enddatum"
          name="endDate"
          type="date"
          defaultValue={endDate ? endDate.toISOString().slice(0, 10) : ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="currentlyWorking"
          defaultChecked={currentlyWorking}
        />
        Aktuell beschäftigt
      </label>

      <Button type="submit">
        {workExperienceId ? "Berufserfahrung speichern" : "Berufserfahrung hinzufügen"}
      </Button>
    </form>
  );
}