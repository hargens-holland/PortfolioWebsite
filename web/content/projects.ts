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
  /**
   * Course projects without a screenshot don't get a card. Set this and the
   * project is listed compactly under "More projects" on the homepage,
   * collapsed until a visitor opens it. It still gets its own page.
   */
  compact?: boolean;
  /**
   * Why there's no Source link, e.g. "The repository is private because it's
   * a course project." Shown on the project page in place of the generic
   * "not public yet" note when `links` is empty.
   */
  sourceNote?: string;
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
    name: "PSoC 6 Blackjack",
    designator: "M3",
    year: "2025",
    role: "With Ryan O'Sullivan · ECE 353",
    summary:
      "Blackjack on an Infineon PSoC 6 dev board, architected as 13 cooperating FreeRTOS tasks instead of a superloop: one task per game state, one gatekeeper task per peripheral, and all communication through task notifications, an event group, queues, and a semaphore.",
    body: [
      "A complete game of Blackjack running on a PSoC 6 microcontroller with an LCD, joystick, push buttons, SPI EEPROM, and an I2C IO expander, built with Ryan O'Sullivan for ECE 353 at UW–Madison in spring 2025. The interesting part isn't the card game; it's how the firmware is organized. Rather than a single main loop polling everything, the application is a set of FreeRTOS tasks that only talk to each other through RTOS primitives.",
      "One task per game state. Start, Shuffle, Bet, Dealer Show, Player Hit, Dealer Hit, and Hand Complete are each a task blocked on ulTaskNotifyTake(). A state transition is a single xTaskNotifyGive() to the next state's handle: no dispatcher, no state enum, and exactly one FSM task runnable at any time.",
      "Gatekeeper tasks own the hardware. The LCD, SPI EEPROM, I2C IO expander, and UART console each have one task that is the only code allowed to touch that bus. Game logic sends commands through queues, which removes bus-reentrancy races entirely. EEPROM reads carry the caller's own reply-queue handle in the request message, so multiple states can share the EEPROM task without clobbering each other's answer.",
      "Input fans in through an event group. Debounced button and joystick tasks run at a higher priority than the FSM, so input is never missed while a state is drawing. They set bits in a shared event group, and each state waits on just the subset of inputs it cares about. The IO-expander button arrives in interrupt context via xEventGroupSetBitsFromISR.",
      "A binary semaphore guards the shared game struct: deck, both hands, funds, and bet. The hardware TRNG drives a Fisher–Yates shuffle so every power-up deals a different game. Logging is non-blocking: task_print() formats into a heap buffer and queues it to the console task, so any task can log safely.",
      "Driver work underneath: ADC joystick, GPIO push buttons with software debounce, SPI EEPROM for a persistent high score, a TCA9534 I2C IO expander driving an LED win-streak display and an interrupt-driven button, parallel-bus LCD rendering of cards and stats, and a UART console with colour-coded state logging.",
      "What we built versus what was provided: the course supplied header skeletons, the LCD and font bitmaps, and the board support package. Ryan and I wrote the seven FSM state tasks, the gatekeeper task bodies (screen command handling, EEPROM read/write with reply routing, debouncing, joystick edge detection, IO-expander ISR hookup), the game model (deck, hands, scoring, screen layout), and the driver implementations for the joystick, buttons, SPI, I2C, IO expander, console, and remote UART.",
    ],
    tags: ["C", "FreeRTOS", "Cortex-M4", "PSoC 6", "ModusToolbox", "SPI", "I2C", "ADC", "UART"],
    links: [],
    compact: true,
    sourceNote: "The repository is private because it's a course project.",
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
      // The repo is private while it's under active work; restore when it's public.
      // { label: "Source", href: "https://github.com/hargens-holland/GoalApp" },
      // Deploy is pending. Add when it's up:
      // { label: "Live demo", href: "https://…" },
      // { label: "Architecture", href: "https://github.com/hargens-holland/GoalApp/blob/main/docs/ARCHITECTURE.md" },
    ],
    sourceNote: "The repository is private while I'm still actively working on it.",
  },
  {
    slug: "ebike-controller",
    name: "eBike Motor-Assist Controller",
    designator: "M5",
    year: "2025",
    role: "Team of 3 · ECE 551 final project",
    summary:
      "A pedal-assist controller for an electric bike in SystemVerilog, synthesized to a 32 nm standard-cell library at a 2.5 ns clock: sensor conditioning over SPI, a hardware PID loop, six-step hall-sensor commutation with dead-time PWM gate drive, and UART telemetry. 20 modules, verified closed-loop against physics models.",
    body: [
      "A complete pedal-assist controller for an electric bike, built with two teammates for ECE 551 (Digital System Design and Synthesis) at UW–Madison in spring 2025. The design reads rider torque, pedal cadence, battery voltage, brake position, and hill incline; computes a target motor current from a configurable assist level; closes the loop with a hardware PID controller; and drives a brushless DC hub motor through six-step hall-sensor commutation with non-overlapping PWM gate signals. Measured values stream out over UART for telemetry.",
      "The signal path: an ADC interface round-robins four channels over a 16-bit SPI master shared with the inertial sensor, whose gyro rate is integrated with accelerometer correction into a 13-bit incline. Sensor conditioning exponentially averages torque and motor current, measures cadence from a debounced pulse, and gates the PID error to zero when the battery is low or the rider stops pedaling. The desired-drive block computes target current as (torque minus a minimum) times cadence factor times incline factor times assist scale, through a pipelined multiplier.",
      "The control and drive side: a PID running at 48 Hz through a decimator, with a saturating 18-bit integrator, a derivative taken against a three-sample-delayed error, and a 12-bit clamped output. The commutation block maps the three hall sensors to a six-step state, sets each coil to forward, reverse, or high-Z, and switches to regenerative braking when the brake is pulled. An 11-bit PWM feeds three non-overlap blocks that insert 32 clocks of dead time whenever a gate pair changes, so a high-side and low-side switch can never conduct at once. A push button cycles the assist level and shows it on two LEDs.",
      "Synthesis with Synopsys Design Compiler to the SAED 32 nm LVT library at a 2.5 ns clock, with hierarchy flattened and hold fixed. The baseline flow came in at 13,406 µm² and 3,742 cells with setup and hold both met at zero slack. An area-driven experiment with compile_ultra -retime cut cell area 18% to 10,991 µm² and still met setup, but left one hold path 80 ps short even with hold fixing, so the baseline netlist was the one submitted.",
      "Verification is in QuestaSim. Full-system testbenches close the loop through course-provided physics models: an ADC SPI slave, an IMU slave whose accelerometer follows the commanded yaw rate, and a hub-wheel model that turns the six gate-drive outputs into coil voltages, wheel speed, hall edges, and motor current. A FAST_SIM parameter shortens the 48 Hz decimator and the one-third-second cadence timeout to a simulation-friendly number of clocks. One bench sweeps torque, incline, battery, brake, and assist mode while the loop settles between steps; another checks that the PID error converges after every stimulus change and stops on failure; a third runs the same stimulus against the gate-level netlist. Unit benches cover the SPI master, ADC interface, PID against a plant model, cadence filter, incline saturation, sensor conditioning, and telemetry.",
      "What we wrote versus what was provided: all of the RTL except the course-provided UART transmitter, cadence lookup table, and inertial integrator; every testbench and the shared testbench utilities; both synthesis scripts; and an IMU bring-up top for the DE0-Nano FPGA. The course supplied the physics models, the top-level port list, and the Quartus pin assignments.",
    ],
    tags: ["SystemVerilog", "Synopsys DC", "SAED 32 nm", "QuestaSim", "SPI", "PID", "PWM", "UART", "Quartus"],
    links: [],
    compact: true,
    sourceNote: "The repository is private because it's a course project.",
  },
  {
    slug: "risc-cpu",
    name: "16-bit Pipelined RISC CPU with Caches",
    designator: "M6",
    year: "2025",
    role: "Team of 3 · ECE 552",
    summary:
      "A 5-stage pipelined 16-bit RISC processor in structural Verilog with hazard detection, data forwarding, and branch flushing, backed by 2-way set-associative instruction and data caches, a cache-fill FSM, and a memory arbiter in front of a 4-cycle main memory. Four assembled test programs pass in cycle-level simulation.",
    body: [
      "A 16-bit RISC processor designed and verified in structural Verilog with Thomas and Ashton for ECE 552 (Computer Architecture) at UW–Madison. It implements a 16-instruction custom ISA with N, V, and Z flags and eight branch conditions. All three of us worked across every part of the design rather than splitting it into silos.",
      "The core is a classic IF/ID/EX/MEM/WB pipeline. The hazard unit detects load-use and branch-source stalls, MEM and WB results forward back to EX with a byte-merge so partial-register writes forward correctly, and branches resolve in ID with a flag bypass so a taken branch flushes a single instruction.",
      "Behind it sits a memory hierarchy: separate 2 KB two-way set-associative instruction and data caches, each 64 sets of 16-byte blocks with LRU replacement, a write-through data cache, a fill FSM that streams 8-word blocks from a 4-cycle-latency main memory, and an arbiter that gives the data cache priority when both miss at once.",
      "The datapath includes a 16-bit carry-lookahead adder, saturating ADD and SUB, a four-lane packed saturating add (PADDSB), a byte-reduction tree (RED), and a logarithmic shifter for SLL, SRA, and ROR, plus a bit-cell register file with byte-granular writes.",
      "Everything is structural Verilog: every register is built from a dff primitive, and a Design Compiler script targets a 2.5 ns clock in a 32 nm library. Verification ran four assembled test programs, including a self-checking memory-copy loop, and all four pass with cycle-level simulation traces.",
    ],
    tags: ["Verilog", "Computer Architecture", "Pipelining", "Caches", "ModelSim", "Synopsys DC", "RTL Design"],
    links: [],
    compact: true,
    sourceNote: "The repository is private because it's a course project.",
  },
];

export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
/** Card-sized projects below the featured one. */
export const otherProjects = () => PROJECTS.filter((p) => p !== featuredProject() && !p.compact);
/** The collapsed "More projects" list. */
export const compactProjects = () => PROJECTS.filter((p) => p.compact && p !== featuredProject());
export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
