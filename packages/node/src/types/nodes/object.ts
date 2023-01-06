import { NodeId } from '../node-id'

// represents Object in OPCUA structure.
export interface ObjectNode extends Node {
	typeDefinition: NodeId
}
