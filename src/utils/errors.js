/**
 * SLaNg Error Handling System
 * Comprehensive error types and handling utilities
 */

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Base SLaNg Error class
 */
class SLaNgError extends Error {
    constructor(message, code, context = {}) {
        super(message);
        this.name = 'SLaNgError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            context: this.context,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

/**
 * Parsing Error for LaTeX/SLaNg conversion issues
 */
class ParseError extends SLaNgError {
    constructor(message, input, position = null, suggestions = []) {
        super(message, 'PARSE_ERROR', {
            input,
            position,
            suggestions
        });
        this.name = 'ParseError';
    }
}

/**
 * Validation Error for invalid expressions
 */
class ValidationError extends SLaNgError {
    constructor(message, expression, validationType) {
        super(message, 'VALIDATION_ERROR', {
            expression,
            validationType
        });
        this.name = 'ValidationError';
    }
}

/**
 * Conversion Error for SLaNg ↔ LaTeX conversion failures
 */
class ConversionError extends SLaNgError {
    constructor(message, fromType, toType, expression) {
        super(message, 'CONVERSION_ERROR', {
            fromType,
            toType,
            expression
        });
        this.name = 'ConversionError';
    }
}

/**
 * Type Error for unsupported expression types
 */
class TypeError extends SLaNgError {
    constructor(message, expectedType, actualType, expression) {
        super(message, 'TYPE_ERROR', {
            expectedType,
            actualType,
            expression
        });
        this.name = 'TypeError';
    }
}

// ============================================================================
// ERROR FACTORIES
// ============================================================================

/**
 * Create parsing errors with helpful context
 */
export function createParseError(message, input, position = null) {
    const suggestions = generateSuggestions(input, position);
    return new ParseError(message, input, position, suggestions);
}

/**
 * Create validation errors
 */
export function createValidationError(message, expression, type = 'general') {
    return new ValidationError(message, expression, type);
}

/**
 * Create conversion errors
 */
export function createConversionError(message, fromType, toType, expression) {
    return new ConversionError(message, fromType, toType, expression);
}

/**
 * Create type errors
 */
export function createTypeError(message, expectedType, actualType, expression) {
    return new TypeError(message, expectedType, actualType, expression);
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Enhanced error handler with multiple strategies
 */
export function handleError(error, options = {}) {
    const {
        logErrors = true,
        throwOnError = false,
        returnNull = false,
        customHandler = null
    } = options;

    // Log error if requested
    if (logErrors) {
        logError(error);
    }

    // Custom handler takes precedence
    if (customHandler && typeof customHandler === 'function') {
        return customHandler(error);
    }

    // Handle based on options
    if (throwOnError) {
        throw error;
    }

    if (returnNull) {
        return null;
    }

    // Default: return error object
    return {
        success: false,
        error: error.toJSON(),
        message: error.message
    };
}

/**
 * Batch error handler for multiple operations
 */
export function handleBatchErrors(errors, options = {}) {
    const {
        groupByType = true,
        includeContext = true,
        summaryOnly = false
    } = options;

    if (summaryOnly) {
        return createErrorSummary(errors);
    }

    const processed = errors.map(error => ({
        index: error.index || -1,
        ...error.toJSON()
    }));

    if (groupByType) {
        return groupErrorsByType(processed);
    }

    return {
        total: errors.length,
        errors: processed
    };
}

// ============================================================================
// ERROR UTILITIES
// ============================================================================

/**
 * Generate helpful suggestions based on error context
 */
function generateSuggestions(input, position) {
    const suggestions = [];
    
    if (!input) {
        suggestions.push('Empty input provided');
        return suggestions;
    }

    // Common LaTeX syntax issues
    if (input.includes('\\frac') && !input.includes('{')) {
        suggestions.push('LaTeX fractions require braces: \\frac{numerator}{denominator}');
    }

    if (input.includes('^') && !input.includes('{')) {
        suggestions.push('Consider using braces for powers: x^{2} instead of x^2');
    }

    if (input.includes('{') && !input.includes('}')) {
        suggestions.push('Unclosed braces detected');
    }

    // Common parsing issues
    if (position !== null && position > 0) {
        const before = input.substring(0, position);
        const after = input.substring(position);
        
        if (before.endsWith('^') && after.startsWith('{')) {
            suggestions.push('Power syntax looks correct');
        }
        
        if (before.endsWith('\\frac') && !after.startsWith('{')) {
            suggestions.push('Fraction requires opening brace after \\frac');
        }
    }

    return suggestions;
}

/**
 * Log errors with structured format
 */
function logError(error) {
    const logEntry = {
        timestamp: error.timestamp,
        level: 'ERROR',
        type: error.name,
        code: error.code,
        message: error.message,
        context: error.context
    };

    console.error('🚨 SLaNg Error:', JSON.stringify(logEntry, null, 2));
}

/**
 * Create error summary for batch operations
 */
function createErrorSummary(errors) {
    const summary = {
        total: errors.length,
        byType: {},
        mostCommon: null
    };

    errors.forEach(error => {
        const type = error.name || 'Unknown';
        summary.byType[type] = (summary.byType[type] || 0) + 1;
    });

    // Find most common error type
    const types = Object.entries(summary.byType);
    if (types.length > 0) {
        summary.mostCommon = types.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    return summary;
}

/**
 * Group errors by type
 */
function groupErrorsByType(errors) {
    const grouped = {};

    errors.forEach(error => {
        const type = error.name || 'Unknown';
        if (!grouped[type]) {
            grouped[type] = [];
        }
        grouped[type].push(error);
    });

    return grouped;
}

/**
 * Validate error context
 */
export function validateErrorContext(context) {
    const required = ['timestamp', 'code'];
    const missing = required.filter(key => !(key in context));
    
    if (missing.length > 0) {
        throw new Error(`Missing required error context: ${missing.join(', ')}`);
    }
    
    return true;
}

/**
 * Create error recovery suggestions
 */
export function createRecoveryPlan(error) {
    const plan = {
        error: error.message,
        steps: [],
        alternatives: []
    };

    switch (error.code) {
        case 'PARSE_ERROR':
            plan.steps.push('Check LaTeX syntax');
            plan.steps.push('Verify all braces are matched');
            plan.steps.push('Ensure fraction format is correct');
            plan.alternatives.push('Try simpler expression');
            break;

        case 'VALIDATION_ERROR':
            plan.steps.push('Review expression format');
            plan.steps.push('Check for invalid characters');
            plan.alternatives.push('Use validateLatex() first');
            break;

        case 'CONVERSION_ERROR':
            plan.steps.push('Verify expression type');
            plan.steps.push('Check converter options');
            plan.alternatives.push('Try different conversion method');
            break;

        default:
            plan.steps.push('Review error context');
            plan.alternatives.push('Contact support');
    }

    return plan;
}

// ============================================================================
// ERROR RECOVERY
// ============================================================================

/**
 * Attempt to recover from parsing errors
 */
export function attemptRecovery(error, originalInput) {
    const recovery = {
        success: false,
        attempts: [],
        result: null
    };

    // Try common fixes
    const fixes = [
        { name: 'Add missing braces', fix: addMissingBraces },
        { name: 'Fix fraction syntax', fix: fixFractionSyntax },
        { name: 'Normalize whitespace', fix: normalizeWhitespace },
        { name: 'Escape special chars', fix: escapeSpecialChars }
    ];

    for (const fix of fixes) {
        try {
            const fixed = fix.fix(originalInput);
            recovery.attempts.push({
                name: fix.name,
                input: fixed,
                success: true
            });
            
            if (fixed !== originalInput) {
                recovery.success = true;
                recovery.result = fixed;
                break;
            }
        } catch (attemptError) {
            recovery.attempts.push({
                name: fix.name,
                error: attemptError.message,
                success: false
            });
        }
    }

    return recovery;
}

/**
 * Recovery helper functions
 */
function addMissingBraces(input) {
    // Add missing braces for fractions and powers
    let fixed = input;
    
    // Fix fractions
    fixed = fixed.replace(/\\frac([^{}])/g, '\\frac{$1');
    fixed = fixed.replace(/\\frac{([^{}]+)}([^{}])/g, '\\frac{$1}{$2}');
    
    // Fix powers
    fixed = fixed.replace(/\^([^{}])/g, '^{$1}');
    
    return fixed;
}

function fixFractionSyntax(input) {
    // Common fraction syntax fixes
    return input
        .replace(/\\frac\s*\{/g, '\\frac{')
        .replace(/\}\s*\{/g, '}{');
}

function normalizeWhitespace(input) {
    // Normalize whitespace around operators
    return input
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s*\*\s*/g, ' * ')
        .trim();
}

function escapeSpecialChars(input) {
    // Escape problematic characters
    return input
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#');
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    SLaNgError,
    ParseError,
    ValidationError,
    ConversionError,
    TypeError
};

// Error codes for reference
export const ERROR_CODES = {
    PARSE_ERROR: 'PARSE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CONVERSION_ERROR: 'CONVERSION_ERROR',
    TYPE_ERROR: 'TYPE_ERROR'
};
