import { equal } from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { exit } from 'node:process'

import { config } from 'dotenv'
// import { Node } from 'node'
import {
	AttributeIds,
	type ClientSession,
	LocalizedText,
	NodeClass,
	NodeId,
	NodeIdLike,
	OPCUAClient,
	Variant,
} from 'node-opcua'

// import { assertStringify } from 'parser'
import {
	Node,
	NodeClass as NodeClassString,
	References,
	VariableNode,
	coerceLocalizedText,
	coerceQualifiedName,
} from './types/fullNode'
import { ObjectNode } from './types/fullNode'

// dotenv setup
config()

// read multiple attributes from specific node at once
const readAttr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttributeIds>,
): Promise<Map<AttributeIds, Variant>> => {
	const attributes = await session.read(
		attributeIds.map(attributeId => ({
			nodeId,
			attributeId,
		})),
	)

	equal(attributes.length, attributeIds.length)

	return new Map(
		attributes.map((attrValue, i) => [
			attributeIds[i],
			attrValue.value,
		]),
	)
}

// asserts that for all given keys, corresponding values must always be exist in this map.
// otherwise, you can also provide a default value to be returned when there is no matching value.
class AssertReadOnlyMap<T, U> {
	constructor(private readonly map: Map<T, U>) {}

	public get(key: T, defaultValue?: U): U {
		return (
			this.map.get(key) ??
			defaultValue ??
			(() => {
				throw new Error(`key ${key} does not exist`)
			})()
		)
	}

	public has(key: T): boolean {
		return this.map.has(key)
	}
}

// make it easy to use above class
const assertReadOnlyMapFactory = <T, U>(map: Map<T, U>) => {
	const aromap = new AssertReadOnlyMap(map)

	return (key: T, defaultValue?: U) =>
		aromap.get(key, defaultValue)
}

// WARN: this code may be moved into separate workspace.
type AttributeIdString =
	| 'NodeId'
	| 'NodeClass'
	| 'BrowseName'
	| 'DisplayName'
	| 'Description'
	| 'WriteMask'
	| 'UserWriteMask'
	| 'IsAbstract'
	| 'Symmetric'
	| 'InverseName'
	| 'ContainsNoLoops'
	| 'EventNotifier'
	| 'Value'
	| 'DataType'
	| 'ValueRank'
	| 'ArrayDimensions'
	| 'AccessLevel'
	| 'UserAccessLevel'
	| 'MinimumSamplingInterval'
	| 'Historizing'
	| 'Executable'
	| 'UserExecutable'
	| 'DataTypeDefinition'
	| 'RolePermissions'
	| 'UserRolePermissions'
	| 'AccessRestrictions'
	| 'AccessLevelEx'
	| 'INVALID'

// 1:1 mapping from OPCUA's AttributeIds to AttributeIdString.
// WARN: this code may be moved into separate workspace.
const attributeIdStringToAttributeId = (
	attr: AttributeIdString,
) => {
	switch (attr) {
		case 'NodeId':
			return AttributeIds.NodeId
		case 'NodeClass':
			return AttributeIds.NodeClass
		case 'BrowseName':
			return AttributeIds.BrowseName
		case 'DisplayName':
			return AttributeIds.DisplayName
		case 'Description':
			return AttributeIds.Description
		case 'WriteMask':
			return AttributeIds.WriteMask
		case 'UserWriteMask':
			return AttributeIds.UserWriteMask
		case 'IsAbstract':
			return AttributeIds.IsAbstract
		case 'Symmetric':
			return AttributeIds.Symmetric
		case 'InverseName':
			return AttributeIds.InverseName
		case 'ContainsNoLoops':
			return AttributeIds.ContainsNoLoops
		case 'EventNotifier':
			return AttributeIds.EventNotifier
		case 'Value':
			return AttributeIds.Value
		case 'DataType':
			return AttributeIds.DataType
		case 'ValueRank':
			return AttributeIds.ValueRank
		case 'ArrayDimensions':
			return AttributeIds.ArrayDimensions
		case 'AccessLevel':
			return AttributeIds.AccessLevel
		case 'UserAccessLevel':
			return AttributeIds.UserAccessLevel
		case 'MinimumSamplingInterval':
			return AttributeIds.MinimumSamplingInterval
		case 'Historizing':
			return AttributeIds.Historizing
		case 'Executable':
			return AttributeIds.Executable
		case 'UserExecutable':
			return AttributeIds.UserExecutable
		case 'DataTypeDefinition':
			return AttributeIds.DataTypeDefinition
		case 'RolePermissions':
			return AttributeIds.RolePermissions
		case 'UserRolePermissions':
			return AttributeIds.UserRolePermissions
		case 'AccessRestrictions':
			return AttributeIds.AccessRestrictions
		case 'AccessLevelEx':
			return AttributeIds.AccessLevelEx
		case 'INVALID':
			return AttributeIds.INVALID
		default:
			throw new TypeError(`unreachable!`)
	}
}

// allow readAttr function to accept strings instead of direct Enum
const readAttrStr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttributeIdString>,
): Promise<Map<AttributeIds, Variant>> =>
	readAttr(
		session,
		nodeId,
		attributeIds.map(attributeIdStringToAttributeId),
	)

const assertReadOnlyMapStringAdaptor =
	<T>(cb: (key: AttributeIds, defaultValue?: T) => T) =>
	(attr: AttributeIdString, defaultValue?: T) =>
		cb(
			attributeIdStringToAttributeId(attr),
			defaultValue,
		)

// shorthand for unwrapping `.value` field inside `Variant` class
const unwrapValue =
	(
		cb: (
			key: AttributeIdString,
			defaultValue?: Variant,
		) => Variant,
	) =>
	(attr: AttributeIdString, defaultValue?: Variant) =>
		cb(attr, defaultValue).value

const simpleAttr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttributeIdString>,
) =>
	unwrapValue(
		assertReadOnlyMapStringAdaptor(
			assertReadOnlyMapFactory(
				await readAttrStr(
					session,
					nodeId,
					attributeIds,
				),
			),
		),
	)

// one-time execution interface of above codes
const getSingleAttribute = async (
	session: ClientSession,
	nodeId: NodeId,
	attributeId: AttributeIdString,
) =>
	(await simpleAttr(session, nodeId, [attributeId]))(
		attributeId,
	)

// recursively explore node tree
// NOTE: this function returns array of Nodes, not a single Node.
const explore = async (
	session: ClientSession,
	nodeId: NodeIdLike,
): Promise<Array<Node>> => {
	let childrenArr = []

	for (const ref of (
		await session.browse(nodeId.toString())
	).references ?? []) {
		const {
			browseName,
			displayName,
			nodeId: refNodeId,
			referenceTypeId,
			typeDefinition,
		} = ref

		const children = await explore(session, ref.nodeId)

		// early return
		if (
			![
				NodeClass.Object,
				NodeClass.Variable,
			].includes(ref.nodeClass)
		)
			continue

		// shared contents for all NodeClass
		const shared: Omit<Node, 'nodeClass'> = {
			browseName: coerceQualifiedName(browseName),
			description: coerceLocalizedText(
				(await getSingleAttribute(
					session,
					ref.nodeId,
					'Description',
				)) as LocalizedText,
			),
			// displayName must to be an Array.
			displayName: [displayName].map(
				coerceLocalizedText,
			),
			nodeId: refNodeId.toString(),
			references: {
				// grouping by their nodeClass.
				objects: children.filter(
					(child): child is ObjectNode =>
						child.nodeClass ===
						NodeClassString.Object,
				),
				variables: children.filter(
					(child): child is VariableNode =>
						child.nodeClass ===
						NodeClassString.Variable,
				),
			},
			referenceTypeId: referenceTypeId.toString(),
		}

		if (ref.nodeClass === NodeClass.Object) {
			childrenArr.push({
				...shared,
				nodeClass: NodeClassString.Object,
				typeDefinition: typeDefinition.toString(),
			} as ObjectNode)
		} else if (ref.nodeClass === NodeClass.Variable) {
			// read required attributes at once
			const attr = await simpleAttr(
				session,
				ref.nodeId,
				[
					'AccessLevel',
					'Description',
					'ArrayDimensions',
					'DataType',
					'Historizing',
					'MinimumSamplingInterval',
					'DataTypeDefinition',
					'UserAccessLevel',
					'ValueRank',
				],
			)

			childrenArr.push({
				...shared,
				nodeClass: NodeClassString.Variable,
				typeDefinition: typeDefinition.toString(),
				accessLevel: attr('AccessLevel'),
				arrayDimensions: attr('ArrayDimensions'),
				dataType: attr('DataType'),
				historizing: attr('Historizing'),
				minimumSamplingInterval: attr(
					'MinimumSamplingInterval',
				),
				userAccessLevel: attr('UserAccessLevel'),
				valueRank: attr('ValueRank'),
			} as VariableNode)
		}
	}

	return childrenArr
}

const printJson = async (
	nodeTree: Array<Node>,
): Promise<void> => {
	// const stringifiedNodeTree = assertStringify(nodeTree)
	const stringifiedNodeTree = JSON.stringify(nodeTree)

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
			// this is the browseName of root folder,
			// you should start browsing from here.
			'RootFolder',
		)

		// close the connection before printing json
		// which is slightly heavy job.
		await session.close()
		await client.disconnect()

		printJson(nodeTree)
	} catch (error: unknown) {
		// print error in stderr if possible.
		if (error instanceof Error)
			console.error(error.message)

		// abnormal exit
		exit(1)
	}
})()
