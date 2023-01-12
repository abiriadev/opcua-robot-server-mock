import { QualifiedName } from 'node-opcua'

// Redefined QualifiedName class
export class StQualifiedName {
	// Convert QualifiedName into this cass
	static fromQualifiedName(qualifiedName: QualifiedName) {
		const { name, namespaceIndex } = qualifiedName

		if (name === undefined || name === null)
			throw new TypeError(
				'QualifiedName.name must not to be null or undefined',
			)

		return new StQualifiedName(
			namespaceIndex ?? 0,
			name,
		)
	}

	constructor(
		readonly namespaceIndex: number,
		readonly name: string,
	) {}

	// Convert this class into QualifiedName
	toQualifiedName() {
		const { name, namespaceIndex } = this

		return new QualifiedName({
			name,
			namespaceIndex,
		})
	}
}
