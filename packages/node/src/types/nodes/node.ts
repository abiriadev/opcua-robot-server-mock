import { type LocalizedText } from '../localized-text'
import { type NodeId } from '../node-id'
import { type QualifiedName } from '../qualified-name'
import { type ObjectNode } from './object'
import { type VariableNode } from './variable'

// Represents a single node.
// this is very similar to abstract class,
// which can not be instantiated itself.
export interface Node {
	browseName: QualifiedName
	description: LocalizedText
	displayName: Array<LocalizedText>
	nodeId: NodeId
	references: Array<UaNode>
	referenceTypeId: NodeId
}

// All possible implementations of Node
export type UaNode = ObjectNode | VariableNode
