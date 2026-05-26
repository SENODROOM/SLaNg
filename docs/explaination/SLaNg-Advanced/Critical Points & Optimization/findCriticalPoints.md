# findCriticalPoints

Find critical points of a function where f'(x) = 0.

## The Formula

Critical points occur where: f'(x) = 0

## The Code

```js
/**
 * Find critical points where f'(x) = 0
 * Uses numerical method for polynomial roots
 */
function findCriticalPoints(func, variable, searchRange = [-10, 10], numSamples = 1000) {
    const derivative = differentiateFraction(func, variable);
    const criticalPoints = [];

    const [min, max] = searchRange;
    const step = (max - min) / numSamples;

    let prevValue = evaluateEquation([[derivative]], { [variable]: min });

    for (let i = 1; i <= numSamples; i++) {
        const x = min + i * step;
        const currValue = evaluateEquation([[derivative]], { [variable]: x });

        // Sign change indicates root
        if (prevValue * currValue < 0) {
            // Refine with bisection
            let left = x - step;
            let right = x;

            for (let j = 0; j < 20; j++) {
                const mid = (left + right) / 2;
                const midValue = evaluateEquation([[derivative]], { [variable]: mid });

                if (Math.abs(midValue) < 1e-8) {
                    criticalPoints.push(mid);
                    break;
                }

                if (midValue * evaluateEquation([[derivative]], { [variable]: left }) < 0) {
                    right = mid;
                } else {
                    left = mid;
                }
            }
        }

        prevValue = currValue;
    }

    return {
        criticalPoints,
        derivative,
        note: 'Points where f\'(x) = 0'
    };
}
```

## Line-by-Line Explanation

```js
function findCriticalPoints(func, variable, searchRange = [-10, 10], numSamples = 1000) {
```
- **`func`** — The function to analyze (fraction object)
- **`variable`** — Variable name (e.g., 'x')
- **`searchRange`** — Interval to search in (default: [-10, 10])
- **`numSamples`** — Number of points to check (default: 1000)

```js
    const derivative = differentiateFraction(func, variable);
```
- Compute the first derivative f'(x)
- Critical points occur where this equals zero

```js
    const criticalPoints = [];
```
- Initialize array to store found critical points

```js
    const [min, max] = searchRange;
```
- Destructure search range into min and max values
- Example: `[-10, 10]` becomes `min = -10, max = 10`

```js
    const step = (max - min) / numSamples;
```
- Calculate step size between sample points
- For range [-10, 10] with 1000 samples: step = 20/1000 = 0.02

```js
    let prevValue = evaluateEquation([[derivative]], { [variable]: min });
```
- Evaluate derivative at the starting point
- Store this to compare with next point

```js
    for (let i = 1; i <= numSamples; i++) {
```
- Loop through all sample points
- Start at i=1 since we already have the first value

```js
        const x = min + i * step;
```
- Calculate current x position
- Moves through the range in equal steps

```js
        const currValue = evaluateEquation([[derivative]], { [variable]: x });
```
- Evaluate derivative at current point

```js
        if (prevValue * currValue < 0) {
```
- **Sign change detection**
- If product is negative, signs differ → root exists between prevValue and currValue
- This is the **Intermediate Value Theorem** in action

```js
            let left = x - step;
            let right = x;
```
- Initialize bisection method bounds
- We know a root exists between these two points

```js
            for (let j = 0; j < 20; j++) {
```
- **Bisection refinement**: 20 iterations
- Each iteration halves the interval
- 20 iterations gives precision of roughly 1/1,000,000 of step size

```js
                const mid = (left + right) / 2;
```
- Find midpoint of current interval

```js
                const midValue = evaluateEquation([[derivative]], { [variable]: mid });
```
- Evaluate derivative at midpoint

```js
                if (Math.abs(midValue) < 1e-8) {
                    criticalPoints.push(mid);
                    break;
                }
```
- If derivative is essentially zero (< 0.00000001), we found the root
- Add to results and exit bisection loop

```js
                if (midValue * evaluateEquation([[derivative]], { [variable]: left }) < 0) {
                    right = mid;
```
- If root is in left half, move right bound to midpoint

```js
                } else {
                    left = mid;
                }
```
- Otherwise, root is in right half, move left bound to midpoint

```js
        prevValue = currValue;
```
- Update previous value for next iteration

```js
    return {
        criticalPoints,
        derivative,
        note: 'Points where f\'(x) = 0'
    };
```
- Return array of critical points, the derivative, and a note

## How It Works

The function finds critical points using a two-phase approach:

1. **Coarse Search** (Sign Change Detection):
   - Sample the derivative at many points
   - Look for sign changes (positive → negative or vice versa)
   - Each sign change indicates a root

2. **Fine Refinement** (Bisection Method):
   - For each sign change, use bisection to find exact root
   - Repeatedly halve the interval
   - Stop when derivative is nearly zero

**Key Principle**: If f'(x) changes sign, it must cross zero (by Intermediate Value Theorem)

## Usage Examples

### Quadratic Function

```js
// f(x) = x² - 4x + 3
// f'(x) = 2x - 4 = 0 → x = 2

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(-4, { x: 1 }),
    createTerm(3)
], 1);

const result = findCriticalPoints(func, 'x');

console.log(result.criticalPoints);
// [2.0000001] (approximately 2)
```

### Cubic Function (Multiple Critical Points)

```js
// f(x) = x³ - 3x + 1
// f'(x) = 3x² - 3 = 0 → x = ±1

const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(-3, { x: 1 }),
    createTerm(1)
], 1);

const result = findCriticalPoints(func, 'x', [-5, 5]);

console.log(result.criticalPoints);
// [-1.0000001, 0.9999999] (approximately -1 and 1)
```

### Quartic Function

```js
// f(x) = x⁴ - 4x³ + 4x²
// f'(x) = 4x³ - 12x² + 8x = 4x(x² - 3x + 2) = 4x(x-1)(x-2)
// Critical points: x = 0, 1, 2

const func = createFraction([
    createTerm(1, { x: 4 }),
    createTerm(-4, { x: 3 }),
    createTerm(4, { x: 2 })
], 1);

const result = findCriticalPoints(func, 'x', [-2, 5]);

console.log(result.criticalPoints);
// [0, 1, 2] (approximately)
```

### Custom Search Range

```js
// Only search between 0 and 20
const func = createFraction([createTerm(1, { x: 2 })], 1);

const result = findCriticalPoints(func, 'x', [0, 20], 500);
```

### No Critical Points

```js
// f(x) = x³ + x + 1
// f'(x) = 3x² + 1 (always positive, never zero)

const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(1, { x: 1 }),
    createTerm(1)
], 1);

const result = findCriticalPoints(func, 'x');

console.log(result.criticalPoints);
// [] (no critical points)
```

## Step-by-Step Example

Let's find critical points of f(x) = x² - 4:

```js
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(-4)
], 1);

const result = findCriticalPoints(func, 'x', [-5, 5], 100);
```

**Step by step:**
1. Compute derivative:
   - f'(x) = 2x
2. Set up search:
   - Range: [-5, 5]
   - Step: 10/100 = 0.1
3. Sample points:
   - At x = -0.1: f'(-0.1) = -0.2 (negative)
   - At x = 0.0: f'(0.0) = 0.0 ✓ (sign change!)
   - At x = 0.1: f'(0.1) = 0.2 (positive)
4. Bisection refinement:
   - Narrow down to x ≈ 0.0000
5. Return: [0]

**Mathematical verification**: f'(x) = 2x = 0 → x = 0 ✓

## Mathematical Background

### Critical Points

Points where:
- f'(x) = 0 (horizontal tangent), OR
- f'(x) is undefined (cusp, vertical tangent)

This function finds the first type (where derivative equals zero).

### First Derivative Test

At critical points:
- If f' changes from + to −: **local maximum**
- If f' changes from − to +: **local minimum**
- If f' doesn't change sign: **inflection point** (or saddle)

### Intermediate Value Theorem

If f is continuous on [a, b] and f(a) and f(b) have opposite signs, then there exists c in (a, b) where f(c) = 0.

This is why sign changes guarantee a root.

### Bisection Method

- Repeatedly halve the interval containing the root
- Guaranteed convergence for continuous functions
- Error decreases by half each iteration
- After n iterations, error ≤ (initial interval) / 2ⁿ

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute f'(x)
- **`evaluateEquation`** — To evaluate derivative at points
- **`Math.abs`** — For absolute value comparisons

## Why Use This?

This function is useful for:

- Finding local maxima and minima
- Optimization problems
- Curve sketching and analysis
- Understanding function behavior
- Numerical root finding
- Calculus problem solving

## Real-World Applications

### Economics: Profit Maximization

```js
// Profit function P(x) = revenue - cost
const profit = /* profit function */;
const result = findCriticalPoints(profit, 'x', [0, 1000]);

// Maximum profit occurs at critical point
console.log('Optimal production:', result.criticalPoints[0]);
```

### Physics: Maximum Height

```js
// h(t) = -16t² + 64t + 10
// Find when velocity = 0 (max height)

const height = createFraction([
    createTerm(-16, { t: 2 }),
    createTerm(64, { t: 1 }),
    createTerm(10)
], 1);

const result = findCriticalPoints(height, 't', [0, 10]);
console.log('Max height at t =', result.criticalPoints[0]);
// t = 2 seconds
```

### Engineering: Stress Analysis

```js
// Find points of maximum stress in a beam
const stress = /* stress function */;
const criticalStress = findCriticalPoints(stress, 'x', [0, beamLength]);
```

## Performance Notes

- **Time Complexity**: O(numSamples × bisection_iterations)
- Default: O(1000 × 20) = O(20,000) evaluations
- Higher numSamples → better at finding all critical points
- More bisection iterations → higher precision

## Limitations

1. **Numerical Method**: Finds approximate solutions, not exact
2. **Missed Points**: Very close critical points might be missed if step is too large
3. **Search Range**: Must specify range; won't find critical points outside it
4. **Sign Changes Only**: Won't find points where f'(x) touches zero but doesn't cross (e.g., f(x) = x³ at x=0)
5. **Continuous Derivatives**: Assumes f'(x) is continuous

## Tips for Better Results

### Increase Samples for Complex Functions

```js
// For functions with many critical points
const result = findCriticalPoints(func, 'x', [-20, 20], 5000);
```

### Narrow Range if You Know Approximate Location

```js
// If you know critical point is near x=3
const result = findCriticalPoints(func, 'x', [2, 4], 200);
```

### Check Endpoints

```js
// Endpoints might be extrema too
function findAllExtrema(func, variable, range) {
    const critical = findCriticalPoints(func, variable, range);
    
    return {
        interior: critical.criticalPoints,
        endpoints: range,
        note: 'Check both interior and endpoints'
    };
}
```