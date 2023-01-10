import { readFile } from 'node:fs/promises'
import { env } from 'node:process'

import { type UaNode } from 'node'
import { assertParse } from 'parser'

// Parse json file into Node tree.
// WARN: this function is not safe.
// it will throw various exceptions rather than handling them
// to make this function more simpler to use.
// this dirty behavior may change later.
export const parse = async (): Promise<Array<UaNode>> => {
	const file = env.OPC_TREE_FILE

	console.log(file)

	if (file === undefined)
		throw new TypeError(
			`environment variable 'OPC_TREE_FILE' must to be set before run`,
		)

	const result = assertParse(
		(await readFile(file)).toString(),
	)

	if (result === null)
		throw new Error(
			`file ${file} does not contain valid tree json file.`,
		)

	return result
}
