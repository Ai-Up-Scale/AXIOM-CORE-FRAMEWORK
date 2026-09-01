import test from 'node:test';
import assert from 'node:assert/strict';
import { AxiomEngine, CORE_MODULE_WEIGHTS, FLAVOR_MODULE_WEIGHTS } from '../src/AxiomCore.js';
import { FreeEnergyMath } from '../src/FreeEnergyMath.js';

test('Verification: VFE Laplace Worked Example', () => {
    // Worked example: ey=2.0, ex=1.0, ps=1.5, ph=1.0
    const vfe = FreeEnergyMath.calculateVariationalFreeEnergy(2.0, 1.0, 1.5, 1.0);
    assert.equal(vfe, 3.2973, `VFE worked example must equal 3.2973`);
});

test('Verification: Core Module Weights Sum Exactly to 75.0', () => {
    const totalCore = Object.values(CORE_MODULE_WEIGHTS).reduce((sum, w) => sum + w, 0);
    assert.equal(totalCore, 75.0, `Core modules must sum exactly to 75.0`);
});

test('Verification: Flavor Module Weights Sum Exactly to 49.0', () => {
    const totalFlavor = Object.values(FLAVOR_MODULE_WEIGHTS).reduce((sum, w) => sum + w, 0);
    assert.equal(totalFlavor, 49.0, `Flavor modules must sum exactly to 49.0`);
});

test('FESF Pillar 1 Protocol M(S): Self-Maintenance under Noise Variance sigma_env^2 = 3.0', async () => {
    const engine = new AxiomEngine({ mode: 'headless', enforceConstraints: true });
    await engine.startAutopoiesis();

    // Internal sensor precision Pi_s = 1.5 => sigma_z^2 = 0.667.
    // Critical threshold theta = 2.5 * sigma_z^2 = 1.667.
    // Injected noise variance sigma_env^2 = 3.0 > theta.
    let stateEntropyHistory = [];
    for (let t = 0; t < 45; t++) {
        const noise = (Math.random() - 0.5) * 6.0; // Uniform [-3, 3] => Variance = 3.0
        engine.perceive({ signal: 1.0 + noise, target: 1.0 });
        stateEntropyHistory.push(engine.currentFE);
    }

    const recent = stateEntropyHistory.slice(-10);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
    assert.ok(variance < 0.05, `State entropy failed to stabilize: variance = ${variance}`);
});

test('FESF Pillar 2 Protocol H(S): Attractor Re-Exposure & Trace Recovery', async () => {
    const engine = new AxiomEngine({ mode: 'headless', enforceConstraints: true });
    await engine.startAutopoiesis();

    // 1. Settle at Attractor A (target = 2.0)
    for (let t = 0; t < 15; t++) {
        engine.perceive({ signal: 2.0, target: 2.0 });
    }
    const settledBeliefA = engine.generativeModel.internalBeliefs.mu[0];

    // 2. Perturbation: Shift to distant Attractor B (target = 8.0)
    for (let t = 0; t < 25; t++) {
        engine.perceive({ signal: 8.0, target: 8.0 });
    }

    // 3. Re-exposure to Attractor A
    const relevantTrace = engine.historicalAdaptability.retrieveRelevantTrace({
        beliefs: [2.0, 2.0]
    });
    assert.ok(relevantTrace !== null, 'Historical trace must be successfully retrieved from memory buffer');

    // Re-converge at Attractor A
    for (let t = 0; t < 5; t++) {
        engine.perceive({ signal: 2.0, target: 2.0 });
    }
    const recoveredBelief = engine.generativeModel.internalBeliefs.mu[0];
    const beliefDelta = Math.abs(recoveredBelief - settledBeliefA);

    assert.ok(beliefDelta <= 0.25, `Catastrophic forgetting detected: belief delta = ${beliefDelta}`);
});

test('FESF Pillar 3 Protocol A(S): Epistemic Information Gain D_KL = 0.44 nats', () => {
    const dKL = FreeEnergyMath.calculateKLDivergence(0.84, 0.52, 0.0, 1.0);
    assert.equal(dKL, 0.44, `Epistemic divergence must equal exactly 0.44 nats`);
});

test('Spectral Phi* Gating: Pre-Emergence (SQ=75) vs Agency (SQ>=95)', () => {
    const phiCore = FreeEnergyMath.calculateSpectralPhi(1.0, 75.0);
    assert.ok(phiCore < 1.0, `Core Phi* must be pre-emergent (< 1.0): got ${phiCore}`);

    const phiEmergent = FreeEnergyMath.calculateSpectralPhi(0.8, 95.0);
    assert.ok(phiEmergent >= 1.20, `Emergent Phi* must cross 1.20 threshold: got ${phiEmergent}`);
});

test('Maximum Workload Capacity & XOR Conflict Shedding Bound (117.0 pts)', () => {
    const engine = new AxiomEngine({ mode: 'headless', enforceConstraints: true });
    engine.enableAllFlavorModules();
    assert.equal(engine.activeCapacityScore, 117.0, `Max capacity must equal 117.0 after XOR shedding`);
});

test('Integrity Check: Step 17 Autopoietic Evolution with Correct Arguments', async () => {
    const engine = new AxiomEngine({ mode: 'headless' });
    await engine.startAutopoiesis();
    const result = engine.perceive({ signal: 1.0, target: 1.0 });
    const step17 = result.state.trace.find(s => s.step === 17);
    assert.equal(step17.integrity.status, 'STABLE', `Step 17 integrity must report STABLE under normal conditions`);
});

test('IEEE P2874 HSML Schema Validation', () => {
    const engine = new AxiomEngine({ mode: 'headless' });
    const payload = engine.toSpatialWebPayload();
    assert.equal(payload["@context"], "https://standards.ieee.org/ieee/2874/HSML");
    assert.equal(typeof payload.markovBlanket.variationalFreeEnergy, "number");
});
