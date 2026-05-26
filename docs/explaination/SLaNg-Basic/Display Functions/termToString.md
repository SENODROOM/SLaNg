# termToString

Convert a term object to a human-readable string representation.

## The Code

```js
/**
 * Convert term to readable string
 */
function termToString(term) {
    let str = term.coeff.toString();

    if (term.var) {
        for (let [variable, power] of Object.entries(term.var)) {
            str += `*${variable}`;
            if (power !== 1) {
                str += `^${power}`;
            }
        }
    }

    return str;
}
```

## Line-by-Line Explanation

```js
function termToString(term) {
```
- **`term`** — A term object with coefficient and optional variables

```js
    let str = term.coeff.toString();
```
- Initialize string with the coefficient
- **`.toString()`** — Converts number to string
- Example: `3` becomes `"3"`, `2.5` becomes `"2.5"`

```js
    if (term.var) {
```
- Check if the term has variables
- If no variables, just return the coefficient string (constant term)

```js
        for (let [variable, power] of Object.entries(term.var)) {
```
- Loop through each variable and its power
- **`Object.entries(term.var)`** — Converts `{x: 2, y: 1}` to `[['x', 2], ['y', 1]]`
- **`[variable, power]`** — Destructure into variable name and exponent

```js
            str += `*${variable}`;
```
- Append the variable to the string with a multiplication sign
- **Template literal**: `*${variable}` → `*x`, `*y`, etc.
- Example: `"3"` becomes `"3*x"`

```js
            if (power !== 1) {
```
- Check if the power is not 1
- For power = 1, we write `x` not `x^1`

```js
                str += `^${power}`;
```
- Append the power with a caret (^) symbol
- **Template literal**: `^${power}` → `^2`, `^3`, etc.
- Example: `"3*x"` becomes `"3*x^2"`

```js
            }
        }
    }
```
- Close all control structures

```js
    return str;
```
- Return the completed string

```js
}
```
- Close the function

## How It Works

The function builds a string representation by:

1. Starting with the coefficient as a string
2. If variables exist, append each one:
   - Add `*` (multiplication sign)
   - Add the variable name
   - If power ≠ 1, add `^power`
3. Return the complete string

**Format**: `coefficient*variable1^power1*variable2^power2...`

## Usage Examples

### Constant Term

```js
const term = createTerm(5);
const result = termToString(term);

console.log(result);
// "5"
// No variables, just the coefficient
```

### Simple Variable

```js
const term = createTerm(3, { x: 1 });
const result = termToString(term);

console.log(result);
// "3*x"
// Power is 1, so no ^1 shown
```

### Variable with Exponent

```js
const term = createTerm(2, { x: 2 });
const result = termToString(term);

console.log(result);
// "2*x^2"
```

### Multiple Variables

```js
const term = createTerm(6, { x: 2, y: 1 });
const result = termToString(term);

console.log(result);
// "6*x^2*y"
// Note: y has power 1, so no ^1
```

### Complex Term

```js
const term = createTerm(4, { x: 3, y: 2, z: 1 });
const result = termToString(term);

console.log(result);
// "4*x^3*y^2*z"
```

### Negative Coefficient

```js
const term = createTerm(-5, { x: 2 });
const result = termToString(term);

console.log(result);
// "-5*x^2"
```

### Fractional Coefficient

```js
const term = createTerm(0.5, { x: 1 });
const result = termToString(term);

console.log(result);
// "0.5*x"
```

### Coefficient of 1

```js
const term = createTerm(1, { x: 2 });
const result = termToString(term);

console.log(result);
// "1*x^2"
// Note: Shows 1, doesn't hide it
```

### Zero Coefficient

```js
const term = createTerm(0);
const result = termToString(term);

console.log(result);
// "0"
```

### High Exponent

```js
const term = createTerm(2, { x: 10 });
const result = termToString(term);

console.log(result);
// "2*x^10"
```

## String Format Examples

| Term Object | String Output | Mathematical |
|------------|---------------|--------------|
| `{ coeff: 5 }` | `"5"` | 5 |
| `{ coeff: 3, var: { x: 1 } }` | `"3*x"` | 3x |
| `{ coeff: 2, var: { x: 2 } }` | `"2*x^2"` | 2x² |
| `{ coeff: 6, var: { x: 2, y: 1 } }` | `"6*x^2*y"` | 6x²y |
| `{ coeff: -4, var: { x: 3 } }` | `"-4*x^3"` | -4x³ |
| `{ coeff: 1, var: { x: 1, y: 1, z: 1 } }` | `"1*x*y*z"` | xyz |

## Why Use `*` and `^`?

**`*` for multiplication**:
- Clear and unambiguous
- Standard in programming/calculators
- Example: `3*x` is clearer than `3x` in text

**`^` for exponentiation**:
- Standard in many programming languages
- Easy to type on keyboard
- Example: `x^2` represents x²

## Variable Ordering

The order of variables depends on the JavaScript object key order:

```js
const term = createTerm(1, { z: 1, a: 1, x: 1 });
termToString(term);
// Order might be: "1*z*a*x" or "1*a*x*z"
// Depends on JavaScript engine
```

For consistent ordering, you could sort the variables:
```js
// Modified version (not in original code)
Object.entries(term.var).sort().forEach(...)
```

## Special Cases

### Power = 0

```js
const term = { coeff: 3, var: { x: 0 } };
termToString(term);
// "3*x^0"
// Note: x^0 = 1, so this is mathematically "3"
```

This shouldn't normally occur since `x^0 = 1` should be simplified out.

### Power = 1 (Not Shown)

```js
const term = createTerm(2, { x: 1 });
termToString(term);
// "2*x"  (NOT "2*x^1")
```

This is correct mathematical notation.

## Comparison with Mathematical Notation

| Code Output | Mathematical Notation |
|-------------|---------------------|
| `"3*x^2"` | 3x² |
| `"2*x*y"` | 2xy |
| `"-5*x^3"` | -5x³ |
| `"1*x*y*z"` | xyz |

The function uses programming-style notation rather than pure mathematical notation.

## Use Cases

This function is useful for:

- Debugging (viewing term contents)
- Logging mathematical operations
- Displaying results to users
- Testing and verification
- Converting to calculator-style input
- Generating human-readable output

## Limitations

**Does NOT handle**:
- Pretty printing with unicode (², ³, ⁴)
- LaTeX formatting
- Hiding coefficient of 1
- Alphabetical variable ordering
- Negative exponents

**Example improvements** (not in original):
```js
// Could be enhanced to:
"3*x^2" → "3x²"  // Unicode superscript
"1*x"   → "x"    // Hide coefficient 1
"-1*x"  → "-x"   // Simplify negative 1
```

## Dependencies

This function has:
- **No dependencies** — Pure string manipulation

## Why Use This?

This function is useful for:

- Displaying terms in readable format
- Debugging term objects
- Logging calculation steps
- Converting internal representation to user-friendly text
- Testing term creation and manipulation
- Educational tools showing algebraic expressions