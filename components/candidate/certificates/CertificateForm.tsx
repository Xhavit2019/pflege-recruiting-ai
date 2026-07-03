import Button from "@/components/ui/Button";
import TextField from "@/components/form/TextField";

type CertificateFormProps = {
  certificateId?: string;
  title?: string | null;
  issuer?: string | null;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  certificateNumber?: string | null;
  description?: string | null;
};

export default function CertificateForm({
  certificateId,
  title,
  issuer,
  issueDate,
  expiryDate,
  certificateNumber,
  description,
}: CertificateFormProps) {
  const action = certificateId
    ? `/api/candidate/certificate/${certificateId}`
    : "/api/candidate/certificate";

  return (
    <form method="POST" action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Zertifikat"
          name="title"
          defaultValue={title}
          required
        />

        <TextField
          label="Aussteller"
          name="issuer"
          defaultValue={issuer}
          required
        />

        <TextField
          label="Ausstellungsdatum"
          name="issueDate"
          type="date"
          defaultValue={issueDate ? issueDate.toISOString().slice(0, 10) : ""}
        />

        <TextField
          label="Ablaufdatum"
          name="expiryDate"
          type="date"
          defaultValue={expiryDate ? expiryDate.toISOString().slice(0, 10) : ""}
        />

        <TextField
          label="Zertifikatsnummer"
          name="certificateNumber"
          defaultValue={certificateNumber}
        />

        <TextField
          label="Beschreibung"
          name="description"
          defaultValue={description}
        />
      </div>

      <Button type="submit">
        {certificateId
          ? "Zertifikat speichern"
          : "Zertifikat hinzufügen"}
      </Button>
    </form>
  );
}