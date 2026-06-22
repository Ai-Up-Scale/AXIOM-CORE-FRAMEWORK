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

        // In a rigorous mathematical implementation, relevance is calculated via
        // cosine similarity or minimum Euclidean distance between state vectors.
        // For abstraction, we return the most recent low-error trace.
        
        let bestTrace = this.traceBuffer[0];
        for (let i = 1; i < this.traceBuffer.length; i++) {
            const trace = this.traceBuffer[i];
            // Prioritize traces with minimal historical prediction error
            if (trace.predictionError < bestTrace.predictionError) {
                bestTrace = trace;
            }
        }

        return bestTrace;
    }
}
