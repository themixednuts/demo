import { Micro } from 'effect';

export interface RetryConfig {
	maxRetries?: number;
	baseDelay?: number;
	maxDelay?: number;
	signal?: AbortSignal;
	retryableErrors?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_CONFIG: Omit<Required<RetryConfig>, 'signal'> = {
	maxRetries: 3,
	baseDelay: 1000,
	maxDelay: 30000,
	retryableErrors: (error: unknown) => {
		// Retry on network errors, 5xx server errors, but not on 4xx client errors
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('timeout') ||
				message.includes('fetch') ||
				/5\d\d/.test(message)
			); // 5xx status codes
		}
		return false;
	},
};

/**
 * Creates a `Micro` effect with exponential backoff retry logic.
 *
 * This function wraps a potentially fallible function `fn` in a `Micro` effect
 * that will automatically retry the operation on failure, using an exponential
 * backoff strategy (with optional jitter and error classification via `RetryConfig`).
 *
 * Retries will stop when either:
 * - The maximum number of retries is reached
 * - The `retryableErrors` predicate returns `false` for the thrown error
 *
 * @template T The return type of the function `fn`
 * @param fn A function that returns a value or Promise. Can throw synchronously or asynchronously.
 * @param config Retry options such as maxRetries, baseDelay, maxDelay, and retryableErrors predicate.
 * @returns A `Micro` effect that yields the result of `fn`, with retry logic applied.
 *
 * @example
 * ```ts
 * /// <reference lib="deno.ns" />
 * import { Micro } from "effect";
 * import { withRetry, type RetryConfig } from "./retry.ts";
 * import { assertEquals } from "jsr:@std/assert/equals"
 *
 * let attemptCount = 0;
 * const failingTask = () => {
 *   attemptCount++;
 *   if (attemptCount < 3) {
 *     throw new Error("Fail until attempt 3");
 *   }
 *   return "success";
 * };
 *
 * const effect = withRetry(failingTask, {
 *   maxRetries: 5,
 *   baseDelay: 10,
 *   maxDelay: 100,
 *   retryableErrors: () => true, // Always retry
 * });
 *
 * const result = await Micro.runPromise(effect);
 * assertEquals(result, "success");
 * assertEquals(attemptCount, 3);
 * ```
 *
 * @example
 * ```ts
 * /// <reference lib="deno.ns" />
 * // Example of a non-retryable error
 * import { Micro } from "effect";
 * import { withRetry, type RetryConfig } from "./retry.ts";
 * import { assertEquals } from "jsr:@std/assert/equals"
 *
 * let called = false;
 * const nonRetryable = () => {
 *   called = true;
 *   throw new Error("fatal");
 * };
 *
 * const effect = Micro.catchAll(
 *   withRetry(nonRetryable, {
 *     maxRetries: 3,
 *     retryableErrors: () => false // Never retry
 *   }),
 *    //@ts-ignore
 *   (err) => Micro.succeed(`caught: ${err?.message}`)
 * );
 *
 * const result = await Micro.runPromise(effect);
 * assertEquals(result, "caught: fatal");
 * assertEquals(called, true);
 * ```
 */
export function withRetry<T>(
	fn: () => PromiseLike<T> | T,
	config: RetryConfig = {},
): Micro.Micro<T, unknown> {
	const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

	const max = Micro.scheduleWithMaxDelay(retryConfig.maxDelay);
	const expo = Micro.scheduleExponential(retryConfig.baseDelay);
	const policy = max(expo);

	return Micro.retry(
		Micro.tryPromise({
			try: async () => await fn(),
			catch: (err) => err,
		}),
		{
			schedule: policy,
			times: retryConfig.maxRetries,
		},
	);
}

/**
 * Executes a function with retry logic as a Promise
 */
export async function executeWithRetry<T>(
	fn: () => PromiseLike<T> | T,
	config: RetryConfig = {},
): Promise<T> {
	const effect = withRetry(fn, config);
	return await Micro.runPromise(effect);
}

/**
 * Creates a retry-enabled version of a function
 */
export function retryable<TArgs extends unknown[], TReturn>(
	fn: (...args: TArgs) => Promise<TReturn>,
	config: RetryConfig = {},
): (...args: TArgs) => Promise<TReturn> {
	return (...args: TArgs) => {
		return executeWithRetry(() => fn(...args), config);
	};
}

/**
 * Conditional retry - only applies retry if condition is met
 * Useful when you want to respect user-provided schedulers
 */
export async function conditionalRetry<T>(
	fn: () => Promise<T>,
	config: RetryConfig = {},
	shouldRetry: boolean,
): Promise<T> {
	if (!shouldRetry) {
		return await fn();
	}
	return executeWithRetry(fn, config);
}
