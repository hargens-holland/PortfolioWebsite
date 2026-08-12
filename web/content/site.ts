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

/**
 * What the résumé is *saved as* — the file on disk stays resume.pdf, but a
 * recruiter's Downloads folder already has a dozen of those.
 */
export const RESUME_FILENAME = "Holland-Hargens-Resume.pdf";

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

export type Skill = {
  name: string;
  /**
   * Two or three sentences on where you've actually used it. Omit it and the
   * chip renders as a plain label with no arrow — so you can fill these in a
   * few at a time instead of all at once.
   */
  note?: string;
  /** Slugs from content/projects.ts. Rendered as links at the bottom of the note. */
  projects?: string[];
};

export type SkillGroup = {
  title: string;
  items: Skill[];
};

export const SKILLS: SkillGroup[] = [
  {
    title: "Embedded & hardware",
    items: [
      {
        name: "C / C++",
        note: "TODO — which firmware did you write in C, and on what hardware? Two or three sentences.",
      },
      {
        name: "SystemVerilog",
        note: "TODO — the ECE 554 capstone, or other RTL coursework. What did you actually design and verify?",
      },
      {
        name: "PSoC6",
        note: "TODO — which project used the PSoC6, and what was it doing? Peripherals, sensors, power?",
      },
      {
        name: "Cortex-M4",
        note: "TODO — where you worked on an M4 core, and at what level: bare-metal, RTOS, driver work?",
      },
      {
        name: "Vivado",
        note: "Block design and IP integration for the DPU bring-up on an AUP-ZU3. Most of the work came after the first successful build — reading timing reports and adjusting the configuration until the design closed.",
        projects: ["dpu-bringup"],
      },
      {
        name: "ZynqMP",
        note: "The AUP-ZU3 board my DPU work targets. Getting the processing system and the programmable logic to cooperate — clocking, the AXI interfaces, and booting into PYNQ — was most of that project.",
        projects: ["dpu-bringup"],
      },
    ],
  },
  {
    title: "ML & AI",
    items: [
      {
        name: "Python",
        note: "My default for anything data or ML: the preprocessing pipeline at Veridis, model training in both PyTorch and TensorFlow, and the FastAPI services I've written since.",
        projects: ["eeg-seizure-detection"],
      },
      {
        name: "PyTorch",
        note: "Trained regression and classification models on 23-channel time-series sensor data at Veridis, and the seizure classifier in my EEG project.",
        projects: ["eeg-seizure-detection"],
      },
      {
        name: "TensorFlow",
        note: "Used alongside PyTorch at Veridis to compare architectures against the same preprocessed sensor data.",
      },
      {
        name: "MLflow",
        note: "Tracked 20+ training configurations at Veridis — parameters, metrics, and artifacts — so runs could be compared later rather than remembered.",
      },
      {
        name: "LLM integration & eval",
        note: "At Radius Hire I built a Gemini-backed candidate screening workflow and the evaluation around it, checking output quality systematically instead of spot-checking by hand.",
      },
    ],
  },
  {
    title: "Software & tooling",
    items: [
      {
        name: "TypeScript",
        note: "This site, end to end. The projects and skills you're reading are typed data in one folder, so adding either one is a data change rather than a template change.",
      },
      {
        name: "Next.js",
        note: "This site is a Next.js app exported to static HTML, which is why it can sit in an S3 bucket behind a CDN with no server to keep running.",
      },
      {
        name: "FastAPI",
        note: "The inference endpoint for my EEG classifier, and service work at Radius Hire.",
        projects: ["eeg-seizure-detection"],
      },
      {
        name: "PostgreSQL",
        note: "TODO — schema or query work at Radius Hire, or wherever you've used it. What was the data?",
      },
      {
        name: "Docker",
        note: "Containerized the EEG inference service, and the FastAPI services at Radius Hire, so they run the same locally as they do on AWS.",
        projects: ["eeg-seizure-detection"],
      },
      {
        name: "AWS",
        note: "Containerized services at Radius Hire, and this site — S3, CloudFront, and Route 53, with an OIDC role for CI, all defined in Terraform.",
      },
      {
        name: "GitHub Actions",
        note: "The deploy pipeline for this site: lint, typecheck, build, sync to S3, then invalidate the CloudFront cache. It authenticates to AWS over OIDC, so there are no stored access keys.",
      },
    ],
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
