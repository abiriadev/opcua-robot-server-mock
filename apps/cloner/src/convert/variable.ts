import { StNodeId, type StVariableNode } from 'node'
import {
	type ClientSession,
	type NodeId,
	type ReferenceDescription,
} from 'node-opcua'
import { readAttr } from 'utils'

import { toNode } from './node'

// Convert reference into StVariableNode
export const toVariableNode = async (
	session: ClientSession,
	ref: ReferenceDescription,
): Promise<StVariableNode> => {
	// Read required attributes at once

	const attr = await readAttr(session, ref.nodeId, [
		'AccessLevel',
		'Description',
		'ArrayDimensions',
		'DataType',
		'Historizing',
		'MinimumSamplingInterval',
		'DataTypeDefinition',
		'UserAccessLevel',
		'ValueRank',
	])

	return {
		// You should use type assertions
		// since attr() will return unknown type
		...(await toNode(session, ref)),
		nodeClass: 'Variable',
		typeDefinition: StNodeId.fromNodeId(
			ref.typeDefinition,
		),
		accessLevel: attr('AccessLevel') as number,
		arrayDimensions: (array =>
			array instanceof Uint32Array
				? Array.from(array)
				: array)(
			attr(
				'ArrayDimensions',
				[],
			) as Array<number> | null,
		),
		dataType: StNodeId.fromNodeId(
			attr('DataType') as NodeId,
		),
		historizing: attr('Historizing') as boolean,
		minimumSamplingInterval: attr(
			'MinimumSamplingInterval',
		) as number,
		userAccessLevel: attr('UserAccessLevel') as number,
		valueRank: attr('ValueRank') as number,
	}
}
