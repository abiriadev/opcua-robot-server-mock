import {
	BaseNode,
	NodeClass,
	NodeId,
	UAReference,
	UAVariable,
} from 'node-opcua'

import { isOrganziedBy } from '../guards'

// get all nodes under given node
export const getAllNodes = (
	node: BaseNode,
): Array<BaseNode> => flatRecurse(node)

// get all ids of nodes under given node
export const getAllNodeIds = (
	node: BaseNode,
): Array<NodeId> =>
	getAllNodes(node).map(node => node.nodeId)

// get all variable nodes
export const getAllVariables = (
	node: BaseNode,
): Array<UAVariable> =>
	getAllNodes(node).filter(
		(node): node is UAVariable =>
			node.nodeClass === NodeClass.Variable,
	)

// get all ids of variable nodes
export const getAllVariableIds = (
	node: BaseNode,
): Array<NodeId> =>
	getAllVariables(node).map(node => node.nodeId)

// recursively browse node tree,
// collecting every node fulfills conditions.
export const flatRecurse = (
	node: BaseNode,
): Array<BaseNode> =>
	node
		.allReferences()
		.filter(
			(
				ref,
			): ref is UAReference & {
				node: BaseNode
			} =>
				ref.isForward &&
				isOrganziedBy(ref.referenceType) &&
				ref.node !== undefined,
		)
		.map(ref => ref.node)
		.flatMap(node => [node, ...flatRecurse(node)])
