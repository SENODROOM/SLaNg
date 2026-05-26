# batchConvertToLatex

Converts multiple SLaNg expressions to LaTeX format efficiently.

## Purpose
Process arrays of SLaNg expressions in batch with error handling and progress tracking.

## Features
- Bulk conversion processing
- Individual error handling
- Progress tracking
- Detailed result reporting

## Usage
```js
const expressions = [/* array of SLaNg expressions */];
const results = batchConvertToLatex(expressions, { includeErrors: true });
// Returns: { results: [...], errors: [...] }
```
