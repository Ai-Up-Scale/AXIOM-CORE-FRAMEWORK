/**
 * @file SelfMaintenance.js
 * @description Governs the 75% baseline structural integrity (survival threshold).
 * Monitors the sentience score and Free Energy bounds to ensure the generative
 * model maintains homeostatic stability.
 */

export class SelfMaintenance {
    /**
     * @constructor
     * Initializes the SelfMaintenance axiom module.
     * @param {number} survivalThreshold - The baseline sentience score (default: 75.0)
     * @param {number} criticalFEThreshold - The maximum tolerable Free Energy before panic.
     */
    constructor(survivalThreshold = 75.0, criticalFEThreshold = 100.0) {
        this.survivalThreshold = survivalThreshold;
        this.criticalFEThreshold = criticalFEThreshold;
    }

    /**
     * @method checkStructuralIntegrity
     * Assesses the systemic stability of the engine.
     * If the currentScore drops below 75.0, or if freeEnergy spikes beyond the 
     * critical threshold, an allostatic response is triggered.
     * 
     * @param {number} currentScore - The current active sentience capacity score.
     * @param {number} freeEnergy - The current Variational Free Energy metric.
     * @returns {Object} An object indicating structural status and any required allostatic regulation.
     */
    checkStructuralIntegrity(currentScore, freeEnergy) {
        const isCoreFailing = currentScore < this.survivalThreshold;
        const isHighSurprisal = freeEnergy > this.criticalFEThreshold;

        if (isCoreFailing || isHighSurprisal) {
            return {
                status: 'CRITICAL',
                allostaticRegulation: true,
                signal: 'PRUNE_FLAVOR_MODULES_AND_PRIORITIZE_PRAGMATIC_ACTION',
                reason: isCoreFailing ? 'SURVIVAL_BASELINE_BREACHED' : 'EXCESSIVE_SURPRISAL'
            };
        }

        return {
            status: 'STABLE',
            allostaticRegulation: false,
            signal: 'MAINTAIN_CURRENT_POLICY',
            reason: 'HOMEOSTASIS_MAINTAINED'
        };
    }
}
