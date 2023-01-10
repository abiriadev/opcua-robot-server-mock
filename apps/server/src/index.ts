import { config } from 'dotenv'
import {
	NodeClass,
	type NodeId,
	NodeIdType,
	type UaNode,
} from 'node'
import {
	DataType,
	type Namespace,
	type NodeIdLike,
	OPCUAServer,
	NodeId as OpcNodeId,
	NodeIdType as OpcNodeIdType,
} from 'node-opcua'

import { parse } from './parse'

config()

const serverPort = 14_840

const server = new OPCUAServer({
	port: serverPort,
	resourcePath: '/',
	buildInfo: {
		productName: 'Robot',
		buildNumber: '',
		buildDate: new Date(),
	},
})

// Check whether the given node id exists in current namespace.
// NOTE: if namespace does not match, it will return true.
const nodeExists = (
	ns: Namespace,
	nid: string | OpcNodeId,
): boolean => {
	const nodeId = OpcNodeId.resolveNodeId(nid)

	if (nodeId.namespace !== ns.index) return true

	return ns.findNode(nid) !== null
}

// Convert NodeId to OpcNodeId
const toNodeId = (nodeId: NodeId): OpcNodeId =>
	new OpcNodeId(
		nodeId.identifierType === NodeIdType.NUMERIC
			? OpcNodeIdType.NUMERIC
			: OpcNodeIdType.STRING,
		nodeId.value,
		nodeId.namespace,
	)

const getDefault = (dataType: DataType): unknown => {
	switch (dataType) {
		case DataType.Byte: {
			return null
		}

		case DataType.String: {
			return 'hello'
		}

		case DataType.UInt16:
		case DataType.UInt32:
		case DataType.UInt64: {
			return 123
		}

		default: {
			return null
		}
	}
}

const rec = (
	ns: Namespace,
	node: UaNode,
	pnid: NodeIdLike,
) => {
	const nodeId = toNodeId(node.nodeId)

	if (!nodeExists(ns, nodeId)) {
		const shared = {
			browseName: node.browseName,
			description: node.description,
			displayName: node.displayName,
			nodeId,
		}

		if (node.nodeClass === NodeClass.Object) {
			ns.addObject({
				...shared,
				organizedBy: pnid,
				typeDefinition: toNodeId(
					node.typeDefinition,
				),
			})
		} else if (node.nodeClass === NodeClass.Variable) {
			ns.addVariable({
				...shared,
				organizedBy: pnid,
				accessLevel: node.accessLevel,
				arrayDimensions: node.arrayDimensions,
				dataType: toNodeId(node.dataType),
				historizing: node.historizing,
				minimumSamplingInterval:
					node.minimumSamplingInterval,
				typeDefinition: toNodeId(
					node.typeDefinition,
				),
				userAccessLevel: node.userAccessLevel,
				// eslint-disable-next-line unicorn/no-unreadable-iife
				value: (dt => ({
					dataType: dt,
					value: getDefault(dt),
				}))(
					(x => {
						if (x === null)
							throw new Error(
								`${toNodeId(
									node.dataType,
								).toString()} must to be exist`,
							)
						else return x
					})(
						ns.addressSpace.findDataType(
							toNodeId(node.dataType),
						),
					).basicDataType,
				),
				valueRank: node.valueRank,
			})
		}
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	node.references.forEach(child => {
		rec(ns, child, nodeId)
	})
}

void (async () => {
	await server.initialize()

	const { addressSpace } = server.engine
	const ns = addressSpace?.getOwnNamespace()
	if (ns === undefined)
		throw new Error('namespace was defined')

	const nodeTree = await parse()

	rec(ns, nodeTree[0], 'RootFolder')

	await server.start()

	console.log(
		`server is now listening on ${server.getEndpointUrl()}`,
	)
})()
