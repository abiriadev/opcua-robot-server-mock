// enum with string representation
// NOTE: this might change in the future,
// to directly use string union instead.
export enum NodeClass {
	Object = 'Object',
	Variable = 'Variable',
	Method = 'Method',
	ObjectType = 'ObjectType',
	VariableType = 'VariableType',
	ReferenceType = 'ReferenceType',
	DataType = 'DataType',
	View = 'View',
}
