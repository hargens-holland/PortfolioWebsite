/**
 * Everything about me that isn't a project. Edit here, not in the components.
 */

export const SITE = {
  name: "Holland Hargens",
  nameLower: "holland hargens",
  title: "Holland Hargens — Computer Engineer",
  description:
    "Computer engineering grad working across FPGA bring-up, bare-metal firmware, ML pipelines, and LLM-backed backend services. Open to new grad roles in 2026.",
  /** Update once the custom domain is live — drives canonical and OG tags. */
  url: "https://hollandhargens.com",
  location: "Newton, MA",
  email: "hollandhargens@gmail.com",
  revision: "rev A",
  copyrightYear: "2026",
} as const;

export const LINKS = {
  github: "https://github.com/hargens-holland",
  /** Fill in and it appears in the footer automatically. */
  linkedin: "",
  resume: "/assets/resume.pdf",
} as const;

export const HERO = {
  statusLine: "[ OK ] bring-up complete",
  badge: "Open to new grad roles · 2026",
  intro:
    ", a computer engineering grad. FPGA bring-up and bare-metal firmware on one end, ML pipelines and LLM-backed services on the other.",
  roles: ["embedded systems.", "ML pipelines.", "backend services.", "LLM tooling."],
  chips: ["Embedded C / C++", "Python · PyTorch", "RTL & FPGA", "Newton, MA"],
  photoCaption: "Newton, MA — 2026",
} as const;

export type Role = {
  period: string;
  role: string;
  org: string;
  detail: string;
};

export const WORK: Role[] = [
  {
    period: "2026 — Present",
    role: "Software & AI Engineer",
    org: "Radius Hire",
    detail:
      "Contract, remote. Feature work across Radius Hire, Radius Find, and Compañero. Gemini-integrated candidate screening workflow, FastAPI services containerized on AWS, LLM output evaluation, data prototyping.",
  },
  {
    period: "Summer 2025",
    role: "Machine Learning Intern",
    org: "Veridis Technologies",
    detail:
      "Built the preprocessing pipeline for 23-channel time-series sensor data, then trained PyTorch and TensorFlow regression and classification models against it — ~7% RMSE across 20+ tracked MLflow configurations.",
  },
];

export const EDUCATION: Role = {
  period: "2022 — 2026",
  role: "B.S. Computer Engineering",
  org: "UW–Madison",
  detail:
    "3.6 GPA, Dean's Honor List. ECE 554 capstone with the Flex-PGA group, building a fitness tracker. IEEE member.",
};

export const SKILLS = [
  {
    title: "Embedded & hardware",
    items: ["C / C++", "SystemVerilog", "PSoC6", "Cortex-M4", "Vivado", "ZynqMP"],
  },
  {
    title: "ML & AI",
    items: ["Python", "PyTorch", "TensorFlow", "MLflow", "LLM integration & eval"],
  },
  {
    title: "Software & tooling",
    items: ["TypeScript", "Next.js", "FastAPI", "PostgreSQL", "Docker", "AWS", "GitHub Actions"],
  },
];

export const ABOUT = {
  heading: "Hardware and software",
  paragraphs: [
    "I studied computer engineering because I didn't want to choose between hardware and software. The problems I like are the ones that sit between them — a DPU that won't meet timing, a model that has to fit the resources you actually have, a service that has to stay up while you rewrite it.",
    "Right now I'm looking for a new grad role in embedded, ML, or backend engineering — somewhere that will challenge me and put me around people I can learn from.",
    "Outside of that: golf, and a dog named Beau.",
  ],
} as const;

export const CONTACT = {
  heading: "Get in touch",
  blurb:
    "Recruiters, engineers, and anyone with something interesting to build — reach out.",
} as const;

export const BOOT_LINES = [
  { tag: "[ OK ]", text: "rails 3v3 / 1v8 within tolerance" },
  { tag: "[ OK ]", text: "pll locked — core clock 48 MHz" },
  { tag: "[ OK ]", text: "sram 256 KB verified" },
  { tag: "[ OK ]", text: "i2c bus — 4 peripherals enumerated" },
  { tag: "[ >> ]", text: "holland hargens / portfolio rev A" },
];

export const NAV_SECTIONS = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
];
