/**
 * @file GenerativeModel.js
 * @description Generative Model and Markov Blanket coordinator for the Axiom Core Framework.
 * Manages continuous internal state beliefs (mu), sensory-active blankets, and allostatic priors.
 */

import { FreeEnergyMath } from './FreeEnergyMath.js';

export class GenerativeModel {
    /**
     * @param {Object} [config]
     */
    constructor(config = {}) {
        // Markov Blanket State Vectors (x, y coordinates / signals)
        this.sensoryStates = { y: [1.0, 1.0], yDot: [0, 0] };
        this.internalBeliefs = { mu: [1.0, 1.0], muDot: [0, 0] };
        this.activeStates = { a: [0, 0] };

        // Precision Configuration (Inverse Variances)
        this.precisions = {
            sensory: config.sensoryPrecision ?? 1.5,
            state: config.statePrecision ?? 1.0,
            prior: config.priorPrecision ?? 1.0,
        };

        // Allostatic Target Prior (Attractor Basin C)
        this.homeostaticPriors = {
            targetPosition: [1.0, 1.0],
            vitalThreshold: 0.2,
            targetFreeEnergy: 0.05,
        };

        // Prediction Errors
        this.predictionErrors = {
            sensory: [0, 0],
            state: [0, 0],
            totalVFE: 0.0,
        };

        this.beliefVariance = 1.0 / (this.precisions.sensory + this.precisions.state);
        this.temporalHistory = [];
        this.maxHistoryLength = config.maxHistoryLength ?? 100;
    }

    /**
     * Ingest observations across the sensory Markov blanket.
     * @param {Array<number>} observations - [signal, target] or [x, y]
     */
    perceive(observations) {
        if (!Array.isArray(observations) || observations.length === 0) return;
        
        const prevSensory = [...this.sensoryStates.y];
        this.sensoryStates.y = [...observations];

        // Sensory prediction error: \varepsilon_y = y - g(\mu)
        this.predictionErrors.sensory = this.sensoryStates.y.map(
            (val, idx) => val - (this.internalBeliefs.mu[idx] ?? val)
        );

        // Generalized motion coordinate approximation
        this.sensoryStates.yDot = this.sensoryStates.y.map((v, i) => v - (prevSensory[i] ?? v));
    }

    /**
     * Perform gradient descent on Variational Free Energy to update internal beliefs \mu.
     * \dot{\mu} = \mathcal{D}\mu - \frac{\partial F}{\partial \mu}
     * 
     * @param {number} learningRate - Step size for belief updating
     * @param {number} precisionH - State precision override
     * @param {number} precisionS - Sensory precision override
     * @returns {Object} Variational Free Energy decomposition and error vectors
     */
    updateBeliefs(learningRate = 0.1, precisionH = null, precisionS = null) {
        const ph = precisionH ?? this.precisions.state;
        const ps = precisionS ?? this.precisions.sensory;

        // State prediction error: \varepsilon_x = \mu' - f(\mu)
        this.predictionErrors.state = this.internalBeliefs.muDot.map(
            (val, idx) => val - 0.1 * (this.internalBeliefs.mu[idx] ?? 0)
        );

        const eyMag = Math.hypot(...this.predictionErrors.sensory);
        const exMag = Math.hypot(...this.predictionErrors.state);

        const vfe = FreeEnergyMath.calculateVariationalFreeEnergy(eyMag, exMag, ps, ph);
        this.predictionErrors.totalVFE = vfe;

        // Precision-weighted belief gradient update
        for (let i = 0; i < this.internalBeliefs.mu.length; i++) {
            const sensoryGradient = ps * (this.predictionErrors.sensory[i] ?? 0);
            const stateGradient = ph * (this.predictionErrors.state[i] ?? 0);
            this.internalBeliefs.mu[i] += learningRate * (sensoryGradient + stateGradient);
        }

        // Update empirical belief variance
        this.beliefVariance = 1.0 / (ps + ph);
        this.recordHistory();

        return {
            totalVFE: vfe,
            eyMag,
            exMag,
            beliefMean: this.internalBeliefs.mu[0],
            beliefVariance: this.beliefVariance
        };
    }

    /**
     * Evaluate action policies minimizing Expected Free Energy (G).
     * @param {boolean} isCurious - Whether epistemic foraging is active
     * @returns {{ bestAction: Array<number>, minG: number }}
     */
    selectActionPolicy(isCurious = false) {
        const candidateActions = [
            [0, 1], [0, -1], [1, 0], [-1, 0], [0.707, 0.707], [-0.707, -0.707], [0, 0]
        ];

        let bestAction = candidateActions[0];
        let minG = Infinity;
        const eyMag = Math.hypot(...this.predictionErrors.sensory);

        for (const action of candidateActions) {
            const hypMuX = this.internalBeliefs.mu[0] + action[0] * 0.1;
            const hypMuY = (this.internalBeliefs.mu[1] ?? 0) + action[1] * 0.1;

            const goalDist = Math.hypot(
                hypMuX - this.homeostaticPriors.targetPosition[0],
                hypMuY - (this.homeostaticPriors.targetPosition[1] ?? 0)
            );

            const efe = FreeEnergyMath.calculateExpectedFreeEnergy(
                goalDist,
                this.precisions.sensory,
                isCurious,
                1.5,
                this.internalBeliefs.mu[0],
                this.beliefVariance
            );

            if (efe < minG) {
                minG = efe;
                bestAction = action;
            }
        }

        this.activeStates.a = bestAction;
        return { bestAction, minG };
    }

    recordHistory() {
        this.temporalHistory.push({
            timestamp: Date.now(),
            sensory: [...this.sensoryStates.y],
            beliefs: [...this.internalBeliefs.mu],
            vfe: this.predictionErrors.totalVFE,
        });
        if (this.temporalHistory.length > this.maxHistoryLength) {
            this.temporalHistory.shift();
        }
    }
}
