import { DataType, OPCUAServer } from 'node-opcua'

const server = new OPCUAServer({
	port: 4840,
	resourcePath: '/',
	buildInfo: {
		productName: 'Robot',
		buildNumber: '',
		buildDate: new Date(),
	},
})

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()

	const obj = ns?.addObject({
		organizedBy: addressSpace?.rootFolder.objects,
		browseName: 'customObject',
	})

	const variable = ns?.addVariable({
		componentOf: obj,
		browseName: 'variable',
		dataType: 'Double',
		minimumSamplingInterval: 10,
	})

	let counter = 0

	const timerId = setInterval(() => {
		++counter
		variable?.setValueFromSource({
			dataType: DataType.Double,
			value: counter,
		})
	}, 100)

	addressSpace?.registerShutdownTask(() => {
		clearInterval(timerId)
	})

	await server.start()

	console.log(`server is now listening on ${server.getEndpointUrl()}`)
})()
