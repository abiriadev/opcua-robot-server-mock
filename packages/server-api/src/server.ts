import { type StNodeTree } from 'node'
import {
	NodeIdLike,
	OPCUAServer,
	type OPCUAServerOptions,
	UARootFolder,
} from 'node-opcua'
import {
	getAllNodeIds,
	getAllVariableIds,
	getAllVariables,
	updateVariable,
} from 'utils'

import { getEnv } from './env'
import { parseDefaultTreeFile } from './parse'
import { registerTree } from './register'

interface ServerOptions {
	nodeTree: StNodeTree
	serverOptions: OPCUAServerOptions
}

// The main server class that end user will interact with.
// you can not initialize this class directly,
// instead you should use initialize() or configureDefault() static methods.
export class Server {
	// Configures all the server options to best default.
	// WARN: this function might cause side effects,
	// since it will call dotenv internally to read configs.
	// if you want to avoid side effects, consider using initialize()
	// static method instead.
	static async configureDefault() {
		const nodeTree = await parseDefaultTreeFile()
		const serverOptions: OPCUAServerOptions = {
			port: Number.parseInt(
				// The default OPC UA port
				getEnv('PORT', `${4840}`),
				10,
			),
			buildInfo: {
				buildDate: new Date(),
				productName: 'Mock OPC UA Server',
				// TODO: show version information of this module
				// as build number or software version etc.
			},
		}

		// Call initialize() method with above config
		return Server.initialize({
			nodeTree,
			serverOptions,
		})
	}

	// This static method will initialize server with given configs.
	// if you are not sure what config best suits you,
	// consider using configureDefault() static method.
	static async initialize({
		nodeTree,
		serverOptions,
	}: ServerOptions) {
		const server = new Server(serverOptions)

		// Initialize inner server
		await server.#server.initialize()

		// NOTE: it will register node tree at this time.
		// there is no manual registration process.
		server.#registerTree(nodeTree)

		// Return created instance,
		// so that you can call start() method directly.
		return server
	}

	// The internal OPCUA server object
	#server: OPCUAServer

	// NOTE: this constructor is declared as private,
	// since es2022 private method syntax does not support
	// private constructor currently.
	private constructor(opt: OPCUAServerOptions) {
		this.#server = new OPCUAServer(opt)
	}

	// Register node tree recursively.
	// NOTE: this is private method and
	// was intended to be called only at once.
	#registerTree(nodeTree: StNodeTree) {
		const ns =
			this.#server.engine.addressSpace?.getOwnNamespace()

		// Type guard
		if (ns === undefined)
			throw new Error('namespace was not defined')

		// WARN: indexing 0 might not work properly
		registerTree(ns, nodeTree[0], 'RootFolder')
	}

	// get addressSpace from inner server.
	// NOTE: it will throw error if addressSpace does not exist
	#getAddressSpace() {
		const addr = this.#server.engine.addressSpace

		if (addr === null)
			throw new Error(`AddressSpace does not exist`)
		return addr
	}

	// retrieve RootFolder from address space.
	#getRootFolder() {
		return this.#getAddressSpace().rootFolder
	}

	// Start the actual server, bind it to port etc.
	// you should call this function after creating an instance.
	async start() {
		await this.#server.start()
		return this
	}

	// stop the inner server,
	// useful when you are trying to gracefully shut down a server.
	async stop() {
		await this.#server.shutdown()
	}

	// Server getter
	getServer() {
		return this.#server
	}

	// return all node ids in string
	getAllNodeIds() {
		return getAllNodeIds(this.#getRootFolder()).map(
			nodeId => nodeId.toString(),
		)
	}

	// return array of all variable nodes
	getAllVariables() {
		return getAllVariables(this.#getRootFolder())
	}

	// return all variable node ids
	// in string type
	getAllVariableIds() {
		return getAllVariableIds(this.#getRootFolder()).map(
			nodeId => nodeId.toString(),
		)
	}

	// manually assign variable node a value.
	set(nodeId: NodeIdLike, value: unknown) {
		updateVariable(
			this.#getAddressSpace(),
			nodeId,
			value,
		)
	}
}
