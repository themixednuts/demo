import { Micro } from 'effect';

export interface RetryConfig {
	maxRetries?: number;
	baseDelay?: number;
	maxDelay?: number;
	retryableErrors?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
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
 * Creates a Micro effect with exponential backoff retry logic
 */
export function withRetry<T>(
	fn: () => PromiseLike<T> | T,
	config: RetryConfig = {},
): Micro.Micro<T, unknown> {
	const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

	const attempt = (
		attemptsLeft: number,
		currentDelay: number,
	): Micro.Micro<T, unknown> => {
		return Micro.gen(function* () {
			try {
				return yield* Micro.promise(() => Promise.resolve(fn()));
			} catch (error) {
				// If no attempts left or error is not retryable, fail
				if (attemptsLeft <= 0 || !retryConfig.retryableErrors(error)) {
					return yield* Micro.fail(error);
				}

				// Calculate next delay with exponential backoff
				const nextDelay = Math.min(currentDelay * 2, retryConfig.maxDelay);

				// Wait before retrying
				yield* Micro.sleep(currentDelay);

				// Retry with one less attempt
				return yield* attempt(attemptsLeft - 1, nextDelay);
			}
		});
	};

	return attempt(retryConfig.maxRetries, retryConfig.baseDelay);
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
	shouldRetry: boolean,
	config: RetryConfig = {},
): Promise<T> {
	if (!shouldRetry) {
		return await fn();
	}
	return executeWithRetry(fn, config);
}

/**
 * Simple exponential backoff with jitter to avoid thundering herd
 */
export function calculateDelay(
	attempt: number,
	baseDelay: number,
	maxDelay: number,
	jitter: boolean = true,
): number {
	const exponentialDelay = baseDelay * Math.pow(2, attempt);
	const cappedDelay = Math.min(exponentialDelay, maxDelay);

	if (jitter) {
		// Add ±25% jitter to prevent thundering herd
		const jitterRange = cappedDelay * 0.25;
		const jitterOffset = (Math.random() - 0.5) * 2 * jitterRange;
		return Math.max(0, cappedDelay + jitterOffset);
	}

	return cappedDelay;
}

/**
 * Common retry configs for different scenarios
 */
export const RETRY_PRESETS = {
	network: {
		maxRetries: 3,
		baseDelay: 1000,
		maxDelay: 10000,
		retryableErrors: (error: unknown) => {
			if (error instanceof Error) {
				const message = error.message.toLowerCase();
				return (
					message.includes('network') ||
					message.includes('timeout') ||
					message.includes('fetch')
				);
			}
			return false;
		},
	} as RetryConfig,

	aggressive: {
		maxRetries: 5,
		baseDelay: 500,
		maxDelay: 30000,
	} as RetryConfig,

	conservative: {
		maxRetries: 2,
		baseDelay: 2000,
		maxDelay: 10000,
	} as RetryConfig,

	streaming: {
		maxRetries: 3,
		baseDelay: 1000,
		maxDelay: 5000,
		retryableErrors: (error: unknown) => {
			// More permissive for streaming scenarios
			if (error instanceof Error) {
				const message = error.message.toLowerCase();
				return (
					(!message.includes('abort') && // Don't retry aborted requests
						!message.includes('4')) || // Don't retry 4xx errors
					message.includes('timeout')
				);
			}
			return true;
		},
	} as RetryConfig,

	/**
	 * For cases where you want micro-level control
	 */
	realtime: {
		maxRetries: 2,
		baseDelay: 250,
		maxDelay: 2000,
		retryableErrors: (error: unknown) => {
			if (error instanceof Error) {
				const message = error.message.toLowerCase();
				// Very selective retries for real-time scenarios
				return message.includes('timeout') || message.includes('network');
			}
			return false;
		},
	} as RetryConfig,
} as const;

/**
 * Micro-specific utilities
 */
export const MicroRetry = {
	/**
	 * Creates a Micro effect that retries with custom logic
	 */
	withCustomPolicy<T>(
		fn: () => Promise<T>,
		policy: (
			attempt: number,
			error: unknown,
		) => Micro.Micro<number | null, never>,
	): Micro.Micro<T, unknown> {
		const attempt = (attemptNumber: number): Micro.Micro<T, unknown> => {
			return Micro.gen(function* () {
				try {
					return yield* Micro.promise(() => fn());
				} catch (error) {
					const delayOrStop = yield* policy(attemptNumber, error);

					if (delayOrStop === null) {
						return yield* Micro.fail(error);
					}

					yield* Micro.sleep(delayOrStop);
					return yield* attempt(attemptNumber + 1);
				}
			});
		};

		return attempt(0);
	},

	/**
	 * Circuit breaker pattern using Micro
	 */
	withCircuitBreaker<T>(
		fn: () => Promise<T>,
		_config: {
			failureThreshold: number;
			resetTimeout: number;
		},
	): Micro.Micro<T, unknown> {
		// This would require state management, which is simplified here
		// In practice, you'd want to use a more sophisticated circuit breaker
		return Micro.promise(() => fn());
	},
} as const;
