# volumeUnderSurface

Compute the volume under a surface z = f(x,y) over a rectangular region.

## The Formula

V = ∫∫_R f(x,y) dA = ∫∫ f(x,y) dx dy

## The Code

```js
/**
 * Volume under surface z = f(x,y) over region R
 */
function volumeUnderSurface(surface, xBounds, yBounds) {
    return integralValue(surface, { x: xBounds, y: yBounds });
}
```

## Line-by-Line Explanation

```js
function volumeUnderSurface(surface, xBounds, yBounds) {
```
- **`surface`** — Function z = f(x,y) as fraction object
- **`xBounds`** — Array `[xmin, xmax]` for x limits
- **`yBounds`** — Array `[ymin, ymax]` for y limits

```js
    return integralValue(surface, { x: xBounds, y: yBounds });
```
- **`integralValue`** — Compute double integral and return numeric value
- **`{ x: xBounds, y: yBounds }`** — Format bounds for integration
- Returns volume as single number

## How It Works

1. **Package Bounds**: Format into bounds object
2. **Integrate**: Call `integralValue` with 2D region
3. **Return**: Volume as number

**Purpose**: Convenient wrapper for common 3D volume calculation.

## Usage Examples

### Volume Under Plane

```js
// z = x + y over [0,1] × [0,1]
const plane = sum([[1, {x:1}], [1, {y:1}]]);

const volume = volumeUnderSurface(
    plane[0][0],
    [0, 1],
    [0, 1]
);

console.log(volume); // 1
```

**Calculation**: ∫₀¹ ∫₀¹ (x+y) dy dx = ∫₀¹ [xy + y²/2]₀¹ dx = ∫₀¹ (x + 1/2) dx = [x²/2 + x/2]₀¹ = 1

### Volume Under Paraboloid

```js
// z = x² + y² over [0,1] × [0,1]
const paraboloid = sum([[1, {x:2}], [1, {y:2}]]);

const volume = volumeUnderSurface(
    paraboloid[0][0],
    [0, 1],
    [0, 1]
);

console.log(volume); // 0.6666... (2/3)
```

### Volume Under xy Surface

```js
// z = xy over [0,2] × [0,3]
const surface = sum([[1, {x:1, y:1}]]);

const volume = volumeUnderSurface(
    surface[0][0],
    [0, 2],
    [0, 3]
);

console.log(volume); // 9
```

**Calculation**: ∫₀² ∫₀³ xy dy dx = ∫₀² [xy²/2]₀³ dx = ∫₀² (9x/2) dx = [9x²/4]₀² = 9

### Constant Height

```js
// z = 5 (flat surface at height 5) over [0,2] × [0,3]
const flat = sum([[5, {}]]);

const volume = volumeUnderSurface(
    flat[0][0],
    [0, 2],
    [0, 3]
);

console.log(volume); // 30 (base area × height)
```

### Negative Region

```js
// z = x - 2 over [0,1] × [0,1]
// (Part of surface is below xy-plane)
const surface = sum([[1, {x:1}], [-2, {}]]);

const volume = volumeUnderSurface(
    surface[0][0],
    [0, 1],
    [0, 1]
);

console.log(volume); // -1.5 (net volume, includes negative)
```

### Larger Region

```js
// z = 1 over [0,10] × [0,5]
const surface = sum([[1, {}]]);

const volume = volumeUnderSurface(
    surface[0][0],
    [0, 10],
    [0, 5]
);

console.log(volume); // 50
```

## Mathematical Background

### Volume Integral

For surface z = f(x,y) over region R:

V = ∫∫_R f(x,y) dA

Where dA = dx dy (or dy dx).

### Geometric Interpretation

- **Positive f**: Volume between surface and xy-plane
- **Negative f**: "Volume" counted as negative
- **Mixed**: Net volume (positive - negative regions)

### Fubini's Theorem

For rectangular regions, can integrate in either order:

V = ∫ₐᵇ ∫_c^d f(x,y) dy dx = ∫_c^d ∫ₐᵇ f(x,y) dx dy

## Dependencies

- **`integralValue`** — Computes double integral

## Why Use This?

- **Specific Purpose**: Clear what calculation represents
- **Simple Interface**: Just surface and bounds
- **Common Calculation**: Frequently needed in applications

## Real-World Applications

### Water Tank Volume

```js
// Tank bottom: z = 0.1x² + 0.1y²
// Over [0,10] × [0,10]
const bottom = sum([[0.1, {x:2}], [0.1, {y:2}]]);

const volume = volumeUnderSurface(
    bottom[0][0],
    [0, 10],
    [0, 10]
);

console.log('Tank volume:', volume, 'cubic meters');
```

### Terrain Volume

```js
// Elevation function h(x,y) = 100 - 0.01x² - 0.01y²
// Volume of earth above z=0
const terrain = sum([
    [100, {}],
    [-0.01, {x:2}],
    [-0.01, {y:2}]
]);

const volume = volumeUnderSurface(
    terrain[0][0],
    [0, 50],
    [0, 50]
);

console.log('Volume of terrain:', volume);
```

### Heat Distribution

```js
// Temperature distribution T(x,y) = 100 - x² - y²
// Total "heat content" over region
const temperature = sum([
    [100, {}],
    [-1, {x:2}],
    [-1, {y:2}]
]);

const totalHeat = volumeUnderSurface(
    temperature[0][0],
    [0, 5],
    [0, 5]
);

console.log('Total heat:', totalHeat);
```

## Performance Notes

- Same as `integralValue` with 2D bounds
- Very fast for polynomial surfaces
- Complexity depends on expression complexity

## Limitations

1. **Rectangular Regions Only**: x and y bounds must be constants
2. **Polynomial Surfaces**: Works with polynomial z = f(x,y)
3. **No Holes**: Cannot handle regions with holes

## Tips

### Check Surface Is Non-Negative

```js
// For physical volume, surface should be ≥ 0
// Check at corners
const surface = sum([[1, {x:1}], [1, {y:1}]]);

console.log(evaluateAt([surface[0][0]], {x: 0, y: 0})); // Check
```

### Verify with Simple Cases

```js
// z = h (constant) over base area A
// Volume should equal h × A

const h = 5;
const surface = sum([[h, {}]]);
const volume = volumeUnderSurface(surface[0][0], [0, 3], [0, 4]);

console.assert(volume === h * 3 * 4); // 60
```