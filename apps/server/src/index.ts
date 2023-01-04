import { config } from 'dotenv'
import { Node } from 'node'
import { Namespace, NodeId, OPCUAServer } from 'node-opcua'

import { parseFile } from './parse'

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

const rec = (ns: Namespace, node: Node, pnid: string) => {
	if (!nodeExists(ns, node.nodeId)) {
		if (node.nodeClass === 'Object') {
			const nwob = ns.addObject({
				browseName: node.browseName,
				organizedBy: pnid,
				displayName: node.displayName,
				nodeId: node.nodeId,
				typeDefinition: node.typeDefinition,
			})

			console.log(
				`${node.nodeId} (${
					node.browseName
				}) => ${nwob.nodeId.toString()}`,
			)
		}
	}

	node.children.map(child => rec(ns, child, node.nodeId))
}

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()
	if (ns === undefined) throw new Error('cccccc')

	const nodeTree = await parseFile()

	const o = nodeTree.find(n => n.browseName === 'Objects')
	if (o === undefined) throw new Error('bbbbb')
	// rec(ns, o)
	const x = addressSpace?.rootFolder.objects
	if (x === undefined) throw new Error('xxxxx')
	o.children.map(ch => rec(ns, ch, o.nodeId))

	await server.start()

	console.log(
		`server is now listening on ${server.getEndpointUrl()}`,
	)
})()
