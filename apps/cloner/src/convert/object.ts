import { StNodeId, type StObjectNode } from 'node'
import {
	type ClientSession,
	type ReferenceDescription,
} from 'node-opcua'

import { toNode } from './node'

// Extend toNode function,
// converting given reference into StObjectNode
export const toObjectNode = async (
	session: ClientSession,
	ref: ReferenceDescription,
): Promise<StObjectNode> => ({
	...(await toNode(session, ref)),
	nodeClass: 'Object',
	typeDefinition: StNodeId.fromNodeId(ref.typeDefinition),
})
