# quotientRuleDifferentiate

Apply the quotient rule to differentiate a fraction (numerator divided by denominator).

## The Code

```js
/**
 * Quotient Rule: d/dx[f/g] = (f'·g - f·g') / g²
 * Takes numerator and denominator fractions
 */
function quotientRuleDifferentiate(numerator, denominator, indvar) {
    const fPrime = differentiateFraction(numerator, indvar);
    const gPrime = differentiateFraction(denominator, indvar);

    // f' * g
    const fPrimeTimesG = expandFractions(fPrime, denominator);

    // f * g'
    const fTimesGPrime = expandFractions(numerator, gPrime);

    // f' * g - f * g'
    const numeratorResult = {
        numi: {
            terms: [
                ...fPrimeTimesG.numi.terms,
                ...fTimesGPrime.numi.terms.map(t => ({
                    ...deepClone(t),
                    coeff: -t.coeff
                }))
            ]
        },
        deno: 1
    };

    // g²
    const gSquared = expandFractions(denominator, denominator);

    return {
        numerator: simplifyFraction(numeratorResult),
        denominator: gSquared,
        note: 'Result is (numerator)/(denominator)'
    };
}
```

## Line-by-Line Explanation

```js
function quotientRuleDifferentiate(numerator, denominator, indvar) {
```
- **`numerator`** — Fraction representing f (the top)
- **`denominator`** — Fraction representing g (the bottom)
- **`indvar`** — The differentiation variable

```js
    const fPrime = differentiateFraction(numerator, indvar);
```
- Differentiate the numerator: **f'**
- Stores the derivative of the top function

```js
    const gPrime = differentiateFraction(denominator, indvar);
```
- Differentiate the denominator: **g'**
- Stores the derivative of the bottom function

```js
    // f' * g
    const fPrimeTimesG = expandFractions(fPrime, denominator);
```
- Multiply **f' × g**
- **`expandFractions`** — Expands the product
- This is the first part of the numerator in the quotient rule

```js
    // f * g'
    const fTimesGPrime = expandFractions(numerator, gPrime);
```
- Multiply **f × g'**
- This is the second part (to be subtracted)

```js
    // f' * g - f * g'
    const numeratorResult = {
```
- Create the numerator of the result: **f'g - fg'**

```js
        numi: {
            terms: [
```
- Start building the terms array

```js
                ...fPrimeTimesG.numi.terms,
```
- Spread operator: add all terms from **f'g**
- **`...`** — Unpacks the array

```js
                ...fTimesGPrime.numi.terms.map(t => ({
```
- Add all terms from **fg'**, but negated
- **`.map()`** — Transform each term

```js
                    ...deepClone(t),
```
- Clone the term to avoid mutation
- **`...`** — Spread the term's properties

```js
                    coeff: -t.coeff
```
- Negate the coefficient for subtraction
- Overwrites the coefficient from the spread

```js
                }))
```
- Close the map function and object literal

```js
            ]
        },
        deno: 1
```
- Close the terms array and set denominator to 1
- The numerator is a polynomial (for now)

```js
    };
```
- Close the numeratorResult object

```js
    // g²
    const gSquared = expandFractions(denominator, denominator);
```
- Calculate **g²** by multiplying g by itself
- This becomes the denominator of the result

```js
    return {
```
- Return an object (not a standard fraction)

```js
        numerator: simplifyFraction(numeratorResult),
```
- Simplified numerator: **f'g - fg'**

```js
        denominator: gSquared,
```
- Denominator: **g²**

```js
        note: 'Result is (numerator)/(denominator)'
```
- Helpful note explaining the structure
- Reminds user this isn't a standard fraction object

```js
    };
```
- Close the return object

```js
}
```
- Close the function

## How It Works

The function implements the **quotient rule**:

**Formula**: `d/dx[f/g] = (f'·g - f·g') / g²`

**Steps**:
1. Differentiate numerator: **f'**
2. Differentiate denominator: **g'**
3. Calculate: **f' × g**
4. Calculate: **f × g'**
5. Subtract: **f'g - fg'** (numerator)
6. Square denominator: **g²**
7. Return: **(f'g - fg') / g²**

## Usage Examples

### Simple Quotient

```js
const f = createFraction([createTerm(1, { x: 1 })], 1);  // x
const g = createFraction([createTerm(1, { x: 2 })], 1);  // x²

const result = quotientRuleDifferentiate(f, g, 'x');

console.log(fractionToString(result.numerator));
// f' = 1, g' = 2x
// f'g - fg' = 1·x² - x·2x = x² - 2x² = -x²

console.log(fractionToString(result.denominator));
// g² = (x²)² = x⁴

// Mathematical: d/dx[x/x²] = d/dx[1/x] = -1/x² = -x²/x⁴ = -1/x²
```

### Constant Numerator

```js
const f = createFraction([createTerm(1)], 1);            // 1
const g = createFraction([createTerm(1, { x: 1 })], 1);  // x

const result = quotientRuleDifferentiate(f, g, 'x');

// f' = 0, g' = 1
// f'g - fg' = 0·x - 1·1 = -1
// g² = x²
// Result: -1/x²

// Mathematical: d/dx[1/x] = -1/x²
```

### Polynomial Quotient

```js
const f = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1)
], 1);  // x² + 1

const g = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);  // x + 1

const result = quotientRuleDifferentiate(f, g, 'x');

// f' = 2x, g' = 1
// f'g - fg' = 2x(x+1) - (x²+1)·1
//           = 2x² + 2x - x² - 1
//           = x² + 2x - 1
// g² = (x+1)²
// Result: (x² + 2x - 1)/(x+1)²
```

### Both Polynomials

```js
const f = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3)
], 1);  // 2x + 3

const g = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);  // x + 2

const result = quotientRuleDifferentiate(f, g, 'x');

// f' = 2, g' = 1
// f'g - fg' = 2(x+2) - (2x+3)·1
//           = 2x + 4 - 2x - 3
//           = 1
// g² = (x+2)²
// Result: 1/(x+2)²
```

### Constant Denominator

```js
const f = createFraction([createTerm(1, { x: 2 })], 1);  // x²
const g = createFraction([createTerm(3)], 1);            // 3

const result = quotientRuleDifferentiate(f, g, 'x');

// f' = 2x, g' = 0
// f'g - fg' = 2x·3 - x²·0 = 6x
// g² = 9
// Result: 6x/9 = 2x/3

// Mathematical: d/dx[x²/3] = 2x/3
```

## Step-by-Step Example

Let's differentiate `x²/(x+1)` with respect to x:

```js
const f = createFraction([createTerm(1, { x: 2 })], 1);  // x²
const g = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);  // x + 1

const result = quotientRuleDifferentiate(f, g, 'x');
```

**Step by step:**

1. Differentiate numerator:
   - `f' = d/dx[x²] = 2x`

2. Differentiate denominator:
   - `g' = d/dx[x+1] = 1`

3. Calculate f'g:
   - `2x · (x+1) = 2x² + 2x`

4. Calculate fg':
   - `x² · 1 = x²`

5. Calculate numerator (f'g - fg'):
   - `(2x² + 2x) - x² = x² + 2x`

6. Calculate denominator (g²):
   - `(x+1)² = x² + 2x + 1`

7. Result:
   - Numerator: `x² + 2x`
   - Denominator: `x² + 2x + 1`

**Mathematical verification**: `d/dx[x²/(x+1)] = (2x(x+1) - x²·1)/(x+1)² = (x²+2x)/(x²+2x+1)` ✓

## Quotient Rule Formula Breakdown

**Formula**: `d/dx[f/g] = (f'g - fg')/g²`

| Component | Meaning | Example (x²/x) |
|-----------|---------|----------------|
| `f` | Numerator | x² |
| `g` | Denominator | x |
| `f'` | Derivative of numerator | 2x |
| `g'` | Derivative of denominator | 1 |
| `f'g` | First product | 2x·x = 2x² |
| `fg'` | Second product | x²·1 = x² |
| `f'g - fg'` | Numerator of result | 2x² - x² = x² |
| `g²` | Denominator of result | x² |
| **Result** | **(f'g - fg')/g²** | **x²/x² = 1** |

## Return Structure

**Important**: This function returns a special object, not a standard fraction:

```js
{
    numerator: fraction,      // Simplified (f'g - fg')
    denominator: fraction,    // g²
    note: 'Result is (numerator)/(denominator)'
}
```

**To get a standard representation**:
```js
const result = quotientRuleDifferentiate(f, g, 'x');
const resultString = `${fractionToString(result.numerator)}/${fractionToString(result.denominator)}`;
```

## Why Negate with `.map()`?

```js
...fTimesGPrime.numi.terms.map(t => ({
    ...deepClone(t),
    coeff: -t.coeff
}))
```

**Purpose**: Subtract fg' by negating its coefficients.

**Why not just negate the whole fraction?**
- We need to combine terms: `f'g + (-fg')`
- Easier to combine if all terms are in the same array
- Simplification will handle the combination

**Example**:
```js
// f'g = [2x², 3x]
// fg' = [x², x]
// Combined: [2x², 3x, -x², -x]
// Simplified: [x², 2x]
```

## Why Deep Clone?

```js
...deepClone(t),
```

Without deep cloning, negating would mutate the original terms:

```js
// Bad: Mutates fTimesGPrime
fTimesGPrime.numi.terms.forEach(t => t.coeff = -t.coeff);

// Good: Creates new terms
fTimesGPrime.numi.terms.map(t => ({...deepClone(t), coeff: -t.coeff}))
```

## Special Cases

### Zero Numerator
```js
const f = createFraction([createTerm(0)], 1);  // 0
const g = createFraction([createTerm(1, { x: 1 })], 1);  // x

// d/dx[0/x] = (0·x - 0·1)/x² = 0/x² = 0
```

### Constant Quotient
```js
const f = createFraction([createTerm(5)], 1);  // 5
const g = createFraction([createTerm(3)], 1);  // 3

// d/dx[5/3] = (0·3 - 5·0)/9 = 0/9 = 0
```

### Self Division
```js
const f = createFraction([createTerm(1, { x: 1 })], 1);  // x
const g = createFraction([createTerm(1, { x: 1 })], 1);  // x

// d/dx[x/x] = d/dx[1] = 0
// Let's verify:
// (1·x - x·1)/x² = 0/x² = 0 ✓
```

## Comparison with Product Rule

| Rule | Formula | When to Use |
|------|---------|-------------|
| Product | `d/dx[f·g] = f'g + fg'` | Multiplying functions |
| Quotient | `d/dx[f/g] = (f'g - fg')/g²` | Dividing functions |

**Note the signs**: Product has `+`, Quotient has `-`

## Dependencies

This function requires:
- **`differentiateFraction`** — To differentiate f and g
- **`expandFractions`** — To multiply f'g and fg'
- **`simplifyFraction`** — To simplify the numerator
- **`deepClone`** — To avoid mutation when negating

## Why Use This?

This function is useful for:

- Differentiating rational functions
- Applying the quotient rule symbolically
- Building calculus calculators
- Educational tools for teaching the quotient rule
- Computing derivatives of fractions
- Symbolic differentiation systems
- Verifying derivative calculations