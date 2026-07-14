import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";

import { driverLicenseCategories } from "@/master-data/driver-license-categories";
import { employmentTypes } from "@/master-data/employment-types";
import { industries } from "@/master-data/industries";
import { languageLevels } from "@/master-data/language-levels";

import type { CandidateProfileData } from "@/types/candidate";

type CandidateProfileFormProps = {
  profile: CandidateProfileData | null;
};

function formatDateForInput(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function CandidateProfileForm({
  profile,
}: CandidateProfileFormProps) {
  return (
    <Card>
      <form
        method="POST"
        action="/api/candidate/profile"
        className="space-y-8"
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Persönliche Daten
            </h2>

            <p className="text-sm text-slate-600">
              Ergänzen Sie Ihre persönlichen Kontaktdaten.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Vorname"
              name="firstName"
              defaultValue={profile?.firstName}
            />

            <TextField
              label="Nachname"
              name="lastName"
              defaultValue={profile?.lastName}
            />

            <TextField
              label="Geburtsdatum"
              name="birthDate"
              type="date"
              defaultValue={formatDateForInput(profile?.birthDate)}
            />

            <TextField
              label="Nationalität"
              name="nationality"
              defaultValue={profile?.nationality}
            />

            <TextField
              label="Adresse"
              name="address"
              defaultValue={profile?.address}
            />

            <TextField
              label="Postleitzahl"
              name="postalCode"
              defaultValue={profile?.postalCode}
            />

            <TextField
              label="Stadt"
              name="city"
              defaultValue={profile?.city}
            />

            <TextField
              label="Telefon"
              name="phone"
              type="tel"
              defaultValue={profile?.phone}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Berufliches Profil
            </h2>

            <p className="text-sm text-slate-600">
              Diese Angaben helfen Unternehmen, Ihr Profil besser
              einzuordnen.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
              label="Kenntnisse und Fähigkeiten"
              name="skills"
              defaultValue={profile?.skills?.join(", ")}
              placeholder="z. B. Wundversorgung, Altenpflege"
            />
          </div>
        </section>

        <Button type="submit">Profil speichern</Button>
      </form>
    </Card>
  );
}