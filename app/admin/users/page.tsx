import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <AppNav dashboardHref="/admin/dashboard" />
      <h1 className="text-3xl font-bold">
        Benutzerverwaltung
      </h1>

      {users.length === 0 && (
        <div className="card">
          Keine Benutzer vorhanden.
        </div>
      )}

      {users.map((user) => (
        <div key={user.id} className="card">
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
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <form
            method="POST"
            action="/api/admin/update-role"
            className="mt-3 flex gap-2"
          >
            <input
              type="hidden"
              name="userId"
              value={user.id}
            />

            <select
              name="role"
              className="input"
              defaultValue={user.role}
            >
              <option value="candidate">
                Bewerber
              </option>

              <option value="company">
                Unternehmen
              </option>

              <option value="admin">
                Administrator
              </option>
            </select>

            <button
              className="btn"
              type="submit"
            >
              Rolle ändern
            </button>
          </form>

          <form
            method="POST"
            action="/api/admin/delete-user"
            className="mt-3"
          >
            <input
              type="hidden"
              name="userId"
              value={user.id}
            />

            <button
              className="btn"
              type="submit"
            >
              Benutzer löschen
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}