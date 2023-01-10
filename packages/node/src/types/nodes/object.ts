import { type NodeClass } from '../node-class'
import { type NodeId } from '../node-id'
import { type Node } from './node'

// Represents Object in OPCUA structure.
export interface ObjectNode extends Node {
	nodeClass: NodeClass.Object
	typeDefinition: NodeId
}
