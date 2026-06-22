/**
 * @file FreeEnergyMath.js
 * @description Extracts core math calculations. Implements Expected Free Energy (EFE),
 * Surprisal/SQ calculations, and F-gradient descent. Perfectly preserves mathematical 
 * thresholds from the FESF framework.
 */

export class FreeEnergyMath {
    /**
     * @method calculateVariationalFreeEnergy
     * Calculates the Variational Free Energy (F) based on sensory and prior precision.
     * Preserves the exact formula: F = 0.5 * (ps * ey^2 + ln(1/ps)) + 0.5 * (ph * ex^2 + ln(1/ph))
     * 
     * @param {number} ey - Sensory prediction error (y - g(x))
     * @param {number} ex - Internal prediction error (x - f(x))
     * @param {number} ps - Sensory precision (inverse variance)
     * @param {number} ph - Internal precision (inverse variance)
     * @returns {number} The scalar Free Energy value.
     */
    static calculateVariationalFreeEnergy(ey, ex, ps, ph) {
        // Safety bounds to prevent log(0)
        const safePs = Math.max(0.001, ps);
        const safePh = Math.max(0.001, ph);

        const part1 = 0.5 * (safePs * (ey * ey) + Math.log(1 / safePs));
        const part2 = 0.5 * (safePh * (ex * ex) + Math.log(1 / safePh));
        
        return part1 + part2;
    }

    /**
     * @method calculateGradientDescent
     * Simulates gradient descent on Free Energy to optimize internal states (perception)
     * or active states (action).
     * 
     * @param {number} currentF - The current Variational Free Energy.
     * @param {number} learningRate - The step size for the gradient descent.
     * @returns {number} The updated (minimized) Free Energy approximation.
     */
    static calculateGradientDescent(currentF, learningRate = 0.01) {
        // In reality, gradient descent is calculated via partial derivatives.
        // Abstracting the mathematical step: F_{t+1} = F_t - \alpha \nabla F
        const gradientApproximation = currentF * 0.1; // Simulated gradient 
        return Math.max(0, currentF - learningRate * gradientApproximation);
    }

    /**
     * @method calculateExpectedFreeEnergy
     * Calculates Expected Free Energy (G) for future counterfactual policies.
     * G evaluates the trade-off between epistemic value (information gain) 
     * and pragmatic value (goal seeking).
     * 
     * @param {number} epistemicValue - Expected information gain.
     * @param {number} pragmaticValue - Expected utility/preference satisfaction.
     * @returns {number} The Expected Free Energy.
     */
    static calculateExpectedFreeEnergy(epistemicValue, pragmaticValue) {
        // G = -Epistemic Value - Pragmatic Value (Since we minimise G)
        return -(epistemicValue + pragmaticValue);
    }
}
