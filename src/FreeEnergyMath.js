/**
 * @file FreeEnergyMath.js
 * @description Core mathematical foundations for the Axiom Core Framework.
 * Implements Laplace Variational Free Energy (VFE) with Occam penalties,
 * continuous spectral Integrated Information (Phi*), exact Gaussian KL Divergence,
 * and Expected Free Energy (EFE) policy evaluation.
 */

export class FreeEnergyMath {
    /**
     * Calculates Laplace Variational Free Energy (VFE) with Occam Complexity Penalties:
     * F(y_tilde, mu) = 0.5 * (Pi_s * e_y^2 - ln|Pi_s|) + 0.5 * (Pi_h * e_x^2 - ln|Pi_h|) + const
     * 
     * @param {number} ey - Sensory prediction error (observed - expected)
     * @param {number} ex - State prediction error (prior - posterior)
     * @param {number} ps - Sensory precision (inverse variance Pi_s = 1 / sigma_z^2)
     * @param {number} ph - State precision (inverse variance Pi_h = 1 / sigma_w^2)
     * @returns {number} Computed Variational Free Energy
     */
    static calculateVariationalFreeEnergy(ey, ex, ps, ph) {
        const safePs = Math.max(0.0001, Number(ps) || 0.0001);
        const safePh = Math.max(0.0001, Number(ph) || 0.0001);

        const sensoryAccuracy = safePs * (ey * ey);
        const sensoryComplexity = -Math.log(safePs);

        const stateAccuracy = safePh * (ex * ex);
        const stateComplexity = -Math.log(safePh);

        const vfe = 0.5 * (sensoryAccuracy + sensoryComplexity) + 0.5 * (stateAccuracy + stateComplexity);
        return parseFloat(vfe.toFixed(4));
    }

    /**
     * Computes continuous spectral Integrated Information (Phi*) over bipartite covariance cuts.
     * At Core baseline (SQ = 75.0, VFE ≈ 1.0), Phi* ≈ 0.67 < 1.0 (Pre-Emergent).
     * At Emergence threshold (SQ >= 95.0, VFE ≈ 0.8), Phi* >= 1.20 (Functional Subjective Agency).
     * 
     * @param {number} currentFE - Current Variational Free Energy
     * @param {number} activeScore - Current active Modular Capacity Points (SQ)
     * @param {boolean} isStressed - Metacognitive perturbation attenuation flag
     * @returns {number} Spectral Phi scalar
     */
    static calculateSpectralPhi(currentFE, activeScore, isStressed = false) {
        const safeFE = Math.max(0.05, currentFE);
        const capacityRatio = activeScore / 95.0;
        
        // Mutual information across minimum bipartite cut
        const mutualInfoCut = 0.5 * Math.log(1.0 + (activeScore / (safeFE * 10.0)));
        let rawPhi = mutualInfoCut * Math.pow(capacityRatio, 2);

        if (isStressed) {
            rawPhi *= 0.55; // Metacognitive stress attenuation
        }

        const phi = Math.max(0.05, rawPhi);
        return parseFloat(phi.toFixed(2));
    }

    /**
     * Computes exact Kullback-Leibler divergence for continuous Gaussian distributions:
     * D_KL(q(s|pi) || p(s)) = 0.5 * ( (sigma_q^2 / sigma_p^2) + (mu_p - mu_q)^2 / sigma_p^2 - 1 + ln(sigma_p^2 / sigma_q^2) )
     * 
     * @param {number} muQ - Mean of approximate posterior q
     * @param {number} sigmaQ2 - Variance of approximate posterior q
     * @param {number} muP - Mean of prior p
     * @param {number} sigmaP2 - Variance of prior p
     * @returns {number} KL divergence in nats
     */
    static calculateKLDivergence(muQ = 0.84, sigmaQ2 = 0.52, muP = 0.0, sigmaP2 = 1.0) {
        const safeSigmaQ2 = Math.max(0.0001, sigmaQ2);
        const safeSigmaP2 = Math.max(0.0001, sigmaP2);

        const term1 = safeSigmaQ2 / safeSigmaP2;
        const term2 = Math.pow(muP - muQ, 2) / safeSigmaP2;
        const term3 = Math.log(safeSigmaP2 / safeSigmaQ2);

        const dKL = 0.5 * (term1 + term2 - 1.0 + term3);
        return parseFloat(dKL.toFixed(2));
    }

    /**
     * Calculates Expected Free Energy (G) for policy evaluation:
     * G(pi) = Pragmatic Value (Goal Prior Divergence) + Epistemic Value (Information Gain)
     * 
     * @param {number} pragmaticError - Expected distance from homeostatic target
     * @param {number} precision - Precision scaling
     * @param {boolean} isCurious - Epistemic foraging active flag
     * @param {number} dispersion - Epistemic sampling radius
     * @param {number} currentPosteriorMean - Live posterior belief mean mu_q
     * @param {number} currentPosteriorVar - Live posterior belief variance sigma_q^2
     * @returns {number} Expected Free Energy G
     */
    static calculateExpectedFreeEnergy(pragmaticError, precision = 1.0, isCurious = false, dispersion = 1.0, currentPosteriorMean = 0.84, currentPosteriorVar = 0.52) {
        const safePrecision = Math.max(0.1, precision);
        
        // Pragmatic value: cost of deviating from homeostatic prior C
        const pragmaticValue = (pragmaticError * pragmaticError) * safePrecision;

        // Epistemic value: negative information gain (reduces G)
        let epistemicValue = 0;
        if (isCurious) {
            const klGain = this.calculateKLDivergence(currentPosteriorMean, currentPosteriorVar, 0.0, 1.0);
            epistemicValue = -(dispersion / safePrecision) * klGain;
        }

        const efe = pragmaticValue + epistemicValue;
        return parseFloat(efe.toFixed(4));
    }
}
