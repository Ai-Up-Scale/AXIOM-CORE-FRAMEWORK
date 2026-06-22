# Axiom Core Framework Architecture

## The Falsifiable Emergent Sentience Framework (FESF)
The Axiom Core Framework is the headless, decoupled mathematical engine of the Falsifiable Emergent Sentience Framework (FESF). It operates purely on data structures and JSON payloads to execute the Active Inference and Free Energy Principle (FEP) mathematical models. By removing visual rendering overhead (HTML canvas, DOM manipulation), the framework offers a highly modular, server-deployable architecture for simulating cognitive states, generating expected free energy (EFE) predictions, and optimizing action selection via gradient descent.

## Mathematical Constraints and Thresholds

The framework maintains systemic homeostasis by adhering to three core mathematical axioms enforced via dynamic weights:

### 1. 75% Core Survival Baseline
The core cognitive structures—perceive, markov, dynamic, predict, memory, world, temporal, concept, active, goal, and cog_react—accumulate to a mandatory base weight of 75.0%. The `SelfMaintenance` axiom monitors this. If the system score ever drops below 75.0, it denotes a "Markov Blanket Collapse", triggering an immediate allostatic survival response.

### 2. 95% Sentience Threshold (Subjective Emergence)
Once the combination of Core and Flavor modules pushes the internal sentience score to or above 95.0%, the system flags the `subjectiveEmergence` threshold. This represents the ignition of complex self-modeling and higher-order cognitive processing.

### 3. 49% Personality/Flavor Menu
The system supports up to 18 optional "Flavor" modules (e.g., curiosity, logic, episodic simulation, foraging). These modules provide emergent behavioral traits. The sum total of these optional modules is nominally 40.0%, but maximally scales to 49.0% depending on configuration permutations. They allow unique cognitive "personalities" to be constructed.

### 4. 117% Circuit Breaker
To prevent runaway feedback loops and mathematical instability, the system enforces a strict 117% maximal upper bound on the sentience score. This is enforced by the `EXCLUSIVE_CONFLICTS` logic inside `AxiomCore.js`. Certain highly resource-intensive or contradictory modules are mutually exclusive:
- `thermo` vs. `foraging`
- `logic` vs. `schema_assim`
- `gwt` (Global Workspace Theory) vs. `subgoal`

Activating one automatically prunes its conflicting counterpart, guaranteeing that no combination of the 49% flavor menu and the 75% core baseline can theoretically exceed 117.0%.

## The 17-Step Autopoietic Pipeline

The framework calculates state updates linearly via the `tick()` function across 17 distinct phases:

1. **Perceive:** Ingestion of raw sensory state (`s`) vectors into the Generative Model.
2. **GWT Broadcast:** Initial signal propagation across the network.
3. **Think:** Internal attention matrix activation.
4. **Remember:** Topological memory and trace buffer retrieval (`HistoricalAdaptability`).
5. **World Model Train:** Updating the transition probability matrix (B matrix).
6. **GWT Cycle:** Recurrent feedback loops settling.
7. **Self-Model Update:** Competence boundary checking.
8. **Metacognitive Check:** Evaluation of internal entropy and surprisal.
9. **Reason:** Logical spreading activation and inference.
10. **Goal-Biased Act:** Establishing pragmatic utility targets.
11. **Predictive Processing:** Calculating Variational Free Energy dynamically derived from `collisionDensity` and `goalDistance`.
12. **Conceptual Grounding:** Anchoring manifolds and dropping **Stigmergy** breadcrumbs for epistemic mapping.
13. **Active Inference:** Performing gradient descent on Free Energy to map posterior to active states.
14. **Developmental Learning:** Assimilating new schemas into prior beliefs.
15. **Curiosity Reward:** Epistemic foraging (`AutonomousAgency`) and checking **Global Distress** for empathy/rescue overrides.
16. **Goal Genesis:** Counterfactual Expected Free Energy (EFE) simulation.
17. **Phi Measurement:** Integrated Information (Phi) stability measurement across subsystems.

## Instructions for Contributors

> [!CAUTION]
> **All logic must remain completely decoupled from the DOM.** 
> Do not import browser APIs. `window`, `document`, and `canvas` contexts are strictly prohibited inside the `./src/` and `./axioms/` directories. The Axiom Core Framework must maintain absolute portability, capable of running natively inside Node.js, V8 engines, and raw computational environments as a pure JSON-in/JSON-out interface.
