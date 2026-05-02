// slang-preprocessor.js
// Jahanzaib Subhani
// Converts user input (math expressions) into SLaNg-compatible objects

function createTerm(coeff, vars = {}) {
  return { coeff, var: vars };
}

function createFraction(numeratorTerms, denominatorTerms) {
  const numi = { terms: numeratorTerms };
  const deno = typeof denominatorTerms === "number"
    ? denominatorTerms
    : { terms: denominatorTerms };
  return { numi, deno };
}

function parseSingleTerm(termStr) {
  const s = termStr.trim();
  if (!s) return null;

  const vars = {};
  let remaining = s;
  let coeff = null;

  const coeffMatch = remaining.match(/^([+-]?\d*\.?\d+)/);
  if (coeffMatch) {
    coeff = parseFloat(coeffMatch[1]);
    remaining = remaining.slice(coeffMatch[1].length);
  }

  const varPattern = /([a-zA-Z])(?:\^(\d+))?/g;
  let m;
  while ((m = varPattern.exec(remaining)) !== null) {
    vars[m[1]] = m[2] ? parseInt(m[2]) : 1;
  }

  if (coeff === null) {
    coeff = s.startsWith("-") ? -1 : 1;
  }

  if (Object.keys(vars).length === 0 && coeff === null) {
    coeff = parseFloat(s);
  }

  return createTerm(coeff, vars);
}

function parsePolynomial(exprStr) {
  const rawTokens = exprStr
    .trim()
    .replace(/\s+/g, "")
    .replace(/([+-])/g, "|||$1")
    .split("|||")
    .filter(Boolean);

  return rawTokens.map(parseSingleTerm).filter(Boolean);
}

function stripOuterParens(s) {
  const t = s.trim();
  return t.startsWith("(") && t.endsWith(")") ? t.slice(1, -1).trim() : t;
}

function parseRationalFunction(exprStr) {
  let depth = 0;
  let splitIndex = -1;

  for (let i = 0; i < exprStr.length; i++) {
    const ch = exprStr[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "/" && depth === 0) { splitIndex = i; break; }
  }

  if (splitIndex === -1) {
    return createFraction(parsePolynomial(exprStr), 1);
  }

  const numiTerms = parsePolynomial(stripOuterParens(exprStr.slice(0, splitIndex)));
  const denoTerms = parsePolynomial(stripOuterParens(exprStr.slice(splitIndex + 1)));
  return createFraction(numiTerms, denoTerms);
}

function parseCommand(input) {
  const s = input.trim();

  const diffMatch = s.match(/^diff\((.+),\s*([a-zA-Z])\)$/i);
  if (diffMatch) {
    return {
      command: "differentiate",
      expression: parseExpression(diffMatch[1].trim()),
      variable: diffMatch[2].trim(),
    };
  }

  const intMatch = s.match(/^integrate\((.+),\s*([+-]?\d*\.?\d+),\s*([+-]?\d*\.?\d+)\)$/i);
  if (intMatch) {
    return {
      command: "integrate",
      expression: parseExpression(intMatch[1].trim()),
      lower: parseFloat(intMatch[2]),
      upper: parseFloat(intMatch[3]),
    };
  }

  const evalMatch = s.match(/^evaluate\((.+),\s*([a-zA-Z])\s*=\s*([+-]?\d*\.?\d+)\)$/i);
  if (evalMatch) {
    const point = {};
    point[evalMatch[2]] = parseFloat(evalMatch[3]);
    return {
      command: "evaluate",
      expression: parseExpression(evalMatch[1].trim()),
      point,
    };
  }

  return null;
}

function parseExpression(exprStr) {
  const s = exprStr.trim();
  let depth = 0;
  let hasDivision = false;

  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "/" && depth === 0) { hasDivision = true; break; }
  }

  return hasDivision
    ? parseRationalFunction(s)
    : createFraction(parsePolynomial(s), 1);
}

export function convertToSLaNg(userInput) {
  if (typeof userInput !== "string" || !userInput.trim()) {
    return { type: "error", message: "Empty input." };
  }

  try {
    const cmd = parseCommand(userInput.trim());
    if (cmd) return { type: "command", ...cmd };

    const expr = parseExpression(userInput.trim());
    return { type: "expression", expression: expr };
  } catch (err) {
    return { type: "error", message: err.message };
  }
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("slang-preprocessor.js")) {
  const tests = [
    "2x^2 + 3x - 1",
    "x^3 - 3x",
    "-5x^2 + x + 7",
    "x / (x^2 + 1)",
    "(2x + 3) / (x - 1)",
    "diff(2x^2 + 3x - 1, x)",
    "integrate(x^2, 0, 1)",
    "evaluate(x^2 + 1, x=3)",
    "2x^2y + 3xy - y",
  ];

  for (const t of tests) {
    console.log("INPUT :", t);
    console.log("OUTPUT:", JSON.stringify(convertToSLaNg(t), null, 2));
    console.log("---");
  }
}
