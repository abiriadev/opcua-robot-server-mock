import { Buffer } from 'node:buffer'

import { faker } from '@faker-js/faker'

import { DataType, NodeId } from 'node-opcua'

export const rand = (dataType: DataType) => {
	switch (dataType) {
		case DataType.Boolean: {
			return faker.datatype.boolean()
		}

		case DataType.SByte: {
			return faker.datatype.number({
				min: -0x80,
				max: 0x7f,
			})
		}

		case DataType.Byte: {
			return faker.datatype.number({
				min: 0x00,
				max: 0xff,
			})
		}

		case DataType.Int16: {
			return faker.datatype.number({
				min: -0x80_00,
				max: 0x7f_ff,
			})
		}

		case DataType.UInt16: {
			return faker.datatype.number({
				min: 0x00_00,
				max: 0xff_ff,
			})
		}

		case DataType.Int32: {
			return faker.datatype.number({
				min: -0x80_00_00_00,
				max: 0x7f_ff_ff_ff,
			})
		}

		case DataType.UInt32: {
			return faker.datatype.number({
				min: 0x00_00_00_00,
				max: 0xff_ff_ff_ff,
			})
		}

		case DataType.Int64: {
			return faker.datatype.bigInt({
				min: 0x80_00_00_00_00_00_00_00n,
				max: 0x7f_ff_ff_ff_ff_ff_ff_ffn,
			})
		}

		case DataType.UInt64: {
			return faker.datatype.bigInt({
				min: 0x00_00_00_00_00_00_00_00n,
				max: 0xff_ff_ff_ff_ff_ff_ff_ffn,
			})
		}

		case DataType.Float:
		case DataType.Double: {
			return faker.datatype.float({
				min: -3.4 * 10 ** 38,
				max: 3.4 * 10 ** 38,
			})
		}

		case DataType.String: {
			return faker.lorem.word(2)
		}

		case DataType.DateTime: {
			return new Date()
		}

		case DataType.Guid: {
			return faker.datatype.uuid()
		}

		case DataType.ByteString: {
			return Buffer.from(faker.random.words(2))
		}

		case DataType.NodeId: {
			return NodeId.nullNodeId
		}

		// Omitted case DataType.Null:
		default: {
			return null
		}
	}
}
