# evaluateFraction

Evaluate a fraction by calculating the sum of numerator terms divided by the denominator.

## The Code

```js
/**
 * Evaluate a fraction (sum of terms / denominator)
 */
function evaluateFraction(fraction, values) {
    let numeratorSum = 0;

    for (let term of fraction.numi.terms) {
        numeratorSum += evaluateTerm(term, values);
    }

    return numeratorSum / fraction.deno;
}
```

## Line-by-Line Explanation

```js
function evaluateFraction(fraction, values) {
```
- **`fraction`** — A fraction object with `numi` (numerator) and `deno` (denominator)
- **`values`** — Variable values to substitute (e.g., `{x: 2, y: 3}`)

```js
    let numeratorSum = 0;
```
- Initialize a variable to accumulate the sum of all numerator terms
- Starts at 0 because we'll be adding terms to it

```js
    for (let term of fraction.numi.terms) {
```
- Loop through each term in the numerator's terms array
- **`fraction.numi.terms`** — Array of term objects

```js
        numeratorSum += evaluateTerm(term, values);
```
- Evaluate each term using the `evaluateTerm` function
- Add the result to the running sum
- **`+=`** — Adds to the existing `numeratorSum`

```js
    }
```
- Close the for loop

```js
    return numeratorSum / fraction.deno;
```
- Divide the total numerator sum by the denominator
- This gives the final fraction value

```js
}
```
- Close the function

## How It Works

The function evaluates a fraction by:

1. Starting with a sum of 0
2. Evaluating each term in the numerator
3. Adding all term values together
4. Dividing by the denominator

**Formula**: `(term₁ + term₂ + ... + termₙ) / denominator`

## Usage Examples

### Simple Fraction

```js
const numerator = [createTerm(6)];
const fraction = createFraction(numerator, 2);

const result = evaluateFraction(fraction, {});

console.log(result); // 3
// Calculation: 6 / 2 = 3
```

### Fraction with Variable

```js
const numerator = [createTerm(4, { x: 1 })];
const fraction = createFraction(numerator, 2);

const result = evaluateFraction(fraction, { x: 3 });

console.log(result); // 6
// Calculation: (4 × 3) / 2 = 12 / 2 = 6
```

### Polynomial Numerator

```js
const numerator = [
    createTerm(2, { x: 2 }),   // 2x²
    createTerm(3, { x: 1 }),   // 3x
    createTerm(1)               // 1
];
const fraction = createFraction(numerator, 2);

const result = evaluateFraction(fraction, { x: 2 });

console.log(result); // 7.5
// Calculation: (2×2² + 3×2 + 1) / 2
//            = (2×4 + 6 + 1) / 2
//            = (8 + 6 + 1) / 2
//            = 15 / 2 = 7.5
```

### Multiple Variables

```js
const numerator = [
    createTerm(6, { x: 1, y: 1 }),
    createTerm(-4)
];
const fraction = createFraction(numerator, 2);

const result = evaluateFraction(fraction, { x: 2, y: 3 });

console.log(result); // 7
// Calculation: (6×2×3 - 4) / 2
//            = (36 - 4) / 2
//            = 32 / 2 = 16
```

### Negative Result

```js
const numerator = [
    createTerm(5),
    createTerm(-10)
];
const fraction = createFraction(numerator, 5);

const result = evaluateFraction(fraction, {});

console.log(result); // -1
// Calculation: (5 - 10) / 5 = -5 / 5 = -1
```

### Whole Number (denominator = 1)

```js
const numerator = [createTerm(3, { x: 2 })];
const fraction = createFraction(numerator, 1);

const result = evaluateFraction(fraction, { x: 4 });

console.log(result); // 48
// Calculation: (3 × 4²) / 1 = 48 / 1 = 48
```

## Step-by-Step Example

Let's evaluate the fraction `(2x² + 3x - 1) / 4` at `x = 3`:

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(-1)
];
const fraction = createFraction(numerator, 4);

const result = evaluateFraction(fraction, { x: 3 });
```

**Step by step:**
1. `numeratorSum = 0`
2. Evaluate first term `2x²`:
   - `evaluateTerm` returns `2 × 3² = 2 × 9 = 18`
   - `numeratorSum = 0 + 18 = 18`
3. Evaluate second term `3x`:
   - `evaluateTerm` returns `3 × 3 = 9`
   - `numeratorSum = 18 + 9 = 27`
4. Evaluate third term `-1`:
   - `evaluateTerm` returns `-1`
   - `numeratorSum = 27 + (-1) = 26`
5. Divide by denominator:
   - `26 / 4 = 6.5`
6. Return `6.5`

**Mathematical verification**: `(2×3² + 3×3 - 1) / 4 = (18 + 9 - 1) / 4 = 26 / 4 = 6.5` ✓

## Dependencies

This function requires:
- **`evaluateTerm`** — To evaluate each individual term in the numerator

## Why Use This?

This function is useful for:

- Evaluating rational expressions
- Calculating fraction values with variables
- Building algebra calculators
- Simplifying complex mathematical expressions
- Working with polynomial divisions