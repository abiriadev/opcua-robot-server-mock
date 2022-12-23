export interface Node {
	browseName: string
	displayName: string
	nodeId: string
	nodeClass: NodeClass
	type: string | null
	children: Array<Node>
}

export type NodeClass =
	| 'Object'
	| 'ObjectType'
	| 'Variable'
	| 'VariableType'
	| 'DataType'
	| 'Method'
	| 'ReferenceType'
