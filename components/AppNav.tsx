import Link from "next/link";
import BackButton from "./BackButton";

export default function AppNav({
  dashboardHref,
}: {
  dashboardHref: string;
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <BackButton />

      <Link className="btn" href={dashboardHref}>
        Dashboard
      </Link>

      <form method="POST" action="/api/logout">
        <button className="btn" type="submit">
          Logout
        </button>
      </form>
    </div>
  );
}