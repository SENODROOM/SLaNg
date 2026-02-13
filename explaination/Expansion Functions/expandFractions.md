# expandFractions

Expand the product of two fractions using the distributive property (FOIL method for polynomials).

## The Code

```js
/**
 * Expand product of two fractions (both with deno=1)
 * (a + b)(c + d) = ac + ad + bc + bd
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
- **`frac1`** — First fraction to expand
- **`frac2`** — Second fraction to expand

```js
    if (frac1.deno !== 1 || frac2.deno !== 1) {
```
- Check if either denominator is not 1
- **`||`** — Logical OR: true if either condition is true
- This function only works for polynomials (denominator = 1)

```js
        throw new Error('Expansion only works for deno=1');
```
- Throw an error if denominators are not 1
- Prevents incorrect results from improper use
- Rational function expansion would require different logic

```js
    }
```
- Close the if statement

```js
    const expandedTerms = [];
```
- Create empty array to store all the expanded terms
- Will collect the results of multiplying each term by each term

```js
    for (let term1 of frac1.numi.terms) {
```
- Loop through each term in the first fraction's numerator
- Outer loop for first polynomial

```js
        for (let term2 of frac2.numi.terms) {
```
- Loop through each term in the second fraction's numerator
- Inner loop for second polynomial
- **Nested loops**: Each term from frac1 multiplies with each term from frac2

```js
            expandedTerms.push(multiplyTerms(term1, term2));
```
- Multiply the current terms together using `multiplyTerms`
- **`push()`** — Add the result to the expandedTerms array
- Example: `(2x)(3y)` → `6xy` gets added to array

```js
        }
    }
```
- Close both loops

```js
    return simplifyFraction({
```
- Create a fraction and simplify it

```js
        numi: { terms: expandedTerms },
```
- Create numerator with all the expanded terms

```js
        deno: 1
```
- Set denominator to 1 (polynomial result)

```js
    });
```
- Close the fraction object and simplifyFraction call

```js
}
```
- Close the function

## How It Works

The function applies the **distributive property**:

**(a + b)(c + d) = ac + ad + bc + bd**

Steps:
1. Verify both fractions have denominator = 1 (are polynomials)
2. Use nested loops to multiply each term from frac1 with each term from frac2
3. Collect all products in an array
4. Simplify to combine like terms
5. Return the expanded and simplified result

## Usage Examples

### Simple Binomial Multiplication (FOIL)

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),   // x
    createTerm(2)               // 2
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),   // x
    createTerm(3)               // 3
], 1);

const result = expandFractions(frac1, frac2);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 2 } },   // x²
//       { coeff: 5, var: { x: 1 } },   // 5x (3x + 2x combined)
//       { coeff: 6 }                    // 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6
```

### Monomial × Binomial

```js
const frac1 = createFraction([
    createTerm(2, { x: 1 })    // 2x
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 2 }),   // x²
    createTerm(3)               // 3
], 1);

const result = expandFractions(frac1, frac2);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 2, var: { x: 3 } },   // 2x³
//       { coeff: 6, var: { x: 1 } }    // 6x
//     ]
//   },
//   deno: 1
// }
// Mathematical: 2x(x² + 3) = 2x³ + 6x
```

### Different Variables

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(3)
], 1);

const result = expandFractions(frac1, frac2);

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

### Trinomial × Binomial

```js
const frac1 = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(2, { x: 1 }),
    createTerm(3)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);

const result = expandFractions(frac1, frac2);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 3 } },   // x³
//       { coeff: 3, var: { x: 2 } },   // 3x² (x² + 2x² combined)
//       { coeff: 5, var: { x: 1 } },   // 5x (2x + 3x combined)
//       { coeff: 3 }                    // 3
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x² + 2x + 3)(x + 1) = x³ + x² + 2x² + 2x + 3x + 3
//                                     = x³ + 3x² + 5x + 3
```

### Negative Coefficients

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(-2)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);

const result = expandFractions(frac1, frac2);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 2 } },   // x²
//       { coeff: 1, var: { x: 1 } },   // x (3x - 2x combined)
//       { coeff: -6 }                   // -6
//     ]
//   },
//   deno: 1
// }
// Mathematical: (x - 2)(x + 3) = x² + 3x - 2x - 6 = x² + x - 6
```

## Error Case: Denominator ≠ 1

```js
const frac1 = createFraction([createTerm(1, { x: 1 })], 2);
const frac2 = createFraction([createTerm(1, { x: 1 })], 1);

try {
    const result = expandFractions(frac1, frac2);
} catch (error) {
    console.log(error.message);
    // "Expansion only works for deno=1"
}
```

## Step-by-Step Example (FOIL)

Let's expand `(x + 2)(x + 3)`:

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),   // x
    createTerm(2)               // 2
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),   // x
    createTerm(3)               // 3
], 1);

const result = expandFractions(frac1, frac2);
```

**Step by step:**
1. Check denominators: both are 1 ✓
2. Create `expandedTerms = []`
3. **Outer loop** - term1 = `x`:
   - **Inner loop** - term2 = `x`:
     - `multiplyTerms(x, x) = x²`
     - Push to array: `[x²]`
   - **Inner loop** - term2 = `3`:
     - `multiplyTerms(x, 3) = 3x`
     - Push to array: `[x², 3x]`
4. **Outer loop** - term1 = `2`:
   - **Inner loop** - term2 = `x`:
     - `multiplyTerms(2, x) = 2x`
     - Push to array: `[x², 3x, 2x]`
   - **Inner loop** - term2 = `3`:
     - `multiplyTerms(2, 3) = 6`
     - Push to array: `[x², 3x, 2x, 6]`
5. Create fraction with these terms
6. Simplify (combines `3x + 2x = 5x`)
7. Result: `x² + 5x + 6`

**FOIL breakdown**:
- **F**irst: `x × x = x²`
- **O**uter: `x × 3 = 3x`
- **I**nner: `2 × x = 2x`
- **L**ast: `2 × 3 = 6`
- Combined: `x² + 5x + 6` ✓

## FOIL Method

For binomials `(a + b)(c + d)`:

| Step | Terms | Result |
|------|-------|--------|
| **F**irst | `a × c` | First terms |
| **O**uter | `a × d` | Outer terms |
| **I**nner | `b × c` | Inner terms |
| **L**ast | `b × d` | Last terms |

This function generalizes FOIL to work with any number of terms.

## Number of Multiplications

For polynomials with `m` and `n` terms:
- **Total multiplications**: `m × n`

**Examples**:
- Binomial × Binomial: `2 × 2 = 4` products
- Trinomial × Binomial: `3 × 2 = 6` products
- Trinomial × Trinomial: `3 × 3 = 9` products

## Why Simplify at the End?

```js
return simplifyFraction({
    numi: { terms: expandedTerms },
    deno: 1
});
```

**Without simplification**:
```
(x + 2)(x + 3) → [x², 3x, 2x, 6]  // Not combined
```

**With simplification**:
```
(x + 2)(x + 3) → [x², 5x, 6]      // Like terms combined
```

## Limitations

**Works for:**
- Polynomials (denominator = 1)
- Any number of terms
- Multiple variables

**Does NOT work for:**
- Rational functions (denominator ≠ 1)
- Would need quotient/product rules for fractions

## Dependencies

This function requires:
- **`multiplyTerms`** — To multiply individual terms
- **`simplifyFraction`** — To combine like terms in the result

## Why Use This?

This function is useful for:

- Expanding polynomial products
- Implementing FOIL method
- Multiplying binomials, trinomials, etc.
- Building algebra systems
- Symbolic computation
- Educational tools for teaching polynomial multiplication
- Preparing expressions for further operations