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
  /**
   * External URL, or a site-relative path like "/assets/report.pdf". A
   * relative one is checked at build time and dropped if the file isn't in
   * public/ yet, so a link can be written before its file is added.
   */
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
   * Screenshot path under /public, e.g. "/assets/flex-pga-demo.jpg". Omit it
   * and the card draws a schematic-style placeholder instead; the project
   * page just skips the banner.
   */
  image?: string;
  links: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: "flex-pga",
    name: "Flex-PGA: On-Device Workout Classification",
    designator: "M1",
    year: "2026",
    role: "Team of 5 · ECE 554 capstone",
    featured: true,
    summary:
      "Real-time exercise recognition and rep counting from a live camera on a Zynq UltraScale+ FPGA: pose estimation on the ARM cores, a quantized neural-network classifier in the fabric. No cloud, no GPU, no video leaving the board.",
    body: [
      "Consumer fitness apps either run vision on a phone CPU, where throttling and OS scheduling drop frames and miss reps, or stream video of your home to a server, adding latency and creating a permanent record of a private activity. Doing inference on-device fixes both: latency is bounded by hardware, and only 34 bytes of skeleton coordinates ever cross a bus.",
      "A USB camera feeds frames to Google's pretrained MoveNet pose model running on the Zynq's ARM Cortex-A53 cores, reducing each frame to 17 body keypoints. The 34 (y, x) values are written over AXI-Lite into a custom FPGA peripheral that holds a 34→128→64→3 multilayer perceptron with int8 weights in on-chip BRAM. A hand-written SystemVerilog state machine drives a single DSP48E2 multiply-accumulate through the network and returns a class: push-up, squat, curl, or no pose. The ARM side overlays the skeleton, class, confidence, rep tally, and frame rate on a DisplayPort output.",
      "Three decisions shaped the design. Using a pretrained pose model instead of an end-to-end CNN reduces a frame from hundreds of thousands of pixels to 34 numbers, which makes the classifier small enough to live in fabric. Int8 post-training quantization puts all 12,931 weights and biases in a single BRAM (1.6% of the device), maps each multiply onto one DSP48E2, and turns ReLU into a sign check on the accumulator. And one sequential MAC is enough: at about 1 ms per inference against a 100 ms frame budget, there was no reason to spend area on parallelism, so the classifier uses 0.28% of the device's DSPs and roughly 3% of its logic.",
      "Pose estimation was originally designed to run in fabric on a Xilinx DPUCZDX8G. That build routed and closed timing (WNS +14.1 ns at 96.97 MHz), but occupied 99.98% of the CLBs and 95% of the DSPs, leaving no room for anything else and costing hours per synthesis iteration. The team moved pose estimation to the ARM cores and gave the fabric the workload it fit. The routed Vivado reports for both outcomes are preserved in the repo.",
      "Results from the final report: 10 FPS throughput (target 15), 90% classification accuracy (target above 85%), 3 W power (target under 5 W), and 15% rep-counting error (target under 5%). The system was bounded by pose estimation on the ARM cores; the fabric classifier used about 1% of the per-frame budget.",
      "My part: camera bring-up (a MIPI PCam that pivoted to USB/UVC) and the PS-side camera → shared-memory → DPU/VART inference pipeline used during the DPU integration attempt. After the capstone I authored the repository as a portfolio record: the README, architecture and register-map docs, a reconstructed MoveNet stage, and source-level fixes to the PS/PL interface.",
    ],
    tags: ["SystemVerilog", "Vivado", "AXI4-Lite", "Zynq UltraScale+", "PYNQ", "Python", "OpenCV", "TFLite", "Vitis AI"],
    image: "/assets/flex-pga-demo.jpg",
    links: [
      { label: "Source", href: "https://github.com/hargens-holland/WorkoutClassificationTracker" },
      // Local files only show once they exist in public/ — see the note on ProjectLink.
      { label: "Final report", href: "/assets/flex-pga-final-report.pdf" },
      { label: "Poster", href: "/assets/flex-pga-poster.pdf" },
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
    slug: "psoc6-blackjack",
    name: "PSoC6 Blackjack",
    designator: "M3",
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
    designator: "M4",
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
