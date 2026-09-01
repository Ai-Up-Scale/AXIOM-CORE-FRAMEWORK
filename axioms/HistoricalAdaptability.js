/**
 * @file HistoricalAdaptability.js
 * @description Handles episodic memory and temporal binding abstractions.
 * Provides a topological trace buffer for the engine to query past states,
 * facilitating temporal continuity and associative learning.
 */

export class HistoricalAdaptability {
    /**
     * @constructor
     * Initializes the trace buffer.
     * @param {number} maxCapacity - Maximum number of traces to retain.
     */
    constructor(maxCapacity = 1000) {
        this.maxCapacity = maxCapacity;
        this.traceBuffer = []; // Implements a FIFO queue for memory states
    }

    /**
     * @method storeTrace
     * Stores a snapshot of the cognitive state along with its associated prediction error.
     * 
     * @param {Object} state - The complete or partial state vector at time t.
     * @param {number} predictionError - The associated surprise (Free Energy) at time t.
     */
    storeTrace(state, predictionError) {
        const trace = {
            timestamp: Date.now(),
            state: JSON.parse(JSON.stringify(state)), // Deep copy to prevent reference mutation
            predictionError: predictionError
        };

        this.traceBuffer.push(trace);

        // Prune oldest traces if capacity is exceeded
        if (this.traceBuffer.length > this.maxCapacity) {
            this.traceBuffer.shift();
        }
    }

    /**
     * @method retrieveRelevantTrace
     * Retrieves the most contextually relevant past state based on the current state.
     * Typically used when current Free Energy is critically high to resolve uncertainty
     * using historical precedents.
     * 
     * @param {Object} currentState - The current cognitive/sensory state.
     * @returns {Object|null} The most relevant historical trace, or null if buffer is empty.
     */
    retrieveRelevantTrace(currentState) {
        if (this.traceBuffer.length === 0) return null;

        const targetMu = (currentState && currentState.beliefs) ? currentState.beliefs : [0, 0];
        let bestTrace = this.traceBuffer[0];
        let minScore = Infinity;

        for (let i = 0; i < this.traceBuffer.length; i++) {
            const trace = this.traceBuffer[i];
            const traceMu = (trace.state && trace.state.beliefs) ? trace.state.beliefs : [0, 0];
            const dist = Math.hypot(
                (traceMu[0] ?? 0) - (targetMu[0] ?? 0),
                (traceMu[1] ?? 0) - (targetMu[1] ?? 0)
            );
            const score = dist + 0.05 * Math.max(0, trace.predictionError);
            if (score < minScore) {
                minScore = score;
                bestTrace = trace;
            }
        }

        return bestTrace;
    }
}
