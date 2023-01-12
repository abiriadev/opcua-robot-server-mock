import { type StNodeId } from '../node-id'
import { type StBaseNode } from './node'

// Represents variable node
export interface StVariableNode extends StBaseNode {
	nodeClass: 'Variable'
	accessLevel: number
	// This field should accept null, since our robot OPC server can't support this attributes correctly.
	arrayDimensions: Array<number> | null
	dataType: StNodeId
	historizing: boolean
	minimumSamplingInterval: number
	typeDefinition: StNodeId
	userAccessLevel: number
	valueRank: number
}
