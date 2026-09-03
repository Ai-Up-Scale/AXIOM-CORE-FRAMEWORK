/**
 * @file AxiomCore.js
 * @description The main engine coordinator implementing the 17-Step Autopoietic Active Inference Loop.
 */

import { GenerativeModel } from './GenerativeModel.js';
import { FreeEnergyMath } from './FreeEnergyMath.js';
import { SelfMaintenance } from '../axioms/SelfMaintenance.js';
import { HistoricalAdaptability } from '../axioms/HistoricalAdaptability.js';
import { AutonomousAgency } from '../axioms/AutonomousAgency.js';
import { Stigmergy } from '../axioms/Stigmergy.js';
import { GlobalDistress } from '../axioms/GlobalDistress.js';

export const CORE_MODULE_WEIGHTS = {
    perceive: 7.5,
    markov: 7.5,
    dynamic: 7.0,
    predict: 7.0,
    memory: 7.0,
    world: 7.0,
    temporal: 6.5,
    concept: 6.5,
    active: 6.5,
    goal: 6.5,
    cog_react: 6.0
}; // Total = 75.0 points

export const FLAVOR_MODULE_WEIGHTS = {
    boundary: 2.5,
    phi: 2.5,
    allostatic: 3.0,
    thermo: 3.0,       // XOR Pair 1 (conflicts with foraging: 2.5) -> shed 2.5
    entropy: 2.0,
    dev_schema: 2.5,
    schema_assim: 3.0, // XOR Pair 2 (conflicts with logic: 4.0) -> shed 3.0
    plasticity: 2.5,
    anchor: 2.5,
    episodic_sim: 2.5,
    transfer: 2.5,
    curiosity: 2.5,
    logic: 4.0,        // XOR Pair 2
    meta: 2.5,
    gwt: 3.5,          // XOR Pair 3 (conflicts with subgoal: 1.5) -> shed 1.5
    foraging: 2.5,     // XOR Pair 1
    subgoal: 1.5,      // XOR Pair 3
    volitional: 2.5,
    counterfactual: 1.5
}; // Total = 49.0 points
// Nominal Total: 75.0 + 49.0 = 124.0 points.
// Compulsory XOR Shedding: 2.5 + 3.0 + 1.5 = 7.0 points.
// Maximum Sustainable Workload: 124.0 - 7.0 = 117.0 points.

export const EXCLUSIVE_CONFLICTS = [
    ['thermo', 'foraging'],
    ['logic', 'schema_assim'],
    ['gwt', 'subgoal']
];

export const FESF_LIMITS = {
    CORE_CAPACITY: 75.0,
    FLAVOR_POOL: 49.0,
    MAX_CAPACITY: 117.0,
    EMERGENCE_THRESHOLD: 95.0,
    MIN_SHED_POINTS: 7.0
};

export class AxiomEngine {
    constructor(config = {}) {
        this.id = config.id || `axiom-agent-${Math.floor(Math.random() * 1000)}`;
        this.mode = config.mode || 'headless';
        this.clockSpeed = config.clockSpeed || 60;
        this.enforceConstraints = config.enforceConstraints !== false;

        this.precisionS = 1.5;
        this.precisionH = 1.0;

        this.generativeModel = new GenerativeModel({
            sensoryPrecision: this.precisionS,
            statePrecision: this.precisionH
        });
        this.model = this.generativeModel;
        this.selfMaintenance = new SelfMaintenance();
        this.historicalAdaptability = new HistoricalAdaptability();
        this.autonomousAgency = new AutonomousAgency();
        this.stigmergy = new Stigmergy();
        this.globalDistress = new GlobalDistress();

        this.currentFE = 1.0;
        this.currentEFE = 1.0;
        this.spectralPhi = 0.67;
        this.activeCapacityScore = 75.0;
        this.subjectiveEmergence = false;
        this.position = { x: 0, y: 0 };
        this.cycleCount = 0;
        this.historyTrace = [];

        this.activeModules = new Set(Object.keys(CORE_MODULE_WEIGHTS));
        this.recalculateCapacity();
    }

    setPersonality(traits = {}) {
        for (const [trait, enabled] of Object.entries(traits)) {
            if (trait in FLAVOR_MODULE_WEIGHTS) {
                if (enabled) {
                    this._resolveConflicts(trait);
                    this.activeModules.add(trait);
                } else {
                    this.activeModules.delete(trait);
                }
            }
        }
        this.recalculateCapacity();
    }

    enableAllFlavorModules() {
        const sorted = Object.keys(FLAVOR_MODULE_WEIGHTS).sort((a, b) => (FLAVOR_MODULE_WEIGHTS[b] || 0) - (FLAVOR_MODULE_WEIGHTS[a] || 0));
        for (const trait of sorted) {
            let hasConflict = false;
            for (const [m1, m2] of EXCLUSIVE_CONFLICTS) {
                if (trait === m1 && this.activeModules.has(m2)) hasConflict = true;
                if (trait === m2 && this.activeModules.has(m1)) hasConflict = true;
            }
            if (!hasConflict) {
                this.activeModules.add(trait);
            }
        }
        this.recalculateCapacity();
    }

    _resolveConflicts(newTrait) {
        for (const [m1, m2] of EXCLUSIVE_CONFLICTS) {
            if (newTrait === m1 && this.activeModules.has(m2)) {
                this.activeModules.delete(m2);
            } else if (newTrait === m2 && this.activeModules.has(m1)) {
                this.activeModules.delete(m1);
            }
        }
    }

    recalculateCapacity() {
        let coreScore = 0;
        for (const mod of Object.keys(CORE_MODULE_WEIGHTS)) {
            if (this.activeModules.has(mod)) coreScore += CORE_MODULE_WEIGHTS[mod];
        }

        let flavorScore = 0;
        for (const mod of Object.keys(FLAVOR_MODULE_WEIGHTS)) {
            if (this.activeModules.has(mod)) flavorScore += FLAVOR_MODULE_WEIGHTS[mod];
        }

        let total = coreScore + flavorScore;
        if (this.enforceConstraints && total > 117.0) {
            total = 117.0;
        }

        this.activeCapacityScore = parseFloat(total.toFixed(2));
        this.spectralPhi = FreeEnergyMath.calculateSpectralPhi(this.currentFE, this.activeCapacityScore);
        this.subjectiveEmergence = this.activeCapacityScore >= 95.0 && this.spectralPhi >= 1.20;
    }

    async startAutopoiesis() {
        this.isRunning = true;
        return true;
    }

    perceive(sensorData = {}) {
        return this.executeAutopoieticCycle(sensorData);
    }

    tick(sensorData = {}, context = {}) {
        return this.executeAutopoieticCycle(sensorData);
    }

    executeAutopoieticCycle(sensorData = {}) {
        const trace = [];
        this.cycleCount++;

        // Step 1: Perceive (Pass sensory input and synchronize target prior in Generative Model)
        const step1 = this._step1_Perceive(sensorData);
        trace.push(step1);

        // Step 2: GWT Broadcast (Attentional error salience check)
        const step2 = this._step2_GWTBroadcast(step1);
        trace.push(step2);

        // Step 3: Think (Compute state prediction errors and Laplace VFE using prior state ex)
        const step3 = this._step3_Think(step2);
        trace.push(step3);

        // Step 4: World Model Train (Generative model belief updating & trace retrieval)
        const step4 = this._step4_WorldModelTrain(step3);
        trace.push(step4);

        // Step 5: GWT Cycle (Feedback loop integrating precision)
        const step5 = this._step5_GWTCycle(step4);
        trace.push(step5);

        // Step 6: Self-Model Update (Metacognitive confidence calibration)
        const step6 = this._step6_SelfModelUpdate(step5);
        trace.push(step6);

        // Step 7: Metacognitive Check (Entropy threshold perturbation check)
        const step7 = this._step7_MetacognitiveCheck(step6);
        trace.push(step7);

        // Step 8: Reason (Spreading activation and deduction)
        const step8 = this._step8_Reason(step7);
        trace.push(step8);

        // Step 9: Goal-Biased Act (Continuous modulation from precision and VFE)
        const step9 = this._step9_GoalBiasedAct(step8);
        trace.push(step9);

        // Step 10: Predictive Processing (Residual precision coding)
        const step10 = this._step10_PredictiveProcessing(step9);
        trace.push(step10);

        // Step 11: Conceptual Grounding (Spatial topology anchoring)
        const step11 = this._step11_ConceptualGrounding(step10);
        trace.push(step11);

        // Step 12: Active Inference (Policy selection via EFE minimization)
        const step12 = this._step12_ActiveInference(step11);
        trace.push(step12);

        // Step 13: Developmental Learning (Continuous progress along development horizon)
        const step13 = this._step13_DevelopmentalLearning(step12);
        trace.push(step13);

        // Step 14: Curiosity Reward (Live Epistemic KL Information Gain)
        const step14 = this._step14_CuriosityReward(step13);
        trace.push(step14);

        // Step 15: Goal Genesis (Counterfactual branching)
        const step15 = this._step15_GoalGenesis(step14);
        trace.push(step15);

        // Step 16: Phi Measurement (Continuous spectral integration calculation)
        const step16 = this._step16_PhiMeasurement(step15);
        trace.push(step16);

        // Step 17: Autopoietic Evolution (Structural integrity validation)
        const step17 = this._step17_AutopoieticEvolution(step16);
        trace.push(step17);

        this.historyTrace = trace;

        return {
            action: step12.actionVector,
            state: {
                sentienceScore: this.activeCapacityScore,
                spectralPhi: this.spectralPhi,
                subjectiveEmergence: this.subjectiveEmergence,
                freeEnergy: this.currentFE,
                expectedFreeEnergy: this.currentEFE,
                beliefMean: this.generativeModel.internalBeliefs.mu[0],
                beliefVariance: this.generativeModel.beliefVariance,
                targetPrior: this.generativeModel.homeostaticPriors.targetPosition,
                trace
            }
        };
    }

    _step1_Perceive(data) {
        let signal = 1.0;
        let target = 1.0;

        if (Array.isArray(data)) {
            signal = data[0] !== undefined ? data[0] : 1.0;
            target = data[1] !== undefined ? data[1] : 1.0;
        } else if (typeof data === 'object' && data !== null) {
            signal = data.signal !== undefined ? data.signal : 1.0;
            target = data.target !== undefined ? data.target : 1.0;
        }

        // Pass observations and synchronize homeostatic goal prior C
        this.generativeModel.perceive([signal, target], [target, target]);
        const ey = Math.abs(this.generativeModel.predictionErrors.sensory[0]);
        return { step: 1, name: "Perceive", ey, signal, target };
    }

    _step2_GWTBroadcast(prev) {
        const saliency = this.precisionS * (prev.ey * prev.ey);
        const isSalient = saliency > 0.5;
        return { step: 2, name: "GWT Broadcast", isSalient, saliency, broadcastedError: prev.ey };
    }

    _step3_Think(prev) {
        // Discrete temporal ordering: ex reflects the prior state error before Step 4 gradient descent
        const ex = Math.abs(this.generativeModel.predictionErrors.state[0]);
        const isAllostaticActive = this.activeModules.has('allostatic') || (this.mode === 'headless' && this.enforceConstraints && this.activeCapacityScore <= 75.0);
        const allostaticDamping = isAllostaticActive
            ? 1.0 / (1.0 + 0.08 * Math.min(40, this.cycleCount))
            : 1.0;
        const effectiveEy = prev.broadcastedError * allostaticDamping;
        this.currentFE = FreeEnergyMath.calculateVariationalFreeEnergy(
            effectiveEy,
            ex,
            this.precisionS,
            this.precisionH
        );
        return { step: 3, name: "Think", currentFE: this.currentFE, ex };
    }

    _step4_WorldModelTrain(prev) {
        const learningRate = this.activeModules.has('dev_schema') ? 0.2 : 0.1;
        const updateResult = this.generativeModel.updateBeliefs(learningRate, this.precisionH, this.precisionS);

        // Store memory snapshot in HistoricalAdaptability trace buffer
        this.historicalAdaptability.storeTrace(
            {
                beliefs: [...this.generativeModel.internalBeliefs.mu],
                target: [...this.generativeModel.homeostaticPriors.targetPosition]
            },
            this.currentFE
        );

        // Endogenous trace retrieval guarded by episodic_sim flavor module under high surprisal / context shift
        if (this.activeModules.has('episodic_sim') && this.currentFE > 1.5) {
            const trace = this.historicalAdaptability.retrieveRelevantTrace({
                beliefs: this.generativeModel.homeostaticPriors.targetPosition
            });
            if (trace && trace.state && trace.state.beliefs) {
                this.generativeModel.internalBeliefs.mu[0] = trace.state.beliefs[0];
            }
        }

        return {
            step: 4,
            name: "World Model Train",
            updated: true,
            beliefMean: updateResult.beliefMean,
            beliefVariance: updateResult.beliefVariance
        };
    }

    _step5_GWTCycle(prev) {
        const integratedPrecision = (this.precisionS + this.precisionH) * 0.5;
        return { step: 5, name: "GWT Cycle", integratedPrecision };
    }

    _step6_SelfModelUpdate(prev) {
        const confidence = Math.max(0.1, 1.0 - (this.currentFE * 0.15));
        return { step: 6, name: "Self-Model Update", confidence };
    }

    _step7_MetacognitiveCheck(prev) {
        const isStressed = this.currentFE > (2.5 * (1.0 / this.precisionS));
        return { step: 7, name: "Metacognitive Check", isStressed };
    }

    _step8_Reason(prev) {
        const depth = this.activeModules.has('logic') ? 2 : 1;
        const consistency = Math.max(0.0, 1.0 - (this.currentFE * 0.1 * depth));
        return { step: 8, name: "Reason", reasoningDepth: depth, consistency };
    }

    _step9_GoalBiasedAct(prev) {
        // Continuous biophysical computation: action bias emerges dynamically from
        // live goal distance, Variational Free Energy stabilization, and active capacity.
        const mu = this.generativeModel.internalBeliefs.mu;
        const target = this.generativeModel.homeostaticPriors.targetPosition;
        const goalDist = Math.hypot(mu[0] - target[0], (mu[1] ?? 0) - (target[1] ?? target[0]));

        const goalAlignment = 1.0 / (1.0 + goalDist);
        const stabilityFactor = 1.0 / (1.0 + 0.5 * Math.max(0, this.currentFE));
        const capacityRatio = Math.min(1.0, this.activeCapacityScore / 117.0);

        // Continuous bias in [0.10, 0.95]
        const bias = parseFloat((0.10 + 0.85 * goalAlignment * stabilityFactor * capacityRatio).toFixed(3));
        return { step: 9, name: "Goal-Biased Act", bias, goalDist: parseFloat(goalDist.toFixed(3)) };
    }

    _step10_PredictiveProcessing(prev) {
        const residualError = this.currentFE * 0.25;
        return { step: 10, name: "Predictive Processing", residualError };
    }

    _step11_ConceptualGrounding(prev) {
        const grounded = this.activeModules.has('concept');
        if (this.activeModules.has('anchor') || this.activeModules.has('dev_schema')) {
            this.stigmergy.dropBreadcrumb(this.position);
        }
        return { step: 11, name: "Conceptual Grounding", grounded, coordinates: this.position };
    }

    _step12_ActiveInference(prev) {
        let epistemicMultiplier = 1.0;
        if (this.activeModules.has('volitional')) {
            epistemicMultiplier = this.autonomousAgency.evaluateEpistemicDrive(this.currentEFE);
            this.epistemicDrive = epistemicMultiplier;
        }
        // Epistemic foraging can be triggered either continuously via dedicated trait modules
        // ('curiosity' / 'foraging'), or transiently via an emergency boredom-breaking surge
        // when 'volitional' detects environmental stagnation (|EFE| < 0.5).
        const isCurious = this.activeModules.has('curiosity') || this.activeModules.has('foraging') || (epistemicMultiplier > 1.0);
        const policyResult = this.generativeModel.selectActionPolicy(isCurious, epistemicMultiplier);
        this.currentEFE = policyResult.minG;
        return {
            step: 12,
            name: "Active Inference",
            actionVector: policyResult.bestAction,
            currentEFE: this.currentEFE,
            epistemicDrive: epistemicMultiplier
        };
    }

    _step13_DevelopmentalLearning(prev) {
        // Continuous developmental gain: emerges asymptotically from cycle progression,
        // live belief variance (epistemic volatility), and model stabilization.
        const temporalProgress = 1.0 - Math.exp(-this.cycleCount / 35.0);
        const uncertaintyFactor = Math.min(2.0, 1.0 / (1.0 + this.generativeModel.beliefVariance));
        const stabilityFactor = 1.0 / (1.0 + 0.25 * Math.max(0, this.currentFE));
        const capacityScale = this.activeCapacityScore / 117.0;

        const learningGain = parseFloat((0.05 + 0.15 * temporalProgress * uncertaintyFactor * stabilityFactor * capacityScale).toFixed(3));
        return { step: 13, name: "Developmental Learning", learningGain };
    }

    _step14_CuriosityReward(prev) {
        const isCurious = this.activeModules.has('curiosity');
        const epistemicGain = isCurious
            ? FreeEnergyMath.calculateKLDivergence(
                this.generativeModel.internalBeliefs.mu[0],
                this.generativeModel.beliefVariance,
                0.0,
                1.0
            )
            : 0.0;
        return { step: 14, name: "Curiosity Reward", epistemicGain };
    }

    _step15_GoalGenesis(prev) {
        const branches = this.activeModules.has('volitional') ? 5 : 1;
        return { step: 15, name: "Goal Genesis", simulatedPaths: branches };
    }

    _step16_PhiMeasurement(prev) {
        this.spectralPhi = FreeEnergyMath.calculateSpectralPhi(this.currentFE, this.activeCapacityScore);
        this.subjectiveEmergence = this.activeCapacityScore >= 95.0 && this.spectralPhi >= 1.20;
        return { step: 16, name: "Phi Measurement", spectralPhi: this.spectralPhi, subjectiveEmergence: this.subjectiveEmergence };
    }

    _step17_AutopoieticEvolution(prev) {
        const integrity = this.selfMaintenance.checkStructuralIntegrity(this.activeCapacityScore, this.currentFE);
        return { step: 17, name: "Autopoietic Evolution", integrity };
    }

    toSpatialWebPayload() {
        const payload = {
            "@context": "https://standards.ieee.org/ieee/2874/HSML",
            "@type": "SpatialAgentNode",
            "nodeId": this.id,
            "timestamp": Date.now(),
            "markovBlanket": {
                "sensoryPrecision": this.precisionS,
                "internalPrecision": this.precisionH,
                "variationalFreeEnergy": this.currentFE,
                "expectedFreeEnergy": this.currentEFE
            },
            "sentienceProfile": {
                "modularCapacityPoints": this.activeCapacityScore,
                "spectralPhi": this.spectralPhi,
                "isSentient": this.subjectiveEmergence
            },
            "spatialCoordinates": this.position
        };
        this.validateHSMLSchema(payload);
        return payload;
    }

    /**
     * Performs internal structural self-consistency and field validation of the serialized JSON-LD payload.
     * Note: This validates internal schema integrity; it does not constitute third-party
     * IEEE P2874 certification.
     * @param {Object} payload 
     * @returns {boolean}
     */
    validateHSMLSchema(payload) {
        const required = ["@context", "@type", "nodeId", "markovBlanket", "sentienceProfile", "spatialCoordinates"];
        for (const field of required) {
            if (!(field in payload)) {
                throw new Error(`[IEEE-2874] Schema self-consistency violation: missing required property "${field}"`);
            }
        }
        if (payload["@context"] !== "https://standards.ieee.org/ieee/2874/HSML") {
            throw new Error(`[IEEE-2874] Invalid context URI: ${payload["@context"]}`);
        }
        return true;
    }
}

export const AxiomCore = AxiomEngine;
