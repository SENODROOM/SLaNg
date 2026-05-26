# evaluateAt

Evaluate an expression at a specific point (substitute values for variables).

## The Purpose

Convenience wrapper around `evaluateEquation` that handles format conversion automatically.

## The Code

```js
/**
 * Evaluate expression at point
 * @param {Object} expr - Expression in equation format
 * @param {Object} point - {x: value, y: value, ...}
 */
function evaluateAt(expr, point) {
    return evaluateEquation([Array.isArray(expr) ? expr : [expr]], point);
}
```

## Line-by-Line Explanation

```js
function evaluateAt(expr, point) {
```
- **`expr`** — Expression to evaluate (can be fraction or array)
- **`point`** — Object mapping variable names to values
- Example: `{x: 3, y: 4}` means substitute x=3, y=4

```js
    return evaluateEquation([Array.isArray(expr) ? expr : [expr]], point);
```
- **`Array.isArray(expr)`** — Check if expr is already an array
- **`? expr : [expr]`** — Ternary operator:
  - If expr is array: use it directly
  - If expr is not array: wrap in array `[expr]`
- **`[...]`** — Wrap in outer array for equation format
- **`evaluateEquation(..., point)`** — Perform evaluation

## How It Works

1. **Check Format**: Determine if expr is array or single element
2. **Wrap if Needed**: Ensure proper equation format `[[...]]`
3. **Evaluate**: Call `evaluateEquation`
4. **Return**: Numeric result

**Automatic Format Handling**: Accepts both `fraction` and `[fraction]` formats.

## Usage Examples

### Evaluate Polynomial

```js
// f(x,y) = x² + y²
const f = sum([[1, {x:2}], [1, {y:2}]]);

// Evaluate at (3, 4)
const value = evaluateAt(f[0], {x: 3, y: 4});
console.log(value); // 9 + 16 = 25
```

### Multiple Points

```js
// f(x) = x² - 2x + 1
const f = sum([[1, {x:2}], [-2, {x:1}], [1, {}]]);

const points = [0, 1, 2, 3, 4];
const values = points.map(x => evaluateAt(f[0], {x}));

console.log(values); // [1, 0, 1, 4, 9]
```

### Two Variables

```js
// f(x,y) = 3xy + 2x - y
const f = sum([
    [3, {x:1, y:1}],
    [2, {x:1}],
    [-1, {y:1}]
]);

const value = evaluateAt(f[0], {x: 2, y: 5});
console.log(value); // 3(2)(5) + 2(2) - 5 = 30 + 4 - 5 = 29
```

### After Differentiation

```js
// f(x) = x³
const f = sum([[1, {x:3}]]);

// f'(x) = 3x²
const fprime = differentiateFraction(f[0][0], 'x');

// Evaluate f'(2)
const value = evaluateAt([fprime], {x: 2});
console.log(value); // 3(4) = 12
```

### After Integration

```js
// f(x) = 2x
const f = sum([[2, {x:1}]]);

// ∫f(x)dx = x²
const integral = integrateFraction(f[0][0], 'x');

// Evaluate at x=5
const value = evaluateAt([integral], {x: 5});
console.log(value); // 25
```

### Grid of Values

```js
// f(x,y) = x + y
const f = sum([[1, {x:1}], [1, {y:1}]]);

const grid = [];
for (let x = 0; x <= 2; x++) {
    for (let y = 0; y <= 2; y++) {
        grid.push({x, y, value: evaluateAt(f[0], {x, y})});
    }
}

console.log(grid);
// [{x:0, y:0, value:0}, {x:0, y:1, value:1}, ...]
```

## evaluateAt vs evaluateEquation

```js
// evaluateEquation: Requires exact equation format
const value1 = evaluateEquation([[fraction]], {x: 2});

// evaluateAt: Handles format automatically  
const value2 = evaluateAt([fraction], {x: 2});
const value3 = evaluateAt(fraction, {x: 2}); // Also works!
```

## Dependencies

- **`evaluateEquation`** — Performs actual evaluation
- **`Array.isArray`** — JavaScript built-in

## Why Use This?

- **Convenience**: Don't worry about array wrapping
- **Flexible Input**: Accepts multiple formats
- **Cleaner Code**: Simpler syntax

## Real-World Applications

### Plotting Function Values

```js
// Generate points for plotting y = x²
const f = sum([[1, {x:2}]]);

const plotPoints = [];
for (let x = -5; x <= 5; x += 0.5) {
    plotPoints.push({
        x: x,
        y: evaluateAt(f[0], {x})
    });
}

// plotPoints ready for charting library
```

### Testing Function Values

```js
// f(x,y) = x² + y²
const f = sum([[1, {x:2}], [1, {y:2}]]);

// Test at origin
console.assert(evaluateAt(f[0], {x: 0, y: 0}) === 0);

// Test at (3,4) - should be 25
console.assert(evaluateAt(f[0], {x: 3, y: 4}) === 25);
```

### Numerical Root Finding

```js
// Find where f(x) ≈ 0
function findRootBisection(expr, xmin, xmax, tolerance = 1e-6) {
    let left = xmin;
    let right = xmax;
    
    while (right - left > tolerance) {
        const mid = (left + right) / 2;
        const fmid = evaluateAt(expr, {x: mid});
        const fleft = evaluateAt(expr, {x: left});
        
        if (fmid * fleft < 0) {
            right = mid;
        } else {
            left = mid;
        }
    }
    
    return (left + right) / 2;
}

// x² - 2 = 0, root at √2
const f = sum([[1, {x:2}], [-2, {}]]);
const root = findRootBisection(f[0], 1, 2);
console.log('√2 ≈', root); // ≈ 1.414213
```

## Performance Notes

- Negligible overhead from format checking
- Same speed as `evaluateEquation` after check
- Very fast for typical expressions