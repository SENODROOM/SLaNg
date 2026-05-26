/**
 * SLaNg Extended Mathematical Functions
 * Extends the converter with support for trigonometric, logarithmic, and other functions
 */

import { createTerm, createFraction, multiplyTerms, differentiatePolynomial } from './slang-basic.js';
import { slangToLatex, latexToSlang } from './slang-convertor.js';

// ============================================================================
// FUNCTION DEFINITIONS
// ============================================================================

/**
 * Supported mathematical functions with their LaTeX representations
 */
export const SUPPORTED_FUNCTIONS = {
    // Trigonometric
    sin: { latex: '\\sin', arity: 1, category: 'trigonometric' },
    cos: { latex: '\\cos', arity: 1, category: 'trigonometric' },
    tan: { latex: '\\tan', arity: 1, category: 'trigonometric' },
    cot: { latex: '\\cot', arity: 1, category: 'trigonometric' },
    sec: { latex: '\\sec', arity: 1, category: 'trigonometric' },
    csc: { latex: '\\csc', arity: 1, category: 'trigonometric' },
    
    // Inverse trigonometric
    arcsin: { latex: '\\arcsin', arity: 1, category: 'inverse_trig' },
    arccos: { latex: '\\arccos', arity: 1, category: 'inverse_trig' },
    arctan: { latex: '\\arctan', arity: 1, category: 'inverse_trig' },
    
    // Hyperbolic
    sinh: { latex: '\\sinh', arity: 1, category: 'hyperbolic' },
    cosh: { latex: '\\cosh', arity: 1, category: 'hyperbolic' },
    tanh: { latex: '\\tanh', arity: 1, category: 'hyperbolic' },
    
    // Logarithmic
    ln: { latex: '\\ln', arity: 1, category: 'logarithmic' },
    log: { latex: '\\log', arity: 1, category: 'logarithmic' },
    log10: { latex: '\\log_{10}', arity: 1, category: 'logarithmic' },
    
    // Exponential
    exp: { latex: '\\exp', arity: 1, category: 'exponential' },
    sqrt: { latex: '\\sqrt', arity: 1, category: 'exponential' },
    
    // Other functions
    abs: { latex: '\\left|', arity: 1, category: 'absolute' },
    floor: { latex: '\\lfloor', arity: 1, category: 'floor' },
    ceil: { latex: '\\lceil', arity: 1, category: 'ceiling' }
};

// ============================================================================
// EXTENDED SLaNg STRUCTURES
// ============================================================================

/**
 * Create a function expression in SLaNg format
 */
export function createFunction(name, args) {
    const funcInfo = SUPPORTED_FUNCTIONS[name];
    if (!funcInfo) {
        throw new Error(`Unsupported function: ${name}`);
    }
    
    if (funcInfo.arity !== args.length) {
        throw new Error(`Function ${name} expects ${funcInfo.arity} arguments, got ${args.length}`);
    }
    
    return {
        type: 'function',
        name,
        args,
        latex: funcInfo.latex
    };
}

/**
 * Check if an expression is a function
 */
export function isFunction(expr) {
    return expr && expr.type === 'function';
}

/**
 * Get function information
 */
export function getFunctionInfo(expr) {
    if (!isFunction(expr)) {
        return null;
    }
    
    return SUPPORTED_FUNCTIONS[expr.name] || null;
}

// ============================================================================
// EXTENDED CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert SLaNg function to LaTeX
 */
export function functionToLatex(func, options = {}) {
    if (!isFunction(func)) {
        throw new Error('Expression is not a function');
    }
    
    const funcInfo = getFunctionInfo(func);
    if (!funcInfo) {
        throw new Error(`Unknown function: ${func.name}`);
    }
    
    const argsLatex = func.args.map(arg => slangToLatex(arg, options));
    
    // Special handling for absolute value
    if (func.name === 'abs') {
        return `\\left|${argsLatex[0]}\\right|`;
    }
    
    // Special handling for floor and ceiling
    if (func.name === 'floor') {
        return `\\lfloor${argsLatex[0]}\\rfloor`;
    }
    
    if (func.name === 'ceil') {
        return `\\lceil${argsLatex[0]}\\rceil`;
    }
    
    // Special handling for sqrt
    if (func.name === 'sqrt') {
        return `\\sqrt{${argsLatex[0]}}`;
    }
    
    // General function format
    return `${func.latex}{${argsLatex.join(', ')}}`;
}

/**
 * Parse LaTeX function to SLaNg
 */
export function parseFunction(latex) {
    // Try to match function patterns
    for (const [name, info] of Object.entries(SUPPORTED_FUNCTIONS)) {
        const pattern = new RegExp(`^\\${info.latex.replace('\\', '\\\\')}\\s*\\{([^{}]+)\\}`);
        const match = latex.match(pattern);
        
        if (match) {
            const argStr = match[1];
            const arg = latexToSlang(argStr);
            return createFunction(name, [arg]);
        }
    }
    
    // Special handling for absolute value
    const absMatch = latex.match(/^\\left\|([^|]+)\\right\|$/);
    if (absMatch) {
        const arg = latexToSlang(absMatch[1]);
        return createFunction('abs', [arg]);
    }
    
    // Special handling for floor
    const floorMatch = latex.match(/^\\lfloor([^\\]+)\\rfloor$/);
    if (floorMatch) {
        const arg = latexToSlang(floorMatch[1]);
        return createFunction('floor', [arg]);
    }
    
    // Special handling for ceiling
    const ceilMatch = latex.match(/^\\lceil([^\\]+)\\rceil$/);
    if (ceilMatch) {
        const arg = latexToSlang(ceilMatch[1]);
        return createFunction('ceil', [arg]);
    }
    
    throw new Error(`Unable to parse function from LaTeX: ${latex}`);
}

/**
 * Extended SLaNg to LaTeX converter that handles functions
 */
export function extendedSlangToLatex(expr, options = {}) {
    // Handle functions
    if (isFunction(expr)) {
        return functionToLatex(expr, options);
    }
    
    // Handle composite expressions with functions
    if (expr.terms) {
        const processedTerms = expr.terms.map(term => {
            if (term.func) {
                return { ...term, func: extendedSlangToLatex(term.func, options) };
            }
            return term;
        });
        
        return slangToLatex({ ...expr, terms: processedTerms }, options);
    }
    
    // Default to original converter
    return slangToLatex(expr, options);
}

/**
 * Extended LaTeX to SLaNg converter that handles functions
 */
export function extendedLatexToSlang(latex, options = {}) {
    latex = latex.trim();
    
    // Try to parse as function first
    try {
        return parseFunction(latex);
    } catch (error) {
        // Not a function, try original parser
    }
    
    // Handle expressions with embedded functions
    const functionPattern = /\\(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|exp|sqrt|left\||lfloor|lceil)/g;
    
    if (functionPattern.test(latex)) {
        // Extract and process functions
        let processedLatex = latex;
        const functions = [];
        
        // Find all function occurrences
        let match;
        const regex = /(\\(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|exp|sqrt|left\||lfloor|lceil)\s*\{([^{}]+)\}|\\left\|([^|]+)\\right\||\\lfloor([^\\]+)\\rfloor|\\lceil([^\\]+)\\rceil)/g;
        
        while ((match = regex.exec(latex)) !== null) {
            const fullMatch = match[0];
            const funcName = match[2] || 
                           (match[3] ? 'abs' : 
                            match[4] ? 'floor' : 
                            match[5] ? 'ceil' : null);
            
            if (funcName) {
                const argStr = match[3] || match[4] || match[5] || match[6];
                const funcExpr = parseFunction(fullMatch);
                functions.push({ original: fullMatch, parsed: funcExpr });
                
                // Replace with placeholder
                processedLatex = processedLatex.replace(fullMatch, `__FUNC_${functions.length - 1}__`);
            }
        }
        
        // Parse the remaining expression
        const baseExpr = latexToSlang(processedLatex, options);
        
        // Reinsert functions
        if (baseExpr.terms) {
            baseExpr.terms.forEach(term => {
                functions.forEach((func, index) => {
                    // This is a simplified approach - in practice, you'd need more sophisticated handling
                    if (term.var && term.var['__FUNC_' + index + '__']) {
                        delete term.var['__FUNC_' + index + '__'];
                        term.func = func.parsed;
                    }
                });
            });
        }
        
        return baseExpr;
    }
    
    // Default to original parser
    return latexToSlang(latex, options);
}

// ============================================================================
// FUNCTION EVALUATION
// ============================================================================

/**
 * Evaluate a function expression at a given point
 */
export function evaluateFunction(func, point = {}) {
    if (!isFunction(func)) {
        throw new Error('Expression is not a function');
    }
    
    const evaluatedArgs = func.args.map(arg => {
        if (arg.terms) {
            // Evaluate polynomial at point
            let result = 0;
            arg.terms.forEach(term => {
                let termValue = term.coeff;
                if (term.var) {
                    for (const [variable, power] of Object.entries(term.var)) {
                        if (point[variable] !== undefined) {
                            termValue *= Math.pow(point[variable], power);
                        } else {
                            // Variable not provided, return symbolic
                            return arg; // Return original if can't evaluate
                        }
                    }
                }
                result += termValue;
            });
            return result;
        } else if (arg.coeff !== undefined) {
            return arg.coeff;
        }
        return arg;
    });
    
    // Apply the mathematical function
    switch (func.name) {
        case 'sin': return Math.sin(evaluatedArgs[0]);
        case 'cos': return Math.cos(evaluatedArgs[0]);
        case 'tan': return Math.tan(evaluatedArgs[0]);
        case 'cot': return 1 / Math.tan(evaluatedArgs[0]);
        case 'sec': return 1 / Math.cos(evaluatedArgs[0]);
        case 'csc': return 1 / Math.sin(evaluatedArgs[0]);
        case 'arcsin': return Math.asin(evaluatedArgs[0]);
        case 'arccos': return Math.acos(evaluatedArgs[0]);
        case 'arctan': return Math.atan(evaluatedArgs[0]);
        case 'sinh': return Math.sinh(evaluatedArgs[0]);
        case 'cosh': return Math.cosh(evaluatedArgs[0]);
        case 'tanh': return Math.tanh(evaluatedArgs[0]);
        case 'ln': return Math.log(evaluatedArgs[0]);
        case 'log': return Math.log10(evaluatedArgs[0]);
        case 'exp': return Math.exp(evaluatedArgs[0]);
        case 'sqrt': return Math.sqrt(evaluatedArgs[0]);
        case 'abs': return Math.abs(evaluatedArgs[0]);
        case 'floor': return Math.floor(evaluatedArgs[0]);
        case 'ceil': return Math.ceil(evaluatedArgs[0]);
        default:
            throw new Error(`Evaluation not implemented for function: ${func.name}`);
    }
}

// ============================================================================
// FUNCTION DIFFERENTIATION
// ============================================================================

/**
 * Differentiate a function expression
 */
export function differentiateFunction(func, variable) {
    if (!isFunction(func)) {
        throw new Error('Expression is not a function');
    }
    
    const [arg] = func.args;
    const argDerivative = differentiate(arg, variable);
    
    // Chain rule: d/dx[f(g(x))] = f'(g(x)) * g'(x)
    switch (func.name) {
        case 'sin':
            return createFunction('cos', [arg]);
        case 'cos':
            return createTerm(-1);
        case 'tan':
            return createFraction(
                [createTerm(1)],
                [createFunction('cos', [arg]), createFunction('cos', [arg])]
            );
        case 'cot':
            return createTerm(-1);
        case 'sec':
            return createTerm(1);
        case 'csc':
            return createTerm(-1);
        case 'arcsin':
            return createFraction(
                [createTerm(1)],
                [createFunction('sqrt', [createTerm(1, {}, createTerm(-1))])]
            );
        case 'arccos':
            return createTerm(-1);
        case 'arctan':
            return createFraction(
                [createTerm(1)],
                [createTerm(1, {}, createTerm(1))]
            );
        case 'sinh':
            return createFunction('cosh', [arg]);
        case 'cosh':
            return createFunction('sinh', [arg]);
        case 'tanh':
            return createFraction(
                [createTerm(1)],
                [createFunction('cosh', [arg]), createFunction('cosh', [arg])]
            );
        case 'ln':
            return createFraction([createTerm(1)], [arg]);
        case 'log':
            return createFraction([createTerm(1)], [createTerm(Math.LN10)]);
        case 'exp':
            return createFunction('exp', [arg]);
        case 'sqrt':
            return createFraction([createTerm(1)], [createTerm(2)]);
        case 'abs':
            return createFunction('sign', [arg]); // Would need sign function implementation
        case 'floor':
        case 'ceil':
            // These are not differentiable in the classical sense
            throw new Error(`Function ${func.name} is not differentiable`);
        default:
            throw new Error(`Differentiation not implemented for function: ${func.name}`);
    }
}

// Helper function for differentiation (would need to import from slang-math.js)
function differentiate(expr, variable) {
    // This would be implemented in the main math module
    // For now, return a placeholder
    return createTerm(1, { [variable]: 1 });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all supported functions by category
 */
export function getFunctionsByCategory(category) {
    return Object.entries(SUPPORTED_FUNCTIONS)
        .filter(([name, info]) => info.category === category)
        .map(([name, info]) => ({ name, ...info }));
}

/**
 * Check if a function is supported
 */
export function isSupportedFunction(name) {
    return name in SUPPORTED_FUNCTIONS;
}

/**
 * Get function LaTeX representation
 */
export function getFunctionLatex(name) {
    const info = SUPPORTED_FUNCTIONS[name];
    return info ? info.latex : null;
}

// ============================================================================
// ADVANCED MATHEMATICAL FUNCTIONS
// ============================================================================

/**
 * Calculate gradient of a multivariable function
 * @param {Object} func - Function object
 * @param {Array} variables - Array of variable names ['x', 'y', 'z', ...]
 * @returns {Object} Gradient object with partial derivatives
 */
export function gradient(func, variables) {
    const grad = {};
    
    for (const variable of variables) {
        if (func.type === 'function') {
            grad[variable] = differentiateFunction(func, variable);
        } else {
            // Handle polynomial differentiation
            grad[variable] = differentiatePolynomial(func, variable);
        }
    }
    
    return grad;
}

/**
 * Calculate Hessian matrix (second partial derivatives)
 * @param {Object} func - Function object
 * @param {Array} variables - Array of variable names
 * @returns {Object} Hessian matrix
 */
export function hessian(func, variables) {
    const hess = {};
    
    for (const var1 of variables) {
        hess[var1] = {};
        for (const var2 of variables) {
            let firstDeriv;
            
            if (func.type === 'function') {
                firstDeriv = differentiateFunction(func, var1);
            } else {
                firstDeriv = differentiatePolynomial(func, var1);
            }
            
            // Now differentiate the first derivative with respect to var2
            if (firstDeriv.type === 'function') {
                hess[var1][var2] = differentiateFunction(firstDeriv, var2);
            } else {
                hess[var1][var2] = differentiatePolynomial(firstDeriv, var2);
            }
        }
    }
    
    return hess;
}

/**
 * Find tangent plane to surface z = f(x,y) at point (x0, y0)
 * @param {Object} func - Function object representing f(x,y)
 * @param {number} x0 - x-coordinate of point
 * @param {number} y0 - y-coordinate of point
 * @returns {Object} Tangent plane equation
 */
export function tangentPlane(func, x0, y0) {
    // Calculate partial derivatives at (x0, y0)
    let fx, fy;
    
    if (func.type === 'function') {
        fx = differentiateFunction(func, 'x');
        fy = differentiateFunction(func, 'y');
    } else {
        // Handle polynomial differentiation
        fx = differentiatePolynomial(func, 'x');
        fy = differentiatePolynomial(func, 'y');
    }
    
    // Evaluate function and derivatives at point
    const z0 = evaluateFunction(func, { x: x0, y: y0 });
    const fx0 = evaluateFunction(fx, { x: x0, y: y0 });
    const fy0 = evaluateFunction(fy, { x: x0, y: y0 });
    
    // Tangent plane: z = z0 + fx0*(x - x0) + fy0*(y - y0)
    const plane = {
        type: 'plane',
        point: { x: x0, y: y0, z: z0 },
        normal: { x: -fx0, y: -fy0, z: 1 },
        equation: {
            z: createTerm(z0),
            x: createTerm(fx0, { x: 1 }),
            y: createTerm(fy0, { y: 1 }),
            constant: createTerm(-fx0 * x0 - fy0 * y0 + z0)
        }
    };
    
    return plane;
}

/**
 * Find tangent line to curve y = f(x) at point x0
 * @param {Object} func - Function object
 * @param {number} x0 - x-coordinate of point
 * @returns {Object} Tangent line equation
 */
export function tangentLine(func, x0) {
    let derivative;
    
    if (func.type === 'function') {
        derivative = differentiateFunction(func, 'x');
    } else {
        // Handle polynomial differentiation
        derivative = differentiatePolynomial(func, 'x');
    }
    
    const y0 = evaluateFunction(func, { x: x0 });
    const slope = evaluateFunction(derivative, { x: x0 });
    
    // Tangent line: y = y0 + slope*(x - x0)
    const line = {
        type: 'line',
        point: { x: x0, y: y0 },
        slope: slope,
        equation: {
            y: createTerm(slope, { x: 1 }),
            constant: createTerm(y0 - slope * x0)
        }
    };
    
    return line;
}

/**
 * Find normal vector to surface at point
 * @param {Object} func - Function object F(x,y,z) = 0
 * @param {Object} point - Point {x, y, z}
 * @returns {Object} Normal vector
 */
export function surfaceNormal(func, point) {
    const grad = gradient(func, ['x', 'y', 'z']);
    const normal = {
        x: evaluateFunction(grad.x, point),
        y: evaluateFunction(grad.y, point),
        z: evaluateFunction(grad.z, point)
    };
    
    // Normalize vector
    const magnitude = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
    return {
        x: normal.x / magnitude,
        y: normal.y / magnitude,
        z: normal.z / magnitude
    };
}

/**
 * Find critical points of a multivariable function
 * @param {Object} func - Function object
 * @param {Array} variables - Array of variable names
 * @returns {Array} Array of critical points
 */
export function findCriticalPoints(func, variables) {
    const grad = gradient(func, variables);
    const criticalPoints = [];
    
    // For simplicity, this is a basic implementation
    // In practice, you'd solve the system of equations grad = 0
    // This would require a numerical solver or symbolic equation solver
    
    if (variables.length === 1) {
        // Single variable case: solve f'(x) = 0
        const derivative = grad[variables[0]];
        // This is a placeholder - actual implementation would need root finding
        criticalPoints.push({
            type: 'critical_point',
            variables: { [variables[0]]: 0 }, // Placeholder
            value: evaluateFunction(func, { [variables[0]]: 0 })
        });
    } else if (variables.length === 2) {
        // Two variable case: solve fx = 0, fy = 0
        // Placeholder implementation
        criticalPoints.push({
            type: 'critical_point',
            variables: { x: 0, y: 0 }, // Placeholder
            value: evaluateFunction(func, { x: 0, y: 0 })
        });
    }
    
    return criticalPoints;
}

/**
 * Classify critical points using Hessian matrix
 * @param {Object} func - Function object
 * @param {Object} point - Critical point
 * @returns {string} Classification: 'minimum', 'maximum', 'saddle', 'degenerate'
 */
export function classifyCriticalPoint(func, point) {
    const hess = hessian(func, Object.keys(point));
    const variables = Object.keys(point);
    
    if (variables.length === 1) {
        // Single variable: use second derivative test
        let secondDeriv;
        
        if (func.type === 'function') {
            const firstDeriv = differentiateFunction(func, variables[0]);
            secondDeriv = differentiateFunction(firstDeriv, variables[0]);
        } else {
            const firstDeriv = differentiatePolynomial(func, variables[0]);
            secondDeriv = differentiatePolynomial(firstDeriv, variables[0]);
        }
        
        const d2 = evaluateFunction(secondDeriv, point);
        
        if (d2 > 0) return 'minimum';
        if (d2 < 0) return 'maximum';
        return 'degenerate';
    } else if (variables.length === 2) {
        // Two variables: use Hessian determinant test
        const fxx = evaluateFunction(hess[variables[0]][variables[0]], point);
        const fyy = evaluateFunction(hess[variables[1]][variables[1]], point);
        const fxy = evaluateFunction(hess[variables[0]][variables[1]], point);
        
        const D = fxx * fyy - fxy * fxy;
        
        if (D > 0 && fxx > 0) return 'minimum';
        if (D > 0 && fxx < 0) return 'maximum';
        if (D < 0) return 'saddle';
        return 'degenerate';
    }
    
    return 'unknown';
}

/**
 * Find local maxima and minima of a function
 * @param {Object} func - Function object
 * @param {Array} variables - Array of variable names
 * @param {Object} bounds - Optional bounds for search {x: [min, max], y: [min, max]}
 * @returns {Object} Object with maxima and minima arrays
 */
export function findExtrema(func, variables, bounds = {}) {
    const criticalPoints = findCriticalPoints(func, variables);
    const maxima = [];
    const minima = [];
    
    for (const point of criticalPoints) {
        const classification = classifyCriticalPoint(func, point.variables);
        
        if (classification === 'maximum') {
            maxima.push(point);
        } else if (classification === 'minimum') {
            minima.push(point);
        }
    }
    
    // Check boundaries if provided
    if (Object.keys(bounds).length > 0) {
        // This would require evaluating the function on boundary
        // Placeholder implementation
    }
    
    return {
        maxima,
        minima,
        critical_points: criticalPoints
    };
}

/**
 * Find global maximum and minimum in a region
 * @param {Object} func - Function object
 * @param {Array} variables - Array of variable names
 * @param {Object} bounds - Bounds for each variable
 * @returns {Object} Global extrema
 */
export function findGlobalExtrema(func, variables, bounds) {
    const localExtrema = findExtrema(func, variables, bounds);
    
    let globalMax = null;
    let globalMin = null;
    
    // Check local extrema
    for (const max of localExtrema.maxima) {
        if (!globalMax || max.value > globalMax.value) {
            globalMax = max;
        }
    }
    
    for (const min of localExtrema.minima) {
        if (!globalMin || min.value < globalMin.value) {
            globalMin = min;
        }
    }
    
    // Check boundaries (simplified)
    // In practice, you'd need to evaluate on all boundary combinations
    
    return {
        global_maximum: globalMax,
        global_minimum: globalMin,
        local_extrema: localExtrema
    };
}

/**
 * Find extrema subject to constraints using Lagrange multipliers
 * @param {Object} func - Objective function
 * @param {Array} constraints - Array of constraint functions
 * @param {Array} variables - Array of variable names
 * @returns {Array} Array of constrained extrema
 */
export function lagrangeMultipliers(func, constraints, variables) {
    const constrainedExtrema = [];
    
    // For each constraint, create Lagrangian: L = f - λ*g
    // Then solve ∇L = 0
    // This is a placeholder - actual implementation would require solving systems
    
    for (let i = 0; i < constraints.length; i++) {
        const constraint = constraints[i];
        
        // Placeholder solution
        constrainedExtrema.push({
            type: 'constrained_extremum',
            constraint_index: i,
            variables: variables.reduce((obj, v) => ({ ...obj, [v]: 0 }), {}),
            value: evaluateFunction(func, variables.reduce((obj, v) => ({ ...obj, [v]: 0 }), {})),
            multiplier: 0 // λ
        });
    }
    
    return constrainedExtrema;
}

/**
 * Calculate directional derivative
 * @param {Object} func - Function object
 * @param {Object} point - Point of evaluation
 * @param {Object} direction - Direction vector (not necessarily unit)
 * @returns {number} Directional derivative
 */
export function directionalDerivative(func, point, direction) {
    const variables = Object.keys(point);
    const grad = gradient(func, variables);
    
    // Calculate magnitude of direction vector
    const dirMag = Math.sqrt(Object.values(direction).reduce((sum, val) => sum + val ** 2, 0));
    
    // Normalize direction vector
    const unitDir = {};
    for (const [varName, val] of Object.entries(direction)) {
        unitDir[varName] = val / dirMag;
    }
    
    // Calculate dot product of gradient and unit direction
    let dotProduct = 0;
    for (const varName of variables) {
        const gradVal = evaluateFunction(grad[varName], point);
        dotProduct += gradVal * unitDir[varName];
    }
    
    return dotProduct;
}

/**
 * Find direction of steepest ascent/descent
 * @param {Object} func - Function object
 * @param {Object} point - Point of evaluation
 * @returns {Object} Directions of steepest ascent and descent
 */
export function steepestDirections(func, point) {
    const variables = Object.keys(point);
    const grad = gradient(func, variables);
    
    // Gradient points in direction of steepest ascent
    const ascent = {};
    const descent = {};
    
    for (const varName of variables) {
        const gradVal = evaluateFunction(grad[varName], point);
        ascent[varName] = gradVal;
        descent[varName] = -gradVal;
    }
    
    return {
        steepest_ascent: ascent,
        steepest_descent: descent,
        gradient_magnitude: Math.sqrt(Object.values(ascent).reduce((sum, val) => sum + val ** 2, 0))
    };
}

/**
 * Convert tangent plane/line to LaTeX
 * @param {Object} tangent - Tangent object from tangentPlane or tangentLine
 * @returns {string} LaTeX representation
 */
export function tangentToLatex(tangent) {
    if (tangent.type === 'plane') {
        const { equation } = tangent;
        const zTerm = slangToLatex(equation.z);
        const xTerm = slangToLatex(equation.x);
        const yTerm = slangToLatex(equation.y);
        const constTerm = slangToLatex(equation.constant);
        
        return `z = ${zTerm} + ${xTerm} + ${yTerm} + ${constTerm}`;
    } else if (tangent.type === 'line') {
        const { equation } = tangent;
        const yTerm = slangToLatex(equation.y);
        const constTerm = slangToLatex(equation.constant);
        
        return `y = ${yTerm} + ${constTerm}`;
    }
    
    return '';
}

// ============================================================================
// EXAMPLES AND DEMO
// ============================================================================

/**
 * Demo function showing extended capabilities
 */
export function demoExtendedFunctions() {
    console.log('🚀 SLaNg Extended Functions Demo');
    console.log('='.repeat(50));
    
    // Create function expressions
    const sinExpr = createFunction('sin', [createTerm(1, { x: 1 })]);
    const logExpr = createFunction('ln', [createTerm(1, { x: 1 }), createTerm(1)]);
    const sqrtExpr = createFunction('sqrt', [createTerm(1, { x: 2 }), createTerm(1)]);
    
    console.log('\n📐 Function to LaTeX:');
    console.log(`sin(x): ${functionToLatex(sinExpr)}`);
    console.log(`ln(x + 1): ${functionToLatex(logExpr)}`);
    console.log(`sqrt(x² + 1): ${functionToLatex(sqrtExpr)}`);
    
    console.log('\n🔄 LaTeX to Function:');
    const parsedSin = parseFunction('\\sin{x}');
    const parsedLog = parseFunction('\\ln{x + 1}');
    const parsedSqrt = parseFunction('\\sqrt{x^{2} + 1}');
    
    console.log(`\\sin{x}: ${JSON.stringify(parsedSin)}`);
    console.log(`\\ln{x + 1}: ${JSON.stringify(parsedLog)}`);
    console.log(`\\sqrt{x^{2} + 1}: ${JSON.stringify(parsedSqrt)}`);
    
    console.log('\n🧮 Function Evaluation:');
    console.log(`sin(π/2): ${evaluateFunction(sinExpr, { x: Math.PI / 2 })}`);
    console.log(`ln(e): ${evaluateFunction(logExpr, { x: Math.E - 1 })}`);
    console.log(`sqrt(4): ${evaluateFunction(sqrtExpr, { x: Math.sqrt(3) })}`);
    
    console.log('\n📚 Supported Functions:');
    Object.entries(SUPPORTED_FUNCTIONS).forEach(([name, info]) => {
        console.log(`  ${name}: ${info.latex} (${info.category})`);
    });
}

// Export all extended functions
export default {
    // Core structures
    createFunction,
    isFunction,
    getFunctionInfo,
    
    // Conversion functions
    functionToLatex,
    parseFunction,
    extendedSlangToLatex,
    extendedLatexToSlang,
    
    // Evaluation and differentiation
    evaluateFunction,
    differentiateFunction,
    
    // Utilities
    getFunctionsByCategory,
    isSupportedFunction,
    getFunctionLatex,
    SUPPORTED_FUNCTIONS,
    
    // Advanced Mathematical Functions
    gradient,
    hessian,
    tangentPlane,
    tangentLine,
    surfaceNormal,
    findCriticalPoints,
    classifyCriticalPoint,
    findExtrema,
    findGlobalExtrema,
    lagrangeMultipliers,
    directionalDerivative,
    steepestDirections,
    tangentToLatex,
    
    // Demo
    demoExtendedFunctions
};
