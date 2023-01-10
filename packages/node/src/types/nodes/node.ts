import { LocalizedText } from '../localized-text'
import { NodeId } from '../node-id'
import { QualifiedName } from '../qualified-name'
import { ObjectNode } from './object'
import { VariableNode } from './variable'

// represents a single node.
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

// all possible implementations of Node
export type UaNode = ObjectNode | VariableNode
