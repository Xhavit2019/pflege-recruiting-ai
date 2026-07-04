import Card from "@/components/ui/Card";
import EditLanguageButton from "./EditLanguageButton";
import DeleteLanguageButton from "./DeleteLanguageButton";
import LanguageForm from "./LanguageForm";

type Language = {
  id: string;
  language: string;
  level: string;
};

type LanguageCardProps = {
  languages: Language[];
  editId?: string;
};

export default function LanguageCard({
  languages,
  editId,
}: LanguageCardProps) {
  const editingLanguage = languages.find(
    (language) => language.id === editId
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Sprachen</h2>

      {languages.length > 0 && (
        <div className="mt-4 space-y-3">
          {languages.map((language) => (
            <div
              key={language.id}
              className="rounded-xl border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {language.language}
                  </h3>

                  <p className="text-sm text-slate-600">
                    Niveau: {language.level}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <EditLanguageButton
                    languageId={language.id}
                  />

                  <DeleteLanguageButton
                    languageId={language.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LanguageForm
        languageId={editingLanguage?.id}
        language={editingLanguage?.language}
        level={editingLanguage?.level ?? ""}
      />
    </Card>
  );
}