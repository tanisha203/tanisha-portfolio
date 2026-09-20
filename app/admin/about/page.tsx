"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminAbout() {
  const supabase = createClient();

  const [intro, setIntro] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [aboutParagraph1, setAboutParagraph1] = useState("");
const [aboutParagraph2, setAboutParagraph2] = useState("");
const [aboutParagraph3, setAboutParagraph3] = useState("");

const [stat1Value, setStat1Value] = useState("");
const [stat1Label, setStat1Label] = useState("");

const [stat2Value, setStat2Value] = useState("");
const [stat2Label, setStat2Label] = useState("");

const [stat3Value, setStat3Value] = useState("");
const [stat3Label, setStat3Label] = useState("");

const [stat4Value, setStat4Value] = useState("");
const [stat4Label, setStat4Label] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAbout() {
  const { data, error } = await supabase
    .from("site_settings")
    .select(`
      intro,
      hero_tagline,
      about_paragraph1,
      about_paragraph2,
      about_paragraph3,
      stat1_value,
      stat1_label,
      stat2_value,
      stat2_label,
      stat3_value,
      stat3_label,
      stat4_value,
      stat4_label
    `)
    .limit(1)
    .maybeSingle();

  if (!error && data) {
    setIntro(data.intro || "");
    setHeroTagline(data.hero_tagline || "");

    setAboutParagraph1(data.about_paragraph1 || "");
    setAboutParagraph2(data.about_paragraph2 || "");
    setAboutParagraph3(data.about_paragraph3 || "");

    setStat1Value(data.stat1_value || "");
    setStat1Label(data.stat1_label || "");

    setStat2Value(data.stat2_value || "");
    setStat2Label(data.stat2_label || "");

    setStat3Value(data.stat3_value || "");
    setStat3Label(data.stat3_label || "");

    setStat4Value(data.stat4_value || "");
    setStat4Label(data.stat4_label || "");
  }

  setLoading(false);
}
    loadAbout();
  }, []);

 async function saveAbout() {
  setSaving(true);
  setMessage("");

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  let error;

  const aboutData = {
    intro,
    hero_tagline: heroTagline,
    about_paragraph1: aboutParagraph1,
    about_paragraph2: aboutParagraph2,
    about_paragraph3: aboutParagraph3,
    stat1_value: stat1Value,
    stat1_label: stat1Label,
    stat2_value: stat2Value,
    stat2_label: stat2Label,
    stat3_value: stat3Value,
    stat3_label: stat3Label,
    stat4_value: stat4Value,
    stat4_label: stat4Label,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    ({ error } = await supabase
      .from("site_settings")
      .update(aboutData)
      .eq("id", existing.id));
  } else {
    ({ error } = await supabase
      .from("site_settings")
      .insert(aboutData));
  }

  if (error) {
    setMessage(error.message);
    setSaving(false);
    return;
  }

  setMessage("About section updated successfully.");
  setSaving(false);
}

  //   if (error) {
  //     setMessage("Something went wrong. Please try again.");
  //   } else {
  //     setMessage("About section updated successfully.");
  //   }

  //   setSaving(false);
  // }

  if (loading) {
    return <main className="admin-page">Loading...</main>;
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <span className="admin-login-badge">ABOUT</span>

        <h1>Update About</h1>

        <p>
          Change the introduction that appears on your public portfolio.
        </p>
      </div>

      <div className="admin-editor-card">
        <label htmlFor="intro">Introduction</label>

        <textarea
          id="intro"
          value={intro}
          onChange={(event) => setIntro(event.target.value)}
          rows={7}
          placeholder="Write your portfolio introduction..."
        />
        <div className="admin-editor-card">
  <label htmlFor="heroTagline">Hero Tagline</label>
  <input
    id="heroTagline"
    value={heroTagline}
    onChange={(event) => setHeroTagline(event.target.value)}
    placeholder="Example: Aspiring Software & AI Engineer"
  />
</div>

<div className="admin-editor-card">
  <label htmlFor="aboutParagraph1">About Paragraph 1</label>
  <textarea
    id="aboutParagraph1"
    value={aboutParagraph1}
    onChange={(event) => setAboutParagraph1(event.target.value)}
    rows={5}
    placeholder="Write your first About paragraph..."
  />
</div>

<div className="admin-editor-card">
  <label htmlFor="aboutParagraph2">About Paragraph 2</label>
  <textarea
    id="aboutParagraph2"
    value={aboutParagraph2}
    onChange={(event) => setAboutParagraph2(event.target.value)}
    rows={5}
    placeholder="Write your second About paragraph..."
  />
</div>

<div className="admin-editor-card">
  <label htmlFor="aboutParagraph3">About Paragraph 3</label>
  <textarea
    id="aboutParagraph3"
    value={aboutParagraph3}
    onChange={(event) => setAboutParagraph3(event.target.value)}
    rows={5}
    placeholder="Write your third About paragraph..."
  />
</div>

<div className="admin-editor-card">
  <h3>About Statistics</h3>

  <label htmlFor="stat1Value">Statistic 1 Value</label>
  <input
    id="stat1Value"
    value={stat1Value}
    onChange={(event) => setStat1Value(event.target.value)}
    placeholder="Example: 1827"
  />

  <label htmlFor="stat1Label">Statistic 1 Label</label>
  <input
    id="stat1Label"
    value={stat1Label}
    onChange={(event) => setStat1Label(event.target.value)}
    placeholder="Example: LeetCode contest rating"
  />

  <label htmlFor="stat2Value">Statistic 2 Value</label>
  <input
    id="stat2Value"
    value={stat2Value}
    onChange={(event) => setStat2Value(event.target.value)}
    placeholder="Example: Top 7.23%"
  />

  <label htmlFor="stat2Label">Statistic 2 Label</label>
  <input
    id="stat2Label"
    value={stat2Label}
    onChange={(event) => setStat2Label(event.target.value)}
    placeholder="Example: LeetCode contest ranking"
  />

  <label htmlFor="stat3Value">Statistic 3 Value</label>
  <input
    id="stat3Value"
    value={stat3Value}
    onChange={(event) => setStat3Value(event.target.value)}
    placeholder="Example: 200+"
  />

  <label htmlFor="stat3Label">Statistic 3 Label</label>
  <input
    id="stat3Label"
    value={stat3Label}
    onChange={(event) => setStat3Label(event.target.value)}
    placeholder="Example: DSA problems solved"
  />

  <label htmlFor="stat4Value">Statistic 4 Value</label>
  <input
    id="stat4Value"
    value={stat4Value}
    onChange={(event) => setStat4Value(event.target.value)}
    placeholder="Example: 2027"
  />

  <label htmlFor="stat4Label">Statistic 4 Label</label>
  <input
    id="stat4Label"
    value={stat4Label}
    onChange={(event) => setStat4Label(event.target.value)}
    placeholder="Example: Expected graduation"
  />
</div>

        <button
          type="button"
          onClick={saveAbout}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save About"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}