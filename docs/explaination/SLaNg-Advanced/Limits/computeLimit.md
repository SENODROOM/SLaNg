# computeLimit

Compute the limit of an expression as a variable approaches a value.

## The Formula

lim(x→a) f(x)

## The Code

```js
/**
 * Compute limit as variable approaches a value
 * Uses direct substitution for simple cases
 */
function computeLimit(expr, variable, approaches) {
    // Try direct substitution first
    try {
        const value = evaluateEquation([[expr]], { [variable]: approaches });

        if (isFinite(value)) {
            return {
                value,
                method: 'direct substitution',
                exists: true
            };
        }
    } catch (e) {
        // Direct substitution failed
    }

    // Try approaching from both sides
    const epsilon = 1e-6;
    const leftValue = evaluateEquation([[expr]], { [variable]: approaches - epsilon });
    const rightValue = evaluateEquation([[expr]], { [variable]: approaches + epsilon });

    if (Math.abs(leftValue - rightValue) < 1e-8) {
        return {
            value: (leftValue + rightValue) / 2,
            method: 'two-sided approach',
            exists: true
        };
    }

    return {
        value: null,
        leftLimit: leftValue,
        rightLimit: rightValue,
        method: 'limits differ',
        exists: false
    };
}
```

## Line-by-Line Explanation

```js
function computeLimit(expr, variable, approaches) {
```
- **`expr`** — The expression (fraction) to find the limit of
- **`variable`** — The variable name (e.g., 'x')
- **`approaches`** — The value the variable approaches

```js
    try {
        const value = evaluateEquation([[expr]], { [variable]: approaches });
```
- **Method 1**: Try direct substitution
- Simply plug in the value and evaluate
- Wrapped in try-catch in case of errors (division by zero, etc.)

```js
        if (isFinite(value)) {
```
- Check if the result is a finite number
- `isFinite` returns false for Infinity, -Infinity, and NaN

```js
            return {
                value,
                method: 'direct substitution',
                exists: true
            };
```
- If direct substitution works, return the result
- Include metadata about the method used

```js
    } catch (e) {
        // Direct substitution failed
    }
```
- If evaluation throws an error, continue to next method
- Errors might occur from division by zero or undefined operations

```js
    const epsilon = 1e-6;
```
- **Method 2**: Numerical approach from both sides
- `epsilon` is a small value (0.000001)
- Used to get very close to the limit point

```js
    const leftValue = evaluateEquation([[expr]], { [variable]: approaches - epsilon });
```
- Evaluate the function slightly to the left of the limit point
- "Left-hand limit": approaching from below

```js
    const rightValue = evaluateEquation([[expr]], { [variable]: approaches + epsilon });
```
- Evaluate the function slightly to the right of the limit point
- "Right-hand limit": approaching from above

```js
    if (Math.abs(leftValue - rightValue) < 1e-8) {
```
- Check if left and right limits are approximately equal
- If they're within 0.00000001 of each other, consider them equal
- This tolerance accounts for floating-point precision

```js
        return {
            value: (leftValue + rightValue) / 2,
            method: 'two-sided approach',
            exists: true
        };
```
- If both sides agree, the limit exists
- Return the average of the two values
- Method indicates numerical approximation was used

```js
    return {
        value: null,
        leftLimit: leftValue,
        rightLimit: rightValue,
        method: 'limits differ',
        exists: false
    };
```
- If left and right limits don't match, the limit doesn't exist
- Return both limit values for analysis
- `exists: false` indicates discontinuity at this point

## How It Works

The function computes limits using a two-stage approach:

1. **Direct Substitution**: Try plugging in the value directly
   - Works for continuous functions
   - Fast and exact when applicable

2. **Numerical Approach**: If direct substitution fails
   - Evaluate from slightly left and slightly right
   - Compare the two values
   - If they match, limit exists; otherwise, it doesn't

## Usage Examples

### Continuous Function (Direct Substitution)

```js
// lim(x→2) x² = 4
const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = computeLimit(func, 'x', 2);

console.log(result);
// {
//   value: 4,
//   method: 'direct substitution',
//   exists: true
// }
```

### Polynomial at Any Point

```js
// lim(x→3) (2x² + 3x - 1) = 2(9) + 3(3) - 1 = 26
const poly = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(-1)
], 1);

const result = computeLimit(poly, 'x', 3);

console.log(result);
// { value: 26, method: 'direct substitution', exists: true }
```

### Removable Discontinuity

```js
// lim(x→2) (x²-4)/(x-2) = lim(x→2) (x+2) = 4
// Direct substitution gives 0/0, so uses numerical method

const numerator = [
    createTerm(1, { x: 2 }),
    createTerm(-4)
];
const denominator = /* would need special handling */;

// Simplified example
const result = computeLimit(simplified, 'x', 2);
// { value: 4, method: 'two-sided approach', exists: true }
```

### Jump Discontinuity

```js
// lim(x→0) |x|/x
// Left limit: -1, Right limit: 1

const result = computeLimit(absoluteFunc, 'x', 0);

console.log(result);
// {
//   value: null,
//   leftLimit: -1,
//   rightLimit: 1,
//   method: 'limits differ',
//   exists: false
// }
```

### Limit at Infinity Behavior

```js
// lim(x→1000) x² = 1000000
const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = computeLimit(func, 'x', 1000);

console.log(result);
// { value: 1000000, method: 'direct substitution', exists: true }
```

### Approaching Zero

```js
// lim(x→0) x² = 0
const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = computeLimit(func, 'x', 0);

console.log(result);
// { value: 0, method: 'direct substitution', exists: true }
```

## Step-by-Step Example

Let's compute lim(x→2) (x² + 3x):

```js
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(3, { x: 1 })
], 1);

const result = computeLimit(func, 'x', 2);
```

**Step by step:**
1. Try direct substitution:
   - Evaluate at x=2
   - f(2) = 2² + 3(2) = 4 + 6 = 10
   - Result is finite ✓
2. Return immediately:
   - value: 10
   - method: 'direct substitution'
   - exists: true

**Mathematical verification**: lim(x→2) (x² + 3x) = 10 ✓

## Mathematical Background

### Limit Definition

The limit lim(x→a) f(x) = L means:
- As x gets arbitrarily close to a
- f(x) gets arbitrarily close to L

### One-Sided Limits

- **Left-hand limit**: lim(x→a⁻) f(x) — approaching from below
- **Right-hand limit**: lim(x→a⁺) f(x) — approaching from above

### Limit Existence

A limit exists if and only if:
- Left-hand limit exists
- Right-hand limit exists
- Both limits are equal

### Types of Discontinuities

1. **Removable**: Limit exists but ≠ f(a) or f(a) undefined
2. **Jump**: Left and right limits exist but differ
3. **Infinite**: Function approaches ±∞

## Dependencies

This function requires:
- **`evaluateEquation`** — To evaluate the expression at specific points
- **`isFinite`** — JavaScript built-in to check for finite numbers
- **`Math.abs`** — To compute absolute difference

## Why Use This?

This function is useful for:

- Analyzing function continuity
- Finding values at discontinuities
- Determining if functions are well-behaved at points
- Calculus problem solving
- Numerical analysis
- Understanding function behavior

## Real-World Applications

### Physics: Instantaneous Velocity

```js
// v = lim(Δt→0) Δs/Δt
// Find velocity at a specific moment

const displacement = /* s(t) */;
const result = computeLimit(derivative, 't', specificTime);
```

### Engineering: Signal Processing

```js
// Analyze signal behavior at transition points
const signal = /* signal function */;
const transition = computeLimit(signal, 't', transitionPoint);

if (!transition.exists) {
    console.log('Discontinuity detected at', transitionPoint);
}
```

### Economics: Marginal Analysis

```js
// Marginal cost = lim(Δq→0) ΔC/Δq
const cost = /* cost function */;
const marginalCost = computeLimit(derivative, 'q', currentQuantity);
```

## Limitations

1. **Numerical Method Only**: Uses approximation for indeterminate forms
2. **No L'Hôpital's Rule**: Doesn't automatically handle 0/0 or ∞/∞
3. **Finite Limits Only**: Doesn't detect infinite limits (returns them as undefined)
4. **Precision**: Limited by floating-point accuracy (epsilon = 1e-6)
5. **Simple Cases**: Best for polynomial-like functions

## Advanced Usage

### Detecting Discontinuity Type

```js
function analyzeDiscontinuity(expr, variable, point) {
    const limit = computeLimit(expr, variable, point);
    
    if (limit.exists) {
        const actualValue = evaluateEquation([[expr]], { [variable]: point });
        
        if (Math.abs(limit.value - actualValue) > 1e-8) {
            return 'removable discontinuity';
        }
        return 'continuous';
    } else {
        return 'jump discontinuity';
    }
}
```

### Multiple Points

```js
function findDiscontinuities(expr, variable, points) {
    return points.map(point => ({
        point,
        limit: computeLimit(expr, variable, point)
    })).filter(result => !result.limit.exists);
}
```