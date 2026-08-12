/**
 * Every project on the site.
 *
 * To add one: append an object to PROJECTS. That's the only step — it
 * generates its own page at /projects/<slug> and its card on the homepage.
 *
 * Each project lives in its own repo; this file is the portfolio's index of
 * them. Keep `summary` and `body` written for someone deciding whether to look,
 * not for a developer who already did — that's what the README in the project
 * repo is for.
 */

export type ProjectLink = {
  /** Button text on the project page: "Source", "Live demo", "API", … */
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Board-designator styling from the design: M1, M2, … */
  designator: string;
  year: string;
  role: string;
  /** Exactly one project should set this — it gets the big card. */
  featured?: boolean;
  /** One or two sentences, shown on the card. */
  summary: string;
  /** Full writeup, one string per paragraph, shown on the project page. */
  body: string[];
  tags: string[];
  /** Path under /public/assets, or omit for the filename placeholder. */
  image?: string;
  links: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: "dpu-bringup",
    name: "DPU Bring-Up on a ZU3",
    designator: "M1",
    year: "2026",
    role: "Solo · FPGA + ML",
    featured: true,
    summary:
      "Integrated the DPUCZDX8G IP in Vivado on an AUP-ZU3 (ZynqMP) board targeting pynq-dpu inference.",
    body: [
      "Integrated the DPUCZDX8G IP in Vivado on an AUP-ZU3 (ZynqMP) board targeting pynq-dpu inference.",
      "The ZU3 doesn't have the resources for a full-size DPU, so it came down to tradeoffs: scaled down to a B512 configuration to fit, and dropped the PL1 clock to 200 MHz to close timing.",
    ],
    tags: ["Vivado", "ZynqMP", "PYNQ", "Python"],
    links: [
      // { label: "Source", href: "https://github.com/hargens-holland/dpu-bringup" },
    ],
  },
  {
    slug: "eeg-seizure-detection",
    name: "EEG Seizure Detection",
    designator: "M2",
    year: "2026",
    role: "Solo · ML + deployment",
    summary:
      "Trained a seizure classifier on EEG recordings in PyTorch, then packaged it for actual use: FastAPI inference endpoint, Docker container, documented setup.",
    body: [
      "Trained a seizure classifier on EEG recordings in PyTorch, then packaged it for actual use: FastAPI inference endpoint, Docker container, documented setup.",
    ],
    tags: ["PyTorch", "FastAPI", "Docker", "Python"],
    links: [
      // { label: "Source", href: "https://github.com/hargens-holland/eeg-seizure" },
      // { label: "API", href: "https://eeg-api.example.com" },
    ],
  },
];

export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
export const otherProjects = () => PROJECTS.filter((p) => p !== featuredProject());
export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
