import { type StNode, toNodeId } from 'node'
import { type Namespace, type NodeIdLike } from 'node-opcua'
import { nodeExists } from 'utils'

import { registerObject } from './object'
import { registerVariable } from './variable'

// Register node tree recursively
export const registerTree = (
	ns: Namespace,
	node: StNode,
	pnid: NodeIdLike,
) => {
	const nodeId = toNodeId(node.nodeId)

	// Determine whether to skip registering this node
	if (!nodeExists(ns, nodeId)) {
		if (node.nodeClass === 'Object')
			registerObject(ns, node, pnid)
		else if (node.nodeClass === 'Variable')
			registerVariable(ns, node, pnid)
	}

	// Use forEach since there is nothing to return
	// eslint-disable-next-line unicorn/no-array-for-each
	node.references.forEach(child => {
		registerTree(ns, child, nodeId)
	})
}
