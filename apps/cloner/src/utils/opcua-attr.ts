import { AttributeIds } from 'node-opcua'

// WARN: this code may be moved into separate workspace.
export type AttributeIdString =
	| 'NodeId'
	| 'NodeClass'
	| 'BrowseName'
	| 'DisplayName'
	| 'Description'
	| 'WriteMask'
	| 'UserWriteMask'
	| 'IsAbstract'
	| 'Symmetric'
	| 'InverseName'
	| 'ContainsNoLoops'
	| 'EventNotifier'
	| 'Value'
	| 'DataType'
	| 'ValueRank'
	| 'ArrayDimensions'
	| 'AccessLevel'
	| 'UserAccessLevel'
	| 'MinimumSamplingInterval'
	| 'Historizing'
	| 'Executable'
	| 'UserExecutable'
	| 'DataTypeDefinition'
	| 'RolePermissions'
	| 'UserRolePermissions'
	| 'AccessRestrictions'
	| 'AccessLevelEx'
	| 'INVALID'

// 1:1 mapping from OPCUA's AttributeIds to AttributeIdString.
// WARN: this code may be moved into separate workspace.
export const attributeIdStringToAttributeId = (
	attr: AttributeIdString,
) => {
	switch (attr) {
		case 'NodeId':
			return AttributeIds.NodeId
		case 'NodeClass':
			return AttributeIds.NodeClass
		case 'BrowseName':
			return AttributeIds.BrowseName
		case 'DisplayName':
			return AttributeIds.DisplayName
		case 'Description':
			return AttributeIds.Description
		case 'WriteMask':
			return AttributeIds.WriteMask
		case 'UserWriteMask':
			return AttributeIds.UserWriteMask
		case 'IsAbstract':
			return AttributeIds.IsAbstract
		case 'Symmetric':
			return AttributeIds.Symmetric
		case 'InverseName':
			return AttributeIds.InverseName
		case 'ContainsNoLoops':
			return AttributeIds.ContainsNoLoops
		case 'EventNotifier':
			return AttributeIds.EventNotifier
		case 'Value':
			return AttributeIds.Value
		case 'DataType':
			return AttributeIds.DataType
		case 'ValueRank':
			return AttributeIds.ValueRank
		case 'ArrayDimensions':
			return AttributeIds.ArrayDimensions
		case 'AccessLevel':
			return AttributeIds.AccessLevel
		case 'UserAccessLevel':
			return AttributeIds.UserAccessLevel
		case 'MinimumSamplingInterval':
			return AttributeIds.MinimumSamplingInterval
		case 'Historizing':
			return AttributeIds.Historizing
		case 'Executable':
			return AttributeIds.Executable
		case 'UserExecutable':
			return AttributeIds.UserExecutable
		case 'DataTypeDefinition':
			return AttributeIds.DataTypeDefinition
		case 'RolePermissions':
			return AttributeIds.RolePermissions
		case 'UserRolePermissions':
			return AttributeIds.UserRolePermissions
		case 'AccessRestrictions':
			return AttributeIds.AccessRestrictions
		case 'AccessLevelEx':
			return AttributeIds.AccessLevelEx
		case 'INVALID':
			return AttributeIds.INVALID
		default:
			throw new TypeError(`unreachable!`)
	}
}
