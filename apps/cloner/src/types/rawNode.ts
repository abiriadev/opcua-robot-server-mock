import { Node } from 'node'

export type RawNode = {
	referenceTypeId: string
	isForward: boolean
	nodeId: string
	browseName: {
		namespaceIndex: number
		name: string
	}
	displayName: {
		locale: string
		text: string
	}
	nodeClass: string
	typeDefinition: string
}

export const normalizeNode = ({
	referenceTypeId,
	nodeId,
	browseName,
	displayName,
	nodeClass,
	typeDefinition,
}: RawNode): Node => ({
	referenceTypeId,
	nodeId,
	browseName: browseName.name,
	displayName: displayName.text,
	nodeClass,
	typeDefinition,
	children: [],
})
