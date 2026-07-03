import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type CvUploadCardProps = {
  cvUrl?: string | null;
};

export default function CvUploadCard({ cvUrl }: CvUploadCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">
        Lebenslauf
      </h2>

      {cvUrl && (
        <p className="mt-2 text-sm text-slate-600">
          Lebenslauf hochgeladen:{" "}
          <a className="underline" href={cvUrl} target="_blank">
            PDF ansehen
          </a>
        </p>
      )}

      {cvUrl && (
        <form method="POST" action="/api/ai/analyze-cv" className="mt-4">
          <Button type="submit">Lebenslauf mit KI analysieren</Button>
        </form>
      )}

      <form
        method="POST"
        action="/api/candidate/cv"
        encType="multipart/form-data"
        className="mt-6 space-y-4"
      >
        <input
          className="input"
          type="file"
          name="cv"
          accept="application/pdf"
          required
        />

        <Button type="submit">Lebenslauf hochladen</Button>
      </form>
    </Card>
  );
}