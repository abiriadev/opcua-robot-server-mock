import { DataType, NodeId, emptyGuid } from 'node-opcua'

// return default value for each DataType
export const getDefault = (dataType: DataType) => {
	switch (dataType) {
		case DataType.Boolean: {
			return true
		}
		case DataType.SByte:
		case DataType.Byte:
		case DataType.Int16:
		case DataType.UInt16:
		case DataType.Int32:
		case DataType.UInt32:
		case DataType.Int64:
		case DataType.UInt64:
		case DataType.Float:
		case DataType.Double: {
			return 0
		}
		case DataType.String: {
			return ''
		}
		case DataType.DateTime: {
			return new Date()
		}
		case DataType.Guid: {
			return emptyGuid
		}
		case DataType.ByteString: {
			return Buffer.alloc(0)
		}
		case DataType.NodeId: {
			return NodeId.nullNodeId
		}
		case DataType.Null:
		default: {
			return null
		}
	}
}

export const getDefaultVariant = (dataType: DataType) => ({
	dataType: dataType,
	value: getDefault(dataType),
})
