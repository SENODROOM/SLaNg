# verifyIntegration

Check if integration was done correctly by differentiating the result and comparing with the original.

## The Purpose

Verify that ∫f(x)dx was computed correctly by checking if d/dx[∫f(x)dx] = f(x).

## The Code

```js
/**
 * Check if integration was done correctly by differentiating
 */
function verifyIntegration(original, integrated, variable) {
    const derivative = differentiateFraction(integrated, variable);
    const simplified = simplifyFraction(derivative);

    // Compare structures (simple comparison)
    return JSON.stringify(simplifyFraction(original)) ===
        JSON.stringify(simplified);
}
```

## Line-by-Line Explanation

```js
function verifyIntegration(original, integrated, variable) {
```
- **`original`** — Original integrand f(x)
- **`integrated`** — Claimed antiderivative F(x)
- **`variable`** — Variable of integration
- Returns true if F'(x) = f(x)

```js
    const derivative = differentiateFraction(integrated, variable);
```
- **Differentiate the result** — Compute d/dx[F(x)]
- Should get back original function
- Uses differentiation rules

```js
    const simplified = simplifyFraction(derivative);
```
- **Simplify derivative** — Combine like terms
- Ensures comparison is fair
- Reduces to canonical form

```js
    return JSON.stringify(simplifyFraction(original)) ===
        JSON.stringify(simplified);
```
- **Compare structures** — Convert both to JSON strings
- **`simplifyFraction(original)`** — Simplify original too
- **`===`** — Check if identical
- Returns boolean (true/false)

## How It Works

1. **Differentiate Result**: Compute F'(x)
2. **Simplify**: Clean up both expressions
3. **Compare**: Check if f(x) = F'(x)
4. **Return**: Boolean result

**Fundamental Theorem**: If F(x) = ∫f(x)dx, then F'(x) = f(x)

## Usage Examples

### Verify Power Rule

```js
// ∫2x dx = x²
const integrand = sum([[2, {x:1}]]);
const antiderivative = sum([[1, {x:2}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);

console.log(isCorrect); // true
```

**Check**: d/dx(x²) = 2x ✓

### Verify Polynomial Integration

```js
// ∫(3x²+ 2x) dx = x³ + x²
const integrand = sum([[3, {x:2}], [2, {x:1}]]);
const antiderivative = sum([[1, {x:3}], [1, {x:2}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);

console.log(isCorrect); // true
```

### Detect Wrong Integration

```js
// ∫x² dx = x³ (WRONG! Should be x³/3)
const integrand = sum([[1, {x:2}]]);
const wrongAntiderivative = sum([[1, {x:3}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    wrongAntiderivative[0][0],
    'x'
);

console.log(isCorrect); // false
```

**Check**: d/dx(x³) = 3x² ≠ x²

### Verify Constant Term

```js
// ∫5 dx = 5x
const integrand = sum([[5, {}]]);
const antiderivative = sum([[5, {x:1}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);

console.log(isCorrect); // true
```

### Multi-Variable (Partial Integration)

```js
// ∫(2xy) dx = x²y
const integrand = sum([[2, {x:1, y:1}]]);
const antiderivative = sum([[1, {x:2, y:1}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);

console.log(isCorrect); // true
```

### Verify with Simplification

```js
// ∫(x + x) dx = x²
// Integrand simplifies to 2x
const integrand = sum([[1, {x:1}], [1, {x:1}]]);
const antiderivative = sum([[1, {x:2}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);

console.log(isCorrect); // true
```

## Step-by-Step Example

Verify ∫3x² dx = x³:

```js
const integrand = sum([[3, {x:2}]]);
const antiderivative = sum([[1, {x:3}]]);

const isCorrect = verifyIntegration(
    integrand[0][0],
    antiderivative[0][0],
    'x'
);
```

**Steps**:
1. **Differentiate** x³:
   - d/dx(x³) = 3x²
2. **Simplify**: Already simplified
3. **Simplify original**: 3x² (already simplified)
4. **JSON comparison**:
   - JSON.stringify(3x²) = '{...coeff:3, var:{x:2}...}'
   - JSON.stringify(3x²) = '{...coeff:3, var:{x:2}...}'
5. **Compare**: Strings match
6. **Return**: true

## Mathematical Background

### Fundamental Theorem of Calculus

If F(x) = ∫f(x)dx, then:

dF/dx = f(x)

This is the basis for verification.

### Why Verification Works

- Integration and differentiation are inverse operations
- Differentiating a correct antiderivative returns original
- Differentiating incorrect result returns something different

### Constant of Integration

Note: F(x) and F(x) + C both differentiate to f(x)
- This function ignores constant differences
- Checks if derivatives match, not if antiderivatives are identical

## Dependencies

- **`differentiateFraction`** — Computes derivative
- **`simplifyFraction`** — Simplifies expressions
- **`JSON.stringify`** — JavaScript built-in

## Why Use This?

- **Testing**: Verify integration code correctness
- **Learning**: Check homework/calculations
- **Debugging**: Find integration bugs
- **Confidence**: Confirm results are correct

## Real-World Applications

### Automated Testing

```js
// Test suite for integration function
function testIntegration() {
    const tests = [
        {
            integrand: sum([[2, {x:1}]]),
            result: sum([[1, {x:2}]]),
            variable: 'x'
        },
        {
            integrand: sum([[3, {x:2}]]),
            result: sum([[1, {x:3}]]),
            variable: 'x'
        }
    ];
    
    tests.forEach((test, i) => {
        const passed = verifyIntegration(
            test.integrand[0][0],
            test.result[0][0],
            test.variable
        );
        console.log(`Test ${i+1}:`, passed ? 'PASS' : 'FAIL');
    });
}
```

### Educational Tool

```js
// Check student's integration
function checkStudentWork(problem, studentAnswer) {
    const correct = verifyIntegration(
        problem.integrand,
        studentAnswer,
        problem.variable
    );
    
    if (correct) {
        console.log('Correct! ✓');
    } else {
        console.log('Incorrect. Try again.');
    }
    
    return correct;
}
```

## Limitations

1. **Structure Comparison**: Uses JSON comparison
   - May fail if same expression in different form
   - Example: x² vs 2x²/2 (mathematically same, structurally different)

2. **Constant Terms**: Doesn't detect missing +C
   - ∫2x dx = x² is accepted (missing +C)
   - This is intentional (constants don't affect derivative)

3. **Simplification Required**: Both must simplify to same form
   - Otherwise valid equivalents may fail

4. **Symbolic Only**: Doesn't numerically verify at points

## Advanced Usage

### Verify Multiple Integrations

```js
function verifyMultipleIntegrations(tests) {
    const results = tests.map(test => ({
        ...test,
        passed: verifyIntegration(
            test.original[0][0],
            test.integrated[0][0],
            test.variable
        )
    }));
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    console.log(`${passed}/${total} tests passed`);
    
    return results;
}
```

### Combine with Numerical Verification

```js
function thoroughVerification(original, integrated, variable) {
    // Symbolic check
    const symbolicOK = verifyIntegration(original, integrated, variable);
    
    // Numerical check at random points
    const points = [0, 1, 2, 3, -1];
    const numericalOK = points.every(x => {
        const expected = evaluateEquation([[original]], {[variable]: x});
        
        const derivative = differentiateFraction(integrated, variable);
        const actual = evaluateEquation([[derivative]], {[variable]: x});
        
        return Math.abs(expected - actual) < 1e-10;
    });
    
    return symbolicOK && numericalOK;
}
```

## Tips

### Always Simplify Inputs

```js
// Simplify both before checking
const original = simplifyFraction(integrand[0][0]);
const result = simplifyFraction(antiderivative[0][0]);

const isCorrect = verifyIntegration(original, result, 'x');
```

### Use for Regression Testing

```js
// Ensure integration function doesn't break
describe('Integration Tests', () => {
    it('should integrate x²', () => {
        const integrand = sum([[1, {x:2}]]);
        const result = integrateFraction(integrand[0][0], 'x');
        
        expect(verifyIntegration(
            integrand[0][0],
            result,
            'x'
        )).toBe(true);
    });
});
```