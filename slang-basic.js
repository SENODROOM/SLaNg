/**
 * SLaNg (Saad Language for Analytical Numerics and Geometry) - Math Library 
 * Enhanced with full denominator support and improved calculus operations
 * 
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
 * Create a fraction with polynomial numerator and denominator
 * @param {Array} numiTerms - Array of terms for numerator
 * @param {Array|number} denoTerms - Array of terms for denominator OR simple number
 * 
 *: Full support for polynomial denominators
 */
function createFraction(numiTerms, denoTerms = 1) {
    const fraction = {
        numi: { terms: deepClone(numiTerms) }
    };
    
    // Support both old (number) and new (polynomial) denominators
    if (typeof denoTerms === 'number') {
        fraction.deno = denoTerms;
    } else if (Array.isArray(denoTerms)) {
        fraction.deno = { terms: deepClone(denoTerms) };
    } else if (denoTerms.terms) {
        fraction.deno = { terms: deepClone(denoTerms.terms) };
    }
    
    return fraction;
}

/**
 * Check if denominator is a simple number
 */
function hasSimpleDenominator(fraction) {
    return typeof fraction.deno === 'number';
}

/**
 * Get GCD of two numbers for simplification
 */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a || 1;
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
 * Evaluate polynomial (array of terms)
 */
function evaluatePolynomial(polynomial, values) {
    let sum = 0;
    for (let term of polynomial.terms) {
        sum += evaluateTerm(term, values);
    }
    return sum;
}

/**
 * Evaluate a fraction (numerator / denominator)
 *: Supports polynomial denominators
 */
function evaluateFraction(fraction, values) {
    const numeratorSum = evaluatePolynomial(fraction.numi, values);
    
    if (hasSimpleDenominator(fraction)) {
        return numeratorSum / fraction.deno;
    } else {
        const denominatorSum = evaluatePolynomial(fraction.deno, values);
        return numeratorSum / denominatorSum;
    }
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
// INTEGRATION FUNCTIONS - ENHANCED
// ============================================================================

/**
 * Integrate a single term with respect to a variable
 * Power rule: ∫ c*x^n dx = c/(n+1) * x^(n+1)
 */
function integrateTerm(term, indvar) {
    const newTerm = deepClone(term);

    // Get current power of the variable (0 if not present)
    const power = newTerm.var?.[indvar] ?? 0;

    // Check for special case: x^(-1) -> ln|x| (not handled symbolically yet)
    if (power === -1) {
        throw new Error('Integration of 1/x requires logarithm (not yet implemented)');
    }

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
 * Integrate a polynomial
 */
function integratePolynomial(polynomial, indvar) {
    return {
        terms: polynomial.terms.map(term => integrateTerm(term, indvar))
    };
}

/**
 * Integrate a fraction
 *: Improved handling of different denominator types
 */
function integrateFraction(fraction, indvar) {
    if (hasSimpleDenominator(fraction)) {
        // Simple case: polynomial / constant
        return {
            numi: integratePolynomial(fraction.numi, indvar),
            deno: fraction.deno
        };
    } else {
        // Complex case: polynomial / polynomial
        // This requires more advanced techniques
        
        // Check if it's a simple substitution case
        if (isSimpleSubstitutionCase(fraction, indvar)) {
            return integrateBySubstitution(fraction, indvar);
        }
        
        // Otherwise, try partial fractions or numerical methods
        throw new Error(
            'Integration of complex rational functions requires partial fractions or numerical methods. ' +
            'Use numericalIntegrateFraction() instead.'
        );
    }
}

/**
 * Check if fraction can be integrated by simple substitution
 * e.g., ∫ 2x/(x²+1) dx where numerator is derivative of denominator
 */
function isSimpleSubstitutionCase(fraction, indvar) {
    if (hasSimpleDenominator(fraction)) return false;
    
    // Differentiate denominator
    const denoDeriv = differentiatePolynomial(fraction.deno, indvar);
    
    // Check if numerator is a constant multiple of denominator derivative
    if (fraction.numi.terms.length !== denoDeriv.terms.length) return false;
    
    // More sophisticated check would go here
    return false; // Conservative for now
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
 * Definite integration of a polynomial
 */
function definiteIntegratePolynomial(polynomial, lower, upper, indvar) {
    return {
        terms: polynomial.terms.map(term =>
            definiteIntegrateTerm(term, lower, upper, indvar)
        )
    };
}

/**
 * Definite integration of a fraction
 *: Better handling for different denominator types
 */
function definiteIntegrateFraction(fraction, lower, upper, indvar) {
    if (hasSimpleDenominator(fraction)) {
        // Simple case
        return {
            numi: definiteIntegratePolynomial(fraction.numi, lower, upper, indvar),
            deno: fraction.deno
        };
    } else {
        // For polynomial denominators, use numerical integration
        return numericalIntegrateFraction(fraction, lower, upper, indvar);
    }
}

/**
 * Numerical integration using Simpson's rule (more accurate than rectangles)
 *: Enhanced numerical integration
 */
function numericalIntegrateFraction(fraction, lower, upper, indvar, numSteps = 1000) {
    // Simpson's rule requires even number of steps
    if (numSteps % 2 !== 0) numSteps++;
    
    const h = (upper - lower) / numSteps;
    let sum = 0;
    
    // Simpson's rule: h/3 * [f(x0) + 4*f(x1) + 2*f(x2) + 4*f(x3) + ... + f(xn)]
    for (let i = 0; i <= numSteps; i++) {
        const x = lower + i * h;
        const point = { [indvar]: x };
        const value = evaluateFraction(fraction, point);
        
        if (i === 0 || i === numSteps) {
            sum += value;
        } else if (i % 2 === 1) {
            sum += 4 * value;
        } else {
            sum += 2 * value;
        }
    }
    
    const result = (h / 3) * sum;
    
    // Return as a constant term
    return {
        numi: { terms: [createTerm(result)] },
        deno: 1
    };
}

// ============================================================================
// DIFFERENTIATION FUNCTIONS - ENHANCED
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
 * Differentiate a polynomial
 */
function differentiatePolynomial(polynomial, indvar) {
    return {
        terms: polynomial.terms
            .map(term => differentiateTerm(term, indvar))
            .filter(term => term.coeff !== 0)
    };
}

/**
 * Differentiate a fraction using quotient rule
 *: Full quotient rule for polynomial denominators
 * 
 * d/dx[f/g] = (f'g - fg') / g²
 */
function differentiateFraction(fraction, indvar) {
    if (hasSimpleDenominator(fraction)) {
        // Simple case: just differentiate numerator, keep constant denominator
        return {
            numi: differentiatePolynomial(fraction.numi, indvar),
            deno: fraction.deno
        };
    } else {
        // Quotient rule for polynomial denominator
        const f = fraction.numi;
        const g = fraction.deno;
        
        const fPrime = differentiatePolynomial(f, indvar);
        const gPrime = differentiatePolynomial(g, indvar);
        
        // f' * g
        const fPrimeTimesG = multiplyPolynomials(fPrime, g);
        
        // f * g'
        const fTimesGPrime = multiplyPolynomials(f, gPrime);
        
        // f'g - fg'
        const numerator = subtractPolynomials(fPrimeTimesG, fTimesGPrime);
        
        // g²
        const denominator = multiplyPolynomials(g, g);
        
        return {
            numi: numerator,
            deno: denominator
        };
    }
}

// ============================================================================
// POLYNOMIAL ARITHMETIC -
// ============================================================================

/**
 * Add two polynomials
 */
function addPolynomials(poly1, poly2) {
    return {
        terms: [...poly1.terms, ...poly2.terms]
    };
}

/**
 * Subtract two polynomials
 */
function subtractPolynomials(poly1, poly2) {
    const negatedPoly2 = {
        terms: poly2.terms.map(t => ({ ...deepClone(t), coeff: -t.coeff }))
    };
    return addPolynomials(poly1, negatedPoly2);
}

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
 * Multiply two polynomials
 *: Essential for quotient rule
 */
function multiplyPolynomials(poly1, poly2) {
    const resultTerms = [];
    
    for (let term1 of poly1.terms) {
        for (let term2 of poly2.terms) {
            resultTerms.push(multiplyTerms(term1, term2));
        }
    }
    
    return { terms: resultTerms };
}

// ============================================================================
// SIMPLIFICATION FUNCTIONS - ENHANCED
// ============================================================================

/**
 * Combine like terms in a polynomial
 */
function simplifyPolynomial(polynomial) {
    const termMap = new Map();

    for (let term of polynomial.terms) {
        const varKey = term.var ? JSON.stringify(term.var) : 'constant';

        if (termMap.has(varKey)) {
            termMap.get(varKey).coeff += term.coeff;
        } else {
            termMap.set(varKey, deepClone(term));
        }
    }

    // Filter out zero terms and sort for consistency
    const simplifiedTerms = Array.from(termMap.values())
        .filter(term => Math.abs(term.coeff) > 1e-10)
        .sort((a, b) => {
            // Sort by total degree (descending)
            const degreeA = a.var ? Object.values(a.var).reduce((sum, p) => sum + p, 0) : 0;
            const degreeB = b.var ? Object.values(b.var).reduce((sum, p) => sum + p, 0) : 0;
            return degreeB - degreeA;
        });

    return { terms: simplifiedTerms };
}

/**
 * Simplify a fraction
 *: Enhanced to handle polynomial denominators
 */
function simplifyFraction(fraction) {
    const simplifiedNumi = simplifyPolynomial(fraction.numi);
    
    if (hasSimpleDenominator(fraction)) {
        // Try to simplify constant denominator with GCD
        if (simplifiedNumi.terms.length > 0) {
            const coeffs = simplifiedNumi.terms.map(t => t.coeff);
            const numGCD = coeffs.reduce((a, b) => gcd(a, b));
            const denoGCD = gcd(numGCD, fraction.deno);
            
            if (denoGCD > 1) {
                return {
                    numi: {
                        terms: simplifiedNumi.terms.map(t => ({
                            ...deepClone(t),
                            coeff: t.coeff / denoGCD
                        }))
                    },
                    deno: fraction.deno / denoGCD
                };
            }
        }
        
        return {
            numi: simplifiedNumi,
            deno: fraction.deno
        };
    } else {
        // Simplify both numerator and denominator
        const simplifiedDeno = simplifyPolynomial(fraction.deno);
        
        // TODO: Factor and cancel common factors
        return {
            numi: simplifiedNumi,
            deno: simplifiedDeno
        };
    }
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
// EXPANSION FUNCTIONS
// ============================================================================

/**
 * Expand product of two fractions (both with simple denominators)
 * (a + b)(c + d) = ac + ad + bc + bd
 */
function expandFractions(frac1, frac2) {
    const numi1 = frac1.numi;
    const numi2 = frac2.numi;
    
    const expandedNumi = multiplyPolynomials(numi1, numi2);
    
    // Handle denominators
    let newDeno;
    if (hasSimpleDenominator(frac1) && hasSimpleDenominator(frac2)) {
        newDeno = frac1.deno * frac2.deno;
    } else if (hasSimpleDenominator(frac1) && !hasSimpleDenominator(frac2)) {
        newDeno = multiplyPolynomialByConstant(frac2.deno, frac1.deno);
    } else if (!hasSimpleDenominator(frac1) && hasSimpleDenominator(frac2)) {
        newDeno = multiplyPolynomialByConstant(frac1.deno, frac2.deno);
    } else {
        newDeno = multiplyPolynomials(frac1.deno, frac2.deno);
    }
    
    return simplifyFraction({
        numi: expandedNumi,
        deno: newDeno
    });
}

/**
 * Multiply polynomial by constant
 */
function multiplyPolynomialByConstant(polynomial, constant) {
    return {
        terms: polynomial.terms.map(t => ({ ...deepClone(t), coeff: t.coeff * constant }))
    };
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
    let str = '';
    
    // Handle coefficient
    if (term.coeff === 0) return '0';
    if (Math.abs(term.coeff - 1) < 1e-10 && term.var) {
        str = '';
    } else if (Math.abs(term.coeff + 1) < 1e-10 && term.var) {
        str = '-';
    } else {
        str = term.coeff.toString();
    }

    // Handle variables
    if (term.var) {
        const varStr = Object.entries(term.var)
            .map(([variable, power]) => {
                if (power === 1) return variable;
                return `${variable}^${power}`;
            })
            .join('*');
        str += (str && str !== '-' ? '*' : '') + varStr;
    }

    return str || term.coeff.toString();
}

/**
 * Convert polynomial to readable string
 */
function polynomialToString(polynomial) {
    if (!polynomial.terms || polynomial.terms.length === 0) return '0';
    
    return polynomial.terms.map((term, i) => {
        const termStr = termToString(term);
        if (i === 0) return termStr;
        if (term.coeff >= 0) return '+ ' + termStr;
        return termStr; // Negative sign already in termStr
    }).join(' ');
}

/**
 * Convert fraction to readable string
 */
function fractionToString(fraction) {
    const numi = polynomialToString(fraction.numi);
    
    if (hasSimpleDenominator(fraction)) {
        if (fraction.deno === 1) {
            return `(${numi})`;
        }
        return `(${numi})/${fraction.deno}`;
    } else {
        const deno = polynomialToString(fraction.deno);
        return `(${numi})/(${deno})`;
    }
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
    hasSimpleDenominator,
    gcd,

    // Evaluation
    evaluateTerm,
    evaluatePolynomial,
    evaluateFraction,
    evaluateProduct,
    evaluateEquation,

    // Integration
    integrateTerm,
    integratePolynomial,
    integrateFraction,
    definiteIntegrateTerm,
    definiteIntegratePolynomial,
    definiteIntegrateFraction,
    numericalIntegrateFraction,

    // Differentiation
    differentiateTerm,
    differentiatePolynomial,
    differentiateFraction,

    // Polynomial Arithmetic
    addPolynomials,
    subtractPolynomials,
    multiplyTerms,
    multiplyPolynomials,
    multiplyPolynomialByConstant,

    // Simplification
    simplifyPolynomial,
    simplifyFraction,
    simplifyProduct,
    simplifyEquation,

    // Expansion
    expandFractions,
    expandProduct,

    // Display
    termToString,
    polynomialToString,
    fractionToString,
    productToString,
    equationToString
};
