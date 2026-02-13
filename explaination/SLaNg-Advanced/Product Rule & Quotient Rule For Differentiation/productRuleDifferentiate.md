# productRuleDifferentiate

Apply the product rule to differentiate a product of multiple fractions.

## The Code

```js
/**
 * Product Rule: d/dx[f·g] = f'·g + f·g'
 * Takes a product array [f, g, h, ...] and differentiates it
 */
function productRuleDifferentiate(productArray, indvar) {
    if (productArray.length === 0) return createFraction([createTerm(0)], 1);
    if (productArray.length === 1) {
        return differentiateFraction(productArray[0], indvar);
    }

    // For each factor, create a term where that factor is differentiated
    // and all others remain the same
    const resultTerms = [];

    for (let i = 0; i < productArray.length; i++) {
        const diffFactor = differentiateFraction(productArray[i], indvar);

        // Multiply this differentiated factor with all the others
        let product = diffFactor;
        for (let j = 0; j < productArray.length; j++) {
            if (i !== j) {
                product = expandFractions(product, productArray[j]);
            }
        }

        // Add to result
        for (let term of product.numi.terms) {
            resultTerms.push(term);
        }
    }

    return simplifyFraction({ numi: { terms: resultTerms }, deno: 1 });
}
```

## Line-by-Line Explanation

```js
function productRuleDifferentiate(productArray, indvar) {
```
- **`productArray`** — Array of fractions to multiply and differentiate
- **`indvar`** — The differentiation variable

```js
    if (productArray.length === 0) return createFraction([createTerm(0)], 1);
```
- Handle empty array edge case
- Empty product = 1, derivative of constant = 0
- Returns a fraction representing 0

```js
    if (productArray.length === 1) {
```
- Check if there's only one factor
- No product rule needed for single factor

```js
        return differentiateFraction(productArray[0], indvar);
```
- Simply differentiate the single fraction
- Returns the derivative directly

```js
    }
```
- Close the if statement

```js
    const resultTerms = [];
```
- Create empty array to collect all terms from the sum
- The product rule creates a sum of products

```js
    for (let i = 0; i < productArray.length; i++) {
```
- Loop through each factor in the product
- Each iteration creates one term in the product rule sum

```js
        const diffFactor = differentiateFraction(productArray[i], indvar);
```
- Differentiate the current factor (the i-th fraction)
- This becomes the "primed" factor for this term

```js
        let product = diffFactor;
```
- Initialize product with the differentiated factor
- Will multiply this with all other factors

```js
        for (let j = 0; j < productArray.length; j++) {
```
- Loop through all factors again
- Will multiply with everything except the differentiated one

```js
            if (i !== j) {
```
- Skip the factor that was already differentiated
- Only multiply with the unchanged factors

```js
                product = expandFractions(product, productArray[j]);
```
- Multiply the current product by the j-th factor
- **`expandFractions`** — Expands and simplifies the product
- Accumulates: `f'[i] × f[0] × ... × f[i-1] × f[i+1] × ... × f[n]`

```js
            }
        }
```
- Close the inner loop and if statement

```js
        for (let term of product.numi.terms) {
```
- Loop through all terms in the expanded product

```js
            resultTerms.push(term);
```
- Add each term to the result array
- Collecting all terms from all product rule components

```js
        }
    }
```
- Close both loops

```js
    return simplifyFraction({ numi: { terms: resultTerms }, deno: 1 });
```
- Create a fraction with all collected terms
- **`simplifyFraction`** — Combines like terms
- Returns the final simplified derivative

```js
}
```
- Close the function

## How It Works

The function implements the **generalized product rule**:

**Two factors**: `d/dx[f·g] = f'·g + f·g'`

**Three factors**: `d/dx[f·g·h] = f'·g·h + f·g'·h + f·g·h'`

**General form**: `d/dx[f₁·f₂·...·fₙ] = Σ(f'ᵢ·∏(fⱼ where j≠i))`

**Algorithm**:
1. For each factor fᵢ:
   - Differentiate it: f'ᵢ
   - Multiply by all other unchanged factors
   - Add to the sum
2. Simplify the result

## Usage Examples

### Two Factors (Standard Product Rule)

```js
const f = createFraction([createTerm(1, { x: 2 })], 1);  // x²
const g = createFraction([createTerm(1, { x: 3 })], 1);  // x³

const product = [f, g];

const result = productRuleDifferentiate(product, 'x');

console.log(fractionToString(result));
// "(2*x*1*x^3 + 1*x^2*3*x^2)" → "(2*x^4 + 3*x^4)" → "(5*x^4)"
// Mathematical: d/dx[x²·x³] = 2x·x³ + x²·3x² = 2x⁴ + 3x⁴ = 5x⁴
```

### Two Binomials

```js
const f = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);  // x + 2

const g = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);  // x + 3

const product = [f, g];

const result = productRuleDifferentiate(product, 'x');

// d/dx[(x+2)(x+3)] = 1·(x+3) + (x+2)·1
//                  = x + 3 + x + 2
//                  = 2x + 5
```

### Three Factors

```js
const f = createFraction([createTerm(1, { x: 1 })], 1);   // x
const g = createFraction([createTerm(1, { x: 2 })], 1);   // x²
const h = createFraction([createTerm(1, { x: 3 })], 1);   // x³

const product = [f, g, h];

const result = productRuleDifferentiate(product, 'x');

// d/dx[x·x²·x³] = 1·x²·x³ + x·2x·x³ + x·x²·3x²
//                = x⁵ + 2x⁵ + 3x⁵
//                = 6x⁵
```

### Empty Product

```js
const product = [];

const result = productRuleDifferentiate(product, 'x');

console.log(fractionToString(result));
// "(0)"
// Empty product = 1, d/dx[1] = 0
```

### Single Factor

```js
const f = createFraction([
    createTerm(3, { x: 2 }),
    createTerm(2, { x: 1 })
], 1);  // 3x² + 2x

const product = [f];

const result = productRuleDifferentiate(product, 'x');

// Just differentiates the single fraction
// d/dx[3x² + 2x] = 6x + 2
```

### Product with Constants

```js
const f = createFraction([createTerm(5)], 1);            // 5
const g = createFraction([createTerm(1, { x: 2 })], 1);  // x²

const product = [f, g];

const result = productRuleDifferentiate(product, 'x');

// d/dx[5·x²] = 0·x² + 5·2x
//            = 0 + 10x
//            = 10x
```

### Multiple Variables

```js
const f = createFraction([createTerm(1, { x: 2 })], 1);  // x²
const g = createFraction([createTerm(1, { y: 2 })], 1);  // y²

const product = [f, g];

const result = productRuleDifferentiate(product, 'x');

// d/dx[x²·y²] = 2x·y² + x²·0
//             = 2xy²
// Note: y² is constant with respect to x
```

## Step-by-Step Example

Let's differentiate `(x + 1)(x + 2)` with respect to x:

```js
const f = createFraction([createTerm(1, { x: 1 }), createTerm(1)], 1);  // x + 1
const g = createFraction([createTerm(1, { x: 1 }), createTerm(2)], 1);  // x + 2

const product = [f, g];

const result = productRuleDifferentiate(product, 'x');
```

**Step by step:**

1. Check length: 2 factors → use product rule
2. Initialize `resultTerms = []`

3. **Iteration i=0** (differentiate f):
   - `diffFactor = d/dx[x + 1] = 1`
   - `product = 1`
   - Inner loop j=1: `product = 1 × (x + 2) = x + 2`
   - Add terms: `resultTerms = [x, 2]`

4. **Iteration i=1** (differentiate g):
   - `diffFactor = d/dx[x + 2] = 1`
   - `product = 1`
   - Inner loop j=0: `product = 1 × (x + 1) = x + 1`
   - Add terms: `resultTerms = [x, 2, x, 1]`

5. Simplify: Combine like terms
   - `x + 2 + x + 1 = 2x + 3`

6. Return `(2x + 3)`

**Mathematical verification**:
- `d/dx[(x + 1)(x + 2)] = 1·(x + 2) + (x + 1)·1 = x + 2 + x + 1 = 2x + 3` ✓
- Or expand first: `d/dx[x² + 3x + 2] = 2x + 3` ✓

## Product Rule Formulas

### Two Factors
```
d/dx[f·g] = f'·g + f·g'
```

### Three Factors
```
d/dx[f·g·h] = f'·g·h + f·g'·h + f·g·h'
```

### n Factors
```
d/dx[f₁·f₂·...·fₙ] = Σᵢ₌₁ⁿ (f'ᵢ · ∏ⱼ≠ᵢ fⱼ)
```

**In words**: Sum over all factors, where each term has one factor differentiated and all others unchanged.

## Complexity Analysis

For `n` factors with average `m` terms each:
- **Outer loop**: `n` iterations
- **Inner loop**: `n-1` multiplications per iteration
- **Each multiplication**: Potentially `O(m²)` term expansions
- **Total**: `O(n² · m²)` before simplification

Simplification reduces this by combining like terms.

## Why Collect All Terms Then Simplify?

```js
for (let term of product.numi.terms) {
    resultTerms.push(term);
}
```

**Strategy**: Collect all terms first, simplify once at the end.

**Alternative** (less efficient):
```js
// Don't do this - simplifies after each addition
result = simplifyFraction(addFractions(result, product));
```

**Benefits of current approach**:
- Only one simplification pass
- More efficient for many factors
- Combines all like terms together

## Edge Cases

### All Constants
```js
const product = [
    createFraction([createTerm(3)], 1),
    createFraction([createTerm(5)], 1),
    createFraction([createTerm(2)], 1)
];

productRuleDifferentiate(product, 'x');
// All derivatives are 0
// 0·5·2 + 3·0·2 + 3·5·0 = 0
```

### One Variable Factor
```js
const product = [
    createFraction([createTerm(1, { x: 2 })], 1),  // x²
    createFraction([createTerm(5)], 1),             // 5
    createFraction([createTerm(3)], 1)              // 3
];

productRuleDifferentiate(product, 'x');
// 2x·5·3 + x²·0·3 + x²·5·0 = 30x
```

## Relationship to Chain Rule

The product rule is related but distinct:
- **Product rule**: `d/dx[f·g]`
- **Chain rule**: `d/dx[f(g(x))]`

This function handles products, not compositions.

## Dependencies

This function requires:
- **`differentiateFraction`** — To differentiate each factor
- **`expandFractions`** — To multiply factors together
- **`simplifyFraction`** — To combine like terms
- **`createFraction`** — To create the zero result
- **`createTerm`** — To create the zero term

## Why Use This?

This function is useful for:

- Differentiating products of polynomials
- Applying the product rule symbolically
- Building calculus calculators
- Educational tools for teaching the product rule
- Computing derivatives of factored expressions
- Symbolic differentiation systems
- Verifying derivative calculations