/**
 * Everything about me that isn't a project. Edit here, not in the components.
 */

export const SITE = {
  name: "Holland Hargens",
  nameLower: "holland hargens",
  title: "Holland Hargens — Computer Engineer",
  description:
    "Computer engineering graduate from UW–Madison working across FPGA bring-up, bare-metal firmware, ML pipelines, and LLM-backed backend services. Open to new grad roles in 2026.",
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
    ", a computer engineering graduate from UW–Madison. I work across the stack: FPGA bring-up and bare-metal firmware on one end, ML pipelines and LLM-backed services on the other.",
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
      "Remote contract role shipping features across Radius Hire, Radius Find, and Compañero. Built an automated interview-scheduling flow in FastAPI on the WhatsApp Business API, an AI-driven video screening pipeline with client-side compression and cloud storage, and maintained the Gemini-integrated candidate screening workflow on a Node.js/TypeScript and Next.js platform — all containerized with Docker on AWS.",
  },
  {
    period: "Summer 2025",
    role: "ML & Software Engineering Intern",
    org: "Veridis Technologies · Amsterdam",
    detail:
      "Designed the preprocessing pipeline for 23-channel time-series sensor data — feature extraction and normalization across validation splits — then trained and benchmarked PyTorch and TensorFlow regression and classification models on it, reaching ~7% RMSE on polymer blend estimation. Tracked and compared 20+ experiment configurations in MLflow.",
  },
];

export const EDUCATION: Role = {
  period: "2022 — 2026",
  role: "B.S. Computer Engineering",
  org: "UW–Madison",
  detail:
    "3.6 GPA, Dean's Honor List every semester. ECE 554 capstone: an on-device ML workout tracker on a Xilinx Zynq. IEEE student member, with embedded sensor work on the chapter's weather-balloon project.",
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
        note: "Bare-metal firmware, mostly. The PSoC6 Blackjack project is all C with no RTOS underneath: hardware timers, interrupt-driven button input with software debounce, and an LCD driven over SPI.",
        projects: ["psoc6-blackjack"],
      },
      {
        name: "Verilog / SystemVerilog",
        note: "The capstone RTL on a Zynq: the PS↔PL interface that hands data between the ARM core and the FPGA fabric for on-device inference, validated end to end. Before that, Digital System Design and Computer Architecture coursework.",
        projects: ["workout-detection-fpga"],
      },
      {
        name: "PSoC6",
        note: "The board under the Blackjack project: GPIO, SPI, I2C, and UART peripherals sharing one interrupt scheme, with the game's six states driven off those events.",
        projects: ["psoc6-blackjack"],
      },
      {
        name: "Cortex-M4",
        note: "The core in the PSoC6. I've worked it bare-metal — timers, interrupts, and peripherals by hand rather than through an RTOS — which is the level where timing problems actually show up.",
        projects: ["psoc6-blackjack"],
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
        note: "At Radius Hire I built a Gemini-backed candidate screening workflow and the evaluation around it, checking output quality systematically instead of spot-checking by hand. The Goal Planner's weekly regeneration runs on the Anthropic API.",
        projects: ["goal-planner"],
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
        note: "The Goal Planner is a full Next.js app with a database behind it. This site is the other kind — exported to static HTML, which is why it can sit in an S3 bucket behind a CDN with no server to keep running.",
        projects: ["goal-planner"],
      },
      {
        name: "FastAPI",
        note: "The inference endpoint for my EEG classifier, and the interview-scheduling service at Radius Hire, which runs on the WhatsApp Business API.",
        projects: ["eeg-seizure-detection"],
      },
      {
        name: "MySQL / PostgreSQL",
        note: "The Goal Planner runs on MySQL in RDS — schema, queries, and the weekly rollup the AI plan is generated from. Database Management coursework covered the theory; that project is where it got real.",
        projects: ["goal-planner"],
      },
      {
        name: "Docker",
        note: "Containerized the EEG inference service, the Goal Planner, and the FastAPI services at Radius Hire, so they run the same locally as they do on AWS.",
        projects: ["eeg-seizure-detection", "goal-planner"],
      },
      {
        name: "AWS",
        note: "Containerized services at Radius Hire; the Goal Planner on EC2, S3, and RDS; and this site — S3, CloudFront, and Route 53, with an OIDC role for CI, all defined in Terraform.",
        projects: ["goal-planner"],
      },
      {
        name: "GitHub Actions",
        note: "The deploy pipeline for this site: lint, typecheck, build, sync to S3, then invalidate the CloudFront cache. It authenticates to AWS over OIDC, so there are no stored access keys.",
      },
    ],
  },
];

export const ABOUT = {
  heading: "I build the whole thing",
  paragraphs: [
    "I studied computer engineering so I could work at every layer, and I have: firmware on a Cortex-M4, RTL on a Zynq, ML models trained on real sensor data, and full-stack services with AI in the loop. The projects on this page each cover the full path from idea to something running, because that's the part I care about.",
    "Right now I'm looking for a new grad role in AI, full-stack, ML, or embedded engineering. I'm most useful on teams shipping products where those overlap: an LLM feature that needs a real backend behind it, a model that has to run on actual hardware. I'd like to be somewhere that pushes me to be better.",
    "Outside of work: golf, and a dog named Beau. Eagle Scout, for what it's worth.",
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
