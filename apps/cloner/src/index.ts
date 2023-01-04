import { writeFile } from 'node:fs/promises'
import { exit } from 'node:process'

import { config } from 'dotenv'
import { Node } from 'node'
import {
	type BrowseDescriptionLike,
	type ClientSession,
	OPCUAClient,
} from 'node-opcua'
import { assertStringify } from 'parser'

import { normalizeNode } from './types/rawNode'

// dotenv setup
config()

// recursively explore node tree
const explore = async (
	session: ClientSession,
	nid: BrowseDescriptionLike,
): Promise<Array<Node>> => {
	const nodeArr = []

	for (const p of (
		await session.browse(nid)
	)?.references?.map(ref => async () => ({
		...normalizeNode(ref.toJSON()),
		children: await explore(
			session,
			ref.nodeId.toString(),
		),
	})) ?? [])
		nodeArr.push(await p()) // eslint-disable-line no-await-in-loop

	return nodeArr
}

const printJson = async (
	nodeTree: Array<Node>,
): Promise<void> => {
	const stringifiedNodeTree = assertStringify(nodeTree)

	if (process.env.OPC_TREE_OUTPUT === undefined)
		process.stdout.write(stringifiedNodeTree)
	else
		await writeFile(
			process.env.OPC_TREE_OUTPUT,
			stringifiedNodeTree,
		)
}

// swc does not support TLA in commonjs
void (async () => {
	try {
		const endpointUrl =
			process.env.OPC_SOURCE_SERVER_URL
		if (endpointUrl === undefined)
			throw new TypeError(
				`environment variable 'OPC_SOURCE_SERVER_URL' must to be set before run`,
			)

		const client = OPCUAClient.create({
			endpointMustExist: false,
		})
		await client.connect(endpointUrl)

		const session = await client.createSession()

		const nodeTree = await explore(
			session,
			'RootFolder',
		)

		await session.close()

		await client.disconnect()

		printJson(nodeTree)
	} catch (error: unknown) {
		if (error instanceof Error)
			console.error(error.message)

		exit(0)
	}
})()
