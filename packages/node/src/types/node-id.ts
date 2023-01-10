export enum NodeIdType {
	STRING = 'STRING',
	NUMERIC = 'NUMERIC',
}

// redefined NodeId
// WARN: this type does not support Buffer
export type NodeId = (
	| {
			identifierType: NodeIdType.NUMERIC
			value: number
	  }
	| {
			identifierType: NodeIdType.STRING
			value: string
	  }
) & { namespace: number }
