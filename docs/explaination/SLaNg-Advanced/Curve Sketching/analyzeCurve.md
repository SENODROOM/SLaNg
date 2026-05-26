# analyzeCurve

Comprehensive analysis of a function for curve sketching, including critical points, extrema, and inflection points.

## The Purpose

Performs complete calculus analysis needed to sketch a curve accurately.

## The Code

```js
/**
 * Analyze function for curve sketching
 */
function analyzeCurve(func, variable, range = [-10, 10]) {
    const firstDeriv = differentiateFraction(func, variable);
    const secondDeriv = differentiateFraction(firstDeriv, variable);

    // Find critical points
    const { criticalPoints } = findCriticalPoints(func, variable, range);

    // Test each critical point
    const extrema = criticalPoints.map(pt =>
        secondDerivativeTest(func, variable, pt)
    );

    // Find inflection points (where f'' = 0)
    const { criticalPoints: inflectionPoints } = findCriticalPoints(firstDeriv, variable, range);

    return {
        criticalPoints,
        extrema,
        inflectionPoints,
        firstDerivative: firstDeriv,
        secondDerivative: secondDeriv
    };
}
```

## Line-by-Line Explanation

```js
function analyzeCurve(func, variable, range = [-10, 10]) {
```
- **`func`** — Function to analyze (fraction object)
- **`variable`** — Variable name (e.g., 'x')
- **`range`** — Search interval (default: [-10, 10])

```js
    const firstDeriv = differentiateFraction(func, variable);
```
- Compute f'(x)
- Tells us where function is increasing/decreasing
- Critical points occur where f'(x) = 0

```js
    const secondDeriv = differentiateFraction(firstDeriv, variable);
```
- Compute f''(x)
- Tells us where function is concave up/down
- Inflection points occur where f''(x) = 0

```js
    const { criticalPoints } = findCriticalPoints(func, variable, range);
```
- Find all points where f'(x) = 0
- These are candidates for local maxima/minima

```js
    const extrema = criticalPoints.map(pt =>
        secondDerivativeTest(func, variable, pt)
    );
```
- Classify each critical point using second derivative test
- Determines if each is a max, min, or inconclusive

```js
    const { criticalPoints: inflectionPoints } = findCriticalPoints(firstDeriv, variable, range);
```
- Find where f''(x) = 0
- Critical points of f'(x) are inflection points of f(x)
- Inflection points are where concavity changes

```js
    return {
        criticalPoints,
        extrema,
        inflectionPoints,
        firstDerivative: firstDeriv,
        secondDerivative: secondDeriv
    };
```
- Return comprehensive analysis object

## How It Works

The function performs a complete curve analysis:

1. **Compute Derivatives**:
   - f'(x) for slope analysis
   - f''(x) for concavity analysis

2. **Find Critical Points**:
   - Where f'(x) = 0
   - Potential maxima/minima

3. **Classify Extrema**:
   - Use second derivative test
   - Identify local max/min

4. **Find Inflection Points**:
   - Where f''(x) = 0
   - Concavity changes

5. **Return Complete Picture**:
   - All information needed for sketching

## Usage Examples

### Quadratic Function

```js
// f(x) = x² - 4x + 3
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(-4, { x: 1 }),
    createTerm(3)
], 1);

const analysis = analyzeCurve(func, 'x', [-5, 5]);

console.log(analysis);
// {
//   criticalPoints: [2],
//   extrema: [{
//     point: 2,
//     functionValue: -1,
//     secondDerivative: 2,
//     type: 'local minimum'
//   }],
//   inflectionPoints: [], // No inflection points (f'' = 2, constant)
//   firstDerivative: { /* 2x - 4 */ },
//   secondDerivative: { /* 2 */ }
// }
```

### Cubic Function

```js
// f(x) = x³ - 3x² + 2
const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(-3, { x: 2 }),
    createTerm(2)
], 1);

const analysis = analyzeCurve(func, 'x', [-5, 5]);

console.log(analysis);
// {
//   criticalPoints: [0, 2],
//   extrema: [
//     { point: 0, functionValue: 2, type: 'local maximum' },
//     { point: 2, functionValue: -2, type: 'local minimum' }
//   ],
//   inflectionPoints: [1], // f''(x) = 6x - 6 = 0 at x=1
//   ...
// }
```

### Quartic Function

```js
// f(x) = x⁴ - 4x³ + 6x²
const func = createFraction([
    createTerm(1, { x: 4 }),
    createTerm(-4, { x: 3 }),
    createTerm(6, { x: 2 })
], 1);

const analysis = analyzeCurve(func, 'x', [-2, 5]);

console.log(analysis);
// {
//   criticalPoints: [0, 1, 2],
//   extrema: [
//     { point: 0, type: 'local maximum' },
//     { point: 1, type: 'inconclusive (may be inflection point)' },
//     { point: 2, type: 'local minimum' }
//   ],
//   inflectionPoints: [...],
//   ...
// }
```

### Sine-Like Polynomial (Multiple Extrema)

```js
// f(x) = x⁵ - 5x³ + 4x
// Has multiple critical and inflection points

const func = createFraction([
    createTerm(1, { x: 5 }),
    createTerm(-5, { x: 3 }),
    createTerm(4, { x: 1 })
], 1);

const analysis = analyzeCurve(func, 'x', [-3, 3]);

console.log('Critical points:', analysis.criticalPoints);
console.log('Inflection points:', analysis.inflectionPoints);
```

### Simple Linear Function

```js
// f(x) = 2x + 3
// No critical or inflection points

const func = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3)
], 1);

const analysis = analyzeCurve(func, 'x');

console.log(analysis);
// {
//   criticalPoints: [],
//   extrema: [],
//   inflectionPoints: [],
//   ...
// }
```

## Step-by-Step Example

Let's analyze f(x) = -x³ + 3x² - 2:

```js
const func = createFraction([
    createTerm(-1, { x: 3 }),
    createTerm(3, { x: 2 }),
    createTerm(-2)
], 1);

const analysis = analyzeCurve(func, 'x', [-5, 5]);
```

**Step by step:**

1. **Compute first derivative**:
   - f'(x) = -3x² + 6x

2. **Compute second derivative**:
   - f''(x) = -6x + 6

3. **Find critical points** (where f'(x) = 0):
   - -3x² + 6x = 0
   - -3x(x - 2) = 0
   - x = 0 or x = 2

4. **Classify extrema**:
   - At x = 0:
     - f(0) = -2
     - f''(0) = 6 > 0 → local minimum
   - At x = 2:
     - f(2) = -8 + 12 - 2 = 2
     - f''(2) = -6 < 0 → local maximum

5. **Find inflection points** (where f''(x) = 0):
   - -6x + 6 = 0
   - x = 1

**Result**:
```js
{
  criticalPoints: [0, 2],
  extrema: [
    { point: 0, functionValue: -2, type: 'local minimum' },
    { point: 2, functionValue: 2, type: 'local maximum' }
  ],
  inflectionPoints: [1],
  firstDerivative: { /* -3x² + 6x */ },
  secondDerivative: { /* -6x + 6 */ }
}
```

## Interpreting the Results

### Critical Points
- Where the slope is zero (horizontal tangent)
- Potential locations of peaks and valleys

### Extrema
- **Local maximum**: Highest point in a neighborhood
- **Local minimum**: Lowest point in a neighborhood
- **Inconclusive**: Need further testing (first derivative test)

### Inflection Points
- Where concavity changes
- From ∪ to ∩ or vice versa
- Visual "bend" in the curve

### Using the Information for Sketching

1. **Plot critical points and inflection points**
2. **Mark regions**:
   - f' > 0: function increasing
   - f' < 0: function decreasing
   - f'' > 0: concave up (∪)
   - f'' < 0: concave down (∩)
3. **Draw smooth curve** through all points

## Mathematical Background

### Complete Curve Analysis Steps

1. **Domain**: Where is f(x) defined?
2. **Intercepts**: x-intercepts (f(x)=0) and y-intercept (f(0))
3. **Symmetry**: Even, odd, or neither?
4. **Asymptotes**: Vertical, horizontal, or oblique?
5. **First Derivative**: Increasing/decreasing intervals, critical points
6. **Second Derivative**: Concavity, inflection points
7. **Extrema**: Local and global max/min

This function handles steps 5-6 automatically.

### Curve Sketching Checklist

✓ Critical points (from f' = 0)  
✓ Extrema classification (from f'')  
✓ Inflection points (from f'' = 0)  
✓ First derivative (for intervals)  
✓ Second derivative (for concavity)  

### Sign Analysis

After finding critical and inflection points:

**First Derivative Sign Chart**:
```
        0       2
f': + + + | - - - | + + +
        max     min
```

**Second Derivative Sign Chart**:
```
        1
f'': + + + | - - -
    ∪ concave up | concave down ∩
```

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute f' and f''
- **`findCriticalPoints`** — To find where derivatives equal zero
- **`secondDerivativeTest`** — To classify critical points

## Why Use This?

This function is useful for:

- **Complete curve sketching**
- **Understanding function behavior**
- **Optimization problems** (finding all extrema)
- **Calculus homework/exams**
- **Engineering analysis**
- **Mathematical modeling**

## Real-World Applications

### Economics: Cost Analysis

```js
// Total cost function C(x)
const cost = createFraction([
    createTerm(0.01, { x: 3 }),
    createTerm(-0.6, { x: 2 }),
    createTerm(13, { x: 1 }),
    createTerm(50)
], 1);

const analysis = analyzeCurve(cost, 'x', [0, 100]);

// Find minimum average cost
console.log('Inflection point (optimal scale):', analysis.inflectionPoints[0]);
```

### Physics: Motion Analysis

```js
// Position function s(t) = -16t² + 64t + 10

const position = createFraction([
    createTerm(-16, { t: 2 }),
    createTerm(64, { t: 1 }),
    createTerm(10)
], 1);

const analysis = analyzeCurve(position, 't', [0, 5]);

const maxHeightPoint = analysis.extrema.find(e => e.type === 'local maximum');

console.log('Maximum height:', maxHeightPoint.functionValue);
console.log('At time:', maxHeightPoint.point);
```

### Engineering: Beam Deflection

```js
// Deflection curve y(x)
const deflection = /* beam equation */;

const analysis = analyzeCurve(deflection, 'x', [0, beamLength]);

console.log('Maximum deflection:', 
    Math.max(...analysis.extrema.map(e => Math.abs(e.functionValue)))
);

console.log('Inflection points (change in curvature):', 
    analysis.inflectionPoints
);
```

## Advanced Usage

### Complete Curve Report

```js
function generateCurveReport(func, variable, range) {
    const analysis = analyzeCurve(func, variable, range);
    
    console.log('=== CURVE ANALYSIS ===\n');
    
    console.log('Critical Points:', analysis.criticalPoints);
    
    console.log('\nLocal Extrema:');
    analysis.extrema.forEach(e => {
        console.log(`  ${e.type} at x=${e.point}, f(x)=${e.functionValue}`);
    });
    
    console.log('\nInflection Points:', analysis.inflectionPoints);
    
    console.log('\nFirst Derivative:', 'f\'(x) = [computed]');
    console.log('Second Derivative:', 'f\'\'(x) = [computed]');
    
    return analysis;
}
```

### Finding Global Extrema

```js
function findGlobalExtrema(func, variable, range) {
    const analysis = analyzeCurve(func, variable, range);
    
    // Evaluate at critical points and endpoints
    const candidates = [
        ...analysis.extrema,
        { point: range[0], functionValue: evaluateEquation([[func]], { [variable]: range[0] }) },
        { point: range[1], functionValue: evaluateEquation([[func]], { [variable]: range[1] }) }
    ];
    
    const globalMax = candidates.reduce((max, curr) => 
        curr.functionValue > max.functionValue ? curr : max
    );
    
    const globalMin = candidates.reduce((min, curr) => 
        curr.functionValue < min.functionValue ? curr : min
    );
    
    return { globalMax, globalMin };
}
```

### Monotonicity Intervals

```js
function findMonotonicityIntervals(func, variable, range) {
    const analysis = analyzeCurve(func, variable, range);
    const critical = [range[0], ...analysis.criticalPoints, range[1]];
    
    const intervals = [];
    for (let i = 0; i < critical.length - 1; i++) {
        const mid = (critical[i] + critical[i + 1]) / 2;
        const deriv = differentiateFraction(func, variable);
        const slope = evaluateEquation([[deriv]], { [variable]: mid });
        
        intervals.push({
            interval: [critical[i], critical[i + 1]],
            monotonicity: slope > 0 ? 'increasing' : 'decreasing'
        });
    }
    
    return intervals;
}
```

## Performance Notes

- Time complexity: O(n × m) where:
  - n = number of sample points in range
  - m = number of critical points found
- Combines multiple analyses in one call
- More efficient than calling each function separately

## Tips for Best Results

### Choose Appropriate Range

```js
// Too narrow - might miss critical points
const bad = analyzeCurve(func, 'x', [-1, 1]);

// Better - wider range
const good = analyzeCurve(func, 'x', [-10, 10]);
```

### Increase Samples for Complex Functions

```js
// Modify findCriticalPoints call internally or:
function detailedAnalyzeCurve(func, variable, range, samples = 2000) {
    // Custom implementation with more samples
}
```

### Combine with Graphing

```js
const analysis = analyzeCurve(func, 'x', [-5, 5]);

// Use analysis data to:
// - Mark critical points with dots
// - Draw vertical lines at inflection points
// - Shade increasing/decreasing regions
// - Annotate max/min values
```