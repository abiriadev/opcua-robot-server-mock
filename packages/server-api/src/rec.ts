import { NodeClass, type UaNode } from 'node'
import { type Namespace, type NodeIdLike } from 'node-opcua'

import {
	getDefault,
	nodeExists,
	toNodeId,
} from './utils/node-utils'

export const rec = (
	ns: Namespace,
	node: UaNode,
	pnid: NodeIdLike,
) => {
	const nodeId = toNodeId(node.nodeId)

	if (!nodeExists(ns, nodeId)) {
		const shared = {
			browseName: node.browseName,
			description: node.description,
			displayName: node.displayName,
			nodeId,
		}

		if (node.nodeClass === NodeClass.Object) {
			ns.addObject({
				...shared,
				organizedBy: pnid,
				typeDefinition: toNodeId(
					node.typeDefinition,
				),
			})
		} else if (node.nodeClass === NodeClass.Variable) {
			ns.addVariable({
				...shared,
				organizedBy: pnid,
				accessLevel: node.accessLevel,
				arrayDimensions: node.arrayDimensions,
				dataType: toNodeId(node.dataType),
				historizing: node.historizing,
				minimumSamplingInterval:
					node.minimumSamplingInterval,
				typeDefinition: toNodeId(
					node.typeDefinition,
				),
				userAccessLevel: node.userAccessLevel,
				// eslint-disable-next-line unicorn/no-unreadable-iife
				value: (dt => ({
					dataType: dt,
					value: getDefault(dt),
				}))(
					(x => {
						if (x === null)
							throw new Error(
								`${toNodeId(
									node.dataType,
								).toString()} must to be exist`,
							)
						else return x
					})(
						ns.addressSpace.findDataType(
							toNodeId(node.dataType),
						),
					).basicDataType,
				),
				valueRank: node.valueRank,
			})
		}
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	node.references.forEach(child => {
		rec(ns, child, nodeId)
	})
}
