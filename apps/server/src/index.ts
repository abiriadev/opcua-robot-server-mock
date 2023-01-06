import { config } from 'dotenv'
import { Node, NodeClass, ObjectNode } from 'node'
import {
	Namespace,
	NodeId,
	NodeIdLike,
	OPCUAServer,
} from 'node-opcua'

import { parse } from './parse'

config()

const server = new OPCUAServer({
	port: 4840,
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
	nid: string | NodeId,
): boolean => {
	const nodeId = NodeId.resolveNodeId(nid)

	if (nodeId.namespace !== ns.index) return true

	return ns.findNode(nid) !== null
}

const rec = (
	ns: Namespace,
	node: Node,
	pnid: NodeIdLike,
) => {
	if (!nodeExists(ns, node.nodeId)) {
		if (node.nodeClass === NodeClass.Object) {
			const nwob = ns.addObject({
				browseName: node.browseName,
				organizedBy: pnid,
				displayName: node.displayName,
				nodeId: node.nodeId,
				// typeDefinition: (
				// 	node as unknown as ObjectNode
				// ).typeDefinition,
			})

			console.log(
				`${node.nodeId} (${
					node.browseName
				}) => ${nwob.nodeId.toString()}`,
			)
		}
	}

	node.references.objects.map(child =>
		// @ts-ignore
		rec(ns, child, node.nodeId),
	)
}

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()
	if (ns === undefined) throw new Error('cccccc')

	const nodeTree = await parse()

	const dev = nodeTree[0].references.objects[2]
	// .map(ch => rec(ns, ch, 'RootFolder'))
	// @ts-ignore
	rec(ns, dev, 'ObjectsFolder')

	await server.start()

	console.log(
		`server is now listening on ${server.getEndpointUrl()}`,
	)
})()
