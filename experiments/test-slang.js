import {
    deepClone,
    createTerm,
    createFraction,
    evaluateEquation,
    definiteIntegrateFraction,
    expandProduct,
    simplifyFraction,
    equationToString
} from '../slang-math.js';

// ============================================================================
// EXAMPLE EQUATIONS
// ============================================================================
///////////////// chuchu loves to multiply when he sees curly brackitooo and add when he sees arraysss
// Example 1: (1 + x^2)(1 - y^2)
const example1 = [
    [
        // First factor: (1 + x^2)
        {
            numi: {
                terms: [
                    { coeff: 1 },
                    { coeff: 1, var: { x: 2 } }
                ]
            },
            deno: 1
        },
        // Second factor: (1 - y^2)
        {
            numi: {
                terms: [
                    { coeff: 1 },
                    { coeff: -1, var: { y: 2 } }
                ]
            },
            deno: 1
        }
    ]
];

// Example 2: xy (simple product)
const example2 = [
    [
        {
            numi: {
                terms: [
                    { coeff: 1, var: { x: 1, y: 1 } }
                ]
            },
            deno: 1
        }
    ]
];

// Example 3: x^2 + y^2
const example3 = [
    [
        {
            numi: {
                terms: [
                    { coeff: 1, var: { x: 2 } },
                    { coeff: 1, var: { y: 2 } }
                ]
            },
            deno: 1
        }
    ]
];

// Example 4: For double integration ∫∫(x + y) dy dx
const example4 = [
    [
        {
            numi: {
                terms: [
                    { coeff: 1, var: { x: 1 } },
                    { coeff: 1, var: { y: 1 } }
                ]
            },
            deno: 1
        }
    ]
];

// ============================================================================
// TESTS
// ============================================================================

console.log('========================================');
console.log('SLaNg Math Library Tests');
console.log('========================================\n');

// Test 1: Expand (1 + x^2)(1 - y^2)
console.log('Test 1: Expand (1 + x^2)(1 - y^2)');
console.log('Original:', JSON.stringify(example1[0], null, 2));
const expanded1 = expandProduct(example1[0]);
console.log('Expanded:', JSON.stringify(expanded1, null, 2));
console.log('');

// Test 2: Evaluate xy at x=2, y=3
console.log('Test 2: Evaluate xy at x=2, y=3');
const result2 = evaluateEquation(example2, { x: 2, y: 3 });
console.log('Result:', result2, '(expected: 6)');
console.log('');

// Test 3: Double integration ∫₀² ∫₁⁴ xy dy dx
console.log('Test 3: Double integration ∫₀² ∫₁⁴ xy dy dx');
console.log('Original:', JSON.stringify(example2[0][0], null, 2));

// First integrate with respect to y from 1 to 4
const step1 = definiteIntegrateFraction(example2[0][0], 1, 4, 'y');
console.log('After ∫₁⁴ dy:', JSON.stringify(step1, null, 2));

// Then integrate with respect to x from 0 to 2
const step2 = definiteIntegrateFraction(step1, 0, 2, 'x');
console.log('After ∫₀² dx:', JSON.stringify(step2, null, 2));
console.log('Final value:', evaluateEquation([[step2]], {}));
console.log('Expected: ∫₀² ∫₁⁴ xy dy dx = ∫₀² [xy²/2]₁⁴ dx = ∫₀² (16x/2 - x/2) dx = ∫₀² 7.5x dx = [3.75x²]₀² = 15');
console.log('');

// Test 4: Integration of x^2 + y^2 with respect to x
console.log('Test 4: Definite integral ∫₀¹ (x² + y²) dx');
const step4 = definiteIntegrateFraction(example3[0][0], 0, 1, 'x');
console.log('Result:', JSON.stringify(step4, null, 2));
console.log('Simplified:', JSON.stringify(simplifyFraction(step4), null, 2));
console.log('Expected: [x³/3 + xy²]₀¹ = 1/3 + y²');
console.log('');

// Test 5: Double integration ∫₋₁¹ ∫₀² (x + y) dx dy
console.log('Test 5: Double integration ∫₋₁¹ ∫₀² (x + y) dx dy');
console.log('Original equation: x + y');

// Integrate with respect to x from 0 to 2
const step5a = definiteIntegrateFraction(example4[0][0], 0, 2, 'x');
console.log('After ∫₀² dx:', JSON.stringify(step5a, null, 2));
console.log('Simplified:', JSON.stringify(simplifyFraction(step5a), null, 2));

// Integrate with respect to y from -1 to 1
const step5b = definiteIntegrateFraction(step5a, -1, 1, 'y');
console.log('After ∫₋₁¹ dy:', JSON.stringify(step5b, null, 2));
console.log('Simplified:', JSON.stringify(simplifyFraction(step5b), null, 2));
console.log('Final value:', evaluateEquation([[step5b]], {}));
console.log('Expected: ∫₋₁¹ ∫₀² (x+y) dx dy = ∫₋₁¹ [x²/2 + xy]₀² dy = ∫₋₁¹ (2 + 2y) dy = [2y + y²]₋₁¹ = (2 + 1) - (-2 + 1) = 4');
console.log('');

console.log('========================================');
console.log('All tests complete!');
console.log('========================================');
export { example1, example2, example3, example4 };