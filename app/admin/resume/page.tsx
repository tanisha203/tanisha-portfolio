"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminResume() {
  const router = useRouter();
  const supabase = createClient();

  const [file, setFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadResume() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin");
        return;
      }

      const { data } = await supabase
        .from("site_settings")
        .select("resume_url")
        .limit(1)
        .maybeSingle();

      if (data?.resume_url) {
        setCurrentUrl(data.resume_url);
      }

      setLoading(false);
    }

    loadResume();
  }, [router, supabase]);

  async function uploadResume() {
    if (!file) {
      setMessage("Please select a PDF first.");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Please upload a PDF file only.");
      return;
    }

    setUploading(true);
    setMessage("");

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload("resume.pdf", file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (uploadError) {
  setMessage(`Could not upload resume: ${uploadError.message}`);
  setUploading(false);
  return;
}

    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl("resume.pdf");

    const resumeUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from("site_settings")
        .update({
          resume_url: resumeUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("site_settings")
        .insert({
          intro:
            "I’m a Computer Science student aspiring to become a Software & AI Engineer, focused on building practical, scalable products across AI, automation, and data-driven systems.",
          resume_url: resumeUrl,
        }));
    }

    if (error) {
      setMessage(
    `Resume uploaded, but the portfolio URL could not be saved: ${error.message}`
  );
    } else {
      setCurrentUrl(resumeUrl);
      setFile(null);
      setMessage("Resume updated successfully.");
    }

    setUploading(false);
  }

  if (loading) {
    return <main className="admin-page">Loading...</main>;
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <span className="admin-login-badge">RESUME</span>

        <h1>Update Resume</h1>

        <p>
          Upload a new PDF to replace the resume used on your portfolio.
        </p>
      </div>

      <div className="admin-editor-card">
        <label htmlFor="resume">Resume PDF</label>

        <input
          id="resume"
          type="file"
          accept="application/pdf"
          onChange={(event) =>
            setFile(event.target.files?.[0] || null)
          }
        />

        {file && <p>Selected: {file.name}</p>}

        <button
          type="button"
          onClick={uploadResume}
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>

        {currentUrl && (
          <p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View current resume
            </a>
          </p>
        )}

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}