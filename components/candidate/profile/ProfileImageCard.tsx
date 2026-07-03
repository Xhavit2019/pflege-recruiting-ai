import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ProfileImageCardProps = {
  profileImageUrl?: string | null;
};

export default function ProfileImageCard({
  profileImageUrl,
}: ProfileImageCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profilbild"
              className="h-full w-full object-cover"
            />
          ) : (
            "?"
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Profilbild
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Laden Sie ein professionelles Profilbild hoch.
          </p>
        </div>
      </div>

      <form
        method="POST"
        action="/api/candidate/profile-image"
        encType="multipart/form-data"
        className="mt-6 flex flex-col gap-4 md:flex-row"
      >
        <input
          className="input"
          type="file"
          name="profileImage"
          accept="image/*"
          required
        />

        <Button type="submit">Profilbild hochladen</Button>
      </form>
    </Card>
  );
}