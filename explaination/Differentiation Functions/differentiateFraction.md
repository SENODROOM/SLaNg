# differentiateFraction

Differentiate a fraction by differentiating each term in the numerator (simplified case where denominator = 1).

## The Code

```js
/**
 * Differentiate a fraction
 */
function differentiateFraction(fraction, indvar) {
    // For simple case where deno = 1
    if (fraction.deno === 1) {
        return {
            numi: {
                terms: fraction.numi.terms.map(term =>
                    differentiateTerm(term, indvar)
                ).filter(term => term.coeff !== 0) // Remove zero terms
            },
            deno: 1
        };
    }

    // For general case, would need quotient rule - TODO
    throw new Error('Differentiation with deno ≠ 1 not yet implemented');
}
```

## Line-by-Line Explanation

```js
function differentiateFraction(fraction, indvar) {
```
- **`fraction`** — A fraction object with `numi` (numerator) and `deno` (denominator)
- **`indvar`** — The differentiation variable (variable we're differentiating with respect to)

```js
    if (fraction.deno === 1) {
```
- Check if the denominator equals 1
- This is the simple case: just a polynomial, no actual division

```js
        return {
```
- Return a new fraction object

```js
            numi: {
```
- Create the numerator object

```js
                terms: fraction.numi.terms.map(term =>
```
- Map over each term in the numerator
- **`map()`** — Transform each term into its derivative

```js
                    differentiateTerm(term, indvar)
```
- Differentiate each term using the `differentiateTerm` function
- Applies the power rule to each term individually

```js
                ).filter(term => term.coeff !== 0) // Remove zero terms
```
- **`filter()`** — Remove terms with coefficient 0
- **Why?** Constants differentiate to 0, which we can remove for cleaner output
- Keeps the result simplified

```js
            },
```
- Close the numerator object

```js
            deno: 1
```
- Keep the denominator as 1
- No change to the denominator

```js
        };
```
- Close the return object

```js
    }
```
- Close the if statement

```js
    // For general case, would need quotient rule - TODO
    throw new Error('Differentiation with deno ≠ 1 not yet implemented');
```
- If denominator is not 1, throw an error
- **Quotient rule** would be needed: `d/dx(f/g) = (f'g - fg')/g²`
- This is a limitation of the current implementation

```js
}
```
- Close the function

## How It Works

The function differentiates a fraction (polynomial case) by:

1. Checking if denominator is 1 (simplified case)
2. Mapping over each term in the numerator
3. Differentiating each term using the power rule
4. Filtering out zero terms (from differentiated constants)
5. Returning the fraction with the differentiated numerator

**Formula (for deno = 1)**: `d/dx(t₁ + t₂ + ... + tₙ) = d/dx(t₁) + d/dx(t₂) + ... + d/dx(tₙ)`

**Limitation**: Does NOT handle the quotient rule for `deno ≠ 1`.

## Usage Examples

### Differentiate a Simple Polynomial

```js
const numerator = [createTerm(3, { x: 2 })];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 6, var: { x: 1 } }] },
//   deno: 1
// }
// Mathematical: d/dx(3x²) = 6x
```

### Differentiate Multiple Terms

```js
const numerator = [
    createTerm(2, { x: 3 }),   // 2x³
    createTerm(5, { x: 2 }),   // 5x²
    createTerm(3, { x: 1 })    // 3x
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 6, var: { x: 2 } },   // 6x²
//       { coeff: 10, var: { x: 1 } },  // 10x
//       { coeff: 3 }                    // 3
//     ]
//   },
//   deno: 1
// }
// Mathematical: d/dx(2x³ + 5x² + 3x) = 6x² + 10x + 3
```

### Differentiate with Constants (Zero Terms Removed)

```js
const numerator = [
    createTerm(4, { x: 2 }),   // 4x²
    createTerm(7)               // 7 (constant)
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 8, var: { x: 1 } }   // 8x
//       // Note: derivative of 7 is 0, so it's filtered out
//     ]
//   },
//   deno: 1
// }
// Mathematical: d/dx(4x² + 7) = 8x
```

### Differentiate Only Constants

```js
const numerator = [
    createTerm(5),
    createTerm(10),
    createTerm(-3)
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: { terms: [] },
//   deno: 1
// }
// Mathematical: d/dx(5 + 10 - 3) = 0
// Note: All terms are filtered out (all derivatives are 0)
```

### Differentiate with Multiple Variables

```js
const numerator = [
    createTerm(6, { x: 2, y: 1 }),
    createTerm(4, { y: 2 })
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 12, var: { x: 1, y: 1 } }   // 12xy
//       // 4y² has no x, so derivative is 0 and filtered out
//     ]
//   },
//   deno: 1
// }
// Mathematical: d/dx(6x²y + 4y²) = 12xy
```

### Negative Coefficients

```js
const numerator = [
    createTerm(3, { x: 2 }),
    createTerm(-2, { x: 1 }),
    createTerm(1)
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 6, var: { x: 1 } },   // 6x
//       { coeff: -2 }                   // -2
//     ]
//   },
//   deno: 1
// }
// Mathematical: d/dx(3x² - 2x + 1) = 6x - 2
```

## Error Case: Denominator ≠ 1

```js
const numerator = [createTerm(1, { x: 1 })];
const fraction = createFraction(numerator, 2);

try {
    const result = differentiateFraction(fraction, 'x');
} catch (error) {
    console.log(error.message);
    // "Differentiation with deno ≠ 1 not yet implemented"
}

// This would require the quotient rule:
// d/dx(x/2) = 1/2 (simple case)
// But for d/dx(x/(x+1)), need: (1·(x+1) - x·1)/(x+1)²
```

## Step-by-Step Example

Let's differentiate `(2x² + 3x - 5)/1` with respect to `x`:

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(-5)
];
const fraction = createFraction(numerator, 1);

const result = differentiateFraction(fraction, 'x');
```

**Step by step:**
1. Check denominator: `deno = 1` ✓ (OK to proceed)
2. Process first term `2x²`:
   - `differentiateTerm` returns `{ coeff: 4, var: { x: 1 } }` (4x)
3. Process second term `3x`:
   - `differentiateTerm` returns `{ coeff: 3 }` (3)
4. Process third term `-5`:
   - `differentiateTerm` returns `{ coeff: 0 }` (0)
5. Filter out zero terms:
   - Remove the term with `coeff: 0`
6. Result: `[{ coeff: 4, var: { x: 1 } }, { coeff: 3 }]`
7. Return fraction with differentiated terms

**Mathematical verification**: `d/dx(2x² + 3x - 5) = 4x + 3` ✓

## Why Filter Zero Terms?

```js
.filter(term => term.coeff !== 0)
```

**Without filtering:**
```js
// d/dx(x² + 5)
{
  numi: {
    terms: [
      { coeff: 2, var: { x: 1 } },   // 2x
      { coeff: 0 }                    // 0 (from constant)
    ]
  },
  deno: 1
}
```

**With filtering (cleaner):**
```js
// d/dx(x² + 5)
{
  numi: {
    terms: [
      { coeff: 2, var: { x: 1 } }    // 2x
    ]
  },
  deno: 1
}
```

## Quotient Rule (Not Implemented)

For fractions with `deno ≠ 1`, the **quotient rule** is needed:

**d/dx(f/g) = (f'·g - f·g') / g²**

Example that would fail:
```js
// d/dx(x/(x+1))
// Would need: ((1)(x+1) - (x)(1)) / (x+1)²
//           = (x+1-x) / (x+1)²
//           = 1 / (x+1)²
```

This is marked as `TODO` in the implementation.

## Limitations

**This function works for:**
- Polynomials (denominator = 1)
- Simple sums of terms
- Terms with multiple variables

**Does NOT work for:**
- Fractions with variable denominators
- Rational functions requiring quotient rule
- Any case where `deno ≠ 1`

## Dependencies

This function requires:
- **`differentiateTerm`** — To differentiate each individual term in the numerator
  - Which requires **`deepClone`**
  - Which requires **`createTerm`**

## Why Use This?

This function is useful for:

- Differentiating polynomial expressions
- Building calculus calculators (simplified cases)
- Finding derivatives of sums
- Educational tools for teaching differentiation
- Symbolic computation with polynomials
- Optimization problems with polynomial constraints

## Future Enhancement

To support `deno ≠ 1`, the function would need to implement the **quotient rule**:

```js
function differentiateFraction(fraction, indvar) {
    if (fraction.deno === 1) {
        // Current implementation
    } else {
        // TODO: Implement quotient rule
        // d/dx(f/g) = (f'·g - f·g') / g²
    }
}
```