export const site = {
  name: "Tanisha",
  title: "Tanisha | Portfolio",
  role: "Software Engineer × AI Engineer",
  tagline: "Building intelligent software systems with AI, data, and modern engineering.",
  intro:
    "I’m a Computer Science student focused on building practical software and AI systems  from LLM powered applications and automation to data driven products.",
  email: "tanisha17.6.2004@gmail.com",
  github: "https://github.com/tanisha203",
  linkedin: "https://www.linkedin.com/",
  leetcode: "https://leetcode.com/",
  resume: "/resume.pdf"
};

export const about = {
  paragraphs: [
    "I’m Tanisha, a Computer Science and Engineering student at DIT University, graduating in 2027. I enjoy turning real problems into useful software products.",
    "My current focus sits at the intersection of software engineering and AI: LLM applications, AI agents, document intelligence, automation, APIs, machine learning, and backend systems.",
    "I care about building things that are not only technically interesting, but also usable, reliable, and easy to understand."
  ]
};

export const skills = [
  { category: "Programming", items: ["Python", "Java", "SQL"] },
  { category: "Machine Learning", items: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"] },
  { category: "Deep Learning", items: ["CNN", "RNN", "LSTM", "TensorFlow"] },
  { category: "NLP & GenAI", items: ["LLMs", "AI Agents", "Transformers"] },
  { category: "APIs & Automation", items: ["OpenAI API", "Gemini API", "Gmail API", "Telegram Bot API", "n8n"] },
  { category: "Developer Tools", items: ["Git", "GitHub", "VS Code", "Google Colab", "GCP"] },
  { category: "Core CS", items: ["DSA", "OOP", "DBMS", "Operating Systems", "Software Engineering"] },
  { category: "Cloud & AWS", items: ["IAM", "EC2", "EBS", "AMI", "ELB", "ASG", "S3", "RDS", "DynamoDB", "Lambda", "VPC"] }
];

export const projects = [
  {
    number: "01",
    title: "AI Enhanced Due Diligence Analyzer",
    description:
      "AI-powered document intelligence platform for financial analysis, business risk detection, investigation, and evidence-backed reporting.",
    details:
      "Processes PDF, DOCX, TXT, CSV, and XLSX documents; performs KPI analysis, risk scoring, customer concentration analysis, cross-document inconsistency detection, evidence retrieval, grounded Q&A, recommendations, and report generation.",
    tech: ["Python", "Streamlit", "Pandas", "Scikit-learn", "OpenAI API", "PyMuPDF"],
    demo: "#",
    github: "https://github.com/tanisha203",
    featured: true
  },
  {
    number: "02",
    title: "Daily AI Newsletter",
    description:
      "Automated AI newsletter that fetches daily news, summarizes it with an LLM, and delivers concise updates by email.",
    details:
      "Built with n8n, GPT-4, News API and Gmail API to automate news extraction, summarization, formatting, and delivery.",
    tech: ["n8n", "OpenAI GPT-4", "News API", "Gmail API", "HTTP"],
    demo: "#",
    github: "https://github.com/tanisha203",
    featured: true
  },
  
];

export const experience = [
  {
    period: "Jun 2025 — Aug 2025",
    company: "Indian Institute of Technology — Jammu",
    role: "Artificial Intelligence Intern",
    points: [
      "Built an AI-powered automation tool using OpenAI, APIs and n8n, reducing human effort by 60%.",
      "Developed and deployed AI assistants including Telegram, voice, and email assistants.",
      "Designed prompt-driven agentic workflows for real-world automation.",
      "Integrated Google Sheets, Gmail, SERP, and Telegram APIs for end-to-end automation solutions.",
      "Tested and debugged AI prototypes with mentor feedback focused on reliability and usability."
    ]
  }
];

export const certifications = [
  "Gen AI Academy — Google Cloud × Hack2Skill",
  "Machine Learning & Python Programming Internship — Techkriti × IIT Kanpur",
  "LLM & AI Agent Certificates — Hugging Face & DeepLearning.AI",
  "NASA Space Apps Hackathon — DIT University × IMS University",
  "Claude 101 — Anthropic",
  "AI Fluency: Framework & Foundation — Anthropic"
];

export const achievements = [
  { value: "1827", label: "LeetCode contest rating" },
  { value: "Top 7.23%", label: "LeetCode contest ranking" },
  { value: "200+", label: "DSA problems solved" },
  { value: "2027", label: "Expected graduation" }
];
