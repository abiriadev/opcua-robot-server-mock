import { env } from 'node:process'

// Throw an exception when given variable does not exist
// if the second parameter is given, it will return that value instead of throwing an exception.
export const assertGetEnv = (
	key: string,
	defaultValue?: string,
): string => {
	const value = env[key]
	if (value !== undefined) return value
	if (defaultValue !== undefined) return defaultValue
	throw new Error(
		`environment variable '${key}' must to be set`,
	)
}

// Factory function that prefixes given text to all environment variables
export const assertGetEnvPrefixFactory =
	(prefix: string) =>
	(key: string, defaultValue?: string) =>
		assertGetEnv(`${prefix}_${key}`, defaultValue)
