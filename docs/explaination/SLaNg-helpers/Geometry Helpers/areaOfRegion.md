# areaOfRegion

Compute the area of a rectangular region in the xy-plane.

## The Formula

A = ∫∫_R 1 dA = (b-a)(d-c)

For rectangle [a,b] × [c,d]

## The Code

```js
/**
 * Area of region in xy-plane (integrate 1 over region)
 */
function areaOfRegion(xBounds, yBounds) {
    const one = createFraction([createTerm(1)], 1);
    return integralValue(one, { x: xBounds, y: yBounds });
}
```

## Line-by-Line Explanation

```js
function areaOfRegion(xBounds, yBounds) {
```
- **`xBounds`** — Array `[xmin, xmax]` for x limits
- **`yBounds`** — Array `[ymin, ymax]` for y limits

```js
    const one = createFraction([createTerm(1)], 1);
```
- **Create constant 1** — Integrand for area calculation
- Numerator: single term with coefficient 1
- Denominator: 1

```js
    return integralValue(one, { x: xBounds, y: yBounds });
}
```
- **Integrate 1 over region** — ∫∫ 1 dA
- Returns area as number

## How It Works

1. **Create Unit Function**: f(x,y) = 1
2. **Integrate**: ∫∫ 1 dx dy
3. **Return**: Area value

**Mathematical Fact**: ∫∫_R 1 dA = area of R

## Usage Examples

### Rectangle Area

```js
// [0,5] × [0,3]
const area = areaOfRegion([0, 5], [0, 3]);

console.log(area); // 15
```

### Square

```js
// [0,10] × [0,10]
const area = areaOfRegion([0, 10], [0, 10]);

console.log(area); // 100
```

### Non-Origin Rectangle

```js
// [2,7] × [3,8]
const area = areaOfRegion([2, 7], [3, 8]);

console.log(area); // 5 × 5 = 25
```

### Unit Square

```js
// [0,1] × [0,1]
const area = areaOfRegion([0, 1], [0, 1]);

console.log(area); // 1
```

## Mathematical Background

### Area as Double Integral

For region R, area is:

A = ∫∫_R dA = ∫∫_R 1 dx dy

### Why Integrate 1?

- ∫∫ 1 dA accumulates infinitesimal areas
- Each dA contributes 1 × dA to sum
- Total is the area

### Rectangular Regions

For rectangle [a,b] × [c,d]:

A = ∫ₐᵇ ∫_c^d 1 dy dx = ∫ₐᵇ (d-c) dx = (b-a)(d-c)

## Dependencies

- **`createFraction`** — Create constant 1
- **`createTerm`** — Create term with coefficient 1
- **`integralValue`** — Compute integral

## Why Use This?

- **Verification**: Check integration code works
- **Simple Cases**: Quick area calculations
- **Base for More Complex**: Foundation for weighted areas

## Real-World Applications

### Land Area

```js
// Plot from (100,200) to (150,280) meters
const area = areaOfRegion([100, 150], [200, 280]);

console.log('Land area:', area, 'square meters');
// 50 × 80 = 4000 m²
```

### Screen Region

```js
// Pixels from (0,0) to (1920,1080)
const pixels = areaOfRegion([0, 1920], [0, 1080]);

console.log('Screen area:', pixels, 'pixels');
// 2,073,600 pixels
```

## Performance Notes

- Very fast (simple integration)
- Result should match (b-a)(d-c)

## Tips

### Verify Bounds Order

```js
// Correct: lower < upper
const correct = areaOfRegion([0, 5], [0, 3]); // 15

// Wrong: upper < lower
const wrong = areaOfRegion([5, 0], [3, 0]); // -15 (negative!)
```