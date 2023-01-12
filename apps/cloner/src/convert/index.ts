import { type StNode } from 'node'
import {
	type ClientSession,
	type ReferenceDescription,
} from 'node-opcua'
import { fromNodeClass } from 'node/dist/types/node-class'

import { toObjectNode } from './object'
import { toVariableNode } from './variable'

// Convert a ReferenceDescription into a StNode
export const convert = async (
	session: ClientSession,
	ref: ReferenceDescription,
): Promise<StNode> => {
	switch (fromNodeClass(ref.nodeClass)) {
		case 'Object': {
			return toObjectNode(session, ref)
		}

		case 'Variable': {
			return toVariableNode(session, ref)
		}

		default: {
			throw new TypeError(
				`converting node other than Object or Variable is not supported currently`,
			)
		}
	}
}
