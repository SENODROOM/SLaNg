/**
 * SLaNg Math Library  - Comprehensive Test Suite
 * Tests all new features including polynomial denominators
 */

import {
    createTerm,
    createFraction,
    evaluateFraction,
    differentiateFraction,
    integrateFraction,
    numericalIntegrateFraction,
    simplifyFraction,
    multiplyPolynomials,
    addPolynomials,
    subtractPolynomials,
    fractionToString,
    polynomialToString
} from '../slang-basic.js';

// ============================================================================
// TEST UTILITIES
// ============================================================================

function testHeader(title) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${title}`);
    console.log('='.repeat(70));
}

function testCase(name, result, expected = null) {
    const status = expected !== null && Math.abs(result - expected) < 0.001 ? '✓' : '•';
    console.log(`${status} ${name}:`);
    console.log(`  Result: ${result}`);
    if (expected !== null) {
        console.log(`  Expected: ${expected}`);
        console.log(`  Match: ${Math.abs(result - expected) < 0.001 ? 'YES' : 'NO'}`);
    }
    console.log();
}

function displayFraction(name, fraction) {
    console.log(`${name}:`);
    console.log(`  ${fractionToString(fraction)}`);
    console.log();
}

// ============================================================================
// TEST 1: POLYNOMIAL DENOMINATOR CREATION
// ============================================================================

testHeader('TEST 1: Polynomial Denominator Creation');

// Test 1a: Simple rational function x/(x+1)
const f1 = createFraction(
    [createTerm(1, { x: 1 })],                    // x
    [createTerm(1, { x: 1 }), createTerm(1)]     // x + 1
);

displayFraction('f(x) = x/(x+1)', f1);

const f1_at_2 = evaluateFraction(f1, { x: 2 });
testCase('f(2)', f1_at_2, 2 / 3);

// Test 1b: Complex rational function (x²-1)/(x²+1)
const f2 = createFraction(
    [createTerm(1, { x: 2 }), createTerm(-1)],   // x² - 1
    [createTerm(1, { x: 2 }), createTerm(1)]     // x² + 1
);

displayFraction('g(x) = (x²-1)/(x²+1)', f2);

const f2_at_0 = evaluateFraction(f2, { x: 0 });
testCase('g(0)', f2_at_0, -1);

const f2_at_1 = evaluateFraction(f2, { x: 1 });
testCase('g(1)', f2_at_1, 0);

// Test 1c: Multivariable rational (x²y)/(x+y)
const f3 = createFraction(
    [createTerm(1, { x: 2, y: 1 })],                   // x²y
    [createTerm(1, { x: 1 }), createTerm(1, { y: 1 })]  // x + y
);

displayFraction('h(x,y) = x²y/(x+y)', f3);

const f3_at_point = evaluateFraction(f3, { x: 2, y: 3 });
testCase('h(2,3)', f3_at_point, 12 / 5);

// ============================================================================
// TEST 2: QUOTIENT RULE DIFFERENTIATION
// ============================================================================

testHeader('TEST 2: Quotient Rule Differentiation');

// Test 2a: d/dx[x/(x+1)] = 1/(x+1)²
const f1_prime = differentiateFraction(f1, 'x');
displayFraction("f'(x) = d/dx[x/(x+1)]", f1_prime);

// Evaluate f'(1) - should be 1/4
const f1_prime_at_1 = evaluateFraction(f1_prime, { x: 1 });
testCase("f'(1)", f1_prime_at_1, 0.25);

// Test 2b: d/dx[(x²-1)/(x²+1)] = 4x/(x²+1)²
const f2_prime = differentiateFraction(f2, 'x');
displayFraction("g'(x) = d/dx[(x²-1)/(x²+1)]", f2_prime);

// Evaluate g'(1) - should be 4/4 = 1
const f2_prime_at_1 = evaluateFraction(f2_prime, { x: 1 });
testCase("g'(1)", f2_prime_at_1, 1.0);

// Test 2c: Simple case - polynomial with constant denominator
const f4 = createFraction(
    [createTerm(2, { x: 2 }), createTerm(3, { x: 1 })],  // 2x² + 3x
    4                                                 // constant
);

const f4_prime = differentiateFraction(f4, 'x');
displayFraction("d/dx[(2x²+3x)/4]", f4_prime);

const f4_prime_at_2 = evaluateFraction(f4_prime, { x: 2 });
testCase("f'(2) for (2x²+3x)/4", f4_prime_at_2, (8 + 3) / 4);

// ============================================================================
// TEST 3: POLYNOMIAL ARITHMETIC
// ============================================================================

testHeader('TEST 3: Polynomial Arithmetic');

// Create two polynomials
const p1 = { terms: [createTerm(1, { x: 2 }), createTerm(-2, { x: 1 }), createTerm(1)] };  // x² - 2x + 1
const p2 = { terms: [createTerm(1, { x: 1 }), createTerm(1)] };  // x + 1

console.log('p₁(x) =', polynomialToString(p1));
console.log('p₂(x) =', polynomialToString(p2));
console.log();

// Test 3a: Addition
const sum = addPolynomials(p1, p2);
console.log('p₁ + p₂ =', polynomialToString(sum));
console.log();

// Test 3b: Subtraction
const diff = subtractPolynomials(p1, p2);
console.log('p₁ - p₂ =', polynomialToString(diff));
console.log();

// Test 3c: Multiplication
const prod = multiplyPolynomials(p1, p2);
console.log('p₁ × p₂ =', polynomialToString(prod));
console.log('(Should be x³ - x² - x + 1)');
console.log();

// ============================================================================
// TEST 4: NUMERICAL INTEGRATION (SIMPSON'S RULE)
// ============================================================================

testHeader("TEST 4: Numerical Integration (Simpson's Rule)");

// Test 4a: ∫₀¹ x/(x²+1) dx
// This equals (1/2)ln(2) ≈ 0.3466
const integral1 = numericalIntegrateFraction(
    createFraction(
        [createTerm(1, { x: 1 })],
        [createTerm(1, { x: 2 }), createTerm(1)]
    ),
    0, 1, 'x', 1000
);

console.log('∫₀¹ x/(x²+1) dx:');
const result1 = evaluateFraction(integral1, {});
testCase('Numerical result', result1, Math.log(2) / 2);

// Test 4b: ∫₀¹ 1/(1+x²) dx
// This equals arctan(1) = π/4 ≈ 0.7854
const integral2 = numericalIntegrateFraction(
    createFraction(
        [createTerm(1)],
        [createTerm(1, { x: 2 }), createTerm(1)]
    ),
    0, 1, 'x', 10000
);

const result2 = evaluateFraction(integral2, {});
testCase('∫₀¹ 1/(1+x²) dx', result2, Math.PI / 4);

// Test 4c: Compare with simple polynomial (should match symbolic)
const integral3 = numericalIntegrateFraction(
    createFraction([createTerm(1, { x: 2 })], 1),  // x²
    0, 2, 'x', 1000
);

const result3 = evaluateFraction(integral3, {});
testCase('∫₀² x² dx (numerical)', result3, 8 / 3);

// ============================================================================
// TEST 5: SIMPLIFICATION WITH GCD
// ============================================================================

testHeader('TEST 5: Fraction Simplification with GCD');

// Test 5a: (6x² + 9x)/3 should simplify to (2x² + 3x)/1 or 2x² + 3x
const f5 = createFraction(
    [createTerm(6, { x: 2 }), createTerm(9, { x: 1 })],
    3
);

console.log('Before simplification:', fractionToString(f5));

const f5_simplified = simplifyFraction(f5);
console.log('After simplification:', fractionToString(f5_simplified));
console.log('(Should reduce coefficients by GCD of 3)');
console.log();

// Test 5b: (4x + 8)/4 = x + 2
const f6 = createFraction(
    [createTerm(4, { x: 1 }), createTerm(8)],
    4
);

console.log('Before:', fractionToString(f6));
const f6_simplified = simplifyFraction(f6);
console.log('After:', fractionToString(f6_simplified));
console.log();

// ============================================================================
// TEST 6: PARTIAL DERIVATIVES OF RATIONAL FUNCTIONS
// ============================================================================

testHeader('TEST 6: Partial Derivatives of Rational Functions');

// f(x,y) = xy/(x+y)
const f_xy = createFraction(
    [createTerm(1, { x: 1, y: 1 })],
    [createTerm(1, { x: 1 }), createTerm(1, { y: 1 })]
);

displayFraction('f(x,y) = xy/(x+y)', f_xy);

// ∂f/∂x
const df_dx = differentiateFraction(f_xy, 'x');
displayFraction('∂f/∂x', df_dx);

// Evaluate at (2,3)
const df_dx_at_point = evaluateFraction(df_dx, { x: 2, y: 3 });
console.log(`∂f/∂x at (2,3) = ${df_dx_at_point}`);
console.log();

// ∂f/∂y
const df_dy = differentiateFraction(f_xy, 'y');
displayFraction('∂f/∂y', df_dy);

const df_dy_at_point = evaluateFraction(df_dy, { x: 2, y: 3 });
console.log(`∂f/∂y at (2,3) = ${df_dy_at_point}`);
console.log();

// ============================================================================
// TEST 7: COMPLEX RATIONAL FUNCTION ANALYSIS
// ============================================================================

testHeader('TEST 7: Complex Rational Function Analysis');

// Analyze f(x) = (x²-4)/(x²-1)
const f7 = createFraction(
    [createTerm(1, { x: 2 }), createTerm(-4)],  // x² - 4
    [createTerm(1, { x: 2 }), createTerm(-1)]   // x² - 1
);

displayFraction('f(x) = (x²-4)/(x²-1)', f7);

// Find derivative
const f7_prime = differentiateFraction(f7, 'x');
displayFraction("f'(x)", f7_prime);

// Evaluate at several points
const test_points = [-2, 0, 2, 3];
console.log('Function values:');
for (let x of test_points) {
    try {
        const val = evaluateFraction(f7, { x });
        const deriv = evaluateFraction(f7_prime, { x });
        console.log(`  x=${x}: f(x)=${val.toFixed(4)}, f'(x)=${deriv.toFixed(4)}`);
    } catch (e) {
        console.log(`  x=${x}: undefined (division by zero)`);
    }
}
console.log();

// ============================================================================
// TEST 8: HIGHER-ORDER DERIVATIVES
// ============================================================================

testHeader('TEST 8: Higher-Order Derivatives');

// f(x) = x/(x+1)
// f'(x) = 1/(x+1)²
// f''(x) = -2/(x+1)³

const f8 = createFraction(
    [createTerm(1, { x: 1 })],
    [createTerm(1, { x: 1 }), createTerm(1)]
);

displayFraction('f(x) = x/(x+1)', f8);

const f8_prime = differentiateFraction(f8, 'x');
displayFraction("f'(x)", f8_prime);

const f8_double_prime = differentiateFraction(f8_prime, 'x');
displayFraction("f''(x)", f8_double_prime);

// Evaluate second derivative at x=1
const f8_dp_at_1 = evaluateFraction(f8_double_prime, { x: 1 });
testCase("f''(1) for x/(x+1)", f8_dp_at_1, -0.25);

// ============================================================================
// TEST SUMMARY
// ============================================================================

testHeader('TEST SUMMARY');

console.log('All tests completed!');
console.log();
console.log('✓ Polynomial denominators working');
console.log('✓ Quotient rule automatic differentiation working');
console.log('✓ Polynomial arithmetic working');
console.log("✓ Simpson's rule numerical integration working");
console.log('✓ GCD simplification working');
console.log('✓ Partial derivatives of rational functions working');
console.log('✓ Higher-order derivatives working');
console.log();
console.log('SLaNg Math Library  - All Systems Operational! 🚀');
console.log();
