/**
 * @aiupscale/axiom-core
 * Main entry point for the headless Axiom Core Cognitive Engine.
 */

export { 
    AxiomEngine, 
    AxiomCore, 
    FESF_LIMITS, 
    EXCLUSIVE_CONFLICTS, 
    CORE_MODULE_WEIGHTS, 
    FLAVOR_MODULE_WEIGHTS 
} from './AxiomCore.js';

export { FreeEnergyMath } from './FreeEnergyMath.js';
export { GenerativeModel } from './GenerativeModel.js';

// Axioms
export { Stigmergy } from '../axioms/Stigmergy.js';
export { GlobalDistress } from '../axioms/GlobalDistress.js';
export { SelfMaintenance } from '../axioms/SelfMaintenance.js';
export { HistoricalAdaptability } from '../axioms/HistoricalAdaptability.js';
export { AutonomousAgency } from '../axioms/AutonomousAgency.js';
