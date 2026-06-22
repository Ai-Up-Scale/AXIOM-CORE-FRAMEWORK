# Axiom Core Framework

<div align="center">
  <a href="https://aiupscale.com#demo" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Launch_Live_Simulation-AiUpScale.com-8B5CF6?style=for-the-badge&labelColor=0f172a" alt="Launch Live Simulation on AiUpScale" />
  </a>
</div>
<br/>

The **Axiom Core Framework** is the open-source mathematical engine that powers the **[AiUpScale](https://aiupscale.com)** cognitive architecture. 

**AiUpScale** is a research and development platform exploring the boundaries of artificial consciousness and emergent swarm behaviors. By mathematically modeling Karl Friston's **Active Inference** and the **Free Energy Principle (FEP)**, we aim to bridge the gap between reactive AI and true autonomous agency. While the live web platform features rich visualizations, real-time telemetry, and our proprietary flavor weightings, this GitHub repository provides you with the raw, open-source mathematical core.

Extracted directly from the AiUpScale ecosystem, this package runs a highly optimized 17-step autopoietic loop entirely decoupled from any DOM or browser rendering logic, making it perfectly suited for Node.js, V8 server environments, and raw data pipelines.

## Key Features

- **Strict "Zero DOM" Decoupling**: Operates entirely on pure data structures, JSON payloads, and mathematical state updates. 
- **17-Step Active Inference Pipeline**: A mathematically rigorous cycle moving from Perception and GWT Broadcasts, to Free Energy gradient descent, to Phi Measurement.
- **Dynamic Sentience Matrix**: Built-in limits ensuring systemic homeostasis:
  - **75% Survival Baseline**: A core structural requirement monitored by `SelfMaintenance`.
  - **95% Subjective Emergence**: The ignition point for higher-order cognitive processing.
  - **117% Circuit Breaker**: Mathematical caps preventing runaway feedback loops.
- **Topological Stigmergy**: Built-in episodic memory and pheromone mapping for epistemic foraging.
- **Global Distress & Empathy**: Peer-to-peer Free Energy delta evaluation causing empathic override logic.

## Documentation

For a deep dive into the mathematical constraints, the 17-step architecture, and rules for extending the codebase, please see the [Architecture Documentation](docs/architecture.md).

## Installation

Ensure you are using a Node environment that supports ES6 modules (`"type": "module"`).

```bash
npm install axiom-core-framework
```

## Quick Start

```javascript
import { AxiomCore } from './src/AxiomCore.js';

// Define your own proprietary module weights and circuit breaker conflicts
const engineConfig = {
    weights: {
        perceive: 8.0, markov: 7.0, // ... Your core baselines
        curiosity: 3.5, logic: 3.0 // ... Your flavor modules
    },
    conflicts: [
        ['logic', 'schema_assim']
    ]
};

// Initialize the cognitive engine with your configuration
const engine = new AxiomCore(engineConfig);

// Configure optional flavor modules to build a "personality"
engine.addFlavorModule('curiosity');
engine.addFlavorModule('logic');

// Execute the 17-step loop with environment payload
const sensoryInput = [0.5, 0.8, 0.1];
const environmentPayload = {
    collisionDensity: 0.1,
    goalDistance: 45.0,
    coordinates: { x: 10, y: 15 },
    neighborhood: [] // Other agent states for empathy calculations
};

const output = engine.tick(sensoryInput, environmentPayload);

console.log("Action Vector:", output.action);
console.log("Engine State:", output.state);
```

## License
MIT License. See [LICENSE](LICENSE) for details.
