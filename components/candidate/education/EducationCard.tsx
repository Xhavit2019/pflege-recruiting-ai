import Card from "@/components/ui/Card";
import DeleteEducationButton from "./DeleteEducationButton";
import EditEducationButton from "./EditEducationButton";
import EducationForm from "./EducationForm";

type Education = {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string | null;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currentlyStudying: boolean;
  description?: string | null;
};

type EducationCardProps = {
  educations: Education[];
  editId?: string;
};

export default function EducationCard({
  educations,
  editId,
}: EducationCardProps) {
  const editingEducation = educations.find(
    (education) => education.id === editId
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Ausbildung</h2>

      {educations.length > 0 && (
        <div className="mt-4 space-y-3">
          {educations.map((education) => (
            <div key={education.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {education.degree}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {education.institution}
                  </p>

                  {education.fieldOfStudy && (
                    <p className="text-sm text-slate-500">
                      {education.fieldOfStudy}
                    </p>
                  )}

                  {(education.city || education.country) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {[education.city, education.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <EditEducationButton educationId={education.id} />
                  <DeleteEducationButton educationId={education.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EducationForm
        educationId={editingEducation?.id}
        degree={editingEducation?.degree}
        institution={editingEducation?.institution}
        fieldOfStudy={editingEducation?.fieldOfStudy}
        city={editingEducation?.city}
        country={editingEducation?.country}
        startDate={editingEducation?.startDate}
        endDate={editingEducation?.endDate}
        currentlyStudying={editingEducation?.currentlyStudying}
      />
    </Card>
  );
}