import { redis } from "../lib/redis";
import type { Redis } from "@upstash/redis";
import pino from "pino";

const logger = pino({ level: "debug" });

type AsyncFn<T extends any[], R> = (...args: T) => Promise<R>;

/**
 * Decorator to cache method results in Redis.
 * 
 * @param keyBuilder A function that returns the Redis key based on method arguments.
 * @param ttlSeconds Time to live in seconds. Defaults to 5.
 * @param client Redis client instance (defaults to shared Upstash instance).
 */
export function cache<T extends any[], R>(
  keyBuilder: (...args: T) => string,
  ttlSeconds = 5,
  client: Redis = redis
): MethodDecorator {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> | void {
    const originalMethod = descriptor.value as AsyncFn<T, R>;

    descriptor.value = async function (...args: T): Promise<R> {
      const key = keyBuilder(...args);

      // 🚨 Validate Redis key
      if (
        !key ||
        key.includes("undefined") ||
        key.includes("null") ||
        key.includes("missing")
      ) {
        const msg = `🛑 Invalid Redis cache key: "${key}" — check arguments passed to @cache`;
        logger.error(msg);
        throw new Error(msg);
      }

      try {
        const cached = await client.get<R>(key);

        if (cached !== null && cached !== undefined) {
          logger.debug({ key }, "cache-hit");
          return cached;
        }

        logger.debug({ key }, "cache-miss");
        const result = await originalMethod.apply(this, args);

        await client.set(key, result, { ex: ttlSeconds });
        return result;
      } catch (err) {
        logger.error({ err, key }, "Redis caching failed");
        // Fail open – return uncached data
        return await originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
