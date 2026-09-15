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
  /**
   * Screenshot path under /public, e.g. "/assets/dpu-bringup.png". Omit it
   * and the card draws a schematic-style placeholder instead; the project
   * page just skips the banner.
   */
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
      "Brought up Xilinx's DPU inference engine on an AUP-ZU3 board: integrated the IP in Vivado, sized it to fit the part, and closed timing so PYNQ can run models on the programmable logic.",
    body: [
      "The AUP-ZU3 is a small ZynqMP board, and Xilinx's DPUCZDX8G IP wasn't sized with it in mind. The goal was PYNQ-DPU inference running on the programmable logic: integrate the IP in Vivado, get the processing system and the fabric cooperating over AXI, and boot into PYNQ with a working overlay.",
      "Most of the work came after the first successful build. The ZU3 doesn't have the resources for a full-size DPU, so it came down to tradeoffs: scaling down to a B512 configuration to fit, and dropping the PL1 clock to 200 MHz to close timing — reading the timing reports and adjusting the configuration until the design closed.",
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
      "Trained a seizure classifier on EEG recordings in PyTorch, then packaged it for deployment: a FastAPI inference endpoint, a Docker container, and documented setup.",
    body: [
      "A seizure classifier trained on EEG recordings in PyTorch. The model is half the project; the other half is making it usable by someone who isn't me.",
      "So it ships as a service: a FastAPI endpoint that takes a recording and returns a prediction, a Docker container so it runs the same on a laptop as on a server, and setup documentation that gets a new machine from clone to first inference without guesswork.",
    ],
    tags: ["PyTorch", "FastAPI", "Docker", "Python"],
    links: [
      // { label: "Source", href: "https://github.com/hargens-holland/eeg-seizure" },
      // { label: "API", href: "https://eeg-api.example.com" },
    ],
  },
  {
    slug: "workout-detection-fpga",
    name: "On-Device Workout Detection",
    designator: "M3",
    year: "2026",
    role: "ECE 554 capstone · Zynq + ML",
    summary:
      "A fitness tracker that classifies six exercises on a Xilinx Zynq — camera in, MLP inference in the fabric, result on an LCD — at ~90% accuracy and under 15 ms per inference.",
    body: [
      "The Flex-PGA senior capstone: a workout tracker that recognizes which exercise you're doing without sending anything off the board. A camera module feeds the signal pipeline, a multi-layer perceptron classifies it, and the result lands on an LCD.",
      "My part was the boundary between the two halves of the Zynq: the PS↔PL interface that moves data between the ARM core and the FPGA fabric fast enough for inference to feel instant. The full path, acquisition to display, was validated end to end under real operating conditions rather than on a bench signal.",
      "Trained on five test subjects across six exercises, the model holds around 90% accuracy with inference under 15 ms, fully on-device.",
    ],
    tags: ["Xilinx Zynq", "Verilog", "PS↔PL", "Python", "MLP"],
    links: [],
  },
  {
    slug: "psoc6-blackjack",
    name: "PSoC6 Blackjack",
    designator: "M4",
    year: "2025",
    role: "Solo · bare-metal C",
    summary:
      "A complete Blackjack game in embedded C on a PSoC6 Cortex-M4: interrupt-driven buttons with debounce, an SPI-driven LCD, and four peripherals sharing one interrupt scheme.",
    body: [
      "Blackjack, written bare-metal in C for a PSoC6 board with an ARM Cortex-M4 core. No RTOS: hardware timers, GPIO button handling, and interrupt-driven input with software debounce, all managed directly.",
      "The display is an LCD driven over SPI. Rendering six game states within the timing budget meant being deliberate about which parts of the frame actually changed between updates.",
      "Four peripherals share the interrupt logic, so most of the work was in the state machine: making sure every transition between game states was correct across every scenario the rules allow, and proving it.",
    ],
    tags: ["C", "Cortex-M4", "PSoC6", "SPI", "I2C", "UART", "GPIO"],
    links: [],
  },
  {
    slug: "goal-planner",
    name: "Goal Planner",
    designator: "M5",
    year: "2025",
    role: "Solo · full-stack + LLM",
    summary:
      "A full-stack Next.js + MySQL planner that regenerates each week's plan from what you actually finished last week, using the Anthropic API. Dockerized and deployed on AWS.",
    body: [
      "A goal-planning app built as a full-stack TypeScript project: Next.js on the front, Node.js and MySQL behind it, all containerized with Docker so staging and production run the same image.",
      "The interesting part is the weekly loop. Instead of a static plan, the app pulls the previous week's task completions and asks the Anthropic API to generate the coming week around what actually got done, so the plan adapts to reality instead of repeating itself.",
      "Deployed on AWS — EC2 for the app, RDS for MySQL, S3 for storage — from the same Docker image used in staging.",
    ],
    tags: ["TypeScript", "Next.js", "Node.js", "MySQL", "Docker", "AWS", "Anthropic API"],
    links: [],
  },
];

export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
export const otherProjects = () => PROJECTS.filter((p) => p !== featuredProject());
export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
