import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const role = params.role ?? "all";
  const sort = params.sort ?? "newest";

  const users = await prisma.user.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),

      ...(role !== "all"
        ? {
            role: role as "candidate" | "company" | "admin",
          }
        : {}),
    },
    orderBy:
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "name"
          ? { name: "asc" }
          : sort === "email"
            ? { email: "asc" }
            : sort === "role"
              ? { role: "asc" }
              : { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/admin/dashboard" />

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Benutzerverwaltung
        </h1>
        <p className="mt-2 text-slate-600">
          Benutzer suchen, nach Rolle filtern und Berechtigungen verwalten.
        </p>
      </div>

      <form className="card grid gap-4 md:grid-cols-4">
        <input
          className="input"
          name="q"
          placeholder="Suche nach Name oder E-Mail"
          defaultValue={q}
        />

        <select className="input" name="role" defaultValue={role}>
          <option value="all">Alle Rollen</option>
          <option value="admin">Administratoren</option>
          <option value="company">Unternehmen</option>
          <option value="candidate">Bewerber</option>
        </select>

        <select className="input" name="sort" defaultValue={sort}>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="name">Name A–Z</option>
          <option value="email">E-Mail A–Z</option>
          <option value="role">Rolle A–Z</option>
        </select>

        <button className="btn" type="submit">
          Filter anwenden
        </button>
      </form>

      {users.length === 0 && (
        <div className="card">Keine Benutzer gefunden.</div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p>
                  <strong>Name:</strong> {user.name || "-"}
                </p>

                <p>
                  <strong>E-Mail:</strong> {user.email}
                </p>

                <p>
                  <strong>Aktuelle Rolle:</strong> {user.role}
                </p>

                <p>
                  <strong>Registriert:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>

              <div className="space-y-3">
                <form
                  method="POST"
                  action="/api/admin/update-role"
                  className="flex gap-2"
                >
                  <input type="hidden" name="userId" value={user.id} />

                  <select
                    name="role"
                    className="input"
                    defaultValue={user.role}
                  >
                    <option value="candidate">Bewerber</option>
                    <option value="company">Unternehmen</option>
                    <option value="admin">Administrator</option>
                  </select>

                  <button className="btn" type="submit">
                    Rolle ändern
                  </button>
                </form>

                <form method="POST" action="/api/admin/delete-user">
                  <input type="hidden" name="userId" value={user.id} />

                  <button className="btn" type="submit">
                    Benutzer löschen
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}