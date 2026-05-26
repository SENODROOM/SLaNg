# simplifyFraction

Combine like terms in a fraction's numerator to simplify the expression.

## The Code

```js
/**
 * Combine like terms in a fraction's numerator
 */
function simplifyFraction(fraction) {
    const termMap = new Map();

    for (let term of fraction.numi.terms) {
        // Create a key from variables
        const varKey = term.var ? JSON.stringify(term.var) : 'constant';

        if (termMap.has(varKey)) {
            // Add coefficients of like terms
            termMap.get(varKey).coeff += term.coeff;
        } else {
            termMap.set(varKey, deepClone(term));
        }
    }

    // Filter out zero terms
    const simplifiedTerms = Array.from(termMap.values())
        .filter(term => Math.abs(term.coeff) > 1e-10);

    return {
        numi: { terms: simplifiedTerms },
        deno: fraction.deno
    };
}
```

## Line-by-Line Explanation

```js
function simplifyFraction(fraction) {
```
- **`fraction`** — A fraction object with `numi` (numerator) and `deno` (denominator)

```js
    const termMap = new Map();
```
- Create a **Map** to store terms grouped by their variables
- **Map** — A key-value data structure that preserves insertion order
- **Purpose**: Group terms with the same variables so we can combine them

```js
    for (let term of fraction.numi.terms) {
```
- Loop through each term in the numerator

```js
        const varKey = term.var ? JSON.stringify(term.var) : 'constant';
```
- Create a unique key for this term based on its variables
- **`term.var ?`** — If variables exist, use them
- **`JSON.stringify(term.var)`** — Convert variables object to string (e.g., `{"x":2,"y":1}`)
- **`: 'constant'`** — If no variables, use the string `'constant'`
- **Why?** Terms with identical variables can be combined (like terms)

```js
        if (termMap.has(varKey)) {
```
- Check if we've already seen a term with these exact same variables
- **`termMap.has(varKey)`** — Returns true if this key exists in the Map

```js
            termMap.get(varKey).coeff += term.coeff;
```
- If we found a like term, add the coefficients together
- **`termMap.get(varKey)`** — Retrieve the existing term
- **`.coeff +=`** — Add the current term's coefficient to it
- Example: `3x²` and `5x²` become `8x²`

```js
        } else {
```
- If this is the first term with these variables

```js
            termMap.set(varKey, deepClone(term));
```
- Store a deep copy of the term in the Map
- **`deepClone(term)`** — Create independent copy to avoid mutation
- **`termMap.set(key, value)`** — Add new entry to the Map

```js
        }
    }
```
- Close the if-else and for loop

```js
    const simplifiedTerms = Array.from(termMap.values())
```
- Convert the Map values back to an array
- **`termMap.values()`** — Get all term objects from the Map
- **`Array.from()`` — Convert the Map values iterator to an array

```js
        .filter(term => Math.abs(term.coeff) > 1e-10);
```
- Filter out terms that are effectively zero
- **`Math.abs(term.coeff)`** — Absolute value of coefficient
- **`> 1e-10`** — Greater than 0.0000000001 (accounts for floating-point errors)
- **Why?** Removes terms like `0.00000000001x²` that should be zero

```js
    return {
```
- Return a new fraction object

```js
        numi: { terms: simplifiedTerms },
```
- Create new numerator with the simplified terms

```js
        deno: fraction.deno
```
- Keep the denominator unchanged

```js
    };
```
- Close the return object

```js
}
```
- Close the function

## How It Works

The function simplifies a fraction by:

1. Creating a Map to group terms by their variables
2. For each term:
   - Generate a unique key based on its variables
   - If a term with the same variables exists, add coefficients
   - Otherwise, store the new term
3. Convert the Map back to an array
4. Filter out terms with coefficients close to zero
5. Return the fraction with simplified numerator

**Formula**: `3x² + 5x² + 2x = 8x² + 2x` (combine like terms)

## Usage Examples

### Combine Like Terms

```js
const numerator = [
    createTerm(3, { x: 2 }),   // 3x²
    createTerm(5, { x: 2 }),   // 5x²
    createTerm(2, { x: 1 })    // 2x
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 8, var: { x: 2 } },   // 8x²
//       { coeff: 2, var: { x: 1 } }    // 2x
//     ]
//   },
//   deno: 1
// }
// Mathematical: 3x² + 5x² + 2x = 8x² + 2x
```

### Combine Constants

```js
const numerator = [
    createTerm(5),
    createTerm(3),
    createTerm(-2)
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 6 }   // 5 + 3 - 2 = 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: 5 + 3 - 2 = 6
```

### Mixed Terms

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(4, { x: 2 }),   // Like term with first
    createTerm(5),
    createTerm(-2, { x: 1 }),  // Like term with second
    createTerm(1)               // Like term with fifth
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 6, var: { x: 2 } },   // 2x² + 4x² = 6x²
//       { coeff: 1, var: { x: 1 } },   // 3x - 2x = x
//       { coeff: 6 }                    // 5 + 1 = 6
//     ]
//   },
//   deno: 1
// }
// Mathematical: 2x² + 3x + 4x² + 5 - 2x + 1 = 6x² + x + 6
```

### Remove Zero Terms

```js
const numerator = [
    createTerm(5, { x: 2 }),
    createTerm(-5, { x: 2 }),  // Cancels out
    createTerm(3)
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 3 }   // Only constant remains
//     ]
//   },
//   deno: 1
// }
// Mathematical: 5x² - 5x² + 3 = 3
```

### Multiple Variables

```js
const numerator = [
    createTerm(2, { x: 2, y: 1 }),
    createTerm(3, { x: 2, y: 1 }),  // Like term
    createTerm(4, { x: 1, y: 2 }),
    createTerm(5, { x: 1, y: 2 })   // Like term
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 5, var: { x: 2, y: 1 } },   // 2x²y + 3x²y = 5x²y
//       { coeff: 9, var: { x: 1, y: 2 } }    // 4xy² + 5xy² = 9xy²
//     ]
//   },
//   deno: 1
// }
```

### Already Simplified (No Change)

```js
const numerator = [
    createTerm(3, { x: 2 }),
    createTerm(2, { x: 1 }),
    createTerm(5)
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: {
//     terms: [
//       { coeff: 3, var: { x: 2 } },
//       { coeff: 2, var: { x: 1 } },
//       { coeff: 5 }
//     ]
//   },
//   deno: 1
// }
// Mathematical: 3x² + 2x + 5 (already simplified)
```

### Floating Point Cleanup

```js
const numerator = [
    createTerm(1, { x: 1 }),
    createTerm(-1, { x: 1 }),
    createTerm(0.0000000001, { x: 2 })  // Effectively zero
];
const fraction = createFraction(numerator, 1);

const result = simplifyFraction(fraction);

console.log(result);
// {
//   numi: { terms: [] },
//   deno: 1
// }
// All terms cancel out or are too small
```

## Step-by-Step Example

Let's simplify `(2x² + 3x + 4x² - x + 5)/2`:

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(4, { x: 2 }),
    createTerm(-1, { x: 1 }),
    createTerm(5)
];
const fraction = createFraction(numerator, 2);

const result = simplifyFraction(fraction);
```

**Step by step:**
1. Create empty Map: `termMap = {}`
2. Process `2x²`:
   - `varKey = '{"x":2}'`
   - Map doesn't have this key
   - Store: `termMap['{"x":2}'] = { coeff: 2, var: { x: 2 } }`
3. Process `3x`:
   - `varKey = '{"x":1}'`
   - Store: `termMap['{"x":1}'] = { coeff: 3, var: { x: 1 } }`
4. Process `4x²`:
   - `varKey = '{"x":2}'` (same as step 2!)
   - Map has this key
   - Add: `termMap['{"x":2}'].coeff = 2 + 4 = 6`
5. Process `-x`:
   - `varKey = '{"x":1}'` (same as step 3!)
   - Add: `termMap['{"x":1}'].coeff = 3 + (-1) = 2`
6. Process `5`:
   - `varKey = 'constant'`
   - Store: `termMap['constant'] = { coeff: 5 }`
7. Convert Map to array and filter
8. Result: `[{ coeff: 6, var: { x: 2 } }, { coeff: 2, var: { x: 1 } }, { coeff: 5 }]`

**Mathematical verification**: `(2x² + 3x + 4x² - x + 5)/2 = (6x² + 2x + 5)/2` ✓

## Why Use JSON.stringify for Keys?

```js
const varKey = term.var ? JSON.stringify(term.var) : 'constant';
```

**Problem**: Objects can't be used as Map keys directly in a meaningful way.

```js
const obj1 = { x: 2 };
const obj2 = { x: 2 };
obj1 === obj2  // false (different objects)
```

**Solution**: Convert to string representation.

```js
JSON.stringify({ x: 2, y: 1 })  // '{"x":2,"y":1}'
JSON.stringify({ x: 2, y: 1 })  // Same string!
```

This allows us to group terms with identical variables.

## Floating Point Threshold

```js
.filter(term => Math.abs(term.coeff) > 1e-10)
```

**Why 1e-10 (0.0000000001)?**
- Floating-point arithmetic can introduce tiny errors
- `0.1 + 0.2 = 0.30000000000000004` in JavaScript
- Terms like `0.00000000001` should be treated as zero

**Examples**:
- `0.5` → kept (> 1e-10)
- `0.001` → kept (> 1e-10)
- `1e-15` → removed (< 1e-10)
- `-0.5` → kept (|−0.5| > 1e-10)

## Like Terms Definition

**Like terms** have the same variables with the same exponents:

| Term 1 | Term 2 | Like Terms? | Result |
|--------|--------|-------------|--------|
| `3x²` | `5x²` | ✓ Yes | `8x²` |
| `2x` | `7x` | ✓ Yes | `9x` |
| `4x²` | `4x` | ✗ No | Cannot combine |
| `3xy` | `5xy` | ✓ Yes | `8xy` |
| `2x²y` | `3xy²` | ✗ No | Cannot combine |
| `5` | `3` | ✓ Yes | `8` |

## Dependencies

This function requires:
- **`deepClone`** — To create independent copies of terms

## Why Use This?

This function is useful for:

- Cleaning up expressions after mathematical operations
- Combining like terms in algebra
- Simplifying polynomials
- Reducing expression complexity
- Making expressions more readable
- Preparing expressions for further operations
- Educational tools for teaching algebra