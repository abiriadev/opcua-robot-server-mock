// the node type used at serialized format
export interface Node {
	referenceTypeId: string
	nodeId: string
	browseName: string
	displayName: string
	nodeClass: string
	typeDefinition: string
	children: Array<Node>
}
