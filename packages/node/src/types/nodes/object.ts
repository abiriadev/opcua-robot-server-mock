import { type StNodeId } from '../node-id'
import { type StBaseNode } from './node'

// Represents Object in OPCUA structure.
export interface StObjectNode extends StBaseNode {
	nodeClass: 'Object'
	typeDefinition: StNodeId
}
