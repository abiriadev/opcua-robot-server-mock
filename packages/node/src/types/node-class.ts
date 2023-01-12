import { NodeClass } from 'node-opcua'

// Type of node
export type StNodeClass =
	| 'Object'
	| 'Variable'
	| 'Method'
	| 'ObjectType'
	| 'VariableType'
	| 'ReferenceType'
	| 'DataType'
	| 'View'

// Convert NodeClass enum into string union
export const fromNodeClass = (
	nodeClass: NodeClass,
): StNodeClass => {
	const sNodeClass = NodeClass[
		nodeClass
	] as keyof typeof NodeClass

	if (sNodeClass === 'Unspecified')
		throw new TypeError(
			`Cannot convert 'Unspecified' to SNodeClass`,
		)
	return sNodeClass
}

// Convert this type to NodeClass
export const toNodeClass = (
	sNodeClass: StNodeClass,
): NodeClass => NodeClass[sNodeClass]
