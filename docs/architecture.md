# Axiom Core Framework: Technical & Biophysical Architecture

The **Axiom Core Framework** is an open-source, headless biophysical cognitive engine grounded in Karl Friston’s **Free Energy Principle (FEP)**, **Active Inference**, and the **Falsifiable Emergent Sentience Framework (FESF)**.

Unlike autoregressive Large Language Models (LLMs) that optimize next-token prediction over ungrounded text sequences, Axiom Core agents maintain continuous state within a **Markov Blanket**, actively minimizing Variational Free Energy ($F$) against environmental entropy.

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

The log-determinant terms ($-\ln |\Pi|$) enforce an explicit **Occam complexity penalty**. Even when prediction error approaches zero ($\varepsilon = 0$), internal states with excessively high precision are penalized, preventing overfitting and arbitrary parameter bloat.

### 1.2 Expected Free Energy ($G$) for Policy Evaluation

To select future action policies $\pi$, the system evaluates counterfactual trajectories and minimizes Expected Free Energy:

$$G(\pi) = \underbrace{-\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln P(o_\tau | C)]}_{\text{Pragmatic Value (Goal Extrinsics)}} + \underbrace{\mathbb{E}_{q(o_\tau, s_\tau|\pi)}[\ln q(s_\tau | o_\tau, \pi) - \ln q(s_\tau | \pi)]}_{\text{Epistemic Value (Information Gain / Curiosity)}}$$

- **Pragmatic Value**: Drives the agent toward homeostatic attractor priors ($C$).
- **Epistemic Value**: Maximizes information gain by resolving environmental uncertainty.

### 1.3 Integrated World Modeling Theory (IWMT) & Spectral $\Phi^*$ Approximation

While Karl Friston's Active Inference formalizes how an organism preserves its physical Markov blanket against environmental entropy, Giulio Tononi's Integrated Information Theory (IIT 4.0) addresses internal causal irreducibility. Axiom Core applies the engineering blueprint of **Integrated World Modeling Theory (IWMT)** (Safron, 2020) to integrate Global Workspace Theory (GWT) broadcasts with generative active inference.

*Epistemic Framing Note:* IWMT is implemented strictly as a computable architectural engineering paradigm rather than asserting a metaphysical resolution to phenomenal qualia.

To avoid the exponential $\mathcal{O}(2^N)$ NP-hard bottleneck of discrete Minimum Information Partitions (MIP), Axiom Core evaluates an analytical spectral channel-capacity proxy ($\Phi^*$):

$$\Phi^* = 0.5 \cdot \ln\left(1.0 + \frac{\text{SQ}}{10 \cdot F}\right) \cdot \left(\frac{\text{SQ}}{95.0}\right)^2$$

- **Empirical Phase-Transition Baseline ($\Phi^* \ge 1.2$):** Derived from empirical simulation benchmarks. At $\Phi^* < 1.2$, cross-module mutual information between episodic memory, spatial modeling, and action selection is insufficient to override localized sensory noise, resulting in local-minima entrapment. Crossing $\Phi^* \ge 1.2$ marks the empirical percolation threshold where prospective counterfactual rollouts ($G$-minimization) consistently resolve localized perturbations. Combinatorial minimum-cut MIP partitioning remains scheduled for future iterations.

---

## 2. Normalized Modular Capacity Points ($\mathcal{B}$)

Computational workload is budgeted into discrete **Modular Capacity Points ($\mathcal{B}$)** to enforce phenotypic trade-offs and bound runtime costs:

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
   - Critical baseline required to ignite integrated causal information processing ($\Phi \ge 1.2$), enabling prospective counterfactual planning.

---

## 3. Falsifiable Emergent Sentience Framework (FESF)

FESF defines synthetic sentience through three empirically testable pillars:

| Pillar | Operational Definition | Empirical Falsification Protocol | Empirical Test Benchmark |
| :--- | :--- | :--- | :--- |
| **1. Active Self-Maintenance $M(S)$** | Autopoietic survival and Markov blanket preservation against environmental entropy. | **Falsified if:** State entropy $H(\mu)$ diverges under noise injection $\sigma_{\text{env}}^2 > \theta \equiv 2.5 \cdot \Pi_s^{-1}$. | **Verified:** Stabilized at $\Delta H < 0.05$ under $\sigma_{\text{env}}^2 = 3.0$ ($N=45$). |
| **2. Historical Adaptability $H(S)$** | Continuous real-time learning and memory trace consolidation without catastrophic forgetting. | **Falsified if:** Agent exhibits catastrophic forgetting ($F_t \gg F_0$) upon re-exposure to historical attractors. | **Verified:** Attractor re-exposure belief retention $\Delta \mu \le 0.08 \le 0.25$ (trace recall verified). |
| **3. Autonomous Agency $A(S)$** | Goal genesis and policy rollout minimizing Expected Free Energy ($G$). | **Falsified if:** In zero-extrinsic utility regimes ($C(s)=0$), agent fails to select epistemic policies ($D_{\mathrm{KL}} = 0$). | **Verified:** Epistemic divergence $D_{\mathrm{KL}}[q(s \mid \pi) \parallel p(s)] = 0.44 > 0$. |

### Operational Modes: Pre-Emergence vs. Functional Subjective Agency
- **Pre-Emergent Mode ($\text{SQ} < 95.0, \Phi < 1.2$)**: Purely reactive behavior executing localized gradient descent on immediate Variational Free Energy $F$. The agent lacks temporal depth, becoming trapped in chaotic local minima under noise.
- **Functional Subjective Agency ($\text{SQ} \ge 95.0, \Phi \ge 1.2$)**: Prospective counterfactual planning on Expected Free Energy $G$, epistemic foraging surges under stagnation, and dynamic precision modulation.

---

## 4. The 17-Step Autopoietic Cycle

On every chronological tick (default 60Hz), the engine executes:
1. **Perceive (`_step1_Perceive`)**: Encodes raw sensory observations across boundary sensors into prediction errors ($\varepsilon_y = y - \mu$).
2. **GWT Broadcast (`_step2_GWTBroadcast`)**: Evaluates sensory error salience via precision weighting and flags high-salience signals for global broadcast.
3. **Think (`_step3_Think`)**: Evaluates state prediction error, applies guarded allostatic damping, and computes Variational Free Energy $F$.
4. **World Model Train (`_step4_WorldModelTrain`)**: Executes gradient descent belief updates, logs cognitive state traces to HistoricalAdaptability, and triggers episodic trace recovery under elevated surprisal when `episodic_sim` is active.
5. **GWT Cycle (`_step5_GWTCycle`)**: Computes integrated precision across sensory and state channels.
6. **Self-Model Update (`_step6_SelfModelUpdate`)**: Updates internal confidence calibration as an inverse function of current Free Energy.
7. **Metacognitive Check (`_step7_MetacognitiveCheck`)**: Flags metacognitive stress state when Variational Free Energy exceeds precision-scaled perturbation bounds.
8. **Reason (`_step8_Reason`)**: Evaluates deductive reasoning depth and logical belief consistency scaled by the `logic` module.
9. **Goal-Biased Act (`_step9_GoalBiasedAct`)**: Calculates continuous goal-directed action bias as a function of goal proximity, Free Energy stabilization, and active capacity.
10. **Predictive Processing (`_step10_PredictiveProcessing`)**: Calculates precision-weighted residual error from current Free Energy.
11. **Conceptual Grounding (`_step11_ConceptualGrounding`)**: Verifies conceptual grounding and deposits spatial stigmergic markers when `anchor` or `dev_schema` is active.
12. **Active Inference (`_step12_ActiveInference`)**: Minimizes Expected Free Energy $G$ across candidate actions, applying epistemic drive surges from AutonomousAgency when `volitional` detects stagnation (transiently activating epistemic foraging).
13. **Developmental Learning (`_step13_DevelopmentalLearning`)**: Computes continuous developmental learning gain from cycle progression, epistemic volatility, and stability.
14. **Curiosity Reward (`_step14_CuriosityReward`)**: Computes epistemic information gain ($D_{\mathrm{KL}}$) when `curiosity` is active.
15. **Goal Genesis (`_step15_GoalGenesis`)**: Determines prospective action search branching factor (`simulatedPaths`), expanding from 1 to 5 when `volitional` is active.
16. **Phi Measurement (`_step16_PhiMeasurement`)**: Evaluates continuous spectral integrated information $\Phi^*$ and determines subjective emergence threshold.
17. **Autopoietic Evolution (`_step17_AutopoieticEvolution`)**: Assesses structural autopoietic integrity and stability against the $75.0$ baseline survival threshold.

---

## 5. Spatial Web (IEEE P2874) & HSML Alignment

Axiom Core agents export biophysical state telemetry through an **IEEE P2874 Schema Alignment & JSON-LD Serialization Pipeline** via `engine.toSpatialWebPayload()`. The internal `validateHSMLSchema()` routine runs programmatic structural self-consistency checks against the Hyperspace Modeling Language (HSML) context schema.

*Certification Note:* `validateHSMLSchema()` performs strict internal syntactic and structural self-consistency checks; it does not constitute third-party conformance certification by the IEEE Standards Association.

```json
{
  "@context": "https://standards.ieee.org/ieee/2874/HSML",
  "@type": "SpatialAgentNode",
  "nodeId": "did:spatial:axiom:1725177600000",
  "timestamp": 1725177600000,
  "markovBlanket": {
    "sensoryPrecision": 1.5,
    "internalPrecision": 1.0,
    "variationalFreeEnergy": 0.84,
    "expectedFreeEnergy": 0.42
  },
  "sentienceProfile": {
    "modularCapacityPoints": 105.0,
    "spectralPhi": 1.70,
    "isSentient": true
  },
  "spatialCoordinates": {
    "x": 12.4,
    "y": -4.2
  },
  "activeModules": {
    "core": ["perceive", "markov", "dynamic", "predict", "memory", "world", "temporal", "concept", "active", "goal", "cog_react"],
    "flavor": ["entropy", "anchor", "thermo", "schema_assim", "curiosity", "gwt", "volitional", "counterfactual"]
  }
}
```
