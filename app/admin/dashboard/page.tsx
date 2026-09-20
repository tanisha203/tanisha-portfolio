import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <span className="admin-login-badge">PRIVATE ADMIN</span>

          <h1>Portfolio Dashboard</h1>

          <p>
            Manage your portfolio content from one place.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card">
  <h2>About</h2>
  <p>Update your portfolio introduction.</p>

  <Link href="/admin/about">
    <button type="button">Edit About</button>
  </Link>
</section>
<section className="admin-card">
  <h2>Profile Photo</h2>
  <p>Upload or replace your profile photo.</p>

  <Link href="/admin/profile-photo">
    <button type="button">Update Photo</button>
  </Link>
</section>

        <section className="admin-card">
  <h2>Skills</h2>
  <p>Add, edit, or remove your skills.</p>

  <Link href="/admin/skills">
    <button type="button">Manage Skills</button>
  </Link>
</section>

        <section className="admin-card">
  <h2>Projects</h2>
  <p>Add, edit, or delete projects.</p>

  <Link href="/admin/projects">
    <button type="button">Manage Projects</button>
  </Link>
</section>

        <section className="admin-card">
  <h2>Experience</h2>
  <p>Add, edit, or delete experience.</p>

  <Link href="/admin/experience">
    <button type="button">Manage Experience</button>
  </Link>
</section>
<section className="admin-card">
  <h2>Certifications</h2>
  <p>Add, edit, or remove your certifications.</p>

  <Link href="/admin/certifications">
    <button type="button">Manage Certifications</button>
  </Link>
</section>

        <section className="admin-card">
  <h2>Resume</h2>
  <p>Upload and replace your resume PDF.</p>

  <Link href="/admin/resume">
    <button type="button">Update Resume</button>
  </Link>
</section>
      </div>

      <p className="admin-dashboard-user">
        Signed in as {user.email}
      </p>
    </main>
  );
}