/**
 * Unit Tests for SLaNg LaTeX Converter
 * Comprehensive test suite with Jest-style assertions
 */

import {
    createTerm,
    createFraction
} from '../../slang-basic.js';

import {
    slangToLatex,
    latexToSlang,
    termToLatex,
    polynomialToLatex,
    fractionToLatex,
    parseTerm,
    parsePolynomial,
    parseFraction,
    parseNumber,
    parseVariable,
    batchConvertToLatex,
    batchConvertToSlang,
    validateLatex,
    formatDisplayMode,
    getConversionInfo,
    areExpressionsEquivalent,
    getExpressionComplexity
} from '../../slang-convertor.js';

// ============================================================================
// TEST FRAMEWORK
// ============================================================================

class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    async run() {
        console.log(`\n🧪 Running ${this.name}`);
        console.log('='.repeat(60));

        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                this.results.passed++;
                console.log(`✅ ${description}`);
            } catch (error) {
                this.results.failed++;
                console.log(`❌ ${description}`);
                console.log(`   Error: ${error.message}`);
            }
            this.results.total++;
        }

        console.log(`\n📊 Results: ${this.results.passed}/${this.results.total} passed`);
        return this.results;
    }
}

// Assertion helpers
function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
    }
}

function assertDeepEqual(actual, expected, message = '') {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${message}`);
    }
}

function assertThrows(fn, message = '') {
    try {
        fn();
        throw new Error(`Expected function to throw. ${message}`);
    } catch (error) {
        // Expected behavior
    }
}

function assertInstanceOf(obj, constructor, message = '') {
    if (!(obj instanceof constructor)) {
        throw new Error(`Expected instance of ${constructor.name}, got ${typeof obj}. ${message}`);
    }
}

// ============================================================================
// CORE CONVERSION TESTS
// ============================================================================

const coreTests = new TestSuite('Core Conversion Functions');

coreTests.test('slangToLatex converts term correctly', () => {
    const term = createTerm(5, { x: 2, y: 1 });
    const result = slangToLatex(term);
    assertEqual(result, '5x^{2}y');
});

coreTests.test('slangToLatex converts polynomial correctly', () => {
    const poly = { 
        terms: [
            createTerm(1, { x: 2 }), 
            createTerm(-2, { x: 1 }), 
            createTerm(1)
        ] 
    };
    const result = slangToLatex(poly);
    assertEqual(result, 'x^{2} - 2x + 1');
});

coreTests.test('slangToLatex converts fraction correctly', () => {
    const frac = createFraction(
        [createTerm(1, { x: 1 })], 
        [createTerm(1, { x: 1 }), createTerm(1)]
    );
    const result = slangToLatex(frac);
    assertEqual(result, '\\frac{x}{x + 1}');
});

coreTests.test('latexToSlang converts term correctly', () => {
    const result = latexToSlang('5x^{2}y');
    const expected = createTerm(5, { x: 2, y: 1 });
    assertDeepEqual(result, expected);
});

coreTests.test('latexToSlang converts polynomial correctly', () => {
    const result = latexToSlang('x^{2} - 2x + 1');
    const expected = { 
        terms: [
            createTerm(1, { x: 2 }), 
            createTerm(-2, { x: 1 }), 
            createTerm(1)
        ] 
    };
    assertDeepEqual(result, expected);
});

coreTests.test('latexToSlang converts fraction correctly', () => {
    const result = latexToSlang('\\frac{x}{x + 1}');
    const expected = createFraction(
        [createTerm(1, { x: 1 })], 
        [createTerm(1, { x: 1 }), createTerm(1)]
    );
    assertDeepEqual(result, expected);
});

coreTests.test('Round-trip conversion works', () => {
    const original = createFraction(
        [createTerm(1, { x: 2 }), createTerm(-1)],
        [createTerm(1, { x: 2 }), createTerm(1)]
    );
    
    const latex = slangToLatex(original);
    const backToSlang = latexToSlang(latex);
    const backToLatex = slangToLatex(backToSlang);
    
    assertEqual(latex, backToLatex);
});

// ============================================================================
// COMPONENT FUNCTION TESTS
// ============================================================================

const componentTests = new TestSuite('Component Functions');

componentTests.test('termToLatex handles positive coefficient', () => {
    const term = createTerm(5, { x: 2 });
    const result = termToLatex(term);
    assertEqual(result, '5x^{2}');
});

componentTests.test('termToLatex handles negative coefficient', () => {
    const term = createTerm(-1, { x: 3 });
    const result = termToLatex(term);
    assertEqual(result, '-x^{3}');
});

componentTests.test('termToLatex handles implicit coefficient 1', () => {
    const term = createTerm(1, { a: 1, b: 2, c: 1 });
    const result = termToLatex(term);
    assertEqual(result, 'ab^{2}c');
});

componentTests.test('termToLatex handles zero term', () => {
    const term = createTerm(0);
    const result = termToLatex(term);
    assertEqual(result, '0');
});

componentTests.test('polynomialToLatex handles mixed signs', () => {
    const poly = { 
        terms: [
            createTerm(2, { x: 3 }), 
            createTerm(-5, { x: 2 }), 
            createTerm(3, { x: 1 }), 
            createTerm(-1)
        ] 
    };
    const result = polynomialToLatex(poly);
    assertEqual(result, '2x^{3} - 5x^{2} + 3x - 1');
});

componentTests.test('polynomialToLatex handles empty polynomial', () => {
    const poly = { terms: [] };
    const result = polynomialToLatex(poly);
    assertEqual(result, '0');
});

componentTests.test('fractionToLatex handles complex fraction', () => {
    const frac = createFraction(
        [createTerm(1, { x: 2 }), createTerm(-1)],
        [createTerm(1, { x: 2 }), createTerm(1)]
    );
    const result = fractionToLatex(frac);
    assertEqual(result, '\\frac{x^{2} - 1}{x^{2} + 1}');
});

componentTests.test('fractionToLatex handles constant denominator', () => {
    const frac = createFraction([createTerm(6, { x: 2 }), createTerm(9, { x: 1 })], 3);
    const result = fractionToLatex(frac);
    assertEqual(result, '\\frac{6x^{2} + 9x}{3}');
});

// ============================================================================
// PARSING FUNCTION TESTS
// ============================================================================

const parsingTests = new TestSuite('Parsing Functions');

parsingTests.test('parseNumber handles integers', () => {
    const result = parseNumber('5');
    assertEqual(result, 5);
});

parsingTests.test('parseNumber handles decimals', () => {
    const result = parseNumber('-3.14');
    assertEqual(result, -3.14);
});

parsingTests.test('parseNumber handles scientific notation', () => {
    const result = parseNumber('2.5e-3');
    assertEqual(result, 0.0025);
});

parsingTests.test('parseNumber handles empty string', () => {
    const result = parseNumber('');
    assertEqual(result, 1);
});

parsingTests.test('parseVariable handles simple variable', () => {
    const result = parseVariable('x');
    const expected = { variable: 'x', power: 1 };
    assertDeepEqual(result, expected);
});

parsingTests.test('parseVariable handles powered variable', () => {
    const result = parseVariable('x^{10}');
    const expected = { variable: 'x', power: 10 };
    assertDeepEqual(result, expected);
});

parsingTests.test('parseTerm handles simple variable', () => {
    const result = parseTerm('x');
    const expected = createTerm(1, { x: 1 });
    assertDeepEqual(result, expected);
});

parsingTests.test('parseTerm handles coefficient with variable', () => {
    const result = parseTerm('2x');
    const expected = createTerm(2, { x: 1 });
    assertDeepEqual(result, expected);
});

parsingTests.test('parseTerm handles multiple variables', () => {
    const result = parseTerm('5xy');
    const expected = createTerm(5, { x: 1, y: 1 });
    assertDeepEqual(result, expected);
});

parsingTests.test('parsePolynomial handles simple binomial', () => {
    const result = parsePolynomial('x + 1');
    const expected = { terms: [createTerm(1, { x: 1 }), createTerm(1)] };
    assertDeepEqual(result, expected);
});

parsingTests.test('parsePolynomial handles cubic polynomial', () => {
    const result = parsePolynomial('x^{3} - 2x^{2} + x - 5');
    const expected = { 
        terms: [
            createTerm(1, { x: 3 }), 
            createTerm(-2, { x: 2 }), 
            createTerm(1, { x: 1 }), 
            createTerm(-5)
        ] 
    };
    assertDeepEqual(result, expected);
});

parsingTests.test('parseFraction handles simple fraction', () => {
    const result = parseFraction('\\frac{x}{2}');
    const expected = createFraction([createTerm(1, { x: 1 })], 2);
    assertDeepEqual(result, expected);
});

parsingTests.test('parseFraction handles complex fraction', () => {
    const result = parseFraction('\\frac{x^{2} + 1}{x - 1}');
    const expected = createFraction(
        [createTerm(1, { x: 2 }), createTerm(1)],
        [createTerm(1, { x: 1 }), createTerm(-1)]
    );
    assertDeepEqual(result, expected);
});

// ============================================================================
// ADVANCED FEATURES TESTS
// ============================================================================

const advancedTests = new TestSuite('Advanced Features');

advancedTests.test('batchConvertToLatex processes multiple expressions', () => {
    const expressions = [
        createTerm(5, { x: 2 }),
        { terms: [createTerm(1, { x: 2 }), createTerm(-1)] },
        createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)])
    ];
    
    const results = batchConvertToLatex(expressions);
    const expected = ['5x^{2}', 'x^{2} - 1', '\\frac{x}{x + 1}'];
    
    assertDeepEqual(results, expected);
});

advancedTests.test('batchConvertToSlang processes multiple LaTeX expressions', () => {
    const latexExpressions = ['5x^{2}', 'x^{2} - 1', '\\frac{x}{x + 1}'];
    
    const results = batchConvertToSlang(latexExpressions);
    
    assertEqual(results.length, 3);
    // Each result should be a valid SLaNg expression
    results.forEach(result => {
        assert(typeof result === 'object' && result !== null);
    });
});

advancedTests.test('validateLatex validates correct expressions', () => {
    const validLatex = ['\\frac{x}{x+1}', '2x^{2} + 3x', '5'];
    
    validLatex.forEach(latex => {
        const validation = validateLatex(latex);
        assertEqual(validation.valid, true);
        assertDeepEqual(validation.errors, []);
    });
});

advancedTests.test('validateLatex rejects invalid expressions', () => {
    const invalidLatex = ['\\frac{x}{', '2x^{', 'invalid{}'];
    
    invalidLatex.forEach(latex => {
        const validation = validateLatex(latex);
        assertEqual(validation.valid, false);
        assert(validation.errors.length > 0);
    });
});

advancedTests.test('formatDisplayMode formats inline correctly', () => {
    const latex = 'x^{2} + 2x + 1';
    const result = formatDisplayMode(latex, { preferInline: true });
    assertEqual(result, '$x^{2} + 2x + 1$');
});

advancedTests.test('formatDisplayMode formats display correctly', () => {
    const latex = '\\frac{x}{x+1}';
    const result = formatDisplayMode(latex, { forceDisplay: true });
    assertEqual(result, '$$\\frac{x}{x+1}$$');
});

// ============================================================================
// UTILITY FUNCTION TESTS
// ============================================================================

const utilityTests = new TestSuite('Utility Functions');

utilityTests.test('getConversionInfo returns correct metadata', () => {
    const term = createTerm(5, { x: 2 });
    const info = getConversionInfo(term, 'to-latex');
    
    assertEqual(info.direction, 'to-latex');
    assertEqual(info.expressionType, 'term');
    assert(typeof info.timestamp === 'string');
});

utilityTests.test('areExpressionsEquivalent identifies identical terms', () => {
    const term1 = createTerm(5, { x: 2 });
    const term2 = createTerm(5, { x: 2 });
    
    const result = areExpressionsEquivalent(term1, term2);
    assertEqual(result, true);
});

utilityTests.test('areExpressionsEquivalent identifies different terms', () => {
    const term1 = createTerm(5, { x: 2 });
    const term2 = createTerm(5, { y: 2 });
    
    const result = areExpressionsEquivalent(term1, term2);
    assertEqual(result, false);
});

utilityTests.test('getExpressionComplexity calculates correctly', () => {
    const term = createTerm(5, { x: 2, y: 3 });
    const complexity = getExpressionComplexity(term);
    
    // Base complexity (1) + variables (2) + power contributions (1 + 2)
    assertEqual(complexity, 6);
});

utilityTests.test('getExpressionComplexity handles fractions', () => {
    const frac = createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)]);
    const complexity = getExpressionComplexity(frac);
    
    // Should be greater than simple term complexity
    assert(complexity > 5);
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

const errorTests = new TestSuite('Error Handling');

errorTests.test('latexToSlang throws on empty input', () => {
    assertThrows(() => {
        latexToSlang('');
    });
});

errorTests.test('latexToSlang throws on invalid LaTeX', () => {
    assertThrows(() => {
        latexToSlang('\\frac{x}{');
    });
});

errorTests.test('parseNumber throws on invalid number', () => {
    assertThrows(() => {
        parseNumber('invalid');
    });
});

errorTests.test('parseVariable throws on invalid variable', () => {
    assertThrows(() => {
        parseVariable('invalid');
    });
});

errorTests.test('slangToLatex throws on unsupported type', () => {
    assertThrows(() => {
        slangToLatex({ invalid: 'structure' });
    });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

const edgeCaseTests = new TestSuite('Edge Cases');

edgeCaseTests.test('Handles zero term', () => {
    const term = createTerm(0);
    const latex = slangToLatex(term);
    assertEqual(latex, '0');
    
    const parsed = latexToSlang('0');
    assertDeepEqual(parsed, term);
});

edgeCaseTests.test('Handles unit term', () => {
    const term = createTerm(1);
    const latex = slangToLatex(term);
    assertEqual(latex, '1');
    
    const parsed = latexToSlang('1');
    assertDeepEqual(parsed, term);
});

edgeCaseTests.test('Handles negative unit term', () => {
    const term = createTerm(-1);
    const latex = slangToLatex(term);
    assertEqual(latex, '-1');
    
    const parsed = latexToSlang('-1');
    assertDeepEqual(parsed, term);
});

edgeCaseTests.test('Handles empty polynomial', () => {
    const poly = { terms: [] };
    const latex = slangToLatex(poly);
    assertEqual(latex, '0');
});

edgeCaseTests.test('Handles fraction equal to 1', () => {
    const frac = createFraction([createTerm(1)], 1);
    const latex = slangToLatex(frac);
    assertEqual(latex, '1');
});

edgeCaseTests.test('Handles scientific notation', () => {
    const term = createTerm(1.5e-3, { x: 2 });
    const latex = slangToLatex(term);
    assertEqual(latex, '0.0015x^{2}');
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

const performanceTests = new TestSuite('Performance');

performanceTests.test('Handles large expressions efficiently', () => {
    // Create a complex expression
    const complexFrac = createFraction(
        [
            createTerm(1, { x: 5 }),
            createTerm(2, { x: 4, y: 1 }),
            createTerm(3, { x: 3, y: 2 }),
            createTerm(4, { x: 2, y: 3 }),
            createTerm(5, { x: 1, y: 4 }),
            createTerm(6, { y: 5 })
        ],
        [
            createTerm(1, { x: 3 }),
            createTerm(-2, { x: 2, y: 1 }),
            createTerm(1, { x: 1, y: 2 }),
            createTerm(-1, { y: 3 })
        ]
    );
    
    const startTime = performance.now();
    const latex = slangToLatex(complexFrac);
    const slang = latexToSlang(latex);
    const endTime = performance.now();
    
    // Should complete within reasonable time (100ms)
    assert(endTime - startTime < 100, 'Conversion took too long');
    
    // Round-trip should be successful
    assertEqual(latex, slangToLatex(slang));
});

performanceTests.test('Batch processing handles large arrays', () => {
    const expressions = [];
    for (let i = 0; i < 100; i++) {
        expressions.push(createTerm(i, { x: i % 5 + 1 }));
    }
    
    const startTime = performance.now();
    const results = batchConvertToLatex(expressions);
    const endTime = performance.now();
    
    assertEqual(results.length, 100);
    assert(endTime - startTime < 200, 'Batch processing took too long');
});

// ============================================================================
// TEST RUNNER
// ============================================================================

export async function runAllTests() {
    console.log('🚀 SLaNg LaTeX Converter - Unit Test Suite');
    console.log('='.repeat(80));
    
    const testSuites = [
        coreTests,
        componentTests,
        parsingTests,
        advancedTests,
        utilityTests,
        errorTests,
        edgeCaseTests,
        performanceTests
    ];
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;
    
    for (const suite of testSuites) {
        const results = await suite.run();
        totalPassed += results.passed;
        totalFailed += results.failed;
        totalTests += results.total;
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed} ✅`);
    console.log(`Failed: ${totalFailed} ${totalFailed > 0 ? '❌' : '✅'}`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
        console.log('\n🎉 All tests passed! The converter is working correctly.');
    } else {
        console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the issues above.`);
    }
    
    return {
        total: totalTests,
        passed: totalPassed,
        failed: totalFailed,
        successRate: (totalPassed / totalTests) * 100
    };
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/').replace(/ /g, '%20')}`) {
    runAllTests().catch(console.error);
}
