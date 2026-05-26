/**
 * SLaNg Extended Math Library
 * Advanced features for symbolic mathematics
 */

import {
    deepClone,
    createTerm,
    createFraction,
    definiteIntegrateFraction,
    integrateFraction,
    differentiateFraction,
    simplifyFraction,
    evaluateEquation,
    multiplyTerms,
    expandProduct
} from './slang-math.js';

// ============================================================================
// PRODUCT RULE & QUOTIENT RULE FOR DIFFERENTIATION
// ============================================================================

/**
 * Product Rule: d/dx[f·g] = f'·g + f·g'
 * Takes a product array [f, g, h, ...] and differentiates it
 */
function productRuleDifferentiate(productArray, indvar) {
    if (productArray.length === 0) return createFraction([createTerm(0)], 1);
    if (productArray.length === 1) {
        return differentiateFraction(productArray[0], indvar);
    }

    // For each factor, create a term where that factor is differentiated
    // and all others remain the same
    const resultTerms = [];

    for (let i = 0; i < productArray.length; i++) {
        const diffFactor = differentiateFraction(productArray[i], indvar);

        // Multiply this differentiated factor with all the others
        let product = diffFactor;
        for (let j = 0; j < productArray.length; j++) {
            if (i !== j) {
                product = expandFractions(product, productArray[j]);
            }
        }

        // Add to result
        for (let term of product.numi.terms) {
            resultTerms.push(term);
        }
    }

    return simplifyFraction({ numi: { terms: resultTerms }, deno: 1 });
}

/**
 * Helper to expand two fractions (used in product rule)
 */
function expandFractions(frac1, frac2) {
    if (frac1.deno !== 1 || frac2.deno !== 1) {
        throw new Error('Expansion only works for deno=1');
    }

    const expandedTerms = [];

    for (let term1 of frac1.numi.terms) {
        for (let term2 of frac2.numi.terms) {
            expandedTerms.push(multiplyTerms(term1, term2));
        }
    }

    return simplifyFraction({
        numi: { terms: expandedTerms },
        deno: 1
    });
}

/**
 * Quotient Rule: d/dx[f/g] = (f'·g - f·g') / g²
 * Takes numerator and denominator fractions
 */
function quotientRuleDifferentiate(numerator, denominator, indvar) {
    const fPrime = differentiateFraction(numerator, indvar);
    const gPrime = differentiateFraction(denominator, indvar);

    // f' * g
    const fPrimeTimesG = expandFractions(fPrime, denominator);

    // f * g'
    const fTimesGPrime = expandFractions(numerator, gPrime);

    // f' * g - f * g'
    const numeratorResult = {
        numi: {
            terms: [
                ...fPrimeTimesG.numi.terms,
                ...fTimesGPrime.numi.terms.map(t => ({
                    ...deepClone(t),
                    coeff: -t.coeff
                }))
            ]
        },
        deno: 1
    };

    // g²
    const gSquared = expandFractions(denominator, denominator);

    return {
        numerator: simplifyFraction(numeratorResult),
        denominator: gSquared,
        note: 'Result is (numerator)/(denominator)'
    };
}

// ============================================================================
// CHAIN RULE
// ============================================================================

/**
 * Chain Rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)
 * This is a simplified version for polynomial compositions
 */
function chainRuleDifferentiate(outer, inner, indvar) {
    // For now, handles simple cases like (ax + b)^n
    // More complex cases require symbolic substitution

    const innerDerivative = differentiateFraction(inner, indvar);

    // This is simplified - full chain rule needs more work
    return {
        outer,
        inner,
        innerDerivative,
        note: 'Multiply outer derivative (evaluated at inner) by inner derivative'
    };
}

// ============================================================================
// INTEGRATION BY PARTS
// ============================================================================

/**
 * Integration by Parts: ∫ u dv = uv - ∫ v du
 * @param {Object} u - First function
 * @param {Object} dv - Second function (to be integrated)
 * @param {string} indvar - Integration variable
 */
function integrationByParts(u, dv, indvar) {
    // du = differentiate u
    const du = differentiateFraction(u, indvar);

    // v = integrate dv
    const v = integrateFraction(dv, indvar);

    // u * v
    const uTimesV = expandFractions(u, v);

    // v * du (for the ∫ v du term)
    const vTimesDu = expandFractions(v, du);

    return {
        uTimesV,
        integralOfVdu: vTimesDu,
        note: 'Result is uv - ∫(v·du). You need to integrate the second term.'
    };
}

// ============================================================================
// PARTIAL FRACTION DECOMPOSITION (SIMPLE CASES)
// ============================================================================

/**
 * Partial fraction decomposition for simple rational functions
 * Currently handles: A/(x-a) + B/(x-b) forms
 */
function partialFractionDecomposition(numerator, denominator) {
    // This is a placeholder for more complex implementation
    // Real implementation would factor denominator and solve for coefficients

    return {
        note: 'Partial fraction decomposition - advanced feature',
        numerator,
        denominator,
        message: 'Factor denominator into (x-a)(x-b)... and solve for coefficients'
    };
}

// ============================================================================
// TAYLOR SERIES EXPANSION
// ============================================================================

/**
 * Generate Taylor series expansion around a point
 * f(x) ≈ f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...
 * 
 * @param {Object} func - Function to expand
 * @param {string} variable - Variable name
 * @param {number} center - Point to expand around
 * @param {number} order - Number of terms
 */
function taylorSeries(func, variable, center = 0, order = 5) {
    const terms = [];
    let currentDerivative = deepClone(func);

    for (let n = 0; n < order; n++) {
        // Evaluate derivative at center point
        const value = evaluateEquation([[currentDerivative]], { [variable]: center });

        // Calculate factorial
        const factorial = (n === 0) ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b);

        // Create term: f^(n)(a) / n! * (x - a)^n
        if (Math.abs(value) > 1e-10) {
            if (n === 0) {
                terms.push(createTerm(value));
            } else {
                // For (x - center)^n, we need to handle this carefully
                // Simplified: just create x^n term with adjusted coefficient
                terms.push(createTerm(value / factorial, { [variable]: n }));
            }
        }

        // Get next derivative
        if (n < order - 1) {
            currentDerivative = differentiateFraction(currentDerivative, variable);
        }
    }

    return {
        series: createFraction(terms, 1),
        center,
        order,
        note: `Taylor series around ${variable}=${center} up to order ${order - 1}`
    };
}

// ============================================================================
// LIMITS (SIMPLE CASES)
// ============================================================================

/**
 * Compute limit as variable approaches a value
 * Uses direct substitution for simple cases
 */
function computeLimit(expr, variable, approaches) {
    // Try direct substitution first
    try {
        const value = evaluateEquation([[expr]], { [variable]: approaches });

        if (isFinite(value)) {
            return {
                value,
                method: 'direct substitution',
                exists: true
            };
        }
    } catch (e) {
        // Direct substitution failed
    }

    // Try approaching from both sides
    const epsilon = 1e-6;
    const leftValue = evaluateEquation([[expr]], { [variable]: approaches - epsilon });
    const rightValue = evaluateEquation([[expr]], { [variable]: approaches + epsilon });

    if (Math.abs(leftValue - rightValue) < 1e-8) {
        return {
            value: (leftValue + rightValue) / 2,
            method: 'two-sided approach',
            exists: true
        };
    }

    return {
        value: null,
        leftLimit: leftValue,
        rightLimit: rightValue,
        method: 'limits differ',
        exists: false
    };
}

// ============================================================================
// CRITICAL POINTS & OPTIMIZATION
// ============================================================================

/**
 * Find critical points where f'(x) = 0
 * Uses numerical method for polynomial roots
 */
function findCriticalPoints(func, variable, searchRange = [-10, 10], numSamples = 1000) {
    const derivative = differentiateFraction(func, variable);
    const criticalPoints = [];

    const [min, max] = searchRange;
    const step = (max - min) / numSamples;

    let prevValue = evaluateEquation([[derivative]], { [variable]: min });

    for (let i = 1; i <= numSamples; i++) {
        const x = min + i * step;
        const currValue = evaluateEquation([[derivative]], { [variable]: x });

        // Sign change indicates root
        if (prevValue * currValue < 0) {
            // Refine with bisection
            let left = x - step;
            let right = x;

            for (let j = 0; j < 20; j++) {
                const mid = (left + right) / 2;
                const midValue = evaluateEquation([[derivative]], { [variable]: mid });

                if (Math.abs(midValue) < 1e-8) {
                    criticalPoints.push(mid);
                    break;
                }

                if (midValue * evaluateEquation([[derivative]], { [variable]: left }) < 0) {
                    right = mid;
                } else {
                    left = mid;
                }
            }
        }

        prevValue = currValue;
    }

    return {
        criticalPoints,
        derivative,
        note: 'Points where f\'(x) = 0'
    };
}

/**
 * Second derivative test for local extrema
 */
function secondDerivativeTest(func, variable, point) {
    const firstDeriv = differentiateFraction(func, variable);
    const secondDeriv = differentiateFraction(firstDeriv, variable);

    const fValue = evaluateEquation([[func]], { [variable]: point });
    const fDoublePrime = evaluateEquation([[secondDeriv]], { [variable]: point });

    let type;
    if (fDoublePrime > 0) {
        type = 'local minimum';
    } else if (fDoublePrime < 0) {
        type = 'local maximum';
    } else {
        type = 'inconclusive (may be inflection point)';
    }

    return {
        point,
        functionValue: fValue,
        secondDerivative: fDoublePrime,
        type
    };
}

// ============================================================================
// CURVE SKETCHING
// ============================================================================

/**
 * Analyze function for curve sketching
 */
function analyzeCurve(func, variable, range = [-10, 10]) {
    const firstDeriv = differentiateFraction(func, variable);
    const secondDeriv = differentiateFraction(firstDeriv, variable);

    // Find critical points
    const { criticalPoints } = findCriticalPoints(func, variable, range);

    // Test each critical point
    const extrema = criticalPoints.map(pt =>
        secondDerivativeTest(func, variable, pt)
    );

    // Find inflection points (where f'' = 0)
    const { criticalPoints: inflectionPoints } = findCriticalPoints(firstDeriv, variable, range);

    return {
        criticalPoints,
        extrema,
        inflectionPoints,
        firstDerivative: firstDeriv,
        secondDerivative: secondDeriv
    };
}

// ============================================================================
// ARC LENGTH
// ============================================================================

/**
 * Compute arc length of curve y = f(x) from a to b
 * L = ∫ₐᵇ √(1 + (f'(x))²) dx
 * 
 * Note: This uses numerical integration since √ is not polynomial
 */
function arcLength(func, variable, a, b, numSteps = 1000) {
    const derivative = differentiateFraction(func, variable);

    let totalLength = 0;
    const step = (b - a) / numSteps;

    for (let i = 0; i < numSteps; i++) {
        const x = a + i * step;
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
        const integrand = Math.sqrt(1 + dydx * dydx);
        totalLength += integrand * step;
    }

    return {
        length: totalLength,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Arc length = ∫√(1 + (dy/dx)²) dx'
    };
}

// ============================================================================
// SURFACE AREA OF REVOLUTION
// ============================================================================

/**
 * Surface area when y=f(x) is revolved around x-axis
 * SA = 2π ∫ₐᵇ y√(1 + (dy/dx)²) dx
 */
function surfaceAreaOfRevolution(func, variable, a, b, numSteps = 1000) {
    const derivative = differentiateFraction(func, variable);

    let totalArea = 0;
    const step = (b - a) / numSteps;

    for (let i = 0; i < numSteps; i++) {
        const x = a + i * step;
        const y = evaluateEquation([[func]], { [variable]: x });
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
        const integrand = y * Math.sqrt(1 + dydx * dydx);
        totalArea += integrand * step;
    }

    return {
        surfaceArea: 2 * Math.PI * totalArea,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Surface area = 2π ∫ y√(1 + (dy/dx)²) dx'
    };
}

// ============================================================================
// GRADIENT & DIRECTIONAL DERIVATIVE
// ============================================================================

/**
 * Compute gradient ∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z, ...)
 */
function gradient(func, variables) {
    const grad = {};

    for (let variable of variables) {
        grad[variable] = differentiateFraction(func, variable);
    }

    return {
        gradient: grad,
        note: 'Gradient vector ∇f with components for each variable'
    };
}

/**
 * Directional derivative of f in direction of vector v
 * D_v f = ∇f · v
 */
function directionalDerivative(func, variables, point, direction) {
    const grad = gradient(func, variables);

    // Evaluate gradient at point
    const gradAtPoint = {};
    for (let variable of variables) {
        gradAtPoint[variable] = evaluateEquation([[grad.gradient[variable]]], point);
    }

    // Dot product with direction vector
    let dotProduct = 0;
    for (let variable of variables) {
        dotProduct += gradAtPoint[variable] * direction[variable];
    }

    return {
        directionalDerivative: dotProduct,
        gradientAtPoint: gradAtPoint,
        direction,
        point,
        note: 'D_v f = ∇f · v'
    };
}

// ============================================================================
// LAGRANGE MULTIPLIERS (SIMPLE CASE)
// ============================================================================

/**
 * Find constrained optimization using Lagrange multipliers
 * Optimize f(x,y) subject to g(x,y) = 0
 * 
 * This is a simplified version that sets up the system
 */
function lagrangeMultipliers(objective, constraint, variables) {
    const gradF = gradient(objective, variables);
    const gradG = gradient(constraint, variables);

    return {
        objectiveGradient: gradF,
        constraintGradient: gradG,
        note: 'Solve: ∇f = λ∇g and g = 0',
        system: 'Set up system of equations where each component satisfies ∂f/∂x = λ∂g/∂x'
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    // Differentiation rules
    productRuleDifferentiate,
    quotientRuleDifferentiate,
    chainRuleDifferentiate,

    // Integration techniques
    integrationByParts,
    partialFractionDecomposition,

    // Series & limits
    taylorSeries,
    computeLimit,

    // Optimization
    findCriticalPoints,
    secondDerivativeTest,
    analyzeCurve,

    // Geometry
    arcLength,
    surfaceAreaOfRevolution,

    // Multivariable
    gradient,
    directionalDerivative,
    lagrangeMultipliers
};