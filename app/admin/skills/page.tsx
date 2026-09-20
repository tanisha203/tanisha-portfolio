"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Skill = {
  id: string;
  name: string;
  category: string | null;
};
const DEFAULT_CATEGORIES = [
  "Programming",
  "Machine Learning",
  "Deep Learning",
  "NLP & GenAI",
  "APIs & Automation",
  "Developer Tools",
  "Core CS",
  "Cloud & AWS",
];

export default function AdminSkills() {
  const supabase = createClient();

  const [skills, setSkills] = useState<Skill[]>([]);
const [name, setName] = useState("");
const [category, setCategory] = useState("Programming");
const [newCategory, setNewCategory] = useState("");
const [showNewCategory, setShowNewCategory] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select("id, name, category")
      .order("created_at", { ascending: true });

    if (!error) {
      setSkills(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function saveSkill() {
    if (!name.trim()) return;
    const selectedCategory = showNewCategory
  ? newCategory.trim()
  : category;

    setSaving(true);
    setMessage("");

    if (editingId) {
      const { error } = await supabase
        .from("skills")
        .update({
  name: name.trim(),
  category: selectedCategory,
})
        .eq("id", editingId);

      if (error) {
        setMessage("Could not update skill.");
      } else {
        setMessage("Skill updated.");
        setName("");
        setEditingId(null);
        await loadSkills();
      }
    } else {
      const { error } = await supabase
  .from("skills")
  .insert({
    name: name.trim(),
    category: selectedCategory,
  });

      if (error) {
        setMessage("Could not add skill.");
      } else {
        setMessage("Skill added.");
        setName("");
        await loadSkills();
      }
    }

    setSaving(false);
  }

  function startEditing(skill: Skill) {
    setEditingId(skill.id);
    setName(skill.name);
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setName("");
    setMessage("");
  }

  async function deleteSkill(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Could not delete skill.");
    } else {
      setMessage("Skill deleted.");
      await loadSkills();
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <span className="admin-login-badge">SKILLS</span>

        <h1>Manage Skills</h1>

        <p>Add, update, or remove the skills shown on your portfolio.</p>
      </div>

      <div className="admin-editor-card">
        <label htmlFor="skill">
          {editingId ? "Update Skill" : "Add Skill"}
        </label>

        <input
          id="skill"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Python, SQL, Next.js"
        />
        <div>
  <label htmlFor="category">Category</label>

  <select
    id="category"
    value={showNewCategory ? "__new__" : category}
    onChange={(event) => {
      if (event.target.value === "__new__") {
        setShowNewCategory(true);
        setNewCategory("");
      } else {
        setShowNewCategory(false);
        setCategory(event.target.value);
      }
    }}
  >
    {DEFAULT_CATEGORIES.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}

    <option value="__new__">+ Create new category</option>
  </select>
</div>

{showNewCategory && (
  <div>
    <label htmlFor="new-category">New Category</label>

    <input
      id="new-category"
      type="text"
      value={newCategory}
      onChange={(event) => setNewCategory(event.target.value)}
      placeholder="e.g. Frameworks, Backend, Databases"
    />
  </div>
)}

        <div>
          <button
            type="button"
            onClick={saveSkill}
            disabled={saving || !name.trim()}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Skill"
                : "Add Skill"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEditing}>
              Cancel
            </button>
          )}
        </div>

        {message && <p>{message}</p>}
      </div>

      <div className="admin-editor-card">
        <h2>Your Skills</h2>

        {loading ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div>
            {skills.map((skill) => (
              <div key={skill.id}>
                <span>{skill.name}</span>

                <button
                  type="button"
                  onClick={() => startEditing(skill)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteSkill(skill.id)}
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