/**
 * @file GlobalDistress.js
 * @description Governs the Empathy/Rescue calculations. Evaluates the Free Energy
 * deltas of nearby external agents. If a peer is in a state of high surprisal 
 * (distress), it overrides local pragmatic goals to enact a rescue policy.
 */

export class GlobalDistress {
    /**
     * @constructor
     * Initializes the Global Distress module.
     * @param {number} distressThreshold - The FE delta required to trigger empathy.
     * @param {number} maxRescueRange - The maximum topological distance to care about.
     */
    constructor(distressThreshold = 80.0, maxRescueRange = 200.0) {
        this.distressThreshold = distressThreshold;
        this.maxRescueRange = maxRescueRange;
    }

    /**
     * @method evaluateEmpathyResponse
     * Analyzes nearby agents to determine if an empathic override is mathematically required.
     * 
     * @param {Array<Object>} neighborhood - Array of nearby agents: { id, distance, freeEnergy }
     * @param {number} ownFreeEnergy - This agent's current Free Energy.
     * @returns {Object|null} The rescue target vector, or null if no rescue is needed.
     */
    evaluateEmpathyResponse(neighborhood, ownFreeEnergy) {
        let highestDistress = 0;
        let rescueTarget = null;

        neighborhood.forEach(peer => {
            if (peer.distance <= this.maxRescueRange) {
                const feDelta = peer.freeEnergy - ownFreeEnergy;
                
                // If the peer's Free Energy is significantly worse than our own
                if (feDelta > this.distressThreshold && feDelta > highestDistress) {
                    highestDistress = feDelta;
                    rescueTarget = peer;
                }
            }
        });

        if (rescueTarget) {
            return {
                status: 'EMPATHIC_OVERRIDE',
                targetId: rescueTarget.id,
                rescueVectorMultiplier: 1.5 + (highestDistress / 100) // Scale speed based on distress severity
            };
        }

        return null; // Normal operation
    }
}
