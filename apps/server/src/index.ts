import { OPCUAServer } from 'node-opcua'
import { deserializeArray } from 'class-transformer'
import { readFile } from 'node:fs/promises'
import { Node } from './node'
import 'reflect-metadata'

const server = new OPCUAServer({
	port: 4840,
	resourcePath: '/',
	buildInfo: {
		productName: 'Robot',
		buildNumber: '',
		buildDate: new Date(),
	},
})

const parser = async () => {
	return deserializeArray(
		Node,
		(await readFile('../../tmp/opcua/flat.json')).toString(),
		{
			excludeExtraneousValues: true,
		},
	)
}

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()

	const arr = await parser()

	arr.map(({ browseName, displayName, nodeId, nodeClass }) => {
		if (nodeId === 'ROOT') return
		else if (nodeId === 'i=17602') return
		else if (nodeClass === 'Object') {
			ns?.addObject({
				organizedBy: addressSpace?.rootFolder.objects,
				browseName,
				displayName,
			})
		}
	})

	await server.start()

	console.log(`server is now listening on ${server.getEndpointUrl()}`)
})()
