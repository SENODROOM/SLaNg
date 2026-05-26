# differentiateTerm

Differentiate a single term with respect to a variable using the power rule.

## The Code

```js
/**
 * Differentiate a term with respect to a variable
 * Power rule: d/dx(c*x^n) = c*n*x^(n-1)
 */
function differentiateTerm(term, indvar) {
    const newTerm = deepClone(term);

    // Get current power
    const power = newTerm.var?.[indvar];

    // If variable not present, derivative is 0
    if (power === undefined) {
        return createTerm(0);
    }

    // Apply power rule
    newTerm.coeff = newTerm.coeff * power;

    // Decrease power
    if (power === 1) {
        // x^1 becomes x^0 = 1, so remove variable
        delete newTerm.var[indvar];
        if (Object.keys(newTerm.var).length === 0) {
            delete newTerm.var;
        }
    } else {
        newTerm.var[indvar] = power - 1;
    }

    return newTerm;
}
```

## Line-by-Line Explanation

```js
function differentiateTerm(term, indvar) {
```
- **`term`** — A term object with coefficient and optional variables
- **`indvar`** — The differentiation variable (the variable we're differentiating with respect to)

```js
    const newTerm = deepClone(term);
```
- Create a deep copy of the term to avoid mutating the original
- Ensures the original term remains unchanged

```js
    const power = newTerm.var?.[indvar];
```
- Get the current power (exponent) of the differentiation variable
- **`newTerm.var?.[indvar]`** — Optional chaining: safely access the variable even if `var` is undefined
- If the variable doesn't exist, `power` will be `undefined`

```js
    if (power === undefined) {
```
- Check if the differentiation variable is not present in the term
- If the variable doesn't exist, it means the term is a constant with respect to this variable

```js
        return createTerm(0);
```
- Return a term with coefficient 0
- **Derivative of a constant is 0**
- Example: `d/dx(5y²) = 0` (no x present)

```js
    }
```
- Close the if statement

```js
    newTerm.coeff = newTerm.coeff * power;
```
- Apply the power rule: multiply coefficient by the current power
- **Power rule**: `d/dx(c·x^n) = c·n·x^(n-1)`
- Example: `d/dx(3x²)` → coefficient becomes `3 × 2 = 6`

```js
    if (power === 1) {
```
- Check if the power is 1
- Special case: `x¹` becomes `x⁰ = 1`, so the variable disappears

```js
        delete newTerm.var[indvar];
```
- Remove the differentiation variable from the term
- Example: `d/dx(5x)` becomes `5` (not `5x⁰`)

```js
        if (Object.keys(newTerm.var).length === 0) {
```
- Check if there are any variables left in the term

```js
            delete newTerm.var;
```
- If no variables remain, remove the entire `var` object
- Leaves us with just a numerical coefficient

```js
        }
```
- Close the nested if statement

```js
    } else {
```
- Handle the case where power is not 1

```js
        newTerm.var[indvar] = power - 1;
```
- Decrease the power by 1
- This completes the power rule application
- Example: `x³` becomes `x²`, `x²` becomes `x¹`

```js
    }
```
- Close the else statement

```js
    return newTerm;
```
- Return the differentiated term

```js
}
```
- Close the function

## How It Works

The function applies the **power rule of differentiation**:

**d/dx(c·x^n) = c·n·x^(n-1)**

Steps:
1. Clone the term to avoid mutation
2. Get the current power of the differentiation variable
3. If the variable is not present, return 0 (derivative of constant)
4. Multiply the coefficient by the power
5. Decrease the power by 1 (remove variable if power was 1)
6. Return the differentiated term

## Usage Examples

### Differentiate a Constant

```js
const term = createTerm(5);
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 0 }
// Mathematical: d/dx(5) = 0
```

### Differentiate x

```js
const term = createTerm(1, { x: 1 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 1 }
// Mathematical: d/dx(x) = 1
```

### Differentiate x²

```js
const term = createTerm(1, { x: 2 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 2, var: { x: 1 } }
// Mathematical: d/dx(x²) = 2x
```

### Differentiate 3x²

```js
const term = createTerm(3, { x: 2 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 6, var: { x: 1 } }
// Mathematical: d/dx(3x²) = 6x
```

### Differentiate x⁵

```js
const term = createTerm(1, { x: 5 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 5, var: { x: 4 } }
// Mathematical: d/dx(x⁵) = 5x⁴
```

### Differentiate with Multiple Variables

```js
const term = createTerm(6, { x: 2, y: 3 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 12, var: { x: 1, y: 3 } }
// Mathematical: d/dx(6x²y³) = 12xy³
// Note: y is treated as a constant
```

### Differentiate with Respect to Different Variable

```js
const term = createTerm(4, { x: 2, y: 3 });
const result = differentiateTerm(term, 'y');

console.log(result);
// { coeff: 12, var: { x: 2, y: 2 } }
// Mathematical: d/dy(4x²y³) = 12x²y²
// Note: x is treated as a constant
```

### Differentiate When Variable Not Present

```js
const term = createTerm(5, { y: 2 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 0 }
// Mathematical: d/dx(5y²) = 0 (no x present)
```

### Negative Coefficient

```js
const term = createTerm(-3, { x: 4 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: -12, var: { x: 3 } }
// Mathematical: d/dx(-3x⁴) = -12x³
```

## Step-by-Step Example

Let's differentiate `6x³` with respect to `x`:

```js
const term = createTerm(6, { x: 3 });
const result = differentiateTerm(term, 'x');
```

**Step by step:**
1. `newTerm = { coeff: 6, var: { x: 3 } }` (deep cloned)
2. `power = 3` (current power of x)
3. Check if power is undefined: No, continue
4. Apply power rule to coefficient:
   - `newTerm.coeff = 6 × 3 = 18`
5. Check if power is 1: No, it's 3
6. Decrease power:
   - `newTerm.var['x'] = 3 - 1 = 2`
7. Return `{ coeff: 18, var: { x: 2 } }`

**Mathematical verification**: `d/dx(6x³) = 6 × 3 × x^(3-1) = 18x²` ✓

## Power Rule Application

| Original Term | Differentiation Variable | Result | Mathematical |
|--------------|-------------------------|--------|-------------|
| `5` | `x` | `0` | `d/dx(5) = 0` |
| `x` | `x` | `1` | `d/dx(x) = 1` |
| `x²` | `x` | `2x` | `d/dx(x²) = 2x` |
| `3x²` | `x` | `6x` | `d/dx(3x²) = 6x` |
| `x⁵` | `x` | `5x⁴` | `d/dx(x⁵) = 5x⁴` |
| `2xy³` | `x` | `2y³` | `d/dx(2xy³) = 2y³` |
| `2xy³` | `y` | `6xy²` | `d/dy(2xy³) = 6xy²` |

## Special Cases

### Power = 1 (Variable Disappears)

```js
const term = createTerm(7, { x: 1 });
const result = differentiateTerm(term, 'x');

console.log(result);
// { coeff: 7 }
// Mathematical: d/dx(7x) = 7
// Note: No variables in result (x⁰ = 1)
```

### Power = 0 (Would be constant, but not typically created)

Terms with `x⁰` are typically just stored as constants without the variable.

### Multiple Variables, Differentiate One

```js
const term = createTerm(10, { x: 2, y: 1, z: 3 });
const result = differentiateTerm(term, 'y');

console.log(result);
// { coeff: 10, var: { x: 2, z: 3 } }
// Mathematical: d/dy(10x²yz³) = 10x²z³
// Note: y disappears, x and z remain
```

## Why Deep Clone?

```js
const newTerm = deepClone(term);
```

Without deep cloning, modifying the result would affect the original:

```js
const original = createTerm(3, { x: 2 });
const derivative = differentiateTerm(original, 'x');

// Without deep clone, this would also change 'original'
derivative.coeff = 999;
```

## Important Notes

**Derivative of a constant is always 0:**
```js
differentiateTerm(createTerm(100), 'x')  // Returns { coeff: 0 }
```

**Variable not present = constant:**
```js
differentiateTerm(createTerm(5, { y: 2 }), 'x')  // Returns { coeff: 0 }
```

**Power rule only works for polynomial terms:**
- Does NOT handle: `sin(x)`, `cos(x)`, `e^x`, `ln(x)`, etc.
- Only works for: `x^n` where n is a real number

## Dependencies

This function requires:
- **`deepClone`** — To create an independent copy of the term
- **`createTerm`** — To create the zero term when derivative is 0

## Why Use This?

This function is useful for:

- Symbolic differentiation of polynomial terms
- Building calculus calculators
- Finding derivatives programmatically
- Creating computer algebra systems
- Educational tools for learning calculus
- Finding rates of change
- Optimization problems
- Physics applications (velocity, acceleration)