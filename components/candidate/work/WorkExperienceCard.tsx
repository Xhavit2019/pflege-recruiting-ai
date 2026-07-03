import Card from "@/components/ui/Card";
import EditWorkExperienceButton from "./EditWorkExperienceButton";
import DeleteWorkExperienceButton from "./DeleteWorkExperienceButton";
import WorkExperienceForm from "./WorkExperienceForm";

type WorkExperience = {
  id: string;
  company: string;
  position: string;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currentlyWorking: boolean;
  description?: string | null;
};

type WorkExperienceCardProps = {
  workExperiences: WorkExperience[];
  editId?: string;
};

export default function WorkExperienceCard({
  workExperiences,
  editId,
}: WorkExperienceCardProps) {
  const editingWorkExperience = workExperiences.find(
    (workExperience) => workExperience.id === editId
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Berufserfahrung</h2>

      {workExperiences.length > 0 && (
        <div className="mt-4 space-y-3">
          {workExperiences.map((workExperience) => (
            <div key={workExperience.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {workExperience.position}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {workExperience.company}
                  </p>

                  {(workExperience.city || workExperience.country) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {[workExperience.city, workExperience.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <EditWorkExperienceButton
                    workExperienceId={workExperience.id}
                  />
                  <DeleteWorkExperienceButton
                    workExperienceId={workExperience.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WorkExperienceForm
        workExperienceId={editingWorkExperience?.id}
        company={editingWorkExperience?.company}
        position={editingWorkExperience?.position}
        city={editingWorkExperience?.city}
        country={editingWorkExperience?.country}
        startDate={editingWorkExperience?.startDate}
        endDate={editingWorkExperience?.endDate}
        currentlyWorking={editingWorkExperience?.currentlyWorking}
      />
    </Card>
  );
}