# expandProduct

Expand a product of multiple fractions into a single fraction by repeatedly multiplying them together.

## The Code

```js
/**
 * Expand a product into a single fraction
 */
function expandProduct(product) {
    if (product.length === 0) {
        return createFraction([createTerm(1)]);
    }

    let result = product[0];

    for (let i = 1; i < product.length; i++) {
        result = expandFractions(result, product[i]);
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function expandProduct(product) {
```
- **`product`** — An array of fractions to be multiplied together

```js
    if (product.length === 0) {
```
- Check if the product array is empty
- **Edge case**: What should an empty product return?

```js
        return createFraction([createTerm(1)]);
```
- Return a fraction representing `1`
- **Multiplicative identity**: Empty product = 1
- Similar to how an empty sum = 0

```js
    }
```
- Close the if statement

```js
    let result = product[0];
```
- Initialize result with the first fraction
- Starting point for accumulating the product

```js
    for (let i = 1; i < product.length; i++) {
```
- Loop through remaining fractions (starting from index 1)
- **`i = 1`** — Skip first element (already in result)
- **`i < product.length`** — Continue until all fractions processed

```js
        result = expandFractions(result, product[i]);
```
- Multiply current result by the next fraction
- **`expandFractions()`** — Expands and simplifies the product
- Updates `result` with the accumulated product
- **Accumulation pattern**: `result = result × product[i]`

```js
    }
```
- Close the for loop

```js
    return result;
```
- Return the final expanded product

```js
}
```
- Close the function

## How It Works

The function expands a product by:

1. Handling empty array edge case (returns 1)
2. Starting with the first fraction as the result
3. Iteratively multiplying each subsequent fraction with the result
4. Each multiplication expands and simplifies
5. Returning the final single fraction

**Formula**: `f₁ × f₂ × f₃ × ... × fₙ`

**Process**: `((f₁ × f₂) × f₃) × ... × fₙ` (left-associative)

## Usage Examples

### Single Fraction

```js
const fraction = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3)
], 1);

const product = [fraction];

const result = expandProduct(product);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 2, var: { x: 1 } },
//       { coeff: 3 }
//     ]
//   },
//   deno: 1
// }
// Mathematical: 2x + 3 (unchanged)
```

### Two Binomials (FOIL)

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);

const product = [frac1, frac2];

const result = expandProduct(product);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 2 } },   // x²
//       { coeff: 5, var: { x: 1 } },   // 5x
//       { coeff: 6 }                    // 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x + 2)(x + 3) = x² + 5x + 6
```

### Three Binomials

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac3 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);

const product = [frac1, frac2, frac3];

const result = expandProduct(product);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 3 } },   // x³
//       { coeff: 6, var: { x: 2 } },   // 6x²
//       { coeff: 11, var: { x: 1 } },  // 11x
//       { coeff: 6 }                    // 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x + 1)(x + 2)(x + 3) = x³ + 6x² + 11x + 6
```

### Monomial × Binomial × Trinomial

```js
const frac1 = createFraction([
    createTerm(2, { x: 1 })    // 2x
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);

const frac3 = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);

const product = [frac1, frac2, frac3];

const result = expandProduct(product);

console.log(result);
// Mathematical: 2x(x + 1)(x² + x + 1)
//             = (2x² + 2x)(x² + x + 1)
//             = 2x⁴ + 2x³ + 2x² + 2x³ + 2x² + 2x
//             = 2x⁴ + 4x³ + 4x² + 2x
```

### Empty Product

```js
const product = [];

const result = expandProduct(product);

console.log(result);
// {
//   numi: { terms: [{ coeff: 1 }] },
//   deno: 1
// }
// Mathematical: Empty product = 1 (multiplicative identity)
```

### Multiple Variables

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(3)
], 1);

const product = [frac1, frac2];

const result = expandProduct(product);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 1, y: 1 } },   // xy
//       { coeff: 3, var: { x: 1 } },          // 3x
//       { coeff: 2, var: { y: 1 } },          // 2y
//       { coeff: 6 }                           // 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x + 2)(y + 3) = xy + 3x + 2y + 6
```

### Difference of Squares

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(-2)
], 1);

const product = [frac1, frac2];

const result = expandProduct(product);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 2 } },   // x²
//       { coeff: -4 }                   // -4
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x + 2)(x - 2) = x² - 4
// Note: Middle terms cancel out (2x - 2x = 0)
```

## Step-by-Step Example

Let's expand `(x + 1)(x + 2)(x + 3)`:

```js
const frac1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)], 1);
const frac2 = createFraction([createTerm(1, { x: 1 }), createTerm(2)], 1);
const frac3 = createFraction([createTerm(1, { x: 1 }), createTerm(3)], 1);

const product = [frac1, frac2, frac3];

const result = expandProduct(product);
```

**Step by step:**
1. Check if empty: No, `product.length = 3`
2. Initialize: `result = frac1 = (x + 1)`
3. **Iteration 1** (`i = 1`):
   - `result = expandFractions((x + 1), (x + 2))`
   - Expands to: `x² + 3x + 2`
4. **Iteration 2** (`i = 2`):
   - `result = expandFractions((x² + 3x + 2), (x + 3))`
   - Expands to: `x³ + 6x² + 11x + 6`
5. Return final result

**Mathematical verification**:
- Step 1: `(x + 1)(x + 2) = x² + 3x + 2`
- Step 2: `(x² + 3x + 2)(x + 3) = x³ + 3x² + 3x² + 9x + 2x + 6 = x³ + 6x² + 11x + 6` ✓

## Left-Associative Accumulation

The function processes products left-to-right:

```
(a)(b)(c)(d)
= ((a × b) × c) × d
```

**Example process**:
1. Start: `a`
2. After 1st iteration: `a × b`
3. After 2nd iteration: `(a × b) × c`
4. After 3rd iteration: `((a × b) × c) × d`

## Complexity Analysis

For `n` fractions with average `m` terms each:
- **First multiplication**: `m × m = m²` terms (before simplification)
- **Second multiplication**: `m² × m = m³` terms
- **Third multiplication**: `m³ × m = m⁴` terms

Simplification reduces term count at each step by combining like terms.

## Why Empty Product Returns 1?

```js
if (product.length === 0) {
    return createFraction([createTerm(1)]);
}
```

**Multiplicative identity property**:
- Empty sum = 0 (additive identity)
- Empty product = 1 (multiplicative identity)

**Example**:
```js
// Empty sum
[].reduce((a, b) => a + b, 0)  // → 0

// Empty product
[].reduce((a, b) => a * b, 1)  // → 1
```

## Iterative vs Recursive

This uses an **iterative** approach:

```js
// Iterative (current implementation)
let result = product[0];
for (let i = 1; i < product.length; i++) {
    result = expandFractions(result, product[i]);
}
```

**Could also be recursive**:
```js
// Recursive (alternative)
function expandProductRecursive(product) {
    if (product.length === 0) return createFraction([createTerm(1)]);
    if (product.length === 1) return product[0];
    return expandFractions(
        product[0],
        expandProductRecursive(product.slice(1))
    );
}
```

The iterative approach is more efficient (no call stack overhead).

## Dependencies

This function requires:
- **`expandFractions`** — To multiply and expand two fractions
  - Which requires **`multiplyTerms`**
  - Which requires **`simplifyFraction`**
- **`createFraction`** — To create the identity element (1)
- **`createTerm`** — To create the term for 1

## Why Use This?

This function is useful for:

- Expanding products of multiple polynomials
- Multiplying binomials, trinomials together
- Computing polynomial products
- Symbolic algebra systems
- Factoring verification (expand to check)
- Educational tools for teaching polynomial expansion
- Finding coefficients of expanded forms