import {
	LocalizedText as OpcLocalizedText,
	QualifiedName as OpcQualifiedName,
} from 'node-opcua'

// NOTE: as of now, we can't simply stringify the NodeId class directly,
// since it uses Buffer type under the hood, which is not parsed correctly in typia.
export type NodeIdString = string

// enum with string representation
export enum NodeClass {
	Object = 'Object',
	Variable = 'Variable',
	Method = 'Method',
	ObjectType = 'ObjectType',
	VariableType = 'VariableType',
	ReferenceType = 'ReferenceType',
	DataType = 'DataType',
	View = 'View',
}

// redefined QualifiedName class
export interface QualifiedName {
	namespaceIndex: number
	name: string
}

export const coerceQualifiedName = (
	qualifiedName: OpcQualifiedName,
): QualifiedName => ({
	namespaceIndex: qualifiedName.namespaceIndex ?? 0,
	name:
		qualifiedName.name ??
		(() => {
			throw new TypeError()
		})(),
})

export interface LocalizedText {
	locale: string | null
	text: string | null
}

export const coerceLocalizedText = (
	localizedText: OpcLocalizedText,
): LocalizedText => ({
	locale: localizedText.locale ?? null,
	text: localizedText.text ?? null,
})

export interface Node {
	browseName: QualifiedName
	description: LocalizedText
	displayName: Array<LocalizedText>
	nodeClass: NodeClass
	nodeId: NodeIdString
	references: References
	referenceTypeId: NodeIdString
}

export interface References {
	objects: Array<ObjectNode>
	variables: Array<VariableNode>
}

export interface ObjectNode extends Node {
	typeDefinition: NodeIdString
}

export interface VariableNode extends Node {
	accessLevel: number
	// this field should accept null, since our robot OPC server can't support this attributes correctly.
	arrayDimensions: Array<number> | null
	dataType: NodeIdString
	historizing: boolean
	minimumSamplingInterval: number
	typeDefinition: NodeIdString
	userAccessLevel: number
	valueRank: number
}
