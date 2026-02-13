/**
 * SLaNg (Symbolic Language) - Math Library
 * For manipulating symbolic mathematical expressions
 */

// ============================================================================
// DEEP COPY UTILITIES
// ============================================================================

/**
 * Deep clone an equation to avoid mutation
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ============================================================================
// TERM CREATION UTILITIES
// ============================================================================

/**
 * Create a term with coefficient and optional variables
 * @param {number} coeff - Coefficient
 * @param {Object} vars - Variables object like {x: 2, y: 1}
 */
function createTerm(coeff, vars = {}) {
    const term = { coeff };
    if (Object.keys(vars).length > 0) {
        term.var = { ...vars };
    }
    return term;
}

/**
 * Create a simple fraction (numi/deno)
 * @param {Array} terms - Array of terms for numerator
 * @param {number} deno - Denominator (default 1)
 */
function createFraction(terms, deno = 1) {
    return {
        numi: { terms: deepClone(terms) },
        deno
    };
}

// ============================================================================
// EVALUATION FUNCTIONS
// ============================================================================

/**
 * Evaluate a term at given variable values
 * @param {Object} term - A single term
 * @param {Object} values - Variable values like {x: 2, y: 3}
 */
function evaluateTerm(term, values) {
    let result = term.coeff;

    if (term.var) {
        for (let [variable, power] of Object.entries(term.var)) {
            if (values[variable] === undefined) {
                throw new Error(`Variable ${variable} not provided`);
            }
            result *= Math.pow(values[variable], power);
        }
    }

    return result;
}

/**
 * Evaluate a fraction (sum of terms / denominator)
 */
function evaluateFraction(fraction, values) {
    let numeratorSum = 0;

    for (let term of fraction.numi.terms) {
        numeratorSum += evaluateTerm(term, values);
    }

    return numeratorSum / fraction.deno;
}

/**
 * Evaluate a product (array of fractions multiplied together)
 */
function evaluateProduct(product, values) {
    let result = 1;

    for (let fraction of product) {
        result *= evaluateFraction(fraction, values);
    }

    return result;
}

/**
 * Evaluate entire equation (sum of products)
 */
function evaluateEquation(equation, values) {
    let result = 0;

    for (let product of equation) {
        result += evaluateProduct(product, values);
    }

    return result;
}

// ============================================================================
// INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Integrate a single term with respect to a variable
 * Power rule: ∫ c*x^n dx = c/(n+1) * x^(n+1)
 */
function integrateTerm(term, indvar) {
    const newTerm = deepClone(term);

    // Get current power of the variable (0 if not present)
    const power = newTerm.var?.[indvar] ?? 0;

    // Apply power rule
    newTerm.coeff = newTerm.coeff / (power + 1);

    // Increment power
    if (!newTerm.var) {
        newTerm.var = {};
    }
    newTerm.var[indvar] = power + 1;

    return newTerm;
}

/**
 * Integrate a fraction (indefinite integral)
 * Note: This only works for simple polynomial fractions
 */
function integrateFraction(fraction, indvar) {
    const newFraction = deepClone(fraction);

    // Integrate each term in the numerator
    newFraction.numi.terms = newFraction.numi.terms.map(term =>
        integrateTerm(term, indvar)
    );

    return newFraction;
}

/**
 * Definite integration of a term
 * Evaluates ∫[lower to upper] term dx
 */
function definiteIntegrateTerm(term, lower, upper, indvar) {
    const integratedTerm = integrateTerm(term, indvar);

    // Get power of integration variable in the integrated term
    const intPower = integratedTerm.var?.[indvar] ?? 0;

    // Calculate the coefficient multiplier from bounds
    const upperValue = Math.pow(upper, intPower);
    const lowerValue = Math.pow(lower, intPower);
    const boundsDiff = upperValue - lowerValue;

    // Create result term
    const resultTerm = deepClone(integratedTerm);
    resultTerm.coeff = resultTerm.coeff * boundsDiff;

    // Remove the integration variable
    if (resultTerm.var) {
        delete resultTerm.var[indvar];
        if (Object.keys(resultTerm.var).length === 0) {
            delete resultTerm.var;
        }
    }

    return resultTerm;
}

/**
 * Definite integration of a fraction
 */
function definiteIntegrateFraction(fraction, lower, upper, indvar) {
    // For denominator ≠ 1, this is simplified - proper implementation 
    // would need to handle rational functions more carefully
    if (fraction.deno !== 1) {
        console.warn('Definite integration with deno ≠ 1 may be inaccurate');
    }

    const newFraction = {
        numi: {
            terms: fraction.numi.terms.map(term =>
                definiteIntegrateTerm(term, lower, upper, indvar)
            )
        },
        deno: fraction.deno
    };

    return newFraction;
}

// ============================================================================
// DIFFERENTIATION FUNCTIONS
// ============================================================================

/**
 * Differentiate a term with respect to a variable
 * Power rule: d/dx(c*x^n) = c*n*x^(n-1)
 */
function differentiateTerm(term, indvar) {
    const newTerm = deepClone(term);

    // Get current power
    const power = newTerm.var?.[indvar];

    // If variable not present, derivative is 0
    if (power === undefined) {
        return createTerm(0);
    }

    // Apply power rule
    newTerm.coeff = newTerm.coeff * power;

    // Decrease power
    if (power === 1) {
        // x^1 becomes x^0 = 1, so remove variable
        delete newTerm.var[indvar];
        if (Object.keys(newTerm.var).length === 0) {
            delete newTerm.var;
        }
    } else {
        newTerm.var[indvar] = power - 1;
    }

    return newTerm;
}

/**
 * Differentiate a fraction
 */
function differentiateFraction(fraction, indvar) {
    // For simple case where deno = 1
    if (fraction.deno === 1) {
        return {
            numi: {
                terms: fraction.numi.terms.map(term =>
                    differentiateTerm(term, indvar)
                ).filter(term => term.coeff !== 0) // Remove zero terms
            },
            deno: 1
        };
    }

    // For general case, would need quotient rule - TODO
    throw new Error('Differentiation with deno ≠ 1 not yet implemented');
}

// ============================================================================
// SIMPLIFICATION FUNCTIONS
// ============================================================================

/**
 * Combine like terms in a fraction's numerator
 */
function simplifyFraction(fraction) {
    const termMap = new Map();

    for (let term of fraction.numi.terms) {
        // Create a key from variables
        const varKey = term.var ? JSON.stringify(term.var) : 'constant';

        if (termMap.has(varKey)) {
            // Add coefficients of like terms
            termMap.get(varKey).coeff += term.coeff;
        } else {
            termMap.set(varKey, deepClone(term));
        }
    }

    // Filter out zero terms
    const simplifiedTerms = Array.from(termMap.values())
        .filter(term => Math.abs(term.coeff) > 1e-10);

    return {
        numi: { terms: simplifiedTerms },
        deno: fraction.deno
    };
}

/**
 * Simplify an entire product
 */
function simplifyProduct(product) {
    return product.map(fraction => simplifyFraction(fraction));
}

/**
 * Simplify entire equation
 */
function simplifyEquation(equation) {
    return equation.map(product => simplifyProduct(product));
}

// ============================================================================
// EXPANSION FUNCTIONS (Multiply out products)
// ============================================================================

/**
 * Multiply two terms together
 */
function multiplyTerms(term1, term2) {
    const result = {
        coeff: term1.coeff * term2.coeff
    };

    // Combine variables (add exponents for same variable)
    const vars = {};

    if (term1.var) {
        for (let [v, pow] of Object.entries(term1.var)) {
            vars[v] = pow;
        }
    }

    if (term2.var) {
        for (let [v, pow] of Object.entries(term2.var)) {
            vars[v] = (vars[v] || 0) + pow;
        }
    }

    if (Object.keys(vars).length > 0) {
        result.var = vars;
    }

    return result;
}

/**
 * Expand product of two fractions (both with deno=1)
 * (a + b)(c + d) = ac + ad + bc + bd
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
 * Expand a product into a single fraction
 */
function expandProduct(product) {
    if (product.length === 0) {
        return createFraction([createTerm(1)]);
    }

    let result = product[0];

    for (let i = 1; i < product.length; i++) {
        result = expandFractions(result, product[i]);
    }

    return result;
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

/**
 * Convert term to readable string
 */
function termToString(term) {
    let str = term.coeff.toString();

    if (term.var) {
        for (let [variable, power] of Object.entries(term.var)) {
            str += `*${variable}`;
            if (power !== 1) {
                str += `^${power}`;
            }
        }
    }

    return str;
}

/**
 * Convert fraction to readable string
 */
function fractionToString(fraction) {
    const numi = fraction.numi.terms.map(termToString).join(' + ');

    if (fraction.deno === 1) {
        return `(${numi})`;
    }

    return `(${numi})/(${fraction.deno})`;
}

/**
 * Convert product to readable string
 */
function productToString(product) {
    return product.map(fractionToString).join(' * ');
}

/**
 * Convert equation to readable string
 */
function equationToString(equation) {
    return equation.map(productToString).join(' + ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    // Utilities
    deepClone,
    createTerm,
    createFraction,

    // Evaluation
    evaluateTerm,
    evaluateFraction,
    evaluateProduct,
    evaluateEquation,

    // Integration
    integrateTerm,
    integrateFraction,
    definiteIntegrateTerm,
    definiteIntegrateFraction,

    // Differentiation
    differentiateTerm,
    differentiateFraction,

    // Simplification
    simplifyFraction,
    simplifyProduct,
    simplifyEquation,

    // Expansion
    multiplyTerms,
    expandFractions,
    expandProduct,

    // Display
    termToString,
    fractionToString,
    productToString,
    equationToString
};