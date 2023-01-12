import { equal } from 'node:assert/strict'

import {
	AttributeIds,
	type ClientSession,
	type NodeIdLike,
} from 'node-opcua'

import { assertMapFactory } from '../general/assert-map'

export type AttrIdString = keyof typeof AttributeIds

// 1:1 mapping from OPCUA's AttributeIds to AttributeIdString.
export const attrIdStringToAttrId = (attr: AttrIdString) =>
	AttributeIds[attr]

// Read multiple attributes from specific node at once
export const readAttr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttrIdString>,
) => {
	const attributes = await session.read(
		attributeIds
			.map(attrIdStringToAttrId)
			.map(attributeId => ({
				nodeId,
				attributeId,
			})),
	)

	// Assert that two arrays have same length
	equal(attributes.length, attributeIds.length)

	return assertMapFactory(
		new Map(
			attributes.map((attrValue, i) => [
				attributeIds[i],
				attrValue.value.value as unknown,
			]),
		),
	)
}

// One-time execution interface of above codes
export const readOneAttr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeId: AttrIdString,
) =>
	(await readAttr(session, nodeId, [attributeId]))(
		attributeId,
	)
