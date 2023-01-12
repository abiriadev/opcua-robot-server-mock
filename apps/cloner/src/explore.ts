import { type StNodeTree } from 'node'
import {
	type ClientSession,
	NodeClass,
	type NodeIdLike,
} from 'node-opcua'

import { convert } from './convert'

// Recursively explore node tree
// NOTE: this function returns array of Nodes, not a single Node.
export const explore = async (
	session: ClientSession,
	nodeId: NodeIdLike,
): Promise<StNodeTree> => {
	const childrenArray = []

	// NOTE: we SHOULD send explore requests sequentially,
	// so this time we use await inside for loop
	for (const ref of (
		await session.browse(nodeId.toString())
	).references ?? []) {
		// Early return.
		// we will deal with only objects and variables.
		if (
			![
				NodeClass.Object,
				NodeClass.Variable,
			].includes(ref.nodeClass)
		)
			continue

		// Convert reference into StNode
		// and push them into array one by one
		// note that we used await keyword here.
		// eslint-disable-next-line no-await-in-loop
		childrenArray.push(await convert(session, ref))
	}

	return childrenArray
}
