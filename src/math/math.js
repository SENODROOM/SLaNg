/**
 * slang-math.js  —  SLaNg Central Export Hub
 * ─────────────────────────────────────────────
 * Saad's Language for Analytical Numerics and Geometry
 *
 * Import everything from a single entry point:
 *
 *   import { createFraction, symDiff, rk4, svd, describe, C } from './slang-math.js';
 *
 * ─── Original Modules ────────────────────────────────────────────────────────
 *  slang-basic.js       Core polynomial/fraction engine
 *  slang-advanced.js    Taylor, limits, arc length, Lagrange multipliers
 *  slang-helpers.js     High-level builder utilities
 *  slang-convertor.js   Bidirectional LaTeX ↔ SLaNg converter
 *  slang-extended.js    Extended functions + multivariable calculus
 *  slang-cache.js       LRU caching + performance monitoring
 *  slang-errors.js      Typed error classes
 *
 * ─── New Modules ─────────────────────────────────────────────────────────────
 *  slang-symbolic.js    Full symbolic calculus engine
 *                         · Chain/product/quotient rule differentiation
 *                         · Symbolic antiderivatives (trig, exp, log, powers)
 *                         · Taylor/Maclaurin series
 *                         · L'Hôpital limits
 *                         · Gradient, Hessian, implicit differentiation
 *                         · Critical point classification
 *                         · LaTeX rendering of symbolic expressions
 *
 *  slang-ode.js         ODE & PDE solvers
 *                         · Euler, Heun, RK4, adaptive RK45
 *                         · Implicit Euler, Crank-Nicolson (stiff)
 *                         · Systems of ODEs, 2nd-order ODEs
 *                         · Phase portraits, equilibria finder
 *                         · Shooting method (BVP)
 *                         · 1D Heat equation, Wave equation, Laplace/Poisson
 *                         · Event detection (zero crossings)
 *
 *  slang-linalg.js      Linear algebra
 *                         · LU, QR, Cholesky decompositions
 *                         · SVD, pseudo-inverse, null space, rank
 *                         · Least squares, conjugate gradient
 *                         · Eigenvalues (QR algorithm), power iteration
 *                         · Numerical Jacobian, Hessian, gradient
 *                         · Newton-Raphson, gradient descent
 *                         · PCA, rotation matrices, tridiagonal solver
 *
 *  slang-stats.js       Statistics & probability
 *                         · Descriptive statistics (mean, variance, skewness…)
 *                         · Distributions: Normal, t, χ², Poisson, Binomial,
 *                           Gamma, Beta, Weibull, Log-Normal, Exponential
 *                         · Hypothesis tests: z, t (one & two sample), χ²
 *                         · Mann-Whitney U (nonparametric)
 *                         · Bayesian conjugate updates (Beta-Binomial, Normal)
 *                         · Bootstrap confidence intervals
 *                         · Effect size (Cohen's d), power/sample-size analysis
 *                         · Pearson & Spearman correlation, covariance matrix
 *                         · Linear & polynomial regression
 *                         · Monte Carlo integration & sampling
 *
 *  slang-complex.js     Complex number analysis
 *                         · Arithmetic, polar form, complex functions
 *                         · Nth roots, polynomial roots (Aberth-Ehrlich)
 *                         · Contour & circle integrals, residues
 *                         · Cauchy-Riemann equations, analyticity check
 *                         · Möbius transformations, conformal maps
 *                         · Power series, radius of convergence
 *                         · Joukowski transform
 *                         · FFT / IFFT (Cooley-Tukey)
 *                         · Quaternions (Hamilton product, SLERP, rotations)
 */

// ── Original modules ──────────────────────────────────────────────────────────
export * from './slang-basic.js';
export * from './slang-advanced.js';
export * from './slang-helpers.js';
export * from './slang-convertor.js';
export * from './slang-extended.js';
export * from './slang-cache.js';
export * from './slang-errors.js';

// ── New modules ───────────────────────────────────────────────────────────────
export * from './slang-symbolic.js';
export * from './slang-ode.js';
export * from './slang-linalg.js';
export * from './slang-stats.js';
export * from './slang-complex.js';
