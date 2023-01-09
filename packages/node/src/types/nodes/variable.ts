import { NodeId } from '../node-id'
import { Node } from './node'

export interface VariableNode extends Node {
	accessLevel: number
	// this field should accept null, since our robot OPC server can't support this attributes correctly.
	arrayDimensions: Array<number> | null
	dataType: NodeId
	historizing: boolean
	minimumSamplingInterval: number
	typeDefinition: NodeId
	userAccessLevel: number
	valueRank: number
}
