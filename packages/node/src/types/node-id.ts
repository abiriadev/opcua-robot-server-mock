// Redefined NodeId
// WARN: this type does not support Buffer nor GUID
import { NodeId, NodeIdType } from 'node-opcua'

// Helper types
type CurrentlySupportedTypeName = Exclude<
	keyof typeof NodeIdType,
	'GUID' | 'BYTESTRING'
>
type CurrentlySupported = number | string

// Helper function
// TODO: extract this helper functions to utils package
const nodeIdTypeToString = (k: NodeIdType) =>
	NodeIdType[k] as keyof typeof NodeIdType

const stringToNodeIdType = (k: keyof typeof NodeIdType) =>
	NodeIdType[k]

export class StNodeId {
	// Convert NodeId into this serializable class.
	// NOTE: it will throw error if type of node is not NUMERIC nor STRING
	static fromNodeId(nodeId: NodeId) {
		const { identifierType, value, namespace } = nodeId
		const stringifiedIdentifierType =
			nodeIdTypeToString(identifierType)

		if (
			!(
				stringifiedIdentifierType === 'NUMERIC' ||
				stringifiedIdentifierType === 'STRING'
			)
		)
			throw new TypeError(
				`SNodeId currently does not support BYTESTRING or GUID`,
			)

		return new StNodeId(
			stringifiedIdentifierType,
			value as CurrentlySupported,
			namespace,
		)
	}

	constructor(
		readonly identifierType: CurrentlySupportedTypeName,
		readonly value: CurrentlySupported,
		readonly namespace: number,
	) {}

	// Convert this class into NodeId
	toNodeId() {
		const { identifierType, value, namespace } = this

		return new NodeId(
			stringToNodeIdType(identifierType),
			value,
			namespace,
		)
	}
}
