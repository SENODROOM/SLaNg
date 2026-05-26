# expandFractions

Expand the product of two fractions by multiplying every term in the first numerator with every term in the second numerator.

## The Code

```js
/**
 * Helper to expand two fractions (used in product rule)
 */
function expandFractions(frac1, frac2) {
    if (frac1.deno !== 1 || frac2.deno !== 1) {
        throw new Error('Expansion only works for deno=1');
    }

    const expandedTerms = [];

    for (let term1 of frac1.numi.terms) {
        for (let term2 of frac2.numi.terms) {
            expandedTerms.push(multiplyTerms(term1, term2));
        }
    }

    return simplifyFraction({
        numi: { terms: expandedTerms },
        deno: 1
    });
}
```

## Line-by-Line Explanation

```js
function expandFractions(frac1, frac2) {
```
- **`frac1`** — First fraction to multiply
- **`frac2`** — Second fraction to multiply
- Returns the expanded product as a simplified fraction

```js
    if (frac1.deno !== 1 || frac2.deno !== 1) {
```
- Check if either fraction has a non-trivial denominator
- This function only handles polynomial fractions (denominator = 1)
- **`frac1.deno`** — Denominator of the first fraction
- **`frac2.deno`** — Denominator of the second fraction

```js
        throw new Error('Expansion only works for deno=1');
```
- Throw an error if either denominator is not 1
- Prevents invalid operations on rational fractions
- Forces caller to handle fraction division separately

```js
    }
```
- Close the if statement

```js
    const expandedTerms = [];
```
- Create empty array to store all resulting terms
- Will contain the cross-product of all term combinations

```js
    for (let term1 of frac1.numi.terms) {
```
- Loop through each term in the first fraction's numerator
- **`frac1.numi.terms`** — Array of terms in the first polynomial

```js
        for (let term2 of frac2.numi.terms) {
```
- Nested loop through each term in the second fraction's numerator
- Creates all possible pairings of terms
- **`frac2.numi.terms`** — Array of terms in the second polynomial

```js
            expandedTerms.push(multiplyTerms(term1, term2));
```
- Multiply the current pair of terms
- **`multiplyTerms`** — Multiplies coefficients and adds exponents
- Add the product to the result array
- Accumulates: `(a₁ + a₂ + ...) × (b₁ + b₂ + ...) = a₁b₁ + a₁b₂ + ... + aₙbₘ`

```js
        }
    }
```
- Close both loops

```js
    return simplifyFraction({
```
- Create and simplify the resulting fraction

```js
        numi: { terms: expandedTerms },
```
- Set the numerator to contain all expanded terms
- Creates a polynomial object with the term array

```js
        deno: 1
```
- Set denominator to 1 (polynomial result)
- Maintains the constraint that this function returns polynomials

```js
    });
```
- Close the object and function call
- **`simplifyFraction`** — Combines like terms and reduces

```js
}
```
- Close the function

## How It Works

The function implements **polynomial multiplication** using the distributive property:

**(a + b)(c + d) = ac + ad + bc + bd**

**Algorithm**:
1. Validate both fractions are polynomials (deno = 1)
2. For each term in frac1:
   - For each term in frac2:
     - Multiply the terms together
     - Add to result array
3. Simplify by combining like terms

This creates a **Cartesian product** of the term sets.

## Usage Examples

### Two Binomials

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(2)             // 2
], 1);  // (x + 2)

const frac2 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(3)             // 3
], 1);  // (x + 3)

const result = expandFractions(frac1, frac2);

console.log(fractionToString(result));
// Expands: (x + 2)(x + 3)
// = x·x + x·3 + 2·x + 2·3
// = x² + 3x + 2x + 6
// = x² + 5x + 6
```

### Monomial Times Binomial

```js
const frac1 = createFraction([
    createTerm(3, { x: 2 })   // 3x²
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(1)             // 1
], 1);  // (x + 1)

const result = expandFractions(frac1, frac2);

// Expands: 3x²(x + 1)
// = 3x²·x + 3x²·1
// = 3x³ + 3x²
```

### Two Monomials

```js
const frac1 = createFraction([
    createTerm(2, { x: 3 })   // 2x³
], 1);

const frac2 = createFraction([
    createTerm(5, { x: 2 })   // 5x²
], 1);

const result = expandFractions(frac1, frac2);

// Expands: 2x³ · 5x²
// = 10x⁵
```

### Three-Term Polynomial

```js
const frac1 = createFraction([
    createTerm(1, { x: 2 }),  // x²
    createTerm(2, { x: 1 }),  // 2x
    createTerm(1)             // 1
], 1);  // (x² + 2x + 1)

const frac2 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(1)             // 1
], 1);  // (x + 1)

const result = expandFractions(frac1, frac2);

// Expands: (x² + 2x + 1)(x + 1)
// = x²·x + x²·1 + 2x·x + 2x·1 + 1·x + 1·1
// = x³ + x² + 2x² + 2x + x + 1
// = x³ + 3x² + 3x + 1
```

### Multiple Variables

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(1, { y: 1 })   // y
], 1);  // (x + y)

const frac2 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(-1, { y: 1 })  // -y
], 1);  // (x - y)

const result = expandFractions(frac1, frac2);

// Expands: (x + y)(x - y)
// = x·x + x·(-y) + y·x + y·(-y)
// = x² - xy + xy - y²
// = x² - y²
// Difference of squares!
```

### Constants

```js
const frac1 = createFraction([
    createTerm(3)   // 3
], 1);

const frac2 = createFraction([
    createTerm(5)   // 5
], 1);

const result = expandFractions(frac1, frac2);

// Expands: 3 · 5 = 15
```

### Zero Product

```js
const frac1 = createFraction([
    createTerm(0)   // 0
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 5 })   // x⁵
], 1);

const result = expandFractions(frac1, frac2);

// Expands: 0 · x⁵ = 0
```

## Step-by-Step Example

Let's expand `(x + 1)(2x + 3)`:

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),  // x
    createTerm(1)             // 1
], 1);

const frac2 = createFraction([
    createTerm(2, { x: 1 }),  // 2x
    createTerm(3)             // 3
], 1);

const result = expandFractions(frac1, frac2);
```

**Step by step:**

1. **Validation**: Both denominators are 1 ✓

2. **Initialize**: `expandedTerms = []`

3. **Outer loop iteration 1** (term1 = x):
   - Inner iteration 1: `x × 2x = 2x²` → push to array
   - Inner iteration 2: `x × 3 = 3x` → push to array
   - `expandedTerms = [2x², 3x]`

4. **Outer loop iteration 2** (term1 = 1):
   - Inner iteration 1: `1 × 2x = 2x` → push to array
   - Inner iteration 2: `1 × 3 = 3` → push to array
   - `expandedTerms = [2x², 3x, 2x, 3]`

5. **Simplify**: Combine like terms
   - `2x² + 3x + 2x + 3 = 2x² + 5x + 3`

6. Return `(2x² + 5x + 3)`

**Mathematical verification**: `(x + 1)(2x + 3) = 2x² + 3x + 2x + 3 = 2x² + 5x + 3` ✓

## Why Denominators Must Be 1

```js
if (frac1.deno !== 1 || frac2.deno !== 1) {
    throw new Error('Expansion only works for deno=1');
}
```

**Reason**: This function implements polynomial multiplication, not rational fraction multiplication.

**For rational fractions**:
```
(a/b) × (c/d) = (a×c)/(b×d)
```

**This function only handles**:
```
(a/1) × (c/1) = (a×c)/1
```

**To multiply rational fractions**, you'd need a different function that:
1. Expands numerators: `a × c`
2. Expands denominators: `b × d`
3. Simplifies the result

**Example of invalid input**:
```js
const frac1 = createFraction([createTerm(1, { x: 1 })], 2);  // x/2
const frac2 = createFraction([createTerm(1, { x: 1 })], 3);  // x/3

expandFractions(frac1, frac2);  // ❌ Error!
// Should be: (x/2)(x/3) = x²/6
```

## Complexity Analysis

For polynomials with `m` and `n` terms:
- **Outer loop**: `m` iterations
- **Inner loop**: `n` iterations per outer iteration
- **Term multiplications**: `m × n` total
- **Before simplification**: `O(m·n)` terms
- **After simplification**: Fewer terms (like terms combined)

**Space complexity**: `O(m·n)` for the expanded terms array

## FOIL Method

For two binomials, this implements **FOIL**:
- **F**irst: First terms of each binomial
- **O**uter: Outer terms
- **I**nner: Inner terms  
- **L**ast: Last terms of each binomial

```js
// (a + b)(c + d)
// F: a×c
// O: a×d
// I: b×c
// L: b×d
// Result: ac + ad + bc + bd
```

This function generalizes FOIL to polynomials of any length.

## Relationship to Product Rule

This function is used by **`productRuleDifferentiate`**:

```js
product = expandFractions(product, productArray[j]);
```

When computing `d/dx[f·g]`, we need to expand products like `f'·g` and `f·g'`.

## Dependencies

This function requires:
- **`multiplyTerms`** — To multiply two individual terms
- **`simplifyFraction`** — To combine like terms in the result

## Common Patterns

### Squaring a Binomial

```js
const binomial = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);  // (x + 3)

const squared = expandFractions(binomial, binomial);
// (x + 3)² = x² + 6x + 9
```

### Difference of Squares

```js
const sum = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);  // (x + 2)

const diff = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(-2)
], 1);  // (x - 2)

const result = expandFractions(sum, diff);
// (x + 2)(x - 2) = x² - 4
```

### Distributing a Constant

```js
const constant = createFraction([createTerm(5)], 1);  // 5

const polynomial = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(1)
], 1);  // 2x² + 3x + 1

const result = expandFractions(constant, polynomial);
// 5(2x² + 3x + 1) = 10x² + 15x + 5
```

## Error Handling

### Invalid Denominator Example

```js
try {
    const frac1 = createFraction([createTerm(1, { x: 1 })], 1);
    const frac2 = createFraction([createTerm(1, { x: 1 })], 2);
    
    expandFractions(frac1, frac2);
} catch (error) {
    console.log(error.message);
    // "Expansion only works for deno=1"
}
```

This ensures the function is only used for polynomial multiplication.

## Why Use This?

This function is essential for:

- **Symbolic algebra systems** — Expanding polynomial products
- **Calculus** — Computing derivatives via product rule
- **Simplification** — Converting factored to expanded form
- **Pattern matching** — Recognizing algebraic identities
- **Educational tools** — Teaching polynomial multiplication
- **Computer algebra** — Building expression manipulators