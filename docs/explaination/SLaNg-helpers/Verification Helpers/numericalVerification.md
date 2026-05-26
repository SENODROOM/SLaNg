# numericalVerification

Verify two expressions are equivalent by evaluating at random sample points.

## The Purpose

Check if two expressions are equal by comparing values at multiple randomly chosen points.

## The Code

```js
/**
 * Numerical verification: sample at random points
 */
function numericalVerification(expr1, expr2, variables, numSamples = 10) {
    const errors = [];

    for (let i = 0; i < numSamples; i++) {
        const point = {};
        for (let v of variables) {
            point[v] = Math.random() * 10 - 5; // Random value in [-5, 5]
        }

        const val1 = evaluateAt([expr1], point);
        const val2 = evaluateAt([expr2], point);
        const error = Math.abs(val1 - val2);

        if (error > 1e-10) {
            errors.push({ point, val1, val2, error });
        }
    }

    return {
        passed: errors.length === 0,
        errors
    };
}
```

## Line-by-Line Explanation

```js
function numericalVerification(expr1, expr2, variables, numSamples = 10) {
```
- **`expr1`** — First expression to compare
- **`expr2`** — Second expression to compare
- **`variables`** — Array of variable names to vary
- **`numSamples`** — Number of random points to test (default: 10)

```js
    const errors = [];
```
- **Initialize error list** — Will store points where expressions differ
- Empty array means no errors found

```js
    for (let i = 0; i < numSamples; i++) {
```
- **Loop through samples** — Test at multiple points
- More samples → higher confidence

```js
        const point = {};
        for (let v of variables) {
            point[v] = Math.random() * 10 - 5;
        }
```
- **Generate random point** — Create random values for each variable
- **`Math.random() * 10 - 5`** — Uniform random in [-5, 5]
- Example: `{x: -2.347, y: 3.891}`

```js
        const val1 = evaluateAt([expr1], point);
        const val2 = evaluateAt([expr2], point);
```
- **Evaluate both expressions** at the random point
- Get numeric values for comparison

```js
        const error = Math.abs(val1 - val2);
```
- **Compute absolute error** — |val1 - val2|
- Measures how different the values are

```js
        if (error > 1e-10) {
            errors.push({ point, val1, val2, error });
        }
```
- **Check tolerance** — If error > 10⁻¹⁰, expressions differ
- **Record mismatch** — Save point and values for analysis
- Threshold 1e-10 accounts for floating-point precision

```js
    return {
        passed: errors.length === 0,
        errors
    };
```
- **`passed`** — true if no errors found, false otherwise
- **`errors`** — Array of points where expressions differed
- Return object with both boolean and diagnostic info

## How It Works

1. **Generate Random Points**: Create random values for variables
2. **Evaluate Both**: Compute both expressions at each point
3. **Compare**: Check if values are nearly equal
4. **Record Differences**: Save points where they differ
5. **Return Result**: Boolean pass/fail plus error details

**Monte Carlo Method**: Random sampling to verify equivalence.

## Usage Examples

### Verify Algebraic Identity

```js
// Check if x² - 1 = (x-1)(x+1)
const expr1 = sum([[1, {x:2}], [-1, {}]]);

// Expand (x-1)(x+1)
const f1 = sum([[1, {x:1}], [-1, {}]]);
const f2 = sum([[1, {x:1}], [1, {}]]);
const prod = product(f1, f2);
const expr2 = expandProduct(prod[0]);

const result = numericalVerification(expr1[0][0], expr2, ['x'], 100);

console.log(result.passed); // true
console.log('Errors found:', result.errors.length); // 0
```

### Detect Incorrect Simplification

```js
// Wrong: x² + x ≠ x(x+1) + 1
const expr1 = sum([[1, {x:2}], [1, {x:1}]]);
const expr2 = sum([[1, {x:2}], [1, {x:1}], [1, {}]]); // Added extra +1

const result = numericalVerification(expr1[0][0], expr2[0][0], ['x'], 50);

console.log(result.passed); // false
console.log('Errors at', result.errors.length, 'points');
console.log('First error:', result.errors[0]);
```

### Verify Integration Result

```js
// Check if ∫x² dx = x³/3 (numerically)
const integrand = sum([[1, {x:2}]]);
const integrated = integrateFraction(integrand[0][0], 'x');

// d/dx(x³/3) should equal x²
const derivative = differentiateFraction(integrated, 'x');

const result = numericalVerification(
    integrand[0][0],
    derivative,
    ['x'],
    100
);

console.log('Integration verified:', result.passed);
```

### Two-Variable Expressions

```js
// Verify (x+y)² = x² + 2xy + y²
const expr1_base = sum([[1, {x:1}], [1, {y:1}]]);
const squared = product(expr1_base, expr1_base);
const expr1 = expandProduct(squared[0]);

const expr2 = sum([
    [1, {x:2}],
    [2, {x:1, y:1}],
    [1, {y:2}]
]);

const result = numericalVerification(
    expr1,
    expr2[0][0],
    ['x', 'y'],
    200
);

console.log(result.passed); // true
```

### Check Factorization

```js
// Verify x² - 9 = (x-3)(x+3)
const expanded = sum([[1, {x:2}], [-9, {}]]);

const f1 = sum([[1, {x:1}], [-3, {}]]);
const f2 = sum([[1, {x:1}], [3, {}]]);
const prod = product(f1, f2);
const factored = expandProduct(prod[0]);

const result = numericalVerification(
    expanded[0][0],
    factored,
    ['x'],
    50
);

console.log('Factorization correct:', result.passed);
```

### Three Variables

```js
// Verify xyz = zyx (commutativity)
const expr1 = sum([[1, {x:1, y:1, z:1}]]);
const expr2 = sum([[1, {z:1, y:1, x:1}]]); // Different order

const result = numericalVerification(
    expr1[0][0],
    expr2[0][0],
    ['x', 'y', 'z'],
    100
);

console.log(result.passed); // true
```

### Custom Sample Range

```js
// Test in specific range (modify function)
function numericalVerificationRange(expr1, expr2, variables, range, numSamples = 10) {
    const errors = [];

    for (let i = 0; i < numSamples; i++) {
        const point = {};
        for (let v of variables) {
            point[v] = Math.random() * (range[1] - range[0]) + range[0];
        }

        const val1 = evaluateAt([expr1], point);
        const val2 = evaluateAt([expr2], point);
        const error = Math.abs(val1 - val2);

        if (error > 1e-10) {
            errors.push({ point, val1, val2, error });
        }
    }

    return { passed: errors.length === 0, errors };
}

// Test only positive values
const result = numericalVerificationRange(
    expr1,
    expr2,
    ['x'],
    [0, 10],
    50
);
```

## Step-by-Step Example

Verify x² - 4 = (x-2)(x+2) with 3 samples:

```js
const expr1 = sum([[1, {x:2}], [-4, {}]]);

const f1 = sum([[1, {x:1}], [-2, {}]]);
const f2 = sum([[1, {x:1}], [2, {}]]);
const prod = product(f1, f2);
const expr2 = expandProduct(prod[0]);

const result = numericalVerification(expr1[0][0], expr2, ['x'], 3);
```

**Sample execution**:

1. **Sample 1**: x = -2.73
   - expr1: (-2.73)² - 4 = 7.45 - 4 = 3.45
   - expr2: 3.45
   - error: |3.45 - 3.45| = 0 < 1e-10 ✓

2. **Sample 2**: x = 1.89
   - expr1: (1.89)² - 4 = 3.57 - 4 = -0.43
   - expr2: -0.43
   - error: 0 < 1e-10 ✓

3. **Sample 3**: x = 4.12
   - expr1: (4.12)² - 4 = 16.97 - 4 = 12.97
   - expr2: 12.97
   - error: 0 < 1e-10 ✓

**Result**: `{passed: true, errors: []}`

## Mathematical Background

### Monte Carlo Verification

- Random sampling to verify properties
- Not a proof, but high confidence
- More samples → higher confidence

### False Negatives

Extremely unlikely to pass if expressions differ:
- Probability of missing difference ≈ 0 for well-separated expressions
- Would need expressions to coincidentally agree at all random points

### False Positives

Possible but very rare:
- Two different expressions might agree at all sampled points
- More likely with very few samples
- Use more samples for critical verifications

### Tolerance

`1e-10` threshold accounts for:
- Floating-point arithmetic errors
- Rounding in calculations
- Machine epsilon

## Dependencies

- **`evaluateAt`** — Evaluates expressions
- **`Math.random`** — JavaScript random number generator
- **`Math.abs`** — Absolute value

## Why Use This?

- **Complement to Symbolic**: When symbolic comparison is hard
- **Practical Confidence**: High confidence expressions are equal
- **Debugging**: Find where expressions differ
- **Floating-Point Safety**: Tolerates rounding errors

## Real-World Applications

### Testing Mathematical Software

```js
// Test suite for algebra system
function testAlgebraSystem() {
    const tests = [
        {
            name: 'Distributive law',
            expr1: expandProduct(product(
                sum([[2, {x:1}]]),
                sum([[1, {x:1}], [3, {}]])
            )[0]),
            expr2: sum([[2, {x:2}], [6, {x:1}]])[0][0]
        }
    ];
    
    tests.forEach(test => {
        const result = numericalVerification(
            test.expr1,
            test.expr2,
            ['x'],
            100
        );
        console.log(test.name + ':', result.passed ? 'PASS' : 'FAIL');
    });
}
```

### Regression Testing

```js
// Ensure refactored code produces same results
const oldImplementation = /* old version */;
const newImplementation = /* new version */;

const result = numericalVerification(
    oldImplementation,
    newImplementation,
    ['x', 'y'],
    1000
);

if (!result.passed) {
    console.error('Regression detected!');
    console.log('Failures:', result.errors);
}
```

## Performance Notes

- **Time complexity**: O(numSamples × evaluation_cost)
- Fast for small numSamples (<100)
- Can be slow for complex expressions with many samples
- Default 10 samples is usually sufficient

## Limitations

1. **Not a Proof**: Statistical evidence, not mathematical proof
   - Can't prove equivalence, only provide confidence

2. **Floating-Point Precision**: Limited by machine precision
   - Very small differences might be rounding errors

3. **Random Points**: Might miss specific edge cases
   - Example: expr1 = expr2 except at x=7 exactly

4. **Range Limited**: Samples only from [-5, 5] by default
   - Might miss differences outside this range

## Tips

### Use More Samples for Critical Checks

```js
// High-stakes verification
const result = numericalVerification(expr1, expr2, vars, 10000);
```

### Examine Errors When Failed

```js
const result = numericalVerification(expr1, expr2, ['x'], 100);

if (!result.passed) {
    console.log('Failed at these points:');
    result.errors.forEach(err => {
        console.log(`  x=${err.point.x}: ${err.val1} vs ${err.val2}`);
    });
}
```

### Combine with Symbolic Verification

```js
function fullVerification(expr1, expr2, variable) {
    // Try symbolic first
    const symbolic = verifyIntegration(expr1, expr2, variable);
    
    // If symbolic fails, try numerical
    if (!symbolic) {
        const numerical = numericalVerification(
            expr1,
            expr2,
            [variable],
            1000
        );
        
        if (numerical.passed) {
            console.log('Expressions likely equal (numerical evidence)');
        } else {
            console.log('Expressions definitely different');
        }
    } else {
        console.log('Expressions symbolically verified');
    }
}
```