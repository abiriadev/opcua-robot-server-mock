import { type StLocalizedText } from '../localized-text'
import { type StNodeId } from '../node-id'
import { type StQualifiedName } from '../qualified-name'
import { type StObjectNode } from './object'
import { type StVariableNode } from './variable'

// Represents a single node.
// this is very similar to abstract class,
// which can not be instantiated itself.
export interface StBaseNode {
	browseName: StQualifiedName
	description: StLocalizedText
	displayName: Array<StLocalizedText>
	nodeId: StNodeId
	// NOTE: references are SNode, not SNodeId
	references: Array<StNode>
	referenceTypeId: StNodeId
}

// All possible implementations of Node
// eslint-ignore-next-line @typescript-eslint/no-redundant-type-constituents
export type StNode = StObjectNode | StVariableNode

// Define tree type
export type StNodeTree = Array<StNode>
