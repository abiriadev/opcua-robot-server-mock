import { type NodeId, NodeIdType } from 'node'
import {
	DataType,
	type Namespace,
	NodeId as OpcNodeId,
	NodeIdType as OpcNodeIdType,
} from 'node-opcua'

// Check whether the given node id exists in current namespace.

// NOTE: if namespace does not match, it will return true.
export const nodeExists = (
	ns: Namespace,
	nid: string | OpcNodeId,
): boolean => {
	const nodeId = OpcNodeId.resolveNodeId(nid)

	if (nodeId.namespace !== ns.index) return true

	return ns.findNode(nid) !== null
}

// Convert NodeId to OpcNodeId
export const toNodeId = (nodeId: NodeId): OpcNodeId =>
	new OpcNodeId(
		nodeId.identifierType === NodeIdType.NUMERIC
			? OpcNodeIdType.NUMERIC
			: OpcNodeIdType.STRING,
		nodeId.value,
		nodeId.namespace,
	)

export const getDefault = (dataType: DataType): unknown => {
	switch (dataType) {
		case DataType.Byte: {
			return null
		}

		case DataType.String: {
			return 'hello'
		}

		case DataType.UInt16:
		case DataType.UInt32:
		case DataType.UInt64: {
			return 123
		}

		default: {
			return null
		}
	}
}
