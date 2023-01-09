import { readFile } from 'fs/promises'
import { Node } from 'node'
import { assertParse } from 'parser'

// parse json file into Node tree.
// WARN: this function is not safe.
// it will throw various exceptions rather than handling them
// to make this function more simpler to use.
// this dirty behavior may change later.
export const parse = async (): Promise<Array<Node>> => {
	const file = process.env.OPC_TREE_FILE

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
