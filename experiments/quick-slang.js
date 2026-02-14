/**
 * SLaNg Quick Start Guide
 * Common patterns and recipes for symbolic math
 */

import {
    createTerm,
    createFraction,
    definiteIntegrateFraction,
    expandProduct,
    simplifyFraction,
    evaluateEquation,
    differentiateFraction
} from '../slang-math.js';

// ============================================================================
// RECIPE 1: Creating Simple Expressions
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 1: Creating Expressions');
console.log('═══════════════════════════════════════════\n');

// Creating "3x² + 2x + 1"
const polynomial = {
    numi: {
        terms: [
            createTerm(3, { x: 2 }),  // 3x²
            createTerm(2, { x: 1 }),  // 2x
            createTerm(1)             // 1
        ]
    },
    deno: 1
};

console.log('Polynomial: 3x² + 2x + 1');
console.log(JSON.stringify(polynomial, null, 2));
console.log('\n');

// ============================================================================
// RECIPE 2: Evaluating at Specific Values
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 2: Evaluation');
console.log('═══════════════════════════════════════════\n');

const expr = [[{
    numi: {
        terms: [
            createTerm(1, { x: 2 }),
            createTerm(-4, { x: 1 }),
            createTerm(4)
        ]
    },
    deno: 1
}]];

console.log('Expression: x² - 4x + 4');
console.log('At x=2:', evaluateEquation(expr, { x: 2 }));
console.log('At x=3:', evaluateEquation(expr, { x: 3 }));
console.log('At x=4:', evaluateEquation(expr, { x: 4 }));
console.log('\n');

// ============================================================================
// RECIPE 3: Single Variable Integration
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 3: Single Integration');
console.log('═══════════════════════════════════════════\n');

// ∫₀³ (2x + 1) dx
const linear = {
    numi: {
        terms: [
            createTerm(2, { x: 1 }),
            createTerm(1)
        ]
    },
    deno: 1
};

const result = definiteIntegrateFraction(linear, 0, 3, 'x');
const value = evaluateEquation([[result]], {});

console.log('∫₀³ (2x + 1) dx');
console.log('Result structure:', JSON.stringify(result, null, 2));
console.log('Numerical value:', value);
console.log('Expected: [x² + x]₀³ = 9 + 3 = 12');
console.log('\n');

// ============================================================================
// RECIPE 4: Double Integration
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 4: Double Integration');
console.log('═══════════════════════════════════════════\n');

// ∫₀¹ ∫₀¹ (x + y) dx dy
const bivariate = {
    numi: {
        terms: [
            createTerm(1, { x: 1 }),
            createTerm(1, { y: 1 })
        ]
    },
    deno: 1
};

console.log('Computing: ∫₀¹ ∫₀¹ (x + y) dx dy');

// Step 1: Integrate with respect to x
const step1 = definiteIntegrateFraction(bivariate, 0, 1, 'x');
console.log('After ∫₀¹ dx:', JSON.stringify(simplifyFraction(step1), null, 2));

// Step 2: Integrate with respect to y
const step2 = definiteIntegrateFraction(step1, 0, 1, 'y');
console.log('After ∫₀¹ dy:', JSON.stringify(simplifyFraction(step2), null, 2));

const finalValue = evaluateEquation([[step2]], {});
console.log('Final value:', finalValue);
console.log('Expected: 1');
console.log('\n');

// ============================================================================
// RECIPE 5: Expanding Products
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 5: Expanding Products');
console.log('═══════════════════════════════════════════\n');

// (x + 1)(x + 2)
const factor1 = {
    numi: {
        terms: [
            createTerm(1, { x: 1 }),
            createTerm(1)
        ]
    },
    deno: 1
};

const factor2 = {
    numi: {
        terms: [
            createTerm(1, { x: 1 }),
            createTerm(2)
        ]
    },
    deno: 1
};

const product = [factor1, factor2];
const expanded = expandProduct(product);
const simplified = simplifyFraction(expanded);

console.log('Expanding: (x + 1)(x + 2)');
console.log('Result:', JSON.stringify(simplified, null, 2));
console.log('Which is: x² + 3x + 2');
console.log('\n');

// ============================================================================
// RECIPE 6: Differentiation
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 6: Differentiation');
console.log('═══════════════════════════════════════════\n');

// d/dx(x³ - 2x² + x - 1)
const cubic = {
    numi: {
        terms: [
            createTerm(1, { x: 3 }),
            createTerm(-2, { x: 2 }),
            createTerm(1, { x: 1 }),
            createTerm(-1)
        ]
    },
    deno: 1
};

const derivative = differentiateFraction(cubic, 'x');

console.log('d/dx(x³ - 2x² + x - 1)');
console.log('Result:', JSON.stringify(derivative, null, 2));
console.log('Which is: 3x² - 4x + 1');
console.log('\n');

// ============================================================================
// RECIPE 7: Region Integration (Rectangle)
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 7: Region Integration');
console.log('═══════════════════════════════════════════\n');

// ∫₀² ∫₀³ xy dx dy  (Area of region [0,2] × [0,3])
const xyProduct = {
    numi: {
        terms: [
            createTerm(1, { x: 1, y: 1 })
        ]
    },
    deno: 1
};

console.log('Computing: ∫₀² ∫₀³ xy dx dy');

const reg1 = definiteIntegrateFraction(xyProduct, 0, 3, 'x');
console.log('After ∫₀³ dx:', JSON.stringify(reg1, null, 2));

const reg2 = definiteIntegrateFraction(reg1, 0, 2, 'y');
console.log('After ∫₀² dy:', JSON.stringify(reg2, null, 2));

const regionValue = evaluateEquation([[reg2]], {});
console.log('Final value:', regionValue);
console.log('Expected: 9');
console.log('\n');

// ============================================================================
// RECIPE 8: Working with Multivariable Polynomials
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 8: Multivariable Polynomials');
console.log('═══════════════════════════════════════════\n');

// 3x²y + 2xy² - x + y
const multivar = [[{
    numi: {
        terms: [
            createTerm(3, { x: 2, y: 1 }),
            createTerm(2, { x: 1, y: 2 }),
            createTerm(-1, { x: 1 }),
            createTerm(1, { y: 1 })
        ]
    },
    deno: 1
}]];

console.log('Expression: 3x²y + 2xy² - x + y');
console.log('At (x=1, y=1):', evaluateEquation(multivar, { x: 1, y: 1 }));
console.log('At (x=2, y=3):', evaluateEquation(multivar, { x: 2, y: 3 }));
console.log('\n');

// ============================================================================
// RECIPE 9: Common Integration Patterns
// ============================================================================

console.log('═══════════════════════════════════════════');
console.log('RECIPE 9: Common Patterns');
console.log('═══════════════════════════════════════════\n');

// Pattern 1: ∫x^n dx = x^(n+1)/(n+1)
console.log('Pattern: ∫₀¹ x^n dx');
for (let n of [1, 2, 3, 4]) {
    const term = { numi: { terms: [createTerm(1, { x: n })] }, deno: 1 };
    const int = definiteIntegrateFraction(term, 0, 1, 'x');
    const val = evaluateEquation([[int]], {});
    console.log(`  n=${n}: ${val} (expected: ${1 / (n + 1)})`);
}
console.log('\n');

// Pattern 2: Symmetric integrals
console.log('Pattern: Symmetric integrals ∫₋ₐᵃ f(x) dx');

// Odd function: ∫₋₁¹ x dx = 0
const oddFunc = { numi: { terms: [createTerm(1, { x: 1 })] }, deno: 1 };
const oddResult = definiteIntegrateFraction(oddFunc, -1, 1, 'x');
console.log('  Odd (x):', evaluateEquation([[oddResult]], {}), '(expected: 0)');

// Even function: ∫₋₁¹ x² dx = 2∫₀¹ x² dx
const evenFunc = { numi: { terms: [createTerm(1, { x: 2 })] }, deno: 1 };
const evenResult = definiteIntegrateFraction(evenFunc, -1, 1, 'x');
console.log('  Even (x²):', evaluateEquation([[evenResult]], {}), '(expected: 2/3)');
console.log('\n');

console.log('═══════════════════════════════════════════');
console.log('All recipes complete!');
console.log('═══════════════════════════════════════════');