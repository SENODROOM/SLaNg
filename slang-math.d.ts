export interface Term {
    coeff: number;
    var?: Record<string, number>;
}

export interface Fraction {
    numi: { terms: Term[] };
    deno: number | { terms: Term[] };
}

// Function Signatures [cite: 51]
export function createTerm(coeff: number, vars?: Record<string, number>): Term;
export function createFraction(numiTerms: Term[], denoTerms: number | Term[]): Fraction;
export function differentiateFraction(frac: Fraction, variable: string): Fraction;
export function integrateFraction(frac: Fraction, variable: string): Fraction;
export function numericalIntegrateFraction(frac: Fraction, variable: string, a: number, b: number): number;
export function evaluateFraction(frac: Fraction, vars: Record<string, number>): number;
export function simplifyFraction(frac: Fraction): Fraction;
export function slangToLatex(expr: any, options?: any): string;
export function latexToSlang(latex: string, options?: any): any;
export function gradient(expr: any, vars: string[]): any;
export function hessian(expr: any, vars: string[]): any;
export function lagrangeMultipliers(f: any, g: any, vars: string[]): any;
export function tangentPlane(expr: any, point: Record<string, number>): any;