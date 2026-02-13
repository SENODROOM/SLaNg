# deepClone

A simple utility function to create deep copies of objects in JavaScript.

## The Code

```js
/**
 * Deep clone an object to avoid mutation
 * @param {Object} obj - The object to clone
 * @returns {Object} A deep copy of the object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

## How It Works

The function performs cloning in two steps:

1. **`JSON.stringify(obj)`** — Converts the object into a JSON string
2. **`JSON.parse(...)`** — Converts the JSON string back into a new object

This creates a completely new object in memory, breaking all references to the original.

## Usage Examples

### Basic Object

```js
let original = { x: 10 };
let copy = deepClone(original);

copy.x = 50;

console.log(original.x); // 10
console.log(copy.x);     // 50
```

### Nested Object

```js
let obj = { a: { b: 5 } };
let clone = deepClone(obj);

clone.a.b = 100;

console.log(obj.a.b);   // 5
console.log(clone.a.b); // 100
```

### Arrays

```js
let arr = [1, 2, { x: 3 }];
let clonedArr = deepClone(arr);

clonedArr[2].x = 99;

console.log(arr[2].x);       // 3
console.log(clonedArr[2].x); // 99
```

## Why Use Deep Clone?

**Without deep clone** (reference copy):
```js
let a = { x: 10 };
let b = a;  // b points to the same object as a

b.x = 50;
console.log(a.x); // 50 — original changed!
```

**With deep clone** (independent copy):
```js
let a = { x: 10 };
let b = deepClone(a);  // b is a new object

b.x = 50;
console.log(a.x); // 10 — original unchanged
```

## Limitations

This method does **NOT** work correctly with:

- Functions
- `undefined` values
- `Date` objects (converted to strings)
- `Map` and `Set` (converted to `{}`)
- Circular references (throws error)
- Class instances (loses prototype chain)
- `Symbol` values
- `NaN` and `Infinity` (become `null`)

### Example

```js
let obj = {
  date: new Date(),
  func: () => console.log('hello'),
  undef: undefined
};

let clone = deepClone(obj);

console.log(clone);
// {
//   date: "2024-01-15T10:30:00.000Z"  // String, not Date
//   // func is missing
//   // undef is missing
// }
```

## Modern Alternative

For modern environments (Node.js 17+, recent browsers), use:

```js
const clone = structuredClone(obj);
```

This handles more data types including `Date`, `Map`, `Set`, and circular references.