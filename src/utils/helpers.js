/**
 * SLaNg Helper Utilities
 * High-level helpers for common mathematical operations
 */

import {
    createTerm,
    createFraction,
    definiteIntegrateFraction,
    expandProduct,
    simplifyFraction,
    evaluateEquation,
    differentiateFraction,
    deepClone
} from './slang-math.js';

// ============================================================================
// EQUATION BUILDERS
// ============================================================================

/**
 * Create a polynomial from coefficients
 * @param {Array<number>} coeffs - Coefficients from highest to lowest degree
 * @param {string} variable - Variable name (default 'x')
 * 
 * Example: polynomial([1, -2, 1], 'x') creates x² - 2x + 1
 */
function polynomial(coeffs, variable = 'x') {
    const terms = [];
    const degree = coeffs.length - 1;

    for (let i = 0; i < coeffs.length; i++) {
        const power = degree - i;
        const coeff = coeffs[i];

        if (coeff === 0) continue;

        if (power === 0) {
            terms.push(createTerm(coeff));
        } else {
            terms.push(createTerm(coeff, { [variable]: power }));
        }
    }

    return [[createFraction(terms, 1)]];
}

/**
 * Create a monomial: coeff * x^px * y^py * z^pz * ...
 */
function monomial(coeff, powers = {}) {
    return [[createFraction([createTerm(coeff, powers)], 1)]];
}

/**
 * Create a sum of monomials
 * @param {Array} terms - Array of [coeff, powers] pairs
 * 
 * Example: sum([[2, {x:2}], [3, {x:1}], [1, {}]]) creates 2x² + 3x + 1
 */
function sum(terms) {
    const slangTerms = terms.map(([coeff, powers]) => createTerm(coeff, powers));
    return [[createFraction(slangTerms, 1)]];
}

/**
 * Create a product of polynomials
 * @param {Array} factors - Array of polynomial fractions
 * 
 * Example: product([[1+x], [1-x]]) creates (1+x)(1-x)
 */
function product(...factors) {
    // Convert each factor array to fraction format
    const fractions = factors.map(factor => {
        if (Array.isArray(factor[0][0]?.numi?.terms)) {
            return factor[0][0]; // Already a fraction
        }
        return createFraction(factor.map(([c, p]) => createTerm(c, p)), 1);
    });

    return [fractions];
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

/**
 * Compute definite integral over a rectangular region
 * @param {Object} expr - Expression to integrate
 * @param {Object} bounds - {x: [lower, upper], y: [lower, upper], ...}
 * 
 * Example: 
 * integralOverRegion(xy, {x: [0, 2], y: [0, 3]})
 * computes ∫₀² ∫₀³ xy dy dx
 */
function integralOverRegion(expr, bounds) {
    let result = deepClone(expr);

    for (let [variable, [lower, upper]] of Object.entries(bounds)) {
        result = definiteIntegrateFraction(result, lower, upper, variable);
        result = simplifyFraction(result);
    }

    return result;
}

/**
 * Compute integral and return numeric value
 */
function integralValue(expr, bounds) {
    const result = integralOverRegion(expr, bounds);
    return evaluateEquation([[result]], {});
}

/**
 * Compute partial derivative with respect to variable
 * @param {Object} expr - Expression to differentiate
 * @param {string} variable - Variable to differentiate with respect to
 * @param {number} order - Order of derivative (default 1)
 */
function partialDerivative(expr, variable, order = 1) {
    let result = deepClone(expr);

    for (let i = 0; i < order; i++) {
        result = differentiateFraction(result, variable);
        result = simplifyFraction(result);
    }

    return result;
}

/**
 * Expand and simplify a product expression
 */
function expandAndSimplify(productArray) {
    const expanded = expandProduct(productArray);
    return simplifyFraction(expanded);
}

/**
 * Evaluate expression at point
 * @param {Object} expr - Expression in equation format
 * @param {Object} point - {x: value, y: value, ...}
 */
function evaluateAt(expr, point) {
    return evaluateEquation([Array.isArray(expr) ? expr : [expr]], point);
}

// ============================================================================
// COMMON FORMULAS
// ============================================================================

/**
 * Common mathematical functions as SLaNg expressions
 */
const formulas = {
    // Circle area element: r dr dθ
    circleAreaElement: (r = 'r') =>
        [[createFraction([createTerm(1, { [r]: 1 })], 1)]],

    // Disk of radius R: ∫₀²ᵖ ∫₀ᴿ r dr dθ
    diskArea: (R) => {
        const rdr = formulas.circleAreaElement('r');
        return integralValue(rdr[0][0], { r: [0, R] }) * 2 * Math.PI;
    },

    // Sphere volume element in spherical coords: r² sin(φ) dr dφ dθ
    // (approximated for polynomial case)

    // Average value of f over [a,b]: 1/(b-a) ∫ₐᵇ f dx
    average: (expr, variable, a, b) => {
        const integral = definiteIntegrateFraction(expr, a, b, variable);
        const value = evaluateEquation([[integral]], {});
        return value / (b - a);
    },

    // Center of mass (1D): ∫ x·ρ(x) dx / ∫ ρ(x) dx
    centerOfMass1D: (density, variable, a, b) => {
        // Create x * density
        const xDensity = deepClone(density);
        for (let term of xDensity.numi.terms) {
            if (!term.var) term.var = {};
            term.var[variable] = (term.var[variable] || 0) + 1;
        }

        const numerator = integralValue(xDensity, { [variable]: [a, b] });
        const denominator = integralValue(density, { [variable]: [a, b] });

        return numerator / denominator;
    }
};

// ============================================================================
// GEOMETRY HELPERS
// ============================================================================

/**
 * Volume under surface z = f(x,y) over region R
 */
function volumeUnderSurface(surface, xBounds, yBounds) {
    return integralValue(surface, { x: xBounds, y: yBounds });
}

/**
 * Area of region in xy-plane (integrate 1 over region)
 */
function areaOfRegion(xBounds, yBounds) {
    const one = createFraction([createTerm(1)], 1);
    return integralValue(one, { x: xBounds, y: yBounds });
}

// ============================================================================
// VERIFICATION HELPERS
// ============================================================================

/**
 * Check if integration was done correctly by differentiating
 */
function verifyIntegration(original, integrated, variable) {
    const derivative = differentiateFraction(integrated, variable);
    const simplified = simplifyFraction(derivative);

    // Compare structures (simple comparison)
    return JSON.stringify(simplifyFraction(original)) ===
        JSON.stringify(simplified);
}

/**
 * Numerical verification: sample at random points
 */
function numericalVerification(expr1, expr2, variables, numSamples = 10) {
    const errors = [];

    for (let i = 0; i < numSamples; i++) {
        const point = {};
        for (let v of variables) {
            point[v] = Math.random() * 10 - 5; // Random value in [-5, 5]
        }

        const val1 = evaluateAt([expr1], point);
        const val2 = evaluateAt([expr2], point);
        const error = Math.abs(val1 - val2);

        if (error > 1e-10) {
            errors.push({ point, val1, val2, error });
        }
    }

    return {
        passed: errors.length === 0,
        errors
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    // Builders
    polynomial,
    monomial,
    sum,
    product,

    // Calculations
    integralOverRegion,
    integralValue,
    partialDerivative,
    expandAndSimplify,
    evaluateAt,

    // Formulas
    formulas,

    // Geometry
    volumeUnderSurface,
    areaOfRegion,

    // Verification
    verifyIntegration,
    numericalVerification
};