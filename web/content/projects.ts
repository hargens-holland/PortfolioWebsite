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
      "My part: camera bring-up (a MIPI PCam that pivoted to USB/UVC) and the PS-side camera → shared-memory → DPU/VART inference pipeline used during the DPU integration attempt.",
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
    role: "ECE 539 team project · 2D CNN + evaluation",
    summary:
      "Seizure detection from raw EEG with 1D and 2D CNNs. The first run hit 99.6% accuracy and caught zero seizures, so the project became a study of evaluating under severe imbalance: sensitivity over accuracy, leak-free recording-level splits, and a false-alarm budget. Rerun in progress.",
    body: [
      "Seizure detection from raw 23-channel scalp EEG in the CHB-MIT database, for ECE 539 (Neural Networks) at UW–Madison. An end-to-end pipeline runs from EDF ingestion through annotation-based labels and feeds five models identical 4-second windows: three classical baselines, a 1D CNN on the raw signal, and a 2D CNN on STFT spectrograms.",
      "In the first run, every model scored over 99.6% accuracy while catching zero seizures, because seizures make up under 5% of a recording. Sensitivity exposed the problem, and AUC suggested the CNNs had learned to rank seizure windows above background. At the time, the conclusion was that the failure was the decision threshold, not the model.",
      "Revisiting the project later, I found two deeper problems. A labeling bug was under-counting seizure windows by about 10×. And the random window split let overlapping windows share signal across train and test, which inflated AUC to 0.98–0.999. Together they mean every number from that first run, the 99.6% included, has to be redone.",
      "The rebuilt evaluation uses recording-level splits, so no recording contributes to both sides, and thresholds chosen on validation data against a false-alarm budget rather than the default 0.5. That's the operating point a clinician would actually care about: how many seizures are caught at how many false alarms per hour. The rerun on that protocol is in progress; results will go here when it's done.",
      "My part: the 2D CNN and its spectrogram pipeline, the evaluation protocol, and the two bug fixes.",
    ],
    tags: ["Python", "PyTorch", "MNE", "scikit-learn", "STFT", "CHB-MIT"],
    image: "/assets/eeg-seizure-traces.jpg",
    links: [
      // { label: "Source", href: "https://github.com/hargens-holland/…" },
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
    role: "Solo · LLM agents",
    summary:
      "Three Claude agents turn a stated goal into a milestone roadmap and place the week's work into the hours you're actually free. Structured outputs, typed fallbacks, per-call telemetry, and an eval harness with an LLM judge that decides which model each agent runs on. 124 tests.",
    body: [
      "Type a goal in plain language and three Claude agents each do one job. The Architect builds a milestone roadmap. Progress reviews your week and adjusts where you are. The Scheduler places tasks into your available hours across every active goal. Structured outputs constrain every model call to a Zod schema, every agent has a deterministic fallback with typed failure reasons, and every plan is recorded as model- or fallback-generated, so the app keeps working when the model doesn't.",
      "I built the measurement layer before anything else. Every call writes one row: model, source, reason, attempts, tokens in and out, latency, estimated cost. It's fire-and-forget and swallows its own errors, so it can never affect the call it describes. A usage page aggregates thirty days: cost per day, p50 and p95 per agent, fallback rate, and why calls fell back. Without that, a fallback and a real model response produce identical-looking rows and you're blind.",
      "An eval harness runs 24 goals across 13 domains, plus two injection cases and one deliberately vague goal, through the real Architect: nine deterministic checks scored separately, then an Opus judge grading four properties on a written 1–5 rubric with the candidate delimited as untrusted and the judge told not to reward length. Result: Opus 5 scores 4.67 against Sonnet 5's 4.27, a paired difference of +0.39 ± 0.17 over 22 goals, at 2.6× the cost and 1.7× the latency. That's why the Architect runs on Opus and the cheaper agents on Sonnet. The caveat is stated in the doc: the judge is Opus.",
      "The tooling found six bugs none of the tests could see. The schema said a milestone's week was when it was targeted, so the model read it as due and the app read it as start, and every model-generated roadmap failed ordering. \"By end of year\" produced 24-week plans against a 16-week deadline because the model has no clock. A replan that returned generic titles turned out to be a 39-second fallback with zero tokens: Opus 5 and Sonnet 5 think by default, thinking counts against max_tokens, and the SDK surfaces truncation as a parse error rather than a stop reason, so the retry never fired.",
      "The routes are hardened the way a public model endpoint has to be. Every request body has a Zod schema with a maximum on every string that reaches a prompt, which is a cost ceiling as much as input validation. Model routes are rate-limited per user with atomic fixed windows in Postgres, and signup per IP. Everything the user wrote goes inside delimiters, closing-tag attempts are stripped, and every system prompt says to treat it as data; both eval injection cases are resisted by both models. 124 tests run in CI.",
    ],
    tags: [
      "Anthropic SDK", "TypeScript", "Next.js", "Prisma", "Zod",
      "Evals", "LLM-as-judge", "Observability", "Rate limiting", "Prompt injection", "Prompt caching",
    ],
    image: "/assets/goal-planner-dashboard-2.png",
    links: [
      { label: "Source", href: "https://github.com/hargens-holland/GoalApp" },
      // Deploy is pending. Add when it's up:
      // { label: "Live demo", href: "https://…" },
      // { label: "Architecture", href: "https://github.com/hargens-holland/GoalApp/blob/main/docs/ARCHITECTURE.md" },
    ],
  },
];

export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
export const otherProjects = () => PROJECTS.filter((p) => p !== featuredProject());
export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
