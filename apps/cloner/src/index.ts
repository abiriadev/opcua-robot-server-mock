import { exit } from 'node:process'

import { config } from 'dotenv'
import { OPCUAClient } from 'node-opcua'

import { getEnv } from './env'
import { explore } from './explore'
import { printJson } from './print'

// Dotenv setup
config()

// Swc does not support TLA in commonjs
void (async () => {
	try {
		const endpointUrl = getEnv('SOURCE_SERVER_URL')

		const client = OPCUAClient.create({
			endpointMustExist: false,
		})
		await client.connect(endpointUrl)

		const session = await client.createSession()

		const nodeTree = await explore(
			session,
			// This is the browseName of root folder,
			// you should start browsing from here.
			// WARN: this line is hardcoded. may change in future.
			'RootFolder',
		)

		// Close the connection before printing json
		// which is slightly heavy job.
		await session.close()
		await client.disconnect()

		await printJson(nodeTree)
	} catch (error: unknown) {
		// Print error in stderr if possible.
		if (error instanceof Error) console.error(error)

		// Abnormal exit
		exit(1)
	}
})()
