import { NodeClass } from '../node-class'
import { NodeId } from '../node-id'
import { Node } from './node'

// represents Object in OPCUA structure.
export interface ObjectNode extends Node {
	nodeClass: NodeClass.Object
	typeDefinition: NodeId
}
