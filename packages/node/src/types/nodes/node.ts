import { LocalizedText } from '../localized-text'
import { NodeClass } from '../node-class'
import { NodeId } from '../node-id'
import { QualifiedName } from '../qualified-name'
import { References } from '../references'

// represents a single node.
// this is very similar to abstract class,
// which can not be instantiated itself.
export interface Node {
	browseName: QualifiedName
	description: LocalizedText
	displayName: Array<LocalizedText>
	nodeClass: NodeClass
	nodeId: NodeId
	references: References
	referenceTypeId: NodeId
}
