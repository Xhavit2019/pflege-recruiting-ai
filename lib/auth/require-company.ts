import { redirect } from "next/navigation";
import { getCurrentCompany } from "./current-company";

export async function requireCompany() {
  const company = await getCurrentCompany();

  if (!company) {
    redirect("/login");
  }

  return company;
}