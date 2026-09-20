"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  details: string | null;
  technologies: string[] | null;
  github_url: string | null;
  live_url: string | null;
};

export default function AdminProjects() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error) {
      setProjects(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function clearForm() {
    setTitle("");
    setDescription("");
    setDetails("");
    setTechnologies("");
    setGithubUrl("");
    setLiveUrl("");
    setEditingId(null);
  }

  async function saveProject() {
    if (!title.trim()) return;

    setSaving(true);
    setMessage("");

    const technologyList = technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      details: details.trim(),
      technologies: technologyList,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase
        .from("projects")
        .insert(projectData));
    }

    if (error) {
      setMessage("Could not save project.");
    } else {
      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      clearForm();
      await loadProjects();
    }

    setSaving(false);
  }

  function startEditing(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || "");
    setDetails(project.details || "");
    setTechnologies((project.technologies || []).join(", "));
    setGithubUrl(project.github_url || "");
    setLiveUrl(project.live_url || "");
    setMessage("");
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Could not delete project.");
    } else {
      setMessage("Project deleted.");
      await loadProjects();
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <span className="admin-login-badge">PROJECTS</span>

        <h1>Manage Projects</h1>

        <p>
          Add, update, or remove projects from your portfolio.
        </p>
      </div>

      <div className="admin-editor-card">
        <h2>{editingId ? "Update Project" : "Add Project"}</h2>

        <label htmlFor="title">Project Title</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Project name"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          placeholder="Describe your project..."
        />
        <label htmlFor="details">Additional Details</label>
<textarea
  id="details"
  value={details}
  onChange={(event) => setDetails(event.target.value)}
  rows={4}
  placeholder="Add more details about the project..."
/>

        <label htmlFor="technologies">
          Technologies
        </label>
        <input
          id="technologies"
          value={technologies}
          onChange={(event) => setTechnologies(event.target.value)}
          placeholder="Python, SQL, Next.js, Supabase"
        />

        <label htmlFor="github">GitHub URL</label>
        <input
          id="github"
          value={githubUrl}
          onChange={(event) => setGithubUrl(event.target.value)}
          placeholder="https://github.com/..."
        />

        <label htmlFor="live">Live Project URL</label>
        <input
          id="live"
          value={liveUrl}
          onChange={(event) => setLiveUrl(event.target.value)}
          placeholder="https://..."
        />

        <div>
          <button
            type="button"
            onClick={saveProject}
            disabled={saving || !title.trim()}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Project"
                : "Add Project"}
          </button>

          {editingId && (
            <button type="button" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>

        {message && <p>{message}</p>}
      </div>

      <div className="admin-editor-card">
        <h2>Your Projects</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects added yet.</p>
        ) : (
          <div>
            {projects.map((project) => (
              <div key={project.id}>
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                {project.technologies &&
                  project.technologies.length > 0 && (
                    <p>
                      {project.technologies.join(" • ")}
                    </p>
                  )}

                <button
                  type="button"
                  onClick={() => startEditing(project)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}