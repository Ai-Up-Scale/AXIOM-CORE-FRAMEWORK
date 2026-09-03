import test from 'node:test';
import assert from 'node:assert/strict';
import { AxiomEngine, CORE_MODULE_WEIGHTS, FLAVOR_MODULE_WEIGHTS } from '../src/AxiomCore.js';
import { FreeEnergyMath } from '../src/FreeEnergyMath.js';

test('Verification: VFE Laplace Worked Example', () => {
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

    let stateEntropyHistory = [];
    for (let t = 0; t < 45; t++) {
        const noise = (Math.random() - 0.5) * 6.0; // Variance = (6^2)/12 = 3.0
        engine.perceive({ signal: 1.0 + noise, target: 1.0 });
        stateEntropyHistory.push(engine.currentFE);
    }

    const recent = stateEntropyHistory.slice(-10);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
    assert.ok(variance < 0.05, `State entropy failed to stabilize: variance = ${variance}`);
});

test('FESF Pillar 2 Protocol H(S): Attractor Re-Exposure & Memory Trace Recovery', async () => {
    const engine = new AxiomEngine({ mode: 'headless', enforceConstraints: true });
    await engine.startAutopoiesis();

    // 1. Settle at Attractor A (target = 2.0)
    for (let t = 0; t < 10; t++) {
        engine.perceive({ signal: 2.0, target: 2.0 });
    }
    const settledBeliefA = engine.generativeModel.internalBeliefs.mu[0];

    // 2. Perturbation: Shift to distant Attractor B (target = 8.0)
    for (let t = 0; t < 20; t++) {
        engine.perceive({ signal: 8.0, target: 8.0 });
    }

    // 3. Re-exposure to Attractor A: Recall memory trace from HistoricalAdaptability
    const relevantTrace = engine.historicalAdaptability.retrieveRelevantTrace({
        beliefs: [2.0, 2.0]
    });
    assert.ok(relevantTrace !== null, 'Historical trace must be successfully retrieved from memory buffer');

    // Restore belief state from episodic memory trace
    engine.generativeModel.internalBeliefs.mu = [...relevantTrace.state.beliefs];

    // Re-converge at Attractor A
    for (let t = 0; t < 5; t++) {
        engine.perceive({ signal: 2.0, target: 2.0 });
    }
    const recoveredBelief = engine.generativeModel.internalBeliefs.mu[0];
    const beliefDelta = parseFloat(Math.abs(recoveredBelief - settledBeliefA).toFixed(4));

    console.log(`[FESF Pillar 2] Memory trace retrieved. Attractor A settled belief: ${settledBeliefA.toFixed(2)}, Recovered belief: ${recoveredBelief.toFixed(2)}, beliefDelta: ${beliefDelta}`);
    assert.ok(beliefDelta <= 0.25, `Catastrophic forgetting detected: beliefDelta = ${beliefDelta} > 0.25`);
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

test('AutonomousAgency: Epistemic Surge Drives Exploratory Policy under Volitional Drive', async () => {
    const engine = new AxiomEngine({ mode: 'headless' });
    engine.activeModules.add('volitional');
    await engine.startAutopoiesis();

    // Settle in a predictable state where EFE approaches 0 (< boredomThreshold 0.5)
    engine.currentEFE = 0.05;
    const result = engine.perceive({ signal: 1.0, target: 1.0 });
    const step12 = result.state.trace.find(s => s.step === 12);

    assert.ok(step12 !== undefined, 'Step 12 must be present in autopoietic trace');
    assert.equal(step12.epistemicDrive, 2.5, `AutonomousAgency must generate an epistemic surge multiplier of 2.5 when EFE is below boredom threshold`);
    assert.notDeepEqual(step12.actionVector, [0, 0], `Epistemic surge must force exploratory action policy away from stagnant [0, 0]`);
});

test('HistoricalAdaptability: Endogenous Trace Recovery under Context Perturbation (Episodic Sim)', async () => {
    const engine = new AxiomEngine({ mode: 'headless' });
    engine.activeModules.add('episodic_sim');
    await engine.startAutopoiesis();

    // Settle at Attractor A (target = 2.0)
    for (let t = 0; t < 10; t++) {
        engine.perceive({ signal: 2.0, target: 2.0 });
    }
    const settledA = engine.generativeModel.internalBeliefs.mu[0];

    // Perturbation: Shift to Attractor B (target = 8.0)
    for (let t = 0; t < 20; t++) {
        engine.perceive({ signal: 8.0, target: 8.0 });
    }

    // Re-expose to Attractor A: Step 4 endogenous trace recovery fires automatically
    engine.perceive({ signal: 2.0, target: 2.0 });
    const recovered = engine.generativeModel.internalBeliefs.mu[0];
    const delta = Math.abs(recovered - settledA);

    assert.ok(delta < 0.1, `Endogenous memory trace recovery must restore belief near Attractor A (delta = ${delta.toFixed(4)} < 0.1)`);
});
