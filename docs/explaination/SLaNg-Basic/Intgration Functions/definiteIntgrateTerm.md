# definiteIntegrateTerm

Evaluate the definite integral of a term between two bounds using the Fundamental Theorem of Calculus.

## The Code

```js
/**
 * Definite integration of a term
 * Evaluates ∫[lower to upper] term dx
 */
function definiteIntegrateTerm(term, lower, upper, indvar) {
    const integratedTerm = integrateTerm(term, indvar);

    // Get power of integration variable in the integrated term
    const intPower = integratedTerm.var?.[indvar] ?? 0;

    // Calculate the coefficient multiplier from bounds
    const upperValue = Math.pow(upper, intPower);
    const lowerValue = Math.pow(lower, intPower);
    const boundsDiff = upperValue - lowerValue;

    // Create result term
    const resultTerm = deepClone(integratedTerm);
    resultTerm.coeff = resultTerm.coeff * boundsDiff;

    // Remove the integration variable
    if (resultTerm.var) {
        delete resultTerm.var[indvar];
        if (Object.keys(resultTerm.var).length === 0) {
            delete resultTerm.var;
        }
    }

    return resultTerm;
}
```

## Line-by-Line Explanation

```js
function definiteIntegrateTerm(term, lower, upper, indvar) {
```
- **`term`** — The term to integrate
- **`lower`** — Lower bound of integration
- **`upper`** — Upper bound of integration
- **`indvar`** — The integration variable

```js
    const integratedTerm = integrateTerm(term, indvar);
```
- First, find the antiderivative using `integrateTerm`
- This applies the power rule: `∫ c·x^n dx = c/(n+1) · x^(n+1)`

```js
    const intPower = integratedTerm.var?.[indvar] ?? 0;
```
- Get the power of the integration variable in the antiderivative
- **`??`** — If the variable doesn't exist, use 0
- This power is needed to evaluate the bounds

```js
    const upperValue = Math.pow(upper, intPower);
```
- Evaluate the integration variable at the upper bound
- Example: If power is 3 and upper is 2, then `upperValue = 2³ = 8`

```js
    const lowerValue = Math.pow(lower, intPower);
```
- Evaluate the integration variable at the lower bound
- Example: If power is 3 and lower is 1, then `lowerValue = 1³ = 1`

```js
    const boundsDiff = upperValue - lowerValue;
```
- Calculate the difference: `F(upper) - F(lower)`
- This is the core of the Fundamental Theorem of Calculus
- Example: `8 - 1 = 7`

```js
    const resultTerm = deepClone(integratedTerm);
```
- Clone the integrated term to create the result
- Ensures we don't modify the intermediate calculation

```js
    resultTerm.coeff = resultTerm.coeff * boundsDiff;
```
- Multiply the coefficient by the bounds difference
- This gives us the final numerical value
- Example: If coeff was `1/3`, then `(1/3) × 7 = 7/3`

```js
    if (resultTerm.var) {
```
- Check if there are variables in the result term

```js
        delete resultTerm.var[indvar];
```
- Remove the integration variable from the result
- After definite integration, this variable is "consumed"
- Example: After integrating with respect to `x`, remove `x` from variables

```js
        if (Object.keys(resultTerm.var).length === 0) {
```
- Check if there are any variables left

```js
            delete resultTerm.var;
```
- If no variables remain, remove the entire `var` object
- Leaves us with just a numerical coefficient

```js
        }
    }
```
- Close the if statements

```js
    return resultTerm;
```
- Return the final result term

```js
}
```
- Close the function

## How It Works

The function applies the **Fundamental Theorem of Calculus**:

**∫[a to b] f(x) dx = F(b) - F(a)**

Where `F(x)` is the antiderivative of `f(x)`.

Steps:
1. Find the antiderivative using the power rule
2. Evaluate the antiderivative at the upper bound
3. Evaluate the antiderivative at the lower bound
4. Subtract: upper - lower
5. Multiply the coefficient by this difference
6. Remove the integration variable from the result

## Usage Examples

### Integrate a Constant

```js
const term = createTerm(5);
const result = definiteIntegrateTerm(term, 0, 3, 'x');

console.log(result);
// { coeff: 15 }
// Mathematical: ∫[0 to 3] 5 dx = 5x |[0 to 3] = 5(3) - 5(0) = 15
```

### Integrate x

```js
const term = createTerm(1, { x: 1 });
const result = definiteIntegrateTerm(term, 0, 2, 'x');

console.log(result);
// { coeff: 2 }
// Mathematical: ∫[0 to 2] x dx = x²/2 |[0 to 2] = 4/2 - 0 = 2
```

### Integrate x²

```js
const term = createTerm(1, { x: 2 });
const result = definiteIntegrateTerm(term, 1, 3, 'x');

console.log(result);
// { coeff: 8.666... }
// Mathematical: ∫[1 to 3] x² dx = x³/3 |[1 to 3] = 27/3 - 1/3 = 26/3 ≈ 8.67
```

### Integrate with Coefficient

```js
const term = createTerm(3, { x: 2 });
const result = definiteIntegrateTerm(term, 0, 2, 'x');

console.log(result);
// { coeff: 8 }
// Mathematical: ∫[0 to 2] 3x² dx = x³ |[0 to 2] = 8 - 0 = 8
```

### Integrate with Multiple Variables

```js
const term = createTerm(6, { x: 2, y: 1 });
const result = definiteIntegrateTerm(term, 1, 2, 'x');

console.log(result);
// { coeff: 14, var: { y: 1 } }
// Mathematical: ∫[1 to 2] 6x²y dx = 2x³y |[1 to 2] = 2(8)y - 2(1)y = 14y
```

### Negative Bounds

```js
const term = createTerm(2, { x: 1 });
const result = definiteIntegrateTerm(term, -1, 1, 'x');

console.log(result);
// { coeff: 0 }
// Mathematical: ∫[-1 to 1] 2x dx = x² |[-1 to 1] = 1 - 1 = 0
```

### Integrate Over Zero Width

```js
const term = createTerm(5, { x: 1 });
const result = definiteIntegrateTerm(term, 2, 2, 'x');

console.log(result);
// { coeff: 0 }
// Mathematical: ∫[2 to 2] 5x dx = 0 (same upper and lower bound)
```

## Step-by-Step Example

Let's integrate `3x²` from 1 to 3:

```js
const term = createTerm(3, { x: 2 });
const result = definiteIntegrateTerm(term, 1, 3, 'x');
```

**Step by step:**
1. Find antiderivative:
   - `integrateTerm` returns `{ coeff: 1, var: { x: 3 } }` (x³)
2. Get power: `intPower = 3`
3. Evaluate upper bound:
   - `upperValue = 3³ = 27`
4. Evaluate lower bound:
   - `lowerValue = 1³ = 1`
5. Calculate difference:
   - `boundsDiff = 27 - 1 = 26`
6. Multiply coefficient:
   - `resultTerm.coeff = 1 × 26 = 26`
7. Remove integration variable `x`
8. Return `{ coeff: 26 }`

**Mathematical verification**: `∫[1 to 3] 3x² dx = x³ |[1 to 3] = 27 - 1 = 26` ✓

## Integration Table

| Term | Bounds [a, b] | Result | Mathematical |
|------|--------------|--------|-------------|
| `5` | `[0, 3]` | `15` | `∫[0,3] 5 dx = 15` |
| `x` | `[0, 2]` | `2` | `∫[0,2] x dx = 2` |
| `x²` | `[0, 2]` | `8/3` | `∫[0,2] x² dx = 8/3` |
| `3x²` | `[0, 2]` | `8` | `∫[0,2] 3x² dx = 8` |
| `2x` | `[-1, 1]` | `0` | `∫[-1,1] 2x dx = 0` |

## Fundamental Theorem of Calculus

This function implements:

**∫[a to b] f(x) dx = F(b) - F(a)**

Where:
- `f(x)` is the original function (the term)
- `F(x)` is the antiderivative
- `a` is the lower bound
- `b` is the upper bound

## Key Differences from Indefinite Integration

| Indefinite | Definite |
|-----------|---------|
| Returns a function | Returns a number |
| Includes `+ C` | No constant needed |
| Has integration variable | Variable is "consumed" |
| `∫ x dx = x²/2 + C` | `∫[0,2] x dx = 2` |

## Dependencies

This function requires:
- **`integrateTerm`** — To find the antiderivative
- **`deepClone`** — To create independent copies of terms

## Why Use This?

This function is useful for:

- Calculating areas under curves
- Finding exact values of definite integrals
- Building calculus calculators
- Evaluating accumulated quantities
- Physics applications (work, displacement, etc.)
- Computing probabilities in statistics
- Engineering calculations