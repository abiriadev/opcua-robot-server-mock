import { StNode, type StObjectNode, toNodeId } from 'node'
import { type Namespace, type NodeIdLike } from 'node-opcua'

import { createBaseNode } from './node'

// Register single object to the namespace
export const registerObject = (
	ns: Namespace,
	node: StObjectNode,
	parentNodeId: NodeIdLike,
) =>
	ns.addObject({
		...createBaseNode(node),
		organizedBy: parentNodeId,
		typeDefinition: toNodeId(node.typeDefinition),
	})
