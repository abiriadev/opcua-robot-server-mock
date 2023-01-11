import { type UaNode } from 'node'
import {
	OPCUAServer,
	type OPCUAServerOptions,
} from 'node-opcua'

import { parseDefaultTreeFile } from './parse'
import { getEnv } from './parse/env'
import { rec } from './rec'

interface ServerOptions {
	nodeTree: Array<UaNode>
	serverOptions?: OPCUAServerOptions
}

export class Server {
	static async configureDefault() {
		const nodeTree = await parseDefaultTreeFile()
		const serverOptions: OPCUAServerOptions = {
			port: Number.parseInt(
				getEnv('PORT', `${4840}`),
				10,
			),
			buildInfo: {
				buildDate: new Date(),
				productName: 'Mock OPC UA Server',
			},
		}

		return Server.initialize({
			nodeTree,
			serverOptions,
		})
	}

	static async initialize(opt: ServerOptions) {
		const server = new Server(opt)

		// Initialize inner server
		await server.#server.initialize()
		server.#registerTree()

		return server
	}

	#nodeTree: Array<UaNode>
	#server: OPCUAServer

	// NOTE: this constructor is declared as private,
	// since es2022 private method syntax does not support
	// private constructor currently.
	private constructor(opt: ServerOptions) {
		this.#nodeTree = opt.nodeTree
		this.#server = new OPCUAServer(opt.serverOptions)
	}

	async start() {
		await this.#server.start()
		return this
	}

	#registerTree() {
		const ns =
			this.#server.engine.addressSpace?.getOwnNamespace()

		// Type guard
		if (ns === undefined)
			throw new Error('namespace was not defined')

		// WARN: indexing 0 might not work properly
		rec(ns, this.#nodeTree[0], 'RootFolder')
	}

	getServer(): OPCUAServer {
		return this.#server
	}
}
