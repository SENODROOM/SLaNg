/**
 * SLaNg Performance Optimization and Caching System
 * Provides caching, memoization, and performance monitoring
 */

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

/**
 * LRU Cache implementation for expression caching
 */
class LRUCache {
    constructor(maxSize = 1000) {
        this.maxSize = maxSize;
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;
    }

    get(key) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            this.hits++;
            return value;
        }
        this.misses++;
        return null;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    has(key) {
        return this.cache.has(key);
    }

    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }

    getStats() {
        const total = this.hits + this.misses;
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%'
        };
    }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance monitor for tracking operation metrics
 */
class PerformanceMonitor {
    constructor() {
        this.operations = new Map();
        this.globalStats = {
            totalOperations: 0,
            totalTime: 0,
            averageTime: 0
        };
    }

    startOperation(name) {
        const startTime = performance.now();
        this.operations.set(name, {
            startTime,
            endTime: null,
            duration: null
        });
        return startTime;
    }

    endOperation(name) {
        const operation = this.operations.get(name);
        if (operation) {
            operation.endTime = performance.now();
            operation.duration = operation.endTime - operation.startTime;
            
            // Update global stats
            this.globalStats.totalOperations++;
            this.globalStats.totalTime += operation.duration;
            this.globalStats.averageTime = this.globalStats.totalTime / this.globalStats.totalOperations;
            
            return operation.duration;
        }
        return null;
    }

    getOperationStats(name) {
        return this.operations.get(name);
    }

    getGlobalStats() {
        return { ...this.globalStats };
    }

    clear() {
        this.operations.clear();
        this.globalStats = {
            totalOperations: 0,
            totalTime: 0,
            averageTime: 0
        };
    }
}

// ============================================================================
// MEMOIZATION
// ============================================================================

/**
 * Memoization decorator for functions
 */
export function memoize(fn, options = {}) {
    const {
        cacheSize = 100,
        keyGenerator = (...args) => JSON.stringify(args),
        ttl = null // Time to live in milliseconds
    } = options;

    const cache = new LRUCache(cacheSize);
    const timestamps = new Map();

    return function(...args) {
        const key = keyGenerator(...args);
        
        // Check TTL if specified
        if (ttl && timestamps.has(key)) {
            const age = Date.now() - timestamps.get(key);
            if (age > ttl) {
                cache.delete(key);
                timestamps.delete(key);
            }
        }

        // Check cache
        const cached = cache.get(key);
        if (cached !== null) {
            return cached;
        }

        // Compute and cache
        const result = fn.apply(this, args);
        cache.set(key, result);
        timestamps.set(key, Date.now());
        
        return result;
    };
}

/**
 * Async memoization for promise-based functions
 */
export function memoizeAsync(fn, options = {}) {
    const {
        cacheSize = 100,
        keyGenerator = (...args) => JSON.stringify(args),
        ttl = null
    } = options;

    const cache = new LRUCache(cacheSize);
    const timestamps = new Map();
    const pending = new Map();

    return async function(...args) {
        const key = keyGenerator(...args);
        
        // Check if already pending
        if (pending.has(key)) {
            return pending.get(key);
        }

        // Check cache
        const cached = cache.get(key);
        if (cached !== null) {
            return cached;
        }

        // Check TTL
        if (ttl && timestamps.has(key)) {
            const age = Date.now() - timestamps.get(key);
            if (age > ttl) {
                cache.delete(key);
                timestamps.delete(key);
            }
        }

        // Create and cache promise
        const promise = fn.apply(this, args).then(result => {
            cache.set(key, result);
            timestamps.set(key, Date.now());
            pending.delete(key);
            return result;
        }).catch(error => {
            pending.delete(key);
            throw error;
        });

        pending.set(key, promise);
        return promise;
    };
}

// ============================================================================
// CACHED CONVERTER FUNCTIONS
// ============================================================================

// Global cache instances
export const latexToSlangCache = new LRUCache(500);
export const slangToLatexCache = new LRUCache(500);
export const validationCache = new LRUCache(200);
export const complexityCache = new LRUCache(200);

// Performance monitor
export const performanceMonitor = new PerformanceMonitor();

/**
 * Cached LaTeX to SLaNg conversion
 */
export function cachedLatexToSlang(latex, options = {}) {
    const key = `latex2slang:${JSON.stringify(latex)}:${JSON.stringify(options)}`;
    
    performanceMonitor.startOperation('latexToSlang');
    
    const cached = latexToSlangCache.get(key);
    if (cached !== null) {
        performanceMonitor.endOperation('latexToSlang');
        return cached;
    }

    // Import here to avoid circular dependencies
    import('./slang-convertor.js').then(({ latexToSlang }) => {
        try {
            const result = latexToSlang(latex, options);
            latexToSlangCache.set(key, result);
            performanceMonitor.endOperation('latexToSlang');
            return result;
        } catch (error) {
            performanceMonitor.endOperation('latexToSlang');
            throw error;
        }
    });
}

/**
 * Cached SLaNg to LaTeX conversion
 */
export function cachedSlangToLatex(slang, options = {}) {
    const key = `slang2latex:${JSON.stringify(slang)}:${JSON.stringify(options)}`;
    
    performanceMonitor.startOperation('slangToLatex');
    
    const cached = slangToLatexCache.get(key);
    if (cached !== null) {
        performanceMonitor.endOperation('slangToLatex');
        return cached;
    }

    import('./slang-convertor.js').then(({ slangToLatex }) => {
        try {
            const result = slangToLatex(slang, options);
            slangToLatexCache.set(key, result);
            performanceMonitor.endOperation('slangToLatex');
            return result;
        } catch (error) {
            performanceMonitor.endOperation('slangToLatex');
            throw error;
        }
    });
}

/**
 * Cached validation
 */
export function cachedValidation(latex, options = {}) {
    const key = `validate:${JSON.stringify(latex)}:${JSON.stringify(options)}`;
    
    performanceMonitor.startOperation('validateLatex');
    
    const cached = validationCache.get(key);
    if (cached !== null) {
        performanceMonitor.endOperation('validateLatex');
        return cached;
    }

    import('./slang-convertor.js').then(({ validateLatex }) => {
        try {
            const result = validateLatex(latex, options);
            validationCache.set(key, result);
            performanceMonitor.endOperation('validateLatex');
            return result;
        } catch (error) {
            performanceMonitor.endOperation('validateLatex');
            throw error;
        }
    });
}

/**
 * Cached complexity calculation
 */
export function cachedComplexity(slang) {
    const key = `complexity:${JSON.stringify(slang)}`;
    
    performanceMonitor.startOperation('getExpressionComplexity');
    
    const cached = complexityCache.get(key);
    if (cached !== null) {
        performanceMonitor.endOperation('getExpressionComplexity');
        return cached;
    }

    import('./slang-convertor.js').then(({ getExpressionComplexity }) => {
        try {
            const result = getExpressionComplexity(slang);
            complexityCache.set(key, result);
            performanceMonitor.endOperation('getExpressionComplexity');
            return result;
        } catch (error) {
            performanceMonitor.endOperation('getExpressionComplexity');
            throw error;
        }
    });
}

// ============================================================================
// BATCH PROCESSING OPTIMIZATIONS
// ============================================================================

/**
 * Optimized batch processing with parallel execution
 */
export async function optimizedBatchProcess(items, processor, options = {}) {
    const {
        batchSize = 10,
        maxConcurrency = 4,
        useCache = true,
        progressCallback = null
    } = options;

    const results = [];
    const startTime = performance.now();

    // Process in batches with controlled concurrency
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (item, batchIndex) => {
            const globalIndex = i + batchIndex;
            
            try {
                const result = await processor(item);
                return { index: globalIndex, success: true, result };
            } catch (error) {
                return { index: globalIndex, success: false, error: error.message };
            }
        });

        // Wait for current batch to complete
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Progress callback
        if (progressCallback) {
            const progress = ((i + batchSize) / items.length) * 100;
            progressCallback(Math.min(progress, 100), results);
        }
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
        results,
        stats: {
            totalItems: items.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            duration: duration.toFixed(2) + 'ms',
            averageTime: (duration / items.length).toFixed(2) + 'ms'
        }
    };
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Get comprehensive performance statistics
 */
export function getPerformanceStats() {
    return {
        caches: {
            latexToSlang: latexToSlangCache.getStats(),
            slangToLatex: slangToLatexCache.getStats(),
            validation: validationCache.getStats(),
            complexity: complexityCache.getStats()
        },
        operations: performanceMonitor.getGlobalStats(),
        memory: getMemoryUsage()
    };
}

/**
 * Get memory usage statistics
 */
function getMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
        return {
            used: formatBytes(performance.memory.usedJSHeapSize),
            total: formatBytes(performance.memory.totalJSHeapSize),
            limit: formatBytes(performance.memory.jsHeapSizeLimit)
        };
    }
    return null;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
    latexToSlangCache.clear();
    slangToLatexCache.clear();
    validationCache.clear();
    complexityCache.clear();
    performanceMonitor.clear();
}

/**
 * Optimize cache sizes based on usage patterns
 */
export function optimizeCacheSizes() {
    const stats = getPerformanceStats();
    
    // Adjust cache sizes based on hit rates
    if (parseFloat(stats.caches.latexToSlang.hitRate) > 80) {
        latexToSlangCache.maxSize = Math.min(latexToSlangCache.maxSize * 1.5, 1000);
    } else if (parseFloat(stats.caches.latexToSlang.hitRate) < 30) {
        latexToSlangCache.maxSize = Math.max(latexToSlangCache.maxSize * 0.7, 100);
    }

    // Similar optimization for other caches
    if (parseFloat(stats.caches.slangToLatex.hitRate) > 80) {
        slangToLatexCache.maxSize = Math.min(slangToLatexCache.maxSize * 1.5, 1000);
    } else if (parseFloat(stats.caches.slangToLatex.hitRate) < 30) {
        slangToLatexCache.maxSize = Math.max(slangToLatexCache.maxSize * 0.7, 100);
    }
}

// ============================================================================
// PERFORMANCE DECORATOR
// ============================================================================

/**
 * Performance monitoring decorator
 */
export function withPerformanceMonitoring(fn, name = fn.name) {
    return function(...args) {
        performanceMonitor.startOperation(name);
        try {
            const result = fn.apply(this, args);
            
            // Handle both sync and async results
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    performanceMonitor.endOperation(name);
                });
            } else {
                performanceMonitor.endOperation(name);
                return result;
            }
        } catch (error) {
            performanceMonitor.endOperation(name);
            throw error;
        }
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    LRUCache,
    PerformanceMonitor
};
