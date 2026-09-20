 "use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, Download, ExternalLink, Code2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { about, achievements, certifications, experience, projects, site, skills } from "@/data/site";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};

export default function Portfolio() {
  const supabase = createClient();

const [resumeUrl, setResumeUrl] = useState(site.resume);
const [intro, setIntro] = useState(site.intro);
const [heroTagline, setHeroTagline] = useState(
  "Aspiring Software & AI Engineer"
);
const [aboutParagraph1, setAboutParagraph1] = useState(
  about.paragraphs[0]
);
const [aboutParagraph2, setAboutParagraph2] = useState(
  about.paragraphs[1]
);
const [aboutParagraph3, setAboutParagraph3] = useState(
  about.paragraphs[2]
);

const [stat1Value, setStat1Value] = useState(achievements[0]?.value || "");
const [stat1Label, setStat1Label] = useState(achievements[0]?.label || "");

const [stat2Value, setStat2Value] = useState(achievements[1]?.value || "");
const [stat2Label, setStat2Label] = useState(achievements[1]?.label || "");

const [stat3Value, setStat3Value] = useState(achievements[2]?.value || "");
const [stat3Label, setStat3Label] = useState(achievements[2]?.label || "");

const [stat4Value, setStat4Value] = useState(achievements[3]?.value || "");
const [stat4Label, setStat4Label] = useState(achievements[3]?.label || "");
const [skillsData, setSkillsData] = useState<{ category: string; items: string[] }[]>(skills);
const [projectsData, setProjectsData] = useState(projects);
const [experienceData, setExperienceData] = useState(experience);
const [certificationsData, setCertificationsData] =
  useState(certifications);

useEffect(() => {
  async function loadResumeUrl() {
    const { data } = await supabase
      .from("site_settings")
      .select(`
  resume_url,
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

    if (data?.resume_url) {
      setResumeUrl(data.resume_url);
    }
    if (data?.intro) {
  setIntro(data.intro);
}
if (data?.hero_tagline) {
  setHeroTagline(data.hero_tagline);
}
if (data?.about_paragraph1) {
  setAboutParagraph1(data.about_paragraph1);
}

if (data?.about_paragraph2) {
  setAboutParagraph2(data.about_paragraph2);
}

if (data?.about_paragraph3) {
  setAboutParagraph3(data.about_paragraph3);
}

if (data?.stat1_value) {
  setStat1Value(data.stat1_value);
}

if (data?.stat1_label) {
  setStat1Label(data.stat1_label);
}

if (data?.stat2_value) {
  setStat2Value(data.stat2_value);
}

if (data?.stat2_label) {
  setStat2Label(data.stat2_label);
}

if (data?.stat3_value) {
  setStat3Value(data.stat3_value);
}

if (data?.stat3_label) {
  setStat3Label(data.stat3_label);
}

if (data?.stat4_value) {
  setStat4Value(data.stat4_value);
}

if (data?.stat4_label) {
  setStat4Label(data.stat4_label);
}
const { data: supabaseSkills } = await supabase
  .from("skills")
  .select("id, name, category")
  .order("created_at", { ascending: true });
if (supabaseSkills && supabaseSkills.length > 0) {
  const mergedSkills = skills.map((group) => ({
    ...group,
    items: [...group.items],
  }));

  supabaseSkills.forEach((skill) => {
    const category = skill.category?.trim();

    if (!category) return;

    const existingGroup = mergedSkills.find(
      (group) => group.category === category
    );

    if (existingGroup) {
      if (!existingGroup.items.includes(skill.name)) {
        existingGroup.items.push(skill.name);
      }
    } else {
      mergedSkills.push({
        category,
        items: [skill.name],
      });
    }
  });

  setSkillsData(mergedSkills);
}
const { data: supabaseProjects } = await supabase
  .from("projects")
  .select(
    "id, number, title, description, details, technologies, github_url, live_url, demo, featured"
  )
  .order("created_at", { ascending: true });

if (supabaseProjects && supabaseProjects.length > 0) {
  setProjectsData(
    supabaseProjects.map((project) => ({
      number: project.number || "",
      title: project.title,
      description: project.description || "",
      details: project.details || "",
      tech: project.technologies || [],
      github: project.github_url || "#",
      demo: project.demo || project.live_url || "#",
      featured: project.featured ?? true,
    }))
  );
  const { data: supabaseExperience } = await supabase
  .from("experience")
  .select("id, company, role, period, points")
  .order("created_at", { ascending: true });

if (supabaseExperience && supabaseExperience.length > 0) {
  setExperienceData(
    supabaseExperience.map((item) => ({
      period: item.period || "",
      company: item.company,
      role: item.role,
      points: item.points || [],
    }))
  );
}
if (supabaseExperience && supabaseExperience.length > 0) {
  setExperienceData(
    supabaseExperience.map((item) => ({
      period: item.period || "",
      company: item.company,
      role: item.role,
      points: item.points || [],
    }))
  );
}

const { data: supabaseCertifications } = await supabase
  .from("certifications")
  .select("id, name")
  .order("created_at", { ascending: true });

if (
  supabaseCertifications &&
  supabaseCertifications.length > 0
) {
  const mergedCertifications = [...certifications];

  supabaseCertifications.forEach((certification) => {
    if (
      certification.name &&
      !mergedCertifications.includes(certification.name)
    ) {
      mergedCertifications.push(certification.name);
    }
  });

  setCertificationsData(mergedCertifications);
}
}

  }

  loadResumeUrl();
}, []);
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#top">Tanisha</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <a className="nav-cta" href={resumeUrl}>Resume</a>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <motion.div initial="hidden" animate="show" variants={fade}>
              <div className="eyebrow">{heroTagline}</div>
              <h1>Tanisha</h1>
              <p>{intro}</p>
              <div className="actions">
                <a className="btn btn-primary" href="#work">Explore my work <ArrowUpRight size={17}/></a>
                
              </div>
              <div className="socials">
                <a href={site.github} target="_blank"><Github size={17}/> GitHub</a>
                <a href={site.linkedin} target="_blank"><Linkedin size={17}/> LinkedIn</a>
                <a href={site.leetcode} target="_blank"><Code2 size={17}/> LeetCode</a>
              </div>
            </motion.div>

            <ProfilePhoto />
          </div>
        </section>

        <section className="section" id="about">
          <div className="container about-grid">
            <div>
              <div className="eyebrow">About</div>
              <h2 className="section-title">Building with purpose.</h2>
            </div>
            <div className="about-copy">
              <p>{aboutParagraph1}</p>
<p>{aboutParagraph2}</p>
<p>{aboutParagraph3}</p>
              <div className="stats">
                <div className="stat">
  <strong>{stat1Value}</strong>
  <span>{stat1Label}</span>
</div>

<div className="stat">
  <strong>{stat2Value}</strong>
  <span>{stat2Label}</span>
</div>

<div className="stat">
  <strong>{stat3Value}</strong>
  <span>{stat3Label}</span>
</div>

<div className="stat">
  <strong>{stat4Value}</strong>
  <span>{stat4Label}</span>
</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="work">
          <div className="container">
            <div className="eyebrow">Selected work</div>
            <h2 className="section-title">Things I’ve built.</h2>
            <p className="section-copy">A focused selection of projects where AI, automation, data, and software engineering come together.</p>

            <div className="project-list">
              {projectsData.map((project, index) => (
                <motion.article
                  className="project"
                  key={project.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: .2 }}
                >
                  <div className="project-main">
                    <div className="project-number">
  {project.number || String(index + 1).padStart(2, "0")}
</div>
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-tech">
                        {project.tech.map((t) => <span className="pill" key={t}>{t}</span>)}
                      </div>
                    </div>
                    <div className="project-links">
                      <a href={project.github} target="_blank" aria-label="GitHub"><Github size={17}/></a>
                      <a href={project.demo} target="_blank" aria-label="Live demo"><ExternalLink size={17}/></a>
                    </div>
                  </div>
                  <div className="project-details">{project.details}</div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="container">
            <div className="eyebrow">Experience</div>
            <h2 className="section-title">Where I’ve worked.</h2>
            {experienceData.map((item) => (
              <div className="experience" key={item.company}>
                <div className="period">{item.period}</div>
                <div>
                  <h3>{item.company}</h3>
                  <div className="role">{item.role}</div>
                  <ul className="bullets">
                    {item.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="container">
            <div className="eyebrow">Tech stack</div>
            <h2 className="section-title">Tools I work with.</h2>
            <div className="skill-grid">
              {skillsData.map((group) => (
                <div className="skill-card" key={group.category}>
                  <h3>{group.category}</h3>
                  <div className="skill-items">
                    {group.items.map((item) => <span className="pill" key={item}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="eyebrow">Credentials</div>
            <h2 className="section-title">Learning & achievements.</h2>
            <div className="cert-grid">
              {certificationsData.map((cert) => <div className="cert" key={cert}>{cert}</div>)}
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container">
            <div className="eyebrow">Contact</div>
            <h2 className="section-title">Let’s build something useful.</h2>
            <p className="section-copy" style={{margin: "0 auto"}}>For opportunities, collaborations, or interesting technical problems.</p>
            <a className="email" href={`mailto:${site.email}`}><Mail size={28}/> {site.email}</a>
            <div className="actions" style={{justifyContent:"center"}}>
              <a className="btn btn-primary" href={resumeUrl}><Download size={17}/> Resume</a>
              <a className="btn" href={site.github} target="_blank"><Github size={17}/> GitHub</a>
              <a className="btn" href={site.linkedin} target="_blank"><Linkedin size={17}/> LinkedIn</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <span>© {new Date().getFullYear()} Tanisha</span>
        <span>Built with Next.js · TypeScript · Tailwind-style CSS · Framer Motion</span>
      </footer>
    </>
  );
}

function ProfilePhoto() {
  const [photo, setPhoto] = useState<string | null>("/profile.jpg");

  useEffect(() => {
  async function loadProfilePhoto() {
    const supabase = createClient();

    const { data } = await supabase
      .from("site_settings")
      .select("profile_url")
      .limit(1)
      .maybeSingle();

      if (data?.profile_url) {
        setPhoto(data.profile_url);
      }
    }

    loadProfilePhoto();
  }, []);

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="orbit" />

      {photo && (
        <img
          src={photo}
          alt="Tanisha"
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(255,255,255,0.2)",
            position: "relative",
            zIndex: 5,
          }}
        />
      )}
    </motion.div>
  );
}