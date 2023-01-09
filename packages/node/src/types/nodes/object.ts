import { NodeId } from '../node-id'
import { Node } from './node'

// represents Object in OPCUA structure.
export interface ObjectNode extends Node {
	typeDefinition: NodeId
}
