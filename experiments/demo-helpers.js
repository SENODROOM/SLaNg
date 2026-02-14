/**
 * Demo: Using SLaNg Helpers
 */

import {
    polynomial,
    monomial,
    sum,
    integralOverRegion,
    integralValue,
    partialDerivative,
    expandAndSimplify,
    evaluateAt,
    formulas,
    volumeUnderSurface,
    areaOfRegion,
    verifyIntegration,
    numericalVerification
} from '../slang-helpers.js';

import { createFraction, createTerm } from '../slang-math.js';

console.log('╔════════════════════════════════════════════╗');
console.log('║    SLaNg Helpers Demo                      ║');
console.log('╚════════════════════════════════════════════╝\n');

// ============================================================================
// DEMO 1: Easy Polynomial Creation
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 1: Creating Polynomials');
console.log('─────────────────────────────────────────────\n');

// Old way (verbose):
const oldWay = [[{
    numi: {
        terms: [
            { coeff: 1, var: { x: 2 } },
            { coeff: -4, var: { x: 1 } },
            { coeff: 4 }
        ]
    },
    deno: 1
}]];

// New way (easy!):
const newWay = polynomial([1, -4, 4], 'x');  // x² - 4x + 4

console.log('Creating x² - 4x + 4:');
console.log('Old way: 15+ lines of JSON');
console.log('New way: polynomial([1, -4, 4], "x")');
console.log('');
console.log('Evaluating at x=2:', evaluateAt(newWay[0], { x: 2 }));
console.log('Evaluating at x=3:', evaluateAt(newWay[0], { x: 3 }));
console.log('\n');

// ============================================================================
// DEMO 2: Sum Builder
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 2: Building Sums Easily');
console.log('─────────────────────────────────────────────\n');

// Create 3x²y + 2xy² - x + y
const multivar = sum([
    [3, { x: 2, y: 1 }],
    [2, { x: 1, y: 2 }],
    [-1, { x: 1 }],
    [1, { y: 1 }]
]);

console.log('Expression: 3x²y + 2xy² - x + y');
console.log('At (1,1):', evaluateAt(multivar[0], { x: 1, y: 1 }));
console.log('At (2,3):', evaluateAt(multivar[0], { x: 2, y: 3 }));
console.log('\n');

// ============================================================================
// DEMO 3: Easy Integration
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 3: Region Integration Made Easy');
console.log('─────────────────────────────────────────────\n');

// Create xy
const xy = createFraction([createTerm(1, { x: 1, y: 1 })], 1);

// Compute ∫₀² ∫₀³ xy dx dy
const value = integralValue(xy, { x: [0, 3], y: [0, 2] });

console.log('Computing: ∫₀³ ∫₀² xy dy dx');
console.log('Single line: integralValue(xy, {x: [0,3], y: [0,2]})');
console.log('Result:', value, '(expected: 9)');
console.log('\n');

// ============================================================================
// DEMO 4: Volume Under Surface
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 4: Volume Under Surface z = x² + y²');
console.log('─────────────────────────────────────────────\n');

// Create z = x² + y²
const paraboloid = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

// Volume over [0,1] × [0,1]
const vol = volumeUnderSurface(paraboloid, [0, 1], [0, 1]);

console.log('Surface: z = x² + y²');
console.log('Region: [0,1] × [0,1]');
console.log('Volume:', vol);
console.log('Expected: ∫₀¹ ∫₀¹ (x² + y²) dx dy = 2/3');
console.log('\n');

// ============================================================================
// DEMO 5: Partial Derivatives
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 5: Partial Derivatives');
console.log('─────────────────────────────────────────────\n');

// f(x,y) = x³y² + 2xy - y
const f = createFraction([
    createTerm(1, { x: 3, y: 2 }),
    createTerm(2, { x: 1, y: 1 }),
    createTerm(-1, { y: 1 })
], 1);

console.log('f(x,y) = x³y² + 2xy - y');

const fx = partialDerivative(f, 'x');
console.log('∂f/∂x:', JSON.stringify(fx, null, 2));
console.log('Which is: 3x²y² + 2y');

const fy = partialDerivative(f, 'y');
console.log('∂f/∂y:', JSON.stringify(fy, null, 2));
console.log('Which is: 2x³y + 2x - 1');
console.log('\n');

// ============================================================================
// DEMO 6: Area Calculation
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 6: Area of Rectangle');
console.log('─────────────────────────────────────────────\n');

const rectArea = areaOfRegion([0, 5], [0, 3]);
console.log('Rectangle [0,5] × [0,3]');
console.log('Area:', rectArea, '(expected: 15)');
console.log('\n');

// ============================================================================
// DEMO 7: Verification
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 7: Verify Integration by Differentiation');
console.log('─────────────────────────────────────────────\n');

// Original: x²
const original = createFraction([createTerm(1, { x: 2 })], 1);

// Integrated: x³/3
const integrated = createFraction([createTerm(1 / 3, { x: 3 })], 1);

const isCorrect = verifyIntegration(original, integrated, 'x');
console.log('Original: x²');
console.log('Integrated: x³/3');
console.log('Verification (d/dx of integral = original):', isCorrect);
console.log('\n');

// ============================================================================
// DEMO 8: Formulas
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 8: Built-in Formulas');
console.log('─────────────────────────────────────────────\n');

// Average value of x² on [0, 2]
const xSquared = createFraction([createTerm(1, { x: 2 })], 1);
const avg = formulas.average(xSquared, 'x', 0, 2);
console.log('Average value of x² on [0,2]:', avg);
console.log('Expected: (1/(2-0)) ∫₀² x² dx = (1/2)(8/3) = 4/3 ≈', 4 / 3);
console.log('\n');

// Disk area
const diskAreaValue = formulas.diskArea(3);
console.log('Area of disk with radius 3:', diskAreaValue);
console.log('Expected: π(3²) =', Math.PI * 9);
console.log('\n');

// Center of mass (uniform density on [0, 2])
const uniformDensity = createFraction([createTerm(1)], 1);
const centerMass = formulas.centerOfMass1D(uniformDensity, 'x', 0, 2);
console.log('Center of mass of uniform rod [0,2]:', centerMass);
console.log('Expected: 1 (midpoint)');
console.log('\n');

// ============================================================================
// DEMO 9: Numerical Verification
// ============================================================================

console.log('─────────────────────────────────────────────');
console.log('DEMO 9: Numerical Verification');
console.log('─────────────────────────────────────────────\n');

// These should be equal: (x+1)² and x² + 2x + 1
const expanded1 = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(2, { x: 1 }),
    createTerm(1)
], 1);

const expanded2 = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(2, { x: 1 }),
    createTerm(1)
], 1);

const verification = numericalVerification(expanded1, expanded2, ['x'], 20);
console.log('Comparing x² + 2x + 1 with x² + 2x + 1');
console.log('Verification passed:', verification.passed);
console.log('Errors found:', verification.errors.length);
console.log('\n');

console.log('╔════════════════════════════════════════════╗');
console.log('║    Demo Complete!                          ║');
console.log('╚════════════════════════════════════════════╝');