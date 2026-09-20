"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Certification = {
  id: string;
  name: string;
};

export default function CertificationsAdmin() {
  const router = useRouter();
  const supabase = createClient();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadCertifications() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/admin");
      return;
    }

    const { data, error } = await supabase
      .from("certifications")
      .select("id, name")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setCertifications(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCertifications();
  }, []);

  function startEdit(certification: Certification) {
    setEditingId(certification.id);
    setName(certification.name);
    setMessage("");
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setMessage("");
  }

  async function handleSave() {
    if (!name.trim()) {
      setMessage("Please enter a certification name.");
      return;
    }

    setSaving(true);
    setMessage("");

    if (editingId) {
      const { error } = await supabase
        .from("certifications")
        .update({
          name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Certification updated successfully.");
        clearForm();
        await loadCertifications();
      }
    } else {
      const { error } = await supabase
        .from("certifications")
        .insert({
          name: name.trim(),
        });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Certification added successfully.");
        clearForm();
        await loadCertifications();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Certification deleted successfully.");
    await loadCertifications();
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="admin-back-button"
        >
          ← Back to Dashboard
        </button>

        <h1>Certifications</h1>
        <p>
          Add, edit, or remove the certifications displayed on your portfolio.
        </p>

        <div className="admin-card">
          <h2>
            {editingId ? "Edit Certification" : "Add Certification"}
          </h2>

          <input
            type="text"
            placeholder="Certification name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Certification"
                : "Add Certification"}
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

          {message && (
            <p style={{ marginTop: "16px" }}>
              {message}
            </p>
          )}
        </div>

        <div className="admin-card">
          <h2>Your Certifications</h2>

          {loading ? (
            <p>Loading certifications...</p>
          ) : certifications.length === 0 ? (
            <p>No certifications added yet.</p>
          ) : (
            <div style={{ marginTop: "16px" }}>
              {certifications.map((certification) => (
                <div
                  key={certification.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span>{certification.name}</span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(certification)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(certification.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}