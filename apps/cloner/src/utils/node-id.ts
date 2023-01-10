import { type NodeId, NodeIdType } from 'node'
import {
	type NodeId as OpcNodeId,
	NodeIdType as OpcNodeIdType,
} from 'node-opcua'

export const fromNodeId = (nodeId: OpcNodeId): NodeId => ({
	namespace: nodeId.namespace,
	...(nodeId.identifierType === OpcNodeIdType.NUMERIC
		? {
				identifierType: NodeIdType.NUMERIC,
				value: nodeId.value as number,
		  }
		: nodeId.identifierType === OpcNodeIdType.STRING
		? {
				identifierType: NodeIdType.STRING,
				value: nodeId.value as string,
		  }
		: (() => {
				throw new TypeError(
					`stringifying node id of type Buffer or GUID does not supported currently`,
				)
		  })()),
})
