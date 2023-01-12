import { StVariableNode, toNodeId } from 'node'
import { Namespace, NodeIdLike } from 'node-opcua'
import { getDefaultVariant } from 'utils'

import { createBaseNode } from './node'

// register single variable to the namespace
export const registerVariable = (
	ns: Namespace,
	node: StVariableNode,
	parentNodeId: NodeIdLike,
) =>
	ns.addVariable({
		...createBaseNode(node),
		organizedBy: parentNodeId,
		accessLevel: node.accessLevel,
		arrayDimensions: node.arrayDimensions,
		dataType: toNodeId(node.dataType),
		historizing: node.historizing,
		minimumSamplingInterval:
			node.minimumSamplingInterval,
		typeDefinition: toNodeId(node.typeDefinition),
		userAccessLevel: node.userAccessLevel,
		// eslint-disable-next-line unicorn/no-unreadable-iife
		value: getDefaultVariant(
			(x => {
				if (x === null)
					throw new Error(
						`${toNodeId(
							node.dataType,
						).toString()} must to be exist`,
					)
				return x
			})(
				ns.addressSpace.findDataType(
					toNodeId(node.dataType),
				),
			).basicDataType,
		),
		valueRank: node.valueRank,
	})
