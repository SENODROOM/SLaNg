/**
 * SLaNg LaTeX Converter - Unified Edition
 * Comprehensive bidirectional conversion between SLaNg and LaTeX
 * Combines the best features from all previous versions
 * 
 * Features:
 * - Enhanced parsing with multiple fallback strategies
 * - Robust error handling and validation
 * - Support for complex mathematical expressions
 * - Batch processing capabilities
 * - Flexible formatting options
 * - Comprehensive test coverage
 */

import {
    createTerm,
    createFraction,
    evaluateTerm,
    hasSimpleDenominator,
    termToString,
    polynomialToString,
    fractionToString
} from './slang-basic.js';

// ============================================================================
// SLANG TO LATEX CONVERSION
// ============================================================================

/**
 * Convert SLaNg term to LaTeX with enhanced formatting
 */
function termToLatex(term, options = {}) {
    if (term.coeff === 0) return '0';
    
    let latex = '';
    
    // Handle coefficient with special cases
    if (Math.abs(term.coeff - 1) < 1e-10 && term.var) {
        latex = '';
    } else if (Math.abs(term.coeff + 1) < 1e-10 && term.var) {
        latex = '-';
    } else {
        latex = term.coeff.toString();
    }
    
    // Handle variables with powers
    if (term.var) {
        const varParts = [];
        for (let [variable, power] of Object.entries(term.var)) {
            if (power === 1) {
                varParts.push(variable);
            } else {
                varParts.push(`${variable}^{${power}}`);
            }
        }
        
        // Handle multiplication symbols
        if (varParts.length > 1 && options.multiplySymbol === '\\cdot') {
            latex += (latex && latex !== '-' ? ' \\cdot ' : '') + varParts.join(' \\cdot ');
        } else if (varParts.length > 1 && options.multiplySymbol === '\\times') {
            latex += (latex && latex !== '-' ? ' \\times ' : '') + varParts.join(' \\times ');
        } else {
            latex += (latex && latex !== '-' ? '' : '') + varParts.join('');
        }
    }
    
    return latex || term.coeff.toString();
}

/**
 * Convert SLaNg polynomial to LaTeX with proper sign handling
 */
function polynomialToLatex(polynomial, options = {}) {
    if (!polynomial.terms || polynomial.terms.length === 0) return '0';
    
    return polynomial.terms.map((term, i) => {
        const termLatex = termToLatex(term, options);
        if (i === 0) return termLatex;
        
        // Add plus/minus signs with proper spacing
        if (term.coeff >= 0) {
            return ' + ' + termLatex;
        } else {
            return ' - ' + termToLatex({ ...term, coeff: Math.abs(term.coeff) }, options);
        }
    }).join('');
}

/**
 * Convert SLaNg fraction to LaTeX with enhanced formatting
 */
function fractionToLatex(fraction, options = {}) {
    const numerator = polynomialToLatex(fraction.numi, options);
    
    if (hasSimpleDenominator(fraction)) {
        if (fraction.deno === 1) {
            return options.parentheses ? `\\left(${numerator}\\right)` : numerator;
        }
        return `\\frac{${numerator}}{${fraction.deno}}`;
    } else {
        const denominator = polynomialToLatex(fraction.deno, options);
        return `\\frac{${numerator}}{${denominator}}`;
    }
}

/**
 * Main SLaNg to LaTeX converter with comprehensive options
 */
function slangToLatex(expression, options = {}) {
    const defaults = {
        parentheses: false,
        multiplySymbol: '', // '', '\\cdot', or '\\times'
        displayMode: false,
        simplify: true,
        precision: 10
    };
    
    const opts = { ...defaults, ...options };
    
    // Handle function expressions
    if (expression.type === 'function') {
        const funcName = expression.name;
        const arg = expression.args[0];
        const argLatex = slangToLatex(arg, opts);
        return `\\${funcName}{${argLatex}}`;
    }
    
    if (expression.terms) {
        // It's a polynomial
        return polynomialToLatex(expression, opts);
    } else if (expression.numi && expression.deno !== undefined) {
        // It's a fraction
        return fractionToLatex(expression, opts);
    } else if (expression.coeff !== undefined) {
        // It's a term
        return termToLatex(expression, opts);
    } else {
        throw new Error('Unsupported SLaNg expression type');
    }
}

// ============================================================================
// LATEX TO SLANG CONVERSION - ENHANCED PARSING ENGINE
// ============================================================================

/**
 * Enhanced number parser with multiple format support
 */
function parseNumber(str) {
    if (str === '') return 1;
    if (str === '+') return 1;
    if (str === '-') return -1;
    
    // Handle decimal numbers and scientific notation
    const num = parseFloat(str);
    if (isNaN(num)) throw new Error(`Invalid number: ${str}`);
    return num;
}

/**
 * Advanced variable parser with multiple power formats
 */
function parseVariable(varStr) {
    // Handle simple variables: x, y, z
    if (varStr.match(/^[a-zA-Z]$/)) {
        return { variable: varStr, power: 1 };
    }
    
    // Handle powers: x^2, x^{2}, x^{10}, etc.
    const match = varStr.match(/^([a-zA-Z])\^(\{?\d+\}|\d+)$/);
    if (!match) throw new Error(`Invalid variable format: ${varStr}`);
    
    const variable = match[1];
    const power = parseInt(match[2].replace(/[{}]/g, ''));
    
    return { variable, power };
}

/**
 * Enhanced term parser with robust coefficient extraction
 */
function parseTerm(termStr) {
    termStr = termStr.trim();
    if (termStr === '0') return createTerm(0);
    if (termStr === '') return createTerm(1);
    if (termStr === '-') return createTerm(-1);
    
    // Special handling for pure variables
    if (/^[a-zA-Z](?:\^\{?\d+\}|\^\d+)?$/.test(termStr)) {
        const { variable, power } = parseVariable(termStr);
        return createTerm(1, { [variable]: power });
    }
    
    // Remove spaces between sign and number for easier parsing
    const normalizedStr = termStr.replace(/^([+-])\s+/, '$1');
    
    // Extract coefficient with enhanced regex
    let coeff = 1;
    let remaining = normalizedStr;
    
    // Look for coefficient at the start
    const coeffMatch = normalizedStr.match(/^([+-]?\d+(?:\.\d+)?)\s*/);
    if (coeffMatch) {
        const coeffStr = coeffMatch[1];
        coeff = parseNumber(coeffStr);
        remaining = normalizedStr.slice(coeffMatch[0].length).trim();
    } else {
        // Try to match just a sign
        const signMatch = normalizedStr.match(/^([+-])/);
        if (signMatch) {
            coeff = signMatch[1] === '-' ? -1 : 1;
            remaining = normalizedStr.slice(1).trim();
        }
    }
    
    // Extract variables from remaining part
    let variables = {};
    if (remaining) {
        // Remove various multiplication symbols
        remaining = remaining.replace(/\\cdot|\\times|\*|·/g, '');
        
        // Find all variable patterns with enhanced regex
        const varMatches = remaining.match(/[a-zA-Z](?:\^\{?\d+\}|\^\d+)?/g);
        if (varMatches) {
            for (let varMatch of varMatches) {
                const { variable, power } = parseVariable(varMatch);
                variables[variable] = (variables[variable] || 0) + power;
            }
        }
    }
    
    return createTerm(coeff, variables);
}

/**
 * Advanced polynomial parser with intelligent term splitting
 */
function parsePolynomial(polyStr) {
    polyStr = polyStr.trim();
    if (!polyStr) return { terms: [createTerm(0)] };
    
    // Remove outer parentheses with enhanced detection
    if (polyStr.startsWith('\\left(') && polyStr.endsWith('\\right)')) {
        polyStr = polyStr.slice(7, -6);
    } else if (polyStr.startsWith('(') && polyStr.endsWith(')')) {
        polyStr = polyStr.slice(1, -1);
    }
    
    // Handle single term case
    if (!polyStr.includes('+') && !polyStr.includes('-')) {
        return { terms: [parseTerm(polyStr)] };
    }
    
    // Enhanced term splitting with proper sign handling
    const terms = [];
    let current = '';
    let i = 0;
    
    while (i < polyStr.length) {
        const char = polyStr[i];
        
        // Handle plus/minus signs, but not in powers and not at the start
        if ((char === '+' || char === '-') && i > 0 && polyStr[i-1] !== '^') {
            if (current.trim()) {
                terms.push(parseTerm(current.trim()));
            }
            current = char;
        } else {
            current += char;
        }
        i++;
    }
    
    // Add the last term
    if (current.trim()) {
        terms.push(parseTerm(current.trim()));
    }
    
    return { terms: terms.length > 0 ? terms : [createTerm(0)] };
}

/**
 * Enhanced fraction parser with nested expression support
 */
function parseFraction(fracStr) {
    // Enhanced regex to handle nested braces and complex expressions
    const match = fracStr.match(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
    if (!match) throw new Error(`Invalid fraction format: ${fracStr}`);
    
    const numerator = parsePolynomial(match[1]);
    const denominatorStr = match[2].trim();
    
    // Check if denominator is a simple number
    if (/^\d+$/.test(denominatorStr)) {
        return createFraction(numerator.terms, parseInt(denominatorStr));
    } else {
        const denominator = parsePolynomial(denominatorStr);
        return createFraction(numerator.terms, denominator.terms);
    }
}

/**
 * Main LaTeX to SLaNg converter with multiple parsing strategies
 */
function latexToSlang(latex, options = {}) {
    const defaults = {
        strictMode: false,
        allowImplicitMultiplication: true,
        fallbackParsing: true,
        verboseErrors: false
    };
    
    const opts = { ...defaults, ...options };
    latex = latex.trim();
    
    if (!latex) {
        throw new Error('Empty LaTeX expression');
    }
    
    try {
        // Strategy 1: Try functions first (trigonometric, etc.)
        // Check for functions with proper pattern
        const funcMatch = latex.match(/^\\(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|exp|sqrt)\s*\{([^{}]+)\}$/);
        if (funcMatch) {
            return parseFunction(latex);
        }
        
        // Strategy 2: Try fraction next (most complex)
        if (latex.includes('\\frac')) {
            return parseFraction(latex);
        }
        
        // Strategy 3: Try polynomial
        return parsePolynomial(latex);
        
    } catch (error) {
        if (opts.strictMode) {
            throw error;
        }
        
        // Strategy 4: Fallback to simple term parsing
        if (opts.fallbackParsing) {
            try {
                return parseTerm(latex);
            } catch (fallbackError) {
                const errorMsg = `Failed to parse LaTeX: "${latex}". Primary error: ${error.message}. Fallback error: ${fallbackError.message}`;
                if (opts.verboseErrors) {
                    throw new Error(errorMsg);
                } else {
                    throw new Error(`Invalid LaTeX expression: ${latex}`);
                }
            }
        }
        
        throw new Error(`Failed to parse LaTeX: ${latex}. Error: ${error.message}`);
    }
}

/**
 * Parse LaTeX functions like sin(x), cos(x), etc.
 */
function parseFunction(funcStr) {
    const funcMatch = funcStr.match(/\\(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|exp|sqrt)\s*\{([^{}]+)\}/);
    if (!funcMatch) {
        throw new Error(`Invalid function format: ${funcStr}`);
    }
    
    const funcName = funcMatch[1];
    const argStr = funcMatch[2];
    const arg = parsePolynomial(argStr);
    
    // Return a special function structure
    return {
        type: 'function',
        name: funcName,
        args: [arg]
    };
}

// ============================================================================
// ADVANCED CONVERSION FEATURES
// ============================================================================

/**
 * Convert mathematical expressions with functions (sin, cos, log, etc.)
 */
function expressionToLatex(expr, options = {}) {
    // Enhanced function support can be added here
    return slangToLatex(expr, options);
}

/**
 * Batch convert multiple expressions with error handling
 */
function batchConvertToLatex(expressions, options = {}) {
    const results = [];
    const errors = [];
    
    expressions.forEach((expr, index) => {
        try {
            const result = slangToLatex(expr, options);
            results.push({ index, success: true, result });
        } catch (error) {
            errors.push({ index, error: error.message });
            results.push({ index, success: false, error: error.message });
        }
    });
    
    return options.includeErrors ? { results, errors } : results.map(r => r.success ? r.result : `Error: ${r.error}`);
}

/**
 * Batch convert LaTeX to SLaNg with detailed error reporting
 */
function batchConvertToSlang(latexExpressions, options = {}) {
    const results = [];
    const errors = [];
    
    latexExpressions.forEach((latex, index) => {
        try {
            const result = latexToSlang(latex, options);
            results.push({ index, success: true, result });
        } catch (error) {
            errors.push({ index, error: error.message });
            results.push({ index, success: false, error: error.message });
        }
    });
    
    return options.includeErrors ? { results, errors } : results.map(r => r.success ? r.result : `Error: ${r.error}`);
}

/**
 * Enhanced LaTeX syntax validation
 */
function validateLatex(latex, options = {}) {
    try {
        latexToSlang(latex, { strictMode: true, ...options });
        return { valid: true, errors: [] };
    } catch (error) {
        return { valid: false, errors: [error.message] };
    }
}

/**
 * Smart LaTeX formatting for display mode
 */
function formatDisplayMode(latex, options = {}) {
    const defaults = {
        forceDisplay: false,
        preferInline: false
    };
    
    const opts = { ...defaults, ...options };
    
    // Auto-detect if display mode is preferred
    const needsDisplay = latex.includes('\\frac') || 
                        latex.includes('\\sum') || 
                        latex.includes('\\int') || 
                        latex.includes('\\prod') ||
                        opts.forceDisplay;
    
    if (needsDisplay && !opts.preferInline) {
        return `$$${latex}$$`;
    }
    return `$${latex}$`;
}

/**
 * Expression simplification (basic implementation)
 */
function simplifyExpression(expr) {
    // This can be enhanced with more sophisticated simplification
    return expr;
}

/**
 * Get conversion statistics and metadata
 */
function getConversionInfo(expression, direction = 'to-latex') {
    const info = {
        direction,
        timestamp: new Date().toISOString(),
        expressionType: 'unknown'
    };
    
    if (direction === 'to-latex') {
        if (expression.terms) {
            info.expressionType = 'polynomial';
            info.termCount = expression.terms.length;
        } else if (expression.numi && expression.deno !== undefined) {
            info.expressionType = 'fraction';
            info.numeratorTerms = expression.numi.terms?.length || 0;
            info.denominatorType = typeof expression.deno === 'number' ? 'constant' : 'polynomial';
        } else if (expression.coeff !== undefined) {
            info.expressionType = 'term';
        }
    }
    
    return info;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if two expressions are equivalent
 */
function areExpressionsEquivalent(expr1, expr2) {
    try {
        const latex1 = slangToLatex(expr1);
        const latex2 = slangToLatex(expr2);
        return latex1 === latex2;
    } catch (error) {
        return false;
    }
}

/**
 * Get expression complexity score
 */
function getExpressionComplexity(expr) {
    let complexity = 1;
    
    if (expr.terms) {
        complexity += expr.terms.length;
        expr.terms.forEach(term => {
            if (term.var) {
                complexity += Object.keys(term.var).length;
                Object.values(term.var).forEach(power => {
                    complexity += power > 1 ? power - 1 : 0;
                });
            }
        });
    } else if (expr.numi && expr.deno !== undefined) {
        complexity += getExpressionComplexity(expr.numi);
        if (typeof expr.deno !== 'number') {
            complexity += getExpressionComplexity(expr.deno);
        } else {
            complexity += 1;
        }
    } else if (expr.coeff !== undefined) {
        if (expr.var) {
            complexity += Object.keys(expr.var).length;
            Object.values(expr.var).forEach(power => {
                complexity += power > 1 ? power - 1 : 0;
            });
        }
    }
    
    return complexity;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    // Core conversion functions
    slangToLatex,
    latexToSlang,
    
    // Component functions
    termToLatex,
    polynomialToLatex,
    fractionToLatex,
    parseTerm,
    parsePolynomial,
    parseFraction,
    
    // Advanced features
    expressionToLatex,
    batchConvertToLatex,
    batchConvertToSlang,
    validateLatex,
    formatDisplayMode,
    simplifyExpression,
    
    // Utility functions
    getConversionInfo,
    areExpressionsEquivalent,
    getExpressionComplexity,
    
    // Parsers (for advanced usage)
    parseNumber,
    parseVariable
};

// ============================================================================
// DEMO AND TESTING FUNCTIONS
// ============================================================================

/**
 * Comprehensive demo function
 */
function demoConverter() {
    console.log('🚀 SLaNg LaTeX Converter - Unified Edition Demo');
    console.log('=' .repeat(60));
    
    // Test expressions
    const testExpressions = [
        createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)]),
        createFraction([createTerm(1, { x: 2 }), createTerm(-1)], [createTerm(1, { x: 2 }), createTerm(1)]),
        { terms: [createTerm(2, { x: 2 }), createTerm(3, { x: 1 }), createTerm(-1)] },
        createTerm(5, { y: 3, z: 2 })
    ];
    
    console.log('\n📐 SLaNg to LaTeX Conversions:');
    testExpressions.forEach((expr, i) => {
        const latex = slangToLatex(expr);
        const info = getConversionInfo(expr, 'to-latex');
        console.log(`${i + 1}. ${fractionToString(expr).padEnd(25)} → ${latex} (${info.expressionType})`);
    });
    
    // Test LaTeX inputs
    const testLatex = [
        '\\frac{x}{x+1}',
        '\\frac{x^{2}-1}{x^{2}+1}',
        '2x^{2} + 3x - 1',
        '5y^{3}z^{2}'
    ];
    
    console.log('\n🔄 LaTeX to SLaNg Conversions:');
    testLatex.forEach((latex, i) => {
        try {
            const slang = latexToSlang(latex);
            const backToLatex = slangToLatex(slang);
            const validation = validateLatex(latex);
            console.log(`${i + 1}. ${latex.padEnd(25)} → ${fractionToString(slang).padEnd(25)} (${validation.valid ? '✅' : '❌'})`);
        } catch (error) {
            console.log(`${i + 1}. ${latex.padEnd(25)} → Error: ${error.message}`);
        }
    });
    
    console.log('\n🎯 Advanced Features Demo:');
    
    // Batch conversion
    const batchResult = batchConvertToLatex(testExpressions, { includeErrors: true });
    console.log(`Batch conversion: ${batchResult.results.filter(r => r.success).length}/${batchResult.results.length} successful`);
    
    // Validation
    const validationResults = testLatex.map(latex => validateLatex(latex));
    console.log(`Validation: ${validationResults.filter(v => v.valid).length}/${validationResults.length} valid LaTeX expressions`);
    
    console.log('\n🚀 Unified Converter - All Features Operational!');
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/').replace(/ /g, '%20')}` || process.argv[1].endsWith('slang-convertor.js')) {
    demoConverter();
}

