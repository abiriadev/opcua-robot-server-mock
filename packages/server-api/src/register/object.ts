import { StNode, StObjectNode, toNodeId } from 'node'
import { Namespace, NodeIdLike } from 'node-opcua'

import { createBaseNode } from './node'

// register single object to the namespace
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
