import { DataType } from 'node-opcua'
import { Server } from 'server-api'

import { getAllVariables } from './random-update'

const randomValueForType = (dataType: DataType) => {
	switch (dataType) {
		case DataType.String: {
			return `${Math.random()}`
		}

		case DataType.Byte: {
			return (Math.random() * 10) % 8
		}

		case DataType.Float: {
			return Math.random()
		}

		case DataType.Int16:
		case DataType.Int32:
		case DataType.Int64:
		case DataType.UInt16:
		case DataType.UInt32:
		case DataType.UInt64:
		case DataType.Double: {
			return Math.floor(Math.random() * 10_000)
		}

		case DataType.Boolean: {
			return Math.random() > 0.5
		}

		default: {
			return null
		}
	}
}

void (async () => {
	const server = await Server.configureDefault()
	await server.start()

	const vars = getAllVariables(server.getServer())

	setInterval(
		() =>
			vars.map(v => {
				const value = randomValueForType(
					v.dataTypeObj.basicDataType,
				)
				console.log(
					`${v.nodeId}(${v.dataTypeObj.browseName}) : ${value}`,
				)
				v.setValueFromSource({
					dataType: v.dataTypeObj.basicDataType,
					value,
				})
			}),
		100,
	)

	console.log(
		`server is now listening on ${server
			.getServer()
			.getEndpointUrl()}`,
	)
})()
