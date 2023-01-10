import { equal } from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { env, exit, stdout } from 'node:process'

import { config } from 'dotenv'
import {
	type Node,
	NodeClass as NodeClassString,
	type ObjectNode,
	type UaNode,
	type VariableNode,
} from 'node'
import {
	type AttributeIds,
	type ClientSession,
	type LocalizedText,
	NodeClass,
	type NodeId,
	type NodeIdLike,
	OPCUAClient,
	type Variant,
} from 'node-opcua'
import { assertStringify } from 'parser'

import {
	coerceLocalizedText,
	coerceQualifiedName,
} from './utils/coerce'
import { fromNodeId } from './utils/node-id'
import {
	type AttributeIdString,
	attributeIdStringToAttributeId,
} from './utils/opcua-attr'

// Dotenv setup
config()

// Read multiple attributes from specific node at once
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

// Asserts that for all given keys, corresponding values must always be exist in this map.
// otherwise, you can also provide a default value to be returned when there is no matching value.
class AssertReadOnlyMap<T, U> {
	constructor(private readonly map: Map<T, U>) {}

	public get(key: T, defaultValue?: U): U {
		return (
			this.map.get(key) ??
			defaultValue ??
			(() => {
				throw new Error(`key does not exist`)
			})()
		)
	}

	public has(key: T): boolean {
		return this.map.has(key)
	}
}

// Make it easy to use above class
const assertReadOnlyMapFactory = <T, U>(map: Map<T, U>) => {
	const aromap = new AssertReadOnlyMap(map)

	return (key: T, defaultValue?: U) =>
		aromap.get(key, defaultValue)
}

// Allow readAttr function to accept strings instead of direct Enum
const readAttrString = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttributeIdString>,
): Promise<Map<AttributeIds, Variant>> =>
	readAttr(
		session,
		nodeId,
		// eslint-disable-next-line unicorn/no-array-callback-reference
		attributeIds.map(attributeIdStringToAttributeId),
	)

const assertReadOnlyMapStringAdaptor =
	<T>(cb: (key: AttributeIds, defaultValue?: T) => T) =>
	(attr: AttributeIdString, defaultValue?: T) =>
		cb(
			attributeIdStringToAttributeId(attr),
			defaultValue,
		)

// Shorthand for unwrapping `.value` field inside `Variant` class
const unwrapValue =
	(
		cb: (
			key: AttributeIdString,
			defaultValue?: Variant,
		) => Variant,
	) =>
	(attr: AttributeIdString, defaultvalue?: Variant) =>
		cb(attr, defaultvalue).value as unknown

const simpleAttr = async (
	session: ClientSession,
	nodeId: NodeIdLike,
	attributeIds: Array<AttributeIdString>,
) =>
	unwrapValue(
		assertReadOnlyMapStringAdaptor(
			assertReadOnlyMapFactory(
				await readAttrString(
					session,
					nodeId,
					attributeIds,
				),
			),
		),
	)

// One-time execution interface of above codes
const getSingleAttribute = async (
	session: ClientSession,
	nodeId: NodeId,
	attributeId: AttributeIdString,
) =>
	(await simpleAttr(session, nodeId, [attributeId]))(
		attributeId,
	)

// Recursively explore node tree
// NOTE: this function returns array of Nodes, not a single Node.
const explore = async (
	session: ClientSession,
	nodeId: NodeIdLike,
): Promise<Array<Node>> => {
	const childrenArray = []

	for (const ref of (
		await session.browse(nodeId.toString())
	).references ?? []) {
		const {
			browseName,
			displayName,
			nodeId: refNodeId,
			referenceTypeId,
		} = ref

		// Early return
		if (
			![
				NodeClass.Object,
				NodeClass.Variable,
			].includes(ref.nodeClass)
		)
			continue

		// Shared contents for all NodeClass
		const shared: Omit<Node, 'nodeClass'> = {
			browseName: coerceQualifiedName(browseName),
			description: coerceLocalizedText(
				// eslint-disable-next-line no-await-in-loop
				(await getSingleAttribute(
					session,
					ref.nodeId,
					'Description',
				)) as LocalizedText,
			),
			// DisplayName must to be an Array.
			displayName: [displayName].map(
				// eslint-disable-next-line unicorn/no-array-callback-reference
				coerceLocalizedText,
			),
			nodeId: fromNodeId(refNodeId),
			// eslint-disable-next-line no-await-in-loop
			references: (await explore(
				session,
				ref.nodeId,
			)) as Array<UaNode>,
			referenceTypeId: fromNodeId(referenceTypeId),
		}

		if (ref.nodeClass === NodeClass.Object) {
			childrenArray.push({
				...shared,
				nodeClass: NodeClassString.Object,
				typeDefinition: fromNodeId(referenceTypeId),
			} as ObjectNode)
		} else if (ref.nodeClass === NodeClass.Variable) {
			// Read required attributes at once
			// eslint-disable-next-line no-await-in-loop
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

			childrenArray.push({
				...shared,
				nodeClass: NodeClassString.Variable,
				typeDefinition: fromNodeId(referenceTypeId),
				accessLevel: attr('AccessLevel') as number,
				arrayDimensions: (array =>
					array instanceof Uint32Array
						? Array.from(array)
						: array)(
					attr(
						'ArrayDimensions',
					) as Array<number> | null,
				),
				dataType: fromNodeId(
					attr('DataType') as NodeId,
				),
				historizing: attr('Historizing') as boolean,
				minimumSamplingInterval: attr(
					'MinimumSamplingInterval',
				) as number,
				userAccessLevel: attr(
					'UserAccessLevel',
				) as number,
				valueRank: attr('ValueRank') as number,
			} as VariableNode)
		}
	}

	return childrenArray
}

const printJson = async (
	nodeTree: Array<Node>,
): Promise<void> => {
	// Const stringifiedNodeTree = JSON.stringify(nodeTree)
	console.time('str')
	const stringifiedNodeTree = assertStringify(nodeTree)
	console.timeEnd('str')

	if (env.OPC_TREE_OUTPUT === undefined)
		stdout.write(stringifiedNodeTree)
	else
		await writeFile(
			env.OPC_TREE_OUTPUT,
			stringifiedNodeTree,
		)
}

// Swc does not support TLA in commonjs
void (async () => {
	try {
		const endpointUrl = env.OPC_SOURCE_SERVER_URL
		if (endpointUrl === undefined)
			throw new TypeError(
				`environment variable 'OPC_SOURCE_SERVER_URL' must to be set before run`,
			)

		const client = OPCUAClient.create({
			endpointMustExist: false,
		})
		await client.connect(endpointUrl)

		const session = await client.createSession()

		console.time('exp')
		const nodeTree = await explore(
			session,
			// This is the browseName of root folder,
			// you should start browsing from here.
			'RootFolder',
		)
		console.timeEnd('exp')

		// Close the connection before printing json
		// which is slightly heavy job.
		await session.close()
		await client.disconnect()

		await printJson(nodeTree)
	} catch (error: unknown) {
		// Print error in stderr if possible.
		if (error instanceof Error)
			console.error(error.message)

		// Abnormal exit
		exit(1)
	}
})()
