# integrateFraction

Integrate a fraction by integrating each term in the numerator (indefinite integral).

## The Code

```js
/**
 * Integrate a fraction (indefinite integral)
 * Note: This only works for simple polynomial fractions
 */
function integrateFraction(fraction, indvar) {
    const newFraction = deepClone(fraction);

    // Integrate each term in the numerator
    newFraction.numi.terms = newFraction.numi.terms.map(term =>
        integrateTerm(term, indvar)
    );

    return newFraction;
}
```

## Line-by-Line Explanation

```js
function integrateFraction(fraction, indvar) {
```
- **`fraction`** — A fraction object with `numi` (numerator) and `deno` (denominator)
- **`indvar`** — The integration variable (variable we're integrating with respect to)

```js
    const newFraction = deepClone(fraction);
```
- Create a deep copy of the fraction to avoid mutating the original
- Preserves the original fraction object unchanged

```js
    newFraction.numi.terms = newFraction.numi.terms.map(term =>
```
- Use `map()` to transform each term in the numerator
- **`map()`** — Creates a new array by applying a function to each element
- Accesses the terms array inside the numerator object

```js
        integrateTerm(term, indvar)
```
- Integrate each individual term using the `integrateTerm` function
- Returns the integrated version of the term

```js
    );
```
- Close the map function

```js
    return newFraction;
```
- Return the new fraction with integrated numerator terms

```js
}
```
- Close the function

## How It Works

The function integrates a fraction by:

1. Deep cloning the fraction to preserve the original
2. Mapping over each term in the numerator
3. Applying the `integrateTerm` function to each term
4. Returning the fraction with integrated numerator

**Formula**: `∫ (t₁ + t₂ + ... + tₙ)/d dx = (∫t₁ dx + ∫t₂ dx + ... + ∫tₙ dx)/d`

**Important Note**: This works for simple polynomial fractions where the denominator is constant. It does NOT handle complex rational functions.

## Usage Examples

### Integrate a Simple Fraction

```js
const numerator = [createTerm(6)];
const fraction = createFraction(numerator, 2);

const result = integrateFraction(fraction, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 6, var: { x: 1 } }] },
//   deno: 2
// }
// Mathematical: ∫ (6/2) dx = 6x/2 = 3x + C
```

### Integrate a Polynomial Numerator

```js
const numerator = [
    createTerm(3, { x: 2 }),   // 3x²
    createTerm(2, { x: 1 }),   // 2x
    createTerm(1)               // 1
];
const fraction = createFraction(numerator, 1);

const result = integrateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 1, var: { x: 3 } },      // x³
//       { coeff: 1, var: { x: 2 } },      // x²
//       { coeff: 1, var: { x: 1 } }       // x
//     ]
//   },
//   deno: 1
// }
// Mathematical: ∫ (3x² + 2x + 1) dx = x³ + x² + x + C
```

### Integrate with Denominator

```js
const numerator = [createTerm(4, { x: 1 })];
const fraction = createFraction(numerator, 2);

const result = integrateFraction(fraction, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 2, var: { x: 2 } }] },
//   deno: 2
// }
// Mathematical: ∫ (4x/2) dx = 2x²/2 = x² + C
```

### Integrate Multiple Variables

```js
const numerator = [
    createTerm(6, { x: 1, y: 2 }),
    createTerm(3, { y: 1 })
];
const fraction = createFraction(numerator, 1);

const result = integrateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 3, var: { x: 2, y: 2 } },   // 3x²y²
//       { coeff: 3, var: { x: 1, y: 1 } }    // 3xy
//     ]
//   },
//   deno: 1
// }
// Mathematical: ∫ (6xy² + 3y) dx = 3x²y² + 3xy + C
// Note: y is treated as a constant
```

### Integrate Negative Terms

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(-3, { x: 1 }),
    createTerm(1)
];
const fraction = createFraction(numerator, 1);

const result = integrateFraction(fraction, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 0.666..., var: { x: 3 } },
//       { coeff: -1.5, var: { x: 2 } },
//       { coeff: 1, var: { x: 1 } }
//     ]
//   },
//   deno: 1
// }
// Mathematical: ∫ (2x² - 3x + 1) dx = (2/3)x³ - (3/2)x² + x + C
```

## Step-by-Step Example

Let's integrate `(2x + 3)/1` with respect to `x`:

```js
const numerator = [
    createTerm(2, { x: 1 }),
    createTerm(3)
];
const fraction = createFraction(numerator, 1);

const result = integrateFraction(fraction, 'x');
```

**Step by step:**
1. `newFraction = deepClone(fraction)` (creates independent copy)
2. Process first term `2x`:
   - `integrateTerm` returns `{ coeff: 1, var: { x: 2 } }` (x²)
3. Process second term `3`:
   - `integrateTerm` returns `{ coeff: 3, var: { x: 1 } }` (3x)
4. New numerator terms: `[x², 3x]`
5. Return fraction with integrated numerator

**Mathematical verification**: `∫ (2x + 3) dx = x² + 3x + C` ✓

## Integration Table

| Original Fraction | Integration Variable | Result | Mathematical |
|------------------|---------------------|--------|-------------|
| `6/2` | `x` | `6x/2` | `∫ 3 dx = 3x` |
| `(x²)/1` | `x` | `(x³/3)/1` | `∫ x² dx = x³/3` |
| `(2x + 1)/1` | `x` | `(x² + x)/1` | `∫ (2x+1) dx = x²+x` |
| `(3x²)/2` | `x` | `(x³)/2` | `∫ (3x²/2) dx = x³/2` |

## Important Limitations

**This function is simplified and only works for:**
- Polynomial fractions
- Constant denominators
- Cases where you can integrate the numerator term-by-term

**Does NOT work for:**
- Rational functions like `∫ 1/(x²+1) dx`
- Cases requiring substitution or partial fractions
- Denominators containing the integration variable

```js
// This will give incorrect results:
const badFraction = createFraction([createTerm(1)], { x: 1 });
// Should use advanced techniques, not simple term integration
```

## Why Deep Clone?

```js
const newFraction = deepClone(fraction);
```

Without deep cloning, the original fraction would be modified:

```js
const original = createFraction([createTerm(2, { x: 1 })], 1);
const integrated = integrateFraction(original, 'x');

// Without deep clone, 'original' would also be changed
```

## Dependencies

This function requires:
- **`deepClone`** — To create an independent copy of the fraction
- **`integrateTerm`** — To integrate each individual term in the numerator

## Why Use This?

This function is useful for:

- Symbolic integration of polynomial fractions
- Building calculus calculators
- Finding antiderivatives of rational expressions
- Educational tools for teaching integration
- Step-by-step integration solutions
- Computer algebra systems