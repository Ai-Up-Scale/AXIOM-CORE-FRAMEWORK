/**
 * @file AutonomousAgency.js
 * @description Drives epistemic foraging (curiosity) and endogenous goal generation.
 * Counteracts model stagnation by promoting exploration when Expected Free Energy is too low.
 */

export class AutonomousAgency {
    /**
     * @constructor
     * Initializes the Autonomous Agency axiom module.
     * @param {number} boredomThreshold - The EFE threshold below which the model stagnates.
     * @param {number} baseMultiplier - The default epistemic drive multiplier.
     */
    constructor(boredomThreshold = 0.5, baseMultiplier = 1.0) {
        this.boredomThreshold = boredomThreshold;
        this.baseMultiplier = baseMultiplier;
    }

    /**
     * @method evaluateEpistemicDrive
     * Determines whether the environment has become too predictable (EFE near zero).
     * If stagnation is detected, an "epistemic surge" is generated to force 
     * novel state exploration and subsequent World Model updating.
     * 
     * @param {number} expectedFreeEnergy - The calculated Expected Free Energy (G).
     * @returns {number} The epistemic multiplier applied to action selection.
     */
    evaluateEpistemicDrive(expectedFreeEnergy) {
        const absoluteEFE = Math.abs(expectedFreeEnergy);

        if (absoluteEFE < this.boredomThreshold) {
            // Environment is highly predictable (boredom state).
            // Generate an epistemic surge (e.g., 2.5x multiplier) to force exploration.
            const epistemicSurge = 2.5;
            return this.baseMultiplier * epistemicSurge;
        }

        // Environment contains sufficient uncertainty or pragmatic goals are active.
        return this.baseMultiplier;
    }
}
