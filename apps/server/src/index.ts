import { Server } from 'server-api'

import { rand } from './rand'

void (async () => {
	const server = await Server.configureDefault()
	await server.start()

	const vars = server.getAllVariables()

	setInterval(
		() =>
			vars.map(v =>
				v.setValueFromSource({
					dataType: v.dataTypeObj.basicDataType,
					value: rand(
						v.dataTypeObj.basicDataType,
					),
				}),
			),
		100,
	)

	console.log(
		`server is now listening on ${server
			.getServer()
			.getEndpointUrl()}`,
	)
})()
