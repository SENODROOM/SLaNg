# createFraction 

A utility function to create mathematical fractions with numerator terms and a denominator.

## The Code

```js
/**
 * Create a simple fraction (numi/deno)
 * @param {Array} terms - Array of terms for numerator
 * @param {number} deno - Denominator (default 1)
 */
function createFraction(terms, deno = 1) {
    return {
        numi: { terms: deepClone(terms) },
        deno
    };
}
```

## Line-by-Line Explanation

```js
function createFraction(terms, deno = 1) {
```
- **`function createFraction`** — Declares the function
- **`terms`** — First parameter: an array of term objects for the numerator
- **`deno = 1`** — Second parameter: the denominator with a default value of 1 (makes fractions like 3/1 = 3)

```js
    return {
```
- Returns an object representing the fraction

```js
        numi: { terms: deepClone(terms) },
```
- **`numi`** — The numerator object
- **`terms: deepClone(terms)`** — Deep clones the terms array to prevent mutation of the original array
- The numerator is wrapped in an object `{ terms: [...] }` for consistent structure

```js
        deno
```
- **`deno`** — The denominator (shorthand for `deno: deno`)
- Uses ES6 property shorthand syntax

```js
    };
```
- Closes the returned object

```js
}
```
- Closes the function

## How It Works

The function creates a fraction object with:

1. **`numi`** — Numerator containing an array of terms (deep cloned for safety)
2. **`deno`** — Denominator (a simple number)

The `deepClone` ensures that modifying the original `terms` array won't affect the fraction.

## Usage Examples

### Simple Integer Fraction

```js
const term1 = createTerm(3);
const fraction1 = createFraction([term1], 4);

console.log(fraction1);
// {
//   numi: { terms: [{ coeff: 3 }] },
//   deno: 4
// }
// Represents: 3/4
```

### Whole Number (denominator = 1)

```js
const term2 = createTerm(5);
const fraction2 = createFraction([term2]);

console.log(fraction2);
// {
//   numi: { terms: [{ coeff: 5 }] },
//   deno: 1
// }
// Represents: 5/1 = 5
```

### Fraction with Variable

```js
const term3 = createTerm(2, { x: 1 });
const fraction3 = createFraction([term3], 3);

console.log(fraction3);
// {
//   numi: { terms: [{ coeff: 2, var: { x: 1 } }] },
//   deno: 3
// }
// Represents: 2x/3
```

### Polynomial in Numerator

```js
const polynomial = [
    createTerm(3, { x: 2 }),   // 3x²
    createTerm(2, { x: 1 }),   // 2x
    createTerm(-5)              // -5
];

const fraction4 = createFraction(polynomial, 2);

console.log(fraction4);
// {
//   numi: {
//     terms: [
//       { coeff: 3, var: { x: 2 } },
//       { coeff: 2, var: { x: 1 } },
//       { coeff: -5 }
//     ]
//   },
//   deno: 2
// }
// Represents: (3x² + 2x - 5)/2
```

### Complex Fraction

```js
const numerator = [
    createTerm(4, { x: 1, y: 2 }),
    createTerm(-3)
];

const fraction5 = createFraction(numerator, 7);

console.log(fraction5);
// {
//   numi: {
//     terms: [
//       { coeff: 4, var: { x: 1, y: 2 } },
//       { coeff: -3 }
//     ]
//   },
//   deno: 7
// }
// Represents: (4xy² - 3)/7
```

## Object Structure

### Returned Object Format

```js
{
    numi: {
        terms: [...]    // Array of term objects (deep cloned)
    },
    deno: number        // Denominator value
}
```

## Why Deep Clone?

```js
numi: { terms: deepClone(terms) }
```

The `deepClone` function creates an independent copy of the terms array:

```js
const myTerms = [createTerm(3), createTerm(5)];
const fraction = createFraction(myTerms, 2);

// Modify the original array
myTerms[0].coeff = 99;

console.log(fraction.numi.terms[0].coeff); // Still 3 (protected!)
```

**Without deep clone**, changes to the original `terms` array would affect the fraction.

## Why Use This?

This function is useful for:

- Representing rational expressions in algebra
- Building fraction-based calculators
- Creating symbolic math systems
- Handling polynomial division
- Working with rational functions

## Mathematical Representations

| Code | Mathematical Notation |
|------|---------------------|
| `createFraction([createTerm(3)], 4)` | 3/4 |
| `createFraction([createTerm(5)])` | 5/1 = 5 |
| `createFraction([createTerm(2, {x: 1})], 3)` | 2x/3 |
| `createFraction([createTerm(1, {x: 2}), createTerm(-1)], 4)` | (x² - 1)/4 |