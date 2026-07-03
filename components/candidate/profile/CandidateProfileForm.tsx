import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import { languageLevels } from "@/master-data/language-levels";
import { industries } from "@/master-data/industries";
import { employmentTypes } from "@/master-data/employment-types";
import { driverLicenseCategories } from "@/master-data/driver-license-categories";
import type { CandidateProfileData } from "@/types/candidate";

type CandidateProfileFormProps = {
  profile: CandidateProfileData | null;
};

export default function CandidateProfileForm({
  profile,
}: CandidateProfileFormProps) {
  return (
    <Card>
      <form method="POST" action="/api/candidate/profile" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Telefon" name="phone" defaultValue={profile?.phone} />

          <TextField label="Stadt" name="city" defaultValue={profile?.city} />

          <TextField
            label="Beruf"
            name="profession"
            defaultValue={profile?.profession}
            placeholder="z. B. Pflegefachkraft"
          />

          <TextField
            label="Berufserfahrung in Jahren"
            name="yearsOfExperience"
            type="number"
            defaultValue={profile?.yearsOfExperience}
          />

          <SelectField
            label="Deutschkenntnisse"
            name="germanLevel"
            options={[...languageLevels]}
            defaultValue={profile?.germanLevel}
          />

          <SelectField
            label="Gewünschte Branche"
            name="preferredIndustry"
            options={[...industries]}
            defaultValue={profile?.preferredIndustry}
          />

          <SelectField
            label="Gewünschte Arbeitsform"
            name="expectedEmploymentType"
            options={[...employmentTypes]}
            defaultValue={profile?.expectedEmploymentType}
          />

          <SelectField
            label="Führerschein"
            name="driverLicenseCategory"
            options={[...driverLicenseCategories]}
            defaultValue={profile?.driverLicenseCategory}
          />

          <TextField
            label="Gehaltsvorstellung"
            name="desiredSalary"
            type="number"
            defaultValue={profile?.desiredSalary}
          />

          <TextField
            label="Skills"
            name="skills"
            defaultValue={profile?.skills?.join(", ")}
            placeholder="z. B. Wundversorgung, Altenpflege"
          />
        </div>

        <Button type="submit">Profil speichern</Button>
      </form>
    </Card>
  );
}