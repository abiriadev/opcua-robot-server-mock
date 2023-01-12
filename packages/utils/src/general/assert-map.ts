// Asserts that for all given keys, corresponding values must always be exist in this map.
// otherwise, you can also provide a default value to be returned when there is no matching value.
export class AssertMap<T, U> {
	constructor(private readonly map: Map<T, U>) {}

	public get(key: T, defaultValue?: U): U {
		return (
			this.map.get(key) ??
			defaultValue ??
			(() => {
				throw new Error(`key ${key} does not exist`)
			})()
		)
	}

	public has(key: T): boolean {
		return this.map.has(key)
	}
}

// Make it easy to use above class
export const assertMapFactory = <T, U>(map: Map<T, U>) => {
	const assertMap = new AssertMap(map)

	return (key: T, defaultValue?: U) =>
		assertMap.get(key, defaultValue)
}
