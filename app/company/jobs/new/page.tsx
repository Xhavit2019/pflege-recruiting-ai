import AppNav from "@/components/AppNav";
export default function Page() {
    return (
      <div className="card max-w-2xl mx-auto">
        <AppNav dashboardHref="/company/dashboard" />
        <h1 className="text-2xl font-bold mb-4">Neue Stellenanzeige</h1>
  
        <form method="POST" action="/api/jobs" className="space-y-4">
          <input className="input" name="title" placeholder="Jobtitel" required />
          <input className="input" name="city" placeholder="Stadt" required />
  
          <select className="input" name="employmentType" defaultValue="Vollzeit">
            <option>Vollzeit</option>
            <option>Teilzeit</option>
            <option>Minijob</option>
            <option>Nachtdienst</option>
          </select>
  
          <textarea className="input" name="description" placeholder="Beschreibung" rows={6} required />
  
          <input className="input" name="salaryFrom" placeholder="Gehalt von" />
          <input className="input" name="salaryTo" placeholder="Gehalt bis" />
          <input className="input" name="requiredSkills" placeholder="Skills, z.B. Pflege, Wundversorgung" />
  
          <button className="btn w-full" type="submit">Stelle veröffentlichen</button>
        </form>
      </div>
    );
  }