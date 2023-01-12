import {
	type BaseNode,
	NodeClass,
	type NodeId,
	type OPCUAServer,
	type UAReference,
	type UARootFolder,
	type UAVariable,
} from 'node-opcua'
import { isOrganziedBy, isVariable } from 'utils'

const retrieveRoot = <T>(
	server: OPCUAServer,
	cb: (root: UARootFolder) => Array<T>,
): Array<T> => {
	const root = server.engine.addressSpace?.rootFolder

	return root === undefined ? [] : cb(root)
}

export const getAllNodeIds = (
	server: OPCUAServer,
): Array<NodeId> =>
	retrieveRoot(server, root =>
		internalRec(root, n => n.nodeId),
	)

export const getAllVariables = (
	server: OPCUAServer,
): Array<UAVariable> =>
	retrieveRoot(server, root =>
		internalRec(root, n => n),
	).filter(
		(node): node is UAVariable =>
			node.nodeClass === NodeClass.Variable,
	)

const internalRec = <T>(
	node: BaseNode,
	cb: (node: BaseNode) => T,
): Array<T> =>
	node
		.allReferences()
		.filter(
			ref =>
				ref.isForward &&
				isOrganziedBy(ref.referenceType),
		)
		.filter(
			(
				ref,
			): ref is UAReference & {
				node: BaseNode
			} => ref.node !== undefined,
		)
		.map(ref => ref.node)
		.flatMap(node => [
			...internalRec(node, cb),
			cb(node),
		])

export const updateNode = (
	server: OPCUAServer,
	nodeId: NodeId,
	value: unknown,
) => {
	const node =
		server.engine.addressSpace?.findNode(nodeId) ?? null

	if (node === null)
		throw new Error(`can't find node with id ${nodeId}`)

	if (!isVariable(node))
		throw new Error(
			`can't update non variable node ${nodeId}`,
		)

	node.setValueFromSource({
		value,
	})
}
