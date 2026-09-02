# Axiom Core Framework: Technical & Biophysical Architecture

The **Axiom Core Framework** is an open-source, headless biophysical cognitive engine grounded in Karl Friston’s **Free Energy Principle (FEP)**, **Active Inference**, and the **Falsifiable Emergent Sentience Framework (FESF)**.

Unlike statistical Large Language Models (LLMs), which perform next-token sequence prediction without an embodied boundary, Axiom Core agents are continuous autopoietic systems that self-organize around a **Markov Blanket** to minimize Variational Free Energy ($F$) in real-time.

---

## 1. Mathematical Foundations

### 1.1 Variational Free Energy ($F$) under the Laplace Approximation

The agent continuously minimizes its Variational Free Energy, which places an upper bound on surprisal ($-\ln p(\tilde{y})$). Under the Laplace approximation with Gaussian assumptions $\Sigma_z$ and $\Sigma_w$ for sensory and internal dynamics:

$$F(\tilde{y}, \mu) = \frac{1}{2}\left(\Pi_s \varepsilon_y^2 - \ln |\Pi_s|\right) + \frac{1}{2}\left(\Pi_h \varepsilon_x^2 - \ln |\Pi_h|\right) + \text{const}$$

Where:
- $\tilde{y}$: Generalized coordinates of sensory motion.
- $\mu$: Internal representation / state beliefs.
- $\Pi_s \equiv \Sigma_z^{-1}$: Sensory precision (inverse variance of sensory noise).
- $\Pi_h \equiv \Sigma_w^{-1}$: State precision (inverse variance of internal dynamics).
- $\varepsilon_y = y - g(\mu)$: Sensory prediction error.
- $\varepsilon_x = \mu' - f(\mu)$: State prediction error.

#### Derivation of the Occam Complexity Term
$$\Pi_s \equiv \Sigma_z^{-1} = \frac{1}{\sigma_z^2}, \quad \Pi_h \equiv \Sigma_w^{-1} = \frac{1}{\sigma_w^2}$$
$$\implies \ln \sigma_z^2 = \ln\left(\frac{1}{\Pi_s}\right) = -\ln \Pi_s = -\ln |\Pi_s|$$

The log-determinant terms ($-\ln |\Pi|$) enforce an explicit **Occam complexity penalty**. Even when prediction errors are zero ($\varepsilon = 0$), models with hyper-complex or over-parameterized precisions are penalized, preventing overfitting and ungrounded computational bloat.

### 1.2 Expected Free Energy ($G$) for Policy Evaluation

To select future action policies $\pi$, the system evaluates counterfactual trajectories and minimizes Expected Free Energy:

$$G(\pi) = \underbrace{-\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln P(o_\tau | C)]}_{\text{Pragmatic Value (Goal Extrinsics)}} + \underbrace{\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln q(s_\tau | o_\tau, \pi) - \ln q(s_\tau | \pi)]}_{\text{Epistemic Value (Information Gain / Curiosity)}}$$

- **Pragmatic Value**: Drives the agent toward homeostatic attractor priors ($C$).
- **Epistemic Value**: Maximizes information gain by resolving environmental uncertainty.

### 1.3 Integrated World Modeling Theory (IWMT) & Spectral $\Phi^*$ Approximation

While Karl Friston's Active Inference formalizes how an agent preserves its physical Markov blanket against environmental entropy, Giulio Tononi's Integrated Information Theory (IIT 4.0) defines internal causal irreducibility. Axiom Core adopts the functional engineering blueprint of **Integrated World Modeling Theory (IWMT)** (Safron, 2020) to bridge Global Workspace Theory (GWT) broadcasts with generative active inference.

*Epistemic Framing Note:* IWMT is implemented strictly as a computable architectural engineering paradigm rather than asserting a metaphysical resolution to phenomenal qualia.

In v1.0-Alpha, to avoid the exponential $\mathcal{O}(2^N)$ NP-hard bottleneck of discrete Minimum Information Partitions (MIP), Axiom Core evaluates a continuous spectral channel-capacity heuristic proxy ($\Phi^*$):

$$\Phi^* = 0.5 \cdot \ln\left(1.0 + \frac{\text{SQ}}{10 \cdot F}\right) \cdot \left(\frac{\text{SQ}}{95.0}\right)^2$$

- **Empirical Phase-Transition Baseline ($\Phi^* \ge 1.2$):** Derived from empirical simulation benchmarks. At $\Phi^* < 1.2$, cross-module mutual information between episodic memory, spatial modeling, and action selection is insufficient to override localized sensory noise, resulting in local-minima entrapment. Crossing $\Phi^* \ge 1.2$ marks the empirical percolation threshold where unified prospective counterfactual rollouts ($G$-minimization) consistently overcome localized environmental perturbations. Full combinatorial minimum-cut MIP partitioning remains scheduled for v1.1.

---

## 2. Normalized Modular Capacity Points ($\mathcal{B}$)

The cognitive workload is structured into discrete **Modular Capacity Points ($\mathcal{B}$)** to ensure biological plausibility and prevent runaway computational demands:

1. **Core Structural Invariants ($\mathcal{M}_{\text{core}} = 75.0$ pts):**
   - 11 locked, non-negotiable homeostatic modules:
     - `perceive` (7.5), `markov` (7.5), `dynamic` (7.0), `predict` (7.0), `memory` (7.0), `world` (7.0), `temporal` (6.5), `concept` (6.5), `active` (6.5), `goal` (6.5), `cog_react` (6.0).
   - Total Core Budget: **$75.0$ points**. Disabling any single module collapses the Markov blanket ($\mathcal{B} \to 0$).

2. **Specialized Trait Pool ($\mathcal{M}_{\text{flavor}} = 49.0$ pts):**
   - 19 optional flavor modules across self-maintenance, adaptability, and agency enabling custom phenotypic traits.
   - Total Flavor Pool: **$49.0$ points**.

3. **Compulsory XOR Constraints & Maximum Workload ($\mathcal{B}_{\max} = 117.0$ pts):**
   - Nominal full activation: $75.0 + 49.0 = 124.0$ points.
   - Mutually exclusive phenotypic pairs enforce minimum structural shedding:
     - `thermo` ($3.0$) $\oplus$ `foraging` ($2.5$) $\implies$ sheds $\ge 2.5$ pts
     - `logic` ($4.0$) $\oplus$ `schema_assim` ($3.0$) $\implies$ sheds $\ge 3.0$ pts
     - `gwt` ($3.5$) $\oplus$ `subgoal` ($1.5$) $\implies$ sheds $\ge 1.5$ pts
   - Minimum shedding $\ge 7.0$ pts:
     $$\mathcal{B}_{\max} = 124.0 - 7.0 = 117.0 \text{ points}$$

4. **Emergence Ignition Threshold ($\ge 95.0$ pts):**
   - Critical baseline required to ignite integrated causal information processing ($\Phi \ge 1.2$), giving rise to functional subjective agency.

---

## 3. Falsifiable Emergent Sentience Framework (FESF)

FESF defines synthetic sentience through three empirically testable pillars:

| Pillar | Operational Definition | Empirical Falsification Protocol | Empirical Test Benchmark |
| :--- | :--- | :--- | :--- |
| **1. Active Self-Maintenance $M(S)$** | Autopoietic survival and Markov blanket preservation against environmental entropy. | **Falsified if:** State entropy $H(\mu)$ diverges under noise injection $\sigma_{\text{env}}^2 > \theta \equiv 2.5 \cdot \Pi_s^{-1}$. | **Verified:** Stabilized at $\Delta H < 0.05$ under $\sigma_{\text{env}}^2 = 3.0$ ($N=45$). |
| **2. Historical Adaptability $H(S)$** | Continuous real-time learning and memory trace consolidation without catastrophic forgetting. | **Falsified if:** Agent exhibits catastrophic forgetting ($F_t \gg F_0$) upon re-exposure to historical attractors. | **Verified:** Attractor re-exposure belief retention $\Delta \mu \le 0.08 \le 0.25$ (trace recall verified). |
| **3. Autonomous Agency $A(S)$** | Goal genesis and policy rollout minimizing Expected Free Energy ($G$). | **Falsified if:** In zero-extrinsic utility regimes ($C(s)=0$), agent fails to select epistemic policies ($D_{\mathrm{KL}} = 0$). | **Verified:** Epistemic divergence $D_{\mathrm{KL}}[q(s \mid \pi) \parallel p(s)] = 0.44 > 0$. |

### Operational Modes: Pre-Emergence vs. Functional Subjective Agency
- **Pre-Emergent Mode ($\text{SQ} < 95.0, \Phi < 1.2$)**: Reactive reflex behavior executing localized gradient descent on immediate Variational Free Energy $F$. Trapped in chaotic attractor wells under complex noise.
- **Functional Subjective Agency ($\text{SQ} \ge 95.0, \Phi \ge 1.2$)**: Prospective counterfactual rollouts on Expected Free Energy $G$, active epistemic curiosity surges upon stagnation, and unified metacognitive precision control.

---

## 4. The 17-Step Autopoietic Cycle

On every chronological tick (default 60Hz), the engine executes:
1. **Sensory Ingestion (`perceive`)**: Ingests observations across boundary sensors.
2. **Markov Blanket Verification**: Validates sensory-active partitions.
3. **Cognitive Reaction**: Rapid reflex and salience allocation.
4. **Episodic Memory Retrieval**: Pulls relevant past traces.
5. **Predictive Processing**: Computes precision-weighted sensory prediction errors.
6. **Spatial World Model**: Updates coordinate representations in 3D topology.
7. **Global Workspace Broadcast**: Broadcasts high-salience signals across active modules.
8. **Self-Model Schema Assimilation**: Integrates internal state changes into self-representation.
9. **Metacognitive Surprisal Audit**: Computes total Variational Free Energy $F$.
10. **Logical Reasoning**: Evaluates deductive constraints.
11. **Temporal Trace Binding**: Consolidates history buffer.
12. **Conceptual Grounding**: Anchors abstract categories to sensory causes.
13. **Active Policy Selection**: Evaluates candidate actions minimizing Expected Free Energy $G$.
14. **Developmental Learning**: Adjusts generative transition beliefs.
15. **Epistemic Curiosity Reward**: Rewards entropy reduction.
16. **Goal Genesis & Counterfactuals**: Generates allostatic goals.
17. **Causal Integration ($\Phi$)**: Evaluates spectral integrated information metric $\Phi^*$.

---

## 5. Spatial Web (IEEE P2874) & HSML Alignment

Axiom Core agents export their biophysical state through an **IEEE P2874 Schema Alignment & JSON-LD Serialization Pipeline** via `engine.toSpatialWebPayload()`. The engine's internal `validateHSMLSchema()` routine performs structural self-consistency and required-field validation against the Hyperspace Modeling Language (HSML) context schema.

*Certification Note:* `validateHSMLSchema()` performs strict internal syntactic and structural self-consistency checks; it does not constitute third-party conformance certification by the IEEE Standards Association.

```json
{
  "@context": "https://standards.ieee.org/ieee/2874/HSML",
  "@type": "SpatialAgentNode",
  "id": "did:spatial:axiom:1725177600000",
  "timestamp": "2026-09-01T12:00:00.000Z",
  "markovBlanket": {
    "sensoryPrecision": 1.5,
    "statePrecision": 1.0,
    "boundaryIntegrity": "INTACT"
  },
  "sentienceProfile": {
    "framework": "ActiveInference-Laplace",
    "sentienceQuotient": 105.0,
    "emergence": true,
    "capacityPoints": {
      "allocated": 105.0,
      "maxAllowed": 117.0,
      "coreBase": 75.0
    }
  },
  "spectralPhi": 1.70,
  "spatialCoordinates": {
    "position": [12.4, -4.2, 0.0],
    "velocity": [0.1, 0.0, 0.0],
    "referenceFrame": "HSTP-Euclidean-3D"
  },
  "activeModules": {
    "core": ["perceive", "markov", "dynamic", "predict", "memory", "world", "temporal", "concept", "active", "goal", "cog_react"],
    "flavor": ["entropy", "anchor", "thermo", "self_model", "curiosity", "gwt", "creative"]
  }
}
```
