# integralValue

Compute definite integral over a region and return the numeric value.

## The Purpose

Combines `integralOverRegion` with `evaluateEquation` to get a single numeric result.

## The Code

```js
/**
 * Compute integral and return numeric value
 */
function integralValue(expr, bounds) {
    const result = integralOverRegion(expr, bounds);
    return evaluateEquation([[result]], {});
}
```

## Line-by-Line Explanation

```js
function integralValue(expr, bounds) {
```
- **`expr`** — Expression to integrate (fraction object)
- **`bounds`** — Integration bounds object `{x: [a,b], y: [c,d], ...}`

```js
    const result = integralOverRegion(expr, bounds);
```
- **Call integralOverRegion** — Perform the integration
- Returns a fraction representing the symbolic result
- May still contain constants or simplified expressions

```js
    return evaluateEquation([[result]], {});
```
- **`evaluateEquation`** — Convert fraction to numeric value
- **`[[result]]`** — Wrap in equation format
- **`{}`** — No variables to substitute (already integrated)
- Returns single number

## How It Works

1. **Integrate**: Use `integralOverRegion` to compute integral
2. **Evaluate**: Convert symbolic result to number
3. **Return**: Single numeric value

**Convenience Function**: Saves the step of evaluating result manually.

## Usage Examples

### Simple Double Integral

```js
// ∫₀² ∫₀³ xy dy dx = 9
const integrand = sum([[1, {x:1, y:1}]]);

const value = integralValue(integrand[0][0], {x: [0, 2], y: [0, 3]});

console.log(value); // 9
```

### Area Calculation

```js
// Area of [0,5] × [0,3] rectangle
const one = createFraction([createTerm(1)], 1);

const area = integralValue(one, {x: [0, 5], y: [0, 3]});

console.log(area); // 15
```

### Volume Under Paraboloid

```js
// ∫₀¹ ∫₀¹ (x² + y²) dy dx
const surface = sum([[1, {x:2}], [1, {y:2}]]);

const volume = integralValue(surface[0][0], {x: [0, 1], y: [0, 1]});

console.log(volume); // 0.6666... (2/3)
```

### Triple Integral

```js
// ∫₀¹ ∫₀¹ ∫₀¹ xyz dz dy dx
const integrand = sum([[1, {x:1, y:1, z:1}]]);

const value = integralValue(
    integrand[0][0],
    {x: [0, 1], y: [0, 1], z: [0, 1]}
);

console.log(value); // 0.125 (1/8)
```

## integralValue vs integralOverRegion

```js
// integralOverRegion: Returns fraction
const fraction = integralOverRegion(expr, bounds);
const value = evaluateEquation([[fraction]], {}); // Extra step

// integralValue: Returns number directly
const value = integralValue(expr, bounds); // One step
```

## Dependencies

- **`integralOverRegion`** — Computes integral
- **`evaluateEquation`** — Converts to number

## Why Use This?

- **Convenience**: One-step numeric result
- **Clean Code**: Simpler than two-step process
- **Common Case**: Often want numeric value, not symbolic

## Real-World Applications

### Physics: Total Mass

```js
// Mass = ∫∫ ρ(x,y) dA
const density = sum([[2, {x:1}], [3, {y:1}]]);

const mass = integralValue(
    density[0][0],
    {x: [0, 2], y: [0, 3]}
);

console.log('Total mass:', mass, 'kg');
```

### Probability

```js
// P(region) = ∫∫ f(x,y) dA
const pdf = sum([[4, {x:1, y:1}]]);

const probability = integralValue(
    pdf[0][0],
    {x: [0, 0.5], y: [0, 0.5]}
);

console.log('Probability:', probability);
```

## Performance Notes

- Same as `integralOverRegion` + negligible evaluation time
- Very fast for most expressions