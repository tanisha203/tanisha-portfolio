"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Experience = {
  id: string;
  company: string;
  role: string;
  period: string | null;
  points: string[] | null;
};

export default function AdminExperience() {
  const supabase = createClient();

  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [points, setPoints] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadExperience() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("created_at", { ascending: true });

  console.log("Experience data:", data);
  console.log("Experience error:", error);

  if (error) {
    setMessage(`Could not load experience: ${error.message}`);
  } else {
    setExperiences(data || []);
  }

  setLoading(false);
}

  useEffect(() => {
    loadExperience();
  }, []);

  function clearForm() {
    setCompany("");
    setRole("");
    setPeriod("");
    setPoints("");
    setEditingId(null);
  }

  async function saveExperience() {
    if (!company.trim() || !role.trim()) return;

    setSaving(true);
    setMessage("");

    const pointList = points
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean);

    const experienceData = {
      company: company.trim(),
      role: role.trim(),
      period: period.trim(),
      points: pointList,
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from("experience")
        .update({
          ...experienceData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId));
    } else {
      ({ error } = await supabase
        .from("experience")
        .insert(experienceData));
    }

    if (error) {
      setMessage("Could not save experience.");
    } else {
      setMessage(
        editingId
          ? "Experience updated successfully."
          : "Experience added successfully."
      );

      clearForm();
      await loadExperience();
    }

    setSaving(false);
  }

  function startEditing(item: Experience) {
    setEditingId(item.id);
    setCompany(item.company);
    setRole(item.role);
    setPeriod(item.period || "");
    setPoints((item.points || []).join("\n"));
    setMessage("");
  }

  async function deleteExperience(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Could not delete experience.");
    } else {
      setMessage("Experience deleted.");
      await loadExperience();
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <span className="admin-login-badge">EXPERIENCE</span>

        <h1>Manage Experience</h1>

        <p>
          Add, update, or remove your professional experience.
        </p>
      </div>

      <div className="admin-editor-card">
        <h2>
          {editingId ? "Update Experience" : "Add Experience"}
        </h2>

        <label htmlFor="company">Company / Organization</label>

        <input
          id="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="IIT Jammu"
        />

        <label htmlFor="role">Role</label>

        <input
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Artificial Intelligence Intern"
        />

        <label htmlFor="period">Period</label>

        <input
          id="period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          placeholder="Jun 2025 – Aug 2025"
        />

        <label htmlFor="points">
          Responsibilities / Achievements
        </label>

        <textarea
          id="points"
          value={points}
          onChange={(event) => setPoints(event.target.value)}
          rows={7}
          placeholder={`Built an AI-powered automation tool
Integrated APIs and automation workflows
Tested and deployed AI prototypes`}
        />

        <p>
          Put each responsibility or achievement on a separate line.
        </p>

        <div>
          <button
            type="button"
            onClick={saveExperience}
            disabled={
              saving || !company.trim() || !role.trim()
            }
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Experience"
                : "Add Experience"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </div>

        {message && <p>{message}</p>}
      </div>

      <div className="admin-editor-card">
        <h2>Your Experience</h2>

        {loading ? (
          <p>Loading experience...</p>
        ) : experiences.length === 0 ? (
          <p>No experience added yet.</p>
        ) : (
          <div>
            {experiences.map((item) => (
              <div key={item.id}>
                <h3>{item.role}</h3>

                <p>{item.company}</p>

                {item.period && <p>{item.period}</p>}

                {item.points &&
                  item.points.length > 0 && (
                    <ul>
                      {item.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}

                <button
                  type="button"
                  onClick={() => startEditing(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteExperience(item.id)
                  }
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