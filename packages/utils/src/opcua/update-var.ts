import {
	AddressSpace,
	NodeId,
	NodeIdLike,
} from 'node-opcua'

import { isVariable } from '../guards'

export const updateVariable = (
	addr: AddressSpace,
	nodeId: NodeIdLike,
	value: unknown,
) => {
	const node = addr.findNode(nodeId) ?? null

	if (node === null)
		throw new Error(`can't find node with id ${nodeId}`)

	if (!isVariable(node))
		throw new Error(
			`can't update non variable node ${nodeId}`,
		)

	node.setValueFromSource({
		value,
	})
}
