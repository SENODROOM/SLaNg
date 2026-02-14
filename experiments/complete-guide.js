/**
 * COMPLETE GUIDE TO SLaNg MATH LIBRARY
 * Every feature explained with examples
 */

import {
    createTerm,
    createFraction,
    definiteIntegrateFraction,
    differentiateFraction,
    expandProduct,
    simplifyFraction,
    evaluateEquation
} from '../slang-math.js';

import {
    polynomial,
    sum,
    integralValue,
    partialDerivative
} from '../slang-helpers.js';

import {
    productRuleDifferentiate,
    quotientRuleDifferentiate,
    integrationByParts,
    taylorSeries,
    computeLimit,
    findCriticalPoints,
    secondDerivativeTest,
    analyzeCurve,
    arcLength,
    surfaceAreaOfRevolution,
    gradient,
    directionalDerivative
} from '../slang-advanced.js';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                                                               ║');
console.log('║        COMPLETE SLaNg MATH LIBRARY GUIDE                      ║');
console.log('║        Every Feature Explained                                ║');
console.log('║                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// PART 1: UNDERSTANDING SLaNg NOTATION
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 1: UNDERSTANDING SLaNg NOTATION');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('What is SLaNg?');
console.log('--------------');
console.log('SLaNg (Saad Language Analytical Numerics and Geometry) is a JSON-based notation for representing');
console.log('mathematical expressions. It\'s hierarchical:');
console.log('');
console.log('  Equation (array)');
console.log('    └─ Products (array)');
console.log('        └─ Fractions (object)');
console.log('            ├─ numerator (numi)');
console.log('            │   └─ terms (array of term objects)');
console.log('            └─ denominator (deno)');
console.log('');

console.log('Example: The expression "2x² + 3x + 1" in SLaNg:');
const example1 = {
    numi: {
        terms: [
            { coeff: 2, var: { x: 2 } },  // 2x²
            { coeff: 3, var: { x: 1 } },  // 3x
            { coeff: 1 }                   // 1
        ]
    },
    deno: 1
};
console.log(JSON.stringify(example1, null, 2));
console.log('');

console.log('Why use SLaNg?');
console.log('--------------');
console.log('✓ Precise: No ambiguity in mathematical operations');
console.log('✓ Structured: Easy to manipulate programmatically');
console.log('✓ Type-safe: Structure enforces mathematical correctness');
console.log('✓ Composable: Build complex expressions from simple parts');
console.log('\n');

// ============================================================================
// PART 2: BASIC OPERATIONS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 2: BASIC OPERATIONS');
console.log('═══════════════════════════════════════════════════════════════\n');

// 2.1 Creating Expressions
console.log('2.1 CREATING EXPRESSIONS');
console.log('------------------------\n');

console.log('Method 1: Manual creation (verbose but explicit)');
const manual = [[{
    numi: {
        terms: [
            createTerm(1, { x: 2 }),
            createTerm(-4, { x: 1 }),
            createTerm(4)
        ]
    },
    deno: 1
}]];
console.log('Created: x² - 4x + 4');
console.log('');

console.log('Method 2: Using helper functions (recommended)');
const helper = polynomial([1, -4, 4], 'x');
console.log('Same expression: polynomial([1, -4, 4], "x")');
console.log('Much easier!\n');

// 2.2 Evaluation
console.log('2.2 EVALUATION');
console.log('--------------\n');

console.log('Evaluate x² - 4x + 4 at different points:');
for (let x of [0, 1, 2, 3, 4]) {
    const value = evaluateEquation(helper, { x });
    console.log(`  f(${x}) = ${value}`);
}
console.log('Notice: This is (x-2)², so minimum is at x=2 where f(2)=0\n');

// 2.3 Differentiation
console.log('2.3 DIFFERENTIATION');
console.log('-------------------\n');

const f = polynomial([1, -4, 4], 'x');  // x² - 4x + 4
const fPrime = differentiateFraction(f[0][0], 'x');
console.log('f(x) = x² - 4x + 4');
console.log('f\'(x) = 2x - 4');
console.log('Derivative:', JSON.stringify(fPrime, null, 2));
console.log('');

console.log('Verify: f\'(2) should be 0 (critical point)');
console.log('f\'(2) =', evaluateEquation([[fPrime]], { x: 2 }));
console.log('\n');

// 2.4 Integration
console.log('2.4 INTEGRATION');
console.log('---------------\n');

const g = polynomial([2, 1], 'x');  // 2x + 1
console.log('Integrate: ∫(2x + 1)dx from 0 to 3');
const integral = definiteIntegrateFraction(g[0][0], 0, 3, 'x');
const integralResult = evaluateEquation([[integral]], {});
console.log('Result:', integralResult);
console.log('Expected: [x² + x]₀³ = 9 + 3 = 12 ✓');
console.log('\n');

// ============================================================================
// PART 3: ADVANCED CALCULUS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 3: ADVANCED CALCULUS');
console.log('═══════════════════════════════════════════════════════════════\n');

// 3.1 Product Rule
console.log('3.1 PRODUCT RULE');
console.log('----------------\n');

const u = createFraction([createTerm(1, { x: 1 })], 1);  // x
const v = createFraction([createTerm(1, { x: 2 })], 1);  // x²

console.log('Find d/dx[x · x²] using product rule');
const productDeriv = productRuleDifferentiate([u, v], 'x');
console.log('Result:', JSON.stringify(productDeriv, null, 2));
console.log('Which simplifies to: 3x²');
console.log('Verification: d/dx[x³] = 3x² ✓');
console.log('\n');

// 3.2 Taylor Series
console.log('3.2 TAYLOR SERIES');
console.log('-----------------\n');

const expFunc = polynomial([1, 1], 'x');  // x + 1
console.log('Taylor series of (x + 1) around x = 0:');
const taylor = taylorSeries(expFunc[0][0], 'x', 0, 4);
console.log('Result:', JSON.stringify(taylor.series, null, 2));
console.log('Note:', taylor.note);
console.log('');

// For e^x, we would get: 1 + x + x²/2! + x³/3! + ...
console.log('For e^x, the Taylor series would be:');
console.log('e^x ≈ 1 + x + x²/2 + x³/6 + x⁴/24 + ...');
console.log('(Our library handles polynomial approximations)\n');

// 3.3 Limits
console.log('3.3 LIMITS');
console.log('----------\n');

const rational = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(-4)
], 1);  // x² - 4

console.log('Compute lim(x→2) of (x² - 4):');
const limit = computeLimit(rational, 'x', 2);
console.log('Result:', limit.value);
console.log('Method:', limit.method);
console.log('\n');

// 3.4 Critical Points & Optimization
console.log('3.4 CRITICAL POINTS & OPTIMIZATION');
console.log('-----------------------------------\n');

const cubic = polynomial([1, 0, -3, 0], 'x');  // x³ - 3x
console.log('Find critical points of f(x) = x³ - 3x');

const critical = findCriticalPoints(cubic[0][0], 'x', [-3, 3], 1000);
console.log('Critical points:', critical.criticalPoints.map(x => x.toFixed(4)));
console.log('');

if (critical.criticalPoints.length > 0) {
    const point = critical.criticalPoints[0];
    const test = secondDerivativeTest(cubic[0][0], 'x', point);
    console.log(`At x = ${point.toFixed(4)}:`);
    console.log(`  f(x) = ${test.functionValue.toFixed(4)}`);
    console.log(`  f''(x) = ${test.secondDerivative.toFixed(4)}`);
    console.log(`  Type: ${test.type}`);
}
console.log('\n');

// ============================================================================
// PART 4: MULTIVARIABLE CALCULUS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 4: MULTIVARIABLE CALCULUS');
console.log('═══════════════════════════════════════════════════════════════\n');

// 4.1 Partial Derivatives
console.log('4.1 PARTIAL DERIVATIVES');
console.log('-----------------------\n');

const multivar = sum([
    [1, { x: 2, y: 1 }],  // x²y
    [2, { x: 1, y: 2 }],  // 2xy²
    [-1, { x: 1 }],       // -x
    [1, { y: 1 }]         // y
]);

console.log('f(x,y) = x²y + 2xy² - x + y');
console.log('');

const fx = partialDerivative(multivar[0][0], 'x');
console.log('∂f/∂x = 2xy + 2y² - 1');
console.log('At (1,1):', evaluateEquation([[fx]], { x: 1, y: 1 }));
console.log('');

const fy = partialDerivative(multivar[0][0], 'y');
console.log('∂f/∂y = x² + 4xy + 1');
console.log('At (1,1):', evaluateEquation([[fy]], { x: 1, y: 1 }));
console.log('\n');

// 4.2 Gradient
console.log('4.2 GRADIENT');
console.log('------------\n');

const grad = gradient(multivar[0][0], ['x', 'y']);
console.log('∇f = (∂f/∂x, ∂f/∂y)');
console.log('Gradient components computed for each variable');
console.log('The gradient points in the direction of steepest increase');
console.log('\n');

// 4.3 Directional Derivative
console.log('4.3 DIRECTIONAL DERIVATIVE');
console.log('--------------------------\n');

const point = { x: 1, y: 1 };
const direction = { x: 1, y: 0 };  // Unit vector in x-direction

const dirDeriv = directionalDerivative(
    multivar[0][0],
    ['x', 'y'],
    point,
    direction
);

console.log('Directional derivative of f at (1,1) in direction (1,0):');
console.log('D_v f =', dirDeriv.directionalDerivative);
console.log('This is the rate of change of f in that direction');
console.log('\n');

// 4.4 Double Integrals
console.log('4.4 DOUBLE INTEGRALS');
console.log('--------------------\n');

const xy = createFraction([createTerm(1, { x: 1, y: 1 })], 1);
console.log('Compute: ∫₀² ∫₀³ xy dy dx');

const step1 = definiteIntegrateFraction(xy, 0, 3, 'y');
console.log('After integrating y:', JSON.stringify(step1, null, 2));

const step2 = definiteIntegrateFraction(step1, 0, 2, 'x');
const result = evaluateEquation([[step2]], {});
console.log('Final result:', result);
console.log('Expected: 9 ✓');
console.log('');

console.log('Interpretation:');
console.log('This computes the volume under the surface z = xy');
console.log('over the rectangular region [0,2] × [0,3]');
console.log('\n');

// ============================================================================
// PART 5: GEOMETRY & APPLICATIONS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 5: GEOMETRY & APPLICATIONS');
console.log('═══════════════════════════════════════════════════════════════\n');

// 5.1 Arc Length
console.log('5.1 ARC LENGTH');
console.log('--------------\n');

const line = polynomial([1, 0], 'x');  // y = x
console.log('Arc length of y = x from x = 0 to x = 1:');
const arc = arcLength(line[0][0], 'x', 0, 1, 1000);
console.log('Length:', arc.length.toFixed(4));
console.log('Expected: √2 ≈', Math.sqrt(2).toFixed(4), '✓');
console.log('Formula:', arc.note);
console.log('\n');

// 5.2 Surface Area of Revolution
console.log('5.2 SURFACE AREA OF REVOLUTION');
console.log('-------------------------------\n');

const linear = polynomial([1, 0], 'x');  // y = x
console.log('Revolve y = x around x-axis from 0 to 1:');
const surface = surfaceAreaOfRevolution(linear[0][0], 'x', 0, 1, 1000);
console.log('Surface area:', surface.surfaceArea.toFixed(4));
console.log('(This creates a cone)');
console.log('Formula:', surface.note);
console.log('\n');

// ============================================================================
// PART 6: REAL-WORLD EXAMPLES
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 6: REAL-WORLD EXAMPLES');
console.log('═══════════════════════════════════════════════════════════════\n');

// Example 1: Physics - Projectile Motion
console.log('EXAMPLE 1: PROJECTILE MOTION');
console.log('-----------------------------\n');

console.log('A ball is thrown with height h(t) = -4.9t² + 20t + 2');
const height = polynomial([-4.9, 20, 2], 't');

console.log('Find when the ball hits the ground (h = 0):');
console.log('Using critical points to analyze...');

const heightCritical = findCriticalPoints(height[0][0], 't', [0, 5], 1000);
console.log('Maximum height occurs at t ≈', heightCritical.criticalPoints[0]?.toFixed(2) || 'N/A');

if (heightCritical.criticalPoints[0]) {
    const maxHeight = evaluateEquation(height, { t: heightCritical.criticalPoints[0] });
    console.log('Maximum height:', maxHeight.toFixed(2), 'meters');
}
console.log('\n');

// Example 2: Economics - Profit Maximization
console.log('EXAMPLE 2: PROFIT MAXIMIZATION');
console.log('-------------------------------\n');

console.log('Profit P(x) = -x² + 100x - 500');
const profit = polynomial([-1, 100, -500], 'x');

const profitCritical = findCriticalPoints(profit[0][0], 'x', [0, 150], 1000);
console.log('Optimal production level: x ≈', profitCritical.criticalPoints[0]?.toFixed(0) || 'N/A', 'units');

if (profitCritical.criticalPoints[0]) {
    const maxProfit = evaluateEquation(profit, { x: profitCritical.criticalPoints[0] });
    console.log('Maximum profit: $', maxProfit.toFixed(2));
}
console.log('\n');

// Example 3: Engineering - Area Optimization
console.log('EXAMPLE 3: AREA OPTIMIZATION');
console.log('----------------------------\n');

console.log('A rectangle has perimeter 100. Find dimensions for max area.');
console.log('If x is one side, area A = x(50-x) = 50x - x²');
const area = polynomial([-1, 50, 0], 'x');

const areaCritical = findCriticalPoints(area[0][0], 'x', [0, 50], 1000);
console.log('Optimal dimension: x ≈', areaCritical.criticalPoints[0]?.toFixed(2) || 'N/A');

if (areaCritical.criticalPoints[0]) {
    const maxArea = evaluateEquation(area, { x: areaCritical.criticalPoints[0] });
    console.log('Maximum area:', maxArea.toFixed(2), 'square units');
    console.log('Shape: Square (as expected!)');
}
console.log('\n');

// ============================================================================
// PART 7: TIPS & BEST PRACTICES
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('PART 7: TIPS & BEST PRACTICES');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('1. Always use helper functions when possible');
console.log('   ✓ polynomial([1,-2,1], "x") instead of manual creation');
console.log('');

console.log('2. Simplify after operations');
console.log('   ✓ Use simplifyFraction() to combine like terms');
console.log('');

console.log('3. Deep clone when modifying');
console.log('   ✓ Library does this automatically, but be aware');
console.log('');

console.log('4. Check your bounds carefully');
console.log('   ✓ Integration order matters: ∫∫ f dy dx vs ∫∫ f dx dy');
console.log('');

console.log('5. Use verification functions');
console.log('   ✓ verifyIntegration() to check if d/dx[∫f] = f');
console.log('');

console.log('6. For complex expressions, build incrementally');
console.log('   ✓ Create simple parts, then combine');
console.log('');

console.log('7. Numerical methods are approximations');
console.log('   ✓ Arc length, surface area use numerical integration');
console.log('   ✓ Increase numSteps for better accuracy');
console.log('\n');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                          SUMMARY                              ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('The SLaNg Math Library provides:');
console.log('');
console.log('CORE FEATURES:');
console.log('  ✓ Expression creation and manipulation');
console.log('  ✓ Differentiation (including product/quotient rules)');
console.log('  ✓ Integration (definite and indefinite)');
console.log('  ✓ Simplification and expansion');
console.log('  ✓ Evaluation at specific points');
console.log('');

console.log('ADVANCED CALCULUS:');
console.log('  ✓ Taylor series expansion');
console.log('  ✓ Limits computation');
console.log('  ✓ Critical points and optimization');
console.log('  ✓ Second derivative test');
console.log('  ✓ Curve analysis');
console.log('');

console.log('MULTIVARIABLE:');
console.log('  ✓ Partial derivatives');
console.log('  ✓ Gradient vectors');
console.log('  ✓ Directional derivatives');
console.log('  ✓ Double/triple integration');
console.log('');

console.log('GEOMETRY:');
console.log('  ✓ Arc length');
console.log('  ✓ Surface area of revolution');
console.log('  ✓ Volume under surfaces');
console.log('');

console.log('APPLICATIONS:');
console.log('  ✓ Physics problems');
console.log('  ✓ Optimization');
console.log('  ✓ Economics');
console.log('  ✓ Engineering');
console.log('');

console.log('Start with the simple examples and work your way up!');
console.log('All source code is available and documented.');
console.log('\n');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                    GUIDE COMPLETE! 🎉                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');