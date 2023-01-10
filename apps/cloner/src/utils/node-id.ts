import { NodeId, NodeIdType } from 'node'
import {
	NodeId as OpcNodeId,
	NodeIdType as OpcNodeIdType,
} from 'node-opcua'

export const fromNodeId = (nodeId: OpcNodeId): NodeId => ({
	namespace: nodeId.namespace,
	...(nodeId.identifierType === OpcNodeIdType.NUMERIC
		? {
				identifierType: NodeIdType.NUMERIC,
				value: <number>nodeId.value,
		}
		: nodeId.identifierType === OpcNodeIdType.STRING
		? {
				identifierType: NodeIdType.STRING,
				value: <string>nodeId.value
		}
		: (() => {
			throw new TypeError(
				`stringifying node id of type Buffer or GUID does not supported currently`,
			)
		})()
	),
})
