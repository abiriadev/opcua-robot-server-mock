import { createAssertParse } from 'typia'
import { Node } from './node'

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const readRaw = async () =>
	(
		await readFile(join(__dirname, '..', 'data', 'tree-filtered.json'))
	).toString()

export const parse = createAssertParse<Node>()
export const readAndParse = async () => parse(await readRaw())

readAndParse().then(_ =>
	console.dir(_, {
		depth: null,
	}),
)
