/**
 * test.js — Test suite for slang-basic.js
 * Run with: node --input-type=module < test.js
 */

import {
    deepClone, createTerm, createFraction,
    evaluateTerm, evaluateFraction, evaluateProduct, evaluateEquation,
    integrateTerm, integrateFraction, definiteIntegrateTerm, definiteIntegrateFraction,
    differentiateTerm, differentiateFraction,
    simplifyFraction, simplifyProduct, simplifyEquation,
    multiplyTerms, expandFractions, expandProduct,
    termToString, fractionToString, productToString, equationToString
} from '../slang-basic.js';

// ─── tiny test helpers ───────────────────────────────────────────────────────
let passed = 0, failed = 0;

function assert(actual, expected, note = '') {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) { passed++; }
    else {
        failed++;
        console.log(`  ❌ FAIL — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}  ${note}`);
    }
}

function assertClose(actual, expected, note = '', tol = 1e-9) {
    const ok = Math.abs(actual - expected) <= tol;
    if (ok) { passed++; }
    else {
        failed++;
        console.log(`  ❌ FAIL — expected ≈${expected}, got ${actual}  ${note}`);
    }
}

function assertThrows(fn, note = '') {
    try { fn(); failed++; console.log(`  ❌ FAIL — expected an error but none thrown  ${note}`); }
    catch { passed++; }
}

function show(label, value) {
    console.log(`     ${label}: ${JSON.stringify(value)}`);
}

// ─────────────────────────────────────────────────────────────────────────────


// ════════════════════════════════════════════════════════════════════════════
//  1. deepClone
//  Everything in SLaNg is a plain JS object. deepClone() makes a completely
//  independent copy so that mutating a cloned value never corrupts the original.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 1. deepClone ━━━');
console.log('  deepClone() uses JSON.parse(JSON.stringify()) to make a full copy.');
console.log('  After cloning, changes to the copy must NOT affect the original.\n');

{
    const original = { coeff: 5, var: { x: 2 } };  // represents  5x²
    console.log('  original =', JSON.stringify(original));

    const clone = deepClone(original);
    console.log('  clone    =', JSON.stringify(clone), '← looks the same');

    clone.coeff = 99;          // mutate the clone
    clone.var.x = 7;
    console.log('  after mutating clone → original should still be { coeff:5, var:{x:2} }');
    show('original.coeff', original.coeff);
    assert(original.coeff, 5);
    assert(original.var.x, 2);

    // Also works on nested structures like fractions
    const nested = { numi: { terms: [{ coeff: 3 }] }, deno: 2 };
    const cn = deepClone(nested);
    cn.numi.terms[0].coeff = 0;
    assert(nested.numi.terms[0].coeff, 3);
    console.log('  nested original also unaffected ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  2. createTerm
//  A "term" is the atomic unit: a coefficient times zero or more variables
//  raised to powers.  e.g.  3x²y  →  { coeff: 3, var: { x: 2, y: 1 } }
//  If there are no variables the `var` key is omitted entirely.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 2. createTerm ━━━');
console.log('  createTerm(coeff, vars) builds { coeff, var? }');
console.log('  Passing no vars (or {}) gives a pure constant — no var key.\n');

{
    const c = createTerm(7);
    show('createTerm(7)', c);
    assert(c, { coeff: 7 });                              // constant — no var

    const t1 = createTerm(3, { x: 2 });
    show('createTerm(3, {x:2})  →  3x²', t1);
    assert(t1, { coeff: 3, var: { x: 2 } });

    const t2 = createTerm(-2, { x: 1, y: 3 });
    show('createTerm(-2, {x:1,y:3})  →  -2xy³', t2);
    assert(t2, { coeff: -2, var: { x: 1, y: 3 } });

    const t3 = createTerm(4, {});
    show('createTerm(4, {})  →  empty vars → no var key', t3);
    assert(t3, { coeff: 4 });
}


// ════════════════════════════════════════════════════════════════════════════
//  3. createFraction
//  A "fraction" holds a numerator (an array of terms) and a denominator number.
//  { numi: { terms: [...] }, deno: number }
//  The terms are deep-cloned on creation so later mutations can't corrupt it.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 3. createFraction ━━━');
console.log('  createFraction(terms, deno=1) builds { numi: { terms }, deno }');
console.log('  The denominator defaults to 1 (just a plain polynomial).\n');

{
    const terms = [createTerm(2, { x: 1 }), createTerm(5)];  // 2x + 5
    const frac = createFraction(terms);
    show('createFraction([2x, 5])  →  (2x + 5)/1', frac);
    assert(frac.deno, 1);
    assert(frac.numi.terms[0], { coeff: 2, var: { x: 1 } });

    const frac2 = createFraction([createTerm(1, { x: 1 }), createTerm(3)], 4);
    show('createFraction([x, 3], 4)  →  (x+3)/4', { deno: frac2.deno });
    assert(frac2.deno, 4);

    // Mutation guard: changing the original terms array after creation is safe
    terms[0].coeff = 999;
    assert(frac.numi.terms[0].coeff, 2);
    console.log('  Mutating original terms array does NOT affect the fraction (deep cloned) ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  4. evaluateTerm
//  Substitutes numbers for variables and computes coeff × x^px × y^py × …
//  e.g.  3x² at x=4  →  3 × 16 = 48
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 4. evaluateTerm ━━━');
console.log('  evaluateTerm(term, { varName: value, ... })');
console.log('  Plugs numbers in and multiplies everything together.\n');

{
    const c = createTerm(7);
    console.log('  evaluateTerm({ coeff:7 }, {})  →  7 (constant, no variables needed)');
    assertClose(evaluateTerm(c, {}), 7);

    const t1 = createTerm(3, { x: 2 });
    console.log('  evaluateTerm(3x², {x:4})  →  3 × 4² = 48');
    assertClose(evaluateTerm(t1, { x: 4 }), 48);

    const t2 = createTerm(2, { x: 1, y: 1 });
    console.log('  evaluateTerm(2xy, {x:3,y:5})  →  2 × 3 × 5 = 30');
    assertClose(evaluateTerm(t2, { x: 3, y: 5 }), 30);

    const t3 = createTerm(-1, { x: 3 });
    console.log('  evaluateTerm(-x³, {x:2})  →  -1 × 8 = -8');
    assertClose(evaluateTerm(t3, { x: 2 }), -8);

    console.log('  evaluateTerm(2x, {})  →  should throw "Variable x not provided"');
    assertThrows(() => evaluateTerm(createTerm(2, { x: 1 }), {}));
    console.log('  threw as expected ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  5. evaluateFraction
//  Sums all numerator terms then divides by the denominator.
//  e.g.  (3x + 2)/1 at x=2  →  (6+2)/1 = 8
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 5. evaluateFraction ━━━');
console.log('  evaluateFraction(fraction, values)');
console.log('  = (sum of all numerator terms evaluated) / deno\n');

{
    const f1 = createFraction([createTerm(3, { x: 1 }), createTerm(2)]);
    console.log('  (3x + 2)/1 at x=2  →  (6+2)/1 = 8');
    assertClose(evaluateFraction(f1, { x: 2 }), 8);

    const f2 = createFraction([createTerm(1, { x: 2 }), createTerm(1, { x: 1 })], 2);
    console.log('  (x² + x)/2 at x=4  →  (16+4)/2 = 10');
    assertClose(evaluateFraction(f2, { x: 4 }), 10);

    const f3 = createFraction([createTerm(6)], 3);
    console.log('  6/3  →  2  (no variables, just constants)');
    assertClose(evaluateFraction(f3, {}), 2);
}


// ════════════════════════════════════════════════════════════════════════════
//  6. evaluateProduct
//  A "product" is an array of fractions that are multiplied together.
//  evaluateProduct evaluates each fraction then multiplies all results.
//  e.g.  (x+1)(x-1) at x=5  →  6 × 4 = 24
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 6. evaluateProduct ━━━');
console.log('  A product is [ fraction, fraction, ... ] — all multiplied.');
console.log('  evaluateProduct(product, values) = f1(values) × f2(values) × …\n');

{
    const f1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);   // (x + 1)
    const f2 = createFraction([createTerm(1, { x: 1 }), createTerm(-1)]);  // (x - 1)
    console.log('  product = [(x+1), (x-1)]');
    console.log('  at x=5  →  6 × 4 = 24');
    assertClose(evaluateProduct([f1, f2], { x: 5 }), 24);

    console.log('  a single-fraction product just passes through to evaluateFraction');
    assertClose(evaluateProduct([f1], { x: 3 }), 4);   // (3+1) = 4
}


// ════════════════════════════════════════════════════════════════════════════
//  7. evaluateEquation
//  An "equation" is an array of products that are added together.
//  This is the outermost structure — a full polynomial like x² + 3x + 1
//  is stored as three separate single-fraction products.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 7. evaluateEquation ━━━');
console.log('  An equation is [ product, product, ... ] — all added.');
console.log('  e.g.  x² + 3x + 1  is three products: [x²], [3x], [1]\n');

{
    const eq = [
        [createFraction([createTerm(1, { x: 2 })])],   // x²
        [createFraction([createTerm(3, { x: 1 })])],   // 3x
        [createFraction([createTerm(1)])],              // 1
    ];
    console.log('  x² + 3x + 1  at x=2  →  4 + 6 + 1 = 11');
    assertClose(evaluateEquation(eq, { x: 2 }), 11);
    console.log('  x² + 3x + 1  at x=0  →  0 + 0 + 1 = 1');
    assertClose(evaluateEquation(eq, { x: 0 }), 1);
    console.log('  x² + 3x + 1  at x=-1  →  1 - 3 + 1 = -1');
    assertClose(evaluateEquation(eq, { x: -1 }), -1);
}


// ════════════════════════════════════════════════════════════════════════════
//  8. integrateTerm  (indefinite)
//  Applies the power rule:  ∫ c·xⁿ dx  =  c/(n+1) · x^(n+1)
//  A constant term c has an implicit x⁰, so it becomes c·x¹.
//  The integration variable is added (or its power bumped) in the result.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 8. integrateTerm ━━━');
console.log('  integrateTerm(term, variable)');
console.log('  Power rule: ∫ c·xⁿ dx  =  c/(n+1) · x^(n+1)\n');

{
    const t1 = createTerm(3, { x: 2 });
    const i1 = integrateTerm(t1, 'x');
    console.log('  ∫ 3x² dx  →  coeff becomes 3/3=1, power becomes 3');
    show('result', i1);
    assert(i1, { coeff: 1, var: { x: 3 } });

    const t2 = createTerm(6);
    const i2 = integrateTerm(t2, 'x');
    console.log('  ∫ 6 dx  →  constant is x⁰, becomes 6x¹');
    show('result', i2);
    assert(i2, { coeff: 6, var: { x: 1 } });

    const t3 = createTerm(4, { x: 1 });
    const i3 = integrateTerm(t3, 'x');
    console.log('  ∫ 4x dx  →  2x²');
    show('result', i3);
    assert(i3, { coeff: 2, var: { x: 2 } });

    const t4 = createTerm(3, { x: 2 });
    const i4 = integrateTerm(t4, 'y');
    console.log('  ∫ 3x² dy  →  x² is a constant w.r.t y, so result is 3x²y');
    show('result', i4);
    assert(i4, { coeff: 3, var: { x: 2, y: 1 } });
}


// ════════════════════════════════════════════════════════════════════════════
//  9. integrateFraction  (indefinite)
//  Applies integrateTerm to every term in the numerator.
//  The denominator number is carried over unchanged.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 9. integrateFraction ━━━');
console.log('  integrateFraction(fraction, variable)');
console.log('  Integrates each term in the numerator individually.\n');

{
    const frac = createFraction([createTerm(2, { x: 1 }), createTerm(4)]);  // 2x + 4
    const iFrac = integrateFraction(frac, 'x');
    console.log('  ∫ (2x + 4) dx  →  (x² + 4x)');
    console.log('  term[0]:', JSON.stringify(iFrac.numi.terms[0]), '← 2x → x²  (coeff 2/2=1, power 1→2)');
    console.log('  term[1]:', JSON.stringify(iFrac.numi.terms[1]), '← 4 → 4x   (coeff 4/1=4, power 0→1)');
    assert(iFrac.numi.terms[0], { coeff: 1, var: { x: 2 } });
    assert(iFrac.numi.terms[1], { coeff: 4, var: { x: 1 } });
    assert(iFrac.deno, 1);
}


// ════════════════════════════════════════════════════════════════════════════
//  10. definiteIntegrateTerm
//  Evaluates ∫[lower → upper] c·xⁿ dx
//  = c/(n+1) × (upper^(n+1) − lower^(n+1))
//  The result is a constant term — the integration variable is removed.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 10. definiteIntegrateTerm ━━━');
console.log('  definiteIntegrateTerm(term, lower, upper, variable)');
console.log('  = c/(n+1) × (upper^(n+1) − lower^(n+1))  →  a plain number (constant term)\n');

{
    const t1 = createTerm(3, { x: 2 });
    const dt1 = definiteIntegrateTerm(t1, 0, 2, 'x');
    console.log('  ∫[0→2] 3x² dx  =  [x³] from 0 to 2  =  8 − 0  =  8');
    show('result (coeff only, var removed)', dt1);
    assertClose(dt1.coeff, 8);
    assert(dt1.var, undefined);   // x was removed — result is a plain number

    const t2 = createTerm(2, { x: 1 });
    const dt2 = definiteIntegrateTerm(t2, 1, 3, 'x');
    console.log('  ∫[1→3] 2x dx  =  [x²] from 1 to 3  =  9 − 1  =  8');
    assertClose(dt2.coeff, 8);

    const t3 = createTerm(4);
    const dt3 = definiteIntegrateTerm(t3, 0, 5, 'x');
    console.log('  ∫[0→5] 4 dx  =  4x from 0 to 5  =  20');
    assertClose(dt3.coeff, 20);

    const t4 = createTerm(3, { x: 2, y: 2 });
    const dt4 = definiteIntegrateTerm(t4, 0, 2, 'x');
    console.log('  ∫[0→2] 3x²y² dx  →  y² is just a constant, stays in result');
    show('result', dt4);
    assertClose(dt4.coeff, 8);
    assert(dt4.var, { y: 2 });   // y² survives; x is gone
}


// ════════════════════════════════════════════════════════════════════════════
//  11. definiteIntegrateFraction
//  Applies definiteIntegrateTerm to every term in the numerator.
//  Returns a new fraction whose numi.terms are all constant-ish terms.
//  (Note: deno ≠ 1 triggers a console.warn — the library is simplified.)
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 11. definiteIntegrateFraction ━━━');
console.log('  definiteIntegrateFraction(fraction, lower, upper, variable)');
console.log('  Integrates each numerator term over the bounds, keeps deno.\n');

{
    // ∫[0→3] (x + 1) dx  =  [x²/2 + x] from 0 to 3  =  (4.5 + 3) = 7.5
    const frac = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);
    const dFrac = definiteIntegrateFraction(frac, 0, 3, 'x');
    const total = dFrac.numi.terms.reduce((s, t) => s + t.coeff, 0) / dFrac.deno;
    console.log('  ∫[0→3] (x+1) dx  =  x²/2 + x from 0 to 3  =  4.5 + 3 = 7.5');
    console.log('  sum of result terms / deno =', total);
    assertClose(total, 7.5);

    // ∫[1→2] (4x² + 2x) dx
    const frac2 = createFraction([createTerm(4, { x: 2 }), createTerm(2, { x: 1 })]);
    const dFrac2 = definiteIntegrateFraction(frac2, 1, 2, 'x');
    const total2 = dFrac2.numi.terms.reduce((s, t) => s + t.coeff, 0);
    console.log('  ∫[1→2] (4x²+2x) dx  ≈', total2, '  (expected', 28 / 3 + 3, ')');
    assertClose(total2, 28 / 3 + 3);
}


// ════════════════════════════════════════════════════════════════════════════
//  12. differentiateTerm
//  Power rule:  d/dx(c·xⁿ)  =  c·n · x^(n−1)
//  If x is not in the term at all → derivative is 0 (it's a constant w.r.t. x).
//  If power was 1 → power drops to 0, so the variable is removed entirely.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 12. differentiateTerm ━━━');
console.log('  differentiateTerm(term, variable)');
console.log('  Power rule: d/dx(c·xⁿ)  =  c·n · x^(n-1)\n');

{
    const t1 = createTerm(4, { x: 3 });
    const d1 = differentiateTerm(t1, 'x');
    console.log('  d/dx(4x³)  →  4×3 = 12, power 3→2');
    show('result', d1);
    assert(d1, { coeff: 12, var: { x: 2 } });

    const t2 = createTerm(5, { x: 1 });
    const d2 = differentiateTerm(t2, 'x');
    console.log('  d/dx(5x)   →  5×1 = 5, power 1→0 so variable removed');
    show('result', d2);
    assert(d2, { coeff: 5 });

    const t3 = createTerm(7);
    const d3 = differentiateTerm(t3, 'x');
    console.log('  d/dx(7)    →  constant has no x, derivative = 0');
    show('result', d3);
    assert(d3, { coeff: 0 });

    const t4 = createTerm(3, { x: 2 });
    const d4 = differentiateTerm(t4, 'y');
    console.log('  d/dy(3x²)  →  no y in term, so 0');
    show('result', d4);
    assert(d4, { coeff: 0 });

    const t5 = createTerm(2, { x: 2, y: 3 });
    const d5 = differentiateTerm(t5, 'x');
    console.log('  d/dx(2x²y³)  →  only x changes: 2×2 = 4, x power 2→1, y unchanged');
    show('result', d5);
    assert(d5, { coeff: 4, var: { x: 1, y: 3 } });
}


// ════════════════════════════════════════════════════════════════════════════
//  13. differentiateFraction
//  Differentiates each term in the numerator and filters out zero terms.
//  Only works when deno = 1. For deno ≠ 1 the quotient rule isn't implemented
//  yet so it throws — that's the correct and expected behaviour for now.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 13. differentiateFraction ━━━');
console.log('  differentiateFraction(fraction, variable)');
console.log('  Differentiates each term; zero-coefficient terms are filtered out.\n');

{
    const frac = createFraction([
        createTerm(1, { x: 2 }),  // x²
        createTerm(3, { x: 1 }),  // 3x
        createTerm(5),             // 5
    ]);
    const dFrac = differentiateFraction(frac, 'x');
    console.log('  d/dx(x² + 3x + 5)  →  2x + 3   (5 differentiates to 0 and is filtered out)');
    console.log('  terms:', JSON.stringify(dFrac.numi.terms));
    assert(dFrac.numi.terms.length, 2);
    assert(dFrac.numi.terms[0], { coeff: 2, var: { x: 1 } });
    assert(dFrac.numi.terms[1], { coeff: 3 });

    console.log('\n  differentiateFraction with deno ≠ 1  →  should throw (quotient rule TODO)');
    assertThrows(() => differentiateFraction(createFraction([createTerm(1, { x: 1 })], 2), 'x'));
    console.log('  threw as expected ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  14. simplifyFraction
//  Combines like terms by grouping on their variable signature.
//  e.g.  3x + 2x − x  →  4x  (all three share the key {"x":1})
//  Terms whose combined coefficient is ≈ 0 are completely removed.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 14. simplifyFraction ━━━');
console.log('  simplifyFraction(fraction)');
console.log('  Merges terms that have the same variable signature (like terms).');
console.log('  Coefficients are summed; near-zero results are removed.\n');

{
    const f1 = createFraction([
        createTerm(3, { x: 1 }),
        createTerm(2, { x: 1 }),
        createTerm(-1, { x: 1 }),
    ]);
    const s1 = simplifyFraction(f1);
    console.log('  3x + 2x − x  →  all share key {"x":1}  →  (3+2-1)x = 4x');
    show('result terms', s1.numi.terms);
    assert(s1.numi.terms.length, 1);
    assertClose(s1.numi.terms[0].coeff, 4);

    const f2 = createFraction([createTerm(5), createTerm(3), createTerm(-8)]);
    const s2 = simplifyFraction(f2);
    console.log('  5 + 3 − 8  →  all constants  →  0  →  term is removed entirely');
    show('result terms', s2.numi.terms);
    assert(s2.numi.terms.length, 0);

    const f3 = createFraction([createTerm(1, { x: 2 }), createTerm(1, { x: 1 })]);
    const s3 = simplifyFraction(f3);
    console.log('  x² + x  →  unlike terms (different signatures)  →  stays as 2 terms');
    show('result terms', s3.numi.terms);
    assert(s3.numi.terms.length, 2);
}


// ════════════════════════════════════════════════════════════════════════════
//  15. simplifyProduct
//  Just maps simplifyFraction over every fraction in a product array.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 15. simplifyProduct ━━━');
console.log('  simplifyProduct(product)  →  simplifyFraction applied to each fraction.\n');

{
    const product = [
        createFraction([createTerm(2, { x: 1 }), createTerm(3, { x: 1 })]),  // 2x + 3x
        createFraction([createTerm(4), createTerm(-4)]),                       // 4 − 4
    ];
    const s = simplifyProduct(product);
    console.log('  fraction[0]: 2x + 3x  →  5x');
    console.log('  fraction[1]: 4 − 4    →  0  (empty terms list)');
    show('fraction[0] terms', s[0].numi.terms);
    show('fraction[1] terms', s[1].numi.terms);
    assert(s[0].numi.terms.length, 1);
    assertClose(s[0].numi.terms[0].coeff, 5);
    assert(s[1].numi.terms.length, 0);
}


// ════════════════════════════════════════════════════════════════════════════
//  16. simplifyEquation
//  Maps simplifyProduct over every product in an equation array.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 16. simplifyEquation ━━━');
console.log('  simplifyEquation(equation)  →  simplifyProduct applied to each product.\n');

{
    const eq = [
        [createFraction([createTerm(1, { x: 1 }), createTerm(2, { x: 1 })])],  // x + 2x
        [createFraction([createTerm(3), createTerm(7)])],                         // 3 + 7
    ];
    const s = simplifyEquation(eq);
    console.log('  product[0] fraction: x + 2x  →  3x');
    console.log('  product[1] fraction: 3 + 7   →  10');
    assert(s[0][0].numi.terms[0].coeff, 3);
    assert(s[1][0].numi.terms[0].coeff, 10);
    console.log('  both simplified correctly ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  17. multiplyTerms
//  Multiplies two terms: coefficients multiply, exponents of shared variables add.
//  e.g.  3x² × 2x  →  coeff 3×2=6, x exponent 2+1=3  →  6x³
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 17. multiplyTerms ━━━');
console.log('  multiplyTerms(t1, t2)');
console.log('  coefficients multiply; variable exponents ADD for the same variable.\n');

{
    const r1 = multiplyTerms(createTerm(3, { x: 2 }), createTerm(2, { x: 1 }));
    console.log('  3x² × 2x  →  coeff 3×2=6, x: 2+1=3  →  6x³');
    show('result', r1);
    assert(r1, { coeff: 6, var: { x: 3 } });

    const r2 = multiplyTerms(createTerm(2, { x: 1 }), createTerm(3, { y: 1 }));
    console.log('  2x × 3y  →  different variables, both kept  →  6xy');
    show('result', r2);
    assert(r2, { coeff: 6, var: { x: 1, y: 1 } });

    const r3 = multiplyTerms(createTerm(5), createTerm(4, { x: 1 }));
    console.log('  5 × 4x  →  constant × term  →  20x');
    show('result', r3);
    assert(r3, { coeff: 20, var: { x: 1 } });

    const r4 = multiplyTerms(createTerm(3), createTerm(4));
    console.log('  3 × 4  →  constant × constant  →  12  (no var key)');
    show('result', r4);
    assert(r4, { coeff: 12 });
}


// ════════════════════════════════════════════════════════════════════════════
//  18. expandFractions
//  FOIL expansion for two polynomials: (a+b)(c+d) = ac + ad + bc + bd
//  Every term in fraction 1 is multiplied by every term in fraction 2.
//  Like terms are combined afterwards via simplifyFraction.
//  Only works when both fractions have deno = 1.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 18. expandFractions ━━━');
console.log('  expandFractions(frac1, frac2)');
console.log('  FOIL: multiplies every pair of terms then simplifies like terms.');
console.log('  Both fractions must have deno = 1.\n');

{
    const f1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);  // (x + 1)
    const f2 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);  // (x + 1)
    const ex = expandFractions(f1, f2);
    console.log('  (x+1)(x+1)  =  x² + x + x + 1  →  x² + 2x + 1  (3 terms after like-term merge)');
    show('terms', ex.numi.terms);
    assert(ex.numi.terms.length, 3);
    assertClose(evaluateFraction(ex, { x: 3 }), 16);   // (3+1)² = 16
    console.log('  evaluated at x=3  →  16  ✓');

    const f3 = createFraction([createTerm(1, { x: 1 }), createTerm(-1)]);  // (x - 1)
    const f4 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);   // (x + 1)
    const ex2 = expandFractions(f3, f4);
    console.log('\n  (x-1)(x+1)  =  x² + x − x − 1  →  x² − 1  (middle terms cancel, 2 terms)');
    show('terms', ex2.numi.terms);
    assert(ex2.numi.terms.length, 2);

    console.log('\n  expandFractions with deno ≠ 1  →  should throw');
    assertThrows(() => expandFractions(createFraction([createTerm(1, { x: 1 })], 2), f1));
    console.log('  threw as expected ✓');
}


// ════════════════════════════════════════════════════════════════════════════
//  19. expandProduct
//  Reduces an entire product (array of fractions) down to one expanded fraction
//  by calling expandFractions repeatedly from left to right.
//  An empty product returns 1 (the multiplicative identity).
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 19. expandProduct ━━━');
console.log('  expandProduct(product)');
console.log('  Expands all fractions in the product into one single fraction.');
console.log('  Works left to right: ((f1 × f2) × f3) × …\n');

{
    const f1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);  // (x+1)
    const f2 = createFraction([createTerm(1, { x: 1 }), createTerm(2)]);  // (x+2)
    const f3 = createFraction([createTerm(1, { x: 1 }), createTerm(3)]);  // (x+3)
    const ex = expandProduct([f1, f2, f3]);
    console.log('  (x+1)(x+2)(x+3)  at x=1  →  2×3×4 = 24');
    assertClose(evaluateFraction(ex, { x: 1 }), 24);
    console.log('  (x+1)(x+2)(x+3)  at x=0  →  1×2×3 = 6');
    assertClose(evaluateFraction(ex, { x: 0 }), 6);

    console.log('\n  empty product []  →  returns fraction representing 1');
    const empty = expandProduct([]);
    assertClose(evaluateFraction(empty, {}), 1);

    console.log('  single-element product  →  passes through unchanged');
    assertClose(evaluateFraction(expandProduct([f1]), { x: 2 }), 3);  // (2+1) = 3
}


// ════════════════════════════════════════════════════════════════════════════
//  20. termToString
//  Converts a term object to a readable string.
//  Format: "<coeff>" or "<coeff>*<var>" or "<coeff>*<var>^<power>"
//  Power 1 is omitted for cleaner output (e.g. 3*x not 3*x^1).
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 20. termToString ━━━');
console.log('  termToString(term)  →  human-readable string');
console.log('  Power 1 is hidden; power > 1 shows as ^n\n');

{
    console.log('  createTerm(5)             →', termToString(createTerm(5)));
    assert(termToString(createTerm(5)), '5');

    console.log('  createTerm(3, {x:1})      →', termToString(createTerm(3, { x: 1 })));
    assert(termToString(createTerm(3, { x: 1 })), '3*x');

    console.log('  createTerm(2, {x:2})      →', termToString(createTerm(2, { x: 2 })));
    assert(termToString(createTerm(2, { x: 2 })), '2*x^2');

    console.log('  createTerm(-4, {x:2,y:3}) →', termToString(createTerm(-4, { x: 2, y: 3 })));
    assert(termToString(createTerm(-4, { x: 2, y: 3 })), '-4*x^2*y^3');
}


// ════════════════════════════════════════════════════════════════════════════
//  21. fractionToString
//  Joins all numerator term strings with ' + ' and wraps in parentheses.
//  When deno ≠ 1 appends /(deno).
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 21. fractionToString ━━━');
console.log('  fractionToString(fraction)');
console.log('  "(term + term + ...)/(deno)"  —  deno omitted when it is 1\n');

{
    const f1 = createFraction([createTerm(2, { x: 1 }), createTerm(5)]);
    console.log('  (2x + 5)   →', fractionToString(f1));
    assert(fractionToString(f1), '(2*x + 5)');

    const f2 = createFraction([createTerm(1, { x: 2 })], 3);
    console.log('  x²/3       →', fractionToString(f2));
    assert(fractionToString(f2), '(1*x^2)/(3)');

    const f3 = createFraction([createTerm(7)]);
    console.log('  7          →', fractionToString(f3));
    assert(fractionToString(f3), '(7)');
}


// ════════════════════════════════════════════════════════════════════════════
//  22. productToString
//  Joins fraction strings with ' * '
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 22. productToString ━━━');
console.log('  productToString(product)  →  "(frac1) * (frac2) * …"\n');

{
    const f1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);
    const f2 = createFraction([createTerm(1, { x: 1 }), createTerm(2)]);
    console.log('  [(x+1), (x+2)]  →', productToString([f1, f2]));
    assert(productToString([f1, f2]), '(1*x + 1) * (1*x + 2)');

    console.log('  [(x+1)]         →', productToString([f1]));
    assert(productToString([f1]), '(1*x + 1)');
}


// ════════════════════════════════════════════════════════════════════════════
//  23. equationToString
//  Joins product strings with ' + '
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 23. equationToString ━━━');
console.log('  equationToString(equation)  →  "product + product + …"\n');

{
    const f1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)]);
    const f2 = createFraction([createTerm(1, { x: 1 }), createTerm(2)]);
    const fx = createFraction([createTerm(1, { x: 1 })]);
    const eq = [[f1, f2], [fx]];
    console.log('  [(x+1)(x+2)] + [(x)]  →', equationToString(eq));
    assert(equationToString(eq), '(1*x + 1) * (1*x + 2) + (1*x)');
}


// ════════════════════════════════════════════════════════════════════════════
//  24. Workflow: differentiate → evaluate
//  Builds f(x) = x³ + 2x as a fraction, differentiates it to get f'(x) = 3x² + 2,
//  then evaluates f' at several points to verify.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 24. Workflow: differentiate then evaluate ━━━');
console.log('  f(x) = x³ + 2x  →  differentiate  →  f\'(x) = 3x² + 2\n');

{
    const frac = createFraction([createTerm(1, { x: 3 }), createTerm(2, { x: 1 })]);
    const dFrac = differentiateFraction(frac, 'x');
    console.log('  f\'(x) terms:', JSON.stringify(dFrac.numi.terms));
    console.log('  f\'(0) should be 3(0)²+2 = 2  →', evaluateFraction(dFrac, { x: 0 }));
    console.log('  f\'(1) should be 3(1)²+2 = 5  →', evaluateFraction(dFrac, { x: 1 }));
    console.log('  f\'(2) should be 3(4) +2 = 14 →', evaluateFraction(dFrac, { x: 2 }));
    assertClose(evaluateFraction(dFrac, { x: 0 }), 2);
    assertClose(evaluateFraction(dFrac, { x: 1 }), 5);
    assertClose(evaluateFraction(dFrac, { x: 2 }), 14);
}


// ════════════════════════════════════════════════════════════════════════════
//  25. Workflow: expand → differentiate
//  (x+2)² is first expanded symbolically to x²+4x+4,
//  then differentiated to 2x+4, then evaluated.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 25. Workflow: expand then differentiate ━━━');
console.log('  (x+2)²  →  expand  →  x²+4x+4  →  differentiate  →  2x+4\n');

{
    const f = createFraction([createTerm(1, { x: 1 }), createTerm(2)]);
    const expanded = expandProduct([f, f]);
    console.log('  (x+2)² expanded:', fractionToString(expanded));
    const dExpanded = differentiateFraction(expanded, 'x');
    console.log('  d/dx:', fractionToString(dExpanded));
    console.log('  at x=0  →  2(0)+4 = 4   →', evaluateFraction(dExpanded, { x: 0 }));
    console.log('  at x=3  →  2(3)+4 = 10  →', evaluateFraction(dExpanded, { x: 3 }));
    assertClose(evaluateFraction(dExpanded, { x: 0 }), 4);
    assertClose(evaluateFraction(dExpanded, { x: 3 }), 10);
}


// ════════════════════════════════════════════════════════════════════════════
//  26. Workflow: definite integration cross-check
//  ∫[0→1] (x² + x) dx  =  [x³/3 + x²/2] from 0 to 1  =  1/3 + 1/2 = 5/6 ≈ 0.8333
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 26. Workflow: definite integration cross-check ━━━');
console.log('  ∫[0→1] (x² + x) dx  =  1/3 + 1/2  =  5/6  ≈  0.8333\n');

{
    const frac = createFraction([createTerm(1, { x: 2 }), createTerm(1, { x: 1 })]);
    const dFrac = definiteIntegrateFraction(frac, 0, 1, 'x');
    const result = dFrac.numi.terms.reduce((s, t) => s + t.coeff, 0) / dFrac.deno;
    console.log('  result =', result, '  expected ≈', 5 / 6);
    assertClose(result, 5 / 6);
}


// ════════════════════════════════════════════════════════════════════════════
//  27. Edge cases
//  A handful of tricky but important boundary situations.
// ════════════════════════════════════════════════════════════════════════════
console.log('\n━━━ 27. Edge cases ━━━\n');

{
    console.log('  simplifyFraction on a zero-coeff term → empty terms list');
    const z = simplifyFraction(createFraction([createTerm(0)]));
    show('terms', z.numi.terms);
    assert(z.numi.terms.length, 0);

    console.log('\n  d/dx(0·x²)  →  0×2 = 0  (still a zero term)');
    const dz = differentiateTerm(createTerm(0, { x: 2 }), 'x');
    show('result', dz);
    assert(dz.coeff, 0);

    console.log('\n  deepClone works on plain arrays of objects');
    const arr = [{ coeff: 1, var: { x: 1 } }, { coeff: 2 }];
    const ca = deepClone(arr);
    ca[0].coeff = 99;
    assert(arr[0].coeff, 1);
    console.log('  original array[0].coeff still 1  ✓');

    console.log('\n  integrateTerm on x·z³ w.r.t. x  →  result keeps z³, bumps x to x²/2');
    const mixed = createTerm(1, { x: 1, z: 3 });
    const im = integrateTerm(mixed, 'x');
    show('result', im);
    assertClose(im.coeff, 0.5);
    assert(im.var.x, 2);
    assert(im.var.z, 3);
}


// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
console.log('═'.repeat(56));
if (failed > 0) process.exit(1);