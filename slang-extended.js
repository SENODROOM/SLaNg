/**
 * SLaNg Extended Mathematical Functions
 * Extends the converter with support for trigonometric, logarithmic, and other functions
 */

import { createTerm, createFraction } from './slang-basic.js';
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
    
    // Demo
    demoExtendedFunctions
};
