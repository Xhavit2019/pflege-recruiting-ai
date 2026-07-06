import { redirect } from "next/navigation";
import { getCurrentUser } from "./current-user";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return user;
}