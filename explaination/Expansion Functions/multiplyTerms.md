# multiplyTerms

Multiply two terms together by multiplying coefficients and adding exponents of like variables.

## The Code

```js
/**
 * Multiply two terms together
 */
function multiplyTerms(term1, term2) {
    const result = {
        coeff: term1.coeff * term2.coeff
    };

    // Combine variables (add exponents for same variable)
    const vars = {};

    if (term1.var) {
        for (let [v, pow] of Object.entries(term1.var)) {
            vars[v] = pow;
        }
    }

    if (term2.var) {
        for (let [v, pow] of Object.entries(term2.var)) {
            vars[v] = (vars[v] || 0) + pow;
        }
    }

    if (Object.keys(vars).length > 0) {
        result.var = vars;
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function multiplyTerms(term1, term2) {
```
- **`term1`** — First term to multiply
- **`term2`** — Second term to multiply

```js
    const result = {
        coeff: term1.coeff * term2.coeff
    };
```
- Create result object starting with the coefficient
- **Multiply coefficients**: `(3x)(2y) → coefficient = 3 × 2 = 6`
- Initialize result with just the coefficient product

```js
    const vars = {};
```
- Create empty object to store combined variables
- Will hold the sum of exponents for each variable

```js
    if (term1.var) {
```
- Check if first term has variables

```js
        for (let [v, pow] of Object.entries(term1.var)) {
```
- Loop through each variable in the first term
- **`Object.entries()`** — Converts `{x: 2, y: 1}` to `[['x', 2], ['y', 1]]`
- **`[v, pow]`** — Destructure into variable name and its power

```js
            vars[v] = pow;
```
- Copy the variable and its power to the `vars` object
- Example: `{x: 2}` gets copied to `vars`

```js
        }
    }
```
- Close the loop and if statement

```js
    if (term2.var) {
```
- Check if second term has variables

```js
        for (let [v, pow] of Object.entries(term2.var)) {
```
- Loop through each variable in the second term

```js
            vars[v] = (vars[v] || 0) + pow;
```
- **`vars[v] || 0`** — Get existing power or 0 if variable not present
- **`+ pow`** — Add the power from term2
- **Exponent addition rule**: `x² × x³ = x^(2+3) = x⁵`
- If variable exists in both terms, powers are added
- If variable only in term2, it's added with its power

```js
        }
    }
```
- Close the loop and if statement

```js
    if (Object.keys(vars).length > 0) {
```
- Check if we have any variables in the result
- **`Object.keys(vars).length`** — Count number of variables

```js
        result.var = vars;
```
- Add variables object to the result
- Only add if there are variables (don't add empty object)

```js
    }
```
- Close the if statement

```js
    return result;
```
- Return the result term

```js
}
```
- Close the function

## How It Works

The function multiplies terms using these algebraic rules:

1. **Coefficient rule**: Multiply the coefficients
   - `(3x)(2y) → 3 × 2 = 6`

2. **Exponent rule**: Add exponents of like bases
   - `x² × x³ = x^(2+3) = x⁵`

3. **Different variables**: Keep both
   - `x² × y³ = x²y³`

**Formula**: `(c₁·x^a·y^b) × (c₂·x^c·y^d) = (c₁·c₂)·x^(a+c)·y^(b+d)`

## Usage Examples

### Multiply Constants

```js
const term1 = createTerm(3);
const term2 = createTerm(4);

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 12 }
// Mathematical: 3 × 4 = 12
```

### Multiply Simple Variables

```js
const term1 = createTerm(2, { x: 1 });
const term2 = createTerm(3, { x: 1 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 6, var: { x: 2 } }
// Mathematical: 2x × 3x = 6x²
```

### Multiply with Exponents

```js
const term1 = createTerm(1, { x: 2 });
const term2 = createTerm(1, { x: 3 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 1, var: { x: 5 } }
// Mathematical: x² × x³ = x⁵
```

### Multiply Different Variables

```js
const term1 = createTerm(2, { x: 2 });
const term2 = createTerm(3, { y: 1 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 6, var: { x: 2, y: 1 } }
// Mathematical: 2x² × 3y = 6x²y
```

### Multiply Multiple Variables

```js
const term1 = createTerm(4, { x: 2, y: 1 });
const term2 = createTerm(3, { x: 1, z: 2 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 12, var: { x: 3, y: 1, z: 2 } }
// Mathematical: 4x²y × 3xz² = 12x³yz²
// Note: x: 2+1=3, y: 1+0=1, z: 0+2=2
```

### Multiply with Constant

```js
const term1 = createTerm(5, { x: 2 });
const term2 = createTerm(2);

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 10, var: { x: 2 } }
// Mathematical: 5x² × 2 = 10x²
```

### Negative Coefficients

```js
const term1 = createTerm(-3, { x: 1 });
const term2 = createTerm(4, { x: 2 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: -12, var: { x: 3 } }
// Mathematical: -3x × 4x² = -12x³
```

### Fractional Coefficients

```js
const term1 = createTerm(0.5, { x: 1 });
const term2 = createTerm(4, { x: 1 });

const result = multiplyTerms(term1, term2);

console.log(result);
// { coeff: 2, var: { x: 2 } }
// Mathematical: 0.5x × 4x = 2x²
```

## Step-by-Step Example

Let's multiply `3x²y` by `4xy³`:

```js
const term1 = createTerm(3, { x: 2, y: 1 });
const term2 = createTerm(4, { x: 1, y: 3 });

const result = multiplyTerms(term1, term2);
```

**Step by step:**
1. Create result with coefficient:
   - `result.coeff = 3 × 4 = 12`
2. Initialize `vars = {}`
3. Copy variables from term1:
   - `vars = { x: 2, y: 1 }`
4. Process variables from term2:
   - For `x`: `vars['x'] = (2 || 0) + 1 = 3`
   - For `y`: `vars['y'] = (1 || 0) + 3 = 4`
5. Final vars: `{ x: 3, y: 4 }`
6. Add vars to result
7. Return `{ coeff: 12, var: { x: 3, y: 4 } }`

**Mathematical verification**: `3x²y × 4xy³ = (3×4)(x^(2+1))(y^(1+3)) = 12x³y⁴` ✓

## Exponent Addition Rules

| Term 1 | Term 2 | Result | Explanation |
|--------|--------|--------|-------------|
| `x²` | `x³` | `x⁵` | Same variable: add exponents (2+3) |
| `x²` | `y³` | `x²y³` | Different variables: keep both |
| `x²y` | `xy²` | `x³y³` | Both variables: add each (x: 2+1, y: 1+2) |
| `3x` | `2x` | `6x²` | Multiply coefficients (3×2=6), add exponents (1+1=2) |
| `5` | `3` | `15` | Constants: just multiply |

## Why Use `||` for Default Value?

```js
vars[v] = (vars[v] || 0) + pow;
```

**Purpose**: Handle variables that exist in only one term.

**Example**:
- `term1 = 3xy` has `{x: 1, y: 1}`
- `term2 = 2xz` has `{x: 1, z: 1}`
- When processing `z` from term2:
  - `vars['z']` is undefined (doesn't exist yet)
  - `vars['z'] || 0` evaluates to `0`
  - `0 + 1 = 1` sets `z: 1`

## Important Note: No Deep Clone

```js
const result = {
    coeff: term1.coeff * term2.coeff
};
```

This function creates a new result object, so it doesn't mutate the input terms. However, it doesn't use `deepClone` because it's building a completely new term from scratch.

## Algebraic Laws Applied

1. **Commutative Law**: `a × b = b × a`
   ```js
   multiplyTerms(term1, term2) === multiplyTerms(term2, term1)
   ```

2. **Product of Powers**: `x^a × x^b = x^(a+b)`
   ```js
   x² × x³ → x: 2+3 = 5 → x⁵
   ```

3. **Coefficient Multiplication**: `(a·x)(b·y) = (a·b)·xy`
   ```js
   (3x)(4y) → coeff: 3×4 = 12 → 12xy
   ```

## Why Use This?

This function is useful for:

- Expanding polynomial expressions
- Implementing the FOIL method
- Multiplying algebraic terms
- Building computer algebra systems
- Simplifying products
- Educational tools for teaching algebra
- Calculating polynomial products

## Dependencies

This function has:
- **No dependencies** — It's a standalone function that creates new objects