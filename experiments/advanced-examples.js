/**
 * Advanced Examples - SLaNg Math Library 
 * Complex problems now solvable with polynomial denominator support
 */

import {
    createTerm,
    createFraction,
    evaluateFraction,
    differentiateFraction,
    numericalIntegrateFraction,
    simplifyFraction,
    fractionToString
} from './slang-basic-.js';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   SLaNg Math Library  - Advanced Examples                ║');
console.log('║   Complex Calculus Problems Made Easy                        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// EXAMPLE 1: OPTIMIZATION - MINIMIZE AVERAGE COST
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 1: Economics - Minimize Average Cost');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: A factory has total cost C(x) = x² + 100x + 1000');
console.log('Find the production level that minimizes average cost AC(x) = C(x)/x\n');

// Average Cost: AC(x) = (x² + 100x + 1000)/x
const AC = createFraction(
    [createTerm(1, {x: 2}), createTerm(100, {x: 1}), createTerm(1000)],
    [createTerm(1, {x: 1})]
);

console.log('AC(x) =', fractionToString(AC));
console.log();

// Find derivative
const AC_prime = differentiateFraction(AC, 'x');
console.log('AC\'(x) =', fractionToString(AC_prime));
console.log();

// Evaluate at several points to find minimum
console.log('Testing production levels:');
const production_levels = [10, 20, 30, 40, 50];
let minCost = Infinity;
let optimalX = 0;

for (let x of production_levels) {
    const cost = evaluateFraction(AC, {x});
    const derivative = evaluateFraction(AC_prime, {x});
    console.log(`  x=${x}: AC=${cost.toFixed(2)}, AC'=${derivative.toFixed(4)}`);
    
    if (cost < minCost) {
        minCost = cost;
        optimalX = x;
    }
}

console.log(`\n✓ Minimum average cost: $${minCost.toFixed(2)} at x=${optimalX} units\n`);

// ============================================================================
// EXAMPLE 2: PHYSICS - ELECTRIC FIELD
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 2: Physics - Electric Field of Point Charge');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Electric potential V = kQ/r');
console.log('Find electric field E = -dV/dr\n');

// V(r) = kQ/r = kQ/r¹
const k = 9e9;  // Coulomb constant
const Q = 1e-6; // 1 microcoulomb
const kQ = k * Q;

const V = createFraction(
    [createTerm(kQ)],
    [createTerm(1, {r: 1})]
);

console.log('V(r) =', fractionToString(V));
console.log();

const dV_dr = differentiateFraction(V, 'r');
console.log('dV/dr =', fractionToString(dV_dr));
console.log();

// Electric field E = -dV/dr
console.log('Electric field E = -dV/dr');
const distances = [0.1, 0.5, 1.0, 2.0];
console.log('E at various distances:');
for (let r of distances) {
    const dV = evaluateFraction(dV_dr, {r});
    const E = -dV;
    console.log(`  r=${r.toFixed(1)}m: E=${E.toExponential(2)} N/C`);
}
console.log();

// ============================================================================
// EXAMPLE 3: CHEMISTRY - ENZYME KINETICS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 3: Chemistry - Michaelis-Menten Enzyme Kinetics');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Reaction rate v = (Vmax·[S])/(Km + [S])');
console.log('Find how rate changes with substrate concentration\n');

const Vmax = 100;  // Maximum rate
const Km = 0.5;    // Michaelis constant

// v([S]) = (Vmax·[S])/(Km + [S])
const v = createFraction(
    [createTerm(Vmax, {S: 1})],
    [createTerm(Km), createTerm(1, {S: 1})]
);

console.log('v([S]) =', fractionToString(v));
console.log();

// Find dv/d[S]
const dv_dS = differentiateFraction(v, 'S');
console.log('dv/d[S] =', fractionToString(dv_dS));
console.log();

// Evaluate at different substrate concentrations
const concentrations = [0.1, 0.5, 1.0, 2.0, 5.0];
console.log('Reaction rate and sensitivity:');
for (let S of concentrations) {
    const rate = evaluateFraction(v, {S});
    const sensitivity = evaluateFraction(dv_dS, {S});
    console.log(`  [S]=${S.toFixed(1)}: v=${rate.toFixed(2)}, dv/d[S]=${sensitivity.toFixed(2)}`);
}
console.log();

// ============================================================================
// EXAMPLE 4: CALCULUS - ARC LENGTH OF HYPERBOLA
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 4: Calculus - Arc Length of Hyperbola');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Find arc length of y = 1/x from x=1 to x=2');
console.log('Formula: L = ∫ √(1 + (dy/dx)²) dx\n');

// y = 1/x
const y = createFraction(
    [createTerm(1)],
    [createTerm(1, {x: 1})]
);

console.log('y =', fractionToString(y));

// dy/dx = -1/x²
const dy_dx = differentiateFraction(y, 'x');
console.log('dy/dx =', fractionToString(dy_dx));
console.log();

// Arc length integrand: √(1 + (dy/dx)²)
// We'll compute this numerically
console.log('Computing arc length numerically...');

const a = 1, b = 2;
const numSteps = 10000;
let arcLength = 0;
const h = (b - a) / numSteps;

for (let i = 0; i < numSteps; i++) {
    const x = a + i * h;
    const dydx = evaluateFraction(dy_dx, {x});
    const integrand = Math.sqrt(1 + dydx * dydx);
    arcLength += integrand * h;
}

console.log(`Arc length from x=1 to x=2: ${arcLength.toFixed(6)}`);
console.log();

// ============================================================================
// EXAMPLE 5: MULTIVARIABLE - GRADIENT OF RATIONAL FUNCTION
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 5: Multivariable - Gradient of Temperature Field');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Temperature T(x,y) = 100xy/(x² + y²)');
console.log('Find gradient ∇T = (∂T/∂x, ∂T/∂y)\n');

// T(x,y) = 100xy/(x² + y²)
const T = createFraction(
    [createTerm(100, {x: 1, y: 1})],
    [createTerm(1, {x: 2}), createTerm(1, {y: 2})]
);

console.log('T(x,y) =', fractionToString(T));
console.log();

// ∂T/∂x
const dT_dx = differentiateFraction(T, 'x');
console.log('∂T/∂x =', fractionToString(dT_dx));
console.log();

// ∂T/∂y
const dT_dy = differentiateFraction(T, 'y');
console.log('∂T/∂y =', fractionToString(dT_dy));
console.log();

// Evaluate gradient at point (1, 1)
const point = {x: 1, y: 1};
const grad_x = evaluateFraction(dT_dx, point);
const grad_y = evaluateFraction(dT_dy, point);

console.log(`∇T(1,1) = (${grad_x.toFixed(2)}, ${grad_y.toFixed(2)})`);
console.log(`Magnitude: ${Math.sqrt(grad_x*grad_x + grad_y*grad_y).toFixed(2)}`);
console.log();

// ============================================================================
// EXAMPLE 6: INTEGRATION - WORK DONE BY VARIABLE FORCE
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 6: Physics - Work Done by Variable Force');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Force F(x) = 10/(x + 1)² Newtons');
console.log('Find work done moving object from x=0 to x=3 meters');
console.log('W = ∫ F(x) dx\n');

// F(x) = 10/(x + 1)²
const F = createFraction(
    [createTerm(10)],
    [createTerm(1, {x: 2}), createTerm(2, {x: 1}), createTerm(1)]
);

console.log('F(x) =', fractionToString(F));
console.log();

// Compute work using numerical integration
console.log('Computing work done...');
const work = numericalIntegrateFraction(F, 0, 3, 'x', 10000);
const workValue = evaluateFraction(work, {});

console.log(`Work done: ${workValue.toFixed(4)} Joules\n`);

// ============================================================================
// EXAMPLE 7: CALCULUS - INFLECTION POINTS
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 7: Calculus - Find Inflection Points');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: f(x) = x/(x² + 1)');
console.log('Find inflection points (where f\'\'(x) = 0)\n');

// f(x) = x/(x² + 1)
const f = createFraction(
    [createTerm(1, {x: 1})],
    [createTerm(1, {x: 2}), createTerm(1)]
);

console.log('f(x) =', fractionToString(f));

// First derivative
const f_prime = differentiateFraction(f, 'x');
console.log('f\'(x) =', fractionToString(f_prime));

// Second derivative
const f_double_prime = differentiateFraction(f_prime, 'x');
console.log('f\'\'(x) =', fractionToString(f_double_prime));
console.log();

// Test for sign changes in f''
console.log('Testing for inflection points:');
const test_x = [-2, -1, 0, 1, 2];
for (let x of test_x) {
    const f_val = evaluateFraction(f, {x});
    const f_p = evaluateFraction(f_prime, {x});
    const f_pp = evaluateFraction(f_double_prime, {x});
    console.log(`  x=${x.toString().padStart(2)}: f=${f_val.toFixed(4)}, f'=${f_p.toFixed(4)}, f''=${f_pp.toFixed(4)}`);
}
console.log();

// ============================================================================
// EXAMPLE 8: PROBABILITY - EXPECTED VALUE
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 8: Probability - Expected Value');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: PDF p(x) = 2x/(x² + 1) on [0, 1]');
console.log('Find E[X] = ∫ x·p(x) dx\n');

// p(x) = 2x/(x² + 1)
const pdf = createFraction(
    [createTerm(2, {x: 1})],
    [createTerm(1, {x: 2}), createTerm(1)]
);

console.log('p(x) =', fractionToString(pdf));

// x·p(x) = 2x²/(x² + 1)
const x_pdf = createFraction(
    [createTerm(2, {x: 2})],
    [createTerm(1, {x: 2}), createTerm(1)]
);

console.log('x·p(x) =', fractionToString(x_pdf));
console.log();

// Compute E[X]
console.log('Computing E[X]...');
const expected_value = numericalIntegrateFraction(x_pdf, 0, 1, 'x', 10000);
const EX = evaluateFraction(expected_value, {});

console.log(`E[X] = ${EX.toFixed(6)}\n`);

// ============================================================================
// EXAMPLE 9: SIGNAL PROCESSING - FREQUENCY RESPONSE
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 9: Engineering - Frequency Response');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Transfer function H(ω) = 1/(ω² + 2ω + 1)');
console.log('Analyze system response at different frequencies\n');

// H(ω) = 1/(ω² + 2ω + 1) = 1/(ω + 1)²
const H = createFraction(
    [createTerm(1)],
    [createTerm(1, {w: 2}), createTerm(2, {w: 1}), createTerm(1)]
);

console.log('H(ω) =', fractionToString(H));

// Find dH/dω
const dH_dw = differentiateFraction(H, 'w');
console.log('dH/dω =', fractionToString(dH_dw));
console.log();

// Evaluate at different frequencies
const frequencies = [0, 0.5, 1, 2, 5];
console.log('Frequency response:');
for (let w of frequencies) {
    const response = evaluateFraction(H, {w});
    const sensitivity = evaluateFraction(dH_dw, {w});
    console.log(`  ω=${w}: |H|=${response.toFixed(4)}, dH/dω=${sensitivity.toFixed(4)}`);
}
console.log();

// ============================================================================
// EXAMPLE 10: RELATIVITY - LORENTZ FACTOR
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 10: Physics - Special Relativity');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Problem: Lorentz factor γ = 1/√(1 - v²/c²)');
console.log('Approximate for small v using Taylor-like expansion\n');

const c = 3e8; // speed of light
const c2 = c * c;

// For small v, γ ≈ 1 + v²/(2c²)
// Let's verify by computing dγ/dv at v=0

// γ(v) ≈ 1/(1 - v²/c²) for small v
const gamma = createFraction(
    [createTerm(1)],
    [createTerm(1), createTerm(-1/c2, {v: 2})]
);

console.log('γ(v) ≈', fractionToString(gamma));

const dgamma_dv = differentiateFraction(gamma, 'v');
console.log('dγ/dv =', fractionToString(dgamma_dv));
console.log();

// Evaluate at low velocities
const velocities = [0, 0.1*c, 0.3*c, 0.5*c, 0.9*c];
console.log('Lorentz factor at different speeds:');
for (let v of velocities) {
    const g = evaluateFraction(gamma, {v});
    const ratio = v/c;
    console.log(`  v=${ratio.toFixed(1)}c: γ=${g.toFixed(4)}`);
}
console.log();

// ============================================================================
// SUMMARY
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('SUMMARY: What We Accomplished with ');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('✓ Economics: Optimized average cost function');
console.log('✓ Physics: Computed electric field from potential');
console.log('✓ Chemistry: Analyzed enzyme kinetics');
console.log('✓ Calculus: Found arc length of curve');
console.log('✓ Multivariable: Computed gradient of temperature field');
console.log('✓ Physics: Calculated work done by variable force');
console.log('✓ Calculus: Located inflection points');
console.log('✓ Probability: Determined expected value');
console.log('✓ Engineering: Analyzed frequency response');
console.log('✓ Relativity: Approximated Lorentz factor');
console.log();

console.log('All of these required RATIONAL FUNCTIONS with polynomial denominators!');
console.log('None of this was possible in  -  makes it all seamless! 🚀\n');

console.log('═══════════════════════════════════════════════════════════════\n');
