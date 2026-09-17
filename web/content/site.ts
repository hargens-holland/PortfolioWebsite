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
  linkedin: "https://www.linkedin.com/in/holland-hargens/",
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
  roles: [
    "a three-agent LLM planner with its own eval harness.",
    "interview scheduling on the WhatsApp Business API.",
    "on-device pose classification on a Zynq FPGA.",
    "a 13-task FreeRTOS game on a PSoC 6.",
  ],
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
    role: "Software Engineer",
    org: "Radius Signal",
    detail:
      "Remote, shipping features across Radius Hire, Radius Find, and Compañero, a Node.js/TypeScript and Next.js platform containerized with Docker on AWS. Built the second-round interview scheduling flow on the WhatsApp Business API in FastAPI: it parses candidate replies, proposes slots, and writes confirmed interviews to the calendar. Built a messaging service that unifies several third-party messaging APIs behind one interface, a placement-offer module with DocuSign e-signature integrated, and a video pipeline that compresses uploads client-side and serves each company its own intro video. Tested the Gemini candidate-screening workflow and found and fixed bugs in it, and review code across the team's pull requests. Currently working on Radius Talent, the job-seeker side of the platform, where the evaluation and testing are mine to build.",
  },
  {
    period: "2023 — 2026",
    role: "AI Model Analyst",
    org: "Outlier · Freelance",
    detail:
      "Evaluated AI-generated code and reasoning across Python, Java, and math tasks for correctness and edge cases, and wrote the structured feedback used to improve model response quality. Two and a half years of grading model output by hand, which is where the instinct for building evals came from.",
  },
  {
    period: "Summer 2025",
    role: "ML Intern",
    org: "Veridis · Amsterdam",
    detail:
      "Designed the preprocessing pipeline for 23-channel time-series sensor data — feature extraction and normalization across validation splits — then trained and benchmarked PyTorch and TensorFlow regression and classification models on it, reaching ~7% RMSE on polymer blend estimation. Tracked and compared 20+ experiment configurations in MLflow.",
  },
];

export const EDUCATION: Role = {
  period: "2022 — 2026",
  role: "B.S. Computer Engineering",
  org: "UW–Madison",
  detail:
    "3.6 GPA, Dean's Honor List every semester. ECE 554 capstone: Flex-PGA, on-device workout classification on a Zynq UltraScale+. IEEE student member, with embedded sensor work on the chapter's weather-balloon project.",
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
        note: "Firmware, mostly. The PSoC 6 Blackjack project is all C on FreeRTOS: seven state tasks, a gatekeeper task for each bus, queues and notifications between them, and hand-written drivers for the joystick, buttons, SPI, I2C, and UART underneath.",
        projects: ["psoc6-blackjack"],
      },
      {
        name: "Verilog / SystemVerilog",
        note: "The eBike controller for ECE 551: 20 SystemVerilog modules from SPI master to PID to commutation, synthesized to 32 nm. The ECE 552 pipelined CPU in structural Verilog, down to dff primitives. On the capstone, teammates wrote the classifier RTL and my PS-side pipeline had to match its AXI-Lite register map and timing exactly.",
        projects: ["ebike-controller", "risc-cpu", "flex-pga"],
      },
      {
        name: "Synopsys Design Compiler",
        note: "Synthesizing the eBike controller to SAED 32 nm LVT at a 2.5 ns clock: constraints, wire-load model, hold fixing, and reading the area and timing reports. An area-driven compile_ultra experiment cut cell area 18% but left one hold path 80 ps short, which is why it didn't become the final netlist.",
        projects: ["ebike-controller"],
      },
      {
        name: "ModelSim / QuestaSim",
        note: "Closed-loop system testbenches through physics models for the eBike controller, unit benches for every block, gate-level simulation of the synthesized netlist, and cycle-level traces of four test programs on the pipelined CPU.",
        projects: ["ebike-controller", "risc-cpu"],
      },
      {
        name: "PSoC 6",
        note: "The Infineon board under the Blackjack project: ADC joystick, GPIO buttons, SPI EEPROM, a TCA9534 I2C IO expander, a parallel-bus LCD, and a UART console, each behind its own FreeRTOS gatekeeper task so only one piece of code ever touches a bus.",
        projects: ["psoc6-blackjack"],
      },
      {
        name: "Cortex-M4",
        note: "The core in the PSoC 6. Interrupt-context work on it (an IO-expander ISR posting to an event group through the FromISR API), task priorities set so input preempts the game state machine, and the timing questions that come with both.",
        projects: ["psoc6-blackjack"],
      },
      {
        name: "Vivado",
        note: "Block design and IP integration on the AUP-ZU3 for the capstone: the DPU build that routed and closed timing but consumed the whole device, and the custom MLP peripheral that replaced it. Most of the work is reading the reports after a build, not the build itself.",
        projects: ["flex-pga"],
      },
      {
        name: "ZynqMP",
        note: "The Zynq UltraScale+ XCZU3EG on the AUP-ZU3 board. Getting the processing system and the programmable logic to cooperate — clocking, the AXI interfaces, shared memory, and booting into PYNQ — was most of the capstone.",
        projects: ["flex-pga"],
      },
      {
        name: "AXI4-Lite",
        note: "The register interface between the ARM cores and the capstone's FPGA classifier: 34 keypoint values written in, a class read back. My side was the processing system: writing to and reading from that peripheral from Python on PYNQ, and making the camera pipeline feed it at frame rate.",
        projects: ["flex-pga"],
      },
      {
        name: "PYNQ",
        note: "How the capstone's Python side talks to the fabric: loading the overlay, mapping the MLP peripheral's registers, and driving inference from the same script that runs the camera.",
        projects: ["flex-pga"],
      },
      {
        name: "Altium PCB Design",
        note: "The Whack-a-Mole board: layout in Altium from a provided schematic, fabrication, hand assembly, and bring-up, which turned up a schematic error I fixed on the board with a cut trace and a jumper.",
        projects: ["whack-a-mole-pcb"],
      },
      {
        name: "Cadence Virtuoso",
        note: "Full-custom layout for the ECE 555 MLP classifier: a ReLU multiplexer cell on the team's 11.88 µm bit-slice pitch, integrated into the datapath and verified DRC and LVS clean with parasitic extraction.",
        projects: ["mlp-vlsi"],
      },
      {
        name: "FreeRTOS",
        note: "Thirteen tasks on the PSoC 6: one per Blackjack game state, one gatekeeper per peripheral, wired together with task notifications, an event group, queues that carry their own reply-queue handles, and a binary semaphore around the game struct. Built in ModusToolbox with GCC ARM.",
        projects: ["psoc6-blackjack"],
      },
    ],
  },
  {
    title: "ML & AI",
    items: [
      {
        name: "Python",
        note: "My default for anything data or ML: the preprocessing pipeline at Veridis, the EEG pipeline from EDF files through MNE to spectrograms, model training in both PyTorch and TensorFlow, the OpenCV and NumPy camera pipeline on the capstone's ARM cores, and the FastAPI services I've written since.",
        projects: ["eeg-seizure-detection", "flex-pga"],
      },
      {
        name: "PyTorch",
        note: "Trained regression and classification models on 23-channel time-series sensor data at Veridis, and the 1D and 2D CNNs in the EEG seizure project, where the model was fine and the evaluation was the problem.",
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
        note: "At Radius Signal I tested the Gemini-backed candidate screening workflow, found bugs in it, and fixed them; the evaluation and testing for Radius Talent, the product I'm on now, are mine to build. The Goal Planner is where I've already built that side end to end: three Claude agents on the Anthropic SDK, structured outputs constrained to Zod schemas, typed fallbacks so the app never fails because the model did, and an eval harness with an LLM judge that decides which model each agent runs on.",
        projects: ["goal-planner"],
      },
      {
        name: "Evals & observability",
        note: "In the Goal Planner, every model call is logged with tokens, cost, and latency, and an eval harness with deterministic checks and an LLM judge decides which model each agent runs on. Built first, on purpose: it found six bugs the unit tests couldn't see.",
        projects: ["goal-planner"],
      },
      {
        name: "TensorFlow Lite",
        note: "Google's pretrained MoveNet pose model, run through TFLite on the capstone's ARM cores to turn each camera frame into 17 keypoints before anything reaches the fabric.",
        projects: ["flex-pga"],
      },
      {
        name: "OpenCV",
        note: "Camera capture and the on-screen overlay for the capstone: skeleton, class, confidence, rep count, and frame rate drawn onto the DisplayPort output.",
        projects: ["flex-pga"],
      },
      {
        name: "Vitis AI / VART",
        note: "The runtime for the DPU integration attempt on the capstone. I built the camera → shared-memory → VART inference path on the processing-system side before the team moved pose estimation off the fabric.",
        projects: ["flex-pga"],
      },
      {
        name: "Scikit-learn · Pandas",
        note: "The three classical baselines in the EEG project, and the metrics that showed accuracy was lying: sensitivity, AUC, and thresholds chosen on validation data against a false-alarm budget.",
        projects: ["eeg-seizure-detection"],
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
        note: "The Goal Planner is a full Next.js 14 app with Postgres behind it. This site is the other kind — exported to static HTML, which is why it can sit in an S3 bucket behind a CDN with no server to keep running.",
        projects: ["goal-planner"],
      },
      {
        name: "FastAPI",
        note: "The second-round interview scheduling service at Radius Signal: a FastAPI service on the WhatsApp Business API that parses candidate replies, proposes slots, and writes confirmed interviews to the calendar. Also the messaging service that fronts several third-party messaging APIs.",
      },
      {
        name: "PostgreSQL · Prisma",
        note: "The Goal Planner runs on Postgres through Prisma: goals, milestones, scheduled tasks, the per-call telemetry table, and the rate-limit windows, which are one atomic upsert per request. Database Management coursework covered the theory; that project is where it got real.",
        projects: ["goal-planner"],
      },
      {
        name: "Docker",
        note: "Containerized the FastAPI services at Radius Signal, so they run the same locally as they do on AWS. Before that, Docker Compose for the Flight Tracker so the frontend and backend came up with one command.",
        projects: ["flight-tracker"],
      },
      {
        name: "AWS",
        note: "Containerized services at Radius Signal, and this site — S3, CloudFront, and Route 53, with an OIDC role for CI, all defined in Terraform.",
      },
      {
        name: "GitHub Actions",
        note: "The deploy pipeline for this site: lint, typecheck, build, sync to S3, then invalidate the CloudFront cache. It authenticates to AWS over OIDC, so there are no stored access keys. The Flight Tracker had the same idea on GitLab CI: build and test on every change, before code review.",
        projects: ["flight-tracker"],
      },
      {
        name: "Node.js / React",
        note: "The Goal Planner's runtime under Next.js, and the Radius Signal platform, where the placement-offer module with DocuSign and the per-company intro video pipeline live.",
        projects: ["goal-planner"],
      },
      {
        name: "Java · Spring Boot",
        note: "The Flight Tracker backend: a Spring Boot REST service in front of the FlightAware and OpenSky APIs, with rate-limit handling so the UI gets a clear message rather than a failed request. Built with a six-person Scrum team where I was the primary developer.",
        projects: ["flight-tracker"],
      },
      { name: "Linux" },
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
