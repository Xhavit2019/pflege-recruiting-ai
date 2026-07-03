import Card from "@/components/ui/Card";

type AiSummaryCardProps = {
  summary?: string | null;
  skills?: string[];
};

export default function AiSummaryCard({
  summary,
  skills = [],
}: AiSummaryCardProps) {
  if (!summary) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">
        KI-Auswertung
      </h2>

      <p className="mt-2 text-slate-600">
        {summary}
      </p>

      {skills.length > 0 && (
        <div className="mt-4">
          <strong>Erkannte Skills:</strong>

          <ul className="mt-2 list-disc pl-5">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}