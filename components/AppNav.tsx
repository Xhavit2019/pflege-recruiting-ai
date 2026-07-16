import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import BackButton from "./BackButton";

export default function AppNav({
  dashboardHref,
}: {
  dashboardHref: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <BackButton />

      <Link className="btn" href={dashboardHref}>
        Dashboard
      </Link>

      <LogoutButton />
    </div>
  );
}