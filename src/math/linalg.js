/**
 * SLaNg Linear Algebra Module
 * 
 * Dense matrix and vector operations for use in multivariable calculus,
 * optimization, and numerical methods within SLaNg.
 * 
 * All matrices are represented as 2D arrays: number[][]
 * Vectors are 1D arrays: number[]
 * 
 * Features:
 *  - Matrix creation utilities
 *  - Basic arithmetic (add, sub, mul, scale, transpose)
 *  - Determinant (LU decomposition)
 *  - Matrix inverse (Gauss-Jordan)
 *  - LU decomposition (Doolittle)
 *  - QR decomposition (Gram-Schmidt)
 *  - Eigenvalues / Eigenvectors (Power iteration, QR algorithm)
 *  - Solve linear systems Ax = b
 *  - SVD (numerical, for small-medium matrices)
 *  - Vector operations (dot, cross, norm, normalize, project)
 *  - Jacobian and Hessian numerical approximation
 */

// ============================================================================
// MATRIX CREATION
// ============================================================================

/** Create an m×n zero matrix */
export function zeros(m, n = m) {
    return Array.from({ length: m }, () => new Array(n).fill(0));
}

/** Create an n×n identity matrix */
export function eye(n) {
    const I = zeros(n);
    for (let i = 0; i < n; i++) I[i][i] = 1;
    return I;
}

/** Create a matrix from a flat array (row-major) */
export function fromArray(arr, m, n) {
    if (arr.length !== m * n) throw new Error(`Array length ${arr.length} ≠ ${m}×${n}`);
    return Array.from({ length: m }, (_, i) => arr.slice(i * n, i * n + n));
}

/** Create a diagonal matrix from a vector */
export function diag(v) {
    const n = v.length;
    const D = zeros(n);
    for (let i = 0; i < n; i++) D[i][i] = v[i];
    return D;
}

/** Deep-copy a matrix */
export function matCopy(A) {
    return A.map(row => row.slice());
}

/** Get the shape [rows, cols] of a matrix */
export function shape(A) {
    return [A.length, A[0].length];
}

// ============================================================================
// BASIC MATRIX OPERATIONS
// ============================================================================

/** A + B */
export function matAdd(A, B) {
    const [m, n] = shape(A);
    return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

/** A - B */
export function matSub(A, B) {
    return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

/** α * A */
export function matScale(A, alpha) {
    return A.map(row => row.map(v => v * alpha));
}

/** A * B (matrix multiplication) */
export function matMul(A, B) {
    const [ma, na] = shape(A);
    const [mb, nb] = shape(B);
    if (na !== mb) throw new Error(`Shape mismatch: (${ma},${na}) × (${mb},${nb})`);
    const C = zeros(ma, nb);
    for (let i = 0; i < ma; i++) {
        for (let k = 0; k < na; k++) {
            if (A[i][k] === 0) continue;
            for (let j = 0; j < nb; j++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

/** Aᵀ (transpose) */
export function matT(A) {
    const [m, n] = shape(A);
    return Array.from({ length: n }, (_, j) => Array.from({ length: m }, (_, i) => A[i][j]));
}

/** Matrix-vector product A * v */
export function matvec(A, v) {
    return A.map(row => row.reduce((s, a, j) => s + a * v[j], 0));
}

/** Element-wise (Hadamard) product */
export function matElem(A, B) {
    return A.map((row, i) => row.map((v, j) => v * B[i][j]));
}

// ============================================================================
// VECTOR OPERATIONS
// ============================================================================

/** Dot product */
export function dot(a, b) {
    if (a.length !== b.length) throw new Error('Vector length mismatch');
    return a.reduce((s, v, i) => s + v * b[i], 0);
}

/** Cross product (3D only) */
export function cross(a, b) {
    if (a.length !== 3 || b.length !== 3) throw new Error('Cross product requires 3D vectors');
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

/** Euclidean norm of a vector */
export function norm(v) {
    return Math.sqrt(dot(v, v));
}

/** Normalize a vector to unit length */
export function normalize(v) {
    const n = norm(v);
    if (n < 1e-15) throw new Error('Cannot normalize zero vector');
    return v.map(x => x / n);
}

/** Projection of a onto b */
export function project(a, b) {
    const scale = dot(a, b) / dot(b, b);
    return b.map(x => x * scale);
}

/** Vector addition */
export function vecAdd(a, b) { return a.map((v, i) => v + b[i]); }
/** Vector subtraction */
export function vecSub(a, b) { return a.map((v, i) => v - b[i]); }
/** Scalar × vector */
export function vecScale(v, s) { return v.map(x => x * s); }

// ============================================================================
// DETERMINANT AND TRACE
// ============================================================================

/** Trace (sum of diagonal elements) */
export function trace(A) {
    const [m, n] = shape(A);
    if (m !== n) throw new Error('Trace requires square matrix');
    let t = 0;
    for (let i = 0; i < n; i++) t += A[i][i];
    return t;
}

/**
 * Determinant via LU decomposition — O(n³)
 */
export function det(A) {
    const [m, n] = shape(A);
    if (m !== n) throw new Error('Determinant requires square matrix');
    const { L, U, P, sign } = luDecomp(A);
    let d = sign;
    for (let i = 0; i < n; i++) d *= U[i][i];
    return d;
}

// ============================================================================
// LU DECOMPOSITION (with partial pivoting)
// ============================================================================

/**
 * LU decomposition with partial pivoting: PA = LU
 * @returns {{ L, U, P, sign }} where sign = ±1 (parity of permutation)
 */
export function luDecomp(A) {
    const n = A.length;
    let L = eye(n);
    let U = matCopy(A);
    let P = eye(n);
    let sign = 1;

    for (let col = 0; col < n; col++) {
        // Find pivot
        let maxRow = col;
        let maxVal = Math.abs(U[col][col]);
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(U[row][col]) > maxVal) {
                maxVal = Math.abs(U[row][col]);
                maxRow = row;
            }
        }

        if (maxVal < 1e-15) continue; // Singular column

        if (maxRow !== col) {
            [U[col], U[maxRow]] = [U[maxRow], U[col]];
            [P[col], P[maxRow]] = [P[maxRow], P[col]];
            sign = -sign;
            // Also swap lower triangular part
            for (let k = 0; k < col; k++) {
                [L[col][k], L[maxRow][k]] = [L[maxRow][k], L[col][k]];
            }
        }

        for (let row = col + 1; row < n; row++) {
            if (Math.abs(U[col][col]) < 1e-15) continue;
            const factor = U[row][col] / U[col][col];
            L[row][col] = factor;
            for (let k = col; k < n; k++) {
                U[row][k] -= factor * U[col][k];
            }
        }
    }

    return { L, U, P, sign };
}

// ============================================================================
// LINEAR SYSTEM SOLVER
// ============================================================================

/**
 * Solve Ax = b using LU decomposition.
 * @param {number[][]} A - n×n matrix
 * @param {number[]} b - right-hand side
 * @returns {number[]} solution vector x
 */
export function solve(A, b) {
    const n = A.length;
    const { L, U, P } = luDecomp(A);

    // Apply permutation to b
    const pb = matvec(P, b);

    // Forward substitution: Ly = Pb
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
        y[i] = pb[i] - sum;
    }

    // Back substitution: Ux = y
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        if (Math.abs(U[i][i]) < 1e-15) throw new Error('Matrix is singular or nearly singular');
        let sum = 0;
        for (let j = i + 1; j < n; j++) sum += U[i][j] * x[j];
        x[i] = (y[i] - sum) / U[i][i];
    }

    return x;
}

/**
 * Matrix inverse via Gauss-Jordan elimination.
 * @param {number[][]} A
 * @returns {number[][]}
 */
export function inv(A) {
    const n = A.length;
    // Augment [A | I]
    const aug = A.map((row, i) => {
        const r = row.slice();
        for (let j = 0; j < n; j++) r.push(i === j ? 1 : 0);
        return r;
    });

    // Forward elimination with partial pivoting
    for (let col = 0; col < n; col++) {
        // Find pivot
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

        const pivot = aug[col][col];
        if (Math.abs(pivot) < 1e-15) throw new Error('Matrix is singular');

        // Scale pivot row
        for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;

        // Eliminate column
        for (let row = 0; row < n; row++) {
            if (row === col) continue;
            const factor = aug[row][col];
            for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
        }
    }

    return aug.map(row => row.slice(n));
}

// ============================================================================
// QR DECOMPOSITION (Classical Gram-Schmidt)
// ============================================================================

/**
 * QR decomposition using Gram-Schmidt orthogonalization.
 * A = Q * R,  Q orthogonal,  R upper triangular
 * @param {number[][]} A - m×n matrix, m >= n
 * @returns {{ Q: number[][], R: number[][] }}
 */
export function qrDecomp(A) {
    const [m, n] = shape(A);
    const Q = zeros(m, n);
    const R = zeros(n, n);

    for (let j = 0; j < n; j++) {
        // Get column j of A
        let v = A.map(row => row[j]);

        // Subtract projections onto previous Q columns
        for (let i = 0; i < j; i++) {
            const qi = Q.map(row => row[i]);
            R[i][j] = dot(qi, v);
            v = vecSub(v, vecScale(qi, R[i][j]));
        }

        R[j][j] = norm(v);
        if (Math.abs(R[j][j]) < 1e-14) {
            // Linearly dependent column — set to zero
            for (let k = 0; k < m; k++) Q[k][j] = 0;
        } else {
            const u = vecScale(v, 1 / R[j][j]);
            for (let k = 0; k < m; k++) Q[k][j] = u[k];
        }
    }

    return { Q, R };
}

// ============================================================================
// EIGENVALUES & EIGENVECTORS
// ============================================================================

/**
 * QR algorithm for real eigenvalues of a symmetric matrix.
 * Returns eigenvalues sorted in descending order.
 * @param {number[][]} A - symmetric n×n matrix
 * @param {number} [maxIter=1000]
 * @returns {{ eigenvalues: number[], converged: boolean }}
 */
export function eigenvalues(A, maxIter = 1000) {
    let H = matCopy(A);
    const n = H.length;
    let converged = false;

    for (let iter = 0; iter < maxIter; iter++) {
        const { Q, R } = qrDecomp(H);
        H = matMul(R, Q);

        // Check if off-diagonal elements are small
        let offDiag = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) offDiag += H[i][j] * H[i][j];
            }
        }
        if (offDiag < 1e-20) { converged = true; break; }
    }

    const evals = Array.from({ length: n }, (_, i) => H[i][i]);
    evals.sort((a, b) => b - a);
    return { eigenvalues: evals, converged };
}

/**
 * Power iteration to find the dominant eigenvalue and eigenvector.
 * @param {number[][]} A
 * @param {number} [maxIter=1000]
 * @param {number} [tol=1e-10]
 * @returns {{ eigenvalue, eigenvector, iterations }}
 */
export function dominantEigen(A, maxIter = 1000, tol = 1e-10) {
    const n = A.length;
    let v = Array.from({ length: n }, () => Math.random());
    v = normalize(v);

    let lambda = 0, iterations = 0;

    for (let iter = 0; iter < maxIter; iter++) {
        const Av = matvec(A, v);
        const lambdaNew = dot(v, Av);
        const vNew = normalize(Av);

        if (Math.abs(lambdaNew - lambda) < tol) { iterations = iter; break; }
        lambda = lambdaNew;
        v = vNew;
        iterations = iter;
    }

    return { eigenvalue: lambda, eigenvector: v, iterations };
}

// ============================================================================
// NUMERICAL JACOBIAN AND HESSIAN
// ============================================================================

/**
 * Numerical Jacobian of a vector function F: ℝⁿ → ℝᵐ at point x.
 * J[i][j] = ∂F_i/∂x_j
 * @param {Function} F - F(x) → number[]
 * @param {number[]} x - Point
 * @param {number} [h=1e-6]
 * @returns {number[][]}
 */
export function jacobian(F, x, h = 1e-6) {
    const n = x.length;
    const F0 = F(x);
    const m = F0.length;
    const J = zeros(m, n);

    for (let j = 0; j < n; j++) {
        const xh = x.slice();
        xh[j] += h;
        const Fh = F(xh);
        for (let i = 0; i < m; i++) {
            J[i][j] = (Fh[i] - F0[i]) / h;
        }
    }

    return J;
}

/**
 * Numerical Hessian of a scalar function f: ℝⁿ → ℝ at point x.
 * H[i][j] = ∂²f/∂x_i∂x_j  (central differences)
 * @param {Function} f - f(x) → number
 * @param {number[]} x
 * @param {number} [h=1e-4]
 * @returns {number[][]}
 */
export function hessian(f, x, h = 1e-4) {
    const n = x.length;
    const H = zeros(n);

    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            let val;
            if (i === j) {
                // Second-order central difference
                const xp = x.slice(); xp[i] += h;
                const xm = x.slice(); xm[i] -= h;
                val = (f(xp) - 2 * f(x) + f(xm)) / (h * h);
            } else {
                const xpp = x.slice(); xpp[i] += h; xpp[j] += h;
                const xpm = x.slice(); xpm[i] += h; xpm[j] -= h;
                const xmp = x.slice(); xmp[i] -= h; xmp[j] += h;
                const xmm = x.slice(); xmm[i] -= h; xmm[j] -= h;
                val = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4 * h * h);
            }
            H[i][j] = H[j][i] = val;
        }
    }

    return H;
}

/**
 * Numerical gradient of a scalar function at point x.
 * @param {Function} f
 * @param {number[]} x
 * @param {number} [h=1e-6]
 * @returns {number[]}
 */
export function numericalGrad(f, x, h = 1e-6) {
    return x.map((_, i) => {
        const xp = x.slice(); xp[i] += h;
        const xm = x.slice(); xm[i] -= h;
        return (f(xp) - f(xm)) / (2 * h);
    });
}

// ============================================================================
// OPTIMIZATION (Newton's Method, Gradient Descent)
// ============================================================================

/**
 * Newton-Raphson method for finding roots of F(x) = 0.
 * @param {Function} F - F(x) → number[] (system of equations)
 * @param {number[]} x0 - Initial guess
 * @param {number} [tol=1e-10]
 * @param {number} [maxIter=100]
 * @returns {{ x, iterations, converged }}
 */
export function newtonRaphson(F, x0, tol = 1e-10, maxIter = 100) {
    let x = x0.slice();
    let iterations = 0;

    for (let iter = 0; iter < maxIter; iter++) {
        const fx = F(x);
        const residual = norm(fx);
        if (residual < tol) { iterations = iter; return { x, iterations, converged: true }; }

        const J = jacobian(F, x);
        let dx;
        try { dx = solve(J, fx.map(v => -v)); }
        catch { break; }

        x = vecAdd(x, dx);
        iterations = iter;
    }

    return { x, iterations, converged: false };
}

/**
 * Gradient descent optimization to minimize f(x).
 * @param {Function} f
 * @param {number[]} x0
 * @param {Object} [opts]
 * @returns {{ x, fValue, iterations, path }}
 */
export function gradientDescent(f, x0, opts = {}) {
    const { lr = 0.01, maxIter = 1000, tol = 1e-8, recordPath = false } = opts;
    let x = x0.slice();
    const path = recordPath ? [x.slice()] : [];
    let iterations = 0;

    for (let iter = 0; iter < maxIter; iter++) {
        const g = numericalGrad(f, x);
        const gNorm = norm(g);
        if (gNorm < tol) { iterations = iter; break; }

        x = vecSub(x, vecScale(g, lr));
        if (recordPath) path.push(x.slice());
        iterations = iter;
    }

    return { x, fValue: f(x), iterations, path, gradient: numericalGrad(f, x) };
}

// ============================================================================
// MATRIX NORMS AND CONDITION NUMBER
// ============================================================================

/** Frobenius norm */
export function normFrob(A) {
    return Math.sqrt(A.reduce((s, row) => s + row.reduce((rs, v) => rs + v * v, 0), 0));
}

/** Max absolute row sum (∞-norm) */
export function normInf(A) {
    return Math.max(...A.map(row => row.reduce((s, v) => s + Math.abs(v), 0)));
}

/**
 * Estimate condition number κ(A) = ‖A‖ · ‖A⁻¹‖ using Frobenius norm.
 * Large condition number → ill-conditioned system.
 */
export function conditionNumber(A) {
    try {
        const Ainv = inv(A);
        return normFrob(A) * normFrob(Ainv);
    } catch {
        return Infinity;
    }
}

// ============================================================================
// PRETTY PRINTING
// ============================================================================

/**
 * Format a matrix as a string.
 * @param {number[][]} A
 * @param {number} [decimals=4]
 * @returns {string}
 */
export function matToString(A, decimals = 4) {
    const formatted = A.map(row =>
        row.map(v => v.toFixed(decimals).padStart(decimals + 5)).join('  ')
    );
    const width = formatted[0].length + 4;
    const border = '─'.repeat(width);
    return `┌ ${' '.repeat(width - 2)} ┐\n`
        + formatted.map(row => `│ ${row} │`).join('\n')
        + `\n└ ${' '.repeat(width - 2)} ┘`;
}

/**
 * Format a vector as a column string.
 */
export function vecToString(v, decimals = 4) {
    return '[ ' + v.map(x => x.toFixed(decimals)).join(', ') + ' ]';
}


// ============================================================================
// SVD  (Singular Value Decomposition) — one-sided Jacobi
// ============================================================================

/**
 * Thin SVD of A (m×n, m >= n). Returns { U, S, V } where A ≈ U·diag(S)·Vᵀ.
 * S is sorted descending.
 */
export function svd(A) {
    const m = A.length, n = A[0].length;
    let V = eye(n);
    let B = matMul(matT(A), A);
    for (let sweep = 0; sweep < 100; sweep++) {
        let off = 0;
        for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) off += Math.abs(B[p][q]);
        if (off < 1e-14) break;
        for (let p = 0; p < n - 1; p++) {
            for (let q = p + 1; q < n; q++) {
                const bpq = B[p][q];
                if (Math.abs(bpq) < 1e-15) continue;
                const tau = (B[q][q] - B[p][p]) / (2 * bpq);
                const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
                const c = 1 / Math.sqrt(1 + t * t), s = t * c;
                const Bn = B.map(r => r.slice());
                for (let i = 0; i < n; i++) {
                    Bn[i][p] = c * B[i][p] - s * B[i][q];
                    Bn[i][q] = s * B[i][p] + c * B[i][q];
                }
                for (let i = 0; i < n; i++) { Bn[p][i] = Bn[i][p]; Bn[q][i] = Bn[i][q]; }
                Bn[p][p] = c*c*B[p][p] - 2*s*c*bpq + s*s*B[q][q];
                Bn[q][q] = s*s*B[p][p] + 2*s*c*bpq + c*c*B[q][q];
                Bn[p][q] = Bn[q][p] = 0;
                B = Bn;
                const Vn = V.map(r => r.slice());
                for (let i = 0; i < n; i++) {
                    Vn[i][p] = c * V[i][p] - s * V[i][q];
                    Vn[i][q] = s * V[i][p] + c * V[i][q];
                }
                V = Vn;
            }
        }
    }
    const svals = Array.from({ length: n }, (_, j) => Math.sqrt(Math.max(0, B[j][j])));
    const idx = svals.map((_, i) => i).sort((a, b) => svals[b] - svals[a]);
    const S = idx.map(i => svals[i]);
    const Vsorted = idx.map(i => V.map(r => r[i]));
    const Vmat = matT(Vsorted.map(col => col));
    const U = zeros(m, n);
    for (let j = 0; j < n; j++) {
        if (S[j] < 1e-14) continue;
        const vj = Vmat.map(r => r[j]);
        const col = matvec(A, vj);
        for (let i = 0; i < m; i++) U[i][j] = col[i] / S[j];
    }
    return { U, S, V: Vmat };
}

/** Moore-Penrose pseudo-inverse via SVD. */
export function pseudoInverse(A, tol = 1e-12) {
    const { U, S, V } = svd(A);
    const n = V.length, m = U.length;
    const SigPlus = zeros(n, m);
    for (let i = 0; i < Math.min(S.length, n, m); i++)
        SigPlus[i][i] = S[i] > tol ? 1 / S[i] : 0;
    return matMul(V, matMul(SigPlus, matT(U)));
}

/** Matrix rank (number of singular values above tol). */
export function matRank(A, tol = 1e-10) {
    return svd(A).S.filter(s => s > tol).length;
}

/** Null-space basis (columns of V with near-zero singular values). */
export function nullSpace(A, tol = 1e-10) {
    const { S, V } = svd(A);
    return S.map((s, j) => s < tol ? V.map(r => r[j]) : null).filter(Boolean);
}

// ============================================================================
// LEAST SQUARES
// ============================================================================

/**
 * Solve least-squares: minimise ||Ax - b||₂ via pseudo-inverse.
 * @returns {{ x, residual, rank }}
 */
export function leastSquares(A, b) {
    const x = matvec(pseudoInverse(A), b);
    const Ax = matvec(A, x);
    const residual = Math.sqrt(b.reduce((s, bi, i) => s + (bi - Ax[i]) ** 2, 0));
    return { x, residual, rank: matRank(A) };
}

// ============================================================================
// CHOLESKY DECOMPOSITION
// ============================================================================

/**
 * Cholesky decomposition of a symmetric positive-definite matrix.
 * Returns L such that A = L·Lᵀ.
 */
export function cholesky(A) {
    const n = A.length;
    const L = zeros(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            let s = A[i][j];
            for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
            if (i === j) {
                if (s < 0) throw new Error('cholesky: not positive definite');
                L[i][j] = Math.sqrt(s);
            } else {
                L[i][j] = L[j][j] < 1e-14 ? 0 : s / L[j][j];
            }
        }
    }
    return L;
}

/**
 * Solve Ax = b for SPD matrix A using Cholesky.
 * Faster and more stable than LU for SPD systems.
 */
export function choleskySolve(A, b) {
    const L = cholesky(A);
    const n = b.length;
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let s = b[i];
        for (let k = 0; k < i; k++) s -= L[i][k] * y[k];
        y[i] = s / L[i][i];
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let s = y[i];
        for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
        x[i] = s / L[i][i];
    }
    return x;
}

// ============================================================================
// TRIDIAGONAL SOLVER (Thomas Algorithm — O(n))
// ============================================================================

/**
 * Solve tridiagonal system in O(n).
 * @param {number[]} a  subdiagonal (length n-1)
 * @param {number[]} b  main diagonal (length n)
 * @param {number[]} c  superdiagonal (length n-1)
 * @param {number[]} rhs
 */
export function tridiagonalSolve(a, b, c, rhs) {
    const n = b.length;
    const cp = c.slice(), dp = rhs.slice(), bp = b.slice();
    cp[0] = c[0] / bp[0]; dp[0] = rhs[0] / bp[0];
    for (let i = 1; i < n; i++) {
        const denom = bp[i] - a[i - 1] * cp[i - 1];
        cp[i] = i < n - 1 ? c[i] / denom : 0;
        dp[i] = (rhs[i] - a[i - 1] * dp[i - 1]) / denom;
    }
    const x = Array(n).fill(0);
    x[n - 1] = dp[n - 1];
    for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
    return x;
}

// ============================================================================
// ITERATIVE SOLVERS
// ============================================================================

/**
 * Conjugate Gradient — solve Ax = b for SPD A without forming the inverse.
 * Far more efficient than LU for large sparse SPD systems.
 * @returns {{ x, iterations, residualNorm }}
 */
export function conjugateGradient(A, b, tol = 1e-10, maxIter = 1000) {
    const n = b.length;
    let x = Array(n).fill(0);
    let r = b.slice();
    let p = r.slice();
    let rDotR = dot(r, r);
    let iterations = 0;
    for (let k = 0; k < maxIter; k++) {
        const Ap = matvec(A, p);
        const alpha = rDotR / dot(p, Ap);
        x = x.map((xi, i) => xi + alpha * p[i]);
        r = r.map((ri, i) => ri - alpha * Ap[i]);
        const rDotRnew = dot(r, r);
        if (Math.sqrt(rDotRnew) < tol) { iterations = k + 1; break; }
        const beta = rDotRnew / rDotR;
        p = r.map((ri, i) => ri + beta * p[i]);
        rDotR = rDotRnew;
        iterations = k + 1;
    }
    return { x, iterations, residualNorm: Math.sqrt(dot(r, r)) };
}

// ============================================================================
// ROTATION MATRICES
// ============================================================================

/** 2D rotation matrix by angle θ (radians). */
export function rotMat2D(theta) {
    return [[Math.cos(theta), -Math.sin(theta)],
            [Math.sin(theta),  Math.cos(theta)]];
}

/** 3D rotation around X axis. */
export function rotX(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [[1, 0, 0], [0, c, -s], [0, s, c]];
}
/** 3D rotation around Y axis. */
export function rotY(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
}
/** 3D rotation around Z axis. */
export function rotZ(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}

// ============================================================================
// STATISTICS ON MATRICES
// ============================================================================

/** Column means of A as a vector. */
export function colMeans(A) {
    return A[0].map((_, j) => A.reduce((s, r) => s + r[j], 0) / A.length);
}

/** Column-center a matrix (subtract column means). */
export function center(A) {
    const mu = colMeans(A);
    return A.map(row => row.map((v, j) => v - mu[j]));
}

/**
 * PCA via SVD on the centered data matrix.
 * @param {number[][]} X  (n_samples × n_features)
 * @returns {{ components, explainedVariance, explainedVarianceRatio, scores }}
 */
export function pca(X) {
    const Xc = center(X);
    const m = Xc.length;
    const { U, S, V } = svd(Xc);
    const variance = S.map(s => (s * s) / (m - 1));
    const totalVar = variance.reduce((a, b) => a + b, 0);
    const scores = matMul(Xc, V);
    return {
        components: V,
        explainedVariance: variance,
        explainedVarianceRatio: variance.map(v => v / totalVar),
        scores,
        singularValues: S,
    };
}


// ============================================================================
// ITERATIVE EIGENVALUE METHODS
// ============================================================================

/**
 * Inverse power iteration — find eigenvalue closest to a shift σ.
 * Solves (A − σI)⁻¹ v to converge to the eigenvalue nearest to σ.
 *
 * @param {number[][]} A
 * @param {number} sigma   shift (target eigenvalue estimate)
 * @param {number[]} [v0]  initial vector
 * @param {number} [tol=1e-10]
 * @param {number} [maxIter=200]
 * @returns {{ eigenvalue, eigenvector, iterations }}
 */
export function inversePowerIteration(A, sigma, v0, tol = 1e-10, maxIter = 200) {
    const n = A.length;
    const Ashift = A.map((row, i) => row.map((v, j) => v - (i === j ? sigma : 0)));
    let v = (v0 || Array.from({ length: n }, () => Math.random())).slice();
    v = normalize(v);
    let lambda = sigma, iter = 0;
    for (let k = 0; k < maxIter; k++) {
        let w;
        try { w = solve(Ashift, v); } catch { break; }
        const wNorm = norm(w);
        const vNew = w.map(x => x / wNorm);
        // Rayleigh quotient: λ ≈ vᵀ·A·v
        const Av = matvec(A, vNew);
        const lambdaNew = dot(vNew, Av);
        if (Math.abs(lambdaNew - lambda) < tol) { lambda = lambdaNew; v = vNew; iter = k + 1; break; }
        lambda = lambdaNew; v = vNew; iter = k + 1;
    }
    return { eigenvalue: lambda, eigenvector: v, iterations: iter };
}

/**
 * Rayleigh quotient iteration — rapidly converges to nearest eigenvalue.
 * Combines Rayleigh quotient as adaptive shift with inverse iteration.
 */
export function rayleighIteration(A, v0, tol = 1e-12, maxIter = 50) {
    const n = A.length;
    let v = (v0 || Array.from({ length: n }, () => Math.random())).slice();
    v = normalize(v);
    let lambda = dot(v, matvec(A, v));
    for (let k = 0; k < maxIter; k++) {
        const Ashift = A.map((row, i) => row.map((val, j) => val - (i === j ? lambda : 0)));
        let w;
        try { w = solve(Ashift, v); } catch { break; }
        const wNorm = norm(w);
        v = w.map(x => x / wNorm);
        const lambdaNew = dot(v, matvec(A, v));
        if (Math.abs(lambdaNew - lambda) < tol) { lambda = lambdaNew; break; }
        lambda = lambdaNew;
    }
    return { eigenvalue: lambda, eigenvector: v };
}

// ============================================================================
// VECTOR CALCULUS
// ============================================================================

/**
 * Numerical divergence of a vector field F = [F1, F2, F3] at a point.
 * div F = ∂F1/∂x + ∂F2/∂y + ∂F3/∂z
 *
 * @param {Function[]} F   array of scalar functions, one per component
 * @param {number[]} point [x, y, z, ...]
 * @param {number} [h=1e-5]
 */
export function divergence(F, point, h = 1e-5) {
    return F.reduce((sum, Fi, i) => {
        const pp = point.slice(); pp[i] += h;
        const pm = point.slice(); pm[i] -= h;
        return sum + (Fi(pp) - Fi(pm)) / (2 * h);
    }, 0);
}

/**
 * Numerical curl of a 3D vector field F = [F1, F2, F3] at a point.
 * Returns the 3-component curl vector.
 */
export function curl(F, point, h = 1e-5) {
    const d = (fi, xi, xp) => {
        const pp = point.slice(); pp[xi] += h;
        const pm = point.slice(); pm[xi] -= h;
        return (F[fi](pp) - F[fi](pm)) / (2 * h);
    };
    return [
        d(2, 1) - d(1, 2),  // ∂F3/∂y − ∂F2/∂z
        d(0, 2) - d(2, 0),  // ∂F1/∂z − ∂F3/∂x
        d(1, 0) - d(0, 1),  // ∂F2/∂x − ∂F1/∂y
    ];
}

/**
 * Numerical Laplacian (scalar field): ∇²f = sum of second partials.
 */
export function laplacian(f, point, h = 1e-5) {
    return point.reduce((sum, _, i) => {
        const pp = point.slice(); pp[i] += h;
        const pm = point.slice(); pm[i] -= h;
        return sum + (f(pp) - 2 * f(point) + f(pm)) / (h * h);
    }, 0);
}

// ============================================================================
// GRAPH / NETWORK MATRICES
// ============================================================================

/**
 * Build the adjacency matrix from an edge list.
 * @param {[number,number][]} edges  e.g. [[0,1],[1,2],[2,0]]
 * @param {number} n   number of nodes
 * @param {boolean} [directed=false]
 */
export function adjacencyMatrix(edges, n, directed = false) {
    const A = zeros(n, n);
    for (const [u, v] of edges) {
        A[u][v] = 1;
        if (!directed) A[v][u] = 1;
    }
    return A;
}

/**
 * Laplacian matrix L = D − A (graph Laplacian).
 * Eigenvalues reveal connectivity structure (algebraic connectivity = 2nd smallest).
 */
export function laplacianMatrix(edges, n) {
    const A = adjacencyMatrix(edges, n);
    const D = zeros(n, n);
    for (let i = 0; i < n; i++) D[i][i] = A[i].reduce((s, v) => s + v, 0);
    return matSub(D, A);
}

// ============================================================================
// FINITE DIFFERENCE MATRICES
// ============================================================================

/**
 * 1D second-order finite difference matrix (−1, 2, −1) / h².
 * Discretises the Laplacian on n interior points.
 */
export function fdLaplacian1D(n, h = 1) {
    const A = zeros(n, n);
    const scale = 1 / (h * h);
    for (let i = 0; i < n; i++) {
        A[i][i] = 2 * scale;
        if (i > 0)     A[i][i - 1] = -scale;
        if (i < n - 1) A[i][i + 1] = -scale;
    }
    return A;
}

/**
 * 1D first-order central difference matrix for d/dx.
 */
export function fdDerivative1D(n, h = 1) {
    const A = zeros(n, n);
    const scale = 1 / (2 * h);
    for (let i = 1; i < n - 1; i++) {
        A[i][i + 1] =  scale;
        A[i][i - 1] = -scale;
    }
    return A;
}

// ============================================================================
// INTERPOLATION
// ============================================================================

/**
 * Lagrange polynomial interpolation at a query point.
 * @param {number[]} xs  known x values
 * @param {number[]} ys  known y values
 * @param {number} xq   query point
 */
export function lagrangeInterpolate(xs, ys, xq) {
    const n = xs.length;
    let result = 0;
    for (let i = 0; i < n; i++) {
        let Li = 1;
        for (let j = 0; j < n; j++) {
            if (j !== i) Li *= (xq - xs[j]) / (xs[i] - xs[j]);
        }
        result += ys[i] * Li;
    }
    return result;
}

/**
 * Natural cubic spline interpolation.
 * Returns an object with an evaluate(x) method.
 *
 * @param {number[]} xs  monotonically increasing x knots
 * @param {number[]} ys  corresponding y values
 */
export function cubicSpline(xs, ys) {
    const n = xs.length - 1;  // number of intervals
    const h = xs.map((x, i) => i < n ? xs[i + 1] - x : 0);

    // Build tridiagonal system for natural spline (M₀ = Mₙ = 0)
    const ni = n - 1;
    const diag  = Array.from({ length: ni }, (_, i) => 2 * (h[i] + h[i + 1]));
    const upper = Array.from({ length: ni - 1 }, (_, i) => h[i + 1]);
    const lower = upper.slice();
    const rhs   = Array.from({ length: ni }, (_, i) =>
        6 * ((ys[i + 2] - ys[i + 1]) / h[i + 1] - (ys[i + 1] - ys[i]) / h[i]));

    // Solve for interior second derivatives
    const M = [0, ...tridiagonalSolve(lower, diag, upper, rhs), 0];

    const evaluate = xq => {
        // Find interval
        let idx = n - 1;
        for (let i = 0; i < n; i++) {
            if (xq <= xs[i + 1]) { idx = i; break; }
        }
        const dx = xq - xs[idx];
        const hi = h[idx];
        return (M[idx] / (6 * hi)) * (xs[idx + 1] - xq) ** 3
             + (M[idx + 1] / (6 * hi)) * dx ** 3
             + (ys[idx] / hi - M[idx] * hi / 6) * (xs[idx + 1] - xq)
             + (ys[idx + 1] / hi - M[idx + 1] * hi / 6) * dx;
    };

    return { evaluate, knots: xs, values: ys, secondDerivatives: M };
}

/**
 * Newton's divided difference interpolation (efficient for adding new points).
 * @param {number[]} xs
 * @param {number[]} ys
 * @returns {{ coefficients: number[], evaluate: (xq) => number }}
 */
export function newtonInterpolation(xs, ys) {
    const n = xs.length;
    // Build divided difference table
    const dd = ys.slice();
    const coeffs = [dd[0]];
    for (let j = 1; j < n; j++) {
        for (let i = n - 1; i >= j; i--) {
            dd[i] = (dd[i] - dd[i - 1]) / (xs[i] - xs[i - j]);
        }
        coeffs.push(dd[j]);
    }
    const evaluate = xq => {
        let result = coeffs[0];
        let prod = 1;
        for (let k = 1; k < n; k++) {
            prod *= (xq - xs[k - 1]);
            result += coeffs[k] * prod;
        }
        return result;
    };
    return { coefficients: coeffs, evaluate };
}

// ============================================================================
// NUMERICAL DIFFERENTIATION — Richardson Extrapolation
// ============================================================================

/**
 * Highly accurate numerical derivative using Richardson extrapolation.
 * Achieves O(h⁸) accuracy by combining central differences at multiple step sizes.
 *
 * @param {Function} f   scalar function
 * @param {number} x     evaluation point
 * @param {number} [h=0.1]  initial step size
 * @returns {number}
 */
export function richardsonDerivative(f, x, h = 0.1) {
    // 4-level Richardson table
    const D = Array.from({ length: 4 }, (_, i) => {
        const hi = h / (2 ** i);
        return (f(x + hi) - f(x - hi)) / (2 * hi);
    });
    // Richardson extrapolation
    for (let k = 1; k < 4; k++) {
        for (let i = 0; i < 4 - k; i++) {
            D[i] = ((4 ** k) * D[i + 1] - D[i]) / ((4 ** k) - 1);
        }
    }
    return D[0];
}
