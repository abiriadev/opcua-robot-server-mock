import {
	type BaseNode,
	NodeClass,
	type NodeId,
	type UAObject,
	type UAVariable,
} from 'node-opcua'

// Determine whether given Node is
export const isObject = (
	node: BaseNode,
): node is UAObject => node.nodeClass === NodeClass.Object

export const isVariable = (
	node: BaseNode,
): node is UAVariable =>
	node.nodeClass === NodeClass.Variable

export const isOrganziedBy = (nodeId: NodeId) =>
	nodeId.namespace === 0 && nodeId.value === 35
