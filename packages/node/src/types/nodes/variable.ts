import { type NodeClass } from '../node-class'
import { type NodeId } from '../node-id'
import { type Node } from './node'

export interface VariableNode extends Node {
	nodeClass: NodeClass.Variable
	accessLevel: number
	// This field should accept null, since our robot OPC server can't support this attributes correctly.
	arrayDimensions: Array<number> | null
	dataType: NodeId
	historizing: boolean
	minimumSamplingInterval: number
	typeDefinition: NodeId
	userAccessLevel: number
	valueRank: number
}
