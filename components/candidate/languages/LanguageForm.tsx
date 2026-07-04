import Button from "@/components/ui/Button";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import { languageLevels } from "@/master-data/language-levels";

type LanguageFormProps = {
  languageId?: string;
  language?: string | null;
  level?: string | null;
};

export default function LanguageForm({
  languageId,
  language,
  level,
}: LanguageFormProps) {
  const action = languageId
    ? `/api/candidate/language/${languageId}`
    : "/api/candidate/language";

  return (
    <form method="POST" action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Sprache"
          name="language"
          defaultValue={language}
          placeholder="z. B. Deutsch, Englisch, Albanisch"
          required
        />

        <SelectField
          label="Sprachniveau"
          name="level"
          options={[...languageLevels]}
          defaultValue={level}
          required
        />
      </div>

      <Button type="submit">
        {languageId ? "Sprache speichern" : "Sprache hinzufügen"}
      </Button>
    </form>
  );
}