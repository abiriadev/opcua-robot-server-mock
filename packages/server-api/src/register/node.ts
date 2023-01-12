import {
	type StNode,
	toLocalizedText,
	toNodeId,
	toQualifiedName,
} from 'node'

export const createBaseNode = (node: StNode) => ({
	browseName: toQualifiedName(node.browseName),
	description: toLocalizedText(node.description),
	displayName: node.displayName.map(toLocalizedText),
	nodeId: toNodeId(node.nodeId),
})
