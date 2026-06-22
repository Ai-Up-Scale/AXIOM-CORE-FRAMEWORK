/**
 * @file Stigmergy.js
 * @description Governs epistemic mapping via topological pheromone trails (breadcrumbs).
 * Enables the engine to record its historical spatial/state topology to prevent
 * cycling and to map the environment collaboratively.
 */

export class Stigmergy {
    /**
     * @constructor
     * Initializes the Stigmergic mapping module.
     * @param {number} maxBreadcrumbs - The maximum number of traces to retain.
     * @param {number} decayRate - The rate at which the pheromone trace degrades.
     */
    constructor(maxBreadcrumbs = 500, decayRate = 0.01) {
        this.maxBreadcrumbs = maxBreadcrumbs;
        this.decayRate = decayRate;
        this.breadcrumbs = [];
    }

    /**
     * @method dropBreadcrumb
     * Deposits a new trace in the environment/state-space.
     * 
     * @param {Object} stateVector - The current spatial or cognitive coordinates.
     * @param {number} initialIntensity - The initial strength of the pheromone (default 1.0).
     */
    dropBreadcrumb(stateVector, initialIntensity = 1.0) {
        this.breadcrumbs.push({
            coordinates: stateVector,
            intensity: initialIntensity,
            timestamp: Date.now()
        });

        if (this.breadcrumbs.length > this.maxBreadcrumbs) {
            this.breadcrumbs.shift();
        }
    }

    /**
     * @method decayTrails
     * Degrades the intensity of all existing breadcrumbs over time.
     * Traces that fall below a minimum threshold are pruned.
     */
    decayTrails() {
        this.breadcrumbs = this.breadcrumbs.filter(crumb => {
            crumb.intensity -= this.decayRate;
            return crumb.intensity > 0.05; // Prune weak traces
        });
    }

    /**
     * @method evaluatePheromoneDensity
     * Calculates the local density of breadcrumbs relative to a target state.
     * High density indicates a well-explored area, lowering epistemic uncertainty.
     * 
     * @param {Object} targetState - The state vector to evaluate.
     * @param {number} radius - The topological radius to consider "local".
     * @returns {number} The aggregated pheromone intensity in the area.
     */
    evaluatePheromoneDensity(targetState, radius = 10.0) {
        let density = 0;
        // Abstract Euclidean distance over N-dimensional state vectors
        this.breadcrumbs.forEach(crumb => {
            let distSq = 0;
            for (let key in targetState) {
                if (crumb.coordinates[key] !== undefined) {
                    const diff = targetState[key] - crumb.coordinates[key];
                    distSq += diff * diff;
                }
            }
            if (Math.sqrt(distSq) <= radius) {
                density += crumb.intensity;
            }
        });
        return density;
    }
}
