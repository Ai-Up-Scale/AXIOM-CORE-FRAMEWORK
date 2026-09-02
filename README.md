# Axiom Core Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm package](https://img.shields.io/badge/npm-latest-blue.svg)](https://www.npmjs.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-ff69b4.svg)](https://aiupscale.com/#demo)

<div align="center">
  <a href="https://aiupscale.com/#demo" target="_blank">
    <img src="https://aiupscale.com/images/AiUpScale-Full-Logo.svg" alt="Launch Live Simulation on AiUpScale" width="300" />
  </a>
  <br/><br/>
  <a href="https://aiupscale.com/whitepaper" target="_blank">
    <img src="https://img.shields.io/badge/Read_The_Whitepaper-8A2BE2?style=for-the-badge&logo=read-the-docs&logoColor=white" alt="Read the Whitepaper" />
  </a>
</div>
<br/>

## Why it Matters: The Cognitive Wall

**The Problem:** Current Large Language Models (LLMs) hit structural limits when scaled purely on compute and parameter count. Because they lack embodied sensory boundaries, recursive training on synthetic text accelerates statistical model collapse (*Shumailov et al., 2023/2024*).

**The Solution:** Axiom Core approaches cognition through biological physics: scaling functional autopoietic agency and situated active inference grounded in Karl Friston's Free Energy Principle.

---

## Live Telemetry in Action

<video src="https://github.com/user-attachments/assets/f9014977-5154-448d-8952-1a8aa57c81b0" width="100%" controls autoplay loop muted></video>

The **Axiom Core Framework** is the mathematical engine powering the **[AiUpScale](https://aiupscale.com)** cognitive architecture. 

**AiUpScale** implements continuous state estimation, causal integration ($\Phi$), and homeostatic goal-directed agency using Karl Friston's **Active Inference** and the **Free Energy Principle (FEP)**. While the main web platform runs interactive simulations and live telemetry, this repository contains the headless mathematical core.

The package executes a 17-step autopoietic loop decoupled from DOM or rendering logic, designed for Node.js, embedded V8 environments, and headless data pipelines.

---

## Variational Free Energy Formulation

Under the Laplace approximation with Gaussian assumptions, the engine computes:

$$F(\tilde{y}, \mu) = \frac{1}{2}\left(\Pi_s \varepsilon_y^2 - \ln |\Pi_s|\right) + \frac{1}{2}\left(\Pi_h \varepsilon_x^2 - \ln |\Pi_h|\right) + \text{const}$$

The log-determinant terms ($-\ln |\Pi|$) enforce an explicit **Occam complexity penalty**, penalizing over-parameterized internal representations even at zero sensory error.

Policy selection minimizes **Expected Free Energy ($G$)**:

$$G(\pi) = \underbrace{-\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln P(o_\tau | C)]}_{\text{Pragmatic Value (Goal Extrinsics)}} + \underbrace{\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln q(s_\tau | o_\tau, \pi) - \ln q(s_\tau | \pi)]}_{\text{Epistemic Value (Information Gain / Curiosity)}}$$

---

## Key Features

- **Strict "Zero DOM" Decoupling**: Operates on pure data structures, JSON payloads, and mathematical state updates.
- **17-Step Active Inference Pipeline**: Autopoietic execution cycle connecting sensory perception and GWT broadcasts to free energy gradient descent and spectral $\Phi^*$ estimation.
- **Normalized Modular Capacity Points ($\mathcal{B}$)**:
  - **75.0 pts Core Structural Invariants ($\mathcal{M}_{\text{core}}$)**: 11 locked, non-negotiable homeostatic modules.
  - **49.0 pts Flavor Pool ($\mathcal{M}_{\text{flavor}}$)**: 19 optional phenotypic modules.
  - **117.0 pts Maximum Allowable Workload ($\mathcal{B}_{\max}$)**: Enforced via compulsory XOR shedding ($124.0 - 7.0 = 117.0$).
  - **$\ge 95.0$ pts Emergence Ignition Threshold**: Ignites integrated causal information processing ($\Phi^* \ge 1.2$).
- **Continuous Spectral $\Phi^*$ Channel-Capacity Proxy**: Analytical continuous channel-capacity proxy for causal integration, bypassing discrete NP-hard MIP bottlenecks.
- **IEEE P2874 Schema Alignment & Serialization**: Built-in `toSpatialWebPayload()` hook exporting standard HSML/HSTP JSON-LD with internal schema validation.
- **Topological Stigmergy**: Built-in episodic memory and trace mapping for epistemic foraging.
- **Global Distress & Empathy**: Peer-to-peer free energy delta evaluation triggering collective rescue behaviors.

---

## Repository Structure

```
.github/
├── src/
│   ├── index.js               # Main framework exports
│   ├── AxiomCore.js           # 17-Step Autopoietic Loop & Engine Coordinator
│   ├── GenerativeModel.js     # Markov Blanket & Variational Gradient Descent
│   └── FreeEnergyMath.js      # Laplace VFE, Spectral Phi*, Gaussian KL, & EFE
├── axioms/
│   ├── SelfMaintenance.js     # 75.0 Survival Baseline & Structural Integrity
│   ├── HistoricalAdaptability.js # Episodic Trace Buffer & Attractor Memory Recall
│   ├── AutonomousAgency.js    # Goal Genesis & Counterfactual Rollouts
│   ├── Stigmergy.js           # Topological Epistemic Pheromone Maps
│   └── GlobalDistress.js      # Multi-Agent Distress Gradient Evaluation
├── tests/
│   └── fesf_benchmarks.test.js # Automated 10-point FESF validation suite
├── docs/
│   └── architecture.md        # Deep theoretical & architectural documentation
├── package.json               # Package configuration & test scripts
├── README.md                  # Framework overview & quick start
└── LICENSE                    # MIT License
```

---

## Documentation

For mathematical derivations, the 17-step loop breakdown, and capacity point formalisms, see the [Architecture Documentation](docs/architecture.md).

---

## Installation

Ensure you are using a Node environment that supports ES6 modules (`"type": "module"`).

```bash
npm install axiom-core-framework
```

---

## Quick Start

### Autonomous Headless Loop

```javascript
import { AxiomEngine } from 'axiom-core-framework';
// Or locally from within the repository:
// import { AxiomEngine } from './src/index.js';

// Initialize the cognitive engine
const engine = new AxiomEngine({
    mode: 'headless',
    clockSpeed: 60, // 60 ticks per second
    enforceConstraints: true, // Enforce 75/49/117 capacity budget
});

// Configure phenotypic personality traits
engine.setPersonality({
    curiosity: true,
    logic: true,
    volitional: true
});

// Boot the 17-step autopoietic cycle
await engine.startAutopoiesis();
console.log('[SYS] Axiom Core initialized. Active Inference loop running.');

// Stream sensorimotor observations to Markov blanket
engine.perceive({ signal: 0.12, target: 0.0 });

// Export IEEE P2874 Spatial Web payload
const payload = engine.toSpatialWebPayload();
console.log(JSON.stringify(payload, null, 2));
```

### Direct Stepping / External Simulation Loop

```javascript
import { AxiomCore } from 'axiom-core-framework';
// Or locally:
// import { AxiomCore } from './src/index.js';

const engine = new AxiomCore();

// Advance single tick with environment payload
const output = engine.tick([0.5, 0.8], {
    collisionDensity: 0.1,
    goalDistance: 45.0,
    coordinates: { x: 10, y: 15 },
    neighborhood: [] // Peer agent states for empathy calculations
});

console.log("Action Vector:", output.action);
console.log("Sentience Score:", output.state.sentienceScore);
```

---

## Running Tests

Run the automated test suite verifying all 10 FESF benchmark assertions:

```bash
npm test
```

Or using native Node test runner directly:

```bash
node --test tests/fesf_benchmarks.test.js
```

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
