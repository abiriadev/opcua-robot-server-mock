import {
	type StBaseNode,
	StLocalizedText,
	StNodeId,
	type StNodeTree,
	StQualifiedName,
} from 'node'
import {
	type ClientSession,
	type LocalizedText,
	type ReferenceDescription,
} from 'node-opcua'
import { readOneAttr } from 'utils'

import { explore } from '../explore'

// Shared contents for all StNode
export const toNode = async (
	session: ClientSession,
	ref: ReferenceDescription,
): Promise<StBaseNode> => ({
	browseName: StQualifiedName.fromQualifiedName(
		ref.browseName,
	),
	description: StLocalizedText.fromLocalizedText(
		(await readOneAttr(
			session,
			ref.nodeId,
			'Description',
		)) as LocalizedText,
	),
	// DisplayName must to be an Array.
	displayName: [ref.displayName].map(
		// eslint-disable-next-line unicorn/no-array-callback-reference
		StLocalizedText.fromLocalizedText,
	),
	nodeId: StNodeId.fromNodeId(ref.nodeId),

	references: await explore(session, ref.nodeId),
	referenceTypeId: StNodeId.fromNodeId(
		ref.referenceTypeId,
	),
})
