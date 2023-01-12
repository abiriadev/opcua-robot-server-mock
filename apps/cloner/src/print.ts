import { writeFile } from 'node:fs/promises'
import { env, stdout } from 'node:process'

import { type StNodeTree } from 'node'
import { assertStringify } from 'parser'

import { prefix } from './env'

// Print JSON in a terminal or to a file
export const printJson = async (
	nodeTree: StNodeTree,
): Promise<void> => {
	const stringifiedNodeTree = assertStringify(nodeTree)

	// NOTE: we don't use getEnv() here
	// because it will throw an error directly
	// if it can't find the environment variable.
	const filename = env[`${prefix}_OUTPUT`]

	if (filename === undefined)
		stdout.write(stringifiedNodeTree)
	else await writeFile(filename, stringifiedNodeTree)
}
