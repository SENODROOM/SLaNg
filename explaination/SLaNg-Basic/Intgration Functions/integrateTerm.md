# integrateTerm

Integrate a single term with respect to a variable using the power rule.

## The Code

```js
/**
 * Integrate a single term with respect to a variable
 * Power rule: ∫ c*x^n dx = c/(n+1) * x^(n+1)
 */
function integrateTerm(term, indvar) {
    const newTerm = deepClone(term);

    // Get current power of the variable (0 if not present)
    const power = newTerm.var?.[indvar] ?? 0;

    // Apply power rule
    newTerm.coeff = newTerm.coeff / (power + 1);

    // Increment power
    if (!newTerm.var) {
        newTerm.var = {};
    }
    newTerm.var[indvar] = power + 1;

    return newTerm;
}
```

## Line-by-Line Explanation

```js
function integrateTerm(term, indvar) {
```
- **`term`** — A term object with coefficient and optional variables
- **`indvar`** — The integration variable (the variable we're integrating with respect to)

```js
    const newTerm = deepClone(term);
```
- Create a deep copy of the term to avoid mutating the original
- Ensures the original term remains unchanged

```js
    const power = newTerm.var?.[indvar] ?? 0;
```
- Get the current power (exponent) of the integration variable
- **`newTerm.var?.[indvar]`** — Optional chaining: safely access the variable even if `var` is undefined
- **`?? 0`** — Nullish coalescing: if the variable doesn't exist, treat it as power 0 (constant)
- Example: For `5x²`, if `indvar='x'`, then `power = 2`
- Example: For constant `5`, `power = 0`

```js
    newTerm.coeff = newTerm.coeff / (power + 1);
```
- Apply the power rule: divide coefficient by `(n+1)`
- **Power rule**: `∫ c·x^n dx = c/(n+1) · x^(n+1)`
- Example: `∫ 3x² dx` → coefficient becomes `3/(2+1) = 3/3 = 1`

```js
    if (!newTerm.var) {
        newTerm.var = {};
    }
```
- Check if the term has a variables object
- If not, create an empty object to store variables
- This handles the case of integrating a constant

```js
    newTerm.var[indvar] = power + 1;
```
- Increment the power of the integration variable by 1
- This completes the power rule application
- Example: `x²` becomes `x³`, constant `1` becomes `x¹`

```js
    return newTerm;
```
- Return the integrated term

```js
}
```
- Close the function

## How It Works

The function applies the **power rule of integration**:

**∫ c·x^n dx = c/(n+1) · x^(n+1) + C**

Steps:
1. Clone the term to avoid mutation
2. Get the current power of the integration variable
3. Divide the coefficient by (power + 1)
4. Increase the power by 1
5. Return the integrated term

## Usage Examples

### Integrate a Constant

```js
const term = createTerm(5);
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: 5, var: { x: 1 } }
// Mathematical: ∫ 5 dx = 5x + C
```

### Integrate x

```js
const term = createTerm(1, { x: 1 });
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: 0.5, var: { x: 2 } }
// Mathematical: ∫ x dx = (1/2)x² + C
```

### Integrate x²

```js
const term = createTerm(1, { x: 2 });
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: 0.333..., var: { x: 3 } }
// Mathematical: ∫ x² dx = (1/3)x³ + C
```

### Integrate 3x²

```js
const term = createTerm(3, { x: 2 });
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: 1, var: { x: 3 } }
// Mathematical: ∫ 3x² dx = x³ + C
```

### Integrate with Multiple Variables

```js
const term = createTerm(6, { x: 2, y: 1 });
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: 2, var: { x: 3, y: 1 } }
// Mathematical: ∫ 6x²y dx = 2x³y + C
// Note: y is treated as a constant
```

### Integrate with Respect to Different Variable

```js
const term = createTerm(4, { x: 2, y: 1 });
const result = integrateTerm(term, 'y');

console.log(result);
// { coeff: 2, var: { x: 2, y: 2 } }
// Mathematical: ∫ 4x²y dy = 2x²y² + C
// Note: x is treated as a constant
```

### Integrate Negative Coefficient

```js
const term = createTerm(-4, { x: 3 });
const result = integrateTerm(term, 'x');

console.log(result);
// { coeff: -1, var: { x: 4 } }
// Mathematical: ∫ -4x³ dx = -x⁴ + C
```

## Step-by-Step Example

Let's integrate `6x²` with respect to `x`:

```js
const term = createTerm(6, { x: 2 });
const result = integrateTerm(term, 'x');
```

**Step by step:**
1. `newTerm = { coeff: 6, var: { x: 2 } }` (deep cloned)
2. `power = 2` (current power of x)
3. Apply power rule to coefficient:
   - `newTerm.coeff = 6 / (2 + 1) = 6 / 3 = 2`
4. Increment power:
   - `newTerm.var['x'] = 2 + 1 = 3`
5. Return `{ coeff: 2, var: { x: 3 } }`

**Mathematical verification**: `∫ 6x² dx = 6/(2+1) · x^(2+1) = 2x³ + C` ✓

## Power Rule Application

| Original Term | Integration Variable | Result | Mathematical |
|--------------|---------------------|--------|-------------|
| `5` | `x` | `5x` | `∫ 5 dx = 5x` |
| `x` | `x` | `x²/2` | `∫ x dx = x²/2` |
| `x²` | `x` | `x³/3` | `∫ x² dx = x³/3` |
| `3x²` | `x` | `x³` | `∫ 3x² dx = x³` |
| `4x³` | `x` | `x⁴` | `∫ 4x³ dx = x⁴` |
| `2xy` | `x` | `x²y` | `∫ 2xy dx = x²y` |

## Important Notes

**Note on the Constant of Integration (+C):**
- This function returns the antiderivative without the constant
- In calculus, indefinite integrals always have `+ C`
- This is typically added separately when needed

**Limitation:**
- Does NOT handle `x^(-1)` (which integrates to `ln|x|`)
- Only works for polynomial terms where `n ≠ -1`

## Why Deep Clone?

```js
const newTerm = deepClone(term);
```

Without deep cloning, modifying the result would affect the original:

```js
const original = createTerm(3, { x: 2 });
const integrated = integrateTerm(original, 'x');

// Without deep clone, this would also change 'original'
integrated.coeff = 999;
```

## Dependencies

This function requires:
- **`deepClone`** — To create an independent copy of the term

## Why Use This?

This function is useful for:

- Symbolic integration of polynomial terms
- Building calculus calculators
- Finding antiderivatives programmatically
- Creating computer algebra systems
- Educational tools for learning calculus
- Solving integration problems step-by-step