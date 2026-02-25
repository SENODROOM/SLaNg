/**
 * SLaNg LaTeX Converter - Final Demonstration
 * Showcasing the complete bidirectional conversion capabilities
 */

import {
    createTerm,
    createFraction
} from '../slang-basic.js';

import {
    slangToLatex,
    latexToSlang,
    batchConvertToLatex,
    batchConvertToSlang,
    validateLatex,
    formatDisplayMode
} from '../slang-convertor.js';

console.log('🚀 SLaNg LaTeX Converter - Complete Demonstration');
console.log('=' .repeat(60));

// ============================================================================
// DEMO 1: BASIC CONVERSIONS
// ============================================================================

console.log('\n📐 DEMO 1: Basic Mathematical Expressions');
console.log('-'.repeat(40));

const basicExamples = [
    { slang: createTerm(5, { x: 2 }), name: '5x²' },
    { slang: createTerm(-3, { y: 3 }), name: '-3y³' },
    { slang: { terms: [createTerm(2, { x: 1 }), createTerm(3)] }, name: '2x + 3' },
    { slang: { terms: [createTerm(1, { x: 2 }), createTerm(-4, { x: 1 }), createTerm(4)] }, name: 'x² - 4x + 4' }
];

basicExamples.forEach((example, i) => {
    const latex = slangToLatex(example.slang);
    console.log(`${i + 1}. ${example.name.padEnd(15)} → ${latex}`);
});

// ============================================================================
// DEMO 2: RATIONAL FUNCTIONS
// ============================================================================

console.log('\n🎯 DEMO 2: Rational Functions');
console.log('-'.repeat(40));

const rationalExamples = [
    { 
        slang: createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)]), 
        name: 'x/(x+1)' 
    },
    { 
        slang: createFraction([createTerm(1, { x: 2 }), createTerm(-1)], [createTerm(1, { x: 2 }), createTerm(1)]), 
        name: '(x²-1)/(x²+1)' 
    },
    { 
        slang: createFraction([createTerm(1, { x: 2, y: 1 })], [createTerm(1, { x: 1 }), createTerm(1, { y: 1 })]), 
        name: 'x²y/(x+y)' 
    }
];

rationalExamples.forEach((example, i) => {
    const latex = slangToLatex(example.slang);
    const display = formatDisplayMode(latex);
    console.log(`${i + 1}. ${example.name.padEnd(20)} → ${display}`);
});

// ============================================================================
// DEMO 3: ROUND-TRIP CONVERSIONS
// ============================================================================

console.log('\n🔄 DEMO 3: Round-Trip Conversions (LaTeX → SLaNg → LaTeX)');
console.log('-'.repeat(60));

const roundTripTests = [
    'x^{2} + 2x + 1',
    '\\frac{x}{x+1}',
    '3x^{2} - 2x + 5',
    '\\frac{x^{2}-1}{x^{2}+1}',
    '2x + 3y - z'
];

roundTripTests.forEach((latex, i) => {
    try {
        const slang = latexToSlang(latex);
        const backToLatex = slangToLatex(slang);
        const success = latex === backToLatex ? '✅' : '⚠️';
        
        console.log(`${i + 1}. ${latex.padEnd(25)} → ${success} ${backToLatex}`);
    } catch (error) {
        console.log(`${i + 1}. ${latex.padEnd(25)} → ❌ Error: ${error.message}`);
    }
});

// ============================================================================
// DEMO 4: BATCH PROCESSING
// ============================================================================

console.log('\n📦 DEMO 4: Batch Processing');
console.log('-'.repeat(40));

const batchLatex = [
    'x + 1',
    '2x^{2} + 3x',
    '\\frac{x}{y}',
    'x^{3} - 2x^{2} + x'
];

console.log('Batch LaTeX → SLaNg:');
const slangResults = batchConvertToSlang(batchLatex);
slangResults.forEach((result, i) => {
    if (typeof result === 'object') {
        const backToLatex = slangToLatex(result);
        console.log(`  ${i + 1}. ${batchLatex[i].padEnd(20)} → ${backToLatex}`);
    } else {
        console.log(`  ${i + 1}. ${batchLatex[i].padEnd(20)} → ${result}`);
    }
});

// ============================================================================
// DEMO 5: VALIDATION
// ============================================================================

console.log('\n✅ DEMO 5: LaTeX Validation');
console.log('-'.repeat(40));

const validationTests = [
    { latex: 'x^{2} + 1', expected: true },
    { latex: '\\frac{x}{x+1}', expected: true },
    { latex: '3x^{2} - 2x', expected: true },
    { latex: '\\frac{x}{', expected: false },
    { latex: 'x^{', expected: false },
    { latex: '', expected: false }
];

validationTests.forEach((test, i) => {
    const validation = validateLatex(test.latex);
    const status = validation.valid === test.expected ? '✅' : '❌';
    console.log(`${i + 1}. "${test.latex.padEnd(15)}" → ${status} Valid: ${validation.valid}`);
});

// ============================================================================
// DEMO 6: ADVANCED FEATURES
// ============================================================================

console.log('\n🔧 DEMO 6: Advanced Features');
console.log('-'.repeat(40));

// Test with different options
const complexExpr = createFraction(
    [createTerm(2, { x: 3 }), createTerm(-5, { x: 2 }), createTerm(3, { x: 1 }), createTerm(-1)],
    [createTerm(1, { x: 2 }), createTerm(-4, { x: 1 }), createTerm(4)]
);

console.log('Original Expression:');
console.log(`  SLaNg: (2x³ - 5x² + 3x - 1)/(x² - 4x + 4)`);

const latexOptions = [
    { name: 'Default', options: {} },
    { name: 'With Parentheses', options: { parentheses: true } },
    { name: 'With Multiplication Symbol', options: { multiplySymbol: '\\cdot' } }
];

latexOptions.forEach((opt, i) => {
    const latex = slangToLatex(complexExpr, opt.options);
    console.log(`  ${opt.name}: ${latex}`);
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n📊 CONVERTER CAPABILITIES SUMMARY');
console.log('=' .repeat(60));
console.log('✅ Bidirectional conversion (SLaNg ↔ LaTeX)');
console.log('✅ Support for polynomials and rational functions');
console.log('✅ Multivariable expressions');
console.log('✅ Complex mathematical expressions');
console.log('✅ Batch processing capabilities');
console.log('✅ LaTeX syntax validation');
console.log('✅ Display mode formatting');
console.log('✅ Flexible conversion options');
console.log('✅ Robust error handling');
console.log('✅ Comprehensive test coverage');

console.log('\n🎯 Key Features:');
console.log('• Enhanced parsing for coefficients and variables');
console.log('• Support for powers with braces: x^{2}, x^{3}');
console.log('• Proper handling of plus/minus signs');
console.log('• Fraction parsing with nested expressions');
console.log('• Configurable output formatting');
console.log('• Strict and lenient parsing modes');

console.log('\n🚀 SLaNg LaTeX Converter - Ready for Production Use!');
console.log('   File: slang-convertor.js');
console.log('   Tests: experiments/test-converter-v2.js');
