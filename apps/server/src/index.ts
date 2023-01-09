import { config } from 'dotenv'
import {
	Node,
	NodeClass,
	NodeId,
	NodeIdType,
	ObjectNode,
	UaNode,
} from 'node'
import {
	Namespace,
	NodeIdLike,
	OPCUAServer,
	NodeId as OpcNodeId,
	NodeIdType as OpcNodeIdType,
} from 'node-opcua'

import { parse } from './parse'

config()

const SERVER_PORT = 14840

const server = new OPCUAServer({
	port: SERVER_PORT,
	resourcePath: '/',
	buildInfo: {
		productName: 'Robot',
		buildNumber: '',
		buildDate: new Date(),
	},
})

// check whether the given node id exists in current namespace.
// NOTE: if namespace does not match, it will return true.
const nodeExists = (
	ns: Namespace,
	nid: string | OpcNodeId,
): boolean => {
	const nodeId = OpcNodeId.resolveNodeId(nid)

	if (nodeId.namespace !== ns.index) return true

	return ns.findNode(nid) !== null
}

const toNodeId = (nodeId: NodeId): OpcNodeId =>
	new OpcNodeId(
		nodeId.identifierType === NodeIdType.NUMERIC
			? OpcNodeIdType.NUMERIC
			: OpcNodeIdType.STRING,
		nodeId.value,
		nodeId.namespace,
	)

const rec = (
	ns: Namespace,
	node: UaNode,
	pnid: NodeIdLike,
) => {
	const nodeId = toNodeId(node.nodeId)

	if (!nodeExists(ns, nodeId)) {
		if (node.nodeClass === NodeClass.Object) {
			const nwob = ns.addObject({
				browseName: node.browseName,
				organizedBy: pnid,
				displayName: node.displayName,
				nodeId,
				// typeDefinition: (
				// 	node as unknown as ObjectNode
				// ).typeDefinition,
			})

			console.log(
				`${nodeId} (${
					node.browseName
				}) => ${nwob.nodeId.toString()}`,
			)
		}
	}

	node.references.map(child => rec(ns, child, nodeId))
}

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()
	if (ns === undefined) throw new Error('cccccc')

	const nodeTree = await parse()

	// .map(ch => rec(ns, ch, 'RootFolder'))
	rec(ns, nodeTree[0], 'RootFolder')

	await server.start()

	console.log(
		`server is now listening on ${server.getEndpointUrl()}`,
	)
})()
