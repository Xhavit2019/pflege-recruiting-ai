import { redirect } from "next/navigation";
import { getCurrentCandidate } from "./current-candidate";

export async function requireCandidate() {
  const candidate = await getCurrentCandidate();

  if (!candidate) {
    redirect("/login");
  }

  return candidate;
}