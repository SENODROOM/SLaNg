# secondDerivativeTest

Classify critical points as local maxima, minima, or inflection points using the second derivative.

## The Formula

At critical point x = c:
- If f''(c) > 0: **local minimum**
- If f''(c) < 0: **local maximum**
- If f''(c) = 0: **inconclusive** (may be inflection point)

## The Code

```js
/**
 * Second derivative test for local extrema
 */
function secondDerivativeTest(func, variable, point) {
    const firstDeriv = differentiateFraction(func, variable);
    const secondDeriv = differentiateFraction(firstDeriv, variable);

    const fValue = evaluateEquation([[func]], { [variable]: point });
    const fDoublePrime = evaluateEquation([[secondDeriv]], { [variable]: point });

    let type;
    if (fDoublePrime > 0) {
        type = 'local minimum';
    } else if (fDoublePrime < 0) {
        type = 'local maximum';
    } else {
        type = 'inconclusive (may be inflection point)';
    }

    return {
        point,
        functionValue: fValue,
        secondDerivative: fDoublePrime,
        type
    };
}
```

## Line-by-Line Explanation

```js
function secondDerivativeTest(func, variable, point) {
```
- **`func`** — The function to analyze (fraction object)
- **`variable`** — Variable name (e.g., 'x')
- **`point`** — The critical point to test

```js
    const firstDeriv = differentiateFraction(func, variable);
```
- Compute first derivative f'(x)
- Not strictly needed for the test, but useful for context

```js
    const secondDeriv = differentiateFraction(firstDeriv, variable);
```
- Compute second derivative f''(x)
- This is the key to classifying the critical point

```js
    const fValue = evaluateEquation([[func]], { [variable]: point });
```
- Evaluate the original function at the critical point
- Gives us the y-coordinate: f(c)

```js
    const fDoublePrime = evaluateEquation([[secondDeriv]], { [variable]: point });
```
- Evaluate second derivative at the critical point
- This value determines the type of critical point

```js
    let type;
    if (fDoublePrime > 0) {
        type = 'local minimum';
```
- **Positive second derivative** → concave up → local minimum
- Think: ∪ shape

```js
    } else if (fDoublePrime < 0) {
        type = 'local maximum';
```
- **Negative second derivative** → concave down → local maximum
- Think: ∩ shape

```js
    } else {
        type = 'inconclusive (may be inflection point)';
    }
```
- **Zero second derivative** → test fails
- Could be inflection point, or need higher derivatives
- Example: f(x) = x⁴ at x=0 (actually a minimum, but f''(0)=0)

```js
    return {
        point,
        functionValue: fValue,
        secondDerivative: fDoublePrime,
        type
    };
```
- Return comprehensive result object with all information

## How It Works

The function uses the **Second Derivative Test**:

1. Compute f''(x) (second derivative)
2. Evaluate f''(c) at the critical point c
3. Interpret the sign:
   - f''(c) > 0 → concave up → **minimum**
   - f''(c) < 0 → concave down → **maximum**
   - f''(c) = 0 → **inconclusive**

**Geometric Intuition**:
- Concave up (∪): ball would roll away from the point → minimum
- Concave down (∩): ball would roll toward the point → maximum

## Usage Examples

### Local Minimum

```js
// f(x) = x² has minimum at x = 0
// f'(x) = 2x, f''(x) = 2
// f''(0) = 2 > 0 → minimum

const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = secondDerivativeTest(func, 'x', 0);

console.log(result);
// {
//   point: 0,
//   functionValue: 0,
//   secondDerivative: 2,
//   type: 'local minimum'
// }
```

### Local Maximum

```js
// f(x) = -x² + 4x has maximum at x = 2
// f'(x) = -2x + 4, f''(x) = -2
// f''(2) = -2 < 0 → maximum

const func = createFraction([
    createTerm(-1, { x: 2 }),
    createTerm(4, { x: 1 })
], 1);

const result = secondDerivativeTest(func, 'x', 2);

console.log(result);
// {
//   point: 2,
//   functionValue: 4,
//   secondDerivative: -2,
//   type: 'local maximum'
// }
```

### Cubic Function (Two Critical Points)

```js
// f(x) = x³ - 3x
// Critical points at x = -1, 1

const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(-3, { x: 1 })
], 1);

// Test at x = -1
const result1 = secondDerivativeTest(func, 'x', -1);
console.log(result1);
// {
//   point: -1,
//   functionValue: 2,
//   secondDerivative: -6,
//   type: 'local maximum'
// }

// Test at x = 1
const result2 = secondDerivativeTest(func, 'x', 1);
console.log(result2);
// {
//   point: 1,
//   functionValue: -2,
//   secondDerivative: 6,
//   type: 'local minimum'
// }
```

### Inconclusive Case

```js
// f(x) = x³ at x = 0
// f''(0) = 0 (inconclusive, actually inflection point)

const func = createFraction([createTerm(1, { x: 3 })], 1);
const result = secondDerivativeTest(func, 'x', 0);

console.log(result);
// {
//   point: 0,
//   functionValue: 0,
//   secondDerivative: 0,
//   type: 'inconclusive (may be inflection point)'
// }
```

### Quartic Function

```js
// f(x) = x⁴ - 4x² at x = 0 (local max)

const func = createFraction([
    createTerm(1, { x: 4 }),
    createTerm(-4, { x: 2 })
], 1);

const result = secondDerivativeTest(func, 'x', 0);

console.log(result);
// {
//   point: 0,
//   functionValue: 0,
//   secondDerivative: -8,
//   type: 'local maximum'
// }
```

## Step-by-Step Example

Let's test f(x) = 2x² - 8x + 10 at x = 2:

```js
const func = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(-8, { x: 1 }),
    createTerm(10)
], 1);

const result = secondDerivativeTest(func, 'x', 2);
```

**Step by step:**
1. Compute first derivative:
   - f'(x) = 4x - 8
2. Compute second derivative:
   - f''(x) = 4
3. Evaluate f(2):
   - f(2) = 2(4) - 8(2) + 10 = 8 - 16 + 10 = 2
4. Evaluate f''(2):
   - f''(2) = 4
5. Check sign:
   - f''(2) = 4 > 0
6. Conclusion:
   - type: 'local minimum'

**Result**:
```js
{
  point: 2,
  functionValue: 2,
  secondDerivative: 4,
  type: 'local minimum'
}
```

**Mathematical verification**: Vertex form: 2(x-2)² + 2, minimum at (2, 2) ✓

## Mathematical Background

### Concavity

The second derivative measures concavity:
- **f''(x) > 0**: Function is concave up (∪)
  - Graph curves upward
  - Tangent lines lie below the curve
- **f''(x) < 0**: Function is concave down (∩)
  - Graph curves downward
  - Tangent lines lie above the curve

### Second Derivative Test Theorem

If f'(c) = 0 and f''(c) exists:
1. If f''(c) > 0, then f has a local minimum at c
2. If f''(c) < 0, then f has a local maximum at c
3. If f''(c) = 0, the test is inconclusive

### Why It Works

At a critical point (where f'(c) = 0):
- If f'' > 0: derivative is increasing
  - f' goes from negative to positive
  - Function goes from decreasing to increasing → minimum
- If f'' < 0: derivative is decreasing
  - f' goes from positive to negative
  - Function goes from increasing to decreasing → maximum

### When the Test Fails

The test is inconclusive when f''(c) = 0. Examples:
- f(x) = x³ at x=0: inflection point, not extremum
- f(x) = x⁴ at x=0: minimum (need 4th derivative to confirm)
- f(x) = -x⁴ at x=0: maximum

Use the **First Derivative Test** instead in these cases.

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute f'(x) and f''(x)
- **`evaluateEquation`** — To evaluate derivatives at the point

## Why Use This?

This function is useful for:

- Classifying critical points
- Optimization problems
- Curve sketching
- Understanding function behavior
- Calculus problem solving
- Finding global extrema (check all critical points)

## Real-World Applications

### Business: Profit Optimization

```js
// Profit function P(x)
// Find if critical point is max or min profit

const profit = createFraction([
    createTerm(-2, { x: 2 }),
    createTerm(100, { x: 1 }),
    createTerm(-500)
], 1);

const criticalPoint = 25; // Found by setting P'(x) = 0

const result = secondDerivativeTest(profit, 'x', criticalPoint);

if (result.type === 'local maximum') {
    console.log('Maximum profit of $', result.functionValue);
    console.log('Produce', criticalPoint, 'units');
}
```

### Physics: Projectile Motion

```js
// Height h(t) = -16t² + 64t + 10
// Find if vertex is max or min height

const height = createFraction([
    createTerm(-16, { t: 2 }),
    createTerm(64, { t: 1 }),
    createTerm(10)
], 1);

const result = secondDerivativeTest(height, 't', 2);

console.log('Maximum height:', result.functionValue, 'feet');
// type: 'local maximum' (as expected for projectile)
```

### Engineering: Beam Deflection

```js
// Deflection function d(x)
// Find points of maximum deflection

const deflection = /* beam deflection function */;
const midpoint = beamLength / 2;

const result = secondDerivativeTest(deflection, 'x', midpoint);

if (result.type === 'local maximum') {
    console.log('Max deflection:', result.functionValue);
}
```

## Complete Workflow Example

```js
// Complete analysis: find and classify all critical points

function analyzeFunction(func, variable, range) {
    // Step 1: Find critical points
    const { criticalPoints } = findCriticalPoints(func, variable, range);
    
    // Step 2: Classify each critical point
    const analysis = criticalPoints.map(point => 
        secondDerivativeTest(func, variable, point)
    );
    
    // Step 3: Separate by type
    const maxima = analysis.filter(r => r.type === 'local maximum');
    const minima = analysis.filter(r => r.type === 'local minimum');
    const inconclusive = analysis.filter(r => r.type.includes('inconclusive'));
    
    return { maxima, minima, inconclusive };
}

// Usage
const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(-3, { x: 1 })
], 1);

const result = analyzeFunction(func, 'x', [-5, 5]);

console.log('Local maxima:', result.maxima);
console.log('Local minima:', result.minima);
```

## Alternative: First Derivative Test

When second derivative test is inconclusive:

```js
function firstDerivativeTest(func, variable, point, epsilon = 0.01) {
    const deriv = differentiateFraction(func, variable);
    
    const leftSlope = evaluateEquation([[deriv]], { [variable]: point - epsilon });
    const rightSlope = evaluateEquation([[deriv]], { [variable]: point + epsilon });
    
    if (leftSlope < 0 && rightSlope > 0) {
        return 'local minimum';
    } else if (leftSlope > 0 && rightSlope < 0) {
        return 'local maximum';
    } else {
        return 'inflection point or saddle point';
    }
}
```

## Comparison with First Derivative Test

| Aspect | Second Derivative Test | First Derivative Test |
|--------|----------------------|---------------------|
| **What to check** | Sign of f''(c) | Sign change in f'(x) |
| **Advantages** | Quick, single evaluation | Always conclusive |
| **Disadvantages** | Can be inconclusive | Requires checking intervals |
| **Best for** | Simple cases | When f''(c) = 0 |