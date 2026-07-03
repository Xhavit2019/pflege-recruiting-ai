import Button from "@/components/ui/Button";
import TextField from "@/components/form/TextField";

type EducationFormProps = {
  educationId?: string;
  degree?: string | null;
  institution?: string | null;
  fieldOfStudy?: string | null;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currentlyStudying?: boolean;
};

export default function EducationForm({
  educationId,
  degree,
  institution,
  fieldOfStudy,
  city,
  country,
  startDate,
  endDate,
  currentlyStudying,
}: EducationFormProps) {
  const action = educationId
    ? `/api/candidate/education/${educationId}`
    : "/api/candidate/education";

  return (
    <form method="POST" action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Abschluss" name="degree" defaultValue={degree} required />
        <TextField label="Institution" name="institution" defaultValue={institution} required />
        <TextField label="Fachrichtung" name="fieldOfStudy" defaultValue={fieldOfStudy} />
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
          name="currentlyStudying"
          defaultChecked={currentlyStudying}
        />
        Aktuell in Ausbildung
      </label>

      <Button type="submit">
        {educationId ? "Ausbildung speichern" : "Ausbildung hinzufügen"}
      </Button>
    </form>
  );
}