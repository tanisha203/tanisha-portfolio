"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePhotoAdmin() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [currentPhoto, setCurrentPhoto] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/admin");
        return;
      }

      setUser(data.user);

      const { data: settings } = await supabase
        .from("site_settings")
        .select("profile_url")
        .limit(1)
        .single();

      if (settings?.profile_url) {
        setCurrentPhoto(settings.profile_url);
      }
    }

    load();
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage("");
  }

  async function handleUpload() {
    if (!file || !user) {
      setMessage("Please select a photo first.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const filePath = "profile.jpg";

      const { error: uploadError } = await supabase.storage
        .from("profile")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile")
        .getPublicUrl(filePath);

      const publicUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

      const { data: settingsRows, error: settingsError } = await supabase
  .from("site_settings")
  .select("id")
  .order("id", { ascending: true })
  .limit(1);

if (settingsError) {
  throw settingsError;
}

if (settingsRows && settingsRows.length > 0) {
  const { error: updateError } = await supabase
    .from("site_settings")
    .update({
      profile_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", settingsRows[0].id);

  if (updateError) {
    throw updateError;
  }
} else {
  const { error: insertError } = await supabase
    .from("site_settings")
    .insert({
      intro: "",
      profile_url: publicUrl,
    });

  if (insertError) {
    throw insertError;
  }
}
      setCurrentPhoto(publicUrl);
      setFile(null);
      setPreview("");
      setMessage("Profile photo updated successfully.");
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
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

        <h1>Profile Photo</h1>
        <p>Upload or replace the profile photo shown on your portfolio.</p>

        <div className="admin-card">
          <h2>Current Photo</h2>

          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Current profile"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "50%",
                marginTop: "16px",
              }}
            />
          ) : (
            <p>No profile photo uploaded yet.</p>
          )}
        </div>

        <div className="admin-card">
          <h2>Choose New Photo</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: "16px" }}
          />

          {preview && (
            <div style={{ marginTop: "20px" }}>
              <p>Preview:</p>

              <img
                src={preview}
                alt="New profile preview"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{ marginTop: "20px" }}
          >
            {uploading ? "Uploading..." : "Update Profile Photo"}
          </button>

          {message && (
            <p style={{ marginTop: "16px" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}