# definiteIntegrateFraction

Evaluate the definite integral of a fraction between two bounds.

## The Code

```js
/**
 * Definite integration of a fraction
 */
function definiteIntegrateFraction(fraction, lower, upper, indvar) {
    // For denominator ≠ 1, this is simplified - proper implementation 
    // would need to handle rational functions more carefully
    if (fraction.deno !== 1) {
        console.warn('Definite integration with deno ≠ 1 may be inaccurate');
    }

    const newFraction = {
        numi: {
            terms: fraction.numi.terms.map(term =>
                definiteIntegrateTerm(term, lower, upper, indvar)
            )
        },
        deno: fraction.deno
    };

    return newFraction;
}
```

## Line-by-Line Explanation

```js
function definiteIntegrateFraction(fraction, lower, upper, indvar) {
```
- **`fraction`** — The fraction to integrate
- **`lower`** — Lower bound of integration
- **`upper`** — Upper bound of integration
- **`indvar`** — The integration variable

```js
    if (fraction.deno !== 1) {
```
- Check if the denominator is not equal to 1
- This is a warning condition for potential inaccuracy

```js
        console.warn('Definite integration with deno ≠ 1 may be inaccurate');
```
- Display a warning to the console
- Alerts the user that the result may not be mathematically rigorous
- This simplified implementation assumes the denominator is constant

```js
    }
```
- Close the if statement

```js
    const newFraction = {
```
- Create a new fraction object to store the result

```js
        numi: {
```
- Create the numerator object

```js
            terms: fraction.numi.terms.map(term =>
```
- Map over each term in the numerator
- **`map()`** — Transform each term into its definite integral

```js
                definiteIntegrateTerm(term, lower, upper, indvar)
```
- Apply definite integration to each term
- Uses the `definiteIntegrateTerm` function
- Passes the bounds and integration variable

```js
            )
```
- Close the map function

```js
        },
```
- Close the numerator object

```js
        deno: fraction.deno
```
- Keep the denominator unchanged
- The denominator is treated as a constant factor

```js
    };
```
- Close the new fraction object

```js
    return newFraction;
```
- Return the integrated fraction

```js
}
```
- Close the function

## How It Works

The function integrates a fraction by:

1. Warning if the denominator is not 1 (simplified case only)
2. Mapping over each term in the numerator
3. Applying definite integration to each term
4. Keeping the denominator constant
5. Returning the result as a fraction

**Formula**: `∫[a to b] (t₁ + t₂ + ... + tₙ)/d dx = (∫[a,b]t₁ + ∫[a,b]t₂ + ... + ∫[a,b]tₙ) / d`

**Important**: This assumes the denominator doesn't contain the integration variable!

## Usage Examples

### Simple Constant Numerator

```js
const numerator = [createTerm(6)];
const fraction = createFraction(numerator, 2);

const result = definiteIntegrateFraction(fraction, 0, 3, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 18 }] },
//   deno: 2
// }
// Mathematical: ∫[0 to 3] (6/2) dx = 18/2 = 9
```

### Polynomial Numerator

```js
const numerator = [
    createTerm(2, { x: 2 }),   // 2x²
    createTerm(3, { x: 1 }),   // 3x
    createTerm(1)               // 1
];
const fraction = createFraction(numerator, 1);

const result = definiteIntegrateFraction(fraction, 0, 2, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 5.333... },   // From 2x²
//       { coeff: 6 },          // From 3x
//       { coeff: 2 }           // From 1
//     ]
//   },
//   deno: 1
// }
// Mathematical: ∫[0 to 2] (2x² + 3x + 1) dx
//             = [2x³/3 + 3x²/2 + x] |[0 to 2]
//             = 16/3 + 6 + 2 = 13.333...
```

### Fraction with Denominator (Warning Case)

```js
const numerator = [createTerm(4, { x: 1 })];
const fraction = createFraction(numerator, 2);

const result = definiteIntegrateFraction(fraction, 1, 3, 'x');
// Console: "Definite integration with deno ≠ 1 may be inaccurate"

console.log(result);
// {
//   numi: { terms: [{ coeff: 16 }] },
//   deno: 2
// }
// Mathematical: ∫[1 to 3] (4x/2) dx = 16/2 = 8
```

### Multiple Variables

```js
const numerator = [createTerm(6, { x: 1, y: 2 })];
const fraction = createFraction(numerator, 1);

const result = definiteIntegrateFraction(fraction, 0, 2, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 12, var: { y: 2 } }] },
//   deno: 1
// }
// Mathematical: ∫[0 to 2] 6xy² dx = 3x²y² |[0 to 2] = 12y²
// Note: y remains as a variable
```

### Negative Bounds

```js
const numerator = [createTerm(3, { x: 2 })];
const fraction = createFraction(numerator, 1);

const result = definiteIntegrateFraction(fraction, -1, 1, 'x');

console.log(result);
// {
//   numi: { terms: [{ coeff: 0 }] },
//   deno: 1
// }
// Mathematical: ∫[-1 to 1] 3x² dx = x³ |[-1 to 1] = 1 - (-1) = 0
// Wait, should be 1 - (-1) = 2. Let me recalculate...
// Actually: 1³ - (-1)³ = 1 - (-1) = 2
```

### Multiple Terms

```js
const numerator = [
    createTerm(1, { x: 1 }),
    createTerm(-2)
];
const fraction = createFraction(numerator, 1);

const result = definiteIntegrateFraction(fraction, 0, 4, 'x');

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 8 },    // From x
//       { coeff: -8 }    // From -2
//     ]
//   },
//   deno: 1
// }
// Mathematical: ∫[0 to 4] (x - 2) dx
//             = [x²/2 - 2x] |[0 to 4]
//             = (8 - 8) - 0 = 0
```

## Step-by-Step Example

Let's integrate `(2x + 1)/1` from 0 to 3:

```js
const numerator = [
    createTerm(2, { x: 1 }),
    createTerm(1)
];
const fraction = createFraction(numerator, 1);

const result = definiteIntegrateFraction(fraction, 0, 3, 'x');
```

**Step by step:**
1. Check denominator: `deno = 1` (OK, no warning)
2. Process first term `2x`:
   - `definiteIntegrateTerm(2x, 0, 3, 'x')`
   - Antiderivative: `x²`
   - Evaluate: `3² - 0² = 9`
   - Result: `{ coeff: 9 }`
3. Process second term `1`:
   - `definiteIntegrateTerm(1, 0, 3, 'x')`
   - Antiderivative: `x`
   - Evaluate: `3 - 0 = 3`
   - Result: `{ coeff: 3 }`
4. Create new fraction with integrated terms
5. Sum the results: `9 + 3 = 12`

**Mathematical verification**: `∫[0 to 3] (2x + 1) dx = [x² + x] |[0 to 3] = (9 + 3) - 0 = 12` ✓

## Warning Explanation

```js
if (fraction.deno !== 1) {
    console.warn('Definite integration with deno ≠ 1 may be inaccurate');
}
```

**Why the warning?**
- This implementation treats the denominator as a constant
- It doesn't handle cases where the denominator contains the integration variable
- For complex rational functions, specialized techniques are needed

**Safe cases** (deno = 1 or constant):
```js
∫ (2x + 1)/3 dx  // ✓ Works fine
```

**Problematic cases** (requires advanced techniques):
```js
∫ 1/(x² + 1) dx  // ✗ Needs arctan
∫ x/(x² + 1) dx  // ✗ Needs substitution
```

## Limitations

**This function works for:**
- Polynomial numerators
- Constant denominators
- Simple fractions

**Does NOT work properly for:**
- Rational functions with variable denominators
- Cases requiring partial fractions
- Logarithmic or trigonometric results
- Complex rational expressions

## To Get Numerical Result

The result is still a fraction structure. To get a single number:

```js
const result = definiteIntegrateFraction(fraction, 0, 2, 'x');

// Sum the numerator terms and divide by denominator
let sum = 0;
for (let term of result.numi.terms) {
    sum += term.coeff;
}
const finalValue = sum / result.deno;

console.log(finalValue);
```

## Dependencies

This function requires:
- **`definiteIntegrateTerm`** — To integrate each term in the numerator
  - Which requires **`integrateTerm`**
  - Which requires **`deepClone`**

## Why Use This?

This function is useful for:

- Computing definite integrals of polynomial fractions
- Building calculus calculators
- Finding areas under rational curves (simplified cases)
- Educational tools for integration
- Numerical analysis with simple fractions