import { ObjectNode } from './nodes/object'
import { VariableNode } from './nodes/variable'

// represents all kinds of references one node can have.
export interface References {
	objects: Array<ObjectNode>
	variables: Array<VariableNode>
}
